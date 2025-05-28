import { useState, useEffect, useCallback } from "react";
import { api } from "../services/api";

/**
 * Hook personalizado para manejar filtros de propiedades
 * @param {string} filterType - Tipo de filtro: 'published', 'not-published', 'minkaasa-published', 'minkaasa-not-published', 'all'
 * @returns {Object} Estado y funciones para manejar filtros
 */
export const usePropertyFilters = (filterType = "all") => {
  const [filters, setFilters] = useState({
    cities: [],
    states: [],
    bedrooms: [],
    bathrooms: [],
    parkings: [],
    priceRanges: [],
    propertyTypes: [],
    developments: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Estado para los filtros aplicados
  const [appliedFilters, setAppliedFilters] = useState({
    city: "",
    state: "",
    bedroom: "",
    bathroom: "",
    parking: "",
    priceRange: "",
    propertyType: "",
    development: "",
    minPrice: "",
    maxPrice: "",
    search: "",
  });

  // Estado para resultados de búsqueda
  const [searchResults, setSearchResults] = useState({
    data: [],
    page: 1,
    pageSize: 10,
    total: 0,
    filters: {},
  });
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);

  // Función para cargar los filtros disponibles
  const loadFilters = useCallback(
    async (type = filterType) => {
      try {
        setLoading(true);
        setError(null);

        const filtersData = await api.getPropertyFilters(type);
        setFilters(filtersData);
      } catch (err) {
        console.error("Error loading filters:", err);
        setError(err.message || "Error al cargar los filtros");
      } finally {
        setLoading(false);
      }
    },
    [filterType]
  );

  // Cargar filtros al montar el componente o cambiar el tipo
  useEffect(() => {
    loadFilters();
  }, [loadFilters]);

  // Función para actualizar un filtro específico
  const updateFilter = useCallback((filterName, value) => {
    setAppliedFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  }, []);

  // Función para limpiar todos los filtros
  const clearFilters = useCallback(() => {
    setAppliedFilters({
      city: "",
      state: "",
      bedroom: "",
      bathroom: "",
      parking: "",
      priceRange: "",
      propertyType: "",
      development: "",
      minPrice: "",
      maxPrice: "",
      search: "",
    });
    setSearchResults({
      data: [],
      page: 1,
      pageSize: 10,
      total: 0,
      filters: {},
    });
  }, []);

  // Función para obtener los filtros activos (no vacíos)
  const getActiveFilters = useCallback(() => {
    const activeFilters = {};
    Object.entries(appliedFilters).forEach(([key, value]) => {
      if (value !== "" && value !== null && value !== undefined) {
        activeFilters[key] = value;
      }
    });
    return activeFilters;
  }, [appliedFilters]);

  // Función para contar filtros activos
  const getActiveFiltersCount = useCallback(() => {
    return Object.values(getActiveFilters()).length;
  }, [getActiveFilters]);

  // Función para verificar si hay filtros aplicados
  const hasActiveFilters = useCallback(() => {
    return getActiveFiltersCount() > 0;
  }, [getActiveFiltersCount]);

  // Función para realizar búsqueda con filtros
  const searchWithFilters = useCallback(
    async (page = 1, pageSize = 10) => {
      try {
        setSearchLoading(true);
        setSearchError(null);

        // Preparar filtros para la API
        const searchFilters = { ...getActiveFilters() };

        // Mapear campos específicos
        if (searchFilters.propertyType) {
          searchFilters.propertyTypeId = searchFilters.propertyType;
          delete searchFilters.propertyType;
        }
        if (searchFilters.development) {
          searchFilters.developmentId = searchFilters.development;
          delete searchFilters.development;
        }

        // Agregar tipo de filtro
        searchFilters.type = filterType;

        const results = await api.searchProperties(
          searchFilters,
          page,
          pageSize
        );
        setSearchResults(results);

        return results;
      } catch (err) {
        console.error("Error searching properties:", err);
        setSearchError(err.message || "Error al buscar propiedades");
        throw err;
      } finally {
        setSearchLoading(false);
      }
    },
    [getActiveFilters, filterType]
  );

  return {
    // Datos de filtros disponibles
    filters,
    loading,
    error,

    // Estado de filtros aplicados
    appliedFilters,

    // Resultados de búsqueda
    searchResults,
    searchLoading,
    searchError,

    // Funciones de control
    updateFilter,
    clearFilters,
    loadFilters,
    searchWithFilters,

    // Utilidades
    getActiveFilters,
    getActiveFiltersCount,
    hasActiveFilters,
  };
};
