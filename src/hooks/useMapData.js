import { useState, useEffect, useCallback } from "react";
import { api } from "@/services/api";

export const useMapData = (properties = null, useMockData = true) => {
  const [mapProperties, setMapProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Generar propiedades mock para desarrollo
  const generateMockProperties = useCallback(
    () => [
      {
        id: 1,
        prototypeName: "Casa en Lomas",
        price: 2500000,
        type: "house",
        lat: 19.4326,
        lng: -99.1332,
        state: "CDMX",
        city: "Ciudad de México",
        size: 150,
        bedroom: 3,
        bathroom: 2,
        mainImage: null,
        developmentName: "Lomas Residencial",
      },
      {
        id: 2,
        prototypeName: "Departamento en Polanco",
        price: 1800000,
        type: "apartment",
        lat: 19.4342,
        lng: -99.2,
        state: "CDMX",
        city: "Ciudad de México",
        size: 120,
        bedroom: 2,
        bathroom: 2,
        mainImage: null,
        developmentName: "Polanco Premium",
      },
      {
        id: 3,
        prototypeName: "Casa en San Ángel",
        price: 3200000,
        type: "house",
        lat: 19.35,
        lng: -99.19,
        state: "CDMX",
        city: "Ciudad de México",
        size: 200,
        bedroom: 4,
        bathroom: 3,
        mainImage: null,
        developmentName: "San Ángel Colonial",
      },
      {
        id: 4,
        prototypeName: "Departamento en Condesa",
        price: 2200000,
        type: "apartment",
        lat: 19.41,
        lng: -99.17,
        state: "CDMX",
        city: "Ciudad de México",
        size: 95,
        bedroom: 2,
        bathroom: 1,
        mainImage: null,
        developmentName: "Condesa Modern",
      },
      {
        id: 5,
        prototypeName: "Casa en Coyoacán",
        price: 2800000,
        type: "house",
        lat: 19.35,
        lng: -99.16,
        state: "CDMX",
        city: "Ciudad de México",
        size: 180,
        bedroom: 3,
        bathroom: 2,
        mainImage: null,
        developmentName: "Coyoacán Tradicional",
      },
    ],
    []
  );

  // Cargar propiedades desde la API o usar las proporcionadas
  const loadProperties = useCallback(async () => {
    // Si se proporcionan propiedades explícitamente, usarlas
    if (properties) {
      setMapProperties(properties);
      setLoading(false);
      return;
    }

    // Si se solicita usar datos mock, usarlos directamente
    if (useMockData) {
      console.log("🗺️ Usando datos mock para el mapa");
      setMapProperties(generateMockProperties());
      setLoading(false);
      return;
    }

    // Solo intentar cargar desde la API si no se usan datos mock
    try {
      setLoading(true);
      setError(null);

      const response = await api.getPublicProperties(1, 100);

      if (response?.data) {
        // Filtrar solo propiedades con coordenadas válidas
        const validProperties = response.data.filter(
          (property) =>
            property.lat &&
            property.lng &&
            !isNaN(parseFloat(property.lat)) &&
            !isNaN(parseFloat(property.lng))
        );

        if (validProperties.length > 0) {
          // Agregar tipo de propiedad si no existe
          const propertiesWithType = validProperties.map((property) => ({
            ...property,
            type:
              property.type || (property.bedroom > 2 ? "house" : "apartment"),
          }));

          setMapProperties(propertiesWithType);
          console.log(
            `🗺️ Cargadas ${validProperties.length} propiedades desde la API`
          );
        } else {
          // Si no hay propiedades válidas, usar datos mock
          console.log(
            "🗺️ No hay propiedades con coordenadas válidas, usando datos mock"
          );
          setMapProperties(generateMockProperties());
        }
      } else {
        // Usar datos mock si no hay respuesta válida
        console.log("🗺️ Respuesta de API inválida, usando datos mock");
        setMapProperties(generateMockProperties());
      }
    } catch (err) {
      console.error("Error loading properties for map:", err);
      // Usar datos mock en caso de error
      console.log("🗺️ Error al cargar desde API, usando datos mock");
      setMapProperties(generateMockProperties());
    } finally {
      setLoading(false);
    }
  }, [properties, useMockData, generateMockProperties]);

  // Recargar propiedades
  const refreshProperties = useCallback(() => {
    loadProperties();
  }, [loadProperties]);

  // Filtrar propiedades por tipo
  const filterByType = useCallback(
    (type) => {
      if (!type) return mapProperties;
      return mapProperties.filter((property) => property.type === type);
    },
    [mapProperties]
  );

  // Filtrar propiedades por rango de precio
  const filterByPriceRange = useCallback(
    (minPrice, maxPrice) => {
      return mapProperties.filter(
        (property) => property.price >= minPrice && property.price <= maxPrice
      );
    },
    [mapProperties]
  );

  // Obtener estadísticas del mapa
  const getMapStats = useCallback(() => {
    if (mapProperties.length === 0) return null;

    const totalProperties = mapProperties.length;
    const houses = mapProperties.filter((p) => p.type === "house").length;
    const apartments = mapProperties.filter(
      (p) => p.type === "apartment"
    ).length;
    const totalPrice = mapProperties.reduce(
      (sum, p) => sum + (p.price || 0),
      0
    );
    const avgPrice = totalPrice / totalProperties;

    return {
      totalProperties,
      houses,
      apartments,
      totalPrice,
      avgPrice: Math.round(avgPrice),
    };
  }, [mapProperties]);

  useEffect(() => {
    loadProperties();
  }, [loadProperties]);

  return {
    mapProperties,
    loading,
    error,
    refreshProperties,
    filterByType,
    filterByPriceRange,
    getMapStats,
  };
};
