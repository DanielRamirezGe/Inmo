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
  Alert,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAxiosMiddleware } from "../../../../utils/axiosMiddleware";
import ImageGallery from "./ImageGallery";

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
  setLoading,
  error,
  setError,
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
  const [selectOptions, setSelectOptions] = useState({});
  const [loadingOptions, setLoadingOptions] = useState({});

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

  // Cargar opciones para campos select
  useEffect(() => {
    const fetchSelectOptions = async () => {
      const selectFields = fields.filter(
        (field) => field.type === "select" && field.endpoint
      );

      for (const field of selectFields) {
        setLoadingOptions((prev) => ({ ...prev, [field.name]: true }));
        try {
          const response = await axiosInstance.get(field.endpoint);
          setSelectOptions((prev) => ({
            ...prev,
            [field.name]: response.data.data || [],
          }));
        } catch (error) {
          console.error(`Error loading options for ${field.name}:`, error);
          setError(`Error al cargar opciones para ${field.label}`);
        } finally {
          setLoadingOptions((prev) => ({ ...prev, [field.name]: false }));
        }
      }
    };

    if (open) {
      fetchSelectOptions();
    }
  }, [open, fields]);

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

  // Renderizar campo según su tipo
  const renderField = (field) => {
    if (field.type === "select") {
      let options = [];

      // Si el campo tiene opciones estáticas, usarlas
      if (field.options) {
        options = field.options;
      } else {
        // Si no, usar las opciones del endpoint
        options = selectOptions[field.name] || [];
      }

      const value = formData[field.name] || "";
      const isValidValue = field.options
        ? options.some((option) => option.value === value)
        : options.some((option) => option[field.optionValue] === value);

      return (
        <FormControl
          fullWidth
          required={field.required}
          margin="normal"
          sx={{ minWidth: 240, width: "100%" }}
        >
          <InputLabel id={`${field.name}-select-label`}>
            {field.label}
          </InputLabel>
          <Select
            labelId={`${field.name}-select-label`}
            id={`${field.name}-select`}
            value={isValidValue ? value : ""}
            onChange={(e) =>
              setFormData({ ...formData, [field.name]: e.target.value })
            }
            label={field.label}
            required={field.required}
            disabled={!field.options && loadingOptions[field.name]}
          >
            {!field.options && loadingOptions[field.name] ? (
              <MenuItem value="" disabled>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  Cargando opciones...
                </Box>
              </MenuItem>
            ) : options.length === 0 ? (
              <MenuItem value="" disabled>
                No hay opciones disponibles
              </MenuItem>
            ) : (
              [
                <MenuItem key="empty" value="">
                  <em>Ninguno</em>
                </MenuItem>,
                ...options.map((option) => (
                  <MenuItem
                    key={
                      field.options ? option.value : option[field.optionValue]
                    }
                    value={
                      field.options ? option.value : option[field.optionValue]
                    }
                  >
                    {field.options
                      ? option.label
                      : field.optionLabel
                      ? field.optionLabel(option)
                      : option[field.optionValue]}
                  </MenuItem>
                )),
              ]
            )}
          </Select>
        </FormControl>
      );
    }

    return (
      <TextField
        key={field.name}
        fullWidth
        margin="normal"
        label={field.label}
        name={field.name}
        type={field.type || "text"}
        value={formData[field.name] || ""}
        onChange={(e) =>
          setFormData({ ...formData, [field.name]: e.target.value })
        }
        required={field.required}
        multiline={field.multiline}
        rows={field.rows}
      />
    );
  };

  // Función para abrir diálogo
  const handleOpenDialog = async (type, item = null) => {
    setLoading(true);
    setError(null);

    try {
      let updatedItem = item;

      // Si estamos editando, obtener la información actualizada
      if (item) {
        if (type === "developer") {
          const response = await axiosInstance.get(
            `/realEstateDevelopment/${item.realEstateDevelopmentId}`
          );
          updatedItem = response.data.data;
        } else if (type === "development") {
          const response = await axiosInstance.get(
            `/development/${item.developmentId}`
          );
          updatedItem = response.data.data;

          // Preparar las imágenes para el formulario
          if (updatedItem) {
            // Agregar la URL de la imagen principal
            if (updatedItem.mainImage) {
              try {
                const filename = updatedItem.mainImage.split("/").pop();
                const imageResponse = await axiosInstance.get(
                  `/image/${filename}`,
                  {
                    responseType: "blob",
                  }
                );
                const blob = new Blob([imageResponse.data], {
                  type: imageResponse.headers["content-type"],
                });
                updatedItem.mainImagePreview = URL.createObjectURL(blob);
              } catch (error) {
                console.error("Error al cargar la imagen principal:", error);
              }
            }

            // Agregar las URLs de las imágenes secundarias
            if (
              updatedItem.secondaryImages &&
              updatedItem.secondaryImages.length > 0
            ) {
              updatedItem.secondaryImagesPreview = await Promise.all(
                updatedItem.secondaryImages.map(async (img) => {
                  try {
                    const filename = img.imagePath.split("/").pop();
                    const imageResponse = await axiosInstance.get(
                      `/image/${filename}`,
                      {
                        responseType: "blob",
                      }
                    );
                    const blob = new Blob([imageResponse.data], {
                      type: imageResponse.headers["content-type"],
                    });
                    return URL.createObjectURL(blob);
                  } catch (error) {
                    console.error("Error al cargar imagen secundaria:", error);
                    return null;
                  }
                })
              );
              updatedItem.secondaryImagesPreview =
                updatedItem.secondaryImagesPreview.filter(
                  (url) => url !== null
                );
            }
          }
        } else if (type === "property") {
          const response = await axiosInstance.get(
            `/prototype/${item.prototypeId}`
          );
          updatedItem = response.data.data;

          // Preparar las imágenes para el formulario de propiedad
          if (updatedItem) {
            // Cargar la imagen principal
            if (updatedItem.mainImage) {
              try {
                const imageResponse = await axiosInstance.get(
                  `/image?path=${encodeURIComponent(updatedItem.mainImage)}`,
                  {
                    responseType: "blob",
                  }
                );
                const blob = new Blob([imageResponse.data], {
                  type: imageResponse.headers["content-type"],
                });
                updatedItem.mainImagePreview = URL.createObjectURL(blob);
              } catch (error) {
                console.error("Error al cargar la imagen principal:", error);
              }
            }

            // Cargar las imágenes secundarias
            if (
              updatedItem.secondaryImages &&
              updatedItem.secondaryImages.length > 0
            ) {
              updatedItem.secondaryImagesPreview = await Promise.all(
                updatedItem.secondaryImages.map(async (img) => {
                  try {
                    const imageResponse = await axiosInstance.get(
                      `/image?path=${encodeURIComponent(img.pathImage)}`,
                      {
                        responseType: "blob",
                      }
                    );
                    const blob = new Blob([imageResponse.data], {
                      type: imageResponse.headers["content-type"],
                    });
                    return URL.createObjectURL(blob);
                  } catch (error) {
                    console.error("Error al cargar imagen secundaria:", error);
                    return null;
                  }
                })
              );
              updatedItem.secondaryImagesPreview =
                updatedItem.secondaryImagesPreview.filter(
                  (url) => url !== null
                );
            }
          }
        }
      }

      setCurrentItem(updatedItem);

      if (type === "developer") {
        setDialogTitle(
          updatedItem
            ? "Editar Desarrolladora"
            : "Agregar Desarrolladora Inmobiliaria"
        );
        setCurrentFields(developerFields);
      } else if (type === "development") {
        setDialogTitle(
          updatedItem ? "Editar Desarrollo" : "Agregar Desarrollo"
        );
        setCurrentFields(developmentFields);
      } else if (type === "agency") {
        setDialogTitle(
          updatedItem
            ? "Editar Inmobiliaria Externa"
            : "Agregar Inmobiliaria Externa"
        );
        setCurrentFields(externalAgencyFields);
      } else if (type === "property") {
        setDialogTitle(updatedItem ? "Editar Propiedad" : "Agregar Propiedad");
        setCurrentFields(propertyFields);
      }

      setFormData(updatedItem || {});
      setDialogOpen(true);
    } catch (error) {
      console.error("Error al obtener los datos:", error);
      setError(
        "Error al cargar los datos del elemento. Por favor, inténtalo de nuevo."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Box component="form" sx={{ mt: 2 }}>
          {error && (
            <Alert
              severity="error"
              sx={{ mb: 2 }}
              onClose={() => setError(null)}
            >
              {error}
            </Alert>
          )}

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
                {fields.map((field) => (
                  <Grid xs={12} sm={6} md={4} key={field.name}>
                    {renderField(field)}
                  </Grid>
                ))}
              </Grid>

              {/* Sección de Imágenes */}
              <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
                Imágenes
              </Typography>
              <ImageGallery
                mainImage={formData.mainImagePreview}
                secondaryImages={formData.secondaryImagesPreview}
              />
              {/* Botones para cambiar imágenes */}
              <Grid container spacing={2} sx={{ mt: 2 }}>
                {/* Imagen principal */}
                <Grid xs={12} sm={6} md={4}>
                  <Button
                    variant="outlined"
                    component="label"
                    fullWidth
                    sx={{ height: 56, justifyContent: "flex-start" }}
                  >
                    Cambiar imagen principal
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
                    Agregar imágenes secundarias
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      hidden
                      onChange={(e) => {
                        const filesArray = Array.from(e.target.files);
                        console.log("Archivos seleccionados:", filesArray);

                        // Guardar los archivos directamente sin crear copias
                        setFormData({
                          ...formData,
                          secondaryImages: filesArray,
                          secondaryImagesPreview: filesArray.map((file) =>
                            URL.createObjectURL(file)
                          ),
                        });
                      }}
                    />
                  </Button>
                </Grid>
              </Grid>
            </>
          ) : title.includes("Propiedad") ? (
            <>
              <Grid container spacing={2}>
                {fields.map((field) => (
                  <Grid xs={12} sm={6} md={4} key={field.name}>
                    {renderField(field)}
                  </Grid>
                ))}
              </Grid>

              {/* Sección de Imágenes para Propiedades */}
              <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
                Imágenes
              </Typography>
              <ImageGallery
                mainImage={formData.mainImagePreview}
                secondaryImages={formData.secondaryImagesPreview || []}
              />
              {/* Botones para cambiar imágenes */}
              <Grid container spacing={2} sx={{ mt: 2 }}>
                {/* Imagen principal */}
                <Grid xs={12} sm={6} md={4}>
                  <Button
                    variant="outlined"
                    component="label"
                    fullWidth
                    sx={{ height: 56, justifyContent: "flex-start" }}
                  >
                    Cambiar imagen principal
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
                <Grid xs={12} sm={6} md={4}>
                  <Button
                    variant="outlined"
                    component="label"
                    fullWidth
                    sx={{ height: 56, justifyContent: "flex-start" }}
                  >
                    Agregar imágenes secundarias
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      hidden
                      onChange={(e) => {
                        const filesArray = Array.from(e.target.files);
                        console.log("Archivos seleccionados:", filesArray);

                        // Guardar los archivos directamente sin crear copias
                        setFormData({
                          ...formData,
                          secondaryImages: filesArray,
                          secondaryImagesPreview: filesArray.map((file) =>
                            URL.createObjectURL(file)
                          ),
                        });
                      }}
                    />
                  </Button>
                </Grid>
              </Grid>
            </>
          ) : (
            <Grid container spacing={2}>
              {fields.map((field) => (
                <Grid xs={12} sm={6} md={4} key={field.name}>
                  {renderField(field)}
                </Grid>
              ))}
            </Grid>
          )}

          {/* Sección de contactos para desarrolladoras y desarrollos */}
          {/* {(title.includes("Desarrolladora") ||
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
          )} */}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          onClick={onSubmit}
          variant="contained"
          disabled={loading}
          sx={{
            bgcolor: "#25D366",
            "&:hover": { bgcolor: "#128C7E" },
          }}
        >
          {loading ? (
            <CircularProgress size={24} sx={{ color: "white" }} />
          ) : (
            "Guardar"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FormDialog;
