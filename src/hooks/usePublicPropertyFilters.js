import { useState, useEffect, useCallback } from "react";
import { api } from "../services/api";

/**
 * Hook para manejar filtros públicos de propiedades
 * @param {string} filterType - Tipo de filtro para la API
 * @param {Object} initialFilters - Filtros iniciales a aplicar
 * @returns {Object} Estado y funciones para manejar filtros
 */
export const usePublicPropertyFilters = (
  filterType = "all",
  initialFilters = {}
) => {
  const [filters, setFilters] = useState({
    states: [],
    cities: [],
    bedrooms: [],
    bathrooms: [],
    parkings: [],
    propertyTypes: [],
    developments: [],
  });

  const [appliedFilters, setAppliedFilters] = useState(initialFilters);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);

  // Cargar filtros disponibles
  const loadFilters = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const filtersData = await api.getPublicPropertyFilters(filterType);
      setFilters(
        filtersData || {
          states: [],
          cities: [],
          bedrooms: [],
          bathrooms: [],
          parkings: [],
          propertyTypes: [],
          developments: [],
        }
      );
    } catch (err) {
      console.error("Error loading public filters:", err);
      setError(err.message || "Error al cargar filtros");
    } finally {
      setLoading(false);
    }
  }, [filterType]);

  // Cargar filtros al montar el componente
  useEffect(() => {
    loadFilters();
  }, [loadFilters]);

  // Actualizar filtros aplicados cuando cambien los filtros iniciales
  useEffect(() => {
    setAppliedFilters(initialFilters);
  }, [initialFilters]);

  // Actualizar un filtro específico
  const updateFilter = useCallback((filterName, value) => {
    setAppliedFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  }, []);

  // Limpiar todos los filtros
  const clearFilters = useCallback(() => {
    setAppliedFilters({});
  }, []);

  // Obtener filtros activos (no vacíos)
  const getActiveFilters = useCallback(() => {
    const activeFilters = {};
    Object.entries(appliedFilters).forEach(([key, value]) => {
      if (value !== "" && value !== null && value !== undefined) {
        activeFilters[key] = value;
      }
    });
    return activeFilters;
  }, [appliedFilters]);

  // Contar filtros activos
  const getActiveFiltersCount = useCallback(() => {
    return Object.keys(getActiveFilters()).length;
  }, [getActiveFilters]);

  // Verificar si hay filtros activos
  const hasActiveFilters = useCallback(() => {
    return getActiveFiltersCount() > 0;
  }, [getActiveFiltersCount]);

  // Buscar propiedades con filtros
  const searchWithFilters = useCallback(
    async (page = 1, pageSize = 10) => {
      try {
        setSearchLoading(true);
        setSearchError(null);

        const activeFilters = getActiveFilters();
        const searchFilters = { ...activeFilters, type: filterType };

        // Mapear campos específicos para la API
        if (searchFilters.propertyType) {
          searchFilters.propertyTypeId = searchFilters.propertyType;
          delete searchFilters.propertyType;
        }
        if (searchFilters.development) {
          searchFilters.developmentId = searchFilters.development;
          delete searchFilters.development;
        }

        const results = await api.searchPublicProperties(
          searchFilters,
          page,
          pageSize
        );
        return results;
      } catch (err) {
        console.error("Error searching public properties:", err);
        const errorMessage = err.message || "Error al buscar propiedades";
        setSearchError(errorMessage);
        throw err;
      } finally {
        setSearchLoading(false);
      }
    },
    [getActiveFilters, filterType]
  );

  return {
    // Estado de filtros
    filters,
    appliedFilters,
    loading,
    error,
    searchLoading,
    searchError,

    // Funciones de filtros
    updateFilter,
    clearFilters,
    getActiveFilters,
    getActiveFiltersCount,
    hasActiveFilters,
    searchWithFilters,
    loadFilters,
  };
};
