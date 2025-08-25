import { useState, useEffect, useCallback, useRef } from "react";
import { api } from "@/services/api";

// Configuración de carga por viewport
const VIEWPORT_CONFIG = {
  minViewportSize: 0.1, // 0.1 grados (~11km)
  maxViewportSize: 5, // 5 grados (~550km)
  debounceDelay: 300,
  pageSize: 50,
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
    setViewportProperties([]);
    setError(null);
  }, []);

  // Calcular región única basada en bounds
  const calculateRegionKey = useCallback((bounds) => {
    const { north, south, east, west } = bounds;
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
        const cachedProperties = cache.get(regionKey) || [];
        setViewportProperties(cachedProperties);
        setError(null);
        return;
      }

      // Verificar si el viewport es muy grande (zoom out extremo)
      const viewportSize = Math.max(
        bounds.north - bounds.south,
        bounds.east - bounds.west
      );

      if (viewportSize > VIEWPORT_CONFIG.maxViewportSize) {
        setViewportProperties([]);
        setError(null);
        return;
      }

      // Verificar si el viewport es muy pequeño (zoom in extremo)
      if (viewportSize < VIEWPORT_CONFIG.minViewportSize) {
        const expansion = VIEWPORT_CONFIG.minViewportSize - viewportSize;
        bounds.north += expansion / 2;
        bounds.south -= expansion / 2;
        bounds.east += expansion / 2;
        bounds.west -= expansion / 2;
      }

      try {
        setLoading(true);
        setError(null);

        // Cargar propiedades desde la API
        try {
          const response = await api.getPropertiesByBounds(
            bounds,
            VIEWPORT_CONFIG.pageSize
          );

          if (response?.data && response.data.length > 0) {
            // Filtrar propiedades con coordenadas válidas y mapear campos
            const validProperties = response.data.filter(
              (property) =>
                (property.lat && property.lng) ||
                (property.latitude && property.longitude)
            );

            if (validProperties.length > 0) {
              // Mapear y normalizar propiedades
              const propertiesWithType = validProperties.map((property) => ({
                ...property,
                lat: property.lat || property.latitude,
                lng: property.lng || property.longitude,
                name:
                  property.prototypeName ||
                  property.title ||
                  `Propiedad ${property.prototypeId}`,
                type:
                  property.type ||
                  (parseInt(property.bedroom) > 2 ? "house" : "apartment"),
              }));

              // Guardar en cache y marcar como cargada
              setCache((prev) =>
                new Map(prev).set(regionKey, propertiesWithType)
              );
              setLoadedRegions((prev) => new Set(prev).add(regionKey));
              setViewportProperties(propertiesWithType);
              setError(null);
              return;
            } else {
              handleNoPropertiesAvailable(regionKey);
              return;
            }
          } else {
            handleNoPropertiesAvailable(regionKey);
            return;
          }
        } catch (apiError) {
          console.error("Error al cargar propiedades desde la API:", apiError);
          setError("Error al cargar propiedades. Intenta de nuevo más tarde.");
          setViewportProperties([]);
          return;
        }
      } catch (err) {
        console.error("Error loading properties by viewport:", err);
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
    cleanupDistantCache,
  };
};
