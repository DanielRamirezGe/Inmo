import {
  createAxiosInstance,
  createPublicAxiosInstance,
} from "../utils/axiosMiddleware";

/**
 * API Service Layer
 *
 * Este archivo maneja todas las llamadas a la API de forma centralizada.
 * Todas las funciones manejan internamente la instancia de axios,
 * por lo que no es necesario pasarla como parámetro.
 *
 * Uso:
 *    api.getDevelopers(1, 10)
 *    api.getNameTypeProperty()
 *    api.createDeveloper(data)
 */

// Crear una instancia de axios para uso interno (con autenticación)
const getAxiosInstance = () => {
  return createAxiosInstance();
};

// Crear una instancia de axios para endpoints públicos (sin autenticación)
const getPublicAxiosInstance = () => {
  return createPublicAxiosInstance();
};

const handleApiError = (error) => {
  if (error.response?.data?.message) {
    throw new Error(error.response.data.message);
  }
  throw new Error(`Error: ${error.message}`);
};

export const api = {
  // Developer endpoints
  getDevelopers: async (page = 1, pageSize = 10) => {
    try {
      const axiosInstance = getAxiosInstance();
      const response = await axiosInstance.get("/realEstateDevelopment", {
        params: { page, pageSize },
      });
      return {
        data: response.data.data || [],
        page: response.data.page || page,
        pageSize: response.data.pageSize || pageSize,
        total: response.data.total || 0,
      };
    } catch (error) {
      handleApiError(error);
    }
  },

  getDeveloper: async (id) => {
    try {
      const axiosInstance = getAxiosInstance();
      const response = await axiosInstance.get(`/realEstateDevelopment/${id}`);
      return response.data.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  getNameTypeProperty: async () => {
    try {
      const axiosInstance = getAxiosInstance();
      const response = await axiosInstance.get(`/nameType`);
      return response.data.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  createDeveloper: async (data) => {
    try {
      const axiosInstance = getAxiosInstance();
      await axiosInstance.post("/realEstateDevelopment", data);
    } catch (error) {
      handleApiError(error);
    }
  },

  updateDeveloper: async (id, data) => {
    try {
      const axiosInstance = getAxiosInstance();
      await axiosInstance.put(`/realEstateDevelopment/${id}`, data);
    } catch (error) {
      handleApiError(error);
    }
  },

  deleteDeveloper: async (id) => {
    try {
      const axiosInstance = getAxiosInstance();
      await axiosInstance.delete(`/realEstateDevelopment/${id}`);
    } catch (error) {
      handleApiError(error);
    }
  },

  // Development endpoints
  getDevelopments: async (page = 1, pageSize = 10) => {
    try {
      const axiosInstance = getAxiosInstance();
      const response = await axiosInstance.get("/development", {
        params: { page, pageSize },
      });
      return {
        data: response.data.data || [],
        page: response.data.page || page,
        pageSize: response.data.pageSize || pageSize,
        total: response.data.total || 0,
      };
    } catch (error) {
      handleApiError(error);
    }
  },

  getDevelopment: async (id) => {
    try {
      const axiosInstance = getAxiosInstance();
      const response = await axiosInstance.get(`/development/${id}`);
      return response.data.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  createDevelopment: async (formData) => {
    try {
      const axiosInstance = getAxiosInstance();
      await axiosInstance.post("/development", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch (error) {
      handleApiError(error);
    }
  },

  updateDevelopment: async (id, formData) => {
    try {
      const axiosInstance = getAxiosInstance();
      await axiosInstance.put(`/development/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch (error) {
      handleApiError(error);
    }
  },

  deleteDevelopment: async (id) => {
    try {
      const axiosInstance = getAxiosInstance();
      await axiosInstance.delete(`/development/${id}`);
    } catch (error) {
      handleApiError(error);
    }
  },

  getDevelopmentsBasic: async (page = 1, pageSize = 1000) => {
    try {
      const axiosInstance = getAxiosInstance();
      const response = await axiosInstance.get("/development/basic", {
        params: { page, pageSize },
      });
      return {
        data: response.data.data || [],
        page: response.data.page || page,
        pageSize: response.data.pageSize || pageSize,
        total: response.data.total || 0,
      };
    } catch (error) {
      handleApiError(error);
    }
  },

  // Property endpoints
  getProperties: async (page = 1, pageSize = 10) => {
    try {
      const axiosInstance = getAxiosInstance();
      const response = await axiosInstance.get("/prototype", {
        params: { page, pageSize },
      });
      return {
        data: response.data.data || [],
        page: response.data.page || page,
        pageSize: response.data.pageSize || pageSize,
        total: response.data.total || 0,
      };
    } catch (error) {
      handleApiError(error);
    }
  },

  getPublishedProperties: async (page = 1, pageSize = 10) => {
    try {
      const axiosInstance = getAxiosInstance();
      const response = await axiosInstance.get("/prototype/published", {
        params: { page, pageSize },
      });
      return {
        data: response.data.data || [],
        page: response.data.page || page,
        pageSize: response.data.pageSize || pageSize,
        total: response.data.total || 0,
      };
    } catch (error) {
      handleApiError(error);
    }
  },

  getPublicProperties: async (page = 1, pageSize = 10) => {
    try {
      const axiosInstance = getPublicAxiosInstance();
      const response = await axiosInstance.get("/public/prototype", {
        params: { page, pageSize },
      });
      return {
        data: response.data.data || [],
        page: response.data.page || page,
        pageSize: response.data.pageSize || pageSize,
        total: response.data.total || 0,
      };
    } catch (error) {
      handleApiError(error);
    }
  },

  getPublicSearchProperties: async (q) => {
    try {
      const axiosInstance = getPublicAxiosInstance();
      const response = await axiosInstance.get("/public/prototype/search", {
        params: { q },
      });
      return {
        data: response.data.data || [],
        page: response.data.page || 1,
        pageSize: response.data.pageSize || 10,
        total: response.data.total || 0,
      };
    } catch (error) {
      handleApiError(error);
    }
  },

  getNotPublishedProperties: async (page = 1, pageSize = 10) => {
    try {
      const axiosInstance = getAxiosInstance();
      const response = await axiosInstance.get("/prototype/not-published", {
        params: { page, pageSize },
      });
      return {
        data: response.data.data || [],
        page: response.data.page || page,
        pageSize: response.data.pageSize || pageSize,
        total: response.data.total || 0,
      };
    } catch (error) {
      handleApiError(error);
    }
  },

  getProperty: async (id) => {
    try {
      const axiosInstance = getAxiosInstance();
      const response = await axiosInstance.get(`/prototype/${id}`);
      return response.data.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  getPropertyPreview: async (id) => {
    try {
      const axiosInstance = getAxiosInstance();
      const response = await axiosInstance.get(`/prototype/preview/${id}`);
      return response.data.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  getPublicPropertyView: async (id) => {
    try {
      const axiosInstance = getPublicAxiosInstance();
      const response = await axiosInstance.get(`/public/prototype/${id}`);
      return response.data.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  createProperty: async (formData) => {
    try {
      const axiosInstance = getAxiosInstance();
      await axiosInstance.post("/prototype", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch (error) {
      handleApiError(error);
    }
  },

  updateProperty: async (id, formData) => {
    try {
      const axiosInstance = getAxiosInstance();
      await axiosInstance.put(`/prototype/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch (error) {
      handleApiError(error);
    }
  },

  updateNotPublishedProperties: async (id, formData) => {
    try {
      const axiosInstance = getAxiosInstance();
      await axiosInstance.put(`/prototype/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch (error) {
      handleApiError(error);
    }
  },

  updatePublishedProperties: async (id, formData) => {
    try {
      const axiosInstance = getAxiosInstance();
      await axiosInstance.put(`/prototype/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch (error) {
      handleApiError(error);
    }
  },

  updatePublishedProperty: async (id, formData) => {
    try {
      const axiosInstance = getAxiosInstance();
      await axiosInstance.put(`/prototype/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch (error) {
      handleApiError(error);
    }
  },

  createPublishedProperty: async (formData) => {
    try {
      const axiosInstance = getAxiosInstance();
      await axiosInstance.post("/prototype", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch (error) {
      handleApiError(error);
    }
  },

  deleteProperty: async (id) => {
    try {
      const axiosInstance = getAxiosInstance();
      await axiosInstance.delete(`/prototype/${id}`);
    } catch (error) {
      handleApiError(error);
    }
  },

  // Función para despublicar una propiedad
  unpublishProperty: async (id) => {
    try {
      const axiosInstance = getAxiosInstance();
      const formData = new FormData();
      formData.append("published", false);

      await axiosInstance.put(`/prototype/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return true;
    } catch (error) {
      console.error("Error al despublicar propiedad:", error);
      handleApiError(error);
      return false;
    }
  },

  // Función para publicar una propiedad
  publishProperty: async (id) => {
    try {
      const axiosInstance = getAxiosInstance();
      const formData = new FormData();
      formData.append("published", true);

      await axiosInstance.put(`/prototype/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return true;
    } catch (error) {
      console.error("Error al publicar propiedad:", error);
      handleApiError(error);
      return false;
    }
  },

  // Image handling
  getImage: async (path, isFullPath = false) => {
    try {
      const axiosInstance = getAxiosInstance();
      let imagePath = path;
      if (!isFullPath && !path.startsWith("uploads/")) {
        imagePath = `uploads/${path}`;
      }

      console.log(
        `Loading image from: /image?path=${encodeURIComponent(imagePath)}`
      );

      const response = await axiosInstance.get(
        `/image?path=${encodeURIComponent(imagePath)}`,
        {
          responseType: "blob",
        }
      );

      return new Blob([response.data], {
        type: response.headers["content-type"],
      });
    } catch (error) {
      console.error("Error loading image:", error);
      handleApiError(error);
      throw error;
    }
  },

  getFieldOptions: async (endpoint) => {
    try {
      const axiosInstance = getAxiosInstance();
      const response = await axiosInstance.get(endpoint);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  // Función genérica para obtener un elemento por su ID
  getItemById: async (endpoint, id) => {
    try {
      const axiosInstance = getAxiosInstance();
      const response = await axiosInstance.get(`${endpoint}/${id}`);
      return response.data.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  // Minkaasa Property endpoints
  getMinkaasaUnpublishedProperties: async (page = 1, pageSize = 10) => {
    try {
      const axiosInstance = getAxiosInstance();
      const response = await axiosInstance.get(
        "/prototype/minkaasa-not-published",
        {
          params: { page, pageSize },
        }
      );
      return {
        data: response.data.data || [],
        page: response.data.page || page,
        pageSize: response.data.pageSize || pageSize,
        total: response.data.total || 0,
      };
    } catch (error) {
      handleApiError(error);
    }
  },

  getMinkaasaPublishedProperties: async (page = 1, pageSize = 10) => {
    try {
      const axiosInstance = getAxiosInstance();
      const response = await axiosInstance.get(
        "/prototype/minkaasa-published",
        {
          params: { page, pageSize },
        }
      );
      return {
        data: response.data.data || [],
        page: response.data.page || page,
        pageSize: response.data.pageSize || pageSize,
        total: response.data.total || 0,
      };
    } catch (error) {
      handleApiError(error);
    }
  },

  getMinkaasaProperty: async (id) => {
    try {
      const axiosInstance = getAxiosInstance();
      const response = await axiosInstance.get(`/prototype/minkaasa/${id}`);
      return response.data.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  createMinkaasaProperty: async (formData) => {
    try {
      const axiosInstance = getAxiosInstance();
      await axiosInstance.post("/prototype/minkaasa", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch (error) {
      handleApiError(error);
    }
  },

  updateMinkaasaProperty: async (id, formData) => {
    try {
      const axiosInstance = getAxiosInstance();
      await axiosInstance.put(`/prototype/minkaasa/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch (error) {
      handleApiError(error);
    }
  },

  deleteMinkaasaProperty: async (id) => {
    try {
      const axiosInstance = getAxiosInstance();
      await axiosInstance.delete(`/prototype/minkaasa/${id}`);
    } catch (error) {
      handleApiError(error);
    }
  },

  publishMinkaasaProperty: async (id) => {
    try {
      const axiosInstance = getAxiosInstance();
      const formData = new FormData();
      formData.append("published", true);

      await axiosInstance.put(`/prototype/minkaasa/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return true;
    } catch (error) {
      console.error("Error al publicar propiedad Minkaasa:", error);
      return false;
    }
  },

  unpublishMinkaasaProperty: async (id) => {
    try {
      const axiosInstance = getAxiosInstance();
      const formData = new FormData();
      formData.append("published", false);

      await axiosInstance.put(`/prototype/minkaasa/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return true;
    } catch (error) {
      console.error("Error al despublicar propiedad Minkaasa:", error);
      return false;
    }
  },

  // Agregar una nueva función para enviar información de usuario desde el formulario público
  submitUserInformation: async (userData) => {
    try {
      const axiosInstance = getPublicAxiosInstance();
      const response = await axiosInstance.post(
        "/public/user/userInformation",
        userData
      );
      return response.data;
    } catch (error) {
      console.error("Error submitting user information:", error);
      throw error;
    }
  },
};
