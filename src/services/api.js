import {
  createAxiosInstance,
  createPublicAxiosInstance,
} from "../utils/axiosMiddleware";
import {
  ENTITY_PAGINATION_CONFIG,
  validatePaginationParams,
} from "../constants/pagination";

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
  getDevelopers: async (
    page = 1,
    pageSize = ENTITY_PAGINATION_CONFIG.DEVELOPERS.PAGE_SIZE
  ) => {
    try {
      const validParams = validatePaginationParams(
        page,
        pageSize,
        "DEVELOPERS"
      );
      const axiosInstance = getAxiosInstance();
      const response = await axiosInstance.get("/realEstateDevelopment", {
        params: validParams,
      });
      console.log(response.data);
      return {
        data: response.data.data || [],
        page: response.data.page || validParams.page,
        pageSize: response.data.pageSize || validParams.pageSize,
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
  getDevelopments: async (
    page = 1,
    pageSize = ENTITY_PAGINATION_CONFIG.DEVELOPMENTS.PAGE_SIZE
  ) => {
    try {
      const validParams = validatePaginationParams(
        page,
        pageSize,
        "DEVELOPMENTS"
      );
      const axiosInstance = getAxiosInstance();
      const response = await axiosInstance.get("/development", {
        params: validParams,
      });
      return {
        data: response.data.data || [],
        page: response.data.page || validParams.page,
        pageSize: response.data.pageSize || validParams.pageSize,
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

  getDevelopmentsBasic: async (
    page = 1,
    pageSize = ENTITY_PAGINATION_CONFIG.DEVELOPMENTS_BASIC.PAGE_SIZE
  ) => {
    try {
      const validParams = validatePaginationParams(
        page,
        pageSize,
        "DEVELOPMENTS_BASIC"
      );
      const axiosInstance = getAxiosInstance();
      const response = await axiosInstance.get("/development/basic", {
        params: validParams,
      });
      return {
        data: response.data.data || [],
        page: response.data.page || validParams.page,
        pageSize: response.data.pageSize || validParams.pageSize,
        total: response.data.total || 0,
      };
    } catch (error) {
      handleApiError(error);
    }
  },

  // Property endpoints
  getProperties: async (
    page = 1,
    pageSize = ENTITY_PAGINATION_CONFIG.PROPERTIES.PAGE_SIZE
  ) => {
    try {
      const validParams = validatePaginationParams(
        page,
        pageSize,
        "PROPERTIES"
      );
      const axiosInstance = getAxiosInstance();
      const response = await axiosInstance.get("/prototype", {
        params: validParams,
      });
      return {
        data: response.data.data || [],
        page: response.data.page || validParams.page,
        pageSize: response.data.pageSize || validParams.pageSize,
        total: response.data.total || 0,
      };
    } catch (error) {
      handleApiError(error);
    }
  },

  getPublishedProperties: async (
    page = 1,
    pageSize = ENTITY_PAGINATION_CONFIG.PROPERTIES.PAGE_SIZE
  ) => {
    try {
      const validParams = validatePaginationParams(
        page,
        pageSize,
        "PROPERTIES"
      );
      const axiosInstance = getAxiosInstance();
      const response = await axiosInstance.get("/prototype/published", {
        params: validParams,
      });
      return {
        data: response.data.data || [],
        page: response.data.page || validParams.page,
        pageSize: response.data.pageSize || validParams.pageSize,
        total: response.data.total || 0,
      };
    } catch (error) {
      handleApiError(error);
    }
  },

  getPublicProperties: async (
    page = 1,
    pageSize = ENTITY_PAGINATION_CONFIG.PUBLIC_PROPERTIES.PAGE_SIZE
  ) => {
    try {
      const validParams = validatePaginationParams(
        page,
        pageSize,
        "PUBLIC_PROPERTIES"
      );
      const axiosInstance = getPublicAxiosInstance();
      const response = await axiosInstance.get("/public/prototype", {
        params: validParams,
      });
      return {
        data: response.data.data || [],
        page: response.data.page || validParams.page,
        pageSize: response.data.pageSize || validParams.pageSize,
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

  getNotPublishedProperties: async (
    page = 1,
    pageSize = ENTITY_PAGINATION_CONFIG.PROPERTIES.PAGE_SIZE
  ) => {
    try {
      const validParams = validatePaginationParams(
        page,
        pageSize,
        "PROPERTIES"
      );
      const axiosInstance = getAxiosInstance();
      const response = await axiosInstance.get("/prototype/not-published", {
        params: validParams,
      });
      return {
        data: response.data.data || [],
        page: response.data.page || validParams.page,
        pageSize: response.data.pageSize || validParams.pageSize,
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
    console.warn(
      "⚠️ createProperty (DEPRECATED): Use createPropertyBasic for new multi-step creation"
    );
    try {
      const axiosInstance = getAxiosInstance();
      await axiosInstance.post("/prototype", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch (error) {
      handleApiError(error);
    }
  },

  createPublishedProperty: async (formData) => {
    console.warn(
      "⚠️ createPublishedProperty (DEPRECATED): Use createPropertyBasic for new multi-step creation"
    );
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
      const response = await axiosInstance.put(
        `/updatePrototype/${id}/basic`,
        {
          published: false,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
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
      const response = await axiosInstance.put(
        `/updatePrototype/${id}/basic`,
        {
          published: true,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
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
  getMinkaasaUnpublishedProperties: async (
    page = 1,
    pageSize = ENTITY_PAGINATION_CONFIG.PROPERTIES.PAGE_SIZE
  ) => {
    try {
      const validParams = validatePaginationParams(
        page,
        pageSize,
        "PROPERTIES"
      );
      const axiosInstance = getAxiosInstance();
      const response = await axiosInstance.get(
        "/prototype/minkaasa-not-published",
        {
          params: validParams,
        }
      );
      return {
        data: response.data.data || [],
        page: response.data.page || validParams.page,
        pageSize: response.data.pageSize || validParams.pageSize,
        total: response.data.total || 0,
      };
    } catch (error) {
      handleApiError(error);
    }
  },

  getMinkaasaPublishedProperties: async (
    page = 1,
    pageSize = ENTITY_PAGINATION_CONFIG.PROPERTIES.PAGE_SIZE
  ) => {
    try {
      const validParams = validatePaginationParams(
        page,
        pageSize,
        "PROPERTIES"
      );
      const axiosInstance = getAxiosInstance();
      const response = await axiosInstance.get(
        "/prototype/minkaasa-published",
        {
          params: validParams,
        }
      );
      return {
        data: response.data.data || [],
        page: response.data.page || validParams.page,
        pageSize: response.data.pageSize || validParams.pageSize,
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
    console.warn(
      "⚠️ createMinkaasaProperty (DEPRECATED): Use createMinkaasaPropertyBasic for new multi-step creation"
    );
    try {
      const axiosInstance = getAxiosInstance();
      await axiosInstance.post("/prototype/minkaasa", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch (error) {
      handleApiError(error);
    }
  },

  deleteMinkaasaProperty: async (id) => {
    try {
      const axiosInstance = getAxiosInstance();
      await axiosInstance.delete(`/prototype/${id}`);
    } catch (error) {
      handleApiError(error);
    }
  },

  publishMinkaasaProperty: async (id) => {
    try {
      const axiosInstance = getAxiosInstance();
      const response = await axiosInstance.put(
        `/updatePrototype/${id}/basic`,
        {
          published: true,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      return true;
    } catch (error) {
      console.error("Error al publicar propiedad Minkaasa:", error);
      handleApiError(error);
      return false;
    }
  },

  unpublishMinkaasaProperty: async (id) => {
    try {
      const axiosInstance = getAxiosInstance();
      const response = await axiosInstance.put(
        `/updatePrototype/${id}/basic`,
        {
          published: false,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      return true;
    } catch (error) {
      console.error("Error al despublicar propiedad Minkaasa:", error);
      handleApiError(error);
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

  // Filters endpoint (private)
  getPropertyFilters: async (type = "all") => {
    try {
      const axiosInstance = getAxiosInstance();
      const response = await axiosInstance.get("/prototype/filters", {
        params: { type },
      });
      return response.data.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  // Search properties with filters (private)
  searchProperties: async (
    filters = {},
    page = 1,
    pageSize = ENTITY_PAGINATION_CONFIG.PROPERTIES.PAGE_SIZE
  ) => {
    try {
      const validParams = validatePaginationParams(
        page,
        pageSize,
        "PROPERTIES"
      );
      const axiosInstance = getAxiosInstance();

      // Preparar parámetros de búsqueda
      const params = {
        ...validParams,
        ...filters,
      };

      // Limpiar parámetros vacíos
      Object.keys(params).forEach((key) => {
        if (
          params[key] === "" ||
          params[key] === null ||
          params[key] === undefined
        ) {
          delete params[key];
        }
      });

      const response = await axiosInstance.get("/prototype/search", {
        params,
      });

      return {
        data: response.data.data || [],
        page: response.data.page || validParams.page,
        pageSize: response.data.pageSize || validParams.pageSize,
        total: response.data.total || 0,
        filters: response.data.filters || {},
      };
    } catch (error) {
      handleApiError(error);
    }
  },

  // Public Filters endpoint
  getPublicPropertyFilters: async (type = "all") => {
    try {
      const axiosInstance = getPublicAxiosInstance();
      const response = await axiosInstance.get("/public/prototype/filters", {
        params: { type },
      });
      return response.data.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  // Public Search properties with filters
  searchPublicProperties: async (
    filters = {},
    page = 1,
    pageSize = ENTITY_PAGINATION_CONFIG.PUBLIC_PROPERTIES.PAGE_SIZE
  ) => {
    try {
      const validParams = validatePaginationParams(
        page,
        pageSize,
        "PUBLIC_PROPERTIES"
      );
      const axiosInstance = getPublicAxiosInstance();

      // Preparar parámetros de búsqueda
      const params = {
        ...validParams,
        ...filters,
      };

      // Limpiar parámetros vacíos
      Object.keys(params).forEach((key) => {
        if (
          params[key] === "" ||
          params[key] === null ||
          params[key] === undefined
        ) {
          delete params[key];
        }
      });

      const response = await axiosInstance.get("/public/prototype/search", {
        params,
      });

      return {
        data: response.data.data || [],
        page: response.data.page || validParams.page,
        pageSize: response.data.pageSize || validParams.pageSize,
        total: response.data.total || 0,
        filters: response.data.filters || {},
      };
    } catch (error) {
      handleApiError(error);
    }
  },

  // Get public properties (for homepage) - DUPLICATE REMOVED - Using the one above with proper pagination

  patchDevelopment: async (id, formData) => {
    try {
      const axiosInstance = getAxiosInstance();
      await axiosInstance.patch(`/development/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch (error) {
      handleApiError(error);
    }
  },

  // Basic property creation endpoints (Step 1 of multi-step creation)
  createPropertyBasic: async (data) => {
    try {
      const axiosInstance = getAxiosInstance();

      console.log("🚀 API createPropertyBasic - data enviado:", data);
      console.log("🚀 API createPropertyBasic - tipo de data:", typeof data);

      // Si es FormData, convertir a objeto JSON
      let jsonData;
      if (data instanceof FormData) {
        jsonData = {};
        for (let [key, value] of data.entries()) {
          // Si es externalAgreement, ya está en JSON string, parsearlo
          if (key === "externalAgreement") {
            try {
              jsonData[key] = JSON.parse(value);
            } catch (e) {
              jsonData[key] = value;
            }
          } else {
            jsonData[key] = value;
          }
        }
        console.log("🔄 FormData convertido a JSON:", jsonData);
      } else {
        jsonData = data;
      }

      const response = await axiosInstance.post(
        "/createPrototype/basic",
        jsonData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("✅ API createPropertyBasic - respuesta:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ API createPropertyBasic - error:", error);
      console.error("❌ Error response:", error.response?.data);
      handleApiError(error);
    }
  },

  createMinkaasaPropertyBasic: async (data) => {
    try {
      const axiosInstance = getAxiosInstance();

      console.log("🚀 API createMinkaasaPropertyBasic - data enviado:", data);
      console.log(
        "🚀 API createMinkaasaPropertyBasic - tipo de data:",
        typeof data
      );

      // Si es FormData, convertir a objeto JSON
      let jsonData;
      if (data instanceof FormData) {
        jsonData = {};
        for (let [key, value] of data.entries()) {
          // Si es externalAgreement, ya está en JSON string, parsearlo
          if (key === "externalAgreement") {
            try {
              jsonData[key] = JSON.parse(value);
            } catch (e) {
              jsonData[key] = value;
            }
          } else {
            jsonData[key] = value;
          }
        }
        console.log("🔄 FormData convertido a JSON:", jsonData);
      } else {
        jsonData = data;
      }

      const response = await axiosInstance.post(
        "/createPrototype/minkaasa/basic",
        jsonData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log(
        "✅ API createMinkaasaPropertyBasic - respuesta:",
        response.data
      );
      return response.data;
    } catch (error) {
      console.error("❌ API createMinkaasaPropertyBasic - error:", error);
      console.error("❌ Error response:", error.response?.data);
      handleApiError(error);
    }
  },

  // Step 2: Add descriptions to property
  addPropertyDescriptions: async (prototypeId, descriptions) => {
    try {
      const axiosInstance = getAxiosInstance();
      const response = await axiosInstance.post(
        `/createPrototype/${prototypeId}/descriptions`,
        {
          descriptions,
        }
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  // // Step 3: Add images to property
  // addPropertyImages: async (prototypeId, formData) => {
  //   try {
  //     const axiosInstance = getAxiosInstance();
  //     const response = await axiosInstance.post(
  //       `/createPrototype/${prototypeId}/images`,
  //       formData,
  //       {
  //         headers: { "Content-Type": "multipart/form-data" },
  //       }
  //     );
  //     return response.data;
  //   } catch (error) {
  //     handleApiError(error);
  //   }
  // },

  // Property update endpoints (Multi-step editing)
  updatePropertyBasic: async (id, data) => {
    try {
      const axiosInstance = getAxiosInstance();

      console.log("🚀 API updatePropertyBasic - id:", id);
      console.log("🚀 API updatePropertyBasic - data enviado:", data);

      // Si es FormData, convertir a objeto JSON
      let jsonData;
      if (data instanceof FormData) {
        jsonData = {};
        for (let [key, value] of data.entries()) {
          if (key === "externalAgreement") {
            try {
              jsonData[key] = JSON.parse(value);
            } catch (e) {
              jsonData[key] = value;
            }
          } else {
            jsonData[key] = value;
          }
        }
        console.log("🔄 FormData convertido a JSON:", jsonData);
      } else {
        jsonData = data;
      }

      const response = await axiosInstance.put(
        `/updatePrototype/${id}/basic`,
        jsonData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("✅ API updatePropertyBasic - respuesta:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ API updatePropertyBasic - error:", error);
      console.error("❌ Error response:", error.response?.data);
      handleApiError(error);
    }
  },

  updatePropertyDescriptions: async (id, descriptions) => {
    try {
      const axiosInstance = getAxiosInstance();
      console.log(
        "🚀 API updatePropertyDescriptions - id:",
        id,
        "descriptions:",
        descriptions
      );

      const response = await axiosInstance.put(
        `/updatePrototype/${id}/descriptions`,
        {
          descriptions,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log(
        "✅ API updatePropertyDescriptions - respuesta:",
        response.data
      );
      return response.data;
    } catch (error) {
      console.error("❌ API updatePropertyDescriptions - error:", error);
      console.error("❌ Error response:", error.response?.data);
      handleApiError(error);
    }
  },

  // updatePropertyImages: async (id, formData) => {
  //   try {
  //     const axiosInstance = getAxiosInstance();
  //     console.log("🚀 API updatePropertyImages - id:", id);

  //     const response = await axiosInstance.put(
  //       `/updatePrototype/${id}/images`,
  //       formData,
  //       {
  //         headers: { "Content-Type": "multipart/form-data" },
  //       }
  //     );

  //     console.log("✅ API updatePropertyImages - respuesta:", response.data);
  //     return response.data;
  //   } catch (error) {
  //     console.error("❌ API updatePropertyImages - error:", error);
  //     console.error("❌ Error response:", error.response?.data);
  //     handleApiError(error);
  //   }
  // },

  // New individual image endpoints
  addSinglePropertyImage: async (
    prototypeId,
    imageFile,
    isMainImage = false
  ) => {
    try {
      const axiosInstance = getAxiosInstance();
      const formData = new FormData();
      formData.append("image", imageFile);
      formData.append("isMainImage", isMainImage.toString());

      console.log(
        "🚀 API addSinglePropertyImage - prototypeId:",
        prototypeId,
        "isMainImage:",
        isMainImage
      );

      const response = await axiosInstance.post(
        `/createPrototype/image/${prototypeId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log("✅ API addSinglePropertyImage - respuesta:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ API addSinglePropertyImage - error:", error);
      console.error("❌ Error response:", error.response?.data);
      handleApiError(error);
    }
  },

  deleteSinglePropertyImage: async (prototypeImageId, isMainImage = false) => {
    try {
      const axiosInstance = getAxiosInstance();

      let endpoint;
      if (isMainImage) {
        // Para imagen principal: DELETE /api/v1/createPrototype/image/main/:prototypeId
        endpoint = `/createPrototype/image/main/${prototypeImageId}`;
      } else {
        // Para imágenes secundarias: DELETE /api/v1/createPrototype/image/:prototypeImageId
        endpoint = `/createPrototype/image/${prototypeImageId}`;
      }

      const response = await axiosInstance.delete(endpoint);

      return response.data;
    } catch (error) {
      console.error("Error eliminando imagen:", error);
      handleApiError(error);
    }
  },
};
