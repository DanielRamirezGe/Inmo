import { useState, useCallback } from "react";
import { api } from "../services/api";
import { useAxiosMiddleware } from "../utils/axiosMiddleware";
import { FORM_TYPES } from "../app/admin/properties/constants";

export const useEntityData = (entityType) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 15,
    total: 0,
  });

  // Obtener axiosInstance
  const axiosInstance = useAxiosMiddleware();

  const fetchItems = useCallback(
    async (page = 1, pageSize = 15) => {
      if (!entityType) return;

      setLoading(true);
      setError(null);
      try {
        let response;
        switch (entityType) {
          case FORM_TYPES.DEVELOPER:
            response = await api.getDevelopers(axiosInstance, page, pageSize);
            break;
          case FORM_TYPES.DEVELOPMENT:
            response = await api.getDevelopments(axiosInstance, page, pageSize);
            break;
          case FORM_TYPES.PROPERTY_NOT_PUBLISHED:
            response = await api.getNotPublishedProperties(
              axiosInstance,
              page,
              pageSize
            );
            break;
          case FORM_TYPES.PROPERTY_PUBLISHED:
            response = await api.getPublishedProperties(
              axiosInstance,
              page,
              pageSize
            );
            break;
          default:
            throw new Error("Tipo de entidad no válido");
        }

        setItems(response.data || []);
        setPagination({
          page: response.page || page,
          pageSize: response.pageSize || pageSize,
          total: response.total || 0,
        });
      } catch (error) {
        console.error("Error al obtener items:", error);
        setError("Error al cargar los datos");
      } finally {
        setLoading(false);
      }
    },
    [entityType, axiosInstance]
  );

  const getItemDetails = useCallback(
    async (itemId) => {
      if (!entityType || !itemId) return null;

      setLoading(true);
      setError(null);
      try {
        let response;
        switch (entityType) {
          case FORM_TYPES.DEVELOPER:
            response = await api.getDeveloper(axiosInstance, itemId);
            break;
          case FORM_TYPES.DEVELOPMENT:
            response = await api.getDevelopment(axiosInstance, itemId);
            break;
          case FORM_TYPES.PROPERTY_NOT_PUBLISHED:
          case FORM_TYPES.PROPERTY_PUBLISHED:
            response = await api.getProperty(axiosInstance, itemId);
            break;
          default:
            throw new Error("Tipo de entidad no válido");
        }
        return response;
      } catch (error) {
        console.error("Error al obtener detalles del item:", error);
        setError("Error al cargar los detalles");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [entityType, axiosInstance]
  );

  return {
    items,
    loading,
    error,
    pagination,
    fetchItems,
    getItemDetails,
  };
};
