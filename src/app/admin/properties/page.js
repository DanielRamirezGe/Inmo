"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Card,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Divider,
  CircularProgress,
  Alert,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import AdminNavbar from "../components/AdminNavbar";
import { useAxiosMiddleware } from "../../../utils/axiosMiddleware";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

// Componente para las tarjetas de elementos
const ItemCard = ({ item, onEdit, onDelete }) => {
  return (
    <Card
      sx={{
        p: 2,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: 4,
        },
      }}
    >
      <Box>
        <Typography variant="h6" gutterBottom noWrap>
          {item.realEstateDevelopmentName}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          URL: {item.url || "No disponible"}
        </Typography>

        {/* Mostrar contactos */}
        {item.contacts && item.contacts.length > 0 && (
          <Box sx={{ mt: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              Contactos:
            </Typography>
            {item.contacts.map((contact, index) => (
              <Box
                key={contact.realEstateContactId || index}
                sx={{ ml: 1, mb: 1 }}
              >
                <Typography variant="body2">
                  {`${contact.name} ${contact.lastNameP} ${contact.lastNameM}`}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {`${contact.role} - ${contact.mainPhone}`}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {contact.mainEmail}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </Box>

      <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
        <IconButton
          size="small"
          color="primary"
          onClick={() => onEdit(item)}
          sx={{ mr: 1 }}
        >
          <EditIcon />
        </IconButton>
        <IconButton size="small" color="error" onClick={() => onDelete(item)}>
          <DeleteIcon />
        </IconButton>
      </Box>
    </Card>
  );
};

// Componente de formulario genérico
const FormDialog = ({
  open,
  onClose,
  onSubmit,
  title,
  formData,
  setFormData,
  fields,
  loading,
}) => {
  const [contacts, setContacts] = useState([
    {
      role: "",
      name: "",
      lastNameP: "",
      lastNameM: "",
      mainEmail: "",
      mainPhone: "",
    },
  ]);

  useEffect(() => {
    setContacts(
      formData.contacts || [
        {
          role: "",
          name: "",
          lastNameP: "",
          lastNameM: "",
          mainEmail: "",
          mainPhone: "",
        },
      ]
    );
  }, [formData.contacts]);

  const handleContactChange = (index, field, value) => {
    const newContacts = [...contacts];
    newContacts[index][field] = value;
    setContacts(newContacts);
    setFormData({ ...formData, contacts: newContacts });
  };

  const addContact = () => {
    setContacts([
      ...contacts,
      {
        role: "",
        name: "",
        lastNameP: "",
        lastNameM: "",
        mainEmail: "",
        mainPhone: "",
      },
    ]);
  };

  const removeContact = (index) => {
    const newContacts = contacts.filter((_, i) => i !== index);
    setContacts(newContacts);
    setFormData({ ...formData, contacts: newContacts });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Box component="form" sx={{ mt: 2 }}>
          {/* Campos principales */}
          <TextField
            fullWidth
            margin="normal"
            label="Nombre de la Desarrolladora"
            name="realEstateDevelopmentName"
            value={formData.realEstateDevelopmentName || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                realEstateDevelopmentName: e.target.value,
              })
            }
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="URL"
            name="url"
            value={formData.url || ""}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
          />

          {/* Sección de contactos */}
          <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
            Contactos
          </Typography>
          {contacts.map((contact, index) => (
            <Box
              key={index}
              sx={{ mb: 3, p: 2, border: "1px solid #e0e0e0", borderRadius: 1 }}
            >
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
              >
                <Typography variant="subtitle1">
                  Contacto {index + 1}
                </Typography>
                {contacts.length > 1 && (
                  <IconButton
                    size="small"
                    onClick={() => removeContact(index)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                )}
              </Box>
              <Grid container spacing={2}>
                <Grid xs={6}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Nombre"
                    value={contact.name || ""}
                    onChange={(e) =>
                      handleContactChange(index, "name", e.target.value)
                    }
                  />
                </Grid>
                <Grid xs={6}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Rol"
                    value={contact.role || ""}
                    onChange={(e) =>
                      handleContactChange(index, "role", e.target.value)
                    }
                  />
                </Grid>
                <Grid xs={6}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Apellido Paterno"
                    value={contact.lastNameP || ""}
                    onChange={(e) =>
                      handleContactChange(index, "lastNameP", e.target.value)
                    }
                  />
                </Grid>
                <Grid xs={6}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Apellido Materno"
                    value={contact.lastNameM || ""}
                    onChange={(e) =>
                      handleContactChange(index, "lastNameM", e.target.value)
                    }
                  />
                </Grid>
                <Grid xs={6}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Email"
                    value={contact.mainEmail || ""}
                    onChange={(e) =>
                      handleContactChange(index, "mainEmail", e.target.value)
                    }
                  />
                </Grid>
                <Grid xs={6}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Teléfono"
                    value={contact.mainPhone || ""}
                    onChange={(e) =>
                      handleContactChange(index, "mainPhone", e.target.value)
                    }
                  />
                </Grid>
              </Grid>
            </Box>
          ))}
          <Button
            variant="outlined"
            onClick={addContact}
            startIcon={<AddIcon />}
            sx={{ mt: 2 }}
          >
            Agregar Contacto
          </Button>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={onSubmit} variant="contained" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : "Guardar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Datos de ejemplo
const MOCK_DEVELOPERS = [];

const MOCK_DEVELOPMENTS = [
  {
    id: 1,
    name: "Residencial Los Pinos",
    description:
      "Complejo residencial con 120 departamentos, áreas verdes y amenidades premium.",
    location: "Zona Norte, Ciudad de México",
    developerId: 1,
    status: "En construcción",
  },
  {
    id: 2,
    name: "Torres Ejecutivas Centro",
    description:
      "Edificio de oficinas clase A con vistas panorámicas y estacionamiento privado.",
    location: "Centro Financiero, Monterrey",
    developerId: 2,
    status: "Completado",
  },
  {
    id: 3,
    name: "Condominio Las Brisas",
    description:
      "Desarrollo ecológico con paneles solares y sistemas de captación de agua pluvial.",
    location: "Zona Costera, Cancún",
    developerId: 3,
    status: "Pre-venta",
  },
  {
    id: 4,
    name: "Fraccionamiento El Bosque",
    description:
      "Casas unifamiliares en entorno natural con club privado y seguridad 24/7.",
    location: "Periferia Sur, Guadalajara",
    developerId: 1,
    status: "En construcción",
  },
  {
    id: 5,
    name: "Plaza Comercial Andares",
    description:
      "Centro comercial con locales de diferentes dimensiones y alto flujo peatonal.",
    location: "Zapopan, Jalisco",
    developerId: 4,
    status: "Completado",
  },
];

const MOCK_AGENCIES = [
  {
    id: 1,
    name: "Inmobiliaria Siglo XXI",
    description:
      "Red nacional de agentes especializada en propiedades residenciales y comerciales.",
    contactName: "Carlos Ramírez",
    contactPhone: "555-111-2222",
    contactEmail: "carlos@sigloxxi.com",
  },
  {
    id: 2,
    name: "MegaCasas",
    description:
      "Agencia premium enfocada en propiedades de lujo y exclusivas.",
    contactName: "Patricia Herrera",
    contactPhone: "555-333-4444",
    contactEmail: "patricia@megacasas.com",
  },
  {
    id: 3,
    name: "TuHogar Inmobiliaria",
    description:
      "Especialistas en primera vivienda y opciones accesibles para familias.",
    contactName: "Javier Méndez",
    contactPhone: "555-555-6666",
    contactEmail: "javier@tuhogar.com",
  },
];

const MOCK_PROPERTIES = [
  {
    id: 1,
    title: "Departamento de lujo en Los Pinos",
    description:
      "Hermoso departamento de 3 recámaras con vista panorámica, acabados de lujo y terraza privada.",
    price: 4500000,
    location: "Torre Norte, Piso 15, Los Pinos",
    developmentId: 1,
    type: "Departamento",
    status: "Disponible",
  },
  {
    id: 2,
    title: "Oficina ejecutiva en Torres Centro",
    description:
      "Oficina de 120m² completamente equipada, 3 privados, sala de juntas y recepción.",
    price: 3800000,
    location: "Piso 8, Torres Ejecutivas Centro",
    developmentId: 2,
    type: "Oficina",
    status: "Disponible",
  },
  {
    id: 3,
    title: "Villa frente al mar",
    description:
      "Espectacular villa de 4 habitaciones con acceso directo a la playa, piscina privada y jardín tropical.",
    price: 12500000,
    location: "Condominio Las Brisas, Villa 7",
    developmentId: 3,
    externalAgencyId: 2,
    type: "Casa",
    status: "Pre-venta",
  },
  {
    id: 4,
    title: "Casa familiar en El Bosque",
    description:
      "Acogedora casa de 3 recámaras, 2.5 baños, jardín amplio y cochera para 2 autos.",
    price: 3200000,
    location: "Calle Roble 123, Fraccionamiento El Bosque",
    developmentId: 4,
    externalAgencyId: 1,
    type: "Casa",
    status: "Disponible",
  },
  {
    id: 5,
    title: "Local comercial en Plaza Andares",
    description:
      "Local de 75m² en ubicación privilegiada con alto tráfico de visitantes, ideal para retail.",
    price: 5800000,
    location: "Local B-15, Plaza Comercial Andares",
    developmentId: 5,
    externalAgencyId: 3,
    type: "Comercial",
    status: "Disponible",
  },
  {
    id: 6,
    title: "Penthouse de lujo",
    description:
      "Impresionante penthouse con 4 habitaciones, terraza panorámica y helipuerto privado.",
    price: 18500000,
    location: "Torre Sur, Piso 30, Los Pinos",
    developmentId: 1,
    externalAgencyId: 2,
    type: "Penthouse",
    status: "Disponible",
  },
];

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

  // Definiciones de campos para cada tipo
  const developerFields = [
    { name: "realEstateDevelopmentName", label: "Nombre", required: true },
    { name: "url", label: "Url web" },
    { name: "contactName", label: "Nombre de Contacto" },
    { name: "contactLastNameP", label: "Apellido Paterno de Contacto" },
    { name: "contactLastNameM", label: "Apellido Materno de Contacto" },
    { name: "contactPhone", label: "Teléfono de Contacto" },
    { name: "contactRole", label: "Rol del Contacto" },
    { name: "contactEmail", label: "Email de Contacto" },
  ];

  const developmentFields = [
    { name: "name", label: "Nombre", required: true },
    { name: "description", label: "Descripción", multiline: true, rows: 3 },
    { name: "location", label: "Ubicación" },
    { name: "developerId", label: "ID del Desarrollador", required: true },
    { name: "status", label: "Estado" },
  ];

  const externalAgencyFields = [
    { name: "name", label: "Nombre", required: true },
    { name: "description", label: "Descripción", multiline: true, rows: 3 },
    { name: "contactName", label: "Nombre de Contacto" },
    { name: "contactPhone", label: "Teléfono de Contacto" },
    { name: "contactEmail", label: "Email de Contacto" },
  ];

  const propertyFields = [
    { name: "title", label: "Título", required: true },
    { name: "description", label: "Descripción", multiline: true, rows: 3 },
    { name: "price", label: "Precio", type: "number", required: true },
    { name: "location", label: "Ubicación" },
    { name: "developmentId", label: "ID del Desarrollo" },
    { name: "externalAgencyId", label: "ID de Agencia Externa" },
    { name: "type", label: "Tipo de Propiedad" },
    { name: "status", label: "Estado" },
  ];

  // Modificar el useEffect para obtener datos reales de Desarrolladoras Inmobiliarias
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Obtener datos reales solo para Desarrolladoras Inmobiliarias
        const devResponse = await axiosInstance.get("/realEstateDevelopment");
        console.log("Datos de desarrolladoras:", devResponse.data);
        setDevelopers(devResponse.data.data || []);

        // Para el resto, seguimos usando datos simulados
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Error al cargar los datos. Por favor, inténtalo de nuevo.");
        // Si falla la carga de datos reales, usamos los datos simulados
        setDevelopers(MOCK_DEVELOPERS);
        setLoading(false);
      }
    };

    fetchData();

    // No necesitamos simular tiempo de carga, ya que hay una carga real
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

  // Modificar handleDelete para obtener datos actualizados después de eliminar
  const handleDelete = async () => {
    setLoading(true);

    try {
      if (tabValue === 0) {
        // Implementación real para Desarrolladora Inmobiliaria
        await axiosInstance.delete(`/realEstateDevelopment/${itemToDelete.id}`);

        // Recargar los datos actualizados desde la API
        const response = await axiosInstance.get("/realEstateDevelopment");
        setDevelopers(response.data.data || []);
      } else {
        // Para los demás casos, mantener la simulación
        if (tabValue === 1) {
          setDevelopments(
            developments.filter((dev) => dev.id !== itemToDelete.id)
          );
        } else if (tabValue === 2) {
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

  // Modificar handleSaveForm para obtener datos actualizados después de crear/editar
  const handleSaveForm = async () => {
    setLoading(true);

    try {
      // Implementación específica para Desarrolladora Inmobiliaria
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
      } else {
        // Para los demás casos, mantener la simulación
        setTimeout(() => {
          let updatedData = [];
          const newId = Date.now();

          if (tabValue === 1) {
            // Desarrollo
            if (currentItem) {
              updatedData = developments.map((dev) =>
                dev.id === currentItem.id ? { ...dev, ...formData } : dev
              );
            } else {
              updatedData = [...developments, { ...formData, id: newId }];
            }
            setDevelopments(updatedData);
          } else if (tabValue === 2) {
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
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
        >
          <DialogTitle>Confirmar eliminación</DialogTitle>
          <DialogContent>
            <Typography>
              ¿Estás seguro de que deseas eliminar{" "}
              <strong>{itemToDelete?.name || itemToDelete?.title}</strong>? Esta
              acción no se puede deshacer.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
            <Button
              color="error"
              onClick={handleDelete}
              disabled={loading}
              sx={{
                color: "white",
                bgcolor: "error.main",
                "&:hover": { bgcolor: "error.dark" },
              }}
            >
              {loading ? <CircularProgress size={24} /> : "Eliminar"}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
}
