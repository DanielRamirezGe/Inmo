import {
  useState,
  useCallback,
  useEffect,
  createContext,
  useContext,
  useRef,
} from "react";
import { api } from "../services/api";
import { FORM_TYPES } from "../app/admin/properties/constants";
import { createInitialPagination } from "../constants/pagination";

// Contexto global para el estado de entidades
const GlobalEntityStateContext = createContext();

// Configuración de cache y timing
const CACHE_CONFIG = {
  DEFAULT_TTL: 30000, // 30 segundos
  INVALIDATION_DELAY: 1000, // 1 segundo para batch operations
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
};

// Estados iniciales para cada tipo de entidad
const createInitialEntityState = () => ({
  items: [],
  loading: false,
  error: null,
  pagination: createInitialPagination("PROPERTIES"),
  lastUpdated: 0,
  cacheInvalidated: false,
  requestId: null, // Para cancelar requests obsoletos
});

// Provider component mejorado
export const GlobalEntityStateProvider = ({ children }) => {
  // Estado central mejorado
  const [globalState, setGlobalState] = useState({
    [FORM_TYPES.DEVELOPER]: createInitialEntityState(),
    [FORM_TYPES.DEVELOPMENT]: createInitialEntityState(),
    [FORM_TYPES.PROPERTY_NOT_PUBLISHED]: createInitialEntityState(),
    [FORM_TYPES.PROPERTY_PUBLISHED]: createInitialEntityState(),
    [FORM_TYPES.PROPERTY_MINKAASA_UNPUBLISHED]: createInitialEntityState(),
    [FORM_TYPES.PROPERTY_MINKAASA_PUBLISHED]: createInitialEntityState(),
  });

  // Referencias para control de lifecycle
  const mountedRef = useRef(true);
  const pendingOperationsRef = useRef(new Map());
  const invalidationTimeoutsRef = useRef(new Map());

  // Cleanup al desmontarse
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      // Cancelar operaciones pendientes
      pendingOperationsRef.current.forEach((controller) => {
        if (controller && typeof controller.abort === "function") {
          controller.abort();
        }
      });
      // Limpiar timeouts
      invalidationTimeoutsRef.current.forEach((timeout) => {
        clearTimeout(timeout);
      });
    };
  }, []);

  // ✅ Función thread-safe para actualizar estado de entidad
  const updateEntityState = useCallback((entityType, updates) => {
    if (!mountedRef.current) return;

    setGlobalState((prevState) => {
      // Verificar que la entidad existe
      if (!prevState[entityType]) {
        console.warn(`Entity type ${entityType} not found in global state`);
        return prevState;
      }

      const newState = {
        ...prevState,
        [entityType]: {
          ...prevState[entityType],
          ...updates,
          lastUpdated: updates.lastUpdated || Date.now(),
        },
      };

      console.log(`🔄 State updated for ${entityType}:`, {
        hasItems: newState[entityType].items?.length || 0,
        loading: newState[entityType].loading,
        error: newState[entityType].error,
        lastUpdated: new Date(
          newState[entityType].lastUpdated
        ).toLocaleTimeString(),
      });

      return newState;
    });
  }, []);

  // ✅ Sistema mejorado de invalidación de cache
  const invalidateEntityCache = useCallback(
    (entityType, delay = 0) => {
      if (!mountedRef.current) return;

      const invalidate = () => {
        if (!mountedRef.current) return;

        updateEntityState(entityType, {
          lastUpdated: 0,
          cacheInvalidated: true,
        });

        console.log(`💥 Cache invalidated for ${entityType}`);
      };

      if (delay > 0) {
        // Cancelar invalidación previa si existe
        const existingTimeout = invalidationTimeoutsRef.current.get(entityType);
        if (existingTimeout) {
          clearTimeout(existingTimeout);
        }

        // Programar nueva invalidación
        const timeoutId = setTimeout(invalidate, delay);
        invalidationTimeoutsRef.current.set(entityType, timeoutId);
      } else {
        invalidate();
      }
    },
    [updateEntityState]
  );

  // ✅ Invalidar todo el cache
  const invalidateAllCache = useCallback(() => {
    console.log("🔥 Invalidating all cache");
    Object.keys(globalState).forEach((entityType) => {
      invalidateEntityCache(entityType);
    });
  }, [globalState, invalidateEntityCache]);

  // ✅ Mapeo mejorado de relaciones entre entidades
  const getRelatedEntities = useCallback((entityType, operationType) => {
    const relationships = {
      [FORM_TYPES.DEVELOPER]: {
        UPDATE: [FORM_TYPES.DEVELOPMENT],
        DELETE: [
          FORM_TYPES.DEVELOPMENT,
          FORM_TYPES.PROPERTY_NOT_PUBLISHED,
          FORM_TYPES.PROPERTY_PUBLISHED,
        ],
        CREATE: [],
      },
      [FORM_TYPES.DEVELOPMENT]: {
        UPDATE: [
          FORM_TYPES.PROPERTY_NOT_PUBLISHED,
          FORM_TYPES.PROPERTY_PUBLISHED,
        ],
        DELETE: [
          FORM_TYPES.PROPERTY_NOT_PUBLISHED,
          FORM_TYPES.PROPERTY_PUBLISHED,
        ],
        CREATE: [],
      },
      [FORM_TYPES.PROPERTY_NOT_PUBLISHED]: {
        PUBLISH: [FORM_TYPES.PROPERTY_PUBLISHED],
        UPDATE: [],
        DELETE: [],
        CREATE: [],
      },
      [FORM_TYPES.PROPERTY_PUBLISHED]: {
        UNPUBLISH: [FORM_TYPES.PROPERTY_NOT_PUBLISHED],
        UPDATE: [],
        DELETE: [],
        CREATE: [],
      },
      [FORM_TYPES.PROPERTY_MINKAASA_UNPUBLISHED]: {
        PUBLISH: [FORM_TYPES.PROPERTY_MINKAASA_PUBLISHED],
        UPDATE: [],
        DELETE: [],
        CREATE: [],
      },
      [FORM_TYPES.PROPERTY_MINKAASA_PUBLISHED]: {
        UNPUBLISH: [FORM_TYPES.PROPERTY_MINKAASA_UNPUBLISHED],
        UPDATE: [],
        DELETE: [],
        CREATE: [],
      },
    };

    return relationships[entityType]?.[operationType] || [];
  }, []);

  // ✅ Función mejorada para refrescar entidades relacionadas
  const refreshRelatedEntities = useCallback(
    async (entityType, operationType) => {
      if (!mountedRef.current) return;

      try {
        const relatedEntities = getRelatedEntities(entityType, operationType);

        console.log(
          `🔗 Refreshing related entities for ${entityType}.${operationType}:`,
          relatedEntities
        );

        // Invalidar la entidad principal inmediatamente
        invalidateEntityCache(entityType);

        // Invalidar entidades relacionadas con delay para batch operations
        relatedEntities.forEach((relatedEntityType) => {
          invalidateEntityCache(
            relatedEntityType,
            CACHE_CONFIG.INVALIDATION_DELAY
          );
        });

        return true;
      } catch (error) {
        console.error("Error refreshing related entities:", error);
        return false;
      }
    },
    [getRelatedEntities, invalidateEntityCache]
  );

  // ✅ Sistema de debugging mejorado
  const debugGlobalState = useCallback(() => {
    console.group("🔍 Global State Debug");

    Object.entries(globalState).forEach(([entityType, state]) => {
      const timeSinceUpdate = Date.now() - (state.lastUpdated || 0);

      console.log(`📊 ${entityType}:`, {
        itemsCount: state.items?.length || 0,
        loading: state.loading,
        error: !!state.error,
        lastUpdated: state.lastUpdated
          ? new Date(state.lastUpdated).toLocaleTimeString()
          : "Never",
        timeSinceUpdate: `${Math.round(timeSinceUpdate / 1000)}s`,
        cacheInvalidated: state.cacheInvalidated,
        pagination: state.pagination,
      });
    });

    console.log("📈 Pending Operations:", pendingOperationsRef.current.size);
    console.log(
      "⏱️ Invalidation Timeouts:",
      invalidationTimeoutsRef.current.size
    );

    console.groupEnd();
  }, [globalState]);

  // ✅ Función para cancelar operación pendiente
  const cancelPendingOperation = useCallback((entityType) => {
    const controller = pendingOperationsRef.current.get(entityType);
    if (controller && typeof controller.abort === "function") {
      controller.abort();
      pendingOperationsRef.current.delete(entityType);
      console.log(`🚫 Cancelled pending operation for ${entityType}`);
    }
  }, []);

  // ✅ Función para registrar operación pendiente
  const registerPendingOperation = useCallback(
    (entityType, controller) => {
      // Cancelar operación previa si existe
      cancelPendingOperation(entityType);

      // Registrar nueva operación
      pendingOperationsRef.current.set(entityType, controller);

      // Auto-limpiar cuando termine
      if (controller && controller.signal) {
        controller.signal.addEventListener("abort", () => {
          pendingOperationsRef.current.delete(entityType);
        });
      }
    },
    [cancelPendingOperation]
  );

  // Valor del contexto
  const contextValue = {
    globalState,
    updateEntityState,
    refreshRelatedEntities,
    invalidateEntityCache,
    invalidateAllCache,
    debugGlobalState,
    cancelPendingOperation,
    registerPendingOperation,
    // Helpers para debugging
    _internal: {
      mountedRef,
      pendingOperationsRef,
      invalidationTimeoutsRef,
      cacheConfig: CACHE_CONFIG,
    },
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
    throw new Error(
      "useGlobalEntityState must be used within a GlobalEntityStateProvider"
    );
  }
  return context;
};

