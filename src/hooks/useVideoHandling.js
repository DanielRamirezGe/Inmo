import { useState, useCallback } from 'react';
import { api } from '../services/api';

/**
 * Hook personalizado para manejar operaciones de video
 */
export const useVideoHandling = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Crear preview de video para mostrar en el formulario
  const createVideoPreview = useCallback((file) => {
    if (!file) return null;
    
    try {
      return URL.createObjectURL(file);
    } catch (error) {
      console.error('Error creando preview del video:', error);
      return null;
    }
  }, []);

  // Subir video a un prototipo
  const uploadVideo = useCallback(async (prototypeId, videoFile, onProgress = null) => {
    try {
      setLoading(true);
      setError(null);
      setUploadProgress(0);

      if (!videoFile) {
        throw new Error('Se requiere un archivo de video');
      }

      if (!prototypeId) {
        throw new Error('Se requiere un ID de prototipo válido');
      }

      // Validar tipo de archivo
      const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/avi', 'video/mov', 'video/wmv'];
      if (!allowedTypes.includes(videoFile.type)) {
        throw new Error('Formato de video no permitido. Use: MP4, WebM, OGG, AVI, MOV o WMV');
      }

      // Validar tamaño (2GB máximo)
      const maxSize = 2 * 1024 * 1024 * 1024; // 2GB en bytes
      if (videoFile.size > maxSize) {
        throw new Error('El archivo es demasiado grande. Tamaño máximo: 2GB');
      }

      const result = await api.uploadPropertyVideo(prototypeId, videoFile, (progress) => {
        setUploadProgress(progress);
        if (onProgress) onProgress(progress);
      });

      setUploadProgress(100);
      return {
        success: true,
        data: result,
        message: 'Video subido exitosamente'
      };

    } catch (error) {
      console.error('Error al subir video:', error);
      setError(error.message || 'Error al subir el video');
      return {
        success: false,
        error: error.message || 'Error al subir el video'
      };
    } finally {
      setLoading(false);
      // Reset progress after a short delay
      setTimeout(() => setUploadProgress(0), 1000);
    }
  }, []);

  // Eliminar video de un prototipo
  const removeVideo = useCallback(async (prototypeId) => {
    try {
      setLoading(true);
      setError(null);

      if (!prototypeId) {
        throw new Error('Se requiere un ID de prototipo válido');
      }

      const result = await api.removePropertyVideo(prototypeId);

      return {
        success: true,
        data: result,
        message: 'Video eliminado exitosamente'
      };

    } catch (error) {
      console.error('Error al eliminar video:', error);
      setError(error.message || 'Error al eliminar el video');
      return {
        success: false,
        error: error.message || 'Error al eliminar el video'
      };
    } finally {
      setLoading(false);
    }
  }, []);

  // Limpiar preview URL para evitar memory leaks
  const cleanupVideoPreview = useCallback((previewUrl) => {
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
  }, []);

  // Obtener información del video
  const getVideoInfo = useCallback((file) => {
    if (!file) return null;

    return {
      name: file.name,
      size: file.size,
      type: file.type,
      sizeFormatted: formatFileSize(file.size),
      lastModified: file.lastModified
    };
  }, []);

  // Helper para formatear tamaño de archivo
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return {
    loading,
    error,
    uploadProgress,
    uploadVideo,
    removeVideo,
    createVideoPreview,
    cleanupVideoPreview,
    getVideoInfo,
    setError
  };
}; 