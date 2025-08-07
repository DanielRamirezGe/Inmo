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
        
        console.log(`🔄 Force refreshing ${entityType} for ${operationType} operation`);
        
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

  const contextValue = {
    globalState,
    updateEntityState,
    refreshRelatedEntities,
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
      if (!forceRefresh && timeSinceUpdate < 2000 && currentState.items.length > 0) {
        console.log(`🚀 Using cached data for ${entityType} (${timeSinceUpdate}ms old)`);
        return;
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
      // Implementación similar a la original pero usando refreshRelatedEntities
      // ... (implementar según necesidades)
      await refreshRelatedEntities(entityType, itemId ? 'UPDATE' : 'CREATE');
      return true;
    },
    [entityType, refreshRelatedEntities]
  );

  const deleteItem = useCallback(
    async (itemId) => {
      // Implementación similar a la original pero usando refreshRelatedEntities
      // ... (implementar según necesidades)
      await refreshRelatedEntities(entityType, 'DELETE');
      return true;
    },
    [entityType, refreshRelatedEntities]
  );

  return {
    items: entityState.items,
    loading: entityState.loading,
    error: entityState.error,
    pagination: entityState.pagination,
    fetchItems,
    saveItem,
    deleteItem,
    // Funciones para actualización directa
    setItems: (items) => updateEntityState(entityType, { items }),
    setPagination: (pagination) => updateEntityState(entityType, { pagination }),
    // Nueva función para refrescar entidades relacionadas
    refreshRelated: (operationType) => refreshRelatedEntities(entityType, operationType),
  };
}; 