import { useState, useCallback, useEffect } from "react";
import { api } from "../services/api";
import { useAxiosMiddleware } from "../utils/axiosMiddleware";
import { FORM_TYPES } from "../app/admin/properties/constants";

export const useEntityData = (entityType) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 15,
    total: 0,
  });

  // Obtener axiosInstance
  const axiosInstance = useAxiosMiddleware();

  const fetchItems = useCallback(
    async (page = 1, pageSize = 15) => {
      if (!entityType) return;

      setLoading(true);
      setError(null);
      try {
        let response;
        switch (entityType) {
          case FORM_TYPES.DEVELOPER:
            response = await api.getDevelopers(axiosInstance, page, pageSize);
            break;
          case FORM_TYPES.DEVELOPMENT:
            response = await api.getDevelopments(axiosInstance, page, pageSize);
            break;
          case FORM_TYPES.PROPERTY_NOT_PUBLISHED:
            response = await api.getNotPublishedProperties(
              axiosInstance,
              page,
              pageSize
            );
            break;
          case FORM_TYPES.PROPERTY_PUBLISHED:
            response = await api.getPublishedProperties(
              axiosInstance,
              page,
              pageSize
            );
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
    [entityType, axiosInstance]
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

      const response = await api.getItemById(
        axiosInstance,
        endpoint,
        normalizedId
      );

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
        let response;
        const isEditing = !!itemId;

        switch (entityType) {
          case FORM_TYPES.DEVELOPER:
            if (isEditing) {
              response = await api.updateDeveloper(
                axiosInstance,
                itemId,
                formData
              );
            } else {
              response = await api.createDeveloper(axiosInstance, formData);
            }
            break;
          case FORM_TYPES.DEVELOPMENT:
            if (isEditing) {
              response = await api.updateDevelopment(
                axiosInstance,
                itemId,
                formData
              );
            } else {
              response = await api.createDevelopment(axiosInstance, formData);
            }
            break;
          case FORM_TYPES.PROPERTY_NOT_PUBLISHED:
            if (isEditing) {
              response = await api.updateProperty(
                axiosInstance,
                itemId,
                formData
              );
            } else {
              response = await api.createProperty(axiosInstance, formData);
            }
            break;
          case FORM_TYPES.PROPERTY_PUBLISHED:
            if (isEditing) {
              response = await api.updatePublishedProperty(
                axiosInstance,
                itemId,
                formData
              );
            } else {
              response = await api.createPublishedProperty(
                axiosInstance,
                formData
              );
            }
            break;
          default:
            throw new Error("Tipo de entidad no válido");
        }

        // Actualizar la lista de items después de guardar
        await fetchItems();
        return true;
      } catch (error) {
        console.error("Error al guardar item:", error);
        setError("Error al guardar los datos");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [entityType, axiosInstance, fetchItems]
  );

  const deleteItem = useCallback(
    async (itemId) => {
      if (!entityType || !itemId) return false;

      setLoading(true);
      setError(null);
      try {
        switch (entityType) {
          case FORM_TYPES.DEVELOPER:
            await api.deleteDeveloper(axiosInstance, itemId);
            break;
          case FORM_TYPES.DEVELOPMENT:
            await api.deleteDevelopment(axiosInstance, itemId);
            break;
          case FORM_TYPES.PROPERTY_NOT_PUBLISHED:
            await api.deleteProperty(axiosInstance, itemId);
            break;
          case FORM_TYPES.PROPERTY_PUBLISHED:
            throw new Error("No se permite eliminar propiedades publicadas");
          default:
            throw new Error("Tipo de entidad no válido");
        }

        // Actualizar la lista de items después de eliminar
        await fetchItems();
        return true;
      } catch (error) {
        console.error("Error al eliminar item:", error);
        setError("Error al eliminar el elemento");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [entityType, axiosInstance, fetchItems]
  );

  return {
    items,
    loading,
    error,
    pagination,
    fetchItems,
    getItemDetails,
    saveItem,
    deleteItem,
  };
};
