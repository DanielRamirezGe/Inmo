"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Box, Container, Typography, Tabs, Tab, Alert } from "@mui/material";

// Componentes
import AdminNavbar from "../components/AdminNavbar";
import EntityList from "./components/EntityList";
import FormDialog from "./components/FormDialog";
import DeleteDialog from "./components/DeleteDialog";

// Hooks personalizados
import { useEntityData } from "../../../hooks/useEntityData";
import { useImageHandling } from "../../../hooks/useImageHandling";
import { api } from "../../../services/api";
import { useAxiosMiddleware } from "../../../utils/axiosMiddleware";

// Configuraciones
import {
  developerFields,
  developmentFields,
  propertyFields,
} from "./components/fieldsConfig";

import {
  FORM_TYPES,
  TAB_FORM_TYPE_MAP,
  TAB_TITLES,
  TAB_LABELS,
  getTabLabel,
  ENTITY_LABELS,
  TAB_INDICES,
} from "./constants";

const ENTITY_TYPES = {
  DEVELOPER: FORM_TYPES.DEVELOPER,
  DEVELOPMENT: FORM_TYPES.DEVELOPMENT,
  PROPERTY_NOT_PUBLISHED: FORM_TYPES.PROPERTY_NOT_PUBLISHED,
  PROPERTY_PUBLISHED: FORM_TYPES.PROPERTY_PUBLISHED,
  PROPERTY_MINKAASA_UNPUBLISHED: FORM_TYPES.PROPERTY_MINKAASA_UNPUBLISHED,
  PROPERTY_MINKAASA_PUBLISHED: FORM_TYPES.PROPERTY_MINKAASA_PUBLISHED,
};

