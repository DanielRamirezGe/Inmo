import React, { useState, useEffect, useMemo } from "react";
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
  FormHelperText,
  Grid,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ImageGallery from "./ImageGallery";
import { FORM_TYPES } from "../constants";
import { useEntityData } from "../../../../hooks/useEntityData";
import { useImageHandling } from "../../../../hooks/useImageHandling";
import { api } from "../../../../services/api";
import {
  getInitialDataForFormType,
  getFieldsForFormType,
  getFieldSectionsForFormType,
} from "./fieldsConfig";

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
  const [localLoading, setLocalLoading] = useState(false);
  const [isLoadingInitialData, setIsLoadingInitialData] = useState(false);
  const [fieldErrors, setFieldErrors] = useState([]);
  const [selectOptions, setSelectOptions] = useState({});
  const [loadingOptions, setLoadingOptions] = useState({});

  // Memoizar el ID del item actual para evitar bucles infinitos
  const currentItemId = useMemo(() => {
    if (!currentItem) return null;

    switch (formType) {
      case FORM_TYPES.DEVELOPER:
        return currentItem.realEstateDevelopmentId || currentItem.id;
      case FORM_TYPES.DEVELOPMENT:
        return currentItem.developmentId || currentItem.id;
      case FORM_TYPES.PROPERTY_NOT_PUBLISHED:
      case FORM_TYPES.PROPERTY_PUBLISHED:
      case FORM_TYPES.PROPERTY_MINKAASA_UNPUBLISHED:
      case FORM_TYPES.PROPERTY_MINKAASA_PUBLISHED:
        return (
          currentItem.prototypeId || currentItem.propertyId || currentItem.id
        );
      default:
        return currentItem.id;
    }
  }, [currentItem, formType]);

  // Hooks personalizados
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
    Object.values(loadingOptions).some((loading) => loading === true);

  // Obtener secciones de campos directamente desde la configuración - memoizada
  const fieldSections = useMemo(() => {
    return getFieldSectionsForFormType(formType);
  }, [formType]);

  // Función para cargar opciones de un campo específico
  const loadOptionsForField = async (field) => {
    if (!field.endpoint || field.type !== "select") return;

    try {
      setLoadingOptions((prev) => ({ ...prev, [field.name]: true }));

      let options = [];

      // Manejar endpoints específicos
      if (field.endpoint === "/nameType") {
        options = await api.getNameTypeProperty();
      } else if (field.endpoint === "/development/basic") {
        const response = await api.getDevelopmentsBasic();
        options = response?.data || [];
      } else if (field.endpoint === "/realEstateDevelopment") {
        const response = await api.getDevelopers(1, 1000);
        options = response?.data || [];
      } else {
        // Para otros endpoints, usar el método genérico
        options = await api.getFieldOptions(field.endpoint);
      }

      setSelectOptions((prev) => ({ ...prev, [field.name]: options }));
    } catch (error) {
      console.error(`Error al cargar opciones para ${field.name}:`, error);
      setError(`Error al cargar opciones para ${field.label}`);
    } finally {
      setLoadingOptions((prev) => ({ ...prev, [field.name]: false }));
    }
  };

  // Inicializar formData según el tipo de formulario
  useEffect(() => {
    if (!open) return;

    // Usar la función helper para obtener los datos iniciales
    const initialData = getInitialDataForFormType(formType);

    // Si no hay currentItem, usar los datos iniciales
    if (!currentItem) {
      setFormData(initialData);
    }
  }, [open, formType, currentItem, setFormData]);

  // Cargar opciones de campos cuando se abre el diálogo
  useEffect(() => {
    if (!open) return;

    const loadFieldOptions = async () => {
      // Obtener todos los campos de todas las secciones
      const sections = getFieldSectionsForFormType(formType);
      const allFields = sections.flatMap((section) => section.fields);
      const selectFields = allFields.filter(
        (field) => field.type === "select" && field.endpoint
      );

      if (selectFields.length > 0) {
        await Promise.all(
          selectFields.map((field) => loadOptionsForField(field))
        );
      }
    };

    loadFieldOptions();
  }, [open, formType]); // Solo depende de open y formType

  // Cargar datos iniciales cuando se abre el diálogo
  useEffect(() => {
    if (!open || !currentItemId) return;

    const loadInitialData = async () => {
      try {
        setIsLoadingInitialData(true);

        const details = await getItemDetails(currentItemId);

        if (details) {
          // Mapear nameTypeId a propertyTypeId para propiedades
          if (
            formType === FORM_TYPES.PROPERTY_NOT_PUBLISHED ||
            formType === FORM_TYPES.PROPERTY_PUBLISHED ||
            formType === FORM_TYPES.PROPERTY_MINKAASA_UNPUBLISHED ||
            formType === FORM_TYPES.PROPERTY_MINKAASA_PUBLISHED
          ) {
            if (details.nameTypeId) {
              details.propertyTypeId = details.nameTypeId;
            }
          }

          // Si es una propiedad Minkaasa, extraer los datos del externalAgreement
          if (
            (formType === FORM_TYPES.PROPERTY_MINKAASA_UNPUBLISHED ||
              formType === FORM_TYPES.PROPERTY_MINKAASA_PUBLISHED) &&
            details.externalAgreement
          ) {
            const externalAgreementData = details.externalAgreement;
            const descriptionsData = details.descriptions || [];

            const flattenedData = {
              ...details,
              name: externalAgreementData.name || "",
              lastNameP: externalAgreementData.lastNameP || "",
              lastNameM: externalAgreementData.lastNameM || "",
              mainEmail: externalAgreementData.mainEmail || "",
              mainPhone: externalAgreementData.mainPhone || "",
              agent: externalAgreementData.agent || "",
              commission: externalAgreementData.commission || 0,
              descriptions: descriptionsData,
            };

            setFormData((prev) => ({
              ...prev,
              ...flattenedData,
            }));
          } else {
            const propertyDescriptionsData = details.descriptions || [];

            setFormData((prev) => ({
              ...prev,
              ...details,
              descriptions: propertyDescriptionsData,
            }));
          }

          // Cargar imágenes si es necesario
          if (
            formType === FORM_TYPES.PROPERTY_NOT_PUBLISHED ||
            formType === FORM_TYPES.PROPERTY_PUBLISHED ||
            formType === FORM_TYPES.PROPERTY_MINKAASA_UNPUBLISHED ||
            formType === FORM_TYPES.PROPERTY_MINKAASA_PUBLISHED
          ) {
            const updatedDetails = await loadPropertyImages(details);
            setFormData((prev) => ({
              ...prev,
              ...updatedDetails,
            }));
          } else if (formType === FORM_TYPES.DEVELOPMENT) {
            await loadDevelopmentImages(details);
          }
        } else {
          setError("No se pudieron cargar los detalles del elemento");
        }
      } catch (error) {
        console.error("Error al cargar datos iniciales:", error);
        setError?.("Error al cargar los datos. Por favor, inténtalo de nuevo.");
      } finally {
        setIsLoadingInitialData(false);
      }
    };

    loadInitialData();
  }, [open, currentItemId, formType]); // Solo dependencias estables

  // Manejar errores de los hooks
  useEffect(() => {
    const currentError = imageError || developersError;
    if (currentError) {
      setError(currentError);
    }
  }, [imageError, developersError, setError]);

  // Actualizar fieldErrors cuando hay errores en los campos
  useEffect(() => {
    if (error) {
      try {
        if (typeof error === "string" && error.trim().startsWith("{")) {
          const errorObj = JSON.parse(error);
          if (
            errorObj &&
            errorObj.fieldErrors &&
            Array.isArray(errorObj.fieldErrors)
          ) {
            setFieldErrors(errorObj.fieldErrors);
          }
        } else if (typeof error === "object" && error.fieldErrors) {
          setFieldErrors(error.fieldErrors);
        }
      } catch (e) {
        if (process.env.NODE_ENV === "development") {
          console.log(
            "Error no es JSON válido, ignorando parsing de campos:",
            error
          );
        }
      }
    } else {
      setFieldErrors([]);
    }
  }, [error]);

  // Inicializar formData si es null
  useEffect(() => {
    if (!formData) {
      setFormData({});
    }

    if (formData && !formData.descriptions) {
      setFormData((prev) => ({
        ...prev,
        descriptions: [],
      }));
    }
  }, [formData, setFormData]);

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
    const hasError = Boolean(
      fieldErrors?.find((err) => err.field === field.name)
    );
    const errorMessage = fieldErrors?.find(
      (err) => err.field === field.name
    )?.message;

    switch (field.type) {
      case "select":
        let fieldOptions = [];
        if (field.options) {
          fieldOptions = field.options;
        } else if (selectOptions[field.name]) {
          fieldOptions = selectOptions[field.name];
        }

        return (
          <FormControl
            fullWidth
            key={field.name}
            margin="normal"
            variant="outlined"
            disabled={isLoadingInitialData}
            error={hasError}
            sx={{ minWidth: 240 }}
          >
            <InputLabel>{field.label}</InputLabel>
            <Select
              value={fieldValue}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              label={field.label}
              disabled={loadingOptions[field.name]}
              sx={{ height: 56 }}
            >
              <MenuItem value="">
                <em>Seleccionar</em>
              </MenuItem>
              {Array.isArray(fieldOptions) &&
                fieldOptions.map((option) => (
                  <MenuItem
                    key={
                      option.id ||
                      option.value ||
                      option[field.optionValue] ||
                      option
                    }
                    value={
                      option.id ||
                      option.value ||
                      option[field.optionValue] ||
                      option
                    }
                  >
                    {option.name ||
                      option.label ||
                      (field.optionLabel ? field.optionLabel(option) : option)}
                  </MenuItem>
                ))}
            </Select>
            {hasError && <FormHelperText error>{errorMessage}</FormHelperText>}
          </FormControl>
        );

      case "email":
      case "tel":
      case "text":
        return (
          <TextField
            key={field.name}
            fullWidth
            label={field.label}
            type={field.type || "text"}
            value={fieldValue}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            margin="normal"
            required={field.required}
            error={hasError}
            helperText={hasError ? errorMessage : ""}
            sx={{ minWidth: 240 }}
            InputProps={{ sx: { height: 56 } }}
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
            required={field.required}
            error={hasError}
            helperText={hasError ? errorMessage : ""}
            sx={{ minWidth: 240 }}
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
            required={field.required}
            error={hasError}
            helperText={hasError ? errorMessage : ""}
            sx={{ minWidth: 240 }}
            InputProps={{
              sx: { height: 56 },
              inputProps: field.inputProps || {},
            }}
          />
        );

      default:
        // Para campos sin tipo específico, usar text por defecto
        return (
          <TextField
            key={field.name}
            fullWidth
            label={field.label}
            value={fieldValue}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            margin="normal"
            required={field.required}
            error={hasError}
            helperText={hasError ? errorMessage : ""}
            sx={{ minWidth: 240 }}
            InputProps={{ sx: { height: 56 } }}
          />
        );
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

  // Manejar el envío del formulario
  const handleSubmit = async () => {
    try {
      if (setExternalLoading) {
        setExternalLoading(true);
      } else {
        setLocalLoading(true);
      }
      setFieldErrors([]);

      await onSubmit();
    } catch (error) {
      console.error("Error al guardar:", error);

      if (error.response && error.response.data) {
        const errorData = error.response.data;
        if (errorData.fieldErrors && Array.isArray(errorData.fieldErrors)) {
          setFieldErrors(errorData.fieldErrors);
        }
      }

      setError?.("Error al guardar los datos. Por favor, inténtalo de nuevo.");
    } finally {
      if (setExternalLoading) {
        setExternalLoading(false);
      } else {
        setLocalLoading(false);
      }
    }
  };

  // Limpiar estados cuando se cierra el diálogo
  useEffect(() => {
    if (!open) {
      setLocalLoading(false);
      setFieldErrors([]);
      setSelectOptions({});
      setLoadingOptions({});
      if (setExternalLoading) {
        setExternalLoading(false);
      }
    }
  }, [open, setExternalLoading]);

  return (
    <Dialog
      open={open}
      onClose={() => {
        setLocalLoading(false);
        setFieldErrors([]);
        if (setExternalLoading) {
          setExternalLoading(false);
        }
        onClose();
      }}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Box component="div" sx={{ mt: 2 }}>
          {error && (
            <Alert
              severity="error"
              sx={{ mb: 2 }}
              onClose={() => setError(null)}
            >
              {error}
            </Alert>
          )}

          {/* Renderizar secciones de campos */}
          {fieldSections.map((section, sectionIndex) => (
            <Box key={sectionIndex}>
              <Typography variant="h6" sx={{ mt: 2, mb: 2 }}>
                {section.title}
              </Typography>
              <Grid container spacing={2}>
                {section.fields.map((field) => (
                  <Grid item xs={12} sm={6} md={4} key={field.name}>
                    {renderField(field)}
                  </Grid>
                ))}
              </Grid>
            </Box>
          ))}

          {/* Sección de Descripción para propiedades */}
          {(formType === FORM_TYPES.PROPERTY_NOT_PUBLISHED ||
            formType === FORM_TYPES.PROPERTY_PUBLISHED ||
            formType === FORM_TYPES.PROPERTY_MINKAASA_UNPUBLISHED ||
            formType === FORM_TYPES.PROPERTY_MINKAASA_PUBLISHED) && (
            <>
              <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
                Descripciones de la Propiedad
              </Typography>

              {/* Mostrar el listado de descripciones existentes */}
              {formData.descriptions &&
              Array.isArray(formData.descriptions) &&
              formData.descriptions.length > 0 ? (
                <Box sx={{ mb: 3 }}>
                  {formData.descriptions.map((desc, index) => (
                    <Box
                      key={desc.descriptionId || index}
                      sx={{
                        border: "1px solid #e0e0e0",
                        borderRadius: 1,
                        p: 2,
                        mb: 2,
                        position: "relative",
                      }}
                    >
                      <Typography variant="subtitle1" fontWeight="bold">
                        {desc.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          mt: 1,
                          whiteSpace: "pre-wrap",
                          overflowWrap: "break-word",
                        }}
                      >
                        {desc.description}
                      </Typography>
                      <IconButton
                        onClick={() => {
                          const newDescriptions = [...formData.descriptions];
                          newDescriptions.splice(index, 1);
                          setFormData({
                            ...formData,
                            descriptions: newDescriptions,
                          });
                        }}
                        sx={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          color: "error.main",
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  No hay descripciones. Agregue al menos una descripción para la
                  propiedad.
                </Typography>
              )}

              {/* Formulario para agregar una nueva descripción */}
              <Box
                component="div"
                sx={{
                  border: "1px dashed #ccc",
                  borderRadius: 1,
                  p: 2,
                  mb: 3,
                }}
              >
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Agregar nueva descripción
                </Typography>

                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mb: 2, display: "block" }}
                >
                  El formato del texto (espacios, saltos de línea, tabulaciones)
                  se preservará exactamente como lo ingreses.
                </Typography>

                <TextField
                  fullWidth
                  margin="normal"
                  label="Título"
                  id="description-title-field"
                  sx={{ mb: 2 }}
                  InputProps={{ sx: { height: 56 } }}
                />

                <TextField
                  fullWidth
                  margin="normal"
                  label="Descripción"
                  id="description-text-field"
                  multiline
                  rows={5}
                  sx={{ mb: 2 }}
                  placeholder="Escribe aquí la descripción completa. Puedes usar saltos de línea y espacios para formatear el texto como desees. Este formato se preservará exactamente como lo escribas."
                  InputProps={{
                    sx: {
                      fontFamily: "monospace",
                    },
                  }}
                />

                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={() => {
                    const titleField = document.getElementById(
                      "description-title-field"
                    );
                    const descriptionField = document.getElementById(
                      "description-text-field"
                    );

                    if (
                      titleField &&
                      descriptionField &&
                      titleField.value &&
                      descriptionField.value
                    ) {
                      const title = titleField.value;
                      const description = descriptionField.value;

                      const newDescriptions = [
                        ...(formData.descriptions || []),
                      ];

                      newDescriptions.push({ title, description });

                      setFormData({
                        ...formData,
                        descriptions: newDescriptions,
                      });

                      titleField.value = "";
                      descriptionField.value = "";
                    } else {
                      alert(
                        "Por favor, complete tanto el título como la descripción."
                      );
                    }
                  }}
                >
                  Agregar descripción
                </Button>
              </Box>
            </>
          )}

          {/* Sección de Imágenes para desarrollos y propiedades */}
          {(formType === FORM_TYPES.DEVELOPMENT ||
            formType === FORM_TYPES.PROPERTY_NOT_PUBLISHED ||
            formType === FORM_TYPES.PROPERTY_PUBLISHED ||
            formType === FORM_TYPES.PROPERTY_MINKAASA_UNPUBLISHED ||
            formType === FORM_TYPES.PROPERTY_MINKAASA_PUBLISHED) && (
            <>
              <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
                Imágenes
              </Typography>
              <ImageGallery
                mainImage={formData?.mainImagePreview || formData?.mainImage}
                secondaryImages={
                  formData?.secondaryImagesPreview ||
                  formData?.secondaryImages ||
                  []
                }
              />
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={12} sm={6} md={4}>
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
                <Grid item xs={12} sm={6} md={8}>
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
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
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
