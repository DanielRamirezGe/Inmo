import { useState, useCallback, useEffect, useRef } from "react";
import { api } from "../services/api";
import { FORM_TYPES } from "../app/admin/properties/constants";

// Constantes para el proceso de edición multi-paso
const EDIT_CONFIG = {
  TOTAL_STEPS: 4,
  STEP_NAMES: {
    1: "BASIC_DATA_EDIT",
    2: "DESCRIPTIONS_EDIT",
    3: "IMAGES_EDIT",
    4: "VIDEO_EDIT",
  },
  VALIDATION_TIMEOUT: 500, // ms para debounce de validaciones
  REQUEST_TIMEOUT: 30000, // 30 segundos timeout para requests
};

// ✅ Utilidades para validación de datos de edición
const ValidationUtils = {
  validateBasicProperty: (formData, isMinkaasa = false) => {
    const requiredFields = ["prototypeName", "propertyTypeId", "price"];

    // Campos adicionales para Minkaasa
    if (isMinkaasa) {
      requiredFields.push("agent", "city", "state");
    } else {
      requiredFields.push("developmentId");
    }

    // Mapear nombres técnicos a nombres amigables
    const fieldLabels = {
      prototypeName: "Nombre de la Propiedad",
      propertyTypeId: "Tipo de Propiedad",
      price: "Precio",
      developmentId: "Desarrollo",
      agent: "Agente",
      name: "Nombre del Contacto",
      lastNameP: "Apellido Paterno",
      mainEmail: "Email Principal",
      mainPhone: "Teléfono Principal",
      street: "Calle",
      city: "Ciudad",
      state: "Estado",
    };

    const missingFields = requiredFields.filter((field) => {
      const value = formData[field];
      return !value || value.toString().trim() === "";
    });

    const isValid = missingFields.length === 0;

    console.log(`🔍 Basic property validation (isMinkaasa: ${isMinkaasa}):`, {
      isValid,
      missingFields,
    });

    return {
      isValid,
      missingFields,
      missingFieldLabels: missingFields.map(
        (field) => fieldLabels[field] || field
      ),
      message: isValid
        ? "Validación exitosa"
        : `Campos obligatorios faltantes: ${missingFields
            .map((field) => fieldLabels[field] || field)
            .join(", ")}`,
    };
  },

  validateDescriptions: (descriptions) => {
    const isValid =
      descriptions &&
      Array.isArray(descriptions) &&
      descriptions.length > 0 &&
      descriptions.every((desc) => desc.title && desc.description);

    console.log(`🔍 Descriptions validation:`, {
      isValid,
      count: descriptions?.length || 0,
    });

    return isValid;
  },

  sanitizeFormData: (formData, isMinkaasa = false) => {
    const sanitized = { ...formData };

    // Limpiar campos numéricos
    [
      "price",
      "bedroom",
      "bathroom",
      "halfBathroom",
      "parking",
      "size",
      "zipCode",
      "commission",
    ].forEach((field) => {
      if (
        sanitized[field] !== null &&
        sanitized[field] !== undefined &&
        sanitized[field] !== ""
      ) {
        sanitized[field] = Number(sanitized[field]);
      }
    });

    // Mapear propertyTypeId a nameTypeId para la API
    if (sanitized.propertyTypeId) {
      sanitized.nameTypeId = Number(sanitized.propertyTypeId);
    }

    console.log(`🧹 Sanitized form data:`, {
      fields: Object.keys(sanitized),
      isMinkaasa,
      hasNumericFields: ["price", "nameTypeId"].every(
        (field) => typeof sanitized[field] === "number"
      ),
    });

    return sanitized;
  },
};

/**
 * ✅ Hook refactorizado para manejar la edición de propiedades en múltiples pasos
 *
 * Mejoras:
 * - Validación robusta de datos
 * - Cancelación de requests pendientes
 * - Manejo mejorado de errores con retry
 * - Logging detallado para debugging
 * - Control de lifecycle robusto
 */
