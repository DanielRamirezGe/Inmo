"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Box, Container, Typography, Tabs, Tab, Alert, Snackbar } from "@mui/material";

// Componentes
import AdminNavbar from "../components/AdminNavbar";
import EntityList from "./components/EntityList";
import FormDialog from "./components/FormDialog";
import DeleteDialog from "./components/DeleteDialog";
import PropertyFiltersBar from "../../../components/PropertyFiltersBar";

// Hooks personalizados
import { useEntityData } from "../../../hooks/useEntityData";
import { useImageHandling } from "../../../hooks/useImageHandling";
import { api } from "../../../services/api";

// Configuraciones
import {
  getFieldsForFormType,
  getInitialDataForFormType,
} from "./components/fieldsConfig";

import {
  FORM_TYPES,
  TAB_FORM_TYPE_MAP,
  TAB_TITLES,
  TAB_LABELS,
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

// Helper para crear FormData de propiedades
const createPropertyFormData = (formData, isMinkaasa = false) => {
  const propertyFormData = new FormData();

  // Obtener campos desde la configuración centralizada
  const formType = isMinkaasa
    ? "propertyMinkaasaUnpublished"
    : "propertyNotPublished";
  const fields = getFieldsForFormType(formType);

  // Agregar campos básicos usando la configuración
  fields.forEach((field) => {
    const value = formData[field.name];
    if (value !== null && value !== undefined && value !== "") {
      // Mapear propertyTypeId a nameTypeId para la API
      const fieldName =
        field.name === "propertyTypeId" ? "nameTypeId" : field.name;
      propertyFormData.append(fieldName, value);
    }
  });

  // Agregar descripciones
  if (formData.descriptions && Array.isArray(formData.descriptions)) {
    if (formData.descriptions.length === 0) {
      propertyFormData.append("descriptions", JSON.stringify([]));
    } else {
      formData.descriptions.forEach((desc, index) => {
        propertyFormData.append(
          `descriptions[${index}][title]`,
          desc.title || ""
        );
        propertyFormData.append(
          `descriptions[${index}][description]`,
          desc.description || ""
        );
        if (desc.descriptionId) {
          propertyFormData.append(
            `descriptions[${index}][descriptionId]`,
            desc.descriptionId
          );
        }
      });
    }
  } else {
    propertyFormData.append("descriptions", JSON.stringify([]));
  }

  // Agregar externalAgreement para propiedades Minkaasa
  if (isMinkaasa) {
    const externalAgreement = {
      name: formData.name || "",
      lastNameP: formData.lastNameP || "",
      lastNameM: formData.lastNameM || "",
      mainEmail: formData.mainEmail || "",
      mainPhone: formData.mainPhone || "",
      agent: formData.agent || "",
      commission: formData.commission || 0,
    };

    propertyFormData.append(
      "externalAgreement",
      JSON.stringify(externalAgreement)
    );
  }

  // Agregar imágenes
  if (formData.mainImage instanceof File) {
    propertyFormData.append("mainImage", formData.mainImage);
  }

  if (formData.secondaryImages && Array.isArray(formData.secondaryImages)) {
    formData.secondaryImages.forEach((file) => {
      if (file instanceof File) {
        propertyFormData.append("secondaryImages", file);
      }
    });
  }

  return propertyFormData;
};

// Helper para crear FormData de desarrollo
const createDevelopmentFormData = (formData) => {
  const formDataToSend = new FormData();

  // Obtener campos desde la configuración centralizada
  const fields = getFieldsForFormType("development");

  // Agregar campos básicos usando la configuración
  fields.forEach((field) => {
    const value = formData[field.name];
    if (value !== null && value !== undefined && value !== "") {
      formDataToSend.append(field.name, value);
    }
  });

  // Agregar imágenes
  if (formData.mainImage instanceof File) {
    formDataToSend.append("mainImage", formData.mainImage);
  }

  if (formData.secondaryImages && Array.isArray(formData.secondaryImages)) {
    formData.secondaryImages.forEach((file) => {
      if (file instanceof File) {
        formDataToSend.append("secondaryImages", file);
      }
    });
  }

  return formDataToSend;
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

  // Estado para filtros
  const [activeFilters, setActiveFilters] = useState({});

  // Estado para notificaciones de éxito
  const [successNotification, setSuccessNotification] = useState(null);

  // Hooks consolidados para todas las entidades
  const entityHooks = {
    [ENTITY_TYPES.DEVELOPER]: useEntityData(ENTITY_TYPES.DEVELOPER),
    [ENTITY_TYPES.DEVELOPMENT]: useEntityData(ENTITY_TYPES.DEVELOPMENT),
    [ENTITY_TYPES.PROPERTY_NOT_PUBLISHED]: useEntityData(
      ENTITY_TYPES.PROPERTY_NOT_PUBLISHED
    ),
    [ENTITY_TYPES.PROPERTY_PUBLISHED]: useEntityData(
      ENTITY_TYPES.PROPERTY_PUBLISHED
    ),
    [ENTITY_TYPES.PROPERTY_MINKAASA_UNPUBLISHED]: useEntityData(
      ENTITY_TYPES.PROPERTY_MINKAASA_UNPUBLISHED
    ),
    [ENTITY_TYPES.PROPERTY_MINKAASA_PUBLISHED]: useEntityData(
      ENTITY_TYPES.PROPERTY_MINKAASA_PUBLISHED
    ),
  };

  const { loading: imageLoading, error: imageError } = useImageHandling();

  // Helper para obtener hook de entidad actual
  const getCurrentEntityHook = () => {
    const entityType = TAB_FORM_TYPE_MAP[tabValue];
    return entityHooks[entityType];
  };

  // Manejador genérico de paginación
  const handlePageChange = useCallback(
    (newPage) => {
      getCurrentEntityHook().fetchItems(newPage);
    },
    [tabValue]
  );

  const handlePageSizeChange = useCallback(
    (newPageSize) => {
      getCurrentEntityHook().fetchItems(1, newPageSize);
    },
    [tabValue]
  );

  // Cargar datos iniciales
  useEffect(() => {
    const loadInitialData = async () => {
      await entityHooks[ENTITY_TYPES.DEVELOPER].fetchItems();
      setInitialLoadDone(true);
    };
    loadInitialData();
  }, []);

  // Cargar datos específicos cuando cambia la pestaña
  useEffect(() => {
    if (!initialLoadDone) return;

    const loadTabData = async () => {
      const entityType = TAB_FORM_TYPE_MAP[tabValue];
      if (entityType !== ENTITY_TYPES.DEVELOPER) {
        await entityHooks[entityType].fetchItems();
      }
    };

    loadTabData();
  }, [tabValue, initialLoadDone]);

  // Manejo de cambio de pestaña
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    // Limpiar filtros al cambiar de pestaña
    setActiveFilters({});
  };

  // Función para manejar cambios en los filtros
  const handleFiltersChange = (filters, searchResults = null) => {
    setActiveFilters(filters);

    // Si hay resultados de búsqueda, actualizar la lista
    if (searchResults) {
      const entityHook = getCurrentEntityHook();
      // Actualizar los items con los resultados de búsqueda
      entityHook.setItems(searchResults.data);
      entityHook.setPagination({
        page: searchResults.page,
        pageSize: searchResults.pageSize,
        total: searchResults.total,
      });
      console.log("Resultados de búsqueda aplicados:", searchResults);
    } else {
      console.log("Filtros aplicados:", filters);
    }
  };

  // Obtener el tipo de filtro según la pestaña activa
  const getFilterType = () => {
    switch (tabValue) {
      case TAB_INDICES.PROPERTY_NOT_PUBLISHED:
        return "not-published";
      case TAB_INDICES.PROPERTY_PUBLISHED:
        return "published";
      case TAB_INDICES.PROPERTY_MINKAASA_UNPUBLISHED:
        return "minkaasa-not-published";
      case TAB_INDICES.PROPERTY_MINKAASA_PUBLISHED:
        return "minkaasa-published";
      default:
        return "all";
    }
  };

  // Verificar si la pestaña actual es de propiedades
  const isPropertyTab = () => {
    return tabValue >= TAB_INDICES.PROPERTY_NOT_PUBLISHED;
  };

  // Función para abrir diálogo
  const handleOpenDialog = () => {
    const formType = TAB_FORM_TYPE_MAP[tabValue];
    setCurrentItem(null);
    setFormData(getInitialDataForFormType(formType));
    setDialogTitle(getDialogTitle(formType, false));
    setCurrentFields(getFieldsForFormType(formType));
    setDialogOpen(true);
  };

  // Función para abrir diálogo de edición
  const handleOpenEditDialog = (item) => {
    const formType = TAB_FORM_TYPE_MAP[tabValue];
    setCurrentItem(item);
    setFormData(item || {});
    setDialogTitle(getDialogTitle(formType, true));
    setCurrentFields(getFieldsForFormType(formType));
    setDialogOpen(true);
  };

  const getDialogTitle = (formType, isEditing) => {
    const entityLabel = ENTITY_LABELS[formType].singular;
    if (formType === FORM_TYPES.PROPERTY_PUBLISHED) {
      return `Ver ${entityLabel}`;
    }
    return isEditing ? `Editar ${entityLabel}` : `Agregar ${entityLabel}`;
  };

  // Función para manejar eliminación
  const handleOpenDeleteDialog = (item) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  // Función para eliminar elementos
  const handleDelete = async () => {
    try {
      const entityHook = getCurrentEntityHook();
      const idField = getIdField(tabValue);
      await entityHook.deleteItem(itemToDelete[idField]);
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  // Helper para obtener el campo ID según el tipo de entidad
  const getIdField = (tabValue) => {
    switch (tabValue) {
      case TAB_INDICES.DEVELOPER:
        return "realEstateDevelopmentId";
      case TAB_INDICES.DEVELOPMENT:
        return "developmentId";
      default:
        return "prototypeId";
    }
  };

  // Función específica para refrescar datos después de edición exitosa
  const handleRefreshData = async (successMessage = null) => {
    try {
      const entityHook = getCurrentEntityHook();
      await entityHook.fetchItems();
      
      // Mostrar notificación de éxito si se proporciona
      if (successMessage) {
        setSuccessNotification(successMessage);
      }
    } catch (error) {
      console.error('Error al refrescar datos:', error);
    }
  };

  // Función simplificada para guardar elementos
  const handleSaveForm = async () => {
    try {
      const entityHook = getCurrentEntityHook();
      const idField = getIdField(tabValue);
      let dataToSave;
      let success = false;
      const isEditing = !!currentItem?.[idField];

      // Para creación nueva de propiedades, no hacer nada aquí
      // El FormDialog maneja el proceso multi-paso internamente
      if (!isEditing && (
        tabValue === TAB_INDICES.PROPERTY_NOT_PUBLISHED ||
        tabValue === TAB_INDICES.PROPERTY_PUBLISHED ||
        tabValue === TAB_INDICES.PROPERTY_MINKAASA_UNPUBLISHED ||
        tabValue === TAB_INDICES.PROPERTY_MINKAASA_PUBLISHED
      )) {
        console.log('🔄 Creación nueva de propiedades: delegando al proceso multi-paso de FormDialog');
        // Refrescar listas después del proceso multi-paso
        await entityHook.fetchItems();
        setDialogOpen(false);
        setCurrentItem(null);
        setFormData({});
        return;
      }

      switch (tabValue) {
        case TAB_INDICES.DEVELOPER:
          dataToSave = { ...formData };
          success = await entityHook.saveItem(
            dataToSave,
            currentItem?.[idField]
          );
          break;

        case TAB_INDICES.DEVELOPMENT:
          dataToSave = createDevelopmentFormData(formData);
          success = await entityHook.saveItem(
            dataToSave,
            currentItem?.[idField]
          );
          break;

        case TAB_INDICES.PROPERTY_NOT_PUBLISHED:
        case TAB_INDICES.PROPERTY_PUBLISHED:
          // Solo para edición (isEditing = true)
          if (isEditing) {
            dataToSave = createPropertyFormData(formData, false);
            success = await entityHook.saveItem(
              dataToSave,
              currentItem?.[idField]
            );
          }
          break;

        case TAB_INDICES.PROPERTY_MINKAASA_UNPUBLISHED:
        case TAB_INDICES.PROPERTY_MINKAASA_PUBLISHED:
          // Solo para edición (isEditing = true)
          if (isEditing) {
            dataToSave = createPropertyFormData(formData, true);
            // Agregar externalAgreementId si existe
            if (currentItem?.externalAgreementId) {
              dataToSave.append(
                "externalAgreementId",
                currentItem.externalAgreementId
              );
            }
            success = await entityHook.saveItem(
              dataToSave,
              currentItem?.[idField]
            );
          }
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

      if (tabValue === TAB_INDICES.PROPERTY_MINKAASA_PUBLISHED) {
        success = await api.unpublishMinkaasaProperty(propertyId);
        if (success) {
          await entityHooks[
            ENTITY_TYPES.PROPERTY_MINKAASA_PUBLISHED
          ].fetchItems();
          await entityHooks[
            ENTITY_TYPES.PROPERTY_MINKAASA_UNPUBLISHED
          ].fetchItems();
        }
      } else {
        success = await api.unpublishProperty(propertyId);
        if (success) {
          await entityHooks[ENTITY_TYPES.PROPERTY_PUBLISHED].fetchItems();
          await entityHooks[ENTITY_TYPES.PROPERTY_NOT_PUBLISHED].fetchItems();
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

      if (tabValue === TAB_INDICES.PROPERTY_MINKAASA_UNPUBLISHED) {
        success = await api.publishMinkaasaProperty(propertyId);
        if (success) {
          await entityHooks[
            ENTITY_TYPES.PROPERTY_MINKAASA_PUBLISHED
          ].fetchItems();
          await entityHooks[
            ENTITY_TYPES.PROPERTY_MINKAASA_UNPUBLISHED
          ].fetchItems();
        }
      } else {
        success = await api.publishProperty(propertyId);
        if (success) {
          await entityHooks[ENTITY_TYPES.PROPERTY_PUBLISHED].fetchItems();
          await entityHooks[ENTITY_TYPES.PROPERTY_NOT_PUBLISHED].fetchItems();
        }
      }

      return success;
    } catch (error) {
      console.error("Error al publicar propiedad:", error);
      return false;
    }
  };

  // Obtener datos de la entidad actual
  const getCurrentEntityData = () => {
    const entityHook = getCurrentEntityHook();
    return {
      items: entityHook.items,
      loading: entityHook.loading || imageLoading,
      error: entityHook.error,
      type: TAB_FORM_TYPE_MAP[tabValue],
      pagination: entityHook.pagination,
      onPageChange: handlePageChange,
      onPageSizeChange: handlePageSizeChange,
    };
  };

  const {
    items,
    loading,
    error: currentError,
    type,
    pagination,
  } = getCurrentEntityData();

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

        {/* Barra de filtros - solo para pestañas de propiedades */}
        {isPropertyTab() && (
          <PropertyFiltersBar
            filterType={getFilterType()}
            onFiltersChange={handleFiltersChange}
            showDevelopments={
              tabValue === TAB_INDICES.PROPERTY_NOT_PUBLISHED ||
              tabValue === TAB_INDICES.PROPERTY_PUBLISHED
            }
            title={`Filtros - ${TAB_LABELS[tabValue]}`}
            compact={false}
          />
        )}

        {currentError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {currentError}
          </Alert>
        )}

        <Box sx={{ p: 2 }}>
          <EntityList
            title={TAB_TITLES[type]}
            items={items}
            loading={loading}
            onAdd={handleOpenDialog}
            onEdit={handleOpenEditDialog}
            onDelete={handleOpenDeleteDialog}
            onUnpublish={handleUnpublishProperty}
            onPublish={handlePublishProperty}
            currentTab={tabValue}
            allDevelopers={entityHooks[ENTITY_TYPES.DEVELOPER].items}
            pagination={pagination}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
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
          loading={loading}
          error={currentError}
          setError={setFormError}
          formType={type}
          currentItem={currentItem}
          onRefreshData={handleRefreshData}
        />

        <DeleteDialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onDelete={handleDelete}
          itemToDelete={itemToDelete}
          loading={loading}
        />

        {/* Notificación de éxito */}
        <Snackbar
          open={!!successNotification}
          autoHideDuration={3000}
          onClose={() => setSuccessNotification(null)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert 
            onClose={() => setSuccessNotification(null)} 
            severity="success" 
            sx={{ width: '100%' }}
          >
            {successNotification}
          </Alert>
        </Snackbar>
      </Container>
    </>
  );
}
