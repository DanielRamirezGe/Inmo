import React, { useCallback } from "react";
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

// Componentes especializados
import ImageGallery from "./ImageGallery";
import PropertyCreationStepper from "./PropertyCreationStepper";
import Step2Descriptions from "./Step2Descriptions";
import Step3Images from "./Step3Images";
import ConfirmCloseDialog from "./ConfirmCloseDialog";
import PropertyEditTabs from "./PropertyEditTabs";

// Hook personalizado y constantes
import { useFormDialog } from "../../../../hooks/useFormDialog";
import { FORM_TYPES } from "../constants";

/**
 * ✅ FormDialog refactorizado - Componente principal simplificado
 *
 * Responsabilidades reducidas:
 * - Renderizar la UI del diálogo
 * - Coordinar componentes especializados
 * - Manejar la lógica de presentación
 *
 * La lógica compleja se movió al hook useFormDialog
 */
const FormDialog = ({
  open,
  onClose,
  onSubmit,
  title,
  formData: externalFormData = {},
  setFormData: setExternalFormData,
  fields,
  loading: externalLoading,
  setLoading: setExternalLoading,
  error: externalError,
  setError: setExternalError,
  formType,
  currentItem,
  onRefreshData,
}) => {
  // ✅ Estado local para forzar re-renders
  const [forceRender, setForceRender] = React.useState(0);

  // ✅ Usar el hook personalizado para toda la lógica compleja
  const {
    // Estado del formulario
    formData,
    setFormData,
    fieldErrors,
    selectOptions,
    loadingOptions,
    isLoadingInitialData,
    error,
    setError,
    isLoading,

    // Características del formulario
    formCharacteristics,

    // Secciones de campos
    fieldSections,

    // Hooks especializados
    multiStepCreate,
    multiStepEdit,

    // Manejadores de eventos
    handleFieldChange,
    handleMainImageChange,
    handleSecondaryImagesChange,

    // Manejadores de diálogo
    handleCloseAttempt,
    getDialogTitle,
    showConfirmClose,
    setShowConfirmClose,
    handleConfirmClose,

    // Props para componentes internos
    currentItemId,
  } = useFormDialog({
    open,
    formType,
    currentItem,
    onClose,
    onRefreshData,
    entityLabels: {
      [FORM_TYPES.DEVELOPER]: {
        singular: "Desarrolladora Inmobiliaria",
        plural: "Desarrolladoras Inmobiliarias",
      },
      [FORM_TYPES.DEVELOPMENT]: {
        singular: "Desarrollo",
        plural: "Desarrollos",
      },
      [FORM_TYPES.PROPERTY_NOT_PUBLISHED]: {
        singular: "Propiedad No Publicada",
        plural: "Propiedades No Publicadas",
      },
      [FORM_TYPES.PROPERTY_PUBLISHED]: {
        singular: "Propiedad Publicada",
        plural: "Propiedades Publicadas",
      },
      [FORM_TYPES.PROPERTY_MINKAASA_UNPUBLISHED]: {
        singular: "Propiedad Minkaasa No Publicada",
        plural: "Propiedades Minkaasa No Publicadas",
      },
      [FORM_TYPES.PROPERTY_MINKAASA_PUBLISHED]: {
        singular: "Propiedad Minkaasa Publicada",
        plural: "Propiedades Minkaasa Publicadas",
      },
    },
  });

  // ✅ Track multiStepCreate.currentStep changes and force re-render
  React.useEffect(() => {
    // Forzar re-render cuando el step cambie
    setForceRender((prev) => prev + 1);
  }, [multiStepCreate.currentStep]);

  // ✅ Handler personalizado para campos que sincroniza ambos estados
  const handleCustomFieldChange = useCallback(
    (fieldName, value) => {
      // Actualizar el estado interno del hook (para renderizado)
      handleFieldChange(fieldName, value);

      // ✅ Para formularios simples, también actualizar el estado externo (para guardado)
      if (formCharacteristics.isSimpleForm && setExternalFormData) {
        setExternalFormData((prev) => ({
          ...prev,
          [fieldName]: value,
        }));
      }
    },
    [handleFieldChange, formCharacteristics.isSimpleForm, setExternalFormData]
  );

  // ✅ Función para renderizar cada campo según su tipo
  const renderField = (field) => {
    const fieldValue = formData[field.name] || "";
    const hasError = Boolean(
      fieldErrors?.find((err) => err.field === field.name)
    );
    const errorMessage = fieldErrors?.find(
      (err) => err.field === field.name
    )?.message;

    switch (field.type) {
      case "readonly":
        return (
          <Box key={field.name} sx={{ minWidth: 240 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 0.5, fontWeight: 500 }}
            >
              {field.label}
            </Typography>
            <Box
              sx={{
                p: 2,
                border: 1,
                borderColor: "grey.300",
                borderRadius: 1,
                bgcolor: "grey.50",
                minHeight: 56,
                display: "flex",
                alignItems: "center",
                wordBreak: "break-word",
              }}
            >
              <Typography variant="body1" color="text.primary">
                {fieldValue || "No disponible"}
              </Typography>
            </Box>
            {field.description && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 0.5, display: "block" }}
              >
                {field.description}
              </Typography>
            )}
          </Box>
        );

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
              onChange={(e) =>
                handleCustomFieldChange(field.name, e.target.value)
              }
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
            onChange={(e) =>
              handleCustomFieldChange(field.name, e.target.value)
            }
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
            onChange={(e) =>
              handleCustomFieldChange(field.name, e.target.value)
            }
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
            onChange={(e) =>
              handleCustomFieldChange(field.name, e.target.value)
            }
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
        return (
          <TextField
            key={field.name}
            fullWidth
            label={field.label}
            value={fieldValue}
            onChange={(e) =>
              handleCustomFieldChange(field.name, e.target.value)
            }
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

  // ✅ Manejadores para pasos multi-step
  const handleStep2Submit = async (descriptions) => {
    const result = await multiStepCreate.addDescriptions(descriptions);
    if (result.success) {
      console.log("Step 2 completed successfully");
    }
  };

  const handleStep3Submit = async (mainImage, secondaryImages) => {
    const result = await multiStepCreate.addImages(mainImage, secondaryImages);
    if (result.success) {
      onClose();
      if (onRefreshData) {
        onRefreshData("Propiedad creada exitosamente");
      }
    }
  };

  // ✅ Manejar envío del formulario
  const handleSubmit = async () => {
    try {
      // Para creación de propiedades paso 1
      if (
        formCharacteristics.isPropertyForm &&
        formCharacteristics.isCreationMode &&
        multiStepCreate.currentStep === 1
      ) {
        const basicData = createBasicPropertyData(
          formData,
          formCharacteristics.isMinkaasaForm
        );

        const result = await multiStepCreate.createBasicProperty(
          basicData,
          formType
        );

        if (result.success) {
          console.log("Basic property created, advancing to step 2");

          // Esperar un poco para que el estado se actualice y luego forzar re-render
          setTimeout(() => {
            setForceRender((prev) => prev + 1);
          }, 200);
        } else {
          setError(result.error || "Error al crear la propiedad básica");
        }
        return;
      }

      // Para otros tipos de formularios
      await onSubmit();
    } catch (error) {
      console.error("Error in form submission:", error);
      // ✅ Mostrar el mensaje específico del error en lugar del genérico
      setError(
        error.message ||
          "Error al guardar los datos. Por favor, inténtalo de nuevo."
      );
    }
  };

  // ✅ Helper para crear datos básicos de propiedad
  const createBasicPropertyData = (formData, isMinkaasa) => {
    const basicData = {};

    // ✅ Validar campos requeridos
    if (!formData.prototypeName || formData.prototypeName.trim() === "") {
      throw new Error("El nombre del prototipo es obligatorio");
    }

    // ✅ Para propiedades no-Minkaasa, validar que el desarrollo esté seleccionado
    if (
      !isMinkaasa &&
      (!formData.developmentId ||
        formData.developmentId.toString().trim() === "")
    ) {
      throw new Error("Debe seleccionar un desarrollo para la propiedad");
    }

    // Campos básicos comunes
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

    // Mapear propertyTypeId a nameTypeId
    if (formData.propertyTypeId) {
      basicData.nameTypeId = Number(formData.propertyTypeId);
    }

    // Para propiedades normales
    if (!isMinkaasa && formData.developmentId) {
      basicData.developmentId = Number(formData.developmentId);
    }

    // Para propiedades Minkaasa
    if (isMinkaasa) {
      // Campos de ubicación
      basicData.condominium = formData.condominium || "";
      basicData.street = formData.street || "";
      basicData.exteriorNumber = formData.exteriorNumber || "";
      basicData.interiorNumber = formData.interiorNumber || "";
      basicData.suburb = formData.suburb || "";
      basicData.city = formData.city || "";
      basicData.state = formData.state || "";
      basicData.zipCode = formData.zipCode ? Number(formData.zipCode) : null;

      // Contacto externo
      basicData.externalAgreement = {
        name: formData.name || "",
        lastNameP: formData.lastNameP || "",
        lastNameM: formData.lastNameM || "",
        mainEmail: formData.mainEmail || "",
        mainPhone: formData.mainPhone || "",
        agent: formData.agent || "",
        commission: formData.commission ? Number(formData.commission) : 0,
      };
    }

    return basicData;
  };

  // ✅ Manejar refresh después de edición
  const handleRefreshAfterEdit = (successMessage) => {
    // Cerrar el modal
    onClose();

    // Notificar al componente padre para refrescar datos y mostrar mensaje
    if (onRefreshData) {
      onRefreshData(successMessage);
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleCloseAttempt}
        maxWidth="md"
        fullWidth
        scroll="paper"
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
            {/* Stepper para creación de propiedades */}
            {formCharacteristics.isPropertyForm &&
              formCharacteristics.isCreationMode && (
                <PropertyCreationStepper
                  currentStep={multiStepCreate.currentStep}
                  formType={formType}
                />
              )}

            {/* Alertas de error */}
            {(error || externalError) && (
              <Alert
                severity="error"
                sx={{ mb: 2 }}
                onClose={() => {
                  setError(null);
                  if (setExternalError) setExternalError(null);
                }}
              >
                {error || externalError}
              </Alert>
            )}

            {/* Renderizar secciones de campos para formularios simples y paso 1 de propiedades */}
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

            {/* Contenido específico para creación de propiedades */}
            {formCharacteristics.isPropertyForm &&
              formCharacteristics.isCreationMode && (
                <>
                  {/* Paso 2: Descripciones */}
                  {multiStepCreate.currentStep === 2 && (
                    <Step2Descriptions
                      onSubmit={handleStep2Submit}
                      onPrevious={multiStepCreate.previousStep}
                      loading={multiStepCreate.loading}
                      error={multiStepCreate.error}
                    />
                  )}

                  {/* Paso 3: Imágenes */}
                  {multiStepCreate.currentStep === 3 && (
                    <Step3Images
                      onSubmit={handleStep3Submit}
                      onPrevious={multiStepCreate.previousStep}
                      loading={multiStepCreate.loading}
                      error={multiStepCreate.error}
                      prototypeId={multiStepCreate.prototypeId}
                    />
                  )}
                </>
              )}

            {/* Edición de propiedades con tabs */}
            {formCharacteristics.isPropertyForm &&
              formCharacteristics.isEditMode && (
                <PropertyEditTabs
                  formData={formData}
                  setFormData={setFormData}
                  formType={formType}
                  renderField={renderField}
                  onUpdateBasic={multiStepEdit.updateBasicProperty}
                  onUpdateDescriptions={multiStepEdit.updateDescriptions}
                  onUpdateImages={multiStepEdit.updateImages}
                  onUpdateVideo={multiStepEdit.updateVideo}
                  loading={multiStepEdit.loading}
                  error={multiStepEdit.error}
                  setError={multiStepEdit.setError}
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
                  <Grid item xs={12} sm={6}>
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
                  <Grid item xs={12} sm={6}>
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

          {/* Para creación de propiedades - solo mostrar botón en paso 1 */}
          {formCharacteristics.isPropertyForm &&
            formCharacteristics.isCreationMode &&
            multiStepCreate.currentStep === 1 && (
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

          {/* Para formularios simples (desarrolladores, desarrollos) */}
          {formCharacteristics.isSimpleForm && (
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
        currentStep={multiStepCreate.currentStep}
        prototypeId={multiStepCreate.prototypeId}
        formType={formType}
      />
    </>
  );
};

export default FormDialog;