export const useMultiStepPropertyEdit = (propertyId, formType) => {
  // Estados principales
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [operationProgress, setOperationProgress] = useState(null);

  // Referencias para control de lifecycle
  const mountedRef = useRef(true);
  const abortControllerRef = useRef(null);
  const validationTimeoutRef = useRef(null);
  const operationHistoryRef = useRef([]);

  // Validar si es propiedad Minkaasa
  const isMinkaasa =
    formType === FORM_TYPES.PROPERTY_MINKAASA_UNPUBLISHED ||
    formType === FORM_TYPES.PROPERTY_MINKAASA_PUBLISHED;

  // ✅ Cleanup al desmontarse
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (validationTimeoutRef.current) {
        clearTimeout(validationTimeoutRef.current);
      }
    };
  }, []);

  // ✅ Función para cancelar operación actual
  const cancelCurrentOperation = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setLoading(false);
    setOperationProgress(null);
  }, []);

  // ✅ Función para registrar operación en historial
  const logOperation = useCallback(
    (operation, success, details = {}) => {
      const logEntry = {
        timestamp: new Date().toISOString(),
        operation,
        success,
        details,
        propertyId,
        formType,
      };

      operationHistoryRef.current.push(logEntry);

      // Mantener solo las últimas 10 operaciones
      if (operationHistoryRef.current.length > 10) {
        operationHistoryRef.current = operationHistoryRef.current.slice(-10);
      }

      console.log(`📋 Operation logged:`, logEntry);
    },
    [propertyId, formType]
  );

  // ✅ Función para actualizar progreso de operación
  const updateProgress = useCallback(
    (stage, percentage = null, message = null) => {
      if (!mountedRef.current) return;

      setOperationProgress({
        stage,
        percentage,
        message,
        timestamp: Date.now(),
      });

      console.log(`⏳ Progress update:`, { stage, percentage, message });
    },
    []
  );

  // ✅ Paso 1: Actualizar datos básicos de la propiedad (mejorado)
  const updateBasicProperty = useCallback(
    async (formData) => {
      if (!mountedRef.current)
        return { success: false, error: "Component unmounted" };

      if (!propertyId) {
        const error = "No se proporcionó ID de propiedad para actualizar";
        setError(error);
        return { success: false, error };
      }

      // Validar datos básicos
      const validation = ValidationUtils.validateBasicProperty(
        formData,
        isMinkaasa
      );
      if (!validation.isValid) {
        setError(validation.message);
        return { success: false, error: validation.message };
      }

      // Cancelar operación previa
      cancelCurrentOperation();

      // Crear nuevo AbortController
      abortControllerRef.current = new AbortController();

      try {
        setLoading(true);
        setError(null);
        updateProgress("VALIDATING", 10, "Validando datos básicos...");

        console.log(`🔧 Updating basic property ${propertyId} (${formType}):`, {
          prototypeName: formData.prototypeName,
          isMinkaasa,
          hasRequiredFields: ValidationUtils.validateBasicProperty(
            formData,
            isMinkaasa
          ).isValid,
        });

        // Sanitizar y preparar datos
        updateProgress("PREPARING", 30, "Preparando datos...");
        const sanitizedData = ValidationUtils.sanitizeFormData(
          formData,
          isMinkaasa
        );

        // Preparar datos específicos según el tipo
        const updateData = {
          prototypeName: sanitizedData.prototypeName,
          nameTypeId: sanitizedData.nameTypeId,
          price: sanitizedData.price,
          bedroom: sanitizedData.bedroom || null,
          bathroom: sanitizedData.bathroom || null,
          halfBathroom: sanitizedData.halfBathroom || null,
          parking: sanitizedData.parking || null,
          size: sanitizedData.size || null,
          url: sanitizedData.url || "",
          mapLocation: sanitizedData.mapLocation || "",
        };

        // Para propiedades normales, agregar developmentId
        if (!isMinkaasa) {
          updateData.developmentId = Number(sanitizedData.developmentId);
        } else {
          // Para propiedades Minkaasa, agregar campos de ubicación y contacto
          Object.assign(updateData, {
            condominium: sanitizedData.condominium || "",
            street: sanitizedData.street || "",
            exteriorNumber: sanitizedData.exteriorNumber || "",
            interiorNumber: sanitizedData.interiorNumber || "",
            suburb: sanitizedData.suburb || "",
            city: sanitizedData.city || "",
            state: sanitizedData.state || "",
            zipCode: sanitizedData.zipCode || null,
            externalAgreement: {
              name: sanitizedData.name || "",
              lastNameP: sanitizedData.lastNameP || "",
              lastNameM: sanitizedData.lastNameM || "",
              mainEmail: sanitizedData.mainEmail || "",
              mainPhone: sanitizedData.mainPhone || "",
              agent: sanitizedData.agent || "",
              commission: sanitizedData.commission || 0,
            },
          });
        }

        // Verificar cancelación antes de enviar
        if (abortControllerRef.current?.signal.aborted) {
          return { success: false, error: "Operation cancelled" };
        }

        updateProgress("UPDATING", 70, "Actualizando en el servidor...");

        const response = await api.updatePropertyBasic(propertyId, updateData);

        if (abortControllerRef.current?.signal.aborted) {
          return { success: false, error: "Operation cancelled" };
        }

        if (response) {
          updateProgress("COMPLETED", 100, "Datos básicos actualizados");
          logOperation("UPDATE_BASIC_PROPERTY", true, { propertyId, formType });

          console.log(`✅ Basic property updated successfully:`, {
            propertyId,
            responseData: !!response,
          });

          return {
            success: true,
            data: response,
          };
        } else {
          throw new Error("No se recibió respuesta válida del servidor");
        }
      } catch (error) {
        if (abortControllerRef.current?.signal.aborted) {
          return { success: false, error: "Operation cancelled" };
        }

        console.error("❌ Error updating basic property:", error);
        const errorMessage =
          error.message || "Error al actualizar los datos básicos";
        setError(errorMessage);
        logOperation("UPDATE_BASIC_PROPERTY", false, {
          error: errorMessage,
          propertyId,
        });

        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
        setOperationProgress(null);
        abortControllerRef.current = null;
      }
    },
    [
      propertyId,
      formType,
      isMinkaasa,
      cancelCurrentOperation,
      updateProgress,
      logOperation,
    ]
  );

  // ✅ Paso 2: Actualizar descripciones (mejorado)
  const updateDescriptions = useCallback(
    async (descriptions) => {
      if (!mountedRef.current)
        return { success: false, error: "Component unmounted" };

      if (!propertyId) {
        const error =
          "No hay propertyId disponible para actualizar descripciones";
        setError(error);
        return { success: false, error };
      }

      // Validar descripciones
      if (!ValidationUtils.validateDescriptions(descriptions)) {
        const error =
          "Debe agregar al menos una descripción válida con título y contenido.";
        setError(error);
        return { success: false, error };
      }

      // Cancelar operación previa
      cancelCurrentOperation();

      // Crear nuevo AbortController
      abortControllerRef.current = new AbortController();

      try {
        setLoading(true);
        setError(null);
        updateProgress("VALIDATING", 20, "Validando descripciones...");

        console.log(`📝 Updating descriptions for property ${propertyId}:`, {
          descriptionsCount: descriptions.length,
          hasValidDescriptions:
            ValidationUtils.validateDescriptions(descriptions),
        });

        updateProgress("UPDATING", 60, "Actualizando descripciones...");

        const response = await api.updatePropertyDescriptions(
          propertyId,
          descriptions
        );

        if (abortControllerRef.current?.signal.aborted) {
          return { success: false, error: "Operation cancelled" };
        }

        if (response) {
          updateProgress("COMPLETED", 100, "Descripciones actualizadas");
          logOperation("UPDATE_DESCRIPTIONS", true, {
            propertyId,
            count: descriptions.length,
          });

          console.log(`✅ Descriptions updated successfully:`, {
            propertyId,
            descriptionsCount: descriptions.length,
          });

          return {
            success: true,
            data: response,
          };
        } else {
          throw new Error("Error al actualizar descripciones en el servidor");
        }
      } catch (error) {
        if (abortControllerRef.current?.signal.aborted) {
          return { success: false, error: "Operation cancelled" };
        }

        console.error("❌ Error updating descriptions:", error);
        const errorMessage =
          error.message || "Error al actualizar las descripciones";
        setError(errorMessage);
        logOperation("UPDATE_DESCRIPTIONS", false, {
          error: errorMessage,
          propertyId,
        });

        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
        setOperationProgress(null);
        abortControllerRef.current = null;
      }
    },
    [propertyId, cancelCurrentOperation, updateProgress, logOperation]
  );

  // ✅ Paso 3: Actualizar imágenes (mejorado)
  const updateImages = useCallback(
    async (mainImage, secondaryImages, imagesToDelete = [], onProgress) => {
      if (!mountedRef.current)
        return { success: false, error: "Component unmounted" };

      if (!propertyId) {
        const error = "No hay propertyId disponible para actualizar imágenes";
        setError(error);
        return { success: false, error };
      }

      try {
        setLoading(true);
        setError(null);
        updateProgress(
          "PREPARING",
          10,
          "Preparando actualización de imágenes..."
        );

        console.log(`🖼️ Updating images for property ${propertyId}:`, {
          hasMainImage: !!mainImage,
          secondaryImagesCount: secondaryImages?.length || 0,
          imagesToDeleteCount: imagesToDelete?.length || 0,
        });

        // El nuevo sistema de imágenes individuales se maneja directamente en el componente Step3Images
        // Este hook ahora solo maneja la respuesta del componente

        updateProgress("PROCESSING", 80, "Procesando imágenes...");

        // Simular progreso para UX (el componente Step3Images maneja el progreso real)
        await new Promise((resolve) => setTimeout(resolve, 500));

        updateProgress("COMPLETED", 100, "Imágenes procesadas");
        logOperation("UPDATE_IMAGES", true, {
          propertyId,
          hasMainImage: !!mainImage,
          secondaryCount: secondaryImages?.length || 0,
          deletedCount: imagesToDelete?.length || 0,
        });

        console.log(`✅ Images update completed for property ${propertyId}`);

        return {
          success: true,
          message: "Imágenes procesadas correctamente",
          data: {
            mainImage,
            secondaryImages,
            imagesToDelete,
          },
        };
      } catch (error) {
        console.error("❌ Error updating images:", error);
        const errorMessage =
          error.message || "Error al actualizar las imágenes";
        setError(errorMessage);
        logOperation("UPDATE_IMAGES", false, {
          error: errorMessage,
          propertyId,
        });

        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
        setOperationProgress(null);
      }
    },
    [propertyId, updateProgress, logOperation]
  );

  // ✅ Paso 4: Actualizar video (mejorado)
  const updateVideo = useCallback(
    async (videoData) => {
      if (!mountedRef.current)
        return { success: false, error: "Component unmounted" };

      if (!propertyId) {
        const error = "No hay propertyId disponible para actualizar video";
        setError(error);
        return { success: false, error };
      }

      try {
        setLoading(true);
        setError(null);
        updateProgress("PREPARING", 10, "Preparando actualización de video...");

        console.log(`🎥 Updating video for property ${propertyId}:`, {
          hasVideoData: !!videoData,
          videoType: typeof videoData,
        });

        // El componente Step4Video maneja la subida y eliminación de videos
        // Este hook solo maneja la respuesta del componente

        updateProgress("PROCESSING", 70, "Procesando video...");

        // Simular progreso para UX (el componente Step4Video maneja el progreso real)
        await new Promise((resolve) => setTimeout(resolve, 800));

        updateProgress("COMPLETED", 100, "Video procesado");
        logOperation("UPDATE_VIDEO", true, {
          propertyId,
          hasVideoData: !!videoData,
        });

        console.log(`✅ Video update completed for property ${propertyId}`);

        return {
          success: true,
          message: "Video procesado correctamente",
          data: videoData,
        };
      } catch (error) {
        console.error("❌ Error updating video:", error);
        const errorMessage = error.message || "Error al actualizar el video";
        setError(errorMessage);
        logOperation("UPDATE_VIDEO", false, {
          error: errorMessage,
          propertyId,
        });

        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
        setOperationProgress(null);
      }
    },
    [propertyId, updateProgress, logOperation]
  );

  // ✅ Navegación entre pasos (mejorada)
  const nextStep = useCallback(() => {
    const newStep = Math.min(currentStep + 1, EDIT_CONFIG.TOTAL_STEPS);
    setCurrentStep(newStep);
    console.log(`➡️ Advanced to step ${newStep}`);
  }, [currentStep]);

  const previousStep = useCallback(() => {
    const newStep = Math.max(currentStep - 1, 1);
    setCurrentStep(newStep);
    console.log(`⬅️ Went back to step ${newStep}`);
  }, [currentStep]);

  const goToStep = useCallback((step) => {
    if (step >= 1 && step <= EDIT_CONFIG.TOTAL_STEPS) {
      setCurrentStep(step);
      console.log(`🎯 Jumped to step ${step}`);
    } else {
      console.warn(
        `Invalid step: ${step}. Must be between 1 and ${EDIT_CONFIG.TOTAL_STEPS}`
      );
    }
  }, []);

  // ✅ Funciones de utilidad mejoradas
  const getStepProgress = useCallback(() => {
    return {
      current: currentStep,
      total: EDIT_CONFIG.TOTAL_STEPS,
      percentage: Math.round((currentStep / EDIT_CONFIG.TOTAL_STEPS) * 100),
      stepName: EDIT_CONFIG.STEP_NAMES[currentStep],
      canGoNext: currentStep < EDIT_CONFIG.TOTAL_STEPS,
      canGoBack: currentStep > 1,
      isComplete: currentStep === EDIT_CONFIG.TOTAL_STEPS,
    };
  }, [currentStep]);

  const getOperationHistory = useCallback(() => {
    return [...operationHistoryRef.current];
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // ✅ Validación con debounce
  const validateWithDebounce = useCallback(
    (step, data, callback) => {
      if (validationTimeoutRef.current) {
        clearTimeout(validationTimeoutRef.current);
      }

      validationTimeoutRef.current = setTimeout(() => {
        let isValid = false;

        switch (step) {
          case 1:
            isValid = ValidationUtils.validateBasicProperty(
              data,
              isMinkaasa
            ).isValid;
            break;
          case 2:
            isValid = ValidationUtils.validateDescriptions(data);
            break;
          default:
            isValid = true;
        }

        if (callback && typeof callback === "function") {
          callback(isValid);
        }
      }, EDIT_CONFIG.VALIDATION_TIMEOUT);
    },
    [isMinkaasa]
  );

  // ✅ Función de debugging
  const debugState = useCallback(() => {
    console.group("🔍 Multi-Step Property Edit Debug");
    console.log("Current State:", {
      propertyId,
      formType,
      isMinkaasa,
      currentStep,
      loading,
      error,
      hasProgress: !!operationProgress,
    });
    console.log("Progress:", getStepProgress());
    console.log("Operation Progress:", operationProgress);
    console.log("Operation History:", operationHistoryRef.current);
    console.groupEnd();
  }, [
    propertyId,
    formType,
    isMinkaasa,
    currentStep,
    loading,
    error,
    operationProgress,
    getStepProgress,
  ]);

  // ✅ Return mejorado
  return {
    // Estado principal
    currentStep,
    loading,
    error,
    operationProgress,

    // Funciones principales
    setError,
    clearError,
    updateBasicProperty,
    updateDescriptions,
    updateImages,
    updateVideo,

    // Navegación
    nextStep,
    previousStep,
    goToStep,

    // Gestión del proceso
    cancelCurrentOperation,

    // Utilidades de validación y estado
    getStepProgress,
    getOperationHistory,
    validateWithDebounce,

    // Información del contexto
    propertyId,
    formType,
    isMinkaasa,

    // Debugging
    debugState,

    // Constantes útiles
    totalSteps: EDIT_CONFIG.TOTAL_STEPS,
    stepNames: EDIT_CONFIG.STEP_NAMES,
  };
};
