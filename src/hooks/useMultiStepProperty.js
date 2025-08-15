import { useState, useCallback, useEffect, useRef } from "react";
import { api } from "../services/api";
import { FORM_TYPES } from "../app/admin/properties/constants";

// Constantes para el proceso multi-paso
const MULTI_STEP_CONFIG = {
  TOTAL_STEPS: 3,
  STORAGE_KEYS: {
    PROTOTYPE_ID: "creatingPropertyId",
    CURRENT_STEP: "creatingPropertyStep",
    FORM_TYPE: "creatingPropertyType",
    FORM_DATA: "creatingPropertyData", // Nuevo: para persistir datos entre pasos
  },
  STEP_NAMES: {
    1: "BASIC_DATA",
    2: "DESCRIPTIONS",
    3: "IMAGES_AND_COMPLETE",
  },
};

// ✅ Utilidades para localStorage thread-safe
const StorageUtils = {
  setItem: (key, value) => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(
          key,
          typeof value === "string" ? value : JSON.stringify(value)
        );
      }
    } catch (error) {
      console.warn(`Failed to save to localStorage (${key}):`, error);
    }
  },

  getItem: (key, defaultValue = null) => {
    try {
      if (typeof window !== "undefined") {
        const item = localStorage.getItem(key);
        return item
          ? defaultValue !== null && typeof defaultValue === "object"
            ? JSON.parse(item)
            : item
          : defaultValue;
      }
    } catch (error) {
      console.warn(`Failed to read from localStorage (${key}):`, error);
    }
    return defaultValue;
  },

  removeItem: (key) => {
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem(key);
      }
    } catch (error) {
      console.warn(`Failed to remove from localStorage (${key}):`, error);
    }
  },

  clearAll: () => {
    Object.values(MULTI_STEP_CONFIG.STORAGE_KEYS).forEach((key) => {
      StorageUtils.removeItem(key);
    });
  },
};

/**
 * ✅ Hook refactorizado para manejar la creación de propiedades en múltiples pasos
 *
 * Mejoras:
 * - Manejo robusto de localStorage
 * - Cancelación de requests
 * - Validación de estados
 * - Recovery automático de errores
 * - Logging detallado para debugging
 */
