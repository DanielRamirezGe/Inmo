import { useState, useCallback, useEffect, createContext, useContext } from "react";
import { api } from "../services/api";
import { FORM_TYPES } from "../app/admin/properties/constants";
import { createInitialPagination } from "../constants/pagination";

// Contexto global para el estado de entidades
const GlobalEntityStateContext = createContext();

// Provider component
export const GlobalEntityStateProvider = ({ children }) => {
  const [globalState, setGlobalState] = useState({
    [FORM_TYPES.DEVELOPER]: {
      items: [],
      loading: false,
      error: null,
      pagination: createInitialPagination("PROPERTIES"),
      lastUpdated: null,
    },
    [FORM_TYPES.DEVELOPMENT]: {
      items: [],
      loading: false,
      error: null,
      pagination: createInitialPagination("PROPERTIES"),
      lastUpdated: null,
    },
    [FORM_TYPES.PROPERTY_NOT_PUBLISHED]: {
      items: [],
      loading: false,
      error: null,
      pagination: createInitialPagination("PROPERTIES"),
      lastUpdated: null,
    },
    [FORM_TYPES.PROPERTY_PUBLISHED]: {
      items: [],
      loading: false,
      error: null,
      pagination: createInitialPagination("PROPERTIES"),
      lastUpdated: null,
    },
    [FORM_TYPES.PROPERTY_MINKAASA_UNPUBLISHED]: {
      items: [],
      loading: false,
      error: null,
      pagination: createInitialPagination("PROPERTIES"),
      lastUpdated: null,
    },
    [FORM_TYPES.PROPERTY_MINKAASA_PUBLISHED]: {
      items: [],
      loading: false,
      error: null,
      pagination: createInitialPagination("PROPERTIES"),
      lastUpdated: null,
    },
  });

  // Función para actualizar estado de una entidad específica
  const updateEntityState = useCallback((entityType, updates) => {
    setGlobalState(prevState => ({
      ...prevState,
      [entityType]: {
        ...prevState[entityType],
        ...updates,
        lastUpdated: Date.now(),
      }
    }));
  }, []);

  // Función para refrescar múltiples entidades relacionadas
  const refreshRelatedEntities = useCallback(async (updatedEntityType, operationType) => {
    const timestamp = Date.now();
    
    // Determinar qué entidades necesitan ser refrescadas según el tipo de operación
    const entitiesToRefresh = [];
    
    switch (operationType) {
      case 'PUBLISH':
        if (updatedEntityType === FORM_TYPES.PROPERTY_NOT_PUBLISHED) {
          entitiesToRefresh.push(
            FORM_TYPES.PROPERTY_NOT_PUBLISHED,
            FORM_TYPES.PROPERTY_PUBLISHED
          );
        } else if (updatedEntityType === FORM_TYPES.PROPERTY_MINKAASA_UNPUBLISHED) {
          entitiesToRefresh.push(
            FORM_TYPES.PROPERTY_MINKAASA_UNPUBLISHED,
            FORM_TYPES.PROPERTY_MINKAASA_PUBLISHED
          );
        }
        break;
      case 'UNPUBLISH':
        if (updatedEntityType === FORM_TYPES.PROPERTY_PUBLISHED) {
          entitiesToRefresh.push(
            FORM_TYPES.PROPERTY_NOT_PUBLISHED,
            FORM_TYPES.PROPERTY_PUBLISHED
          );
        } else if (updatedEntityType === FORM_TYPES.PROPERTY_MINKAASA_PUBLISHED) {
          entitiesToRefresh.push(
            FORM_TYPES.PROPERTY_MINKAASA_UNPUBLISHED,
            FORM_TYPES.PROPERTY_MINKAASA_PUBLISHED
          );
        }
        break;
      case 'UPDATE':
      case 'DELETE':
      case 'CREATE':
        // Para estas operaciones, solo refrescar la entidad afectada
        entitiesToRefresh.push(updatedEntityType);
        break;
      default:
        entitiesToRefresh.push(updatedEntityType);
    }

    // Refrescar todas las entidades relacionadas en paralelo
    const refreshPromises = entitiesToRefresh.map(async (entityType) => {
      try {
        updateEntityState(entityType, { loading: true, error: null });
        
        const currentState = globalState[entityType];
        const page = currentState.pagination.page;
        const pageSize = currentState.pagination.pageSize;
        
        // 🔧 FIX: Invalidar cache forzando timestamp a 0 para este refresh
        updateEntityState(entityType, { lastUpdated: 0 });
        
        console.log(`🔄 Force refreshing ${entityType} for ${operationType} operation (bypassing cache)`);
        
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
            response = await api.getMinkaasaUnpublishedProperties(page, pageSize);
            break;
          case FORM_TYPES.PROPERTY_MINKAASA_PUBLISHED:
            response = await api.getMinkaasaPublishedProperties(page, pageSize);
            break;
          default:
            throw new Error("Tipo de entidad no válido");
        }

        updateEntityState(entityType, {
          items: response.data || [],
          pagination: {
            page: response.page || page,
            pageSize: response.pageSize || pageSize,
            total: response.total || 0,
          },
          loading: false,
          error: null,
        });

        console.log(`✅ Entity ${entityType} refreshed at ${new Date(timestamp).toISOString()}`);
      } catch (error) {
        console.error(`❌ Error refreshing entity ${entityType}:`, error);
        updateEntityState(entityType, {
          loading: false,
          error: error.message || "Error al cargar los datos",
        });
      }
    });

    await Promise.all(refreshPromises);
    console.log(`🔄 Refreshed ${entitiesToRefresh.length} related entities for ${operationType} operation`);
  }, [globalState, updateEntityState]);

  // 🔧 DEBUG: Función para diagnosticar problemas de cache
  const debugGlobalState = useCallback(() => {
    console.log('🔍 GLOBAL STATE DEBUG:', {
      entities: Object.keys(globalState).map(entityType => ({
        type: entityType,
        itemsCount: globalState[entityType].items.length,
        lastUpdated: globalState[entityType].lastUpdated,
        timeSinceUpdate: globalState[entityType].lastUpdated 
          ? Date.now() - globalState[entityType].lastUpdated 
          : 'never',
        loading: globalState[entityType].loading,
        error: globalState[entityType].error
      }))
    });
  }, [globalState]);

  // 🔧 FIX: Función para invalidar cache completamente
  const invalidateAllCache = useCallback(() => {
    console.log('💥 Invalidating all cache');
    Object.keys(globalState).forEach(entityType => {
      updateEntityState(entityType, { lastUpdated: 0 });
    });
  }, [globalState, updateEntityState]);

  const contextValue = {
    globalState,
    updateEntityState,
    refreshRelatedEntities,
    debugGlobalState,
    invalidateAllCache,
  };

  return (
    <GlobalEntityStateContext.Provider value={contextValue}>
      {children}
    </GlobalEntityStateContext.Provider>
  );
};

