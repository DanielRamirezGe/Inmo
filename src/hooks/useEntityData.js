import { useState, useCallback, useEffect } from "react";
import { api } from "../services/api";
import { FORM_TYPES } from "../app/admin/properties/constants";
import { createInitialPagination } from "../constants/pagination";

export const useEntityData = (entityType) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(
    createInitialPagination("PROPERTIES")
  );

  const fetchItems = useCallback(
    async (
      page = 1,
      pageSize = createInitialPagination("PROPERTIES").pageSize,
      forceRefresh = false
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

        // Forzar actualización del estado para evitar problemas de cache
        setItems([]); // Limpiar primero
        setTimeout(() => {
          setItems(response.data || []);
          setPagination({
            page: response.page || page,
            pageSize: response.pageSize || pageSize,
            total: response.total || 0,
          });
        }, forceRefresh ? 100 : 0); // Pequeño delay para forzar re-render
      } catch (error) {
        console.error("Error al obtener items:", error);
        setError("Error al cargar los datos");
      } finally {
        setLoading(false);
      }
    },
    [entityType]
  );

  const getItemDetails = async (itemId) => {
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

    setLoading(true);
    setError(null);

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

      return response;
    } catch (error) {
      console.error(
        `Error al obtener detalles del item (${entityType} ID: ${normalizedId}):`,
        error
      );
      setError(`Error al obtener los detalles: ${error.message}`);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const saveItem = useCallback(
    async (formData, itemId = null) => {
      if (!entityType) return false;

      setLoading(true);
      setError(null);
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

        // Actualizar la lista de items después de guardar
        await fetchItems();
        return true;
      } catch (error) {
        console.error("Error al guardar item:", error);
        setError(error.message || "Error al guardar los datos");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [entityType, fetchItems]
  );

  const deleteItem = useCallback(
    async (itemId) => {
      if (!entityType || !itemId) return false;

      setLoading(true);
      setError(null);
      try {
        // Configuración de operaciones de eliminación por tipo de entidad
        const deleteOperations = {
          [FORM_TYPES.DEVELOPER]: () => api.deleteDeveloper(itemId),
          [FORM_TYPES.DEVELOPMENT]: () => api.deleteDevelopment(itemId),
          [FORM_TYPES.PROPERTY_NOT_PUBLISHED]: () => api.deleteProperty(itemId),
          [FORM_TYPES.PROPERTY_MINKAASA_UNPUBLISHED]: () =>
            api.deleteMinkaasaProperty(itemId),
          // Propiedades publicadas no se pueden eliminar
          [FORM_TYPES.PROPERTY_PUBLISHED]: () => {
            throw new Error("No se permite eliminar propiedades publicadas");
          },
          [FORM_TYPES.PROPERTY_MINKAASA_PUBLISHED]: () => {
            throw new Error(
              "No se permite eliminar propiedades Minkaasa publicadas"
            );
          },
        };

        const deleteOperation = deleteOperations[entityType];
        if (!deleteOperation) {
          throw new Error(`Tipo de entidad no válido: ${entityType}`);
        }

        await deleteOperation();

        // Actualizar la lista de items después de eliminar
        await fetchItems();
        return true;
      } catch (error) {
        console.error("Error al eliminar item:", error);
        setError(error.message || "Error al eliminar el elemento");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [entityType, fetchItems]
  );

  // Función para forzar refrescar datos (útil para después de operaciones)
  const forceRefresh = useCallback(async () => {
    console.log(`🔄 Force refreshing data for ${entityType}`);
    await fetchItems(1, pagination.pageSize, true);
  }, [fetchItems, pagination.pageSize, entityType]);

  return {
    items,
    loading,
    error,
    pagination,
    fetchItems,
    getItemDetails,
    saveItem,
    deleteItem,
    forceRefresh, // Nueva función para forzar refrescar
    // Funciones para actualizar estado directamente (útil para búsquedas)
    setItems,
    setPagination,
  };
};
