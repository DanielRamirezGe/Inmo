import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Alert,
  Grid,
  Card,
  CardActions,
  IconButton,
  Chip,
  CircularProgress,
  Skeleton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';

const Step3Images = ({ 
  onSubmit, 
  onPrevious, 
  loading, 
  error,
  initialMainImage = null,
  initialSecondaryImages = [],
  showButtons = false,
  buttonText = "Finalizar"
}) => {
  const [mainImage, setMainImage] = useState(null);
  const [secondaryImages, setSecondaryImages] = useState([]);
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [secondaryImagesPreview, setSecondaryImagesPreview] = useState([]);
  const [imagesLoading, setImagesLoading] = useState(false);
  
  // Estado para tracking si la imagen principal fue eliminada
  const [mainImageRemoved, setMainImageRemoved] = useState(false);

  // Cargar imágenes iniciales cuando el componente se monta
  useEffect(() => {
    if (initialMainImage || (initialSecondaryImages && initialSecondaryImages.length > 0)) {
      setImagesLoading(true);
      
      // Simular tiempo de carga para imágenes
      const loadImages = async () => {
        try {
          if (initialMainImage) {
            // Si es una URL, usar como preview
            if (typeof initialMainImage === 'string') {
              setMainImagePreview(initialMainImage);
            } else {
              setMainImage(initialMainImage);
              setMainImagePreview(createImagePreview(initialMainImage));
            }
          }

          if (initialSecondaryImages && initialSecondaryImages.length > 0) {
            // Separar URLs de archivos File
            const urlImages = [];
            const fileImages = [];
            
            initialSecondaryImages.forEach(img => {
              if (typeof img === 'string') {
                urlImages.push(img);
              } else {
                fileImages.push(img);
              }
            });

            setSecondaryImages(fileImages);
            
            // Crear previews para archivos File y usar URLs directamente
            const previews = fileImages.map(createImagePreview);
            setSecondaryImagesPreview([...urlImages, ...previews]);
          }
          
          // Pequeño delay para mostrar el loading
          await new Promise(resolve => setTimeout(resolve, 800));
        } finally {
          setImagesLoading(false);
        }
      };

      loadImages();
    }
  }, [initialMainImage, initialSecondaryImages]);

  const createImagePreview = (file) => {
    if (file && file instanceof File) {
      return URL.createObjectURL(file);
    }
    return null;
  };

  const handleMainImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Limpiar preview anterior si era un archivo
      if (mainImagePreview && mainImage) {
        URL.revokeObjectURL(mainImagePreview);
      }
      
      setMainImage(file);
      setMainImagePreview(createImagePreview(file));
    }
  };

  const handleSecondaryImagesChange = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      // Limitar a máximo 10 imágenes secundarias
      const currentCount = secondaryImages.length;
      const remainingSlots = 10 - currentCount;
      const limitedFiles = files.slice(0, remainingSlots);
      
      setSecondaryImages(prev => [...prev, ...limitedFiles]);
      
      const previews = limitedFiles.map(createImagePreview);
      setSecondaryImagesPreview(prev => [...prev, ...previews]);
    }
  };

  const handleRemoveMainImage = () => {
    // Solo revocar URL si era un archivo (no una URL inicial)
    if (mainImagePreview && mainImage) {
      URL.revokeObjectURL(mainImagePreview);
    }
    setMainImage(null);
    setMainImagePreview(null);
    setMainImageRemoved(true);
  };

  const handleRemoveSecondaryImage = (index) => {
    // Solo revocar URL si era un archivo (verificar si es blob:)
    const preview = secondaryImagesPreview[index];
    if (preview && preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview);
    }
    
    // Contar solo archivos File para el índice correcto
    const fileIndex = secondaryImages.findIndex((_, fileIdx) => {
      // Calcular cuántas URLs hay antes de este archivo
      const urlsBeforeThisFile = initialSecondaryImages
        .filter(img => typeof img === 'string').length;
      return index === urlsBeforeThisFile + fileIdx;
    });

    if (fileIndex >= 0) {
      setSecondaryImages(prev => prev.filter((_, i) => i !== fileIndex));
    }
    
    setSecondaryImagesPreview(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    // En modo edición (showButtons = true), permitir envío sin nuevos archivos
    // En modo creación, requerir al menos una imagen
    if (!showButtons && !mainImage && !mainImagePreview && secondaryImages.length === 0 && secondaryImagesPreview.length === 0) {
      alert('Debe agregar al menos una imagen (principal o secundaria)');
      return;
    }
    
    if (!showButtons) {
      // Modo creación: usar lógica original
      onSubmit(mainImage, secondaryImages);
      return;
    }
    
    // MODO EDICIÓN: Necesitamos enviar TODAS las imágenes que deben quedar
    try {
      const finalMainImage = await prepareFinalMainImage();
      const finalSecondaryImages = await prepareFinalSecondaryImages();
      
      onSubmit(finalMainImage, finalSecondaryImages);
    } catch (error) {
      console.error('Error preparando imágenes:', error);
      alert('Error al preparar las imágenes. Por favor, inténtelo de nuevo.');
    }
  };
  
  // Preparar imagen principal final (nueva o existente que se mantiene)
  const prepareFinalMainImage = async () => {
    if (mainImage) {
      // Hay una nueva imagen principal
      return mainImage;
    }
    
    if (mainImagePreview && !mainImageRemoved) {
      // Mantener imagen principal existente - convertir URL a File
      const file = await urlToFile(mainImagePreview, 'main-image.jpg');
      return file;
    }
    
    // No hay imagen principal
    return null;
  };
  
  // Preparar imágenes secundarias finales (nuevas + existentes que se mantienen)
  const prepareFinalSecondaryImages = async () => {
    const finalImages = [];
    
    // Agregar archivos nuevos
    secondaryImages.forEach(file => {
      finalImages.push(file);
    });
    
    // Calcular cuántas imágenes nuevas hay para saber dónde empiezan las existentes
    const newImagesCount = secondaryImages.length;
    
    // Procesar todas las previews, saltando solo las que corresponden a archivos nuevos
    for (let i = 0; i < secondaryImagesPreview.length; i++) {
      const preview = secondaryImagesPreview[i];
      
      // Saltar las primeras N previews que corresponden a archivos nuevos
      if (i < newImagesCount) {
        continue;
      }
      
      // Procesar todas las imágenes existentes (sean blob URLs o no)
      if (preview) {
        try {
          const file = await urlToFile(preview, `secondary-image-${i + 1}.jpg`);
          finalImages.push(file);
        } catch (error) {
          console.error('Error convirtiendo imagen secundaria a File:', error);
        }
      }
    }
    
    return finalImages;
  };
  
  // Función helper para convertir URL a File
  const urlToFile = async (url, filename) => {
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
      }
      
      const blob = await response.blob();
      const file = new File([blob], filename, { type: blob.type });
      
      return file;
    } catch (error) {
      console.error('Error convirtiendo URL a File:', error);
      throw error;
    }
  };

  const getTotalImages = () => {
    return (mainImage || mainImagePreview ? 1 : 0) + secondaryImagesPreview.length;
  };

  return (
    <Box>
      {!showButtons && (
        <Typography variant="h6" sx={{ mb: 2 }}>
          Imágenes de la Propiedad
        </Typography>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {showButtons 
          ? "Gestione las imágenes de la propiedad. Puede tener una imagen principal y hasta 10 imágenes secundarias."
          : "Agregue una imagen principal y hasta 10 imágenes secundarias para mostrar la propiedad."
        }
      </Typography>

      {/* Indicador de carga para imágenes iniciales */}
      {imagesLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4, mb: 3 }}>
          <CircularProgress size={40} sx={{ mr: 2 }} />
          <Typography variant="body2" color="text.secondary">
            Cargando imágenes existentes...
          </Typography>
        </Box>
      )}

      {/* Controles de carga de imágenes */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {/* Imagen principal */}
        <Grid item xs={12} md={6}>
          <Card sx={{ minHeight: 280, display: 'flex', flexDirection: 'column' }}>
            {imagesLoading ? (
              <Box sx={{ p: 2, textAlign: 'center', flexGrow: 1 }}>
                <Skeleton variant="rectangular" width={120} height={24} sx={{ mx: 'auto', mb: 1 }} />
                <Skeleton variant="text" width={80} height={20} sx={{ mx: 'auto' }} />
              </Box>
            ) : (mainImage || mainImagePreview) ? (
              <>
                {/* Mostrar imagen existente */}
                <Box
                  sx={{
                    height: 200,
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    component="img"
                    src={mainImagePreview}
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      bgcolor: 'rgba(0,0,0,0.7)',
                      borderRadius: 1,
                      px: 1,
                      py: 0.5,
                    }}
                  >
                    <Typography variant="caption" color="white">
                      Principal
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ p: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Imagen Principal
                  </Typography>
                  <Chip
                    label={mainImage ? mainImage.name : "Imagen actual"}
                    color="success"
                    variant="outlined"
                    size="small"
                    sx={{ mb: 1 }}
                  />
                  {mainImage && (
                    <Typography variant="body2" color="text.secondary">
                      {(mainImage.size / 1024 / 1024).toFixed(2)} MB
                    </Typography>
                  )}
                </Box>
              </>
            ) : (
              <Box sx={{ p: 2, textAlign: 'center', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <PhotoCameraIcon sx={{ fontSize: 48, color: 'grey.400', mb: 1 }} />
                <Typography variant="h6" gutterBottom>
                  Imagen Principal
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Seleccione la imagen principal de la propiedad
                </Typography>
              </Box>
            )}
            <CardActions sx={{ justifyContent: 'center', p: 2 }}>
              {imagesLoading ? (
                <Skeleton variant="rectangular" width={100} height={36} />
              ) : !(mainImage || mainImagePreview) ? (
                <Button
                  variant="outlined"
                  component="label"
                  disabled={loading}
                  startIcon={<PhotoCameraIcon />}
                >
                  Seleccionar
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleMainImageChange}
                  />
                </Button>
              ) : (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="outlined"
                    component="label"
                    disabled={loading}
                    size="small"
                  >
                    Cambiar
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={handleMainImageChange}
                    />
                  </Button>
                  <IconButton
                    color="error"
                    onClick={handleRemoveMainImage}
                    disabled={loading}
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              )}
            </CardActions>
          </Card>
        </Grid>

        {/* Imágenes secundarias */}
        <Grid item xs={12} md={6}>
          <Card sx={{ minHeight: 280, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ p: 2, textAlign: 'center', flexGrow: 1 }}>
              <PhotoCameraIcon sx={{ fontSize: 48, color: 'grey.400', mb: 1 }} />
              <Typography variant="h6" gutterBottom>
                Imágenes Secundarias
              </Typography>
              
              {imagesLoading ? (
                <Box>
                  <Skeleton variant="rectangular" width={120} height={24} sx={{ mx: 'auto', mb: 1 }} />
                  <Skeleton variant="text" width={100} height={20} sx={{ mx: 'auto' }} />
                </Box>
              ) : secondaryImagesPreview.length > 0 ? (
                <Box>
                  <Chip
                    label={`${secondaryImagesPreview.length} imagen(es)`}
                    color="info"
                    variant="outlined"
                    sx={{ mb: 1 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    Máximo 10 imágenes
                  </Typography>
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Seleccione hasta 10 imágenes adicionales
                </Typography>
              )}
            </Box>
            <CardActions sx={{ justifyContent: 'center', p: 2 }}>
              {imagesLoading ? (
                <Skeleton variant="rectangular" width={120} height={36} />
              ) : (
                <>
                  <Button
                    variant="outlined"
                    component="label"
                    disabled={loading || secondaryImagesPreview.length >= 10}
                    startIcon={<PhotoCameraIcon />}
                  >
                    {secondaryImagesPreview.length === 0 ? 'Seleccionar' : 'Agregar más'}
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      hidden
                      onChange={handleSecondaryImagesChange}
                    />
                  </Button>
                  {secondaryImagesPreview.length > 0 && (
                    <Button
                      variant="text"
                      color="error"
                      onClick={() => {
                        // Solo revocar URLs de archivos File (blob:)
                        secondaryImagesPreview.forEach(preview => {
                          if (preview && preview.startsWith('blob:')) {
                            URL.revokeObjectURL(preview);
                          }
                        });
                        setSecondaryImages([]);
                        setSecondaryImagesPreview([]);
                      }}
                      disabled={loading}
                      size="small"
                    >
                      Limpiar todo
                    </Button>
                  )}
                </>
              )}
            </CardActions>
          </Card>
        </Grid>
      </Grid>

      {/* Lista de imágenes secundarias con opción de eliminar individual */}
      {!imagesLoading && secondaryImagesPreview.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            Imágenes secundarias ({secondaryImagesPreview.length}/10):
          </Typography>
          <Grid container spacing={2}>
            {secondaryImagesPreview.map((preview, index) => (
              <Grid item key={index} xs={6} sm={4} md={3} lg={2}>
                <Card sx={{ position: 'relative' }}>
                  <Box
                    component="img"
                    src={preview}
                    sx={{
                      width: '100%',
                      height: 120,
                      objectFit: 'cover',
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 4,
                      right: 4,
                      bgcolor: 'rgba(255,255,255,0.9)',
                      borderRadius: '50%',
                      width: 28,
                      height: 28,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleRemoveSecondaryImage(index)}
                      disabled={loading}
                      sx={{ 
                        width: 24, 
                        height: 24,
                        '&:hover': {
                          bgcolor: 'rgba(255,0,0,0.1)'
                        }
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  <Box sx={{ p: 1 }}>
                    <Typography 
                      variant="caption" 
                      color="text.secondary"
                      sx={{ 
                        display: 'block',
                        textAlign: 'center'
                      }}
                    >
                      Imagen {index + 1}
                    </Typography>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Skeleton para lista de imágenes secundarias */}
      {imagesLoading && secondaryImagesPreview.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Skeleton variant="text" width="40%" height={20} sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            {[1, 2, 3].map((item) => (
              <Grid item key={item} xs={6} sm={4} md={3} lg={2}>
                <Skeleton variant="rectangular" height={140} />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Botones - solo mostrar si no es modo tabs (showButtons = false) */}
      {!showButtons && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Button
              variant="outlined"
              onClick={onPrevious}
              disabled={loading || imagesLoading}
            >
              Anterior
            </Button>
            
            <Typography variant="body2" color="text.secondary">
              {imagesLoading 
                ? 'Cargando imágenes...'
                : getTotalImages() === 0 
                  ? 'Agregue al menos una imagen para continuar'
                  : `${getTotalImages()} imagen(es) lista(s) para enviar`
              }
            </Typography>
          </Box>
          
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading || imagesLoading || getTotalImages() === 0}
            sx={{
              bgcolor: '#25D366',
              '&:hover': { bgcolor: '#128C7E' },
            }}
          >
            {loading ? 'Guardando...' : buttonText}
          </Button>
        </Box>
      )}

      {/* Botón para modo tabs (showButtons = true) */}
      {showButtons && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading || imagesLoading}
            sx={{
              bgcolor: '#25D366',
              '&:hover': { bgcolor: '#128C7E' },
            }}
          >
            {loading ? 'Guardando...' : imagesLoading ? 'Cargando...' : buttonText}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default Step3Images; 