import { useState, useCallback, useEffect } from "react";
import { api } from "../services/api";
import { FORM_TYPES } from "../app/admin/properties/constants";

/**
 * Hook para manejar la edición de propiedades en múltiples pasos
 */
export const useMultiStepPropertyEdit = (propertyId, formType) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Paso 1: Actualizar datos básicos de la propiedad
  const updateBasicProperty = useCallback(
    async (formData) => {
      try {
        setLoading(true);
        setError(null);

        console.log("🔍 useMultiStepPropertyEdit - updateBasicProperty:", {
          propertyId,
          formData,
          formType,
        });

        const isMinkaasa =
          formType === FORM_TYPES.PROPERTY_MINKAASA_UNPUBLISHED ||
          formType === FORM_TYPES.PROPERTY_MINKAASA_PUBLISHED;

        // Helper para crear objeto JSON del primer paso (básico) - similar al de creación
        const createBasicPropertyData = (formData, isMinkaasa = false) => {
          console.log(
            "🔍 createBasicPropertyData - formData recibido:",
            formData
          );
          console.log("🔍 createBasicPropertyData - isMinkaasa:", isMinkaasa);

          const basicData = {};

          // Campos básicos de propiedad (todos los campos esenciales)
          const basicFields = [
            "prototypeName",
            "price",
            "bedroom",
            "bathroom",
            "halfBathroom",
            "parking",
            "size",
            "url",
            "mapLocation",
          ];

          basicFields.forEach((field) => {
            const value = formData[field];
            console.log(`🔍 Campo ${field}:`, value, typeof value);
            if (value !== null && value !== undefined && value !== "") {
              // Convertir números correctamente
              if (
                [
                  "price",
                  "bedroom",
                  "bathroom",
                  "halfBathroom",
                  "parking",
                  "size",
                ].includes(field)
              ) {
                basicData[field] = value === "" ? null : Number(value);
              } else {
                basicData[field] = value;
              }
              console.log(`✅ Agregado ${field}:`, basicData[field]);
            } else {
              console.log(`❌ Omitido ${field}:`, value);
            }
          });

          // Mapear propertyTypeId a nameTypeId para la API
          if (formData.propertyTypeId) {
            basicData.nameTypeId = Number(formData.propertyTypeId);
            console.log("✅ Agregado nameTypeId:", basicData.nameTypeId);
          } else {
            console.log("❌ Omitido nameTypeId:", formData.propertyTypeId);
          }

          // Para propiedades normales, agregar developmentId
          if (!isMinkaasa && formData.developmentId) {
            basicData.developmentId = Number(formData.developmentId);
            console.log("✅ Agregado developmentId:", basicData.developmentId);
          } else {
            console.log(
              "❌ Omitido developmentId:",
              formData.developmentId,
              "isMinkaasa:",
              isMinkaasa
            );
          }

          // Para propiedades Minkaasa, agregar campos de ubicación directamente en el body
          if (isMinkaasa) {
            // Campos de ubicación en el body principal
            basicData.condominium = formData.condominium || "";
            basicData.street = formData.street || "";
            basicData.exteriorNumber = formData.exteriorNumber || "";
            basicData.interiorNumber = formData.interiorNumber || "";
            basicData.suburb = formData.suburb || "";
            basicData.city = formData.city || "";
            basicData.state = formData.state || "";
            basicData.zipCode = formData.zipCode ? Number(formData.zipCode) : null;

            // externalAgreement solo con datos de contacto
            const externalAgreement = {
              name: formData.name || "",
              lastNameP: formData.lastNameP || "",
              lastNameM: formData.lastNameM || "",
              mainEmail: formData.mainEmail || "",
              mainPhone: formData.mainPhone || "",
              agent: formData.agent || "",
              commission: formData.commission ? Number(formData.commission) : 0,
            };
            basicData.externalAgreement = externalAgreement;
            console.log("✅ Agregado externalAgreement:", externalAgreement);
          }

          console.log("📤 Objeto JSON final:", basicData);
          return basicData;
        };

        const basicData = createBasicPropertyData(formData, isMinkaasa);
        const response = await api.updatePropertyBasic(propertyId, basicData);

        if (response) {
          console.log("Paso 1 completado, datos básicos actualizados");
          return {
            success: true,
            data: response,
          };
        } else {
          throw new Error("Error al actualizar los datos básicos");
        }
      } catch (error) {
        console.error("Error updating basic property:", error);
        setError(error.message || "Error al actualizar los datos básicos");
        return { success: false, error: error.message };
      } finally {
        setLoading(false);
      }
    },
    [propertyId, formType]
  );

  // Paso 2: Actualizar descripciones
  const updateDescriptions = useCallback(
    async (descriptions) => {
      try {
        setLoading(true);
        setError(null);

        if (!propertyId) {
          throw new Error(
            "No hay propertyId disponible para actualizar descripciones"
          );
        }

        if (!descriptions || descriptions.length === 0) {
          throw new Error("Debe agregar al menos una descripción");
        }

        const response = await api.updatePropertyDescriptions(
          propertyId,
          descriptions
        );

        if (response) {
          console.log("Paso 2 completado, descripciones actualizadas");
          return {
            success: true,
            data: response,
          };
        } else {
          throw new Error("Error al actualizar descripciones");
        }
      } catch (error) {
        console.error("Error updating descriptions:", error);
        setError(error.message || "Error al actualizar las descripciones");
        return { success: false, error: error.message };
      } finally {
        setLoading(false);
      }
    },
    [propertyId]
  );

  // Paso 3: Actualizar imágenes (usando nuevo sistema individual)
  const updateImages = useCallback(
    async (mainImage, secondaryImages, imagesToDelete = [], onProgress) => {
      try {
        setLoading(true);
        setError(null);

        if (!propertyId) {
          throw new Error(
            "No hay propertyId disponible para actualizar imágenes"
          );
        }

        // El nuevo sistema de imágenes individuales se maneja directamente en el componente Step3Images
        // Este hook ahora solo maneja la respuesta del componente

        // En modo edición, el componente Step3Images maneja todo el proceso
        // Solo necesitamos validar que se recibieron los parámetros correctos
        console.log(
          "✅ Paso 3 - El manejo de imágenes se realiza en el componente Step3Images"
        );

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
        setError(error.message || "Error al actualizar las imágenes");
        return { success: false, error: error.message };
      } finally {
        setLoading(false);
      }
    },
    [propertyId]
  );

  // Paso 4: Actualizar video
  const updateVideo = useCallback(
    async (videoData) => {
      try {
        setLoading(true);
        setError(null);

        if (!propertyId) {
          throw new Error(
            "No hay propertyId disponible para actualizar video"
          );
        }

        console.log("🔍 useMultiStepPropertyEdit - updateVideo:", {
          propertyId,
          videoData,
        });

        // El componente Step4Video maneja la subida y eliminación de videos
        // Este hook solo maneja la respuesta del componente
        
        console.log(
          "✅ Paso 4 - El manejo de video se realiza en el componente Step4Video"
        );

        return {
          success: true,
          message: "Video procesado correctamente",
          data: videoData,
        };
      } catch (error) {
        console.error("❌ Error updating video:", error);
        setError(error.message || "Error al actualizar el video");
        return { success: false, error: error.message };
      } finally {
        setLoading(false);
      }
    },
    [propertyId]
  );

  // Ir al siguiente paso
  const nextStep = useCallback(() => {
    const newStep = Math.min(currentStep + 1, 4);
    setCurrentStep(newStep);
  }, [currentStep]);

  // Ir al paso anterior
  const previousStep = useCallback(() => {
    const newStep = Math.max(currentStep - 1, 1);
    setCurrentStep(newStep);
  }, [currentStep]);

  // Ir a un paso específico
  const goToStep = useCallback((step) => {
    if (step >= 1 && step <= 4) {
      setCurrentStep(step);
    }
  }, []);

  return {
    currentStep,
    loading,
    error,
    setError,
    updateBasicProperty,
    updateDescriptions,
    updateImages,
    updateVideo,
    nextStep,
    previousStep,
    goToStep,
  };
};
