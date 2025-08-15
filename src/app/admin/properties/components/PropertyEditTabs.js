import React, { useState, useEffect } from "react";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Grid,
} from "@mui/material";

// Hooks y constantes
import { usePropertyEditTabs } from "../../../../hooks/usePropertyEditTabs";
import { FORM_TYPES } from "../constants";
import { getBasicPropertySections } from "./fieldsConfig";

// Componentes especializados
import Step2Descriptions from "./Step2Descriptions";
import Step3Images from "./Step3Images";
import Step4Video from "./Step4Video";

// Componentes skeleton reutilizables
import { TabContentSkeleton } from "./SkeletonComponents";

/**
 * ✅ PropertyEditTabs refactorizado - Componente simplificado
 *
 * Responsabilidades reducidas:
 * - Renderizar la UI de tabs
 * - Coordinar componentes de cada tab
 * - Mostrar estados de carga y errores
 *
 * La lógica compleja se movió al hook usePropertyEditTabs
 */

// Componente TabPanel optimizado
const TabPanel = ({ children, value, index, loading = false, ...other }) => {
  const isHidden = value !== index;

  return (
    <div
      role="tabpanel"
      hidden={isHidden}
      id={`property-edit-tabpanel-${index}`}
      aria-labelledby={`property-edit-tab-${index}`}
      {...other}
    >
      {!isHidden && (
        <Box sx={{ p: 3 }}>
          {loading ? (
            <TabContentSkeleton
              type={["basic", "descriptions", "images", "video"][index]}
            />
          ) : (
            children
          )}
        </Box>
      )}
    </div>
  );
};

// Props para accesibilidad de tabs
const a11yProps = (index) => ({
  id: `property-edit-tab-${index}`,
  "aria-controls": `property-edit-tabpanel-${index}`,
});

