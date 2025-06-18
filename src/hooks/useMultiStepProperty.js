import { useState, useCallback, useEffect } from "react";
import { api } from "../services/api";
import { FORM_TYPES } from "../app/admin/properties/constants";

/**
 * Hook para manejar la creación de propiedades en múltiples pasos
 */
export const useMultiStepProperty = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [prototypeId, setPrototypeId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar prototypeId desde localStorage al inicializar
  useEffect(() => {
    const savedPrototypeId = localStorage.getItem("creatingPropertyId");
    if (savedPrototypeId) {
      setPrototypeId(savedPrototypeId);
      // Si hay un prototypeId guardado, probablemente estamos en un paso posterior
      const savedStep = localStorage.getItem("creatingPropertyStep");
      if (savedStep) {
        setCurrentStep(parseInt(savedStep));
      }
    }
  }, []);

  // Guardar prototypeId en localStorage
  const savePrototypeId = useCallback((id) => {
    setPrototypeId(id);
    localStorage.setItem("creatingPropertyId", id);
  }, []);

  // Guardar paso actual en localStorage
  const saveCurrentStep = useCallback((step) => {
    setCurrentStep(step);
    localStorage.setItem("creatingPropertyStep", step.toString());
  }, []);

  // Limpiar datos del proceso de creación
  const clearCreationData = useCallback(() => {
    setPrototypeId(null);
    setCurrentStep(1);
    localStorage.removeItem("creatingPropertyId");
    localStorage.removeItem("creatingPropertyStep");
    localStorage.removeItem("creatingPropertyType");
  }, []);

  // Inicializar nueva creación (resetear al paso 1)
  const initializeNewCreation = useCallback(() => {
    setPrototypeId(null);
    setCurrentStep(1);
    setError(null);
    localStorage.removeItem("creatingPropertyId");
    localStorage.removeItem("creatingPropertyStep");
    localStorage.removeItem("creatingPropertyType");
  }, []);

  // Paso 1: Crear propiedad básica
  const createBasicProperty = useCallback(
    async (formData, formType) => {
      try {
        setLoading(true);
        setError(null);

        // Guardar el tipo de formulario para recordarlo en pasos posteriores
        localStorage.setItem("creatingPropertyType", formType);

        let response;
        if (
          formType === FORM_TYPES.PROPERTY_MINKAASA_UNPUBLISHED ||
          formType === FORM_TYPES.PROPERTY_MINKAASA_PUBLISHED
        ) {
          response = await api.createMinkaasaPropertyBasic(formData);
        } else {
          response = await api.createPropertyBasic(formData);
        }

        if (response?.data?.prototypeId) {
          savePrototypeId(response.data.prototypeId);
          saveCurrentStep(2); // Avanzar al siguiente paso
          return {
            success: true,
            prototypeId: response.data.prototypeId,
            data: response.data,
          };
        } else {
          console.log("No se recibió prototypeId en la respuesta");
        }
      } catch (error) {
        console.error("Error creating basic property:", error);
        setError(error.message || "Error al crear la propiedad básica");
        return { success: false, error: error.message };
      } finally {
        setLoading(false);
      }
    },
    [savePrototypeId, saveCurrentStep]
  );

  // Paso 2: Agregar descripciones
  const addDescriptions = useCallback(
    async (descriptions) => {
      try {
        setLoading(true);
        setError(null);

        if (!prototypeId) {
          console.log(
            "No hay prototypeId disponible para agregar descripciones"
          );
        }

        if (!descriptions || descriptions.length === 0) {
          console.log("Debe agregar al menos una descripción");
        }

        const response = await api.addPropertyDescriptions(
          prototypeId,
          descriptions
        );

        if (response?.descriptionsAdded >= 0) {
          saveCurrentStep(3); // Avanzar al paso 3
          return {
            success: true,
            descriptionsAdded: response.descriptionsAdded,
            message: response.message,
          };
        } else {
          console.log("Error al agregar descripciones");
        }
      } catch (error) {
        console.error("Error adding descriptions:", error);
        setError(error.message || "Error al agregar las descripciones");
        return { success: false, error: error.message };
      } finally {
        setLoading(false);
      }
    },
    [prototypeId, saveCurrentStep]
  );

  // Paso 3: Completar proceso de creación
  const addImages = useCallback(
    async (mainImage, secondaryImages, onProgress) => {
      try {
        setLoading(true);
        setError(null);

        if (!prototypeId) {
          console.log(
            "No hay prototypeId disponible para completar el proceso"
          );
        }

        // El componente Step3Images ahora maneja la subida individual de imágenes
        // Este hook solo completa el proceso de creación

        // Proceso completo, limpiar datos
        clearCreationData();
        return {
          success: true,
          message: "Propiedad creada exitosamente",
          completed: true,
        };
      } catch (error) {
        console.error("Error completing property creation:", error);
        setError(
          error.message || "Error al completar la creación de la propiedad"
        );
        return { success: false, error: error.message };
      } finally {
        setLoading(false);
      }
    },
    [prototypeId, clearCreationData]
  );

  // Ir al siguiente paso
  const nextStep = useCallback(() => {
    const newStep = Math.min(currentStep + 1, 3);
    saveCurrentStep(newStep);
  }, [currentStep, saveCurrentStep]);

  // Ir al paso anterior
  const previousStep = useCallback(() => {
    const newStep = Math.max(currentStep - 1, 1);
    saveCurrentStep(newStep);
  }, [currentStep, saveCurrentStep]);

  // Ir a un paso específico
  const goToStep = useCallback(
    (step) => {
      if (step >= 1 && step <= 3) {
        saveCurrentStep(step);
      }
    },
    [saveCurrentStep]
  );

  // Verificar si estamos en proceso de creación multi-paso
  const isInCreationProcess = useCallback(() => {
    return !!prototypeId && currentStep > 1;
  }, [prototypeId, currentStep]);

  // Obtener el tipo de formulario guardado
  const getSavedFormType = useCallback(() => {
    return localStorage.getItem("creatingPropertyType");
  }, []);

  return {
    currentStep,
    prototypeId,
    loading,
    error,
    setError,
    createBasicProperty,
    addDescriptions,
    addImages,
    nextStep,
    previousStep,
    goToStep,
    clearCreationData,
    initializeNewCreation,
    isInCreationProcess,
    getSavedFormType,
  };
};