export default function PropertiesPage() {
  const [tabValue, setTabValue] = useState(TAB_INDICES.DEVELOPER);
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const [unpublishing, setUnpublishing] = useState(false);

  // Estados para diálogos
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [currentItem, setCurrentItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [currentFields, setCurrentFields] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [formError, setFormError] = useState(null);

  // Hooks personalizados para cada tipo de entidad
  const {
    items: developers,
    loading: developersLoading,
    error: developersError,
    fetchItems: fetchDevelopers,
    getItemDetails: getDeveloperDetails,
    deleteItem: deleteDeveloper,
    saveItem: saveDeveloper,
    pagination: developersPagination,
  } = useEntityData(ENTITY_TYPES.DEVELOPER);

  const {
    items: developments,
    loading: developmentsLoading,
    error: developmentsError,
    fetchItems: fetchDevelopments,
    getItemDetails: getDevelopmentDetails,
    deleteItem: deleteDevelopment,
    saveItem: saveDevelopment,
    pagination: developmentsPagination,
  } = useEntityData(ENTITY_TYPES.DEVELOPMENT);

  const {
    items: properties,
    loading: propertiesLoading,
    error: propertiesError,
    fetchItems: fetchProperties,
    getItemDetails: getPropertyDetails,
    deleteItem: deleteProperty,
    saveItem: saveProperty,
    pagination: propertiesPagination,
  } = useEntityData(ENTITY_TYPES.PROPERTY_NOT_PUBLISHED);

  const {
    items: publishedProperties,
    loading: publishedPropertiesLoading,
    error: publishedPropertiesError,
    fetchItems: fetchPublishedProperties,
    getItemDetails: getPublishedPropertyDetails,
    deleteItem: deletePublishedProperty,
    saveItem: savePublishedProperty,
    pagination: publishedPropertiesPagination,
  } = useEntityData(ENTITY_TYPES.PROPERTY_PUBLISHED);

  const {
    items: minkaasaUnpublishedProperties,
    loading: minkaasaUnpublishedPropertiesLoading,
    error: minkaasaUnpublishedPropertiesError,
    fetchItems: fetchMinkaasaUnpublishedProperties,
    getItemDetails: getMinkaasaUnpublishedPropertyDetails,
    deleteItem: deleteMinkaasaUnpublishedProperty,
    saveItem: saveMinkaasaUnpublishedProperty,
    pagination: minkaasaUnpublishedPropertiesPagination,
  } = useEntityData(ENTITY_TYPES.PROPERTY_MINKAASA_UNPUBLISHED);

  const {
    items: minkaasaPublishedProperties,
    loading: minkaasaPublishedPropertiesLoading,
    error: minkaasaPublishedPropertiesError,
    fetchItems: fetchMinkaasaPublishedProperties,
    getItemDetails: getMinkaasaPublishedPropertyDetails,
    deleteItem: deleteMinkaasaPublishedProperty,
    saveItem: saveMinkaasaPublishedProperty,
    pagination: minkaasaPublishedPropertiesPagination,
  } = useEntityData(ENTITY_TYPES.PROPERTY_MINKAASA_PUBLISHED);

  const {
    loading: imageLoading,
    error: imageError,
    loadPropertyImages,
    loadDevelopmentImages,
  } = useImageHandling();

  // Obtener axiosInstance
  const axiosInstance = useAxiosMiddleware();

  // Manejadores de paginación
  const handleDeveloperPageChange = useCallback(
    (newPage) => {
      fetchDevelopers(newPage);
    },
    [fetchDevelopers]
  );

  const handleDeveloperPageSizeChange = useCallback(
    (newPageSize) => {
      fetchDevelopers(1, newPageSize);
    },
    [fetchDevelopers]
  );

  const handleDevelopmentPageChange = useCallback(
    (newPage) => {
      fetchDevelopments(newPage);
    },
    [fetchDevelopments]
  );

  const handleDevelopmentPageSizeChange = useCallback(
    (newPageSize) => {
      fetchDevelopments(1, newPageSize);
    },
    [fetchDevelopments]
  );

  const handlePropertyPageChange = useCallback(
    (newPage) => {
      fetchProperties(newPage);
    },
    [fetchProperties]
  );

  const handlePropertyPageSizeChange = useCallback(
    (newPageSize) => {
      fetchProperties(1, newPageSize);
    },
    [fetchProperties]
  );

  const handlePublishedPropertyPageChange = useCallback(
    (newPage) => {
      fetchPublishedProperties(newPage);
    },
    [fetchPublishedProperties]
  );

  const handlePublishedPropertyPageSizeChange = useCallback(
    (newPageSize) => {
      fetchPublishedProperties(1, newPageSize);
    },
    [fetchPublishedProperties]
  );

  const handleMinkaasaUnpublishedPropertyPageChange = useCallback(
    (newPage) => {
      fetchMinkaasaUnpublishedProperties(newPage);
    },
    [fetchMinkaasaUnpublishedProperties]
  );

  const handleMinkaasaUnpublishedPropertyPageSizeChange = useCallback(
    (newPageSize) => {
      fetchMinkaasaUnpublishedProperties(1, newPageSize);
    },
    [fetchMinkaasaUnpublishedProperties]
  );

  const handleMinkaasaPublishedPropertyPageChange = useCallback(
    (newPage) => {
      fetchMinkaasaPublishedProperties(newPage);
    },
    [fetchMinkaasaPublishedProperties]
  );

  const handleMinkaasaPublishedPropertyPageSizeChange = useCallback(
    (newPageSize) => {
      fetchMinkaasaPublishedProperties(1, newPageSize);
    },
    [fetchMinkaasaPublishedProperties]
  );

  // Cargar desarrolladoras solo una vez al montar el componente
  useEffect(() => {
    const loadInitialData = async () => {
      await fetchDevelopers();
      setInitialLoadDone(true);
    };
    loadInitialData();
  }, []); // Solo se ejecuta al montar

  // Cargar datos específicos cuando cambia la pestaña
  useEffect(() => {
    if (!initialLoadDone) return;

    const loadTabData = async () => {
      switch (tabValue) {
        case TAB_INDICES.DEVELOPMENT:
          await fetchDevelopments();
          break;
        case TAB_INDICES.PROPERTY_NOT_PUBLISHED:
          await fetchProperties();
          break;
        case TAB_INDICES.PROPERTY_PUBLISHED:
          await fetchPublishedProperties();
          break;
        case TAB_INDICES.PROPERTY_MINKAASA_UNPUBLISHED:
          await fetchMinkaasaUnpublishedProperties();
          break;
        case TAB_INDICES.PROPERTY_MINKAASA_PUBLISHED:
          await fetchMinkaasaPublishedProperties();
          break;
        // TAB_INDICES.DEVELOPER ya está manejado en el primer useEffect
      }
    };

    loadTabData();
  }, [tabValue, initialLoadDone]); // Agregamos initialLoadDone como dependencia

  // Manejo de cambio de pestaña
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Función para abrir diálogo
  const handleOpenDialog = () => {
    const formType = TAB_FORM_TYPE_MAP[tabValue];
    setCurrentItem(null);
    setFormData({});
    setDialogTitle(getDialogTitle(formType, false));

    // Obtener campos según el tipo de formulario
    const formFields = getFieldsForType(formType);

    setCurrentFields(formFields);
    setDialogOpen(true);
  };

  // Función para abrir diálogo de edición
  const handleOpenEditDialog = (item) => {
    const formType = TAB_FORM_TYPE_MAP[tabValue];
    setCurrentItem(item);
    setFormData(item || {});
    setDialogTitle(getDialogTitle(formType, true));

    // Obtener campos según el tipo de formulario
    const formFields = getFieldsForType(formType);

    setCurrentFields(formFields);
    setDialogOpen(true);
  };

  const getDialogTitle = (formType, isEditing) => {
    const entityLabel = ENTITY_LABELS[formType].singular;
    if (formType === FORM_TYPES.PROPERTY_PUBLISHED) {
      return `Ver ${entityLabel}`;
    }
    return isEditing ? `Editar ${entityLabel}` : `Agregar ${entityLabel}`;
  };

  const getFieldsForType = (formType) => {
    switch (formType) {
      case FORM_TYPES.DEVELOPER:
        return developerFields;
      case FORM_TYPES.DEVELOPMENT:
        return developmentFields;
      case FORM_TYPES.PROPERTY_NOT_PUBLISHED:
      case FORM_TYPES.PROPERTY_PUBLISHED:
      case FORM_TYPES.PROPERTY_MINKAASA_UNPUBLISHED:
      case FORM_TYPES.PROPERTY_MINKAASA_PUBLISHED:
        return propertyFields;
      default:
        return [];
    }
  };

  // Función para manejar eliminación
  const handleOpenDeleteDialog = (item) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  // Función para eliminar elementos
  const handleDelete = async () => {
    try {
      switch (tabValue) {
        case TAB_INDICES.DEVELOPER:
          await deleteDeveloper(itemToDelete.realEstateDevelopmentId);
          break;
        case TAB_INDICES.DEVELOPMENT:
          await deleteDevelopment(itemToDelete.developmentId);
          break;
        case TAB_INDICES.PROPERTY_NOT_PUBLISHED:
          await deleteProperty(itemToDelete.prototypeId);
          break;
        case TAB_INDICES.PROPERTY_PUBLISHED:
          await deletePublishedProperty(itemToDelete.prototypeId);
          break;
        case TAB_INDICES.PROPERTY_MINKAASA_UNPUBLISHED:
          await deleteMinkaasaUnpublishedProperty(itemToDelete.prototypeId);
          break;
        case TAB_INDICES.PROPERTY_MINKAASA_PUBLISHED:
          await deleteMinkaasaPublishedProperty(itemToDelete.prototypeId);
          break;
      }
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  // Función para guardar elementos
  const handleSaveForm = async () => {
    let success = false;

    try {
      switch (tabValue) {
        case TAB_INDICES.DEVELOPER:
          // Ya no es necesario filtrar contactos
          const developerData = { ...formData };

          success = await saveDeveloper(
            developerData,
            currentItem?.realEstateDevelopmentId
          );
          break;
        case TAB_INDICES.DEVELOPMENT:
          const formDataToSend = new FormData();

          // Agregar campos básicos
          const basicFields = [
            "developmentName",
            "realEstateDevelopmentId",
            "commission",
            "url",
            "state",
            "city",
            "zipCode",
            "street",
            "extNum",
            "intNum",
            "mapLocation",
          ];

          basicFields.forEach((field) => {
            if (formData[field] !== null && formData[field] !== undefined) {
              formDataToSend.append(field, formData[field]);
            }
          });

          // Agregar imagen principal
          if (formData.mainImage instanceof File) {
            formDataToSend.append("mainImage", formData.mainImage);
          }

          // Agregar imágenes secundarias
          if (
            formData.secondaryImages &&
            Array.isArray(formData.secondaryImages)
          ) {
            formData.secondaryImages.forEach((file, index) => {
              if (file instanceof File) {
                formDataToSend.append("secondaryImages", file);
              }
            });
          }

          success = await saveDevelopment(
            formDataToSend,
            currentItem?.developmentId
          );
          break;
        case TAB_INDICES.PROPERTY_NOT_PUBLISHED:
          const propertyFormData = new FormData();

          // Lista de campos que se deben incluir en la petición
          const propertyFields = [
            "prototypeName",
            "developmentId",
            "condominium",
            "price",
            "bedroom",
            "bathroom",
            "halfBathroom",
            "parking",
            "size",
            "mapLocation",
            "url",
          ];

          // Filtrar campos que no son de preview y que están en la lista de permitidos
          propertyFields.forEach((key) => {
            const value = formData[key];
            if (value !== null && value !== undefined) {
              propertyFormData.append(key, value);
            }
          });

          // Agregar el arreglo descriptions como JSON
          if (formData.descriptions && Array.isArray(formData.descriptions)) {
            // Verificar si el array está vacío
            if (formData.descriptions.length === 0) {
              // Si el array está vacío, enviar un array vacío como string JSON
              propertyFormData.append("descriptions", JSON.stringify([]));
            } else {
              formData.descriptions.forEach((desc, index) => {
                // Enviar el título y la descripción sin modificar para preservar formato
                propertyFormData.append(
                  `descriptions[${index}][title]`,
                  desc.title || ""
                );

                // Preservar el texto exactamente como se ingresó, incluyendo espacios y saltos de línea
                const descriptionText = desc.description || "";
                propertyFormData.append(
                  `descriptions[${index}][description]`,
                  descriptionText
                );

                // Si existe un descriptionId, incluirlo para que la API pueda actualizar en lugar de crear
                if (desc.descriptionId) {
                  propertyFormData.append(
                    `descriptions[${index}][descriptionId]`,
                    desc.descriptionId
                  );
                }
              });
            }
          } else {
            // Si descriptions es null o undefined, enviar un array vacío
            propertyFormData.append("descriptions", JSON.stringify([]));
            console.log(
              "No hay descripciones o el formato es inválido:",
              formData.descriptions
            );
          }

          // Manejar imágenes
          if (formData.mainImage instanceof File) {
            propertyFormData.append("mainImage", formData.mainImage);
          }

          if (
            formData.secondaryImages &&
            Array.isArray(formData.secondaryImages)
          ) {
            formData.secondaryImages.forEach((file) => {
              if (file instanceof File) {
                propertyFormData.append("secondaryImages", file);
              }
            });
          }

          success = await saveProperty(
            propertyFormData,
            currentItem?.prototypeId
          );
          break;
        case TAB_INDICES.PROPERTY_PUBLISHED:
          const publishedPropertyFormData = new FormData();

          // Lista de campos que se deben incluir en la petición
          const publishedPropertyFields = [
            "prototypeName",
            "developmentId",
            "condominium",
            "price",
            "bedroom",
            "bathroom",
            "halfBathroom",
            "parking",
            "size",
            "mapLocation",
            "url",
          ];

          // Filtrar campos que no son de preview y que están en la lista de permitidos
          publishedPropertyFields.forEach((key) => {
            const value = formData[key];
            if (value !== null && value !== undefined) {
              publishedPropertyFormData.append(key, value);
            }
          });

          // Agregar el arreglo descriptions como JSON
          if (formData.descriptions && Array.isArray(formData.descriptions)) {
            // Verificar si el array está vacío
            if (formData.descriptions.length === 0) {
              // Si el array está vacío, enviar un array vacío como string JSON
              publishedPropertyFormData.append(
                "descriptions",
                JSON.stringify([])
              );
            } else {
              formData.descriptions.forEach((desc, index) => {
                // Enviar el título y la descripción sin modificar para preservar formato
                publishedPropertyFormData.append(
                  `descriptions[${index}][title]`,
                  desc.title || ""
                );

                // Preservar el texto exactamente como se ingresó, incluyendo espacios y saltos de línea
                const descriptionText = desc.description || "";
                publishedPropertyFormData.append(
                  `descriptions[${index}][description]`,
                  descriptionText
                );

                // Si existe un descriptionId, incluirlo para que la API pueda actualizar en lugar de crear
                if (desc.descriptionId) {
                  publishedPropertyFormData.append(
                    `descriptions[${index}][descriptionId]`,
                    desc.descriptionId
                  );
                }
              });
            }
          } else {
            // Si descriptions es null o undefined, enviar un array vacío
            publishedPropertyFormData.append(
              "descriptions",
              JSON.stringify([])
            );
            console.log(
              "No hay descripciones o el formato es inválido:",
              formData.descriptions
            );
          }

          // Manejar imágenes
          if (formData.mainImage instanceof File) {
            publishedPropertyFormData.append("mainImage", formData.mainImage);
          }

          if (
            formData.secondaryImages &&
            Array.isArray(formData.secondaryImages)
          ) {
            formData.secondaryImages.forEach((file) => {
              if (file instanceof File) {
                publishedPropertyFormData.append("secondaryImages", file);
              }
            });
          }

          // Llamar a la función para guardar propiedades publicadas
          success = await savePublishedProperty(
            publishedPropertyFormData,
            currentItem?.prototypeId
          );
          break;
        case TAB_INDICES.PROPERTY_MINKAASA_UNPUBLISHED:
          const minkaasaUnpublishedPropertyFormData = new FormData();

          // Lista de campos que se deben incluir en la petición
          const minkaasaUnpublishedPropertyFields = [
            "prototypeName",
            "condominium",
            "price",
            "bedroom",
            "bathroom",
            "halfBathroom",
            "parking",
            "size",
            "mapLocation",
            "url",
            "street",
            "exteriorNumber",
            "interiorNumber",
            "suburb",
            "city",
            "state",
            "zipCode",
          ];

          // Filtrar campos que no son de preview y que están en la lista de permitidos
          minkaasaUnpublishedPropertyFields.forEach((key) => {
            const value = formData[key];
            if (value !== null && value !== undefined) {
              minkaasaUnpublishedPropertyFormData.append(key, value);
            }
          });

          // Agregar el arreglo descriptions como JSON
          if (formData.descriptions && Array.isArray(formData.descriptions)) {
            // Verificar si el array está vacío
            if (formData.descriptions.length === 0) {
              // Si el array está vacío, enviar un array vacío como string JSON
              minkaasaUnpublishedPropertyFormData.append(
                "descriptions",
                JSON.stringify([])
              );
            } else {
              formData.descriptions.forEach((desc, index) => {
                // Enviar el título y la descripción sin modificar para preservar formato
                minkaasaUnpublishedPropertyFormData.append(
                  `descriptions[${index}][title]`,
                  desc.title || ""
                );

                // Preservar el texto exactamente como se ingresó, incluyendo espacios y saltos de línea
                const descriptionText = desc.description || "";
                minkaasaUnpublishedPropertyFormData.append(
                  `descriptions[${index}][description]`,
                  descriptionText
                );

                // Si existe un descriptionId, incluirlo para que la API pueda actualizar en lugar de crear
                if (desc.descriptionId) {
                  minkaasaUnpublishedPropertyFormData.append(
                    `descriptions[${index}][descriptionId]`,
                    desc.descriptionId
                  );
                }
              });
            }
          } else {
            // Si descriptions es null o undefined, enviar un array vacío
            minkaasaUnpublishedPropertyFormData.append(
              "descriptions",
              JSON.stringify([])
            );
            console.log(
              "No hay descripciones o el formato es inválido:",
              formData.descriptions
            );
          }

          // Crear objeto externalAgreement con los datos de contacto
          const externalAgreement = {
            name: formData.name || "",
            lastNameP: formData.lastNameP || "",
            lastNameM: formData.lastNameM || "",
            mainEmail: formData.mainEmail || "",
            mainPhone: formData.mainPhone || "",
            agent: formData.agent || "",
            commission: formData.commission || 0,
          };

          // Si estamos editando y existe el ID del acuerdo externo, incluirlo
          if (currentItem?.externalAgreementId) {
            externalAgreement.externalAgreementId =
              currentItem.externalAgreementId;
            minkaasaUnpublishedPropertyFormData.append(
              "externalAgreementId",
              currentItem.externalAgreementId
            );
          }

          // Agregar externalAgreement como JSON
          minkaasaUnpublishedPropertyFormData.append(
            "externalAgreement",
            JSON.stringify(externalAgreement)
          );

          // Manejar imágenes
          if (formData.mainImage instanceof File) {
            minkaasaUnpublishedPropertyFormData.append(
              "mainImage",
              formData.mainImage
            );
          }

          if (
            formData.secondaryImages &&
            Array.isArray(formData.secondaryImages)
          ) {
            formData.secondaryImages.forEach((file) => {
              if (file instanceof File) {
                minkaasaUnpublishedPropertyFormData.append(
                  "secondaryImages",
                  file
                );
              }
            });
          }

          success = await saveMinkaasaUnpublishedProperty(
            minkaasaUnpublishedPropertyFormData,
            currentItem?.prototypeId
          );
          break;

        case TAB_INDICES.PROPERTY_MINKAASA_PUBLISHED:
          const minkaasaPublishedPropertyFormData = new FormData();

          // Lista de campos que se deben incluir en la petición
          const minkaasaPublishedPropertyFields = [
            "prototypeName",
            "condominium",
            "price",
            "bedroom",
            "bathroom",
            "halfBathroom",
            "parking",
            "size",
            "mapLocation",
            "url",
            "street",
            "exteriorNumber",
            "interiorNumber",
            "suburb",
            "city",
            "state",
            "zipCode",
          ];

          // Filtrar campos que no son de preview y que están en la lista de permitidos
          minkaasaPublishedPropertyFields.forEach((key) => {
            const value = formData[key];
            if (value !== null && value !== undefined) {
              minkaasaPublishedPropertyFormData.append(key, value);
            }
          });

          // Agregar el arreglo descriptions como JSON
          if (formData.descriptions && Array.isArray(formData.descriptions)) {
            // Verificar si el array está vacío
            if (formData.descriptions.length === 0) {
              // Si el array está vacío, enviar un array vacío como string JSON
              minkaasaPublishedPropertyFormData.append(
                "descriptions",
                JSON.stringify([])
              );
            } else {
              formData.descriptions.forEach((desc, index) => {
                // Enviar el título y la descripción sin modificar para preservar formato
                minkaasaPublishedPropertyFormData.append(
                  `descriptions[${index}][title]`,
                  desc.title || ""
                );

                // Preservar el texto exactamente como se ingresó, incluyendo espacios y saltos de línea
                const descriptionText = desc.description || "";
                minkaasaPublishedPropertyFormData.append(
                  `descriptions[${index}][description]`,
                  descriptionText
                );

                // Si existe un descriptionId, incluirlo para que la API pueda actualizar en lugar de crear
                if (desc.descriptionId) {
                  minkaasaPublishedPropertyFormData.append(
                    `descriptions[${index}][descriptionId]`,
                    desc.descriptionId
                  );
                }
              });
            }
          } else {
            // Si descriptions es null o undefined, enviar un array vacío
            minkaasaPublishedPropertyFormData.append(
              "descriptions",
              JSON.stringify([])
            );
            console.log(
              "No hay descripciones o el formato es inválido:",
              formData.descriptions
            );
          }

          // Crear objeto externalAgreement con los datos de contacto
          const externalAgreementPublished = {
            name: formData.name || "",
            lastNameP: formData.lastNameP || "",
            lastNameM: formData.lastNameM || "",
            mainEmail: formData.mainEmail || "",
            mainPhone: formData.mainPhone || "",
            agent: formData.agent || "",
            commission: formData.commission || 0,
          };

          // Si estamos editando y existe el ID del acuerdo externo, incluirlo
          if (currentItem?.externalAgreementId) {
            externalAgreementPublished.externalAgreementId =
              currentItem.externalAgreementId;
            minkaasaPublishedPropertyFormData.append(
              "externalAgreementId",
              currentItem.externalAgreementId
            );
          }

          // Agregar externalAgreement como JSON
          minkaasaPublishedPropertyFormData.append(
            "externalAgreement",
            JSON.stringify(externalAgreementPublished)
          );

          // Manejar imágenes
          if (formData.mainImage instanceof File) {
            minkaasaPublishedPropertyFormData.append(
              "mainImage",
              formData.mainImage
            );
          }

          if (
            formData.secondaryImages &&
            Array.isArray(formData.secondaryImages)
          ) {
            formData.secondaryImages.forEach((file) => {
              if (file instanceof File) {
                minkaasaPublishedPropertyFormData.append(
                  "secondaryImages",
                  file
                );
              }
            });
          }

          success = await saveMinkaasaPublishedProperty(
            minkaasaPublishedPropertyFormData,
            currentItem?.prototypeId
          );
          break;
      }

      if (success) {
        setDialogOpen(false);
        setCurrentItem(null);
        setFormData({});
      }
    } catch (error) {
      console.error("Error al guardar:", error);
      setFormError(
        "Error al guardar los datos. Por favor, inténtalo de nuevo."
      );
    }
  };

  // Función para despublicar una propiedad
  const handleUnpublishProperty = async (propertyId) => {
    if (unpublishing) return false;

    try {
      setUnpublishing(true);
      let success;

      // Determinar si estamos en una pestaña de Minkaasa
      if (tabValue === TAB_INDICES.PROPERTY_MINKAASA_PUBLISHED) {
        success = await api.unpublishMinkaasaProperty(
          axiosInstance,
          propertyId
        );

        if (success) {
          // Refrescar las listas de propiedades Minkaasa
          await fetchMinkaasaPublishedProperties();
          await fetchMinkaasaUnpublishedProperties();
        }
      } else {
        success = await api.unpublishProperty(axiosInstance, propertyId);

        if (success) {
          // Refrescar las listas de propiedades regulares
          await fetchPublishedProperties();
          await fetchProperties();
        }
      }

      return success;
    } catch (error) {
      console.error("Error al despublicar propiedad:", error);
      return false;
    } finally {
      setUnpublishing(false);
    }
  };

  // Función para publicar una propiedad
  const handlePublishProperty = async (propertyId) => {
    try {
      let success;

      // Determinar si estamos en una pestaña de Minkaasa
      if (tabValue === TAB_INDICES.PROPERTY_MINKAASA_UNPUBLISHED) {
        success = await api.publishMinkaasaProperty(axiosInstance, propertyId);

        if (success) {
          // Refrescar las listas de propiedades Minkaasa
          await fetchMinkaasaPublishedProperties();
          await fetchMinkaasaUnpublishedProperties();
        }
      } else {
        success = await api.publishProperty(axiosInstance, propertyId);

        if (success) {
          // Refrescar las listas de propiedades regulares
          await fetchPublishedProperties();
          await fetchProperties();
        }
      }

      return success;
    } catch (error) {
      console.error("Error al publicar propiedad:", error);
      return false;
    }
  };

  const getCurrentItems = () => {
    switch (tabValue) {
      case TAB_INDICES.DEVELOPER:
        return {
          items: developers,
          loading: developersLoading || imageLoading,
          error: developersError,
          type: ENTITY_TYPES.DEVELOPER,
          pagination: developersPagination,
          onPageChange: handleDeveloperPageChange,
          onPageSizeChange: handleDeveloperPageSizeChange,
        };
      case TAB_INDICES.DEVELOPMENT:
        return {
          items: developments,
          loading: developmentsLoading || imageLoading,
          error: developmentsError,
          type: ENTITY_TYPES.DEVELOPMENT,
          pagination: developmentsPagination,
          onPageChange: handleDevelopmentPageChange,
          onPageSizeChange: handleDevelopmentPageSizeChange,
        };
      case TAB_INDICES.PROPERTY_NOT_PUBLISHED:
        return {
          items: properties,
          loading: propertiesLoading || imageLoading,
          error: propertiesError,
          type: ENTITY_TYPES.PROPERTY_NOT_PUBLISHED,
          pagination: propertiesPagination,
          onPageChange: handlePropertyPageChange,
          onPageSizeChange: handlePropertyPageSizeChange,
          onPublish: handlePublishProperty,
        };
      case TAB_INDICES.PROPERTY_PUBLISHED:
        return {
          items: publishedProperties,
          loading: publishedPropertiesLoading || imageLoading,
          error: publishedPropertiesError,
          type: ENTITY_TYPES.PROPERTY_PUBLISHED,
          pagination: publishedPropertiesPagination,
          onPageChange: handlePublishedPropertyPageChange,
          onPageSizeChange: handlePublishedPropertyPageSizeChange,
          onUnpublish: handleUnpublishProperty,
        };
      case TAB_INDICES.PROPERTY_MINKAASA_UNPUBLISHED:
        return {
          items: minkaasaUnpublishedProperties,
          loading: minkaasaUnpublishedPropertiesLoading || imageLoading,
          error: minkaasaUnpublishedPropertiesError,
          type: ENTITY_TYPES.PROPERTY_MINKAASA_UNPUBLISHED,
          pagination: minkaasaUnpublishedPropertiesPagination,
          onPageChange: handleMinkaasaUnpublishedPropertyPageChange,
          onPageSizeChange: handleMinkaasaUnpublishedPropertyPageSizeChange,
          onUnpublish: handleUnpublishProperty,
          onPublish: handlePublishProperty,
        };
      case TAB_INDICES.PROPERTY_MINKAASA_PUBLISHED:
        return {
          items: minkaasaPublishedProperties,
          loading: minkaasaPublishedPropertiesLoading || imageLoading,
          error: minkaasaPublishedPropertiesError,
          type: ENTITY_TYPES.PROPERTY_MINKAASA_PUBLISHED,
          pagination: minkaasaPublishedPropertiesPagination,
          onPageChange: handleMinkaasaPublishedPropertyPageChange,
          onPageSizeChange: handleMinkaasaPublishedPropertyPageSizeChange,
          onUnpublish: handleUnpublishProperty,
          onPublish: handlePublishProperty,
        };
      default:
        return {
          items: [],
          loading: false,
          error: null,
          type: null,
          pagination: null,
          onPageChange: () => {},
          onPageSizeChange: () => {},
        };
    }
  };

  const {
    items,
    loading,
    error: currentError,
    type,
    pagination,
    onPageChange,
    onPageSizeChange,
  } = getCurrentItems();

  return (
    <>
      <AdminNavbar />
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 4 }}>
          Administración de Propiedades
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
          >
            {TAB_LABELS.map((label, index) => (
              <Tab key={index} label={label} />
            ))}
          </Tabs>
        </Box>

        {currentError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {currentError}
          </Alert>
        )}

        <Box sx={{ p: 2 }}>
          <EntityList
            title={TAB_TITLES[TAB_FORM_TYPE_MAP[tabValue]]}
            items={items}
            loading={loading}
            onAdd={() => handleOpenDialog()}
            onEdit={(item) => handleOpenEditDialog(item)}
            onDelete={handleOpenDeleteDialog}
            onUnpublish={handleUnpublishProperty}
            onPublish={handlePublishProperty}
            currentTab={tabValue}
            allDevelopers={developers}
            pagination={pagination}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
          />
        </Box>

        <FormDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onSubmit={handleSaveForm}
          title={dialogTitle}
          formData={formData}
          setFormData={setFormData}
          fields={currentFields}
          loading={
            developersLoading ||
            developmentsLoading ||
            propertiesLoading ||
            imageLoading
          }
          error={developersError || developmentsError || propertiesError}
          setError={setFormError}
          formType={TAB_FORM_TYPE_MAP[tabValue]}
          currentItem={currentItem}
        />

        <DeleteDialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onDelete={handleDelete}
          itemToDelete={itemToDelete}
          loading={loading}
        />
      </Container>
    </>
  );
}
