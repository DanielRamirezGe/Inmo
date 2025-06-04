import { useState, useCallback, useEffect } from 'react';
import { api } from '../services/api';
import { FORM_TYPES } from '../app/admin/properties/constants';

/**
 * Hook para manejar la edición de propiedades en múltiples pasos
 */
export const useMultiStepPropertyEdit = (propertyId, formType) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Paso 1: Actualizar datos básicos de la propiedad
  const updateBasicProperty = useCallback(async (formData) => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔍 useMultiStepPropertyEdit - updateBasicProperty:', { propertyId, formData, formType });

      const isMinkaasa = formType === FORM_TYPES.PROPERTY_MINKAASA_UNPUBLISHED || 
                        formType === FORM_TYPES.PROPERTY_MINKAASA_PUBLISHED;
      
      // Helper para crear objeto JSON del primer paso (básico) - similar al de creación
      const createBasicPropertyData = (formData, isMinkaasa = false) => {
        console.log('🔍 createBasicPropertyData - formData recibido:', formData);
        console.log('🔍 createBasicPropertyData - isMinkaasa:', isMinkaasa);
        
        const basicData = {};

        // Campos básicos de propiedad (todos los campos esenciales)
        const basicFields = [
          'prototypeName', 'price', 'bedroom', 'bathroom', 'halfBathroom', 
          'parking', 'size', 'url', 'mapLocation'
        ];
        
        basicFields.forEach(field => {
          const value = formData[field];
          console.log(`🔍 Campo ${field}:`, value, typeof value);
          if (value !== null && value !== undefined && value !== '') {
            // Convertir números correctamente
            if (['price', 'bedroom', 'bathroom', 'halfBathroom', 'parking', 'size'].includes(field)) {
              basicData[field] = value === '' ? null : Number(value);
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
          console.log('✅ Agregado nameTypeId:', basicData.nameTypeId);
        } else {
          console.log('❌ Omitido nameTypeId:', formData.propertyTypeId);
        }

        // Para propiedades normales, agregar developmentId
        if (!isMinkaasa && formData.developmentId) {
          basicData.developmentId = Number(formData.developmentId);
          console.log('✅ Agregado developmentId:', basicData.developmentId);
        } else {
          console.log('❌ Omitido developmentId:', formData.developmentId, 'isMinkaasa:', isMinkaasa);
        }

        // Para propiedades Minkaasa, agregar externalAgreement
        if (isMinkaasa) {
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
          console.log('✅ Agregado externalAgreement:', externalAgreement);
        }

        console.log('📤 Objeto JSON final:', basicData);
        return basicData;
      };

      const basicData = createBasicPropertyData(formData, isMinkaasa);
      const response = await api.updatePropertyBasic(propertyId, basicData);

      if (response) {
        console.log('Paso 1 completado, datos básicos actualizados');
        return {
          success: true,
          data: response
        };
      } else {
        throw new Error('Error al actualizar los datos básicos');
      }
    } catch (error) {
      console.error('Error updating basic property:', error);
      setError(error.message || 'Error al actualizar los datos básicos');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, [propertyId, formType]);

  // Paso 2: Actualizar descripciones
  const updateDescriptions = useCallback(async (descriptions) => {
    try {
      setLoading(true);
      setError(null);

      if (!propertyId) {
        throw new Error('No hay propertyId disponible para actualizar descripciones');
      }

      if (!descriptions || descriptions.length === 0) {
        throw new Error('Debe agregar al menos una descripción');
      }

      const response = await api.updatePropertyDescriptions(propertyId, descriptions);

      if (response) {
        console.log('Paso 2 completado, descripciones actualizadas');
        return {
          success: true,
          data: response
        };
      } else {
        throw new Error('Error al actualizar descripciones');
      }
    } catch (error) {
      console.error('Error updating descriptions:', error);
      setError(error.message || 'Error al actualizar las descripciones');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, [propertyId]);

  // Paso 3: Actualizar imágenes
  const updateImages = useCallback(async (mainImage, secondaryImages) => {
    try {
      setLoading(true);
      setError(null);

      if (!propertyId) {
        throw new Error('No hay propertyId disponible para actualizar imágenes');
      }

      const formData = new FormData();
      let hasImages = false;
      
      // Agregar imagen principal si existe
      if (mainImage instanceof File) {
        formData.append('mainImage', mainImage);
        hasImages = true;
      }

      // Agregar imágenes secundarias si existen
      if (secondaryImages && Array.isArray(secondaryImages)) {
        secondaryImages.forEach(file => {
          if (file instanceof File) {
            formData.append('secondaryImages', file);
            hasImages = true;
          }
        });
      }
      
      // Validar que hay al menos una imagen para enviar
      if (!hasImages) {
        throw new Error('No hay imágenes para actualizar');
      }
      
      const response = await api.updatePropertyImages(propertyId, formData);

      if (response !== null && response !== undefined) {
        console.log('✅ Paso 3 completado, imágenes actualizadas');
        return {
          success: true,
          data: response,
          message: 'Imágenes actualizadas correctamente'
        };
      } else {
        throw new Error('Error al actualizar imágenes');
      }
    } catch (error) {
      console.error('❌ Error updating images:', error);
      setError(error.message || 'Error al actualizar las imágenes');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, [propertyId]);

  // Ir al siguiente paso
  const nextStep = useCallback(() => {
    const newStep = Math.min(currentStep + 1, 3);
    setCurrentStep(newStep);
  }, [currentStep]);

  // Ir al paso anterior
  const previousStep = useCallback(() => {
    const newStep = Math.max(currentStep - 1, 1);
    setCurrentStep(newStep);
  }, [currentStep]);

  // Ir a un paso específico
  const goToStep = useCallback((step) => {
    if (step >= 1 && step <= 3) {
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
    nextStep,
    previousStep,
    goToStep,
  };
}; 