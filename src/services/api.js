const handleApiError = (error) => {
  if (error.response?.data?.message) {
    throw new Error(error.response.data.message);
  }
  throw new Error(`Error: ${error.message}`);
};

export const api = {
  // Developer endpoints
  getDevelopers: async (axiosInstance) => {
    try {
      const response = await axiosInstance.get("/realEstateDevelopment");
      return response.data.data || [];
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
  getDevelopments: async (axiosInstance) => {
    try {
      const response = await axiosInstance.get("/development");
      return response.data.data || [];
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
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    } catch (error) {
      handleApiError(error);
    }
  },

  updateDevelopment: async (axiosInstance, id, formData) => {
    try {
      await axiosInstance.put(`/development/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
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
  getProperties: async (axiosInstance) => {
    try {
      const response = await axiosInstance.get("/prototype");
      return response.data.data || [];
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
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    } catch (error) {
      handleApiError(error);
    }
  },

  updateProperty: async (axiosInstance, id, formData) => {
    try {
      await axiosInstance.put(`/prototype/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
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
  getImage: async (axiosInstance, path) => {
    try {
      const response = await axiosInstance.get(`/image?path=${encodeURIComponent(path)}`, {
        responseType: 'blob'
      });
      return new Blob([response.data], { type: response.headers['content-type'] });
    } catch (error) {
      handleApiError(error);
    }
  }
}; 