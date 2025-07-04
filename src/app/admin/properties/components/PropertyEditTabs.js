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
  Skeleton,
  Card,
  CardContent,
} from "@mui/material";
import { FORM_TYPES } from "../constants";
import { getBasicPropertySections } from "./fieldsConfig";
import Step2Descriptions from "./Step2Descriptions";
import Step3Images from "./Step3Images";
import Step4Video from "./Step4Video";

// Componente TabPanel
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`property-edit-tabpanel-${index}`}
      aria-labelledby={`property-edit-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

// Props para el Tab
function a11yProps(index) {
  return {
    id: `property-edit-tab-${index}`,
    "aria-controls": `property-edit-tabpanel-${index}`,
  };
}

const PropertyEditTabs = ({
  formData,
  setFormData,
  formType,
  renderField,
  onUpdateBasic,
  onUpdateDescriptions,
  onUpdateImages,
  onUpdateVideo,
  loading,
  error,
  setError,
  onClose,
  onRefresh,
  prototypeId, // Nuevo prop para el ID de la propiedad
}) => {
  const [currentTab, setCurrentTab] = useState(0);
  const [tabErrors, setTabErrors] = useState({});
  const [tabLoading, setTabLoading] = useState({});
  const [initialDataLoading, setInitialDataLoading] = useState(true);

  // Simular el tiempo de carga inicial de datos
  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialDataLoading(false);
    }, 1000); // 1 segundo de gracia para que los datos se carguen

    return () => clearTimeout(timer);
  }, []);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  // Función para mostrar éxito y cerrar modal
  const showSuccessAndClose = (message) => {
    // Cerrar inmediatamente y dejar que el componente padre maneje la notificación
    if (onClose) onClose();
    if (onRefresh) onRefresh(message); // Pasar el mensaje al componente padre
  };

  // Obtener secciones básicas para el tab 1
  const basicSections = getBasicPropertySections(formType);

  // Manejar guardado del tab 1 (datos básicos)
  const handleSaveBasic = async () => {
    try {
      setTabLoading((prev) => ({ ...prev, 0: true }));
      setTabErrors((prev) => ({ ...prev, 0: null }));

      const result = await onUpdateBasic(formData);

      if (result.success) {
        console.log("Datos básicos actualizados exitosamente");
        showSuccessAndClose("✅ Datos básicos actualizados correctamente");
      } else {
        setTabErrors((prev) => ({ ...prev, 0: result.error }));
      }
    } catch (error) {
      setTabErrors((prev) => ({ ...prev, 0: error.message }));
    } finally {
      setTabLoading((prev) => ({ ...prev, 0: false }));
    }
  };

  // Manejar guardado del tab 2 (descripciones)
  const handleSaveDescriptions = async (descriptions) => {
    try {
      setTabLoading((prev) => ({ ...prev, 1: true }));
      setTabErrors((prev) => ({ ...prev, 1: null }));

      const result = await onUpdateDescriptions(descriptions);

      if (result.success) {
        // Actualizar formData con las nuevas descripciones
        setFormData((prev) => ({ ...prev, descriptions }));
        console.log("Descripciones actualizadas exitosamente");
        showSuccessAndClose("✅ Descripciones actualizadas correctamente");
      } else {
        setTabErrors((prev) => ({ ...prev, 1: result.error }));
      }
    } catch (error) {
      setTabErrors((prev) => ({ ...prev, 1: error.message }));
    } finally {
      setTabLoading((prev) => ({ ...prev, 1: false }));
    }
  };

  // Manejar guardado del tab 3 (imágenes)
  const handleSaveImages = async (mainImage, secondaryImages) => {
    try {
      setTabLoading((prev) => ({ ...prev, 2: true }));
      setTabErrors((prev) => ({ ...prev, 2: null }));

      const result = await onUpdateImages(mainImage, secondaryImages);

      if (result.success) {
        console.log("Imágenes actualizadas exitosamente");

        // Usar el mensaje del resultado si está disponible, o uno por defecto
        const message =
          result.message || "✅ Imágenes actualizadas correctamente";
        showSuccessAndClose(message);
      } else {
        setTabErrors((prev) => ({ ...prev, 2: result.error }));
      }
    } catch (error) {
      setTabErrors((prev) => ({ ...prev, 2: error.message }));
    } finally {
      setTabLoading((prev) => ({ ...prev, 2: false }));
    }
  };

  // Manejar guardado del tab 4 (video)
  const handleSaveVideo = async (videoData) => {
    try {
      setTabLoading((prev) => ({ ...prev, 3: true }));
      setTabErrors((prev) => ({ ...prev, 3: null }));

      const result = await onUpdateVideo(videoData);

      if (result.success) {
        console.log("Video actualizado exitosamente");
        
        // Actualizar formData con el nuevo video si es necesario
        if (videoData) {
          setFormData((prev) => ({ ...prev, videoPath: videoData.videoPath }));
        } else {
          // Video eliminado
          setFormData((prev) => ({ ...prev, videoPath: null }));
        }

        const message = result.message || "✅ Video actualizado correctamente";
        showSuccessAndClose(message);
      } else {
        setTabErrors((prev) => ({ ...prev, 3: result.error }));
      }
    } catch (error) {
      setTabErrors((prev) => ({ ...prev, 3: error.message }));
    } finally {
      setTabLoading((prev) => ({ ...prev, 3: false }));
    }
  };

  // Componente skeleton para campos de formulario
  const FieldSkeleton = () => (
    <Box>
      <Skeleton variant="text" width="30%" height={20} sx={{ mb: 1 }} />
      <Skeleton variant="rectangular" height={56} />
    </Box>
  );

  // Componente skeleton para descripciones
  const DescriptionsSkeleton = () => (
    <Box>
      <Skeleton variant="text" width="40%" height={32} sx={{ mb: 2 }} />
      <Box sx={{ mb: 2 }}>
        <Skeleton variant="text" width="60%" height={20} sx={{ mb: 1 }} />
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Skeleton variant="text" width="80%" height={24} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="100%" height={60} />
          </CardContent>
        </Card>
      </Box>
      <Box sx={{ border: "1px dashed #ccc", borderRadius: 1, p: 2 }}>
        <Skeleton variant="text" width="30%" height={24} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={56} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={120} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" width={150} height={36} />
      </Box>
    </Box>
  );

  // Componente skeleton para imágenes
  const ImagesSkeleton = () => (
    <Box>
      <Skeleton variant="text" width="40%" height={32} sx={{ mb: 2 }} />
      <Skeleton variant="text" width="70%" height={20} sx={{ mb: 3 }} />

      {/* Skeleton para galería de vista previa */}
      <Box sx={{ mb: 3 }}>
        <Skeleton variant="text" width="30%" height={24} sx={{ mb: 2 }} />
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <Skeleton variant="rectangular" width={200} height={150} />
          <Skeleton variant="rectangular" width={150} height={150} />
          <Skeleton variant="rectangular" width={150} height={150} />
        </Box>
      </Box>

      {/* Skeleton para controles de carga */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Skeleton variant="rectangular" height={200} />
        </Grid>
        <Grid item xs={12} md={6}>
          <Skeleton variant="rectangular" height={200} />
        </Grid>
      </Grid>
    </Box>
  );

  // Componente skeleton para video
  const VideoSkeleton = () => (
    <Box>
      <Skeleton variant="text" width="40%" height={32} sx={{ mb: 2 }} />
      <Skeleton variant="text" width="70%" height={20} sx={{ mb: 3 }} />

      {/* Skeleton para controles de carga */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Skeleton variant="rectangular" height={200} />
        </Grid>
        <Grid item xs={12} md={6}>
          <Skeleton variant="rectangular" height={200} />
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          aria-label="Tabs de edición de propiedad"
          variant="fullWidth"
        >
          <Tab label="Datos Básicos" {...a11yProps(0)} />
          <Tab label="Descripciones" {...a11yProps(1)} />
          <Tab label="Imágenes" {...a11yProps(2)} />
          <Tab label="Video" {...a11yProps(3)} />
        </Tabs>
      </Box>

      {/* Tab 1: Datos básicos */}
      <TabPanel value={currentTab} index={0}>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Información básica de la propiedad
        </Typography>

        {tabErrors[0] && (
          <Alert
            severity="error"
            sx={{ mb: 2 }}
            onClose={() => setTabErrors((prev) => ({ ...prev, 0: null }))}
          >
            {tabErrors[0]}
          </Alert>
        )}

        {initialDataLoading ? (
          // Skeleton para datos básicos
          <Box>
            {[1, 2, 3].map((section) => (
              <Box key={section}>
                <Skeleton
                  variant="text"
                  width="25%"
                  height={32}
                  sx={{ mt: 2, mb: 2 }}
                />
                <Grid container spacing={2}>
                  {[1, 2, 3].map((field) => (
                    <Grid item xs={12} sm={6} md={4} key={field}>
                      <FieldSkeleton />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            ))}
            <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
              <Skeleton variant="rectangular" width={200} height={36} />
            </Box>
          </Box>
        ) : (
          <>
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
                onClick={handleSaveBasic}
                disabled={tabLoading[0]}
                sx={{
                  bgcolor: "#25D366",
                  "&:hover": { bgcolor: "#128C7E" },
                }}
              >
                {tabLoading[0] ? (
                  <CircularProgress size={24} sx={{ color: "white" }} />
                ) : (
                  "Guardar Datos Básicos"
                )}
              </Button>
            </Box>
          </>
        )}
      </TabPanel>

      {/* Tab 2: Descripciones */}
      <TabPanel value={currentTab} index={1}>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Descripciones de la propiedad
        </Typography>

        {tabErrors[1] && (
          <Alert
            severity="error"
            sx={{ mb: 2 }}
            onClose={() => setTabErrors((prev) => ({ ...prev, 1: null }))}
          >
            {tabErrors[1]}
          </Alert>
        )}

        {initialDataLoading ? (
          <DescriptionsSkeleton />
        ) : (
          <Step2Descriptions
            onSubmit={handleSaveDescriptions}
            loading={tabLoading[1]}
            error={tabErrors[1]}
            initialDescriptions={formData.descriptions || []}
            showButtons={true}
            buttonText="Guardar Descripciones"
          />
        )}
      </TabPanel>

      {/* Tab 3: Imágenes */}
      <TabPanel value={currentTab} index={2}>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Imágenes de la propiedad
        </Typography>

        {tabErrors[2] && (
          <Alert
            severity="error"
            sx={{ mb: 2 }}
            onClose={() => setTabErrors((prev) => ({ ...prev, 2: null }))}
          >
            {tabErrors[2]}
          </Alert>
        )}

        {initialDataLoading ? (
          <ImagesSkeleton />
        ) : (
          <Step3Images
            onSubmit={handleSaveImages}
            loading={tabLoading[2]}
            error={tabErrors[2]}
            initialMainImage={formData?.mainImagePreview || formData?.mainImage}
            initialSecondaryImages={formData?.secondaryImages || []}
            initialSecondaryImagesPreview={
              formData?.secondaryImagesPreview || []
            }
            showButtons={true}
            buttonText="Guardar Imágenes"
            prototypeId={prototypeId}
          />
        )}
      </TabPanel>

      {/* Tab 4: Video */}
      <TabPanel value={currentTab} index={3}>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Video de la propiedad
        </Typography>

        {tabErrors[3] && (
          <Alert
            severity="error"
            sx={{ mb: 2 }}
            onClose={() => setTabErrors((prev) => ({ ...prev, 3: null }))}
          >
            {tabErrors[3]}
          </Alert>
        )}

        {initialDataLoading ? (
          <VideoSkeleton />
        ) : (
          <Step4Video
            onSubmit={handleSaveVideo}
            loading={tabLoading[3]}
            error={tabErrors[3]}
            prototypeId={prototypeId}
            currentVideo={formData?.videoPath}
            showButtons={true}
            buttonText="Guardar Video"
          />
        )}
      </TabPanel>
    </Box>
  );
};

export default PropertyEditTabs;
