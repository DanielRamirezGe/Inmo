import {
  createAxiosInstance,
  createPublicAxiosInstance,
} from "../utils/axiosMiddleware";

/**
 * Video Service Layer
 *
 * Este archivo maneja todas las llamadas a la API relacionadas con videos de propiedades.
 * Separado del servicio principal para mejor organización y mantenibilidad.
 */

// Crear instancias de axios
const getAxiosInstance = () => {
  return createAxiosInstance();
};

const getPublicAxiosInstance = () => {
  return createPublicAxiosInstance();
};

const handleVideoApiError = (error) => {
  if (error.response?.data?.message) {
    throw new Error(error.response.data.message);
  }
  throw new Error(`Error: ${error.message}`);
};

export const videoService = {
  // ============================================================================
  // ENDPOINTS ADMINISTRATIVOS (requieren autenticación)
  // ============================================================================

  /**
   * Subir video a una propiedad
   * POST /api/v1/video/upload/:prototypeId
   */
  uploadPropertyVideo: async (prototypeId, videoFile) => {
    try {
      const axiosInstance = getAxiosInstance();
      const formData = new FormData();
      formData.append("video", videoFile);

      const response = await axiosInstance.post(
        `/video/upload/${prototypeId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return response.data;
    } catch (error) {
      handleVideoApiError(error);
    }
  },

  /**
   * Obtener video de propiedad para administradores
   * GET /api/v1/video/play/:prototypeId
   *
   * @description Este endpoint retorna directamente el stream de video binario,
   *              no una respuesta JSON. Dado que los elementos HTML <video> no pueden
   *              enviar headers de autorización, construiremos una URL con el token.
   */
  getAdminPropertyVideoUrl: async (prototypeId) => {
    try {
      const axiosInstance = getAxiosInstance();

      // Obtener el token de localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        return {
          success: false,
          videoUrl: null,
          exists: false,
          status: 401,
          message: "Token de autorización no encontrado",
          isClientError: true,
        };
      }

      // Hacer una petición HEAD para verificar si el video existe sin descargar todo el contenido
      const response = await axiosInstance.head(`/video/play/${prototypeId}`);

      // Construir la URL directa del video administrativo con el token como parámetro
      const baseURL = axiosInstance.defaults.baseURL;
      const videoUrl = `${baseURL}/video/play/${prototypeId}?token=${token}`;

      return {
        success: true,
        videoUrl: videoUrl,
        exists: true,
        status: response.status,
        message: "Video encontrado",
        data: null,
      };
    } catch (error) {
      const status = error.response?.status;
      const responseData = error.response?.data;

      // Si el video no existe (404), no es un error real
      if (status === 404) {
        return {
          success: true, // 404 se considera "éxito" para propósitos de UI
          videoUrl: null,
          exists: false,
          status: 404,
          message: "Video no disponible",
          isNotFound: true,
        };
      }

      // Para otros errores, mantener la estructura de error
      if (status === 400) {
        return {
          success: false,
          videoUrl: null,
          exists: false,
          status: 400,
          message:
            responseData?.message ||
            "ID de prototipo debe ser un número entero positivo",
          isClientError: true,
        };
      } else if (status === 401) {
        return {
          success: false,
          videoUrl: null,
          exists: false,
          status: 401,
          message: responseData?.message || "Token no válido",
          isClientError: true,
        };
      } else if (status === 403) {
        return {
          success: false,
          videoUrl: null,
          exists: false,
          status: 403,
          message:
            responseData?.message ||
            "Acceso denegado: se requiere rol de administrador",
          isClientError: true,
        };
      } else if (status === 416) {
        return {
          success: false,
          videoUrl: null,
          exists: false,
          status: 416,
          message: responseData?.message || "Rango solicitado no válido",
          isClientError: true,
        };
      } else if (status === 500) {
        return {
          success: false,
          videoUrl: null,
          exists: false,
          status: 500,
          message: responseData?.message || "Error interno del servidor",
          isServerError: true,
        };
      } else {
        // Otros errores no documentados
        return {
          success: false,
          videoUrl: null,
          exists: false,
          status: status || 500,
          message:
            responseData?.message || error.message || "Error desconocido",
          isServerError: true,
        };
      }
    }
  },

  /**
   * Eliminar video de propiedad
   * DELETE /api/v1/video/play/:prototypeId
   */
  deletePropertyVideo: async (prototypeId) => {
    try {
      const axiosInstance = getAxiosInstance();

      const response = await axiosInstance.delete(`/video/play/${prototypeId}`);
      return response.data;
    } catch (error) {
      handleVideoApiError(error);
    }
  },

  // ============================================================================
  // ENDPOINTS PÚBLICOS (sin autenticación)
  // ============================================================================

  /**
   * Obtener URL del video público para streaming directo
   * GET /api/v1/public/media/video/:prototypeId
   *
   * IMPORTANTE: Esta función NO hace peticiones HTTP. Solo construye la URL
   * que debe usarse directamente en el elemento <video>. Los errores se manejan
   * a través de los eventos del elemento video (onerror, onloadstart, etc.)
   */
  getPublicPropertyVideoUrl: (prototypeId) => {
    // Validación previa según la documentación
    if (
      !prototypeId ||
      prototypeId <= 0 ||
      !Number.isInteger(Number(prototypeId))
    ) {
      return {
        success: false,
        videoUrl: null,
        exists: false,
        error: "ID de prototipo inválido",
        isClientError: true,
      };
    }

    // Construir la URL directa del video público para el reproductor
    const axiosInstance = getPublicAxiosInstance();
    const baseURL = axiosInstance.defaults.baseURL;
    const videoUrl = `${baseURL}/public/media/video/${prototypeId}`;
    console.log("videoUrl", videoUrl);
    return {
      success: true,
      videoUrl: videoUrl,
      exists: true, // Asumimos que existe, el elemento <video> manejará errores
      message: "URL del video construida correctamente",
    };
  },

  // ============================================================================
  // UTILIDADES
  // ============================================================================

  /**
   * Validar archivo de video antes de subirlo
   */
  validateVideoFile: (file) => {
    if (!file) {
      return { valid: false, error: "No se seleccionó ningún archivo" };
    }

    if (!(file instanceof File)) {
      return { valid: false, error: "El archivo no es válido" };
    }

    if (!file.type.startsWith("video/")) {
      return { valid: false, error: "El archivo debe ser un video" };
    }

    // Validar tamaño máximo (100MB)
    const maxSize = 100 * 1024 * 1024; // 100MB en bytes
    if (file.size > maxSize) {
      return {
        valid: false,
        error: "El video es demasiado grande. Máximo permitido: 100MB",
      };
    }

    // Validar tipos de video permitidos
    const allowedTypes = [
      "video/mp4",
      "video/webm",
      "video/ogg",
      "video/avi",
      "video/mov",
      "video/quicktime",
    ];

    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: "Tipo de archivo no soportado. Use MP4, WebM, OGG, AVI o MOV",
      };
    }

    return { valid: true };
  },

  /**
   * Crear preview temporal de video para mostrar antes de subirlo
   */
  createVideoPreview: (file) => {
    if (!file || !(file instanceof File)) return null;
    if (!file.type.startsWith("video/")) return null;
    return URL.createObjectURL(file);
  },
};
