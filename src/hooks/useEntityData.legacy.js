// ⚠️ LEGACY: Este hook está siendo reemplazado por useGlobalEntityState
// Mantener solo para referencia y compatibilidad temporal
// NO usar en nuevos componentes

import { useState, useCallback, useEffect } from "react";
import { api } from "../services/api";
import { FORM_TYPES } from "../app/admin/properties/constants";
import { createInitialPagination } from "../constants/pagination";

export const useEntityDataLegacy = (entityType) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(
    createInitialPagination("PROPERTIES")
  );

  const fetchItems = useCallback(
    async (
      page = 1,
      pageSize = createInitialPagination("PROPERTIES").pageSize
    ) => {
      if (!entityType) return;

      setLoading(true);
      setError(null);
      try {
        let response;
        switch (entityType) {
          case FORM_TYPES.DEVELOPER:
            response = await api.getDevelopers(page, pageSize);
            break;
          case FORM_TYPES.DEVELOPMENT:
            response = await api.getDevelopments(page, pageSize);
            break;
          case FORM_TYPES.PROPERTY_NOT_PUBLISHED:
            response = await api.getNotPublishedProperties(page, pageSize);
            break;
          case FORM_TYPES.PROPERTY_PUBLISHED:
            response = await api.getPublishedProperties(page, pageSize);
            break;
          case FORM_TYPES.PROPERTY_MINKAASA_UNPUBLISHED:
            response = await api.getMinkaasaUnpublishedProperties(
              page,
              pageSize
            );
            break;
          case FORM_TYPES.PROPERTY_MINKAASA_PUBLISHED:
            response = await api.getMinkaasaPublishedProperties(page, pageSize);
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
    [entityType]
  );

  // Solo incluir funciones básicas para compatibilidad
  return {
    items,
    loading,
    error,
    pagination,
    fetchItems,
    // Funciones legacy que redirigen al nuevo sistema
    setItems,
    setPagination,
  };
}; 