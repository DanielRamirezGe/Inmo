import { useState, useCallback } from 'react';
import { api } from '../services/api';

/**
 * Hook personalizado para manejar streaming de videos optimizado para videos cortos
 * 
 * Limitaciones del nuevo endpoint:
 * - Máximo 100MB por archivo (aproximadamente 2 minutos de video)
 * - Rate limit: 30 requests por 10 minutos
 * - No maneja range requests (carga completa)
 * - Headers optimizados para cache agresivo
 */
export const useVideoStream = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [videoInfo, setVideoInfo] = useState(null);

  // Constantes para el nuevo endpoint
  const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
  const MAX_DURATION = 2 * 60; // 2 minutos

  // Obtener información del video
  const getVideoInfo = useCallback(async (videoPath) => {
    try { 
      setLoading(true);
      setError(null);

      if (!videoPath) {
        throw new Error('Se requiere la ruta del video');
      }

      const info = await api.getVideoInfo(videoPath);
      setVideoInfo(info);
      
      // Validar límites
      if (info.size > MAX_FILE_SIZE) {
        throw new Error(`El video es demasiado grande (${Math.round(info.size / (1024 * 1024))}MB). Máximo: ${Math.round(MAX_FILE_SIZE / (1024 * 1024))}MB`);
      }
      
      if (info.duration > MAX_DURATION) {
        throw new Error(`El video es demasiado largo (${Math.round(info.duration / 60)}min). Máximo: ${MAX_DURATION / 60}min`);
      }
      
      return {
        success: true,
        data: info
      };

    } catch (error) {
      console.error('Error obteniendo información del video:', error);
      
      let errorMessage = 'Error al obtener información del video';
      
      if (error.response?.status === 429) {
        errorMessage = 'Demasiadas solicitudes. Espera unos minutos e intenta de nuevo.';
      } else if (error.response?.status === 400) {
        errorMessage = 'Video demasiado grande o formato no soportado.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener URL de streaming del video optimizada para videos cortos
  const getStreamUrl = useCallback((videoPath) => {
    try {
      if (!videoPath) {
        throw new Error('Se requiere la ruta del video');
      }

      return api.getVideoStreamUrl(videoPath);
    } catch (error) {
      console.error('Error generando URL de streaming optimizada:', error);
      
      let errorMessage = 'Error al generar URL de streaming';
      
      if (error.response?.status === 429) {
        errorMessage = 'Demasiadas solicitudes. Espera unos minutos e intenta de nuevo.';
      } else if (error.response?.status === 400) {
        errorMessage = 'Video demasiado grande o formato no soportado.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      return null;
    }
  }, []);

  // Verificar si el video soporta el nuevo endpoint optimizado
  const supportsOptimizedStreaming = useCallback((videoPath, fileSize = null, duration = null) => {
    try {
      if (!videoPath) {
        setError('Se requiere la ruta del video');
        return false;
      }

      // Verificar extensión
      const extension = videoPath.toLowerCase().substring(videoPath.lastIndexOf('.'));
      const supportedExtensions = ['.mp4', '.webm', '.ogg'];
      
      if (!supportedExtensions.includes(extension)) {
        setError('Formato de video no soportado. Usa: MP4, WebM, OGG');
        return false;
      }

      // Verificar tamaño si está disponible
      if (fileSize && fileSize > MAX_FILE_SIZE) {
        setError(`Video demasiado grande (${Math.round(fileSize / (1024 * 1024))}MB). Máximo: ${Math.round(MAX_FILE_SIZE / (1024 * 1024))}MB`);
        return false;
      }

      // Verificar duración si está disponible
      if (duration && duration > MAX_DURATION) {
        setError(`Video demasiado largo (${Math.round(duration / 60)}min). Máximo: ${MAX_DURATION / 60}min`);
        return false;
      }

      return true;
    } catch (error) {
      setError('Error validando video');
      return false;
    }
  }, []);

  // Verificar si el video soporta streaming (mantener compatibilidad)
  const supportsStreaming = useCallback((videoPath) => {
    return supportsOptimizedStreaming(videoPath);
  }, [supportsOptimizedStreaming]);

  // Limpiar estado
  const clearVideoInfo = useCallback(() => {
    setVideoInfo(null);
    setError(null);
    setLoading(false);
  }, []);

  // Verificar si el error es debido a rate limiting
  const isRateLimited = useCallback((error) => {
    if (error?.response?.status === 429) return true;
    if (error?.message?.includes('rate limit')) return true;
    if (error?.message?.includes('Demasiadas solicitudes')) return true;
    return false;
  }, []);

  // Verificar si el error es debido a tamaño de archivo
  const isFileTooLarge = useCallback((error) => {
    if (error?.response?.status === 400) return true;
    if (error?.message?.includes('demasiado grande')) return true;
    if (error?.message?.includes('100MB')) return true;
    return false;
  }, []);

  // Formatear tamaño de archivo
  const formatFileSize = useCallback((bytes) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }, []);

  // Formatear tiempo
  const formatTime = useCallback((seconds) => {
    if (!seconds) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, []);

  // Verificar si URL es válida
  const isValidVideoUrl = useCallback((url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }, []);

  return {
    loading,
    error,
    videoInfo,
    getVideoInfo,
    getStreamUrl,
    supportsStreaming,
    supportsOptimizedStreaming,
    clearVideoInfo,
    formatFileSize,
    formatTime,
    isValidVideoUrl,
    isRateLimited,
    isFileTooLarge,
    setError,
    // Constantes útiles
    MAX_FILE_SIZE,
    MAX_DURATION
  };
}; 