// ✅ Hook mejorado que usa el estado global
export const useEntityData = (entityType) => {
  const {
    globalState,
    updateEntityState,
    refreshRelatedEntities,
    invalidateEntityCache,
    cancelPendingOperation,
    registerPendingOperation,
  } = useGlobalEntityState();

  const entityState = globalState[entityType];
  const retryCountRef = useRef(0);

  // ✅ Función mejorada para fetch con manejo de errores y cancelación
  const fetchItems = useCallback(
    async (page = 1, pageSize = null, forceRefresh = false) => {
      if (!entityType) return;

      const currentState = globalState[entityType];
      if (!currentState) {
        console.error(`Entity type ${entityType} not found`);
        return;
      }

      const now = Date.now();
      const lastUpdated = currentState.lastUpdated || 0;
      const timeSinceUpdate = now - lastUpdated;
      const cacheInvalidated = currentState.cacheInvalidated;

      // ✅ Lógica mejorada de cache
      const shouldUseCacheData =
        !forceRefresh &&
        !cacheInvalidated &&
        lastUpdated > 0 &&
        timeSinceUpdate < CACHE_CONFIG.DEFAULT_TTL &&
        currentState.items.length > 0 &&
        !currentState.loading;

      if (shouldUseCacheData) {
        console.log(
          `🚀 Using cached data for ${entityType} (${Math.round(
            timeSinceUpdate / 1000
          )}s old)`
        );
        return;
      }

      // Cancelar operación previa si existe
      cancelPendingOperation(entityType);

      // Crear nuevo AbortController
      const controller = new AbortController();
      registerPendingOperation(entityType, controller);

      // Determinar pageSize
      const finalPageSize = pageSize || currentState.pagination?.pageSize || 10;

      updateEntityState(entityType, {
        loading: true,
        error: null,
        cacheInvalidated: false,
      });

      try {
        let response;
        const requestParams = { page, pageSize: finalPageSize };

        // ✅ Mapeo corregido de endpoints
        switch (entityType) {
          case FORM_TYPES.DEVELOPER:
            response = await api.getDevelopers(page, finalPageSize);
            break;
          case FORM_TYPES.DEVELOPMENT:
            response = await api.getDevelopments(page, finalPageSize);
            break;
          case FORM_TYPES.PROPERTY_NOT_PUBLISHED:
            response = await api.getNotPublishedProperties(page, finalPageSize);
            break;
          case FORM_TYPES.PROPERTY_PUBLISHED:
            response = await api.getPublishedProperties(page, finalPageSize);
            break;
          case FORM_TYPES.PROPERTY_MINKAASA_UNPUBLISHED:
            response = await api.getMinkaasaUnpublishedProperties(
              page,
              finalPageSize
            );
            break;
          case FORM_TYPES.PROPERTY_MINKAASA_PUBLISHED:
            response = await api.getMinkaasaPublishedProperties(
              page,
              finalPageSize
            );
            break;
          default:
            throw new Error(`Unknown entity type: ${entityType}`);
        }

        // Verificar si la operación fue cancelada
        if (controller.signal.aborted) {
          console.log(`🚫 Request cancelled for ${entityType}`);
          return;
        }

        if (response && response.data) {
          updateEntityState(entityType, {
            items: response.data,
            loading: false,
            error: null,
            pagination: {
              page: response.page || page,
              pageSize: response.pageSize || finalPageSize,
              total: response.total || 0,
            },
          });

          retryCountRef.current = 0; // Reset retry count on success
          console.log(
            `✅ Successfully fetched ${response.data.length} items for ${entityType}`
          );
        } else {
          throw new Error("Invalid response format");
        }
      } catch (error) {
        // No actualizar estado si fue cancelado
        if (controller.signal.aborted) {
          return;
        }

        console.error(`❌ Error fetching ${entityType}:`, error);

        // ✅ Sistema de retry mejorado
        if (
          retryCountRef.current < CACHE_CONFIG.MAX_RETRIES &&
          !error.message.includes("cancelled")
        ) {
          retryCountRef.current++;
          console.log(
            `🔄 Retrying ${entityType} fetch (attempt ${retryCountRef.current}/${CACHE_CONFIG.MAX_RETRIES})`
          );

          setTimeout(() => {
            fetchItems(page, pageSize, forceRefresh);
          }, CACHE_CONFIG.RETRY_DELAY * retryCountRef.current);

          return;
        }

        updateEntityState(entityType, {
          loading: false,
          error: error.message || `Error al cargar ${entityType}`,
        });

        retryCountRef.current = 0;
      } finally {
        // Limpiar operación pendiente
        cancelPendingOperation(entityType);
      }
    },
    [
      entityType,
      globalState,
      updateEntityState,
      cancelPendingOperation,
      registerPendingOperation,
    ]
  );

  // ✅ Función mejorada para guardar items
  const saveItem = useCallback(
    async (itemData, itemId = null) => {
      if (!entityType) return false;

      const controller = new AbortController();
      registerPendingOperation(`${entityType}-save`, controller);

      try {
        updateEntityState(entityType, { loading: true, error: null });

        let response;
        const isUpdate = !!itemId;

        // ✅ Mapeo mejorado de operaciones de guardado
        switch (entityType) {
          case FORM_TYPES.DEVELOPER:
            response = isUpdate
              ? await api.updateDeveloper(itemId, itemData)
              : await api.createDeveloper(itemData);
            break;
          case FORM_TYPES.DEVELOPMENT:
            response = isUpdate
              ? await api.updateDevelopment(itemId, itemData)
              : await api.createDevelopment(itemData);
            break;
          case FORM_TYPES.PROPERTY_NOT_PUBLISHED:
          case FORM_TYPES.PROPERTY_PUBLISHED:
            response = isUpdate
              ? await api.updateProperty(itemId, itemData)
              : await api.createProperty(itemData);
            break;
          case FORM_TYPES.PROPERTY_MINKAASA_UNPUBLISHED:
          case FORM_TYPES.PROPERTY_MINKAASA_PUBLISHED:
            response = isUpdate
              ? await api.updateMinkaasaProperty(itemId, itemData)
              : await api.createMinkaasaProperty(itemData);
            break;
          default:
            throw new Error(`Save operation not implemented for ${entityType}`);
        }

        if (controller.signal.aborted) return false;

        if (response && response.success) {
          // ✅ Invalidar cache después de guardar
          await refreshRelatedEntities(
            entityType,
            isUpdate ? "UPDATE" : "CREATE"
          );

          // ✅ SOLUCIÓN: Refrescar datos inmediatamente después de guardar
          await fetchItems(1, null, true); // Force refresh de la lista actual

          updateEntityState(entityType, { loading: false, error: null });

          console.log(
            `✅ Successfully ${
              isUpdate ? "updated" : "created"
            } ${entityType} item`
          );
          return true;
        } else {
          throw new Error(response?.error || "Save operation failed");
        }
      } catch (error) {
        if (controller.signal.aborted) return false;

        console.error(`❌ Error saving ${entityType}:`, error);
        updateEntityState(entityType, {
          loading: false,
          error: error.message || "Error al guardar",
        });
        return false;
      } finally {
        cancelPendingOperation(`${entityType}-save`);
      }
    },
    [
      entityType,
      updateEntityState,
      refreshRelatedEntities,
      registerPendingOperation,
      cancelPendingOperation,
    ]
  );

  // ✅ Función mejorada para eliminar items
  const deleteItem = useCallback(
    async (itemId) => {
      if (!entityType || !itemId) return false;

      const controller = new AbortController();
      registerPendingOperation(`${entityType}-delete`, controller);

      try {
        updateEntityState(entityType, { loading: true, error: null });

        let response;

        // ✅ Mapeo mejorado de operaciones de eliminación
        switch (entityType) {
          case FORM_TYPES.DEVELOPER:
            await api.deleteDeveloper(itemId);
            response = { success: true };
            break;
          case FORM_TYPES.DEVELOPMENT:
            await api.deleteDevelopment(itemId);
            response = { success: true };
            break;
          case FORM_TYPES.PROPERTY_NOT_PUBLISHED:
          case FORM_TYPES.PROPERTY_PUBLISHED:
            await api.deleteProperty(itemId);
            response = { success: true };
            break;
          case FORM_TYPES.PROPERTY_MINKAASA_UNPUBLISHED:
          case FORM_TYPES.PROPERTY_MINKAASA_PUBLISHED:
            await api.deleteMinkaasaProperty(itemId);
            response = { success: true };
            break;
          default:
            throw new Error(
              `Delete operation not implemented for ${entityType}`
            );
        }

        if (controller.signal.aborted) return false;

        if (response && response.success) {
          // ✅ Invalidar cache después de eliminar
          await refreshRelatedEntities(entityType, "DELETE");

          // ✅ SOLUCIÓN: Refrescar datos inmediatamente después de eliminar
          await fetchItems(1, null, true); // Force refresh de la lista actual

          updateEntityState(entityType, { loading: false, error: null });

          console.log(
            `✅ Successfully deleted ${entityType} item with ID: ${itemId}`
          );
          return true;
        } else {
          throw new Error("Delete operation failed");
        }
      } catch (error) {
        if (controller.signal.aborted) return false;

        console.error(`❌ Error deleting ${entityType}:`, error);
        updateEntityState(entityType, {
          loading: false,
          error: error.message || "Error al eliminar",
        });
        return false;
      } finally {
        cancelPendingOperation(`${entityType}-delete`);
      }
    },
    [
      entityType,
      updateEntityState,
      refreshRelatedEntities,
      registerPendingOperation,
      cancelPendingOperation,
    ]
  );

  // ✅ Función mejorada para obtener detalles de item
  const getItemDetails = useCallback(
    async (itemId) => {
      if (!entityType || !itemId) return null;

      const controller = new AbortController();
      registerPendingOperation(`${entityType}-details`, controller);

      try {
        updateEntityState(entityType, { loading: true, error: null });

        let response;

        // ✅ Mapeo mejorado de operaciones de detalles
        switch (entityType) {
          case FORM_TYPES.DEVELOPER:
            response = await api.getDeveloper(itemId);
            break;
          case FORM_TYPES.DEVELOPMENT:
            response = await api.getDevelopment(itemId);
            break;
          case FORM_TYPES.PROPERTY_NOT_PUBLISHED:
          case FORM_TYPES.PROPERTY_PUBLISHED:
            response = await api.getProperty(itemId);
            break;
          case FORM_TYPES.PROPERTY_MINKAASA_UNPUBLISHED:
          case FORM_TYPES.PROPERTY_MINKAASA_PUBLISHED:
            response = await api.getMinkaasaProperty(itemId);
            break;
          default:
            throw new Error(
              `Get details operation not implemented for ${entityType}`
            );
        }

        if (controller.signal.aborted) return null;

        updateEntityState(entityType, { loading: false, error: null });

        console.log(
          `✅ Successfully fetched details for ${entityType} item: ${itemId}`
        );
        return response;
      } catch (error) {
        if (controller.signal.aborted) return null;

        console.error(`❌ Error fetching details for ${entityType}:`, error);
        updateEntityState(entityType, {
          loading: false,
          error: error.message || "Error al obtener detalles",
        });
        return null;
      } finally {
        cancelPendingOperation(`${entityType}-details`);
      }
    },
    [
      entityType,
      updateEntityState,
      registerPendingOperation,
      cancelPendingOperation,
    ]
  );

  // ✅ Return mejorado con funciones adicionales
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
    setPagination: (pagination) =>
      updateEntityState(entityType, { pagination }),
    // Función para refrescar entidades relacionadas
    refreshRelated: (operationType) =>
      refreshRelatedEntities(entityType, operationType),
    // ✅ Funciones de debugging y control mejoradas
    debugState: () => console.log(`🔍 ${entityType} state:`, entityState),
    invalidateCache: () => invalidateEntityCache(entityType),
    cancelOperations: () => cancelPendingOperation(entityType),
    // ✅ Información adicional de estado
    isStale: () => {
      const timeSinceUpdate = Date.now() - (entityState.lastUpdated || 0);
      return (
        timeSinceUpdate > CACHE_CONFIG.DEFAULT_TTL ||
        entityState.cacheInvalidated
      );
    },
    lastUpdated: entityState.lastUpdated,
    cacheInvalidated: entityState.cacheInvalidated,
  };
};