export const useMultiStepProperty = () => {
  // Estados principales
  const [currentStep, setCurrentStep] = useState(1);
  const [prototypeId, setPrototypeId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState(null); // Para persistir datos entre pasos

  // Referencias para control de lifecycle
  const mountedRef = useRef(true);
  const abortControllerRef = useRef(null);
  const stepValidationRef = useRef(new Map());

  // ✅ Cleanup al desmontarse
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // ✅ Cargar estado desde localStorage al inicializar
  useEffect(() => {
    const loadPersistedState = () => {
      try {
        const savedPrototypeId = StorageUtils.getItem(
          MULTI_STEP_CONFIG.STORAGE_KEYS.PROTOTYPE_ID
        );
        const savedStep = StorageUtils.getItem(
          MULTI_STEP_CONFIG.STORAGE_KEYS.CURRENT_STEP,
          "1"
        );
        const savedFormData = StorageUtils.getItem(
          MULTI_STEP_CONFIG.STORAGE_KEYS.FORM_DATA,
          {}
        );

        if (savedPrototypeId) {
          setPrototypeId(savedPrototypeId);
          setCurrentStep(parseInt(savedStep, 10) || 1);
          setFormData(savedFormData);

          console.log(`🔄 Recovered multi-step state:`, {
            prototypeId: savedPrototypeId,
            step: savedStep,
            hasFormData: Object.keys(savedFormData).length > 0,
          });
        }
      } catch (error) {
        console.warn("Failed to load persisted state:", error);
        // Si hay error, limpiar localStorage corrupto
        StorageUtils.clearAll();
      }
    };

    loadPersistedState();
  }, []);

  // ✅ Función para validar el paso actual
  const validateStep = useCallback((step, data = null) => {
    const validationRules = {
      1: (data) => {
        // BASIC_DATA
        const required = ["prototypeName", "propertyTypeId", "price"];
        return required.every(
          (field) => data && data[field] && data[field].toString().trim() !== ""
        );
      },
      2: (data) => {
        // DESCRIPTIONS
        return (
          data &&
          Array.isArray(data) &&
          data.length > 0 &&
          data.every((desc) => desc.title && desc.description)
        );
      },
      3: () => true, // IMAGES - validación se hace en el componente
    };

    const isValid = validationRules[step] ? validationRules[step](data) : false;
    stepValidationRef.current.set(step, isValid);

    console.log(`🔍 Step ${step} validation:`, { isValid, data: !!data });
    return isValid;
  }, []);

  // ✅ Función mejorada para guardar estado en localStorage
  const persistState = useCallback((updates = {}) => {
    try {
      if (updates.prototypeId !== undefined) {
        StorageUtils.setItem(
          MULTI_STEP_CONFIG.STORAGE_KEYS.PROTOTYPE_ID,
          updates.prototypeId
        );
      }
      if (updates.currentStep !== undefined) {
        StorageUtils.setItem(
          MULTI_STEP_CONFIG.STORAGE_KEYS.CURRENT_STEP,
          updates.currentStep.toString()
        );
      }
      if (updates.formType !== undefined) {
        StorageUtils.setItem(
          MULTI_STEP_CONFIG.STORAGE_KEYS.FORM_TYPE,
          updates.formType
        );
      }
      if (updates.formData !== undefined) {
        StorageUtils.setItem(
          MULTI_STEP_CONFIG.STORAGE_KEYS.FORM_DATA,
          updates.formData
        );
      }

      console.log(`💾 Persisted state:`, updates);
    } catch (error) {
      console.error("Failed to persist state:", error);
      setError("Error al guardar el progreso. Por favor, inténtelo de nuevo.");
    }
  }, []);

  // ✅ Función para limpiar datos del proceso de creación
  const clearCreationData = useCallback(() => {
    setPrototypeId(null);
    setCurrentStep(1);
    setError(null);
    setFormData(null);
    stepValidationRef.current.clear();

    StorageUtils.clearAll();

    console.log("🧹 Creation data cleared");
  }, []);

  // ✅ Función para inicializar nueva creación (resetear al paso 1)
  const initializeNewCreation = useCallback(() => {
    clearCreationData();
    console.log("🚀 New creation initialized");
  }, [clearCreationData]);

  // ✅ Función para cancelar operación actual
  const cancelCurrentOperation = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setLoading(false);
  }, []);

  // ✅ Paso 1: Crear propiedad básica (mejorado)
  const createBasicProperty = useCallback(
    async (basicFormData, formType) => {
      if (!mountedRef.current)
        return { success: false, error: "Component unmounted" };

      // Validar datos del paso 1
      if (!validateStep(1, basicFormData)) {
        const error =
          "Datos básicos incompletos. Verifique todos los campos obligatorios.";
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

        console.log(`🔧 Creating basic property (${formType}):`, {
          prototypeName: basicFormData.prototypeName,
          hasRequiredFields: validateStep(1, basicFormData),
        });

        // Determinar endpoint según el tipo
        const isMinkaasa =
          formType === FORM_TYPES.PROPERTY_MINKAASA_UNPUBLISHED ||
          formType === FORM_TYPES.PROPERTY_MINKAASA_PUBLISHED;

        let response;
        if (isMinkaasa) {
          response = await api.createMinkaasaPropertyBasic(basicFormData);
        } else {
          response = await api.createPropertyBasic(basicFormData);
        }

        // Verificar si fue cancelado
        if (abortControllerRef.current?.signal.aborted) {
          return { success: false, error: "Operation cancelled" };
        }

        if (response?.data?.prototypeId) {
          const newPrototypeId = response.data.prototypeId;

          // Actualizar estados
          setPrototypeId(newPrototypeId);
          setCurrentStep(2);
          setFormData(basicFormData);

          // Persistir estado
          persistState({
            prototypeId: newPrototypeId,
            currentStep: 2,
            formType,
            formData: basicFormData,
          });

          console.log(`✅ Basic property created successfully:`, {
            prototypeId: newPrototypeId,
            nextStep: 2,
          });

          return {
            success: true,
            prototypeId: newPrototypeId,
            data: response.data,
          };
        } else {
          throw new Error(
            "No se recibió prototypeId en la respuesta del servidor"
          );
        }
      } catch (error) {
        if (abortControllerRef.current?.signal.aborted) {
          return { success: false, error: "Operation cancelled" };
        }

        console.error("❌ Error creating basic property:", error);
        const errorMessage =
          error.message || "Error al crear la propiedad básica";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
        abortControllerRef.current = null;
      }
    },
    [validateStep, cancelCurrentOperation, persistState]
  );

  // ✅ Paso 2: Agregar descripciones (mejorado)
  const addDescriptions = useCallback(
    async (descriptions) => {
      if (!mountedRef.current)
        return { success: false, error: "Component unmounted" };

      // Validar que tenemos prototypeId
      if (!prototypeId) {
        const error = "No hay prototypeId disponible. Reinicie el proceso.";
        setError(error);
        return { success: false, error };
      }

      // Validar datos del paso 2
      if (!validateStep(2, descriptions)) {
        const error = "Debe agregar al menos una descripción válida.";
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

        console.log(`📝 Adding descriptions to property ${prototypeId}:`, {
          descriptionsCount: descriptions.length,
          hasValidDescriptions: validateStep(2, descriptions),
        });

        const response = await api.addPropertyDescriptions(
          prototypeId,
          descriptions
        );

        // Verificar si fue cancelado
        if (abortControllerRef.current?.signal.aborted) {
          return { success: false, error: "Operation cancelled" };
        }

        if (response?.descriptionsAdded >= 0) {
          // Actualizar estados
          setCurrentStep(3);

          // Actualizar form data con las descripciones
          const updatedFormData = { ...formData, descriptions };
          setFormData(updatedFormData);

          // Persistir estado
          persistState({
            currentStep: 3,
            formData: updatedFormData,
          });

          console.log(`✅ Descriptions added successfully:`, {
            descriptionsAdded: response.descriptionsAdded,
            nextStep: 3,
          });

          return {
            success: true,
            descriptionsAdded: response.descriptionsAdded,
            message: response.message,
          };
        } else {
          throw new Error("Error al agregar descripciones");
        }
      } catch (error) {
        if (abortControllerRef.current?.signal.aborted) {
          return { success: false, error: "Operation cancelled" };
        }

        console.error("❌ Error adding descriptions:", error);
        const errorMessage =
          error.message || "Error al agregar las descripciones";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
        abortControllerRef.current = null;
      }
    },
    [prototypeId, formData, validateStep, cancelCurrentOperation, persistState]
  );

  // ✅ Paso 3: Completar proceso de creación (mejorado)
  const addImages = useCallback(
    async (mainImage, secondaryImages, onProgress) => {
      if (!mountedRef.current)
        return { success: false, error: "Component unmounted" };

      // Validar que tenemos prototypeId
      if (!prototypeId) {
        const error = "No hay prototypeId disponible. Reinicie el proceso.";
        setError(error);
        return { success: false, error };
      }

      try {
        setLoading(true);
        setError(null);

        console.log(`🖼️ Completing property creation ${prototypeId}:`, {
          hasMainImage: !!mainImage,
          secondaryImagesCount: secondaryImages?.length || 0,
        });

        // El componente Step3Images ahora maneja la subida individual de imágenes
        // Este hook solo completa el proceso de creación

        // Proceso completo, limpiar datos
        clearCreationData();

        console.log(`✅ Property creation completed successfully:`, {
          prototypeId,
          finalStep: 3,
        });

        return {
          success: true,
          message: "Propiedad creada exitosamente",
          completed: true,
          prototypeId,
        };
      } catch (error) {
        console.error("❌ Error completing property creation:", error);
        const errorMessage =
          error.message || "Error al completar la creación de la propiedad";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [prototypeId, clearCreationData]
  );

  // ✅ Navegación entre pasos (mejorada)
  const nextStep = useCallback(() => {
    const newStep = Math.min(currentStep + 1, MULTI_STEP_CONFIG.TOTAL_STEPS);
    setCurrentStep(newStep);
    persistState({ currentStep: newStep });
    console.log(`➡️ Advanced to step ${newStep}`);
  }, [currentStep, persistState]);

  const previousStep = useCallback(() => {
    const newStep = Math.max(currentStep - 1, 1);
    setCurrentStep(newStep);
    persistState({ currentStep: newStep });
    console.log(`⬅️ Went back to step ${newStep}`);
  }, [currentStep, persistState]);

  const goToStep = useCallback(
    (step) => {
      if (step >= 1 && step <= MULTI_STEP_CONFIG.TOTAL_STEPS) {
        setCurrentStep(step);
        persistState({ currentStep: step });
        console.log(`🎯 Jumped to step ${step}`);
      } else {
        console.warn(
          `Invalid step: ${step}. Must be between 1 and ${MULTI_STEP_CONFIG.TOTAL_STEPS}`
        );
      }
    },
    [persistState]
  );

  // ✅ Funciones de utilidad mejoradas
  const isInCreationProcess = useCallback(() => {
    return !!prototypeId && currentStep > 1;
  }, [prototypeId, currentStep]);

  const getSavedFormType = useCallback(() => {
    return StorageUtils.getItem(MULTI_STEP_CONFIG.STORAGE_KEYS.FORM_TYPE);
  }, []);

  const canAdvanceToStep = useCallback((step) => {
    // Verificar si se puede avanzar al paso solicitado
    for (let i = 1; i < step; i++) {
      if (!stepValidationRef.current.get(i)) {
        return false;
      }
    }
    return true;
  }, []);

  const getStepProgress = useCallback(() => {
    return {
      current: currentStep,
      total: MULTI_STEP_CONFIG.TOTAL_STEPS,
      percentage: Math.round(
        (currentStep / MULTI_STEP_CONFIG.TOTAL_STEPS) * 100
      ),
      stepName: MULTI_STEP_CONFIG.STEP_NAMES[currentStep],
      canGoNext: currentStep < MULTI_STEP_CONFIG.TOTAL_STEPS,
      canGoBack: currentStep > 1,
      isComplete: currentStep === MULTI_STEP_CONFIG.TOTAL_STEPS,
    };
  }, [currentStep]);

  // ✅ Función de debugging
  const debugState = useCallback(() => {
    console.group("🔍 Multi-Step Property Debug");
    console.log("Current State:", {
      currentStep,
      prototypeId,
      loading,
      error,
      hasFormData: !!formData,
      isInProcess: isInCreationProcess(),
    });
    console.log(
      "Step Validations:",
      Object.fromEntries(stepValidationRef.current)
    );
    console.log("Progress:", getStepProgress());
    console.log("LocalStorage:", {
      prototypeId: StorageUtils.getItem(
        MULTI_STEP_CONFIG.STORAGE_KEYS.PROTOTYPE_ID
      ),
      step: StorageUtils.getItem(MULTI_STEP_CONFIG.STORAGE_KEYS.CURRENT_STEP),
      formType: StorageUtils.getItem(MULTI_STEP_CONFIG.STORAGE_KEYS.FORM_TYPE),
      hasFormData: !!StorageUtils.getItem(
        MULTI_STEP_CONFIG.STORAGE_KEYS.FORM_DATA,
        {}
      ),
    });
    console.groupEnd();
  }, [
    currentStep,
    prototypeId,
    loading,
    error,
    formData,
    isInCreationProcess,
    getStepProgress,
  ]);

  // ✅ Return mejorado
  return {
    // Estado principal
    currentStep,
    prototypeId,
    loading,
    error,
    formData,

    // Funciones principales
    setError,
    createBasicProperty,
    addDescriptions,
    addImages,

    // Navegación
    nextStep,
    previousStep,
    goToStep,

    // Gestión del proceso
    clearCreationData,
    initializeNewCreation,
    cancelCurrentOperation,

    // Utilidades de validación y estado
    isInCreationProcess,
    getSavedFormType,
    canAdvanceToStep,
    getStepProgress,
    validateStep,

    // Debugging
    debugState,

    // Constantes útiles
    totalSteps: MULTI_STEP_CONFIG.TOTAL_STEPS,
    stepNames: MULTI_STEP_CONFIG.STEP_NAMES,
  };
};
