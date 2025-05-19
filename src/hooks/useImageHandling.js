import { useState, useCallback } from 'react';
import { api } from '../services/api';

export const useImageHandling = (axiosInstance) => {
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState(null);

  const loadImage = useCallback(async (path) => {
    if (!path) return null;
    
    setImageLoading(true);
    setImageError(null);
    try {
      const blob = await api.getImage(axiosInstance, path);
      return URL.createObjectURL(blob);
    } catch (error) {
      setImageError(error.message);
      return null;
    } finally {
      setImageLoading(false);
    }
  }, [axiosInstance]);

  const loadImages = useCallback(async (images) => {
    if (!images || !Array.isArray(images) || images.length === 0) return [];

    setImageLoading(true);
    setImageError(null);
    try {
      const loadedImages = await Promise.all(
        images.map(async (img) => {
          const path = img.imagePath || img.pathImage;
          if (!path) return null;
          return loadImage(path);
        })
      );
      return loadedImages.filter(url => url !== null);
    } catch (error) {
      setImageError(error.message);
      return [];
    } finally {
      setImageLoading(false);
    }
  }, [loadImage]);

  const processItemImages = useCallback(async (item) => {
    if (!item) return null;

    const processedItem = { ...item };
    
    if (item.mainImage) {
      processedItem.mainImagePreview = await loadImage(item.mainImage);
    }

    if (item.secondaryImages && item.secondaryImages.length > 0) {
      processedItem.secondaryImagesPreview = await loadImages(item.secondaryImages);
    }

    return processedItem;
  }, [loadImage, loadImages]);

  return {
    imageLoading,
    imageError,
    loadImage,
    loadImages,
    processItemImages,
    setImageError
  };
}; 