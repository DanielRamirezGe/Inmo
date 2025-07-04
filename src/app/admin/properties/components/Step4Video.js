import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  Alert,
  LinearProgress,
  Paper,
  IconButton,
  Card,
  CardContent,
  CardActions,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  PlayArrow as PlayArrowIcon,
  VideoFile as VideoFileIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useVideoHandling } from '../../../../hooks/useVideoHandling';
import { VerticalVideoPlayer } from '../../../../components/videoStream';

const Step4Video = ({
  onSubmit,
  loading: externalLoading = false,
  error: externalError = null,
  prototypeId,
  currentVideo = null, // Video URL actual del servidor
  showButtons = false,
  buttonText = "Guardar Video"
}) => {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);

  const {
    loading: videoLoading,
    error: videoError,
    uploadProgress,
    uploadVideo,
    removeVideo,
    createVideoPreview,
    cleanupVideoPreview,
    getVideoInfo,
    setError: setVideoError
  } = useVideoHandling();

  const isLoading = externalLoading || videoLoading;
  const currentError = externalError || videoError;

  // Limpiar preview cuando el componente se desmonta
  useEffect(() => {
    return () => {
      if (videoPreview) {
        cleanupVideoPreview(videoPreview);
      }
    };
  }, [videoPreview, cleanupVideoPreview]);

  // Manejar selección de archivo de video
  const handleVideoSelect = useCallback((file) => {
    if (!file) return;

    // Limpiar preview anterior
    if (videoPreview) {
      cleanupVideoPreview(videoPreview);
    }

    // Crear nuevo preview
    const preview = createVideoPreview(file);
    setSelectedVideo(file);
    setVideoPreview(preview);
    setVideoError(null);
  }, [videoPreview, createVideoPreview, cleanupVideoPreview, setVideoError]);

  // Manejar cambio en el input de archivo
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleVideoSelect(file);
    }
  };

  // Subir video
  const handleUploadVideo = async () => {
    if (!selectedVideo || !prototypeId) return;

    const result = await uploadVideo(prototypeId, selectedVideo, (progress) => {
      console.log('Upload progress:', progress);
    });

    if (result.success && onSubmit) {
      onSubmit(result.data);
    }
  };

  // Eliminar video
  const handleRemoveVideo = async () => {
    if (!prototypeId) return;

    const result = await removeVideo(prototypeId);
    
    if (result.success && onSubmit) {
      // Limpiar estado local
      setSelectedVideo(null);
      if (videoPreview) {
        cleanupVideoPreview(videoPreview);
        setVideoPreview(null);
      }
      
      onSubmit(null); // Indicar que el video fue eliminado
    }
    
    setShowRemoveDialog(false);
  };

  // Cancelar selección de video
  const handleCancelSelection = () => {
    if (videoPreview) {
      cleanupVideoPreview(videoPreview);
    }
    setSelectedVideo(null);
    setVideoPreview(null);
    setVideoError(null);
  };

  // Obtener información del video para mostrar
  const getDisplayVideoInfo = () => {
    if (selectedVideo) {
      return getVideoInfo(selectedVideo);
    }
    return null;
  };

  // Verificar si hay un video actual del servidor
  const hasCurrentVideo = currentVideo && typeof currentVideo === 'string';

  return (
    <Box>

      {currentError && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setVideoError(null)}>
          {currentError}
        </Alert>
      )}

      {/* Mostrar video actual del servidor */}
      {hasCurrentVideo && !selectedVideo && (
        <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Video Actual
          </Typography>
          
          {/* Reproductor Vertical */}
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
            <VerticalVideoPlayer
              videoPath={currentVideo}
              height={400}
              showControls={true}
              onError={(error) => {
                console.error('Error en reproductor de video:', error);
                setVideoError('Error al reproducir el video');
              }}
            />
          </Box>
          
          {/* Acciones */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              startIcon={<DeleteIcon />}
              onClick={() => setShowRemoveDialog(true)}
              color="error"
              variant="outlined"
              size="small"
              disabled={isLoading}
            >
              Eliminar Video
            </Button>
          </Box>
        </Paper>
      )}

      {/* Selector de archivo para nuevo video */}
      {(!hasCurrentVideo || selectedVideo) && (
        <Paper 
          elevation={1} 
          sx={{ 
            p: 3, 
            border: '2px dashed #ccc',
            textAlign: 'center',
            mb: 3,
            backgroundColor: selectedVideo ? '#f5f5f5' : 'transparent'
          }}
        >
          {!selectedVideo ? (
            <>
              <CloudUploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Seleccionar Video
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                Formatos permitidos: MP4, WebM, OGG, AVI, MOV, WMV<br />
                Tamaño máximo: 2GB
              </Typography>
              <Button
                variant="contained"
                component="label"
                startIcon={<CloudUploadIcon />}
                disabled={isLoading}
              >
                Seleccionar Archivo
                <input
                  type="file"
                  hidden
                  accept="video/mp4,video/webm,video/ogg,video/avi,video/mov,video/wmv"
                  onChange={handleFileChange}
                />
              </Button>
            </>
          ) : (
            <>
              <Typography variant="h6" gutterBottom>
                Video Seleccionado
              </Typography>
              
              {/* Información del archivo */}
              {(() => {
                const videoInfo = getDisplayVideoInfo();
                return videoInfo ? (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body1"><strong>Nombre:</strong> {videoInfo.name}</Typography>
                    <Typography variant="body2"><strong>Tamaño:</strong> {videoInfo.sizeFormatted}</Typography>
                    <Typography variant="body2"><strong>Tipo:</strong> {videoInfo.type}</Typography>
                  </Box>
                ) : null;
              })()}

              {/* Preview del video */}
              {videoPreview && (
                <Box sx={{ mb: 2 }}>
                  <video
                    src={videoPreview}
                    controls
                    style={{
                      maxWidth: '100%',
                      maxHeight: '300px',
                      borderRadius: '8px'
                    }}
                  />
                </Box>
              )}

              {/* Barra de progreso durante la subida */}
              {isLoading && uploadProgress > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Subiendo video... {uploadProgress}%
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={uploadProgress} 
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
              )}

              {/* Botones de acción */}
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button
                  variant="outlined"
                  onClick={handleCancelSelection}
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
                <Button
                  variant="contained"
                  component="label"
                  disabled={isLoading}
                >
                  Cambiar Video
                  <input
                    type="file"
                    hidden
                    accept="video/mp4,video/webm,video/ogg,video/avi,video/mov,video/wmv"
                    onChange={handleFileChange}
                  />
                </Button>
              </Box>
            </>
          )}
        </Paper>
      )}

      {/* Botones de acción principales */}
      {showButtons && selectedVideo && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button
            variant="contained"
            onClick={handleUploadVideo}
            disabled={isLoading || !selectedVideo}
            sx={{
              bgcolor: "#25D366",
              "&:hover": { bgcolor: "#128C7E" },
            }}
          >
            {isLoading ? 'Subiendo...' : buttonText}
          </Button>
        </Box>
      )}

      {/* Dialog para confirmar eliminación */}
      <Dialog
        open={showRemoveDialog}
        onClose={() => setShowRemoveDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Está seguro de que desea eliminar el video actual? Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowRemoveDialog(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleRemoveVideo} 
            color="error" 
            disabled={isLoading}
          >
            {isLoading ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Step4Video; 