// Hook para usar el estado global
export const useGlobalEntityState = () => {
  const context = useContext(GlobalEntityStateContext);
  if (!context) {
    throw new Error('useGlobalEntityState must be used within a GlobalEntityStateProvider');
  }
  return context;
};

// Hook mejorado que usa el estado global
export const useEntityData = (entityType) => {
  const { globalState, updateEntityState, refreshRelatedEntities } = useGlobalEntityState();
  
  const entityState = globalState[entityType];

  const fetchItems = useCallback(
    async (page = 1, pageSize = createInitialPagination("PROPERTIES").pageSize, forceRefresh = false) => {
      if (!entityType) return;

      // 🔧 FIX: Verificar si necesitamos refrescar los datos
      const currentState = globalState[entityType];
      const now = Date.now();
      const lastUpdated = currentState.lastUpdated || 0;
      const timeSinceUpdate = now - lastUpdated;
      
      // Si no es un refresh forzado y los datos son recientes (menos de 2 segundos), no hacer nada
      // EXCEPT si lastUpdated es 0 (cache invalidado intencionalmente)
      if (!forceRefresh && lastUpdated > 0 && timeSinceUpdate < 2000 && currentState.items.length > 0) {
        console.log(`🚀 Using cached data for ${entityType} (${timeSinceUpdate}ms old)`);
        return;
      }
      
      // Si el cache fue invalidado (lastUpdated = 0), siempre hacer fetch
      const cacheInvalidated = lastUpdated === 0;
      if (cacheInvalidated) {
        console.log(`💥 Cache invalidated for ${entityType}, forcing fresh data fetch`);
      }

      updateEntityState(entityType, { loading: true, error: null });
      
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
            response = await api.getMinkaasaUnpublishedProperties(page, pageSize);
            break;
          case FORM_TYPES.PROPERTY_MINKAASA_PUBLISHED:
            response = await api.getMinkaasaPublishedProperties(page, pageSize);
            break;
          default:
            throw new Error("Tipo de entidad no válido");
        }

        updateEntityState(entityType, {
          items: response.data || [],
          pagination: {
            page: response.page || page,
            pageSize: response.pageSize || pageSize,
            total: response.total || 0,
          },
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error("Error al obtener items:", error);
        updateEntityState(entityType, {
          loading: false,
          error: "Error al cargar los datos",
        });
      }
    },
    [entityType, updateEntityState, globalState]
  );

  const saveItem = useCallback(
    async (formData, itemId = null) => {
      if (!entityType) return false;

      updateEntityState(entityType, { loading: true, error: null });
      
      try {
        const isEditing = !!itemId;

        // Validar que no se use saveItem para creación nueva de CUALQUIER propiedad
        // Todas las propiedades deben usar el proceso multi-paso
        const isPropertyType = [
          FORM_TYPES.PROPERTY_NOT_PUBLISHED,
          FORM_TYPES.PROPERTY_PUBLISHED,
          FORM_TYPES.PROPERTY_MINKAASA_UNPUBLISHED,
          FORM_TYPES.PROPERTY_MINKAASA_PUBLISHED,
        ].includes(entityType);

        if (!isEditing && isPropertyType) {
          throw new Error(
            `❌ DEPRECATED: Use multi-step creation process for new ${entityType}. ` +
              "Property creation must go through FormDialog multi-step process (basic → descriptions → images)."
          );
        }

        // Configuración de operaciones por tipo de entidad
        const operations = {
          [FORM_TYPES.DEVELOPER]: {
            create: () => api.createDeveloper(formData),
            update: () => api.updateDeveloper(itemId, formData),
          },
          [FORM_TYPES.DEVELOPMENT]: {
            create: () => api.createDevelopment(formData),
            update: () => api.updateDevelopment(itemId, formData),
          },
          // Las propiedades ahora usan edición multi-paso
          [FORM_TYPES.PROPERTY_NOT_PUBLISHED]: {
            update: () => {
              throw new Error(
                "❌ DEPRECATED: Property editing now uses multi-step process. " +
                  "Use useMultiStepPropertyEdit hook instead of saveItem for property updates."
              );
            },
          },
          [FORM_TYPES.PROPERTY_PUBLISHED]: {
            update: () => {
              throw new Error(
                "❌ DEPRECATED: Property editing now uses multi-step process. " +
                  "Use useMultiStepPropertyEdit hook instead of saveItem for property updates."
              );
            },
          },
          [FORM_TYPES.PROPERTY_MINKAASA_UNPUBLISHED]: {
            update: () => {
              throw new Error(
                "❌ DEPRECATED: Property editing now uses multi-step process. " +
                  "Use useMultiStepPropertyEdit hook instead of saveItem for property updates."
              );
            },
          },
          [FORM_TYPES.PROPERTY_MINKAASA_PUBLISHED]: {
            update: () => {
              throw new Error(
                "❌ DEPRECATED: Property editing now uses multi-step process. " +
                  "Use useMultiStepPropertyEdit hook instead of saveItem for property updates."
              );
            },
          },
        };

        const operation = operations[entityType];
        if (!operation) {
          throw new Error(`Tipo de entidad no válido: ${entityType}`);
        }

        let response;
        if (isEditing) {
          if (!operation.update) {
            throw new Error(`Actualización no permitida para ${entityType}`);
          }
          response = await operation.update();
        } else {
          if (!operation.create) {
            throw new Error(`Creación no permitida para ${entityType}`);
          }
          response = await operation.create();
        }

        // 🔧 FIX: Refresh inmediato forzado después de guardar
        console.log(`✅ Successfully saved ${entityType}${itemId ? ` (ID: ${itemId})` : ' (new item)'}`);
        
        // Forzar refresh inmediato sin cache para asegurar que aparezcan los cambios
        updateEntityState(entityType, { loading: false });
        await refreshRelatedEntities(entityType, itemId ? 'UPDATE' : 'CREATE');
        
        return true;
      } catch (error) {
        console.error("Error al guardar item:", error);
        updateEntityState(entityType, {
          loading: false,
          error: error.message || "Error al guardar los datos",
        });
        return false;
      }
    },
    [entityType, refreshRelatedEntities, updateEntityState]
  );

  const deleteItem = useCallback(
    async (itemId) => {
      if (!entityType || !itemId) return false;

      updateEntityState(entityType, { loading: true, error: null });
      
      try {
        console.log(`🗑️ Deleting ${entityType} with ID: ${itemId}`);

        // Configuración de operaciones de eliminación por tipo de entidad
        const deleteOperations = {
          [FORM_TYPES.DEVELOPER]: () => api.deleteDeveloper(itemId),
          [FORM_TYPES.DEVELOPMENT]: () => api.deleteDevelopment(itemId),
          [FORM_TYPES.PROPERTY_NOT_PUBLISHED]: () => api.deleteProperty(itemId),
          [FORM_TYPES.PROPERTY_MINKAASA_UNPUBLISHED]: () => api.deleteMinkaasaProperty(itemId),
          // Propiedades publicadas no se pueden eliminar
          [FORM_TYPES.PROPERTY_PUBLISHED]: () => {
            throw new Error("No se permite eliminar propiedades publicadas");
          },
          [FORM_TYPES.PROPERTY_MINKAASA_PUBLISHED]: () => {
            throw new Error("No se permite eliminar propiedades Minkaasa publicadas");
          },
        };

        const deleteOperation = deleteOperations[entityType];
        if (!deleteOperation) {
          throw new Error(`Tipo de entidad no válido: ${entityType}`);
        }

        await deleteOperation();
        console.log(`✅ Successfully deleted ${entityType} with ID: ${itemId}`);

        // 🔧 FIX: Refresh inmediato forzado después de eliminar para evitar cache
        updateEntityState(entityType, { loading: false });
        
        // Forzar refresh completo sin usar cache para asegurar que la eliminación se refleje
        await refreshRelatedEntities(entityType, 'DELETE');
        
        // Invalidar cache completamente para este tipo de entidad
        updateEntityState(entityType, { lastUpdated: 0 });
        
        return true;
      } catch (error) {
        console.error("Error al eliminar item:", error);
        updateEntityState(entityType, {
          loading: false,
          error: error.message || "Error al eliminar el elemento",
        });
        return false;
      }
    },
    [entityType, refreshRelatedEntities, updateEntityState]
  );

  const getItemDetails = useCallback(
    async (itemId) => {
      console.log(
        `getItemDetails called with itemId=${itemId} and entityType=${entityType}`
      );

      if (!itemId) {
        console.error(`getItemDetails: Invalid itemId=${itemId}`);
        return null;
      }

      if (!entityType) {
        console.error(`getItemDetails: Invalid entityType=${entityType}`);
        return null;
      }

      // Función para normalizar y validar un ID
      const normalizeId = (id) => {
        // Si es un número o una cadena numérica, retornar como número
        if (typeof id === "number") return id;
        if (typeof id === "string" && !isNaN(id)) return parseInt(id, 10);
        // Si es un objeto o un valor no numérico, alertar
        console.warn(`Invalid ID format: ${id}, type: ${typeof id}`);
        return id;
      };

      // Validar y normalizar el ID
      const normalizedId = normalizeId(itemId);
      if (!normalizedId) {
        console.error(`getItemDetails: Failed to normalize ID: ${itemId}`);
        return null;
      }

      // Mapear el tipo de entidad a su endpoint y el nombre de la propiedad de ID
      const endpointConfig = {
        [FORM_TYPES.PROPERTY_NOT_PUBLISHED]: {
          path: "/prototype",
          idField: "prototypeId",
        },
        [FORM_TYPES.PROPERTY_PUBLISHED]: {
          path: "/prototype",
          idField: "prototypeId",
        },
        [FORM_TYPES.PROPERTY_MINKAASA_UNPUBLISHED]: {
          path: "/prototype/minkaasa",
          idField: "prototypeId",
        },
        [FORM_TYPES.PROPERTY_MINKAASA_PUBLISHED]: {
          path: "/prototype/minkaasa",
          idField: "prototypeId",
        },
        [FORM_TYPES.DEVELOPMENT]: {
          path: "/development",
          idField: "developmentId",
        },
        [FORM_TYPES.DEVELOPER]: {
          path: "/realEstateDevelopment",
          idField: "realEstateDevelopmentId",
        },
      }[entityType];

      if (!endpointConfig) {
        console.error(`getItemDetails: Unknown entity type - ${entityType}`);
        return null;
      }

      const { path: endpoint, idField } = endpointConfig;

      updateEntityState(entityType, { loading: true, error: null });

      try {
        console.log(
          `Fetching details for ${entityType} with normalized ID: ${normalizedId} from endpoint ${endpoint}`
        );

        // Construir la URL con el ID correcto
        const apiUrl = `${endpoint}/${normalizedId}`;
        console.log(`API URL: ${apiUrl}`);

        const response = await api.getItemById(endpoint, normalizedId);

        if (!response) {
          console.error(`No data received from ${endpoint}/${normalizedId}`);
          throw new Error(
            `No se recibieron datos del elemento con ID ${normalizedId}`
          );
        }

        console.log(`Details for ${entityType} received:`, response);

        // Si la respuesta contiene imágenes, asegurarnos de que estén en el formato correcto
        if (response && entityType === FORM_TYPES.DEVELOPMENT) {
          // Convertir las rutas de imágenes relativas a absolutas si es necesario
          const processedResponse = { ...response };

          // Manejo específico para desarrollo
          if (
            processedResponse.mainImage &&
            typeof processedResponse.mainImage === "string"
          ) {
            console.log(
              "Development mainImage is a string:",
              processedResponse.mainImage
            );
          }

          if (
            processedResponse.secondaryImages &&
            Array.isArray(processedResponse.secondaryImages)
          ) {
            console.log(
              "Development has secondaryImages:",
              processedResponse.secondaryImages.length
            );
          }

          return processedResponse;
        }

        updateEntityState(entityType, { loading: false });
        return response;
      } catch (error) {
        console.error(
          `Error al obtener detalles del item (${entityType} ID: ${normalizedId}):`,
          error
        );
        updateEntityState(entityType, {
          loading: false,
          error: `Error al obtener los detalles: ${error.message}`,
        });
        return null;
      }
    },
    [entityType, updateEntityState]
  );

  return {
    items: entityState.items,
    loading: entityState.loading,
    error: entityState.error,
    pagination: entityState.pagination,
    fetchItems,
    getItemDetails,
    saveItem,
    deleteItem,
    // Funciones para actualización directa
    setItems: (items) => updateEntityState(entityType, { items }),
    setPagination: (pagination) => updateEntityState(entityType, { pagination }),
    // Nueva función para refrescar entidades relacionadas
    refreshRelated: (operationType) => refreshRelatedEntities(entityType, operationType),
    // 🔧 DEBUG: Funciones de debugging
    debugState: () => console.log(`🔍 ${entityType} state:`, entityState),
    invalidateCache: () => updateEntityState(entityType, { lastUpdated: 0 }),
  };
}; 