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
import CloseIcon from "@mui/icons-material/Close";
import ImageGallery from "./ImageGallery";
import { FORM_TYPES } from "../constants";
import { useEntityData } from "../../../../hooks/useEntityData";
import { useImageHandling } from "../../../../hooks/useImageHandling";
import { api } from "../../../../services/api";
import {
  getInitialDataForFormType,
  getFieldsForFormType,
  getFieldSectionsForFormType,
  getBasicPropertySections,
} from "./fieldsConfig";
import { useMultiStepProperty } from "../../../../hooks/useMultiStepProperty";
import { useMultiStepPropertyEdit } from "../../../../hooks/useMultiStepPropertyEdit";
import PropertyCreationStepper from "./PropertyCreationStepper";
import Step2Descriptions from "./Step2Descriptions";
import Step3Images from "./Step3Images";
import ConfirmCloseDialog from "./ConfirmCloseDialog";
import PropertyEditTabs from "./PropertyEditTabs";

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
  onRefreshData,
}) => {
  // Estados locales
  const [localLoading, setLocalLoading] = useState(false);
  const [isLoadingInitialData, setIsLoadingInitialData] = useState(false);
  const [fieldErrors, setFieldErrors] = useState([]);
  const [selectOptions, setSelectOptions] = useState({});
  const [loadingOptions, setLoadingOptions] = useState({});
  const [showConfirmClose, setShowConfirmClose] = useState(false);

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

  const {
    currentStep,
    prototypeId,
    loading: multiStepLoading,
    error: multiStepError,
    setError: setMultiStepError,
    createBasicProperty,
    addDescriptions,
    addImages,
    nextStep,
    previousStep,
    clearCreationData,
    initializeNewCreation,
    isInCreationProcess,
    getSavedFormType,
  } = useMultiStepProperty();

  // Hook para edición multi-paso (solo cuando estamos editando una propiedad)
  const {
    loading: editLoading,
    error: editError,
    setError: setEditError,
    updateBasicProperty,
    updateDescriptions,
    updateImages,
  } = useMultiStepPropertyEdit(currentItem ? currentItemId : null, formType);

  // Definir isLoading después de inicializar todos los hooks
  const isLoading =
    externalLoading ||
    localLoading ||
    loadingImages ||
    loadingDevelopers ||
    multiStepLoading ||
    editLoading ||
    Object.values(loadingOptions).some((loading) => loading === true);

  // Obtener secciones de campos directamente desde la configuración - memoizada
  const fieldSections = useMemo(() => {
    const isPropertyType =
      formType === FORM_TYPES.PROPERTY_NOT_PUBLISHED ||
      formType === FORM_TYPES.PROPERTY_PUBLISHED ||
      formType === FORM_TYPES.PROPERTY_MINKAASA_UNPUBLISHED ||
      formType === FORM_TYPES.PROPERTY_MINKAASA_PUBLISHED;

    // Si NO es un tipo de propiedad, usar la lógica original
    if (!isPropertyType) {
      return getFieldSectionsForFormType(formType);
    }

    // Para edición de propiedades: no mostrar campos individuales (se usan tabs)
    if (currentItem) {
      return [];
    }

    // Para creación de propiedades: mostrar campos según el paso de creación
    if (currentStep === 1) {
      return getBasicPropertySections(formType);
    } else {
      // Pasos 2 y 3: sin campos (se manejan por separado)
      return [];
    }
  }, [formType, currentItem, currentStep]);

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

  // Inicializar nueva creación de propiedad cuando se abre el formulario
  useEffect(() => {
    if (!open || currentItem) return;

    // Solo para tipos de propiedad
    const isPropertyType =
      formType === FORM_TYPES.PROPERTY_NOT_PUBLISHED ||
      formType === FORM_TYPES.PROPERTY_PUBLISHED ||
      formType === FORM_TYPES.PROPERTY_MINKAASA_UNPUBLISHED ||
      formType === FORM_TYPES.PROPERTY_MINKAASA_PUBLISHED;

    if (isPropertyType) {
      // Inicializar nueva creación (resetear al paso 1)
      initializeNewCreation();
    }
  }, [open, currentItem, formType, initializeNewCreation]);

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
        // Error no es JSON válido, ignorando parsing de campos
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

  // Helper para crear objeto JSON del primer paso (básico) - MÁS EFICIENTE
  const createBasicPropertyData = (formData, isMinkaasa = false) => {
    const basicData = {};

    // Campos básicos de propiedad (todos los campos esenciales)
    const basicFields = [
      "prototypeName",
      "price",
      "bedroom",
      "bathroom",
      "halfBathroom",
      "parking",
      "size",
      "url",
      "mapLocation",
    ];

    basicFields.forEach((field) => {
      const value = formData[field];
      if (value !== null && value !== undefined && value !== "") {
        // Convertir números correctamente
        if (
          [
            "price",
            "bedroom",
            "bathroom",
            "halfBathroom",
            "parking",
            "size",
          ].includes(field)
        ) {
          basicData[field] = value === "" ? null : Number(value);
        } else {
          basicData[field] = value;
        }
      }
    });

    // Mapear propertyTypeId a nameTypeId para la API
    if (formData.propertyTypeId) {
      basicData.nameTypeId = Number(formData.propertyTypeId);
    }

    // Para propiedades normales, agregar developmentId
    if (!isMinkaasa && formData.developmentId) {
      basicData.developmentId = Number(formData.developmentId);
    }

    // Para propiedades Minkaasa, agregar externalAgreement
    if (isMinkaasa) {
      const externalAgreement = {
        name: formData.name || "",
        lastNameP: formData.lastNameP || "",
        lastNameM: formData.lastNameM || "",
        mainEmail: formData.mainEmail || "",
        mainPhone: formData.mainPhone || "",
        agent: formData.agent || "",
        commission: formData.commission ? Number(formData.commission) : 0,
      };
      basicData.externalAgreement = externalAgreement;
    }

    return basicData;
  };

  // Manejador para el paso 2: Descripciones
  const handleStep2Submit = async (descriptions) => {
    const result = await addDescriptions(descriptions);
    if (result.success) {
      // El hook automáticamente avanza al paso 3
    }
  };

  // Manejador para el paso 3: Imágenes
  const handleStep3Submit = async (mainImage, secondaryImages) => {
    const result = await addImages(mainImage, secondaryImages);
    if (result.success && result.completed) {
      // Cerrar diálogo y refrescar lista
      onClose();
      // Refrescar la lista de propiedades si hay una función disponible
      if (typeof onSubmit === "function") {
        try {
          await onSubmit(); // Esto debería refrescar la lista
        } catch (error) {
          // Error al refrescar lista, pero el proceso fue exitoso
        }
      }
    }
  };

  // Manejar intento de cerrar el formulario
  const handleCloseAttempt = () => {
    // Si estamos editando (currentItem existe), permitir cerrar directamente
    if (currentItem) {
      handleForceClose();
      return;
    }

    // Si no es creación de propiedades, permitir cerrar directamente
    if (
      formType !== FORM_TYPES.PROPERTY_NOT_PUBLISHED &&
      formType !== FORM_TYPES.PROPERTY_PUBLISHED &&
      formType !== FORM_TYPES.PROPERTY_MINKAASA_UNPUBLISHED &&
      formType !== FORM_TYPES.PROPERTY_MINKAASA_PUBLISHED
    ) {
      handleForceClose();
      return;
    }

    // Si estamos en proceso de creación de propiedades
    // Verificar si hay datos importantes ingresados
    const hasImportantData =
      currentStep > 1 ||
      formData?.prototypeName?.trim() ||
      formData?.price ||
      formData?.propertyTypeId ||
      formData?.developmentId ||
      formData?.name?.trim() || // Para Minkaasa
      formData?.mainEmail?.trim(); // Para Minkaasa

    if (hasImportantData) {
      setShowConfirmClose(true);
    } else {
      // Si no hay datos importantes, cerrar directamente
      handleForceClose();
    }
  };

  // Cerrar forzadamente (sin confirmación)
  const handleForceClose = () => {
    setLocalLoading(false);
    setFieldErrors([]);
    setShowConfirmClose(false);
    if (setExternalLoading) {
      setExternalLoading(false);
    }
    onClose();
  };

  // Confirmar el cierre y limpiar datos si es necesario
  const handleConfirmClose = () => {
    // Si estamos en paso 1, no hay nada que limpiar en el servidor
    // Si estamos en pasos posteriores, ya se creó algo en el servidor
    // pero el usuario decidió dejarlo incompleto

    if (!currentItem && currentStep > 1) {
      clearCreationData();
    }

    handleForceClose();
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

      // Si es creación de propiedad y estamos en el paso 1
      if (
        !currentItem &&
        (formType === FORM_TYPES.PROPERTY_NOT_PUBLISHED ||
          formType === FORM_TYPES.PROPERTY_PUBLISHED ||
          formType === FORM_TYPES.PROPERTY_MINKAASA_UNPUBLISHED ||
          formType === FORM_TYPES.PROPERTY_MINKAASA_PUBLISHED) &&
        currentStep === 1
      ) {
        const isMinkaasa =
          formType === FORM_TYPES.PROPERTY_MINKAASA_UNPUBLISHED ||
          formType === FORM_TYPES.PROPERTY_MINKAASA_PUBLISHED;

        const basicData = createBasicPropertyData(formData, isMinkaasa);
        const result = await createBasicProperty(basicData, formType);

        if (result.success) {
          // No cerrar el diálogo, continuar al siguiente paso
          // El hook automáticamente avanza al paso 2
        } else {
          setError(result.error || "Error al crear la propiedad básica");
        }
        return;
      }

      // Para otros tipos de formularios (desarrolladores, desarrollos), usar lógica original
      await onSubmit();
    } catch (error) {
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
      setShowConfirmClose(false);
      if (setExternalLoading) {
        setExternalLoading(false);
      }
      // Nota: No limpiar datos de creación aquí automáticamente
      // Eso se maneja en handleConfirmClose cuando el usuario confirma
    }
  }, [open, setExternalLoading]);

  // Manejar tecla Escape
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape" && open && !showConfirmClose) {
        event.preventDefault();
        handleCloseAttempt();
      }
    };

    if (open) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [open, showConfirmClose]);

  // Determinar el título del diálogo
  const getDialogTitle = () => {
    const isPropertyType =
      formType === FORM_TYPES.PROPERTY_NOT_PUBLISHED ||
      formType === FORM_TYPES.PROPERTY_PUBLISHED ||
      formType === FORM_TYPES.PROPERTY_MINKAASA_UNPUBLISHED ||
      formType === FORM_TYPES.PROPERTY_MINKAASA_PUBLISHED;

    if (isPropertyType) {
      if (currentItem) {
        // Edición con tabs
        return "Editar Propiedad";
      } else {
        // Creación multi-paso
        if (currentStep === 1) {
          return "Paso 1: Datos de la Propiedad";
        } else if (currentStep === 2) {
          return "Paso 2: Descripciones";
        } else if (currentStep === 3) {
          return "Paso 3: Imágenes";
        }
      }
    }

    return title; // Título por defecto
  };

  // Función específica para refrescar datos después de edición exitosa
  const handleRefreshAfterEdit = async (successMessage = null) => {
    try {
      // Usar la función de refresh específica si está disponible
      if (typeof onRefreshData === "function") {
        await onRefreshData(successMessage);
      }
    } catch (error) {
      // Error al refrescar datos
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleCloseAttempt}
        maxWidth="md"
        fullWidth
        disableEscapeKeyDown={true}
      >
        <DialogTitle>
          {getDialogTitle()}
          <IconButton
            onClick={handleCloseAttempt}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box component="div" sx={{ mt: 2 }}>
            {/* Mostrar stepper solo para creación de propiedades */}
            {!currentItem &&
              (formType === FORM_TYPES.PROPERTY_NOT_PUBLISHED ||
                formType === FORM_TYPES.PROPERTY_PUBLISHED ||
                formType === FORM_TYPES.PROPERTY_MINKAASA_UNPUBLISHED ||
                formType === FORM_TYPES.PROPERTY_MINKAASA_PUBLISHED) && (
                <PropertyCreationStepper
                  currentStep={currentStep}
                  formType={formType}
                />
              )}

            {error && (
              <Alert
                severity="error"
                sx={{ mb: 2 }}
                onClose={() => setError(null)}
              >
                {error}
              </Alert>
            )}

            {/* Mostrar error del multi-step si existe */}
            {multiStepError && (
              <Alert
                severity="error"
                sx={{ mb: 2 }}
                onClose={() => setMultiStepError(null)}
              >
                {multiStepError}
              </Alert>
            )}

            {/* Mostrar error del multi-step edit si existe */}
            {editError && (
              <Alert
                severity="error"
                sx={{ mb: 2 }}
                onClose={() => setEditError(null)}
              >
                {editError}
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

            {/* Contenido específico para cada paso de creación de propiedades */}
            {!currentItem &&
              (formType === FORM_TYPES.PROPERTY_NOT_PUBLISHED ||
                formType === FORM_TYPES.PROPERTY_PUBLISHED ||
                formType === FORM_TYPES.PROPERTY_MINKAASA_UNPUBLISHED ||
                formType === FORM_TYPES.PROPERTY_MINKAASA_PUBLISHED) && (
                <>
                  {/* Paso 2: Descripciones */}
                  {currentStep === 2 && (
                    <Step2Descriptions
                      onSubmit={handleStep2Submit}
                      onPrevious={previousStep}
                      loading={multiStepLoading}
                      error={multiStepError}
                    />
                  )}

                  {/* Paso 3: Imágenes */}
                  {currentStep === 3 && (
                    <Step3Images
                      onSubmit={handleStep3Submit}
                      onPrevious={previousStep}
                      loading={multiStepLoading}
                      error={multiStepError}
                      prototypeId={prototypeId}
                    />
                  )}
                </>
              )}

            {/* Edición de propiedades con tabs */}
            {currentItem &&
              (formType === FORM_TYPES.PROPERTY_NOT_PUBLISHED ||
                formType === FORM_TYPES.PROPERTY_PUBLISHED ||
                formType === FORM_TYPES.PROPERTY_MINKAASA_UNPUBLISHED ||
                formType === FORM_TYPES.PROPERTY_MINKAASA_PUBLISHED) && (
                <PropertyEditTabs
                  formData={formData}
                  setFormData={setFormData}
                  formType={formType}
                  renderField={renderField}
                  onUpdateBasic={updateBasicProperty}
                  onUpdateDescriptions={updateDescriptions}
                  onUpdateImages={updateImages}
                  loading={editLoading}
                  error={editError}
                  setError={setEditError}
                  onClose={onClose}
                  onRefresh={handleRefreshAfterEdit}
                  prototypeId={currentItemId}
                />
              )}

            {/* Sección de Imágenes para desarrollos */}
            {formType === FORM_TYPES.DEVELOPMENT && (
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
                  <Grid item xs={12} sm={6} md={6}>
                    <Button
                      variant="outlined"
                      component="label"
                      fullWidth
                      sx={{ height: 56, justifyContent: "flex-start" }}
                    >
                      {currentItem
                        ? "Cambiar imagen principal"
                        : "Agregar imagen principal"}
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={(e) =>
                          handleMainImageChange(e.target.files[0])
                        }
                      />
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6} md={6}>
                    <Button
                      variant="outlined"
                      component="label"
                      fullWidth
                      sx={{ height: 56, justifyContent: "flex-start" }}
                    >
                      {currentItem
                        ? "Cambiar imágenes secundarias"
                        : "Agregar imágenes secundarias"}
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
          <Button onClick={handleCloseAttempt} color="primary">
            Cancelar
          </Button>

          {/* Para creación de propiedades multi-paso */}
          {!currentItem &&
            (formType === FORM_TYPES.PROPERTY_NOT_PUBLISHED ||
              formType === FORM_TYPES.PROPERTY_PUBLISHED ||
              formType === FORM_TYPES.PROPERTY_MINKAASA_UNPUBLISHED ||
              formType === FORM_TYPES.PROPERTY_MINKAASA_PUBLISHED) && (
              <>
                {/* Botón Siguiente/Continuar para paso 1 */}
                {currentStep === 1 && (
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
                      "Continuar"
                    )}
                  </Button>
                )}

                {/* Los pasos 2 y 3 manejan sus propios botones dentro de sus componentes */}
              </>
            )}

          {/* Para otros tipos de formularios (desarrolladores, desarrollos) */}
          {(currentItem ||
            formType === FORM_TYPES.DEVELOPER ||
            formType === FORM_TYPES.DEVELOPMENT) &&
            formType !== FORM_TYPES.PROPERTY_NOT_PUBLISHED &&
            formType !== FORM_TYPES.PROPERTY_PUBLISHED &&
            formType !== FORM_TYPES.PROPERTY_MINKAASA_UNPUBLISHED &&
            formType !== FORM_TYPES.PROPERTY_MINKAASA_PUBLISHED && (
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
            )}
        </DialogActions>
      </Dialog>

      {/* Modal de confirmación para cerrar */}
      <ConfirmCloseDialog
        open={showConfirmClose}
        onClose={() => setShowConfirmClose(false)}
        onConfirm={handleConfirmClose}
        currentStep={currentStep}
        prototypeId={prototypeId}
        formType={formType}
      />
    </>
  );
};

export default FormDialog;
