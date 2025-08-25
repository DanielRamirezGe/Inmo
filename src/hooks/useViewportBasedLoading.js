import { useState, useEffect, useCallback, useRef } from "react";
import { api } from "@/services/api";

// Configuración de carga por viewport
const VIEWPORT_CONFIG = {
  // Tamaño mínimo del viewport para cargar propiedades
  minViewportSize: 0.1, // 0.1 grados (~11km)
  // Tamaño máximo del viewport para agrupar propiedades
  maxViewportSize: 5, // 5 grados (~550km)
  // Debounce delay para evitar múltiples requests
  debounceDelay: 300, // Reducido para mejor respuesta
  // Tamaño de página para la API
  pageSize: 50,
  // Radio de búsqueda adicional (para prefetching)
  searchRadius: 0.5, // 0.5 grados (~55km)
};

export const useViewportBasedLoading = () => {
  const [viewportProperties, setViewportProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadedRegions, setLoadedRegions] = useState(new Set());
  const [cache, setCache] = useState(new Map());

  const debounceTimerRef = useRef(null);
  const currentBoundsRef = useRef(null);

  // Función para manejar cuando no hay propiedades disponibles
  const handleNoPropertiesAvailable = useCallback((regionKey) => {
    console.log(
      `🗺️ No hay propiedades disponibles para la región: ${regionKey}`
    );
    setViewportProperties([]);
    // NO establecer error aquí - solo limpiar propiedades
    setError(null);
  }, []);

  // Calcular región única basada en bounds
  const calculateRegionKey = useCallback((bounds) => {
    const { north, south, east, west } = bounds;
    // Redondear a 0.1 grados para agrupar regiones similares
    const latKey = Math.round(((north + south) / 2) * 10) / 10;
    const lngKey = Math.round(((east + west) / 2) * 10) / 10;
    return `${latKey.toFixed(1)},${lngKey.toFixed(1)}`;
  }, []);

  // Verificar si una región ya está cargada
  const isRegionLoaded = useCallback(
    (regionKey) => {
      return loadedRegions.has(regionKey);
    },
    [loadedRegions]
  );

  // Cargar propiedades por viewport
  const loadPropertiesByViewport = useCallback(
    async (bounds, forceReload = false) => {
      const regionKey = calculateRegionKey(bounds);

      // Si la región ya está cargada y no se fuerza recarga, usar cache
      if (!forceReload && isRegionLoaded(regionKey)) {
        console.log(`🗺️ Región ${regionKey} ya cargada, usando cache`);
        const cachedProperties = cache.get(regionKey) || [];
        setViewportProperties(cachedProperties);
        setError(null); // Limpiar cualquier error previo
        return;
      }

      // Verificar si el viewport es muy grande (zoom out extremo)
      const viewportSize = Math.max(
        bounds.north - bounds.south,
        bounds.east - bounds.west
      );

      if (viewportSize > VIEWPORT_CONFIG.maxViewportSize) {
        console.log(
          `🗺️ Viewport muy grande (${viewportSize.toFixed(
            2
          )}°), mostrando propiedades agrupadas`
        );
        // Para viewports muy grandes, mostrar propiedades agrupadas por región
        setViewportProperties([]);
        setError(null); // No es un error, solo no hay propiedades
        return;
      }

      // Verificar si el viewport es muy pequeño (zoom in extremo)
      if (viewportSize < VIEWPORT_CONFIG.minViewportSize) {
        console.log(
          `🗺️ Viewport muy pequeño (${viewportSize.toFixed(
            2
          )}°), ajustando búsqueda`
        );
        // Expandir ligeramente el viewport para la búsqueda
        const expansion = VIEWPORT_CONFIG.minViewportSize - viewportSize;
        bounds.north += expansion / 2;
        bounds.south -= expansion / 2;
        bounds.east += expansion / 2;
        bounds.west -= expansion / 2;
      }

      try {
        setLoading(true);
        setError(null); // Limpiar errores previos

        console.log(`🗺️ Cargando propiedades para viewport:`, bounds);
        console.log(`🗺️ Región: ${regionKey}`);

        // Cargar propiedades desde la API
        try {
          const response = await api.getPropertiesByBounds(
            bounds,
            VIEWPORT_CONFIG.pageSize
          );

          console.log(`🗺️ API Response:`, response);

          if (response?.data && response.data.length > 0) {
            console.log(
              `🗺️ Cargadas ${response.data.length} propiedades desde API para región ${regionKey}`
            );

            console.log(
              `🗺️ Total propiedades recibidas: ${response.data.length}`
            );

            // Filtrar propiedades con coordenadas válidas y mapear campos
            const validProperties = response.data.filter(
              (property) =>
                (property.lat && property.lng) ||
                (property.latitude && property.longitude)
            );

            console.log(
              `🗺️ Propiedades con coordenadas válidas: ${validProperties.length}`
            );
            console.log(`🗺️ Ejemplo de propiedad:`, validProperties[0]);

            if (validProperties.length > 0) {
              // Mapear y normalizar propiedades
              const propertiesWithType = validProperties.map((property) => ({
                ...property,
                // Normalizar coordenadas (el API usa latitude/longitude, pero el código espera lat/lng)
                lat: property.lat || property.latitude,
                lng: property.lng || property.longitude,
                // Normalizar nombre de la propiedad
                name:
                  property.prototypeName ||
                  property.title ||
                  `Propiedad ${property.prototypeId}`,
                // Agregar tipo de propiedad si no existe
                type:
                  property.type ||
                  (parseInt(property.bedroom) > 2 ? "house" : "apartment"),
              }));

              console.log(`🗺️ Propiedades mapeadas:`, propertiesWithType[0]);

              // Guardar en cache y marcar como cargada
              setCache((prev) =>
                new Map(prev).set(regionKey, propertiesWithType)
              );
              setLoadedRegions((prev) => new Set(prev).add(regionKey));
              setViewportProperties(propertiesWithType);
              setError(null); // Asegurar que no hay error
              return;
            } else {
              // No hay propiedades válidas en la respuesta
              console.log(
                `🗺️ No hay propiedades válidas en la respuesta de la API para región ${regionKey}`
              );
              handleNoPropertiesAvailable(regionKey);
              return;
            }
          } else {
            // La API no devolvió datos
            console.log(`🗺️ La API no devolvió datos para región ${regionKey}`);
            handleNoPropertiesAvailable(regionKey);
            return;
          }
        } catch (apiError) {
          console.error(
            "🗺️ Error al cargar propiedades desde la API:",
            apiError
          );
          // Solo establecer error si es un error real de API
          setError("Error al cargar propiedades. Intenta de nuevo más tarde.");
          setViewportProperties([]);
          return;
        }
      } catch (err) {
        console.error("Error loading properties by viewport:", err);
        // Solo establecer error si es un error real
        setError("Error al cargar propiedades para esta área");
      } finally {
        setLoading(false);
      }
    },
    [calculateRegionKey, isRegionLoaded, cache, handleNoPropertiesAvailable]
  );

  // Función debounced para cargar propiedades
  const loadPropertiesDebounced = useCallback(
    (bounds) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        loadPropertiesByViewport(bounds);
      }, VIEWPORT_CONFIG.debounceDelay);
    },
    [loadPropertiesByViewport]
  );

  // Limpiar timer al desmontar
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Prefetch regiones adyacentes
  const prefetchAdjacentRegions = useCallback(
    async (currentBounds) => {
      const { north, south, east, west } = currentBounds;
      const centerLat = (north + south) / 2;
      const centerLng = (east + west) / 2;

      // Calcular regiones adyacentes
      const adjacentBounds = [
        { north: north + 0.5, south: south + 0.5, east, west }, // Norte
        { north: north - 0.5, south: south - 0.5, east, west }, // Sur
        { north, south, east: east + 0.5, west: west + 0.5 }, // Este
        { north, south, east: east - 0.5, west: west - 0.5 }, // Oeste
      ];

      // Cargar regiones adyacentes en background
      adjacentBounds.forEach((bounds) => {
        const regionKey = calculateRegionKey(bounds);
        if (!isRegionLoaded(regionKey)) {
          console.log(`🗺️ Prefetching región adyacente: ${regionKey}`);
          loadPropertiesByViewport(bounds, false);
        }
      });
    },
    [calculateRegionKey, isRegionLoaded, loadPropertiesByViewport]
  );

  // Obtener estadísticas del viewport actual
  const getViewportStats = useCallback(() => {
    if (viewportProperties.length === 0) return null;

    const totalProperties = viewportProperties.length;
    const houses = viewportProperties.filter((p) => p.type === "house").length;
    const apartments = viewportProperties.filter(
      (p) => p.type === "apartment"
    ).length;
    const totalPrice = viewportProperties.reduce(
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
      region: currentBoundsRef.current
        ? calculateRegionKey(currentBoundsRef.current)
        : "Unknown",
    };
  }, [viewportProperties, calculateRegionKey]);

  // Limpiar cache de regiones lejanas
  const cleanupDistantCache = useCallback(
    (currentBounds) => {
      const currentRegion = calculateRegionKey(currentBounds);

      setCache((prev) => {
        const newCache = new Map();
        for (const [regionKey, properties] of prev) {
          // Mantener solo regiones cercanas al viewport actual
          if (
            regionKey === currentRegion ||
            Math.abs(
              parseFloat(regionKey.split(",")[0]) -
                (currentBounds.north + currentBounds.south) / 2
            ) < 2
          ) {
            newCache.set(regionKey, properties);
          }
        }
        return newCache;
      });
    },
    [calculateRegionKey]
  );

  return {
    viewportProperties,
    loading,
    error,
    loadPropertiesDebounced,
    loadPropertiesByViewport,
    prefetchAdjacentRegions,
    cleanupDistantCache,
    getViewportStats,
    isRegionLoaded,
    loadedRegionsCount: loadedRegions.size,
    cacheSize: cache.size,
  };
};
