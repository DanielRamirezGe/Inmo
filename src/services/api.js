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

  deleteProperty: async (axiosInstance, id) => {
    try {
      await axiosInstance.delete(`/prototype/${id}`);
    } catch (error) {
      handleApiError(error);
    }
  },

  // Image handling
  getImage: async (axiosInstance, path, isFullPath = false) => {
    try {
      const endpoint = isFullPath
        ? `/image?path=${encodeURIComponent(path)}`
        : `/image/${path}`;

      const response = await axiosInstance.get(endpoint, {
        responseType: "blob",
      });
      return new Blob([response.data], {
        type: response.headers["content-type"],
      });
    } catch (error) {
      handleApiError(error);
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
};
