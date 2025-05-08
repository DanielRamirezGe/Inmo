import React, { useState, useEffect } from "react";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  IconButton,
  CircularProgress,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAxiosMiddleware } from "../../../../utils/axiosMiddleware";

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

  // Estado para almacenar las desarrolladoras disponibles
  const [availableDevelopers, setAvailableDevelopers] = useState([]);
  const [loadingDevelopers, setLoadingDevelopers] = useState(false);
  const axiosInstance = useAxiosMiddleware();

  // Cargar desarrolladoras al abrir el formulario de desarrollo
  useEffect(() => {
    if (open && title.includes("Desarrollo")) {
      const fetchDevelopers = async () => {
        setLoadingDevelopers(true);
        try {
          const response = await axiosInstance.get("/realEstateDevelopment");
          setAvailableDevelopers(response.data.data || []);
        } catch (error) {
          console.error("Error al cargar desarrolladoras:", error);
        } finally {
          setLoadingDevelopers(false);
        }
      };
      fetchDevelopers();
    }
  }, [open, title]);

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

  // Manejar el cambio de la desarrolladora seleccionada
  const handleDeveloperChange = (event) => {
    const selectedDeveloperId = event.target.value;
    setFormData({
      ...formData,
      realEstateDevelopmentId: selectedDeveloperId,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Box component="form" sx={{ mt: 2 }}>
          {/* Renderizar campos según el tipo de formulario */}
          {title.includes("Desarrolladora") ? (
            // Formulario para desarrolladoras
            <Grid container spacing={2}>
              <Grid xs={12} sm={6} md={4}>
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
              </Grid>
              <Grid xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="URL"
                  name="url"
                  value={formData.url || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, url: e.target.value })
                  }
                />
              </Grid>
            </Grid>
          ) : title.includes("Desarrollo") ? (
            // Formulario para desarrollos
            <>
              {/* Sección de Datos del Desarrollo */}
              <Typography variant="h6" sx={{ mt: 2, mb: 2 }}>
                Datos del Desarrollo
              </Typography>
              <Grid container spacing={2}>
                <Grid xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Nombre del Desarrollo"
                    name="developmentName"
                    value={formData.developmentName || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        developmentName: e.target.value,
                      })
                    }
                    required
                  />
                </Grid>
                <Grid xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="URL"
                    name="url"
                    value={formData.url || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, url: e.target.value })
                    }
                  />
                </Grid>
                <Grid xs={12} sm={6} md={4}>
                  <FormControl
                    fullWidth
                    required
                    margin="normal"
                    sx={{ minWidth: 240, width: "100%" }}
                  >
                    <InputLabel id="developer-select-label">
                      Desarrolladora
                    </InputLabel>
                    <Select
                      labelId="developer-select-label"
                      id="developer-select"
                      value={formData.realEstateDevelopmentId || ""}
                      label="Desarrolladora"
                      onChange={handleDeveloperChange}
                      disabled={loadingDevelopers}
                    >
                      {loadingDevelopers ? (
                        <MenuItem value="" disabled>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <CircularProgress size={20} sx={{ mr: 1 }} />
                            Cargando desarrolladoras...
                          </Box>
                        </MenuItem>
                      ) : availableDevelopers.length === 0 ? (
                        <MenuItem value="" disabled>
                          No hay desarrolladoras disponibles
                        </MenuItem>
                      ) : (
                        availableDevelopers.map((developer) => (
                          <MenuItem
                            key={developer.realEstateDevelopmentId}
                            value={developer.realEstateDevelopmentId}
                          >
                            {developer.realEstateDevelopmentName}
                          </MenuItem>
                        ))
                      )}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              {/* Sección de Imágenes */}
              <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
                Imágenes
              </Typography>
              <Grid container spacing={2}>
                {/* Imagen principal */}
                <Grid xs={12} sm={6} md={4}>
                  <Button
                    variant="outlined"
                    component="label"
                    fullWidth
                    sx={{ height: 56, justifyContent: "flex-start" }}
                  >
                    {formData.mainImagePreview ? (
                      <img
                        src={formData.mainImagePreview}
                        alt="Imagen principal"
                        style={{
                          maxHeight: 40,
                          maxWidth: "100%",
                          marginRight: 8,
                        }}
                      />
                    ) : (
                      "Imagen principal"
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setFormData({
                            ...formData,
                            mainImage: file,
                            mainImagePreview: URL.createObjectURL(file),
                          });
                        }
                      }}
                    />
                  </Button>
                </Grid>
                {/* Imágenes secundarias */}
                <Grid xs={12} sm={6} md={8}>
                  <Button
                    variant="outlined"
                    component="label"
                    fullWidth
                    sx={{ height: 56, justifyContent: "flex-start" }}
                  >
                    Imágenes secundarias
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      hidden
                      onChange={(e) => {
                        const files = Array.from(e.target.files);
                        setFormData({
                          ...formData,
                          secondaryImages: files,
                          secondaryImagesPreview: files.map((file) =>
                            URL.createObjectURL(file)
                          ),
                        });
                      }}
                    />
                  </Button>
                  {/* Previsualización de imágenes secundarias */}
                  <Box
                    sx={{ display: "flex", gap: 1, mt: 1, flexWrap: "wrap" }}
                  >
                    {formData.secondaryImagesPreview &&
                      formData.secondaryImagesPreview.map((src, idx) => (
                        <img
                          key={idx}
                          src={src}
                          alt={`Secundaria ${idx + 1}`}
                          style={{
                            maxHeight: 40,
                            maxWidth: 60,
                            borderRadius: 4,
                            border: "1px solid #eee",
                          }}
                        />
                      ))}
                  </Box>
                </Grid>
              </Grid>

              {/* Sección de Ubicación */}
              <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
                Ubicación
              </Typography>
              <Grid container spacing={2}>
                <Grid xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Estado"
                    name="state"
                    value={formData.state || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, state: e.target.value })
                    }
                  />
                </Grid>
                <Grid xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Ciudad"
                    name="city"
                    value={formData.city || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                  />
                </Grid>
                <Grid xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Código Postal"
                    name="zipCode"
                    value={formData.zipCode || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, zipCode: e.target.value })
                    }
                  />
                </Grid>
                <Grid xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Calle"
                    name="street"
                    value={formData.street || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, street: e.target.value })
                    }
                  />
                </Grid>
                <Grid xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Número Exterior"
                    name="extNum"
                    value={formData.extNum || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, extNum: e.target.value })
                    }
                  />
                </Grid>
                <Grid xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Número Interior"
                    name="intNum"
                    value={formData.intNum || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, intNum: e.target.value })
                    }
                  />
                </Grid>
                <Grid xs={12}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Ubicación en Mapa"
                    name="mapLocation"
                    value={formData.mapLocation || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, mapLocation: e.target.value })
                    }
                  />
                </Grid>
              </Grid>
            </>
          ) : (
            // Para otros tipos, usar campos genéricos
            <Grid container spacing={2}>
              {fields.map((field) => (
                <Grid xs={12} sm={6} md={4} key={field.name}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label={field.label}
                    name={field.name}
                    multiline={field.multiline}
                    rows={field.rows}
                    type={field.type || "text"}
                    value={formData[field.name] || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, [field.name]: e.target.value })
                    }
                    required={field.required}
                  />
                </Grid>
              ))}
            </Grid>
          )}

          {/* Sección de contactos para desarrolladoras y desarrollos */}
          {(title.includes("Desarrolladora") ||
            title.includes("Desarrollo")) && (
            <>
              <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
                Contactos
              </Typography>
              {contacts.map((contact, index) => (
                <Box
                  key={index}
                  sx={{
                    mb: 3,
                    p: 2,
                    border: "1px solid #e0e0e0",
                    borderRadius: 1,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 2,
                    }}
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
                          handleContactChange(
                            index,
                            "lastNameP",
                            e.target.value
                          )
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
                          handleContactChange(
                            index,
                            "lastNameM",
                            e.target.value
                          )
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
                          handleContactChange(
                            index,
                            "mainEmail",
                            e.target.value
                          )
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
                          handleContactChange(
                            index,
                            "mainPhone",
                            e.target.value
                          )
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
            </>
          )}
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

export default FormDialog;
