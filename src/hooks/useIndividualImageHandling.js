import { useState, useCallback } from "react";
import { api } from "../services/api";

export const useIndividualImageHandling = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState({
    current: 0,
    total: 0,
    currentImageName: "",
    isUploading: false,
  });

  // Subir múltiples imágenes una por una
  const uploadImages = useCallback(
    async (prototypeId, mainImage, secondaryImages) => {
      try {
        setLoading(true);
        setError(null);

        const imagesToUpload = [];
        const results = {
          mainImageResult: null,
          secondaryImagesResults: [],
          errors: [],
        };

        // Preparar lista de imágenes a subir
        if (mainImage instanceof File) {
          imagesToUpload.push({
            file: mainImage,
            isMainImage: true,
            name: mainImage.name,
          });
        }

        if (secondaryImages && Array.isArray(secondaryImages)) {
          secondaryImages.forEach((file) => {
            if (file instanceof File) {
              imagesToUpload.push({
                file: file,
                isMainImage: false,
                name: file.name,
              });
            }
          });
        }

        if (imagesToUpload.length === 0) {
          throw new Error("No hay imágenes para subir");
        }

        // Inicializar progreso
        setUploadProgress({
          current: 0,
          total: imagesToUpload.length,
          currentImageName: "",
          isUploading: true,
        });

        // Subir imágenes una por una
        for (let i = 0; i < imagesToUpload.length; i++) {
          const imageData = imagesToUpload[i];

          setUploadProgress((prev) => ({
            ...prev,
            current: i + 1,
            currentImageName: imageData.name,
          }));

          try {
            const result = await api.addSinglePropertyImage(
              prototypeId,
              imageData.file,
              imageData.isMainImage
            );

            if (imageData.isMainImage) {
              results.mainImageResult = result;
            } else {
              results.secondaryImagesResults.push(result);
            }

            console.log(
              `✅ Imagen ${i + 1}/${imagesToUpload.length} subida:`,
              imageData.name
            );
          } catch (error) {
            console.error(`❌ Error subiendo imagen ${imageData.name}:`, error);
            results.errors.push({
              imageName: imageData.name,
              error: error.message,
            });
          }
        }

        // Finalizar progreso
        setUploadProgress((prev) => ({
          ...prev,
          isUploading: false,
          currentImageName: "Completado",
        }));

        return {
          success: results.errors.length === 0,
          results,
          totalUploaded: imagesToUpload.length - results.errors.length,
          totalErrors: results.errors.length,
        };
      } catch (error) {
        console.error("Error en uploadImages:", error);
        setError(error.message || "Error al subir las imágenes");
        setUploadProgress((prev) => ({
          ...prev,
          isUploading: false,
        }));
        return { success: false, error: error.message };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Eliminar una imagen individual
  const deleteImage = useCallback(
    async (prototypeImageId, isMainImage = false) => {
      try {
        setLoading(true);
        setError(null);

        const result = await api.deleteSinglePropertyImage(
          prototypeImageId,
          isMainImage
        );
        return {
          success: true,
          result,
        };
      } catch (error) {
        console.error("Error eliminando imagen:", error);
        setError(error.message || "Error al eliminar la imagen");
        return { success: false, error: error.message };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Eliminar múltiples imágenes una por una
  const deleteImages = useCallback(async (imagesToDelete) => {
    try {
      setLoading(true);
      setError(null);

      if (!imagesToDelete || imagesToDelete.length === 0) {
        return { success: true, results: [] };
      }

      // Inicializar progreso para eliminación
      setUploadProgress({
        current: 0,
        total: imagesToDelete.length,
        currentImageName: "",
        isUploading: true,
      });

      const results = {
        deletedImages: [],
        errors: [],
      };

      // Eliminar imágenes una por una
      for (let i = 0; i < imagesToDelete.length; i++) {
        const imageData = imagesToDelete[i];

        setUploadProgress((prev) => ({
          ...prev,
          current: i + 1,
          currentImageName: `Eliminando imagen ${i + 1}`,
        }));

        try {
          const result = await api.deleteSinglePropertyImage(
            imageData.id,
            imageData.isMainImage
          );

          results.deletedImages.push({
            id: imageData.id,
            result,
          });

          console.log(`✅ Imagen ${i + 1}/${imagesToDelete.length} eliminada`);
        } catch (error) {
          console.error(`❌ Error eliminando imagen ${imageData.id}:`, error);
          results.errors.push({
            id: imageData.id,
            error: error.message,
          });
        }
      }

      // Finalizar progreso
      setUploadProgress((prev) => ({
        ...prev,
        isUploading: false,
        currentImageName: "Completado",
      }));

      return {
        success: results.errors.length === 0,
        results,
        totalDeleted: results.deletedImages.length,
        totalErrors: results.errors.length,
      };
    } catch (error) {
      console.error("Error en deleteImages:", error);
      setError(error.message || "Error al eliminar las imágenes");
      setUploadProgress((prev) => ({
        ...prev,
        isUploading: false,
      }));
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Limpiar progreso
  const clearProgress = useCallback(() => {
    setUploadProgress({
      current: 0,
      total: 0,
      currentImageName: "",
      isUploading: false,
    });
  }, []);

  // Limpiar error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Establecer una imagen como principal
  const setMainImage = useCallback(async (prototypeId, newMainImageId) => {
    try {
      setLoading(true);
      setError(null);

      const result = await api.setMainImage(prototypeId, newMainImageId);
      return {
        success: true,
        result,
      };
    } catch (error) {
      console.error("Error estableciendo imagen principal:", error);
      setError(error.message || "Error al establecer la imagen principal");
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    uploadProgress,
    uploadImages,
    deleteImage,
    deleteImages,
    setMainImage,
    clearProgress,
    clearError,
  };
};
