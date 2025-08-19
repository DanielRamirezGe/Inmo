import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import { useIndividualImageHandling } from "../../../../hooks/useIndividualImageHandling";
import ImageUploadProgress from "../../../../components/ImageUploadProgress";
import { AWS_IMAGE_CONFIG } from "@/config/imageConfig";

const Step3Images = ({
  onSubmit,
  onPrevious,
  loading,
  error,
  initialMainImage = null,
  initialSecondaryImages = [],
  initialSecondaryImagesPreview = [], // URLs blob para mostrar las imágenes
  showButtons = false,
  buttonText = "Finalizar",
  prototypeId = null, // ID de la propiedad para el nuevo sistema
  onClose = null, // Función para cerrar el diálogo
  onRefreshData = null, // Función para recargar datos
}) => {
  // Estados para imágenes nuevas (archivos File)
  const [mainImage, setMainImage] = useState(null);
  const [secondaryImages, setSecondaryImages] = useState([]);

  // Estados para previews de imágenes
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [secondaryImagesPreview, setSecondaryImagesPreview] = useState([]);

  // Estados para el sistema de carga
  const [imagesLoading, setImagesLoading] = useState(false);

  // Estados para el nuevo sistema de imágenes individuales
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [existingImages, setExistingImages] = useState({
    mainImage: null,
    secondaryImages: [],
  });

  // Hook para manejo individual de imágenes
  const {
    loading: imageHandlerLoading,
    error: imageHandlerError,
    uploadProgress,
    uploadImages,
    deleteImage,
    deleteImages,
    setMainImage: setMainImageHandler,
    clearProgress,
    clearError,
  } = useIndividualImageHandling();

  // Cargar imágenes iniciales cuando el componente se monta
  useEffect(() => {
    if (
      initialMainImage ||
      (initialSecondaryImages && initialSecondaryImages.length > 0)
    ) {
      setImagesLoading(true);

      const loadImages = async () => {
        try {
          // Cargar imagen principal
          if (initialMainImage) {
            if (typeof initialMainImage === "string") {
              setMainImagePreview(initialMainImage);
              setExistingImages((prev) => ({
                ...prev,
                mainImage: { url: initialMainImage, id: "main" },
              }));
            } else if (
              initialMainImage &&
              typeof initialMainImage === "object"
            ) {
              // Si es un objeto, puede tener pathImage e id
              const imagePath =
                initialMainImage.pathImage ||
                initialMainImage.path ||
                initialMainImage.imagePath;
              const imageId =
                initialMainImage.id ||
                initialMainImage.prototypeImageId ||
                initialMainImage.imageId;

              if (imagePath) {
                setMainImagePreview(imagePath);
                setExistingImages((prev) => ({
                  ...prev,
                  mainImage: {
                    url: imagePath,
                    id: imageId || "main",
                    prototypeImageId: imageId,
                  },
                }));
              }
            } else if (initialMainImage instanceof File) {
              setMainImage(initialMainImage);
              setMainImagePreview(createImagePreview(initialMainImage));
            }
          }

          // Cargar imágenes secundarias
          if (initialSecondaryImages && initialSecondaryImages.length > 0) {
            const fileImages = [];
            const existingSecondaryImages = [];

            initialSecondaryImages.forEach((img, index) => {
              if (typeof img === "string") {
                // Usar preview si está disponible, sino usar la string directamente
                const previewUrl = initialSecondaryImagesPreview[index] || img;
                existingSecondaryImages.push({
                  url: previewUrl,
                  id: `secondary-${index}`,
                });
              } else if (img && typeof img === "object") {
                // Buscar diferentes propiedades que pueden contener la ruta de la imagen
                const imagePath = img.pathImage || img.path || img.imagePath;
                const imageId = img.prototypeImageId || img.id || img.imageId;

                if (imagePath) {
                  // Usar preview si está disponible, sino usar la ruta original
                  const previewUrl =
                    initialSecondaryImagesPreview[index] || imagePath;
                  const imageObject = {
                    url: previewUrl,
                    id: imageId || `secondary-${index}`,
                    prototypeImageId: imageId,
                  };
                  existingSecondaryImages.push(imageObject);
                }
              } else if (img instanceof File) {
                fileImages.push(img);
              }
            });

            setSecondaryImages(fileImages);
            setExistingImages((prev) => ({
              ...prev,
              secondaryImages: existingSecondaryImages,
            }));

            // Para las previews, usar las previews disponibles + previews de archivos File
            const filePreviews = fileImages.map(createImagePreview);
            setSecondaryImagesPreview([
              ...initialSecondaryImagesPreview,
              ...filePreviews,
            ]);
          }

          await new Promise((resolve) => setTimeout(resolve, 800));
        } finally {
          setImagesLoading(false);
        }
      };

      loadImages();
    }
  }, [initialMainImage, initialSecondaryImages, initialSecondaryImagesPreview]);

  const createImagePreview = (file) => {
    if (file && file instanceof File) {
      return URL.createObjectURL(file);
    }
    return null;
  };

  const handleMainImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
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
      setSecondaryImages((prev) => [...prev, ...files]);

      const previews = files.map(createImagePreview);
      setSecondaryImagesPreview((prev) => [...prev, ...previews]);
    }
  };

  const handleRemoveMainImage = async () => {
    if (showButtons && existingImages.mainImage && prototypeId) {
      // Modo edición: marcar para eliminar
      const mainImageId =
        existingImages.mainImage.id ||
        existingImages.mainImage.prototypeImageId;

      if (mainImageId) {
        setImagesToDelete((prev) => [
          ...prev,
          {
            id: prototypeId, // Para imagen principal, usar prototypeId
            isMainImage: true,
          },
        ]);
      }
    }

    // Limpiar preview y archivo
    if (mainImagePreview && mainImage) {
      URL.revokeObjectURL(mainImagePreview);
    }
    setMainImage(null);
    setMainImagePreview(null);
    setExistingImages((prev) => ({ ...prev, mainImage: null }));
  };

  const handleRemoveSecondaryImage = async (index) => {
    const preview = secondaryImagesPreview[index];

    // Determinar si es una imagen existente o nueva
    const existingImagesCount = existingImages.secondaryImages.length;

    if (index < existingImagesCount) {
      // Es una imagen existente, marcar para eliminar
      const imageToDelete = existingImages.secondaryImages[index];

      if (showButtons && prototypeId && imageToDelete.prototypeImageId) {
        setImagesToDelete((prev) => [
          ...prev,
          {
            id: imageToDelete.prototypeImageId,
            isMainImage: false,
          },
        ]);
      }

      // Remover de existingImages
      setExistingImages((prev) => ({
        ...prev,
        secondaryImages: prev.secondaryImages.filter((_, i) => i !== index),
      }));
    } else {
      // Es una imagen nueva (archivo File)
      const fileIndex = index - existingImagesCount;

      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }

      setSecondaryImages((prev) => prev.filter((_, i) => i !== fileIndex));
    }

    setSecondaryImagesPreview((prev) => prev.filter((_, i) => i !== index));
  };

  // Función para establecer una imagen secundaria como principal
  const handleSetAsMainImage = async (index) => {
    if (!prototypeId || !showButtons) return;

    const existingImagesCount = existingImages.secondaryImages.length;

    if (index >= existingImagesCount) {
      // No se puede establecer como principal una imagen nueva (archivo File)
      alert(
        "Solo se pueden establecer como principales las imágenes ya guardadas en el sistema"
      );
      return;
    }

    const imageToPromote = existingImages.secondaryImages[index];

    if (!imageToPromote.prototypeImageId) {
      alert("Error: No se pudo identificar la imagen");
      return;
    }

    try {
      // Confirmar la acción
      if (
        !confirm(
          `¿Está seguro de que desea establecer esta imagen como principal?\n\nLa imagen principal actual pasará a ser secundaria.`
        )
      ) {
        return;
      }

      const result = await setMainImageHandler(
        prototypeId,
        imageToPromote.prototypeImageId
      );

      if (result.success) {
        // Intercambiar las imágenes en el estado local
        const currentMainImage = existingImages.mainImage;
        const newMainImage = imageToPromote;

        // Crear nueva lista de imágenes secundarias
        const newSecondaryImages = [
          ...existingImages.secondaryImages.filter((_, i) => i !== index),
        ];

        // Si había una imagen principal, agregarla como secundaria
        if (currentMainImage) {
          newSecondaryImages.push({
            ...currentMainImage,
            id: `secondary-${Date.now()}`,
            prototypeImageId:
              currentMainImage.prototypeImageId || currentMainImage.id,
          });
        }

        // Actualizar el estado
        setExistingImages((prev) => ({
          mainImage: {
            ...newMainImage,
            id: "main",
          },
          secondaryImages: newSecondaryImages,
        }));

        // Actualizar previews
        setMainImagePreview(newMainImage.url);

        // Limpiar previews de archivos File si existen
        if (mainImagePreview && mainImage) {
          URL.revokeObjectURL(mainImagePreview);
        }
        setMainImage(null);
        setMainImagePreview(newMainImage.url);

        // Mostrar mensaje de éxito
        alert("✅ Imagen establecida como principal exitosamente");

        // Cerrar el diálogo si está disponible
        if (onClose) {
          onClose();
        }

        // Recargar datos si está disponible
        if (onRefreshData) {
          onRefreshData("Imagen principal actualizada exitosamente");
        }
      } else {
        throw new Error(
          result.error || "Error al establecer la imagen como principal"
        );
      }
    } catch (error) {
      console.error("Error estableciendo imagen como principal:", error);
      alert(`Error: ${error.message}`);
    }
  };

  const handleSubmit = async () => {
    // Validar que hay imágenes para procesar
    const hasImages = mainImage || secondaryImages.length > 0;
    const hasExistingOperations = imagesToDelete.length > 0;

    if (!hasImages && !hasExistingOperations) {
      alert("Debe agregar al menos una imagen (principal o secundaria)");
      return;
    }

    // Modo creación: usar el nuevo sistema individual si tenemos prototypeId
    if (!showButtons) {
      if (prototypeId && hasImages) {
        // Usar el nuevo sistema individual para creación también
        try {
          const result = await uploadImages(
            prototypeId,
            mainImage,
            secondaryImages
          );

          if (result.success) {
            // Limpiar imágenes después de subir
            setMainImage(null);
            setSecondaryImages([]);

            // Limpiar previews
            if (mainImagePreview && mainImage) {
              URL.revokeObjectURL(mainImagePreview);
              setMainImagePreview(null);
            }

            secondaryImagesPreview.forEach((preview) => {
              if (preview && preview.startsWith("blob:")) {
                URL.revokeObjectURL(preview);
              }
            });
            setSecondaryImagesPreview([]);

            onSubmit(null, []);
          } else {
            throw new Error(result.error || "Error al subir imágenes");
          }
        } catch (error) {
          console.error("Error al procesar las imágenes:", error);
          alert(
            "Error al procesar las imágenes. Por favor, inténtelo de nuevo."
          );
        }
      } else {
        // Fallback al sistema original si no hay prototypeId
        onSubmit(mainImage, secondaryImages);
      }
      return;
    }

    // Modo edición: usar nuevo sistema individual directamente
    if (!prototypeId) {
      alert("Error: No se encontró el ID de la propiedad");
      return;
    }

    try {
      let hasOperations = false;

      // Paso 1: Eliminar imágenes marcadas para eliminación
      if (imagesToDelete.length > 0) {
        hasOperations = true;

        for (const imageToDelete of imagesToDelete) {
          const result = await deleteImage(
            imageToDelete.id,
            imageToDelete.isMainImage
          );

          if (!result.success) {
            console.error("Error eliminando imagen:", result.error);
          }
        }

        // Limpiar lista de imágenes a eliminar
        setImagesToDelete([]);
      }

      // Paso 2: Subir nuevas imágenes
      const hasNewImages = mainImage || secondaryImages.length > 0;
      if (hasNewImages) {
        hasOperations = true;

        const result = await uploadImages(
          prototypeId,
          mainImage,
          secondaryImages
        );

        if (result.success) {
          // Limpiar imágenes nuevas después de subir
          setMainImage(null);
          setSecondaryImages([]);

          // Limpiar previews de archivos File
          if (mainImagePreview && mainImage) {
            URL.revokeObjectURL(mainImagePreview);
            setMainImagePreview(null);
          }

          secondaryImagesPreview.forEach((preview) => {
            if (preview && preview.startsWith("blob:")) {
              URL.revokeObjectURL(preview);
            }
          });
          setSecondaryImagesPreview([]);

          onSubmit(null, [], imagesToDelete);
        } else {
          throw new Error(result.error || "Error al subir imágenes");
        }
      } else if (!hasOperations) {
        // No hay operaciones que realizar
        onSubmit(null, [], []);
      } else {
        // Solo se eliminaron imágenes
        onSubmit(null, [], imagesToDelete);
      }
    } catch (error) {
      console.error("Error al procesar las imágenes:", error);
      alert("Error al procesar las imágenes. Por favor, inténtelo de nuevo.");
    }
  };

  const getTotalImages = () => {
    const newImages = (mainImage ? 1 : 0) + secondaryImages.length;
    const existingImagesCount =
      (existingImages.mainImage ? 1 : 0) +
      existingImages.secondaryImages.length;
    return newImages + existingImagesCount;
  };

  const isProcessing =
    loading || imageHandlerLoading || uploadProgress.isUploading;

  return (
    <Box>
      {!showButtons && (
        <Typography variant="h6" sx={{ mb: 2 }}>
          Imágenes de la Propiedad
        </Typography>
      )}

      {(error || imageHandlerError) && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || imageHandlerError}
        </Alert>
      )}

      {/* Indicador de progreso para subida/eliminación de imágenes */}
      <ImageUploadProgress
        uploadProgress={uploadProgress}
        isVisible={uploadProgress.isUploading}
        operation={
          imagesToDelete.length > 0 && (mainImage || secondaryImages.length > 0)
            ? "mixed"
            : imagesToDelete.length > 0
            ? "delete"
            : "upload"
        }
      />

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {showButtons
          ? "Gestione las imágenes de la propiedad. Puede tener una imagen principal y múltiples imágenes secundarias. 💡 Use el botón 'Elegir Principal' para establecer una imagen secundaria como principal."
          : "Agregue una imagen principal y múltiples imágenes secundarias para mostrar la propiedad."}
      </Typography>

      {/* Indicador de carga para imágenes iniciales */}
      {imagesLoading && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            py: 4,
            mb: 3,
          }}
        >
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
          <Card
            sx={{ minHeight: 280, display: "flex", flexDirection: "column" }}
          >
            {imagesLoading ? (
              <Box sx={{ p: 2, textAlign: "center", flexGrow: 1 }}>
                <Skeleton
                  variant="rectangular"
                  width={120}
                  height={24}
                  sx={{ mx: "auto", mb: 1 }}
                />
                <Skeleton
                  variant="text"
                  width={80}
                  height={20}
                  sx={{ mx: "auto" }}
                />
              </Box>
            ) : mainImage || mainImagePreview || existingImages.mainImage ? (
              <>
                <Box
                  sx={{ height: 200, position: "relative", overflow: "hidden" }}
                >
                  <Box
                    component="img"
                    src={
                      mainImagePreview ||
                      AWS_IMAGE_CONFIG.getImageUrl(
                        existingImages.mainImage?.url
                      )
                    }
                    sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      bgcolor: "rgba(0,0,0,0.8)",
                      borderRadius: 1,
                      px: 1,
                      py: 0.5,
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      border: "1px solid #FFD700",
                    }}
                  >
                    <Typography
                      variant="caption"
                      color="#FFD700"
                      fontWeight="bold"
                    >
                      ⭐ PRINCIPAL
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
              <Box
                sx={{
                  p: 2,
                  textAlign: "center",
                  flexGrow: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <PhotoCameraIcon
                  sx={{ fontSize: 48, color: "grey.400", mb: 1 }}
                />
                <Typography variant="h6" gutterBottom>
                  Imagen Principal
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Seleccione la imagen principal de la propiedad
                </Typography>
              </Box>
            )}
            <CardActions sx={{ justifyContent: "center", p: 2 }}>
              {imagesLoading ? (
                <Skeleton variant="rectangular" width={100} height={36} />
              ) : !(
                  mainImage ||
                  mainImagePreview ||
                  existingImages.mainImage
                ) ? (
                <Button
                  variant="outlined"
                  component="label"
                  disabled={isProcessing}
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
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button
                    variant="outlined"
                    component="label"
                    disabled={isProcessing}
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
                    disabled={isProcessing}
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
          <Card
            sx={{ minHeight: 280, display: "flex", flexDirection: "column" }}
          >
            <Box sx={{ p: 2, textAlign: "center", flexGrow: 1 }}>
              <PhotoCameraIcon
                sx={{ fontSize: 48, color: "grey.400", mb: 1 }}
              />
              <Typography variant="h6" gutterBottom>
                Imágenes Secundarias
              </Typography>

              {imagesLoading ? (
                <Box>
                  <Skeleton
                    variant="rectangular"
                    width={120}
                    height={24}
                    sx={{ mx: "auto", mb: 1 }}
                  />
                  <Skeleton
                    variant="text"
                    width={100}
                    height={20}
                    sx={{ mx: "auto" }}
                  />
                </Box>
              ) : secondaryImagesPreview.length > 0 ||
                existingImages.secondaryImages.length > 0 ? (
                <Box>
                  <Chip
                    label={`${
                      secondaryImagesPreview.length +
                      existingImages.secondaryImages.length
                    } imagen(es)`}
                    color="info"
                    variant="outlined"
                    sx={{ mb: 1 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    Imágenes secundarias
                  </Typography>
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Seleccione imágenes adicionales
                </Typography>
              )}
            </Box>
            <CardActions sx={{ justifyContent: "center", p: 2 }}>
              {imagesLoading ? (
                <Skeleton variant="rectangular" width={120} height={36} />
              ) : (
                <>
                  <Button
                    variant="outlined"
                    component="label"
                    disabled={isProcessing}
                    startIcon={<PhotoCameraIcon />}
                  >
                    {secondaryImagesPreview.length === 0 &&
                    existingImages.secondaryImages.length === 0
                      ? "Seleccionar"
                      : "Agregar más"}
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      hidden
                      onChange={handleSecondaryImagesChange}
                    />
                  </Button>
                  {(secondaryImagesPreview.length > 0 ||
                    existingImages.secondaryImages.length > 0) && (
                    <Button
                      variant="text"
                      color="error"
                      onClick={() => {
                        secondaryImagesPreview.forEach((preview) => {
                          if (preview && preview.startsWith("blob:")) {
                            URL.revokeObjectURL(preview);
                          }
                        });
                        setSecondaryImages([]);
                        setSecondaryImagesPreview([]);
                        setExistingImages((prev) => ({
                          ...prev,
                          secondaryImages: [],
                        }));
                      }}
                      disabled={isProcessing}
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

      {/* Lista de imágenes secundarias */}
      {!imagesLoading &&
        (secondaryImagesPreview.length > 0 ||
          existingImages.secondaryImages.length > 0) && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 2 }}>
              Imágenes secundarias (
              {secondaryImagesPreview.length +
                existingImages.secondaryImages.length}
              ):
            </Typography>
            <Grid container spacing={1}>
              {/* Mostrar imágenes existentes primero */}
              {existingImages.secondaryImages.map((img, index) => (
                <Grid
                  item
                  key={`existing-${index}`}
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                >
                  <Card sx={{ position: "relative" }}>
                    <Box
                      component="img"
                      src={AWS_IMAGE_CONFIG.getImageUrl(img.url)}
                      sx={{ width: "100%", height: 180, objectFit: "cover" }}
                    />

                    <Box sx={{ p: 2 }}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          display: "block",
                          textAlign: "center",
                          mb: 2,
                          fontWeight: "medium",
                        }}
                      >
                        Imagen {index + 1} (existente)
                      </Typography>

                      {/* Botones de acción */}
                      <Box
                        sx={{
                          display: "flex",
                          gap: 1.5,
                          justifyContent: "center",
                        }}
                      >
                        <Button
                          size="small"
                          variant="outlined"
                          color="primary"
                          onClick={() => handleSetAsMainImage(index)}
                          disabled={isProcessing}
                          sx={{
                            fontSize: "12px",
                            py: 0.75,
                            px: 1.5,
                            minWidth: "auto",
                          }}
                        >
                          Elegir Principal
                        </Button>

                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          onClick={() => handleRemoveSecondaryImage(index)}
                          disabled={isProcessing}
                          sx={{
                            fontSize: "12px",
                            py: 0.75,
                            px: 1.5,
                            minWidth: "auto",
                          }}
                        >
                          Eliminar
                        </Button>
                      </Box>
                    </Box>
                  </Card>
                </Grid>
              ))}

              {/* Mostrar imágenes nuevas */}
              {secondaryImagesPreview
                .slice(existingImages.secondaryImages.length)
                .map((preview, index) => (
                  <Grid item key={`new-${index}`} xs={12} sm={6} md={4} lg={3}>
                    <Card sx={{ position: "relative" }}>
                      <Box
                        component="img"
                        src={preview}
                        sx={{ width: "100%", height: 180, objectFit: "cover" }}
                      />
                      <Box
                        sx={{
                          position: "absolute",
                          top: 4,
                          right: 4,
                          bgcolor: "rgba(255,255,255,0.9)",
                          borderRadius: "50%",
                          width: 28,
                          height: 28,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() =>
                            handleRemoveSecondaryImage(
                              existingImages.secondaryImages.length + index
                            )
                          }
                          disabled={isProcessing}
                          sx={{
                            width: 24,
                            height: 24,
                            "&:hover": { bgcolor: "rgba(255,0,0,0.1)" },
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                      <Box sx={{ p: 2 }}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            display: "block",
                            textAlign: "center",
                            fontWeight: "medium",
                          }}
                        >
                          Imagen{" "}
                          {existingImages.secondaryImages.length + index + 1}{" "}
                          (nueva)
                        </Typography>
                      </Box>
                    </Card>
                  </Grid>
                ))}
            </Grid>
          </Box>
        )}

      {/* Botones - modo creación */}
      {!showButtons && (
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Button
              variant="outlined"
              onClick={onPrevious}
              disabled={isProcessing}
            >
              Anterior
            </Button>
            <Typography variant="body2" color="text.secondary">
              {imagesLoading
                ? "Cargando imágenes..."
                : getTotalImages() === 0
                ? "Agregue al menos una imagen para continuar"
                : `${getTotalImages()} imagen(es) lista(s) para enviar`}
            </Typography>
          </Box>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={isProcessing || getTotalImages() === 0}
            sx={{ bgcolor: "#25D366", "&:hover": { bgcolor: "#128C7E" } }}
          >
            {isProcessing ? "Guardando..." : buttonText}
          </Button>
        </Box>
      )}

      {/* Botón - modo edición */}
      {showButtons && (
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={isProcessing}
            sx={{ bgcolor: "#25D366", "&:hover": { bgcolor: "#128C7E" } }}
          >
            {isProcessing ? "Procesando..." : buttonText}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default Step3Images;
