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
};

export default function PropertiesPage() {
  const [tabValue, setTabValue] = useState(TAB_INDICES.DEVELOPER);
  const [initialLoadDone, setInitialLoadDone] = useState(false);

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
    pagination: publishedPropertiesPagination,
  } = useEntityData(ENTITY_TYPES.PROPERTY_PUBLISHED);

  const {
    loading: imageLoading,
    error: imageError,
    loadPropertyImages,
    loadDevelopmentImages,
  } = useImageHandling();

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
    setCurrentFields(getFieldsForType(formType));
    setDialogOpen(true);
  };

  // Función para abrir diálogo de edición
  const handleOpenEditDialog = (item) => {
    const formType = TAB_FORM_TYPE_MAP[tabValue];
    setCurrentItem(item);
    setFormData(item || {});
    setDialogTitle(getDialogTitle(formType, true));
    setCurrentFields(getFieldsForType(formType));
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
          success = await saveDeveloper(
            formData,
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

          // Agregar contactos si existen
          if (formData.contacts) {
            formDataToSend.append(
              "contacts",
              JSON.stringify(formData.contacts)
            );
          }

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

          // Filtrar campos que no son de preview
          Object.keys(formData).forEach((key) => {
            if (!key.includes("Preview")) {
              const value = formData[key];
              if (value !== null && value !== undefined) {
                if (key === "contacts" && Array.isArray(value)) {
                  propertyFormData.append(key, JSON.stringify(value));
                } else if (
                  (key === "mainImage" && value instanceof File) ||
                  (key === "secondaryImages" && Array.isArray(value))
                ) {
                  if (key === "mainImage") {
                    propertyFormData.append(key, value);
                  } else {
                    value.forEach((file) => {
                      if (file instanceof File) {
                        propertyFormData.append(key, file);
                      }
                    });
                  }
                } else {
                  propertyFormData.append(key, value);
                }
              }
            }
          });

          success = await saveProperty(
            propertyFormData,
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
