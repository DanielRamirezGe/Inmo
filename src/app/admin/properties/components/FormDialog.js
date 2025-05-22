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
import ImageGallery from "./ImageGallery";
import { FORM_TYPES } from "../constants";
import { useEntityData } from "../../../../hooks/useEntityData";
import { useImageHandling } from "../../../../hooks/useImageHandling";
import { useFieldOptions } from "../../../../hooks/useFieldOptions";

// Componente de formulario genérico
const FormDialog = ({
  open,
  onClose,
  onSubmit,
  title,
  formData = {},
  setFormData,
  fields,
  loading: externalLoading,
  setLoading: setExternalLoading,
  error,
  setError,
  formType,
  currentItem,
}) => {
  // Estados locales
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

  // Estado local para manejar la carga cuando no se proporciona setExternalLoading
  const [localLoading, setLocalLoading] = useState(false);
  const setLoadingState = setExternalLoading || setLocalLoading;

  // Hooks personalizados
  const {
    selectOptions,
    loadingOptions,
    error: fieldOptionsError,
    loadFieldOptions,
  } = useFieldOptions(fields);

  const {
    loading: loadingImages,
    error: imageError,
    loadPropertyImages,
    loadDevelopmentImages,
    createImagePreview,
    createImagesPreview,
  } = useImageHandling();

  const {
    items: availableDevelopers,
    loading: loadingDevelopers,
    error: developersError,
    fetchItems: fetchDevelopers,
    getItemDetails,
  } = useEntityData(formType);

  // Definir isLoading después de inicializar todos los hooks
  const isLoading =
    externalLoading ||
    localLoading ||
    loadingImages ||
    loadingDevelopers ||
    loadingOptions;

  // Inicializar formData según el tipo de formulario
  useEffect(() => {
    if (!open) return;

    let initialData = {};
    switch (formType) {
      case FORM_TYPES.DEVELOPER:
        initialData = {
          realEstateDevelopmentName: "",
          url: "",
        };
        break;
      case FORM_TYPES.DEVELOPMENT:
        initialData = {
          developmentName: "",
          realEstateDevelopmentId: "",
          commission: "",
          url: "",
          state: "",
          city: "",
          zipCode: "",
          street: "",
          extNum: "",
          intNum: "",
          mapLocation: "",
          mainImage: null,
          mainImagePreview: null,
          secondaryImages: [],
          secondaryImagesPreview: [],
        };
        break;
      case FORM_TYPES.PROPERTY_NOT_PUBLISHED:
      case FORM_TYPES.PROPERTY_PUBLISHED:
        initialData = {
          prototypeName: "",
          developmentId: "",
          price: "",
          description: "",
          bedrooms: "",
          bathrooms: "",
          halfBathrooms: "",
          parkingSpots: "",
          constructionSize: "",
          lotSize: "",
          mainImage: null,
          mainImagePreview: null,
          secondaryImages: [],
          secondaryImagesPreview: [],
        };
        break;
      default:
        break;
    }

    // Si no hay currentItem, usar los datos iniciales
    if (!currentItem) {
      setFormData(initialData);
    }
  }, [open, formType, currentItem]);

  // Cargar datos iniciales cuando se abre el diálogo
  useEffect(() => {
    if (!open) return;

    const loadInitialData = async () => {
      try {
        setLoadingState(true);

        // Cargar opciones de campos select solo si hay campos que lo necesiten
        const selectFields = fields?.filter(
          (field) => field.type === "select" && field.endpoint
        );
        if (selectFields?.length > 0) {
          await loadFieldOptions();
        }

        // Si estamos editando, cargar detalles del item
        if (currentItem) {
          const details = await getItemDetails(currentItem.id);
          setFormData((prev) => ({
            ...prev,
            ...details,
          }));

          // Cargar imágenes si es necesario
          if (
            formType === FORM_TYPES.PROPERTY_NOT_PUBLISHED ||
            formType === FORM_TYPES.PROPERTY_PUBLISHED
          ) {
            await loadPropertyImages(details);
          } else if (formType === FORM_TYPES.DEVELOPMENT) {
            await loadDevelopmentImages(details);
          }
        }

        // Si es un desarrollo, cargar la lista de desarrolladoras
        if (formType === FORM_TYPES.DEVELOPMENT) {
          await fetchDevelopers();
        }
      } catch (error) {
        console.error("Error al cargar datos iniciales:", error);
        setError?.("Error al cargar los datos. Por favor, inténtalo de nuevo.");
      } finally {
        setLoadingState(false);
      }
    };

    loadInitialData();
  }, [open, currentItem?.id, formType, fields]);

  // Manejar errores de los hooks
  useEffect(() => {
    const currentError = fieldOptionsError || imageError || developersError;
    if (currentError) {
      setError(currentError);
    }
  }, [fieldOptionsError, imageError, developersError]);

  // Inicializar formData si es null
  useEffect(() => {
    if (!formData) {
      setFormData({});
    }
  }, [formData, setFormData]);

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

  // Manejadores de cambios en los campos
  const handleFieldChange = (fieldName, value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const handleImageChange = (fieldName, file) => {
    if (!file) return;
    setFormData((prev) => ({
      ...prev,
      [fieldName]: file,
    }));
  };

  const handleImagesChange = (fieldName, files) => {
    if (!files || !files.length) return;
    setFormData((prev) => ({
      ...prev,
      [fieldName]: files,
    }));
  };

  const handleImageDelete = (fieldName) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: null,
    }));
  };

  const handleImageDeleteFromGallery = (fieldName, index) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: prev[fieldName].filter((_, i) => i !== index),
    }));
  };

  // Función para renderizar cada campo según su tipo
  const renderField = (field) => {
    const fieldValue = formData[field.name] || "";

    switch (field.type) {
      case "select":
        const fieldOptions = selectOptions[field.name] || [];
        return (
          <FormControl fullWidth key={field.name} margin="normal">
            <InputLabel>{field.label}</InputLabel>
            <Select
              value={fieldValue}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              label={field.label}
              disabled={loadingOptions[field.name]}
            >
              {Array.isArray(fieldOptions) &&
                fieldOptions.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        );

      case "text":
      case "email":
      case "tel":
        return (
          <TextField
            key={field.name}
            fullWidth
            label={field.label}
            type={field.type}
            value={fieldValue}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            margin="normal"
          />
        );

      case "textarea":
        return (
          <TextField
            key={field.name}
            fullWidth
            label={field.label}
            multiline
            rows={4}
            value={fieldValue}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            margin="normal"
          />
        );

      case "number":
        return (
          <TextField
            key={field.name}
            fullWidth
            label={field.label}
            type="number"
            value={fieldValue}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            margin="normal"
            InputProps={{
              inputProps: {
                min: field.min,
                max: field.max,
                step: field.step,
              },
            }}
          />
        );

      case "image":
        return (
          <Box key={field.name} sx={{ mt: 2, mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              {field.label}
            </Typography>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(field.name, e.target.files[0])}
              style={{ display: "none" }}
              id={`image-input-${field.name}`}
            />
            <label htmlFor={`image-input-${field.name}`}>
              <Button
                variant="contained"
                component="span"
                startIcon={<AddIcon />}
              >
                Seleccionar Imagen
              </Button>
            </label>
            {formData[field.name] && (
              <Box sx={{ mt: 2, position: "relative" }}>
                <img
                  src={createImagePreview(formData[field.name])}
                  alt={field.label}
                  style={{ maxWidth: "200px", maxHeight: "200px" }}
                />
                <IconButton
                  onClick={() => handleImageDelete(field.name)}
                  sx={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    bgcolor: "background.paper",
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            )}
          </Box>
        );

      case "images":
        return (
          <Box key={field.name} sx={{ mt: 2, mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              {field.label}
            </Typography>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) =>
                handleImagesChange(field.name, Array.from(e.target.files))
              }
              style={{ display: "none" }}
              id={`images-input-${field.name}`}
            />
            <label htmlFor={`images-input-${field.name}`}>
              <Button
                variant="contained"
                component="span"
                startIcon={<AddIcon />}
              >
                Seleccionar Imágenes
              </Button>
            </label>
            {formData[field.name] && Array.isArray(formData[field.name]) && (
              <ImageGallery
                images={formData[field.name].map(createImagePreview)}
                onDelete={(index) =>
                  handleImageDeleteFromGallery(field.name, index)
                }
              />
            )}
          </Box>
        );

      default:
        return null;
    }
  };

  // Actualizar el manejo de imágenes en los botones de carga
  const handleMainImageChange = (file) => {
    if (file) {
      setFormData({
        ...formData,
        mainImage: file,
        mainImagePreview: createImagePreview(file),
      });
    }
  };

  const handleSecondaryImagesChange = (files) => {
    if (files && files.length > 0) {
      const filesArray = Array.from(files);
      setFormData({
        ...formData,
        secondaryImages: filesArray,
        secondaryImagesPreview: createImagesPreview(filesArray),
      });
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
          {formType === FORM_TYPES.DEVELOPER && (
            // Formulario para desarrolladoras
            <Grid container spacing={2}>
              <Grid xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Nombre de la Desarrolladora"
                  name="realEstateDevelopmentName"
                  value={formData?.realEstateDevelopmentName || ""}
                  onChange={(e) =>
                    handleFieldChange(
                      "realEstateDevelopmentName",
                      e.target.value
                    )
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
                  value={formData?.url || ""}
                  onChange={(e) => handleFieldChange("url", e.target.value)}
                />
              </Grid>
            </Grid>
          )}

          {formType === FORM_TYPES.DEVELOPMENT && (
            // Formulario para desarrollos
            <>
              <Typography variant="h6" sx={{ mt: 2, mb: 2 }}>
                Datos del Desarrollo
              </Typography>
              <Grid container spacing={2}>
                {fields?.map((field) => (
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
                mainImage={formData?.mainImagePreview}
                secondaryImages={formData?.secondaryImagesPreview}
              />
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
                      onChange={(e) => handleMainImageChange(e.target.files[0])}
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
                      onChange={(e) =>
                        handleSecondaryImagesChange(e.target.files)
                      }
                    />
                  </Button>
                </Grid>
              </Grid>
            </>
          )}

          {(formType === FORM_TYPES.PROPERTY_NOT_PUBLISHED ||
            formType === FORM_TYPES.PROPERTY_PUBLISHED) && (
            <>
              <Grid container spacing={2}>
                {fields?.map((field) => (
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
                mainImage={formData?.mainImagePreview}
                secondaryImages={formData?.secondaryImagesPreview || []}
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
                      onChange={(e) => handleMainImageChange(e.target.files[0])}
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
                      onChange={(e) =>
                        handleSecondaryImagesChange(e.target.files)
                      }
                    />
                  </Button>
                </Grid>
              </Grid>
            </>
          )}

          {!formType &&
            fields?.map((field) => (
              <Grid xs={12} sm={6} md={4} key={field.name}>
                {renderField(field)}
              </Grid>
            ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          onClick={onSubmit}
          variant="contained"
          disabled={isLoading}
          sx={{
            bgcolor: "#25D366",
            "&:hover": { bgcolor: "#128C7E" },
          }}
        >
          {isLoading ? (
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
