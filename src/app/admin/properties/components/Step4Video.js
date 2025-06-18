import React, { useState, useCallback } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Alert,
  LinearProgress,
  IconButton,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  CircularProgress,
} from "@mui/material";
import {
  CloudUpload as UploadIcon,
  PlayArrow as PlayIcon,
  Delete as DeleteIcon,
  VideoFile as VideoIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { usePropertyVideo } from "../../../../hooks/usePropertyVideo";
import VideoPlayer from "../../../../components/VideoPlayer";
import { videoService } from "../../../../services/videoService";

const Step4Video = ({
  prototypeId,
  onSubmit,
  loading: externalLoading = false,
  error: externalError = null,
  showButtons = true,
  buttonText = "Guardar Video",
}) => {
  // Estados locales simplificados
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [previewVideoUrl, setPreviewVideoUrl] = useState(null);
  const [uploadProgress, setUploadProgress] = useState({
    current: 0,
    total: 100,
    isUploading: false,
  });
  const [uploadError, setUploadError] = useState(null);

  // Hook optimizado para videos de propiedades
  const {
    videoUrl: propertyVideoUrl,
    loading: videoLoading,
    error: videoError,
    refreshVideo,
  } = usePropertyVideo(prototypeId, { mode: "admin" });

  // Validar archivo de video
  const validateVideoFile = (file) => {
    return videoService.validateVideoFile(file);
  };

  // Crear preview de video
  const createVideoPreview = (file) => {
    return videoService.createVideoPreview(file);
  };

  // Manejar selección de video
  const handleVideoSelect = useCallback(
    (event) => {
      const file = event.target.files[0];
      if (!file) return;

      // Validar archivo
      const validation = validateVideoFile(file);
      if (!validation.valid) {
        alert(validation.error);
        return;
      }

      // Limpiar video anterior si existe
      if (videoPreview) {
        URL.revokeObjectURL(videoPreview);
      }

      // Establecer nuevo video
      setSelectedVideo(file);
      setVideoPreview(createVideoPreview(file));
      setUploadError(null);

      // Limpiar el input para permitir seleccionar el mismo archivo nuevamente
      event.target.value = "";
    },
    [videoPreview]
  );

  // Manejar eliminación de video seleccionado
  const handleRemoveSelectedVideo = useCallback(() => {
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview);
    }
    setSelectedVideo(null);
    setVideoPreview(null);
    setUploadError(null);
  }, [videoPreview]);

  // Manejar eliminación de video actual
  const handleDeleteCurrentVideo = async () => {
    if (!propertyVideoUrl) return;

    if (
      !confirm(
        "¿Estás seguro de que quieres eliminar el video actual de esta propiedad?"
      )
    ) {
      return;
    }

    try {
      const result = await videoService.deletePropertyVideo(prototypeId);

      if (result.success) {
        alert("✅ Video eliminado exitosamente");
        refreshVideo(); // Actualizar estado del video
      } else {
        alert(`❌ ${result.error || "Error al eliminar el video"}`);
      }
    } catch (error) {
      console.error("Error eliminando video:", error);
      alert("❌ Error al eliminar el video. Por favor, inténtalo de nuevo.");
    }
  };

  // Manejar vista previa de video
  const handlePreviewVideo = useCallback((videoUrl) => {
    setPreviewVideoUrl(videoUrl);
    setShowPreviewDialog(true);
  }, []);

  const handleClosePreview = useCallback(() => {
    setShowPreviewDialog(false);
    setPreviewVideoUrl(null);
  }, []);

  // Manejar envío
  const handleSubmit = async () => {
    if (!selectedVideo) {
      if (showButtons) {
        // En modo edición, permitir guardar sin video nuevo
        onSubmit(null);
        return;
      } else {
        alert("Debe seleccionar un video");
        return;
      }
    }

    try {
      setUploadProgress({ current: 0, total: 100, isUploading: true });
      setUploadError(null);

      // Simular progreso
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => ({
          ...prev,
          current: Math.min(prev.current + 10, 90),
        }));
      }, 200);

      const result = await videoService.uploadPropertyVideo(
        prototypeId,
        selectedVideo
      );

      clearInterval(progressInterval);
      setUploadProgress((prev) => ({
        ...prev,
        current: 100,
        isUploading: false,
      }));

      if (result.success) {
        // Limpiar video seleccionado
        if (videoPreview) {
          URL.revokeObjectURL(videoPreview);
        }
        setSelectedVideo(null);
        setVideoPreview(null);

        // Actualizar video
        setTimeout(() => {
          refreshVideo();
        }, 1000);

        alert("✅ Video subido exitosamente");
        onSubmit(selectedVideo);
      } else {
        setUploadError(result.error || "Error al subir el video");
        alert(`❌ ${result.error || "Error al subir el video"}`);
      }
    } catch (error) {
      console.error("Error en handleSubmit:", error);
      setUploadError("Error al procesar el video");
      alert("❌ Error al procesar el video. Por favor, inténtalo de nuevo.");
      setUploadProgress((prev) => ({ ...prev, isUploading: false }));
    }
  };

  // Formatear tamaño de archivo
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Determinar si está cargando
  const isLoading =
    externalLoading || videoLoading || uploadProgress.isUploading;

  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h6" gutterBottom>
        Video de la Propiedad
      </Typography>

      {/* Error externo */}
      {externalError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {externalError}
        </Alert>
      )}

      {/* Error de upload */}
      {uploadError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {uploadError}
        </Alert>
      )}

      {/* Video actual */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Video Actual
              </Typography>

              {videoLoading && (
                <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                  <CircularProgress />
                </Box>
              )}

              {!videoLoading && propertyVideoUrl && (
                <Box>
                  <VideoPlayer
                    videoUrl={propertyVideoUrl}
                    loading={false}
                    error={null}
                    controls={true}
                    sx={{ height: 200, mb: 2 }}
                  />
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                      startIcon={<PlayIcon />}
                      onClick={() => handlePreviewVideo(propertyVideoUrl)}
                      size="small"
                    >
                      Vista Previa
                    </Button>
                    <Button
                      startIcon={<DeleteIcon />}
                      onClick={handleDeleteCurrentVideo}
                      color="error"
                      size="small"
                    >
                      Eliminar
                    </Button>
                  </Box>
                </Box>
              )}

              {!videoLoading && !propertyVideoUrl && !videoError && (
                <Box
                  sx={{ textAlign: "center", p: 3, color: "text.secondary" }}
                >
                  <VideoIcon sx={{ fontSize: 48, mb: 1 }} />
                  <Typography>Esta propiedad no tiene video</Typography>
                </Box>
              )}

              {videoError && (
                <Alert severity="info">
                  Esta propiedad no tiene video disponible
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Subir nuevo video */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Subir Nuevo Video
              </Typography>

              {!selectedVideo && (
                <Box>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoSelect}
                    style={{ display: "none" }}
                    id="video-upload-input"
                  />
                  <label htmlFor="video-upload-input">
                    <Button
                      variant="outlined"
                      component="span"
                      startIcon={<UploadIcon />}
                      fullWidth
                      sx={{ mb: 2 }}
                    >
                      Seleccionar Video
                    </Button>
                  </label>
                  <Typography variant="body2" color="text.secondary">
                    Formatos soportados: MP4, WebM, OGG, AVI, MOV
                    <br />
                    Tamaño máximo: 100MB
                  </Typography>
                </Box>
              )}

              {selectedVideo && (
                <Box>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <VideoIcon sx={{ mr: 1 }} />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle2">
                        {selectedVideo.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {formatFileSize(selectedVideo.size)}
                      </Typography>
                    </Box>
                    <IconButton
                      onClick={handleRemoveSelectedVideo}
                      size="small"
                    >
                      <CloseIcon />
                    </IconButton>
                  </Box>

                  {videoPreview && (
                    <VideoPlayer
                      videoUrl={videoPreview}
                      loading={false}
                      error={null}
                      controls={true}
                      sx={{ height: 150, mb: 2 }}
                    />
                  )}

                  {uploadProgress.isUploading && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Subiendo video... {uploadProgress.current}%
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={uploadProgress.current}
                        sx={{ mt: 1 }}
                      />
                    </Box>
                  )}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Botones de acción */}
      {showButtons && (
        <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={isLoading}
            startIcon={
              isLoading ? <CircularProgress size={20} /> : <UploadIcon />
            }
          >
            {isLoading ? "Procesando..." : buttonText}
          </Button>
        </Box>
      )}

      {/* Dialog de vista previa */}
      <Dialog
        open={showPreviewDialog}
        onClose={handleClosePreview}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Vista Previa del Video
          <IconButton
            onClick={handleClosePreview}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {previewVideoUrl && (
            <VideoPlayer
              videoUrl={previewVideoUrl}
              loading={false}
              error={null}
              controls={true}
              sx={{ height: 400 }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePreview}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Step4Video;
