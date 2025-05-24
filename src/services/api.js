const handleApiError = (error) => {
  if (error.response?.data?.message) {
    throw new Error(error.response.data.message);
  }
  throw new Error(`Error: ${error.message}`);
};

export const api = {
  // Developer endpoints
  getDevelopers: async (axiosInstance, page = 1, pageSize = 10) => {
    try {
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

  getDeveloper: async (axiosInstance, id) => {
    try {
      const response = await axiosInstance.get(`/realEstateDevelopment/${id}`);
      return response.data.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  createDeveloper: async (axiosInstance, data) => {
    try {
      await axiosInstance.post("/realEstateDevelopment", data);
    } catch (error) {
      handleApiError(error);
    }
  },

  updateDeveloper: async (axiosInstance, id, data) => {
    try {
      await axiosInstance.put(`/realEstateDevelopment/${id}`, data);
    } catch (error) {
      handleApiError(error);
    }
  },

  deleteDeveloper: async (axiosInstance, id) => {
    try {
      await axiosInstance.delete(`/realEstateDevelopment/${id}`);
    } catch (error) {
      handleApiError(error);
    }
  },

  // Development endpoints
  getDevelopments: async (axiosInstance, page = 1, pageSize = 10) => {
    try {
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

  getDevelopment: async (axiosInstance, id) => {
    try {
      const response = await axiosInstance.get(`/development/${id}`);
      return response.data.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  createDevelopment: async (axiosInstance, formData) => {
    try {
      await axiosInstance.post("/development", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch (error) {
      handleApiError(error);
    }
  },

  updateDevelopment: async (axiosInstance, id, formData) => {
    try {
      await axiosInstance.put(`/development/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch (error) {
      handleApiError(error);
    }
  },

  deleteDevelopment: async (axiosInstance, id) => {
    try {
      await axiosInstance.delete(`/development/${id}`);
    } catch (error) {
      handleApiError(error);
    }
  },

  // Property endpoints
  getProperties: async (axiosInstance, page = 1, pageSize = 10) => {
    try {
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

  getPublishedProperties: async (axiosInstance, page = 1, pageSize = 10) => {
    try {
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

  getNotPublishedProperties: async (axiosInstance, page = 1, pageSize = 10) => {
    try {
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

  getProperty: async (axiosInstance, id) => {
    try {
      const response = await axiosInstance.get(`/prototype/${id}`);
      return response.data.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  createProperty: async (axiosInstance, formData) => {
    try {
      await axiosInstance.post("/prototype", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch (error) {
      handleApiError(error);
    }
  },

  updateProperty: async (axiosInstance, id, formData) => {
    try {
      await axiosInstance.put(`/prototype/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch (error) {
      handleApiError(error);
    }
  },

  updateNotPublishedProperties: async (axiosInstance, id, formData) => {
    try {
      await axiosInstance.put(`/prototype/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch (error) {
      handleApiError(error);
    }
  },

  updatePublishedProperties: async (axiosInstance, id, formData) => {
    try {
      await axiosInstance.put(`/prototype/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch (error) {
      handleApiError(error);
    }
  },

  updatePublishedProperty: async (axiosInstance, id, formData) => {
    try {
      await axiosInstance.put(`/prototype/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch (error) {
      handleApiError(error);
    }
  },

  createPublishedProperty: async (axiosInstance, formData) => {
    try {
      await axiosInstance.post("/prototype", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch (error) {
      handleApiError(error);
    }
  },

  deleteProperty: async (axiosInstance, id) => {
    try {
      await axiosInstance.delete(`/prototype/${id}`);
    } catch (error) {
      handleApiError(error);
    }
  },

  // Función para despublicar una propiedad
  unpublishProperty: async (axiosInstance, id) => {
    try {
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
  publishProperty: async (axiosInstance, id) => {
    try {
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
  getImage: async (axiosInstance, path, isFullPath = false) => {
    try {
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

  getFieldOptions: async (axiosInstance, endpoint) => {
    try {
      const response = await axiosInstance.get(endpoint);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  // Función genérica para obtener un elemento por su ID
  getItemById: async (axiosInstance, endpoint, id) => {
    try {
      const response = await axiosInstance.get(`${endpoint}/${id}`);
      return response.data.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  // Minkaasa Property endpoints
  getMinkaasaUnpublishedProperties: async (
    axiosInstance,
    page = 1,
    pageSize = 10
  ) => {
    try {
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

  getMinkaasaPublishedProperties: async (
    axiosInstance,
    page = 1,
    pageSize = 10
  ) => {
    try {
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

  getMinkaasaProperty: async (axiosInstance, id) => {
    try {
      const response = await axiosInstance.get(`/prototype/minkaasa/${id}`);
      return response.data.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  createMinkaasaProperty: async (axiosInstance, formData) => {
    try {
      await axiosInstance.post("/prototype/minkaasa", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch (error) {
      handleApiError(error);
    }
  },

  updateMinkaasaProperty: async (axiosInstance, id, formData) => {
    try {
      await axiosInstance.put(`/prototype/minkaasa/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch (error) {
      handleApiError(error);
    }
  },

  deleteMinkaasaProperty: async (axiosInstance, id) => {
    try {
      await axiosInstance.delete(`/prototype/minkaasa/${id}`);
    } catch (error) {
      handleApiError(error);
    }
  },

  publishMinkaasaProperty: async (axiosInstance, id) => {
    try {
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

  unpublishMinkaasaProperty: async (axiosInstance, id) => {
    try {
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
};