const PropertyEditTabs = ({
  formData,
  setFormData,
  formType,
  renderField,
  onUpdateBasic,
  onUpdateDescriptions,
  onUpdateImages,
  onUpdateVideo,
  loading: externalLoading,
  error: externalError,
  setError: setExternalError,
  onClose,
  onRefresh,
  prototypeId,
}) => {
  // ✅ Estado local para carga inicial de datos
  const [initialDataLoading, setInitialDataLoading] = useState(true);

  // ✅ Hook personalizado para manejar toda la lógica de tabs
  const {
    currentTab,
    handleTabChange,
    handleSaveBasic,
    handleSaveDescriptions,
    handleSaveImages,
    handleSaveVideo,
    clearTabError,
    getTabLoading,
    getTabError,
    operationInProgress,
    debugState,
  } = usePropertyEditTabs({
    onUpdateBasic,
    onUpdateDescriptions,
    onUpdateImages,
    onUpdateVideo,
    onClose,
    onRefresh,
    setFormData,
  });

  // ✅ Simular tiempo de carga inicial (eliminado el timeout artificial)
  useEffect(() => {
    // En lugar de un timeout arbitrario, basamos la carga en datos reales
    const hasFormData = formData && Object.keys(formData).length > 0;
    const isExternalLoading = externalLoading;

    setInitialDataLoading(!hasFormData && isExternalLoading);
  }, [formData, externalLoading]);

  // ✅ Obtener secciones básicas para el tab 1
  const basicSections = getBasicPropertySections(formType);

  // ✅ Manejadores de guardado que integran con el hook
  const handleSaveBasicTab = async () => {
    await handleSaveBasic(formData);
  };

  const handleSaveDescriptionsTab = async (descriptions) => {
    await handleSaveDescriptions(descriptions);
  };

  const handleSaveImagesTab = async (
    mainImage,
    secondaryImages,
    imagesToDelete = []
  ) => {
    await handleSaveImages(mainImage, secondaryImages, imagesToDelete);
  };

  const handleSaveVideoTab = async (videoData) => {
    await handleSaveVideo(videoData);
  };

  // ✅ Configuración de tabs
  const tabsConfig = [
    {
      label: "Datos Básicos",
      ariaLabel: "Datos básicos de la propiedad",
    },
    {
      label: "Descripciones",
      ariaLabel: "Descripciones de la propiedad",
    },
    {
      label: "Imágenes",
      ariaLabel: "Imágenes de la propiedad",
    },
    {
      label: "Video",
      ariaLabel: "Video de la propiedad",
    },
  ];

  // ✅ Función para renderizar el contenido de cada tab
  const renderTabContent = (tabIndex) => {
    const tabLoading = getTabLoading(tabIndex);
    const tabError = getTabError(tabIndex);

    // Error común para el tab
    const errorAlert = tabError && (
      <Alert
        severity="error"
        sx={{ mb: 2 }}
        onClose={() => clearTabError(tabIndex)}
      >
        {tabError}
      </Alert>
    );

    switch (tabIndex) {
      case 0: // Datos Básicos
        return (
          <>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Información básica de la propiedad
            </Typography>

            {errorAlert}

            {basicSections.map((section, sectionIndex) => (
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

            <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="contained"
                onClick={handleSaveBasicTab}
                disabled={tabLoading || operationInProgress}
                sx={{
                  bgcolor: "#25D366",
                  "&:hover": { bgcolor: "#128C7E" },
                }}
              >
                {tabLoading ? (
                  <CircularProgress size={24} sx={{ color: "white" }} />
                ) : (
                  "Guardar Datos Básicos"
                )}
              </Button>
            </Box>
          </>
        );

      case 1: // Descripciones
        return (
          <>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Descripciones de la propiedad
            </Typography>

            {errorAlert}

            <Step2Descriptions
              onSubmit={handleSaveDescriptionsTab}
              loading={tabLoading}
              error={tabError}
              initialDescriptions={formData.descriptions || []}
              showButtons={true}
              buttonText="Guardar Descripciones"
            />
          </>
        );

      case 2: // Imágenes
        return (
          <>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Imágenes de la propiedad
            </Typography>

            {errorAlert}

            <Step3Images
              onSubmit={handleSaveImagesTab}
              loading={tabLoading}
              error={tabError}
              initialMainImage={
                formData?.mainImagePreview || formData?.mainImage
              }
              initialSecondaryImages={formData?.secondaryImages || []}
              initialSecondaryImagesPreview={
                formData?.secondaryImagesPreview || []
              }
              showButtons={true}
              buttonText="Guardar Imágenes"
              prototypeId={prototypeId}
            />
          </>
        );

      case 3: // Video
        return (
          <>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Video de la propiedad
            </Typography>

            {errorAlert}

            <Step4Video
              onSubmit={handleSaveVideoTab}
              loading={tabLoading}
              error={tabError}
              prototypeId={prototypeId}
              currentVideo={formData?.videoPath}
              showButtons={true}
              buttonText="Guardar Video"
            />
          </>
        );

      default:
        return (
          <Typography variant="body1" color="text.secondary">
            Tab no encontrado
          </Typography>
        );
    }
  };

  // ✅ Debugging (disponible en desarrollo)
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      window.debugPropertyEditTabs = debugState;

      return () => {
        delete window.debugPropertyEditTabs;
      };
    }
  }, [debugState]);

  return (
    <Box sx={{ width: "100%" }}>
      {/* Header de tabs */}
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          aria-label="Tabs de edición de propiedad"
          variant="fullWidth"
          sx={{
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: "medium",
            },
            "& .Mui-selected": {
              fontWeight: "bold",
            },
          }}
        >
          {tabsConfig.map((tab, index) => (
            <Tab
              key={index}
              label={tab.label}
              aria-label={tab.ariaLabel}
              disabled={operationInProgress && currentTab !== index}
              {...a11yProps(index)}
            />
          ))}
        </Tabs>
      </Box>

      {/* Contenido de tabs */}
      {tabsConfig.map((_, index) => (
        <TabPanel
          key={index}
          value={currentTab}
          index={index}
          loading={initialDataLoading && currentTab === index}
        >
          {renderTabContent(index)}
        </TabPanel>
      ))}

      {/* Error externo (del componente padre) */}
      {externalError && (
        <Alert
          severity="error"
          sx={{ mt: 2, mx: 3 }}
          onClose={() => setExternalError && setExternalError(null)}
        >
          {externalError}
        </Alert>
      )}
    </Box>
  );
};

export default PropertyEditTabs;
