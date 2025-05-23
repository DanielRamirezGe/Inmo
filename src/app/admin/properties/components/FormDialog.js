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
  FormHelperText,
  Grid,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ImageGallery from "./ImageGallery";
import { FORM_TYPES } from "../constants";
import { useEntityData } from "../../../../hooks/useEntityData";
import { useImageHandling } from "../../../../hooks/useImageHandling";
import { useFieldOptions } from "../../../../hooks/useFieldOptions";
import { api } from "../../../../services/api";
import { useAxiosMiddleware } from "../../../../utils/axiosMiddleware";

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
  // Eliminado: estado de contactos

  // Estado local para manejar la carga
  const [localLoading, setLocalLoading] = useState(false);
  const [isLoadingInitialData, setIsLoadingInitialData] = useState(false);
  const [fieldErrors, setFieldErrors] = useState([]);

  // Obtener axiosInstance
  const axiosInstance = useAxiosMiddleware();

  // Hooks personalizados
  const {
    selectOptions,
    loadingOptions,
    isLoading: loadingFieldOptions,
    error: fieldOptionsError,
    loadFieldOptions,
    setSelectOptions,
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
    loadingFieldOptions;

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

    console.log("FormDialog - Form Type:", formType);
    console.log("FormDialog - Fields received:", fields);

    // Función de utilidad para inspeccionar el objeto currentItem
    const inspectCurrentItem = (item) => {
      console.log("FormDialog - Current Item Type:", typeof item);

      if (typeof item === "string") {
        console.log("FormDialog - Current Item is a string:", item);
        return;
      }

      if (typeof item === "object" && item !== null) {
        console.log("FormDialog - Current Item Keys:", Object.keys(item));

        // Buscar posibles IDs
        const idKeys = Object.keys(item).filter(
          (key) =>
            key.toLowerCase().includes("id") ||
            (typeof item[key] === "number" && item[key] > 0)
        );

        if (idKeys.length > 0) {
          console.log(
            "FormDialog - Possible ID fields:",
            idKeys.map((k) => `${k}: ${item[k]}`)
          );
        }

        // Verificar el tipo de entidad
        if (item.prototypeId)
          console.log("FormDialog - Item appears to be a Property");
        if (item.developmentId)
          console.log("FormDialog - Item appears to be a Development");
        if (item.realEstateDevelopmentId)
          console.log("FormDialog - Item appears to be a Developer");
      }
    };

    inspectCurrentItem(currentItem);
    console.log("FormDialog - Current Item:", currentItem);

    const loadInitialData = async () => {
      try {
        setIsLoadingInitialData(true);

        // Cargar opciones de campos select solo si hay campos que lo necesiten
        const selectFields = fields?.filter(
          (field) => field.type === "select" && field.endpoint
        );
        console.log("FormDialog - Select fields with endpoints:", selectFields);

        if (selectFields?.length > 0) {
          await loadFieldOptions();
          console.log("FormDialog - Field options loaded:", selectOptions);
        }

        // Si estamos editando, cargar detalles del item
        if (currentItem) {
          // Verificar si currentItem es la cadena "property" (caso específico del botón de editar en propiedades publicadas)
          if (currentItem === "property") {
            console.error(
              "FormDialog - currentItem is 'property' string, not a valid object"
            );
            setError(
              "Error: No se proporcionó un objeto de propiedad válido para editar"
            );
            setIsLoadingInitialData(false);
            return;
          }

          // Determinar la propiedad de ID adecuada según el tipo de entidad
          let itemId;
          switch (formType) {
            case FORM_TYPES.DEVELOPER:
              itemId = currentItem.realEstateDevelopmentId || currentItem.id;
              break;
            case FORM_TYPES.DEVELOPMENT:
              itemId = currentItem.developmentId || currentItem.id;
              break;
            case FORM_TYPES.PROPERTY_NOT_PUBLISHED:
            case FORM_TYPES.PROPERTY_PUBLISHED:
              // Las propiedades pueden tener diferentes nombres de ID
              itemId =
                currentItem.prototypeId ||
                currentItem.propertyId ||
                currentItem.id ||
                (typeof currentItem === "object" &&
                  Object.keys(currentItem).find((key) =>
                    key.toLowerCase().includes("id")
                  ));
              break;
            default:
              itemId = currentItem.id;
          }

          console.log("FormDialog - Getting details for item type:", formType);
          console.log("FormDialog - Full currentItem:", currentItem);
          console.log("FormDialog - Identified ID:", itemId);

          if (!itemId) {
            console.error(
              "FormDialog - No valid ID found in currentItem:",
              currentItem
            );
            // Imprimir todas las propiedades del objeto para depuración
            if (typeof currentItem === "object") {
              console.log(
                "FormDialog - All properties of currentItem:",
                Object.keys(currentItem)
              );

              // Intentar encontrar cualquier propiedad que pueda ser un ID
              const possibleIdKeys = Object.keys(currentItem).filter(
                (key) =>
                  key.toLowerCase().includes("id") ||
                  (typeof currentItem[key] === "number" && currentItem[key] > 0)
              );

              if (possibleIdKeys.length > 0) {
                console.log(
                  "FormDialog - Possible ID properties:",
                  possibleIdKeys
                );
                itemId = currentItem[possibleIdKeys[0]];
                console.log(
                  "FormDialog - Using alternative ID:",
                  itemId,
                  "from property:",
                  possibleIdKeys[0]
                );
              }
            }

            if (!itemId) {
              setError("No se pudo identificar el ID del elemento a editar");
              setIsLoadingInitialData(false);
              return;
            }
          }

          const details = await getItemDetails(itemId);
          console.log("FormDialog - Item details loaded:", details);

          // Verificar que details no sea null antes de actualizar formData
          if (details) {
            setFormData((prev) => ({
              ...prev,
              ...details,
            }));

            // Cargar imágenes si es necesario
            if (
              formType === FORM_TYPES.PROPERTY_NOT_PUBLISHED ||
              formType === FORM_TYPES.PROPERTY_PUBLISHED
            ) {
              console.log("FormDialog - Loading property images");
              console.log(
                "FormDialog - Property details before loading images:",
                details
              );

              // Verificar formato de imágenes secundarias
              if (
                details.secondaryImages &&
                Array.isArray(details.secondaryImages)
              ) {
                console.log(
                  "FormDialog - Property secondary images format:",
                  details.secondaryImages.map((img) => {
                    if (typeof img === "string") return `String: ${img}`;
                    if (typeof img === "object") {
                      const keys = Object.keys(img).join(", ");
                      return `Object with keys: ${keys}`;
                    }
                    return `Unknown type: ${typeof img}`;
                  })
                );
              }

              const updatedDetails = await loadPropertyImages(details);
              console.log(
                "FormDialog - Property details after loading images:",
                updatedDetails
              );

              // Actualizar formData con las previsualizaciones
              setFormData((prev) => ({
                ...prev,
                ...updatedDetails,
              }));
            } else if (formType === FORM_TYPES.DEVELOPMENT) {
              console.log("FormDialog - Loading development images");
              await loadDevelopmentImages(details);

              // Asegurar que se carguen correctamente las previsualizaciones
              if (details.mainImage) {
                console.log(
                  "FormDialog - Development has main image:",
                  details.mainImage
                );
              }

              if (
                details.secondaryImages &&
                details.secondaryImages.length > 0
              ) {
                console.log(
                  "FormDialog - Development has secondary images:",
                  details.secondaryImages.length
                );
              }
            }
          } else {
            console.error(
              "FormDialog - Failed to load item details, received null"
            );
            setError("No se pudieron cargar los detalles del elemento");
          }
        }

        // Si es un desarrollo, cargar explícitamente las desarrolladoras
        if (formType === FORM_TYPES.DEVELOPMENT) {
          console.log(
            "FormDialog - Development form detected, loading developers..."
          );

          // Cargar las desarrolladoras directamente desde la API
          try {
            // Usar axiosInstance para mantener consistencia con el resto de la aplicación
            const response = await axiosInstance.get("/realEstateDevelopment");
            const developersData = response.data;

            console.log("FormDialog - Developers loaded:", developersData);

            // El formato de respuesta es {"message":"...", "data":[{"realEstateDevelopmentId":1,"realEstateDevelopmentName":"Nombre",...}]}
            if (
              developersData &&
              developersData.data &&
              Array.isArray(developersData.data)
            ) {
              // Mapear los datos al formato que espera el componente Select
              const formattedOptions = developersData.data.map((dev) => ({
                id: dev.realEstateDevelopmentId,
                name: dev.realEstateDevelopmentName,
                // Incluir datos originales también
                ...dev,
              }));

              console.log(
                "FormDialog - Formatted developer options:",
                formattedOptions
              );

              // Actualizar las opciones para el campo realEstateDevelopmentId
              setSelectOptions({
                ...selectOptions,
                realEstateDevelopmentId: formattedOptions,
              });
            } else {
              console.error(
                "Invalid developers response format:",
                developersData
              );
            }
          } catch (error) {
            console.error("Error cargando desarrolladoras:", error);
            setError("Error al cargar las desarrolladoras disponibles");
          }
        }

        // Si es una propiedad, cargar explícitamente los desarrollos
        if (
          formType === FORM_TYPES.PROPERTY_NOT_PUBLISHED ||
          formType === FORM_TYPES.PROPERTY_PUBLISHED
        ) {
          console.log(
            "FormDialog - Property form detected, loading developments..."
          );

          // Cargar los desarrollos directamente desde la API
          try {
            // Usar axiosInstance para mantener consistencia con el resto de la aplicación
            const response = await axiosInstance.get("/development/basic");
            const developmentsData = response.data;

            console.log("FormDialog - Developments loaded:", developmentsData);

            // El formato de respuesta es {"message":"...", "data":[{"developmentId":1,"developmentName":"Citara",...}]}
            if (
              developmentsData &&
              developmentsData.data &&
              Array.isArray(developmentsData.data)
            ) {
              // Mapear los datos al formato que espera el componente Select
              const formattedOptions = developmentsData.data.map((dev) => ({
                id: dev.developmentId,
                name: dev.developmentName,
                // Incluir datos originales también
                ...dev,
              }));

              console.log(
                "FormDialog - Formatted development options:",
                formattedOptions
              );

              // Actualizar las opciones para el campo developmentId
              setSelectOptions({
                ...selectOptions,
                developmentId: formattedOptions,
              });
            } else {
              console.error(
                "Invalid developments response format:",
                developmentsData
              );
            }
          } catch (error) {
            console.error("Error cargando desarrollos:", error);
            setError("Error al cargar los desarrollos disponibles");
          }
        }
      } catch (error) {
        console.error("Error al cargar datos iniciales:", error);
        setError?.("Error al cargar los datos. Por favor, inténtalo de nuevo.");
      } finally {
        setIsLoadingInitialData(false);
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

  // Actualizar fieldErrors cuando hay errores en los campos
  useEffect(() => {
    if (error) {
      // Si hay un error general, verificar si contiene información sobre campos específicos
      try {
        const errorObj = typeof error === "string" ? JSON.parse(error) : error;
        if (
          errorObj &&
          errorObj.fieldErrors &&
          Array.isArray(errorObj.fieldErrors)
        ) {
          setFieldErrors(errorObj.fieldErrors);
        }
      } catch (e) {
        // Si no se puede parsear, no es un error de campo específico
        console.log("No se pudo extraer errores de campo:", e);
      }
    } else {
      // Limpiar errores de campo cuando se resuelve el error general
      setFieldErrors([]);
    }
  }, [error]);

  // Inicializar formData si es null
  useEffect(() => {
    if (!formData) {
      setFormData({});
    }
  }, [formData, setFormData]);

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
        // Obtener opciones, ya sea de opciones estáticas o de API
        let fieldOptions = [];
        if (field.options) {
          // Si el campo tiene opciones estáticas predefinidas
          fieldOptions = field.options;
        } else if (selectOptions[field.name]) {
          // Si las opciones vienen de la API
          fieldOptions = selectOptions[field.name];
        }

        return (
          <FormControl
            fullWidth
            key={field.name}
            margin="normal"
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
            sx={{ minWidth: 240 }}
            InputProps={{
              sx: { height: 56 },
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

  // Manejar el envío del formulario
  const handleSubmit = async () => {
    try {
      if (setExternalLoading) {
        setExternalLoading(true);
      } else {
        setLocalLoading(true);
      }
      // Limpiar errores previos
      setFieldErrors([]);
      await onSubmit();
    } catch (error) {
      console.error("Error al guardar:", error);

      // Verificar si el error contiene información sobre campos específicos
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
              <Grid item xs={12} sm={6} md={4}>
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
                  sx={{ minWidth: 240 }}
                  InputProps={{ sx: { height: 56 } }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="URL"
                  name="url"
                  value={formData?.url || ""}
                  onChange={(e) => handleFieldChange("url", e.target.value)}
                  sx={{ minWidth: 240 }}
                  InputProps={{ sx: { height: 56 } }}
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
                {/* Mostramos todos los campos necesarios explícitamente */}
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Nombre del Desarrollo"
                    name="developmentName"
                    value={formData?.developmentName || ""}
                    onChange={(e) =>
                      handleFieldChange("developmentName", e.target.value)
                    }
                    required
                    sx={{ minWidth: 240 }}
                    InputProps={{ sx: { height: 56 } }}
                  />
                </Grid>

                {/* Campo select para desarrolladora */}
                <Grid item xs={12} sm={6} md={4}>
                  <FormControl
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    disabled={isLoadingInitialData || loadingFieldOptions}
                    error={Boolean(
                      fieldErrors?.find(
                        (err) => err.field === "realEstateDevelopmentId"
                      )
                    )}
                    sx={{ minWidth: 240 }}
                  >
                    <InputLabel id="developer-select-label">
                      Desarrolladora
                    </InputLabel>
                    <Select
                      labelId="developer-select-label"
                      id="realEstateDevelopmentId"
                      name="realEstateDevelopmentId"
                      value={formData?.realEstateDevelopmentId || ""}
                      onChange={(e) =>
                        handleFieldChange(
                          "realEstateDevelopmentId",
                          e.target.value
                        )
                      }
                      label="Desarrolladora"
                      sx={{ height: 56 }}
                    >
                      <MenuItem value="">
                        <em>Ninguna</em>
                      </MenuItem>
                      {console.log(
                        "Developer options rendering:",
                        selectOptions?.realEstateDevelopmentId
                      )}
                      {Array.isArray(selectOptions?.realEstateDevelopmentId) &&
                        selectOptions.realEstateDevelopmentId.map((option) => {
                          console.log("Developer option:", option);
                          return (
                            <MenuItem
                              key={option.id || option.realEstateDevelopmentId}
                              value={
                                option.id || option.realEstateDevelopmentId
                              }
                            >
                              {option.name || option.realEstateDevelopmentName}
                            </MenuItem>
                          );
                        })}
                    </Select>
                    {Boolean(
                      fieldErrors?.find(
                        (err) => err.field === "realEstateDevelopmentId"
                      )
                    ) && (
                      <FormHelperText error>
                        {
                          fieldErrors?.find(
                            (err) => err.field === "realEstateDevelopmentId"
                          )?.message
                        }
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Comisión %"
                    name="commission"
                    type="number"
                    value={formData?.commission || ""}
                    onChange={(e) =>
                      handleFieldChange("commission", e.target.value)
                    }
                    sx={{ minWidth: 240 }}
                    InputProps={{
                      sx: { height: 56 },
                      inputProps: { min: 0, max: 100, step: 1 },
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="URL"
                    name="url"
                    value={formData?.url || ""}
                    onChange={(e) => handleFieldChange("url", e.target.value)}
                    sx={{ minWidth: 240 }}
                    InputProps={{ sx: { height: 56 } }}
                  />
                </Grid>

                {/* Campo select para estado */}
                <Grid item xs={12} sm={6} md={4}>
                  {fields?.find((f) => f.name === "state") &&
                    renderField(fields.find((f) => f.name === "state"))}
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Ciudad o Municipio"
                    name="city"
                    value={formData?.city || ""}
                    onChange={(e) => handleFieldChange("city", e.target.value)}
                    sx={{ minWidth: 240 }}
                    InputProps={{ sx: { height: 56 } }}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Código Postal"
                    name="zipCode"
                    type="number"
                    value={formData?.zipCode || ""}
                    onChange={(e) =>
                      handleFieldChange("zipCode", e.target.value)
                    }
                    sx={{ minWidth: 240 }}
                    InputProps={{
                      sx: { height: 56 },
                      inputProps: { min: 0 },
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Calle"
                    name="street"
                    value={formData?.street || ""}
                    onChange={(e) =>
                      handleFieldChange("street", e.target.value)
                    }
                    sx={{ minWidth: 240 }}
                    InputProps={{ sx: { height: 56 } }}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Número Exterior"
                    name="extNum"
                    value={formData?.extNum || ""}
                    onChange={(e) =>
                      handleFieldChange("extNum", e.target.value)
                    }
                    sx={{ minWidth: 240 }}
                    InputProps={{ sx: { height: 56 } }}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Número Interior"
                    name="intNum"
                    value={formData?.intNum || ""}
                    onChange={(e) =>
                      handleFieldChange("intNum", e.target.value)
                    }
                    sx={{ minWidth: 240 }}
                    InputProps={{ sx: { height: 56 } }}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Ubicación en Mapa"
                    name="mapLocation"
                    value={formData?.mapLocation || ""}
                    onChange={(e) =>
                      handleFieldChange("mapLocation", e.target.value)
                    }
                    sx={{ minWidth: 240 }}
                    InputProps={{ sx: { height: 56 } }}
                  />
                </Grid>
              </Grid>

              {/* Sección de Imágenes */}
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
              {console.log("FormDialog - Rendering Development Images:", {
                mainImage: formData?.mainImagePreview || formData?.mainImage,
                secondaryImages:
                  formData?.secondaryImagesPreview ||
                  formData?.secondaryImages ||
                  [],
              })}
              <Grid container spacing={2} sx={{ mt: 2 }}>
                {/* Imagen principal */}
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
                {/* Imágenes secundarias */}
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

          {(formType === FORM_TYPES.PROPERTY_NOT_PUBLISHED ||
            formType === FORM_TYPES.PROPERTY_PUBLISHED) && (
            <>
              <Typography variant="h6" sx={{ mt: 2, mb: 2 }}>
                Datos de la Propiedad
              </Typography>
              <Grid container spacing={2}>
                {/* Mostramos todos los campos necesarios explícitamente */}
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Nombre del Prototipo"
                    name="prototypeName"
                    value={formData?.prototypeName || ""}
                    onChange={(e) =>
                      handleFieldChange("prototypeName", e.target.value)
                    }
                    required
                    sx={{ minWidth: 240 }}
                    InputProps={{ sx: { height: 56 } }}
                  />
                </Grid>

                {/* Campo de desarrollo */}
                <Grid item xs={12} sm={6} md={4}>
                  <FormControl
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    disabled={isLoadingInitialData || loadingFieldOptions}
                    error={Boolean(
                      fieldErrors?.find((err) => err.field === "developmentId")
                    )}
                    sx={{ minWidth: 240 }}
                  >
                    <InputLabel id="development-select-label">
                      Desarrollo
                    </InputLabel>
                    <Select
                      labelId="development-select-label"
                      id="developmentId"
                      name="developmentId"
                      value={formData?.developmentId || ""}
                      onChange={(e) =>
                        handleFieldChange("developmentId", e.target.value)
                      }
                      label="Desarrollo"
                      sx={{ height: 56 }}
                    >
                      <MenuItem value="">
                        <em>Ninguno</em>
                      </MenuItem>
                      {console.log(
                        "Development options rendering:",
                        selectOptions?.developmentId
                      )}
                      {Array.isArray(selectOptions?.developmentId) &&
                        selectOptions.developmentId.map((option) => {
                          console.log("Development option:", option);
                          return (
                            <MenuItem
                              key={option.id || option.developmentId}
                              value={option.id || option.developmentId}
                            >
                              {option.name || option.developmentName}
                            </MenuItem>
                          );
                        })}
                    </Select>
                    {Boolean(
                      fieldErrors?.find((err) => err.field === "developmentId")
                    ) && (
                      <FormHelperText error>
                        {
                          fieldErrors?.find(
                            (err) => err.field === "developmentId"
                          )?.message
                        }
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Condominio"
                    name="condominium"
                    value={formData?.condominium || ""}
                    onChange={(e) =>
                      handleFieldChange("condominium", e.target.value)
                    }
                    sx={{ minWidth: 240 }}
                    InputProps={{ sx: { height: 56 } }}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Precio"
                    name="price"
                    type="number"
                    value={formData?.price || ""}
                    onChange={(e) => handleFieldChange("price", e.target.value)}
                    required
                    sx={{ minWidth: 240 }}
                    InputProps={{
                      sx: { height: 56 },
                      inputProps: { min: 0, step: "0.01" },
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Recámaras"
                    name="bedroom"
                    type="number"
                    value={formData?.bedroom || ""}
                    onChange={(e) =>
                      handleFieldChange("bedroom", e.target.value)
                    }
                    sx={{ minWidth: 240 }}
                    InputProps={{
                      sx: { height: 56 },
                      inputProps: { min: 0, step: 1 },
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Baños"
                    name="bathroom"
                    type="number"
                    value={formData?.bathroom || ""}
                    onChange={(e) =>
                      handleFieldChange("bathroom", e.target.value)
                    }
                    sx={{ minWidth: 240 }}
                    InputProps={{
                      sx: { height: 56 },
                      inputProps: { min: 0, step: 1 },
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Medios Baños"
                    name="halfBathroom"
                    type="number"
                    value={formData?.halfBathroom || ""}
                    onChange={(e) =>
                      handleFieldChange("halfBathroom", e.target.value)
                    }
                    sx={{ minWidth: 240 }}
                    InputProps={{
                      sx: { height: 56 },
                      inputProps: { min: 0, step: 1 },
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Estacionamiento"
                    name="parking"
                    type="number"
                    value={formData?.parking || ""}
                    onChange={(e) =>
                      handleFieldChange("parking", e.target.value)
                    }
                    sx={{ minWidth: 240 }}
                    InputProps={{
                      sx: { height: 56 },
                      inputProps: { min: 0, step: 1 },
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Tamaño m2"
                    name="size"
                    type="number"
                    value={formData?.size || ""}
                    onChange={(e) => handleFieldChange("size", e.target.value)}
                    sx={{ minWidth: 240 }}
                    InputProps={{
                      sx: { height: 56 },
                      inputProps: { min: 0, step: "0.01" },
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Ubicación en Mapa"
                    name="mapLocation"
                    value={formData?.mapLocation || ""}
                    onChange={(e) =>
                      handleFieldChange("mapLocation", e.target.value)
                    }
                    sx={{ minWidth: 240 }}
                    InputProps={{ sx: { height: 56 } }}
                  />
                </Grid>
              </Grid>

              {/* Sección de Imágenes para Propiedades */}
              <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
                Imágenes
              </Typography>
              {console.log("FormDialog - Rendering Property Images:", {
                mainImage: formData?.mainImagePreview || formData?.mainImage,
                secondaryImages:
                  formData?.secondaryImagesPreview ||
                  formData?.secondaryImages ||
                  [],
                secondaryImagesFormat: (
                  formData?.secondaryImagesPreview ||
                  formData?.secondaryImages ||
                  []
                ).map((img) => typeof img),
              })}
              <ImageGallery
                mainImage={formData?.mainImagePreview || formData?.mainImage}
                secondaryImages={
                  formData?.secondaryImagesPreview ||
                  formData?.secondaryImages ||
                  []
                }
              />
              {/* Botones para cambiar imágenes */}
              <Grid container spacing={2} sx={{ mt: 2 }}>
                {/* Imagen principal */}
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
                {/* Imágenes secundarias */}
                <Grid item xs={12} sm={6} md={4}>
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
              <Grid item xs={12} sm={6} md={4} key={field.name}>
                {renderField(field)}
              </Grid>
            ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
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
