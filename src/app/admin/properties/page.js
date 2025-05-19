"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Alert,
} from "@mui/material";
import { useAxiosMiddleware } from "../../../utils/axiosMiddleware";

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

const ENTITY_TYPES = {
  DEVELOPER: 'developer',
  DEVELOPMENT: 'development',
  PROPERTY: 'property'
};

const TAB_TITLES = {
  0: "Desarrolladoras Inmobiliarias",
  1: "Desarrollos",
  2: "Propiedades"
};

export default function PropertiesPage() {
  const axiosInstance = useAxiosMiddleware();
  const [tabValue, setTabValue] = useState(0);
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  
  // Estados para diálogos
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [currentItem, setCurrentItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [currentFields, setCurrentFields] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Hooks personalizados para cada tipo de entidad
  const {
    items: developers,
    loading: developersLoading,
    error: developersError,
    fetchItems: fetchDevelopers,
    getItemDetails: getDeveloperDetails,
    deleteItem: deleteDeveloper,
    saveItem: saveDeveloper,
  } = useEntityData(ENTITY_TYPES.DEVELOPER, axiosInstance);

  const {
    items: developments,
    loading: developmentsLoading,
    error: developmentsError,
    fetchItems: fetchDevelopments,
    getItemDetails: getDevelopmentDetails,
    deleteItem: deleteDevelopment,
    saveItem: saveDevelopment,
  } = useEntityData(ENTITY_TYPES.DEVELOPMENT, axiosInstance);

  const {
    items: properties,
    loading: propertiesLoading,
    error: propertiesError,
    fetchItems: fetchProperties,
    getItemDetails: getPropertyDetails,
    deleteItem: deleteProperty,
    saveItem: saveProperty,
  } = useEntityData(ENTITY_TYPES.PROPERTY, axiosInstance);

  const {
    processItemImages,
    imageLoading,
  } = useImageHandling(axiosInstance);

  // Cargar datos iniciales solo una vez al montar el componente
  useEffect(() => {
    if (!initialLoadDone) {
      fetchDevelopers(); // Siempre necesitamos los desarrolladores
      setInitialLoadDone(true);
    }
  }, [fetchDevelopers, initialLoadDone]);

  // Cargar datos específicos cuando cambia la pestaña
  useEffect(() => {
    if (!initialLoadDone) return; // Esperar a que se carguen los desarrolladores

    switch (tabValue) {
      case 1:
        fetchDevelopments();
        break;
      case 2:
        fetchProperties();
        break;
      // case 0 no necesita nada porque los desarrolladores ya se cargaron
    }
  }, [tabValue, fetchDevelopments, fetchProperties, initialLoadDone]);

  // Manejo de cambio de pestaña
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Función para abrir diálogo
  const handleOpenDialog = async (type, item = null) => {
    let updatedItem = item;

    if (item) {
      try {
        let detailedItem;
        switch (type) {
          case ENTITY_TYPES.DEVELOPER:
            detailedItem = await getDeveloperDetails(item.realEstateDevelopmentId);
            break;
          case ENTITY_TYPES.DEVELOPMENT:
            detailedItem = await getDevelopmentDetails(item.developmentId);
            break;
          case ENTITY_TYPES.PROPERTY:
            detailedItem = await getPropertyDetails(item.prototypeId);
            break;
        }
        
        if (detailedItem) {
          updatedItem = await processItemImages(detailedItem);
        }
      } catch (error) {
        console.error("Error al obtener detalles:", error);
      }
    }

    setCurrentItem(updatedItem);

    if (type === ENTITY_TYPES.DEVELOPER) {
      setDialogTitle(updatedItem ? "Editar Desarrolladora" : "Agregar Desarrolladora Inmobiliaria");
      setCurrentFields(developerFields);
    } else if (type === ENTITY_TYPES.DEVELOPMENT) {
      setDialogTitle(updatedItem ? "Editar Desarrollo" : "Agregar Desarrollo");
      setCurrentFields(developmentFields);
    } else if (type === ENTITY_TYPES.PROPERTY) {
      setDialogTitle(updatedItem ? "Editar Propiedad" : "Agregar Propiedad");
      setCurrentFields(propertyFields);
    }

    setFormData(updatedItem || {});
    setDialogOpen(true);
  };

  // Función para manejar eliminación
  const handleOpenDeleteDialog = (item) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  // Función para eliminar elementos
  const handleDelete = async () => {
    try {
      if (tabValue === 0) {
        await deleteDeveloper(itemToDelete.realEstateDevelopmentId);
      } else if (tabValue === 1) {
        await deleteDevelopment(itemToDelete.developmentId);
      } else if (tabValue === 2) {
        await deleteProperty(itemToDelete.prototypeId);
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
      if (tabValue === 0) {
        success = await saveDeveloper(
          formData,
          currentItem?.realEstateDevelopmentId
        );
      } else if (tabValue === 1) {
        const formDataToSend = new FormData();
        Object.keys(formData).forEach(key => {
          if (!key.includes('Preview')) {
            const value = formData[key];
            if (value !== null && value !== undefined) {
              formDataToSend.append(key, value);
            }
          }
        });
        success = await saveDevelopment(
          formDataToSend,
          currentItem?.developmentId
        );
      } else if (tabValue === 2) {
        const formDataToSend = new FormData();
        Object.keys(formData).forEach(key => {
          if (!key.includes('Preview')) {
            const value = formData[key];
            if (value !== null && value !== undefined) {
              formDataToSend.append(key, value);
            }
          }
        });
        success = await saveProperty(
          formDataToSend,
          currentItem?.prototypeId
        );
      }

      if (success) {
        setDialogOpen(false);
      }
    } catch (error) {
      console.error("Error al guardar:", error);
    }
  };

  const getCurrentItems = () => {
    switch (tabValue) {
      case 0:
        return {
          items: developers,
          loading: developersLoading || imageLoading,
          error: developersError,
          type: ENTITY_TYPES.DEVELOPER
        };
      case 1:
        return {
          items: developments,
          loading: developmentsLoading || imageLoading,
          error: developmentsError,
          type: ENTITY_TYPES.DEVELOPMENT
        };
      case 2:
        return {
          items: properties,
          loading: propertiesLoading || imageLoading,
          error: propertiesError,
          type: ENTITY_TYPES.PROPERTY
        };
      default:
        return { items: [], loading: false, error: null, type: null };
    }
  };

  const { items, loading, error, type } = getCurrentItems();

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
            <Tab label="Desarrolladora Inmobiliaria" />
            <Tab label="Desarrollo" />
            <Tab label="Propiedades" />
          </Tabs>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ p: 2 }}>
          <EntityList
            title={TAB_TITLES[tabValue]}
            items={items}
            loading={loading}
            onAdd={() => handleOpenDialog(type)}
            onEdit={(item) => handleOpenDialog(type, item)}
            onDelete={handleOpenDeleteDialog}
            currentTab={tabValue}
            allDevelopers={developers}
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
          error={error}
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
