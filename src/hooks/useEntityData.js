import { useState, useCallback, useRef, useEffect } from "react";
import { api } from "../services/api";

export const useEntityData = (entityType, axiosInstance) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 15,
    total: 0,
  });

  // Usar una ref para mantener una referencia estable al axiosInstance
  const axiosInstanceRef = useRef(axiosInstance);

  // Actualizar la ref si cambia axiosInstance
  useEffect(() => {
    axiosInstanceRef.current = axiosInstance;
  }, [axiosInstance]);

  const fetchItems = useCallback(
    async (page = 1, pageSize = 10) => {
      if (loading) return; // Prevenir múltiples llamadas simultáneas

      setLoading(true);
      setError(null);
      try {
        let response;
        switch (entityType) {
          case "developer":
            response = await api.getDevelopers(
              axiosInstanceRef.current,
              page,
              pageSize
            );
            break;
          case "development":
            response = await api.getDevelopments(
              axiosInstanceRef.current,
              page,
              pageSize
            );
            break;
          case "property":
            response = await api.getProperties(
              axiosInstanceRef.current,
              page,
              pageSize
            );
            break;
          default:
            throw new Error("Invalid entity type");
        }
        setItems(response.data);
        setPagination({
          page: response.page,
          pageSize: response.pageSize,
          total: response.total,
        });
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    },
    [entityType]
  );

  const handlePageChange = useCallback(
    (newPage) => {
      fetchItems(newPage, pagination.pageSize);
    },
    [fetchItems, pagination.pageSize]
  );

  const handlePageSizeChange = useCallback(
    (newPageSize) => {
      fetchItems(1, newPageSize);
    },
    [fetchItems]
  );

  const getItemDetails = useCallback(
    async (id) => {
      if (!id) return null;

      setLoading(true);
      setError(null);
      try {
        let data;
        switch (entityType) {
          case "developer":
            data = await api.getDeveloper(axiosInstanceRef.current, id);
            break;
          case "development":
            data = await api.getDevelopment(axiosInstanceRef.current, id);
            break;
          case "property":
            data = await api.getProperty(axiosInstanceRef.current, id);
            break;
          default:
            throw new Error("Invalid entity type");
        }
        return data;
      } catch (error) {
        setError(error.message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [entityType]
  );

  const deleteItem = useCallback(
    async (id) => {
      if (loading) return;

      setLoading(true);
      setError(null);
      try {
        switch (entityType) {
          case "developer":
            await api.deleteDeveloper(axiosInstanceRef.current, id);
            break;
          case "development":
            await api.deleteDevelopment(axiosInstanceRef.current, id);
            break;
          case "property":
            await api.deleteProperty(axiosInstanceRef.current, id);
            break;
          default:
            throw new Error("Invalid entity type");
        }
        await fetchItems();
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    },
    [entityType, fetchItems]
  );

  const saveItem = useCallback(
    async (formData, id = null) => {
      if (loading) return false;

      setLoading(true);
      setError(null);
      try {
        switch (entityType) {
          case "developer":
            if (id) {
              await api.updateDeveloper(axiosInstanceRef.current, id, formData);
            } else {
              await api.createDeveloper(axiosInstanceRef.current, formData);
            }
            break;
          case "development":
            if (id) {
              await api.updateDevelopment(
                axiosInstanceRef.current,
                id,
                formData
              );
            } else {
              await api.createDevelopment(axiosInstanceRef.current, formData);
            }
            break;
          case "property":
            if (id) {
              await api.updateProperty(axiosInstanceRef.current, id, formData);
            } else {
              await api.createProperty(axiosInstanceRef.current, formData);
            }
            break;
          default:
            throw new Error("Invalid entity type");
        }
        await fetchItems();
        return true;
      } catch (error) {
        setError(error.message);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [entityType, fetchItems]
  );

  return {
    items,
    loading,
    error,
    pagination,
    fetchItems,
    handlePageChange,
    handlePageSizeChange,
    getItemDetails,
    deleteItem,
    saveItem,
    setError,
  };
};
