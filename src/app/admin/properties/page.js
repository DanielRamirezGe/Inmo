"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Alert,
  Snackbar,
  Button,
} from "@mui/material";
import { Clear as ClearIcon } from "@mui/icons-material";

// Componentes
import AdminNavbar from "../components/AdminNavbar";
import EntityList from "./components/EntityList";
import FormDialog from "./components/FormDialog";
import DeleteDialog from "./components/DeleteDialog";
import PropertyFiltersBar from "../../../components/PropertyFiltersBar";

// Hooks personalizados
import {
  useEntityData,
  useGlobalEntityState,
  GlobalEntityStateProvider,
} from "../../../hooks/useGlobalEntityState";
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

function PropertiesPageContent() {
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

  // 🔧 FIX: Hook global para sincronización de estado
  const { refreshRelatedEntities, debugGlobalState, invalidateAllCache } =
    useGlobalEntityState();

  // 🔧 DEBUG: Función para diagnosticar problemas
  const handleDebugState = () => {
    debugGlobalState();
    console.log("Current tab:", tabValue);
    console.log(
      "Current entity hooks:",
      Object.keys(entityHooks).map((key) => ({
        type: key,
        itemsCount: entityHooks[key].items.length,
      }))
    );
  };

  // 🔧 FIX: Función para forzar refresh completo
  const handleForceRefresh = async () => {
    console.log("🔄 Forcing complete refresh of all entities");
    invalidateAllCache();

    // Refrescar todas las entidades
    await Promise.all([
      entityHooks[ENTITY_TYPES.DEVELOPER].fetchItems(1, undefined, true),
      entityHooks[ENTITY_TYPES.DEVELOPMENT].fetchItems(1, undefined, true),
      entityHooks[ENTITY_TYPES.PROPERTY_NOT_PUBLISHED].fetchItems(
        1,
        undefined,
        true
      ),
      entityHooks[ENTITY_TYPES.PROPERTY_PUBLISHED].fetchItems(
        1,
        undefined,
        true
      ),
      entityHooks[ENTITY_TYPES.PROPERTY_MINKAASA_UNPUBLISHED].fetchItems(
        1,
        undefined,
        true
      ),
      entityHooks[ENTITY_TYPES.PROPERTY_MINKAASA_PUBLISHED].fetchItems(
        1,
        undefined,
        true
      ),
    ]);

    setSuccessNotification("Datos refrescados completamente");
  };

  // Hooks consolidados para todas las entidades usando el estado global
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

  // 🔧 FIX: Manejador de paginación que mantiene filtros
  const handlePageChange = useCallback(
    (newPage) => {
      // Si hay filtros activos, usar búsqueda con filtros
      if (Object.keys(activeFilters).length > 0) {
        handlePageChangeWithFilters(newPage);
      } else {
        // Sin filtros, usar el comportamiento normal
        getCurrentEntityHook().fetchItems(newPage);
      }
    },
    [tabValue, activeFilters]
  );

  // 🔧 NUEVA: Función para cambiar página manteniendo filtros
  const handlePageChangeWithFilters = async (newPage) => {
    try {
      const entityHook = getCurrentEntityHook();
      const filterType = getFilterType();

      // Preparar filtros para la API
      const searchFilters = { ...activeFilters, type: filterType };

      // Mapear campos específicos
      if (searchFilters.propertyType) {
        searchFilters.propertyTypeId = searchFilters.propertyType;
        delete searchFilters.propertyType;
      }
      if (searchFilters.development) {
        searchFilters.developmentId = searchFilters.development;
        delete searchFilters.development;
      }

      // Obtener pageSize actual
      const currentPageSize = entityHook.pagination?.pageSize || 15;

      // Buscar con filtros en la página específica
      const results = await api.searchProperties(
        searchFilters,
        newPage,
        currentPageSize
      );

      // ✅ ACTUALIZAR ESTADO GLOBAL CON RESULTADOS FILTRADOS
      entityHook.setItems(results.data);
      entityHook.setPagination({
        page: results.page,
        pageSize: results.pageSize,
        total: results.total,
      });

      // 🔧 FORZAR invalidación del cache para mantener consistencia
      entityHook.invalidateCache();

      console.log(`✅ Página ${newPage} con filtros aplicados:`, {
        resultados: results.data.length,
        total: results.total,
        filtros: activeFilters,
      });
    } catch (error) {
      console.error("Error al cambiar página con filtros:", error);
      // Fallback: recargar sin filtros
      getCurrentEntityHook().fetchItems(newPage);
    }
  };

  // 🔧 FIX: Manejador de cambio de tamaño de página que mantiene filtros
  const handlePageSizeChange = useCallback(
    (newPageSize) => {
      // Si hay filtros activos, usar búsqueda con filtros
      if (Object.keys(activeFilters).length > 0) {
        handlePageSizeChangeWithFilters(newPageSize);
      } else {
        // Sin filtros, usar el comportamiento normal
        getCurrentEntityHook().fetchItems(1, newPageSize);
      }
    },
    [tabValue, activeFilters]
  );

  // 🔧 NUEVA: Función para cambiar tamaño de página manteniendo filtros
  const handlePageSizeChangeWithFilters = async (newPageSize) => {
    try {
      const entityHook = getCurrentEntityHook();
      const filterType = getFilterType();

      // Preparar filtros para la API
      const searchFilters = { ...activeFilters, type: filterType };

      // Mapear campos específicos
      if (searchFilters.propertyType) {
        searchFilters.propertyTypeId = searchFilters.propertyType;
        delete searchFilters.propertyType;
      }
      if (searchFilters.development) {
        searchFilters.developmentId = searchFilters.development;
        delete searchFilters.development;
      }

      // Buscar con filtros en la primera página con nuevo tamaño
      const results = await api.searchProperties(
        searchFilters,
        1, // Siempre empezar en página 1 al cambiar tamaño
        newPageSize
      );

      // ✅ ACTUALIZAR ESTADO GLOBAL CON RESULTADOS FILTRADOS
      entityHook.setItems(results.data);
      entityHook.setPagination({
        page: 1,
        pageSize: newPageSize,
        total: results.total,
      });

      // 🔧 FORZAR invalidación del cache
      entityHook.invalidateCache();

      console.log(
        `✅ Tamaño de página cambiado a ${newPageSize} con filtros:`,
        {
          resultados: results.data.length,
          total: results.total,
          filtros: activeFilters,
        }
      );
    } catch (error) {
      console.error("Error al cambiar tamaño de página con filtros:", error);
      // Fallback: recargar sin filtros
      getCurrentEntityHook().fetchItems(1, newPageSize);
    }
  };

  // Cargar datos iniciales
  useEffect(() => {
    const loadInitialData = async () => {
      await entityHooks[ENTITY_TYPES.DEVELOPER].fetchItems();
      setInitialLoadDone(true);
    };
    loadInitialData();
  }, []);

  // 🔧 DEBUG: Exponer funciones para debugging (temporal)
  useEffect(() => {
    window.debugAdminState = handleDebugState;
    window.forceRefreshAdmin = handleForceRefresh;
    window.entityHooks = entityHooks;

    return () => {
      delete window.debugAdminState;
      delete window.forceRefreshAdmin;
      delete window.entityHooks;
    };
  }, [handleDebugState, handleForceRefresh, entityHooks]);

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

  // 🔧 FIX: Función mejorada para manejar cambios en los filtros
  const handleFiltersChange = (filters, searchResults = null) => {
    setActiveFilters(filters);

    // Si hay resultados de búsqueda, actualizar la lista
    if (searchResults) {
      const entityHook = getCurrentEntityHook();

      // ✅ ACTUALIZAR ESTADO GLOBAL CON RESULTADOS FILTRADOS
      entityHook.setItems(searchResults.data);
      entityHook.setPagination({
        page: 1, // 🔧 IMPORTANTE: Resetear a página 1 al aplicar filtros
        pageSize: searchResults.pageSize,
        total: searchResults.total,
      });

      // 🔧 FORZAR invalidación del cache para mantener consistencia
      entityHook.invalidateCache();

      console.log("✅ Filtros aplicados y resultados actualizados:", {
        resultados: searchResults.data.length,
        total: searchResults.total,
        filtros: filters,
      });
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

  // 🔧 NUEVA: Función para limpiar filtros y volver al estado normal
  const handleClearFilters = async () => {
    try {
      setActiveFilters({});

      // Recargar datos sin filtros
      const entityHook = getCurrentEntityHook();
      await entityHook.fetchItems(1, undefined, true); // Force refresh

      console.log("✅ Filtros limpiados, datos recargados");
    } catch (error) {
      console.error("Error al limpiar filtros:", error);
    }
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

  // 🔧 FIX: Función mejorada para eliminar elementos
  const handleDelete = async () => {
    try {
      const entityHook = getCurrentEntityHook();
      const idField = getIdField(tabValue);
      const itemId = itemToDelete[idField];

      console.log(`🗑️ Attempting to delete item with ID: ${itemId}`);

      const success = await entityHook.deleteItem(itemId);

      if (success) {
        setDeleteDialogOpen(false);
        setItemToDelete(null);

        // Mostrar notificación de éxito
        const entityLabel =
          ENTITY_LABELS[TAB_FORM_TYPE_MAP[tabValue]]?.singular || "elemento";
        setSuccessNotification(`${entityLabel} eliminado exitosamente`);

        console.log(
          `✅ Successfully deleted ${entityLabel} with ID: ${itemId}`
        );
      } else {
        console.error(`❌ Failed to delete item with ID: ${itemId}`);
      }
    } catch (error) {
      console.error("Error al eliminar:", error);
      // El error ya se maneja en el hook global, aquí solo logueamos
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

  // 🔧 FIX: Función mejorada para refrescar datos después de edición exitosa
  const handleRefreshData = async (successMessage = null) => {
    try {
      const entityHook = getCurrentEntityHook();
      const entityType = TAB_FORM_TYPE_MAP[tabValue];

      // Usar el sistema global para refrescar entidades relacionadas
      await refreshRelatedEntities(entityType, "UPDATE");

      // ✅ SOLUCIÓN: Refrescar datos inmediatamente después de editar
      await entityHook.fetchItems(1, undefined, true);

      // Mostrar notificación de éxito si se proporciona
      if (successMessage) {
        setSuccessNotification(successMessage);
      }
    } catch (error) {
      console.error("Error al refrescar datos:", error);
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
      if (
        !isEditing &&
        (tabValue === TAB_INDICES.PROPERTY_NOT_PUBLISHED ||
          tabValue === TAB_INDICES.PROPERTY_PUBLISHED ||
          tabValue === TAB_INDICES.PROPERTY_MINKAASA_UNPUBLISHED ||
          tabValue === TAB_INDICES.PROPERTY_MINKAASA_PUBLISHED)
      ) {
        console.log(
          "🔄 Creación nueva de propiedades: delegando al proceso multi-paso de FormDialog"
        );
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

        // 🔧 FIX: Mostrar notificación específica y asegurar refresh
        const entityLabel =
          ENTITY_LABELS[TAB_FORM_TYPE_MAP[tabValue]]?.singular || "elemento";
        const isEditing = !!currentItem;
        const successMessage = isEditing
          ? `${entityLabel} actualizado exitosamente`
          : `${entityLabel} creado exitosamente`;

        setSuccessNotification(successMessage);
        console.log(`✅ ${successMessage}`);
      }
    } catch (error) {
      console.error("Error al guardar:", error);
      setFormError(
        "Error al guardar los datos. Por favor, inténtalo de nuevo."
      );
    }
  };

  // 🔧 FIX: Función mejorada para despublicar una propiedad
  const handleUnpublishProperty = async (propertyId) => {
    if (unpublishing) return false;

    try {
      setUnpublishing(true);
      let success;
      let entityType;

      if (tabValue === TAB_INDICES.PROPERTY_MINKAASA_PUBLISHED) {
        success = await api.unpublishMinkaasaProperty(propertyId);
        entityType = ENTITY_TYPES.PROPERTY_MINKAASA_PUBLISHED;
      } else {
        success = await api.unpublishProperty(propertyId);
        entityType = ENTITY_TYPES.PROPERTY_PUBLISHED;
      }

      if (success) {
        // 🔧 FIX: Usar el sistema global para refrescar entidades relacionadas
        await refreshRelatedEntities(entityType, "UNPUBLISH");

        // ✅ SOLUCIÓN: Refrescar datos inmediatamente después de despublicar
        await getCurrentEntityHook().fetchItems(1, undefined, true);

        setSuccessNotification("Propiedad despublicada exitosamente");
      }

      return success;
    } catch (error) {
      console.error("Error al despublicar propiedad:", error);
      return false;
    } finally {
      setUnpublishing(false);
    }
  };

  // 🔧 FIX: Función mejorada para publicar una propiedad
  const handlePublishProperty = async (propertyId) => {
    try {
      let success;
      let entityType;

      if (tabValue === TAB_INDICES.PROPERTY_MINKAASA_UNPUBLISHED) {
        success = await api.publishMinkaasaProperty(propertyId);
        entityType = ENTITY_TYPES.PROPERTY_MINKAASA_UNPUBLISHED;
      } else {
        success = await api.publishProperty(propertyId);
        entityType = ENTITY_TYPES.PROPERTY_NOT_PUBLISHED;
      }

      if (success) {
        // 🔧 FIX: Usar el sistema global para refrescar entidades relacionadas
        await refreshRelatedEntities(entityType, "PUBLISH");

        // ✅ SOLUCIÓN: Refrescar datos inmediatamente después de publicar
        await getCurrentEntityHook().fetchItems(1, undefined, true);

        setSuccessNotification("Propiedad publicada exitosamente");
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
          <>
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

            {/* 🔧 INDICADOR DE FILTROS ACTIVOS */}
            {Object.keys(activeFilters).length > 0 && (
              <Box
                sx={{ mb: 2, display: "flex", alignItems: "center", gap: 2 }}
              >
                <Alert
                  severity="info"
                  sx={{ flex: 1 }}
                  action={
                    <Button
                      color="inherit"
                      size="small"
                      onClick={handleClearFilters}
                      startIcon={<ClearIcon />}
                    >
                      Limpiar Filtros
                    </Button>
                  }
                >
                  Filtros activos: {Object.keys(activeFilters).length}{" "}
                  criterio(s) aplicado(s)
                </Alert>
              </Box>
            )}
          </>
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
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={() => setSuccessNotification(null)}
            severity="success"
            sx={{ width: "100%" }}
          >
            {successNotification}
          </Alert>
        </Snackbar>
      </Container>
    </>
  );
}

// 🔧 FIX: Componente principal con Provider de estado global
export default function PropertiesPage() {
  return (
    <GlobalEntityStateProvider>
      <PropertiesPageContent />
    </GlobalEntityStateProvider>
  );
}
