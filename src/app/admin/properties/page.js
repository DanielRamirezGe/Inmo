"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import AdminNavbar from "../components/AdminNavbar";
import { useAxiosMiddleware } from "../../../utils/axiosMiddleware";
import AddIcon from "@mui/icons-material/Add";

// Importar componentes
import ItemCard from "./components/ItemCard";
import FormDialog from "./components/FormDialog";
import DeleteDialog from "./components/DeleteDialog";

// Importar configuraciones
import {
  developerFields,
  developmentFields,
  externalAgencyFields,
  propertyFields,
} from "./components/fieldsConfig";

// Importar datos de ejemplo
import {
  MOCK_DEVELOPERS,
  MOCK_DEVELOPMENTS,
  MOCK_AGENCIES,
  MOCK_PROPERTIES,
} from "./components/mockData";

export default function PropertiesPage() {
  const axiosInstance = useAxiosMiddleware();
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);

  // Usar datos de ejemplo en lugar de obtenerlos de la API
  const [developers, setDevelopers] = useState(MOCK_DEVELOPERS);
  const [developments, setDevelopments] = useState(MOCK_DEVELOPMENTS);
  const [externalAgencies, setExternalAgencies] = useState(MOCK_AGENCIES);
  const [properties, setProperties] = useState(MOCK_PROPERTIES);

  const [error, setError] = useState(null);

  // Estados para diálogos
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [currentItem, setCurrentItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [currentFields, setCurrentFields] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Cargar datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Obtener datos reales de Desarrolladoras Inmobiliarias
        const devResponse = await axiosInstance.get("/realEstateDevelopment");
        console.log("Datos de desarrolladoras:", devResponse.data);
        setDevelopers(devResponse.data.data || []);

        // Obtener datos reales de Desarrollos
        const developmentResponse = await axiosInstance.get("/development");
        console.log("Datos de desarrollos:", developmentResponse.data);
        setDevelopments(developmentResponse.data.data || []);

        // Para el resto, seguimos usando datos simulados
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Error al cargar los datos. Por favor, inténtalo de nuevo.");
        // Si falla la carga de datos reales, usamos los datos simulados
        setDevelopers(MOCK_DEVELOPERS);
        setDevelopments(MOCK_DEVELOPMENTS);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Manejo de cambio de pestaña
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Función para abrir diálogo
  const handleOpenDialog = (type, item = null) => {
    setCurrentItem(item);

    if (type === "developer") {
      setDialogTitle(
        item ? "Editar Desarrolladora" : "Agregar Desarrolladora Inmobiliaria"
      );
      setCurrentFields(developerFields);
    } else if (type === "development") {
      setDialogTitle(item ? "Editar Desarrollo" : "Agregar Desarrollo");
      setCurrentFields(developmentFields);
    } else if (type === "agency") {
      setDialogTitle(
        item ? "Editar Inmobiliaria Externa" : "Agregar Inmobiliaria Externa"
      );
      setCurrentFields(externalAgencyFields);
    } else if (type === "property") {
      setDialogTitle(item ? "Editar Propiedad" : "Agregar Propiedad");
      setCurrentFields(propertyFields);
    }

    setFormData(item || {});
    setDialogOpen(true);
  };

  // Función para manejar eliminación
  const handleOpenDeleteDialog = (item) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  // Función para eliminar elementos
  const handleDelete = async () => {
    setLoading(true);

    try {
      if (tabValue === 0) {
        // Implementación real para Desarrolladora Inmobiliaria
        await axiosInstance.delete(
          `/realEstateDevelopment/${itemToDelete.realEstateDevelopmentId}`
        );

        // Recargar los datos actualizados desde la API
        const response = await axiosInstance.get("/realEstateDevelopment");
        setDevelopers(response.data.data || []);
      } else if (tabValue === 1) {
        // Implementación real para Desarrollo
        await axiosInstance.delete(
          `/development/${itemToDelete.developmentId}`
        );

        // Recargar los datos actualizados
        const response = await axiosInstance.get("/development");
        setDevelopments(response.data.data || []);
      } else {
        // Para los demás casos, mantener la simulación
        if (tabValue === 2) {
          setExternalAgencies(
            externalAgencies.filter((agency) => agency.id !== itemToDelete.id)
          );
        } else if (tabValue === 3) {
          setProperties(
            properties.filter((prop) => prop.id !== itemToDelete.id)
          );
        }
      }

      setDeleteDialogOpen(false);
      setItemToDelete(null);
    } catch (error) {
      console.error("Error al eliminar:", error);
      setError(`Error al eliminar el elemento: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Función para guardar elementos
  const handleSaveForm = async () => {
    setLoading(true);

    try {
      if (tabValue === 0) {
        // Desarrolladora Inmobiliaria
        let endpoint = "/realEstateDevelopment";

        if (currentItem) {
          const id = currentItem.realEstateDevelopmentId;
          console.log(currentItem);
          // Actualizar desarrolladora existente
          endpoint = `/realEstateDevelopment/${id}`;
          await axiosInstance.put(endpoint, formData);
        } else {
          // Crear nueva desarrolladora
          await axiosInstance.post(endpoint, formData);
        }

        // Después de crear/editar, volvemos a cargar los datos actualizados de la API
        const response = await axiosInstance.get("/realEstateDevelopment");
        setDevelopers(response.data.data || []);

        setDialogOpen(false);
      } else if (tabValue === 1) {
        // Desarrollo
        let endpoint = "/development";

        if (currentItem) {
          const id = currentItem.developmentId;
          // Actualizar desarrollo existente
          endpoint = `/development/${id}`;
          await axiosInstance.put(endpoint, formData);
        } else {
          // Crear nuevo desarrollo
          await axiosInstance.post(endpoint, formData);
        }

        // Después de crear/editar, volvemos a cargar los datos actualizados
        const response = await axiosInstance.get("/development");
        setDevelopments(response.data.data || []);

        setDialogOpen(false);
      } else {
        // Para los demás casos, mantener la simulación
        setTimeout(() => {
          let updatedData = [];
          const newId = Date.now();

          if (tabValue === 2) {
            // Inmobiliaria Externa
            if (currentItem) {
              updatedData = externalAgencies.map((agency) =>
                agency.id === currentItem.id
                  ? { ...agency, ...formData }
                  : agency
              );
            } else {
              updatedData = [...externalAgencies, { ...formData, id: newId }];
            }
            setExternalAgencies(updatedData);
          } else if (tabValue === 3) {
            // Propiedades
            if (currentItem) {
              updatedData = properties.map((prop) =>
                prop.id === currentItem.id ? { ...prop, ...formData } : prop
              );
            } else {
              updatedData = [...properties, { ...formData, id: newId }];
            }
            setProperties(updatedData);
          }

          setDialogOpen(false);
          setLoading(false);
        }, 800);
      }
    } catch (error) {
      console.error("Error al guardar los datos:", error);
      setError(`Error al guardar los datos: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Función para renderizar el contenido según la pestaña
  const renderTabContent = () => {
    let items = [];
    let type = "";

    if (tabValue === 0) {
      items = developers;
      type = "developer";
    } else if (tabValue === 1) {
      items = developments;
      type = "development";
    } else if (tabValue === 2) {
      items = externalAgencies;
      type = "agency";
    } else if (tabValue === 3) {
      items = properties;
      type = "property";
    }

    if (loading && items.length === 0) {
      return (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      );
    }

    return (
      <>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h6">
            {tabValue === 0 && "Desarrolladoras Inmobiliarias"}
            {tabValue === 1 && "Desarrollos"}
            {tabValue === 2 && "Inmobiliarias Externas"}
            {tabValue === 3 && "Propiedades"}
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog(type)}
            sx={{
              bgcolor: "#25D366",
              "&:hover": { bgcolor: "#128C7E" },
            }}
          >
            Agregar
          </Button>
        </Box>

        {items.length === 0 ? (
          <Alert severity="info" sx={{ mt: 2 }}>
            No hay elementos para mostrar. Agrega uno nuevo con el botón
            superior.
          </Alert>
        ) : (
          <Grid container spacing={3}>
            {items.map((item, index) => (
              <Grid xs={12} sm={6} md={4} lg={3} key={index}>
                <ItemCard
                  item={item}
                  onEdit={() => handleOpenDialog(type, item)}
                  onDelete={() => handleOpenDeleteDialog(item)}
                  currentTab={tabValue}
                  allDevelopers={developers}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </>
    );
  };

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
            <Tab label="Inmobiliaria Externa" />
            <Tab label="Propiedades" />
          </Tabs>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ p: 2 }}>{renderTabContent()}</Box>

        {/* Formulario modal */}
        <FormDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onSubmit={handleSaveForm}
          title={dialogTitle}
          formData={formData}
          setFormData={setFormData}
          fields={currentFields}
          loading={loading}
        />

        {/* Diálogo de confirmación para eliminar */}
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
