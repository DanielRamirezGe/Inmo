import { useState, useCallback } from "react";
import { api } from "../services/api";
import { useAxiosMiddleware } from "../utils/axiosMiddleware";

export const useImageHandling = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Manejar axiosInstance internamente
  const axiosInstance = useAxiosMiddleware();

  const loadImage = useCallback(async (path, isFullPath = false) => {
    if (!path) return null;

    setLoading(true);
    setError(null);
    try {
      const blob = await api.getImage(axiosInstance, path, isFullPath);
      return URL.createObjectURL(blob);
    } catch (error) {
      setError("Error al cargar la imagen");
      console.error("Error al cargar la imagen:", error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const loadImages = useCallback(
    async (images, isFullPath = false) => {
      if (!images || !Array.isArray(images) || images.length === 0) return [];

      setLoading(true);
      setError(null);
      try {
        const loadedImages = await Promise.all(
          images.map(async (img) => {
            const path = isFullPath ? img.pathImage : img.imagePath;
            if (!path) return null;
            return loadImage(path, isFullPath);
          })
        );
        return loadedImages.filter((url) => url !== null);
      } catch (error) {
        setError("Error al cargar las imágenes");
        console.error("Error al cargar las imágenes:", error);
        return [];
      } finally {
        setLoading(false);
      }
    },
    [loadImage]
  );

  const loadPropertyImages = useCallback(
    async (item) => {
      if (!item) return item;
      const processedItem = { ...item };

      setLoading(true);
      setError(null);
      try {
        // Cargar la imagen principal
        if (item.mainImage) {
          processedItem.mainImagePreview = await loadImage(
            item.mainImage,
            true
          );
        }

        // Cargar las imágenes secundarias
        if (item.secondaryImages && item.secondaryImages.length > 0) {
          processedItem.secondaryImagesPreview = await loadImages(
            item.secondaryImages,
            true
          );
        }

        return processedItem;
      } catch (error) {
        console.error("Error al cargar imágenes de la propiedad:", error);
        setError("Error al cargar las imágenes de la propiedad");
        return processedItem;
      } finally {
        setLoading(false);
      }
    },
    [loadImage, loadImages]
  );

  const loadDevelopmentImages = useCallback(
    async (item) => {
      if (!item) return item;
      const processedItem = { ...item };

      setLoading(true);
      setError(null);
      try {
        // Cargar la imagen principal
        if (item.mainImage) {
          const filename = item.mainImage.split("/").pop();
          processedItem.mainImagePreview = await loadImage(filename);
        }

        // Cargar las imágenes secundarias
        if (item.secondaryImages && item.secondaryImages.length > 0) {
          processedItem.secondaryImagesPreview = await Promise.all(
            item.secondaryImages.map(async (img) => {
              const filename = img.imagePath.split("/").pop();
              return loadImage(filename);
            })
          );
          processedItem.secondaryImagesPreview =
            processedItem.secondaryImagesPreview.filter((url) => url !== null);
        }

        return processedItem;
      } catch (error) {
        console.error("Error al cargar imágenes del desarrollo:", error);
        setError("Error al cargar las imágenes del desarrollo");
        return processedItem;
      } finally {
        setLoading(false);
      }
    },
    [loadImage]
  );

  const createImagePreview = useCallback((file) => {
    if (!file || !(file instanceof File)) return null;
    return URL.createObjectURL(file);
  }, []);

  const createImagesPreview = useCallback((files) => {
    if (!files || !Array.isArray(files)) return [];
    return files
      .filter((file) => file instanceof File)
      .map((file) => URL.createObjectURL(file));
  }, []);

  return {
    loading,
    error,
    loadImage,
    loadImages,
    loadPropertyImages,
    loadDevelopmentImages,
    createImagePreview,
    createImagesPreview,
    setError,
  };
};
