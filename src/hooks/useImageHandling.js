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
        console.log("loadPropertyImages - Item received:", item);

        // Cargar la imagen principal
        if (item.mainImage) {
          console.log("loadPropertyImages - Main image path:", item.mainImage);
          processedItem.mainImagePreview = await loadImage(
            item.mainImage,
            true
          );
          console.log(
            "loadPropertyImages - Main image preview created:",
            processedItem.mainImagePreview
          );
        }

        // Cargar las imágenes secundarias
        if (item.secondaryImages && item.secondaryImages.length > 0) {
          console.log(
            "loadPropertyImages - Secondary images:",
            item.secondaryImages
          );

          // Las imágenes secundarias pueden estar en diferentes formatos:
          // 1. Array de objetos con pathImage: [{pathImage: "ruta/a/imagen.jpg"}, ...]
          // 2. Array de strings: ["ruta/a/imagen.jpg", ...]

          processedItem.secondaryImagesPreview = await Promise.all(
            item.secondaryImages.map(async (img) => {
              let imagePath;

              // Determinar si es un objeto o una cadena
              if (typeof img === "string") {
                imagePath = img;
              } else if (img && typeof img === "object") {
                // Buscar la propiedad que contiene la ruta de la imagen
                imagePath = img.pathImage || img.path || img.imagePath;
              }

              if (!imagePath) {
                console.error(
                  "loadPropertyImages - Invalid image format:",
                  img
                );
                return null;
              }

              console.log(
                "loadPropertyImages - Loading secondary image:",
                imagePath
              );
              return await loadImage(imagePath, true);
            })
          );

          processedItem.secondaryImagesPreview =
            processedItem.secondaryImagesPreview.filter((url) => url !== null);
          console.log(
            "loadPropertyImages - Secondary images previews created:",
            processedItem.secondaryImagesPreview.length
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
    [loadImage]
  );

  const loadDevelopmentImages = useCallback(
    async (item) => {
      if (!item) {
        console.error("loadDevelopmentImages called with null item");
        return null;
      }

      const processedItem = { ...item };
      console.log("loadDevelopmentImages - Processing item:", {
        mainImage: item.mainImage,
        secondaryImages: item.secondaryImages,
      });

      setLoading(true);
      setError(null);
      try {
        console.log("loadDevelopmentImages - Item received:", item);

        // Cargar la imagen principal
        if (item.mainImage) {
          console.log(
            "loadDevelopmentImages - Main image path:",
            item.mainImage
          );

          // Manejar diferentes formatos de ruta de imagen
          let mainImagePath;
          if (typeof item.mainImage === "string") {
            // Si es una cadena, usarla directamente
            mainImagePath = item.mainImage;
          } else if (item.mainImage.imagePath) {
            // Si es un objeto con imagePath
            mainImagePath = item.mainImage.imagePath;
          } else if (item.mainImage.path) {
            // Si es un objeto con path
            mainImagePath = item.mainImage.path;
          }

          if (mainImagePath) {
            // La API espera siempre rutas en formato /image?path=uploads/...
            // Siempre usar isFullPath=true ya que la función getImage ya maneja las rutas correctamente
            console.log(
              "loadDevelopmentImages - Using mainImagePath:",
              mainImagePath
            );
            processedItem.mainImagePreview = await loadImage(
              mainImagePath,
              true
            );
            console.log(
              "loadDevelopmentImages - Main image preview created:",
              processedItem.mainImagePreview
            );
          }
        }

        // Cargar las imágenes secundarias
        if (item.secondaryImages && item.secondaryImages.length > 0) {
          console.log(
            "loadDevelopmentImages - Secondary images:",
            item.secondaryImages
          );

          processedItem.secondaryImagesPreview = await Promise.all(
            item.secondaryImages.map(async (img) => {
              // Manejar diferentes formatos de imagen secundaria
              let imagePath;
              if (typeof img === "string") {
                imagePath = img;
              } else if (img.imagePath) {
                imagePath = img.imagePath;
              } else if (img.path) {
                imagePath = img.path;
              }

              if (!imagePath) return null;

              // La API espera siempre rutas en formato /image?path=uploads/...
              // Siempre usar isFullPath=true ya que la función getImage ya maneja las rutas correctamente
              console.log(
                "loadDevelopmentImages - Using secondary image path:",
                imagePath
              );
              return await loadImage(imagePath, true);
            })
          );

          processedItem.secondaryImagesPreview =
            processedItem.secondaryImagesPreview.filter((url) => url !== null);
          console.log(
            "loadDevelopmentImages - Secondary images previews created:",
            processedItem.secondaryImagesPreview.length
          );
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
