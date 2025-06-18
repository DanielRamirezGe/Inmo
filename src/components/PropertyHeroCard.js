import React, { useState } from "react";
import {
  Box,
  Card,
  Typography,
  Grid,
  Modal,
  Fade,
  Backdrop,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { usePropertyVideo } from "../hooks/usePropertyVideo";
import VideoPlayer from "./VideoPlayer";

export const PropertyHeroCard = ({
  prototypeId,
  mainImage,
  secondaryImages = [],
  propertyName,
  onImageClick,
  showVideo = false,
}) => {
  const {
    videoUrl,
    loading: videoLoading,
    error: videoError,
  } = usePropertyVideo(showVideo ? prototypeId : null);
  const [expandedVideo, setExpandedVideo] = useState(false);

  const handleVideoClick = () => {
    setExpandedVideo(true);
  };

  const handleCloseVideo = () => {
    setExpandedVideo(false);
  };

  if (!mainImage) {
    return null;
  }

  // Función simplificada para calcular layout de imágenes secundarias
  const calculateSecondaryImageLayout = () => {
    const totalImages = secondaryImages.length;
    if (totalImages === 0) return { count: 0, height: 0, gap: 0 };

    // Configuración simplificada basada en altura disponible
    const containerHeight = 384; // Altura disponible (400px - padding)
    const imageHeight = 90;
    const gap = 8;
    const maxPossibleImages = Math.floor(
      (containerHeight + gap) / (imageHeight + gap)
    );
    const maxVisible = Math.min(maxPossibleImages, totalImages, 4);

    return {
      count: maxVisible,
      height: imageHeight,
      gap: gap,
    };
  };

  const imageLayout = calculateSecondaryImageLayout();

  return (
    <>
      <Card
        sx={{
          mb: { xs: 2, sm: 0 },
          borderRadius: 2,
          overflow: "hidden",
          boxShadow: 2,
          border: "1px solid",
          borderColor: "primary.light",
          position: "relative",
        }}
      >
        {/* Contenedor principal con altura fija */}
        <Box
          sx={{
            height: { xs: "250px", sm: "400px" },
            position: "relative",
            overflow: "hidden",
            p: 1, // Padding uniforme para todas las pantallas
          }}
        >
          {/* Mobile: Solo imagen principal */}
          <Box
            sx={{
              display: { xs: "block", sm: "none" },
              position: "relative",
              width: "100%",
              height: "100%",
              borderRadius: 1,
              overflow: "hidden",
              cursor: "pointer",
              "&:hover": {
                "& .image": {
                  transform: "scale(1.05)",
                },
                "& .overlay": {
                  opacity: 1,
                },
              },
            }}
            onClick={onImageClick}
          >
            <Box
              className="image"
              component="img"
              src={`/api/image?path=${encodeURIComponent(mainImage)}`}
              alt={`Imagen principal de ${propertyName}`}
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transition: "transform 0.3s ease",
              }}
            />

            {/* Overlay con información */}
            <Box
              className="overlay"
              sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                background: "linear-gradient(transparent, rgba(0,0,0,0.8))",
                color: "white",
                p: 2,
                opacity: 0,
                transition: "opacity 0.3s ease",
              }}
            >
              <Typography variant="body2" sx={{ fontSize: "0.9rem" }}>
                Click para ver todas las imágenes
              </Typography>
            </Box>
          </Box>

          {/* Desktop/Tablet: Grid layout */}
          <Grid
            container
            spacing={1}
            sx={{
              height: "100%",
              display: { xs: "none", sm: "flex" },
              m: 0, // Eliminar margin del Grid
              width: "100%", // Asegurar ancho completo
            }}
          >
            {/* Bloque principal */}
            <Grid
              item
              xs={secondaryImages.length > 0 ? 8 : 12}
              sx={{ p: "4px !important" }} // Override del padding del Grid item
            >
              <Grid
                container
                spacing={1}
                sx={{
                  height: "100%",
                  m: 0,
                  width: "100%",
                }}
              >
                {/* Imagen principal */}
                <Grid
                  item
                  xs={showVideo && videoUrl && !videoError ? 9 : 12}
                  sx={{ p: "4px !important" }}
                >
                  <Box
                    sx={{
                      position: "relative",
                      width: "100%",
                      height: "100%",
                      borderRadius: 1,
                      overflow: "hidden",
                      cursor: "pointer",
                      "&:hover": {
                        "& .image": {
                          transform: "scale(1.05)",
                        },
                        "& .overlay": {
                          opacity: 1,
                        },
                      },
                    }}
                    onClick={onImageClick}
                  >
                    <Box
                      className="image"
                      component="img"
                      src={`/api/image?path=${encodeURIComponent(mainImage)}`}
                      alt={`Imagen principal de ${propertyName}`}
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.3s ease",
                      }}
                    />

                    {/* Overlay con información */}
                    <Box
                      className="overlay"
                      sx={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background:
                          "linear-gradient(transparent, rgba(0,0,0,0.8))",
                        color: "white",
                        p: 2,
                        opacity: 0,
                        transition: "opacity 0.3s ease",
                      }}
                    >
                      <Typography variant="body2" sx={{ fontSize: "0.9rem" }}>
                        Click para ver todas las imágenes
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                {/* Video */}
                {showVideo && (
                  <Grid item xs={3} sx={{ p: "4px !important" }}>
                    <VideoPlayer
                      videoUrl={videoUrl}
                      loading={videoLoading}
                      error={videoError}
                      autoplay={true}
                      muted={true}
                      onClick={handleVideoClick}
                      sx={{
                        height: "100%",
                        borderRadius: 1,
                        overflow: "hidden",
                      }}
                    />
                  </Grid>
                )}
              </Grid>
            </Grid>

            {/* Imágenes secundarias */}
            {secondaryImages.length > 0 && (
              <Grid item xs={4} sx={{ p: "4px !important" }}>
                <Box
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    gap: `${imageLayout.gap}px`,
                    overflow: "hidden",
                  }}
                >
                  {secondaryImages
                    .slice(0, imageLayout.count)
                    .map((image, index) => (
                      <Box
                        key={index}
                        onClick={onImageClick}
                        sx={{
                          position: "relative",
                          height: `${imageLayout.height}px`,
                          borderRadius: 1,
                          overflow: "hidden",
                          cursor: "pointer",
                          flexShrink: 0,
                          "&:hover": {
                            transform: "scale(1.02)",
                            boxShadow: 2,
                          },
                          transition: "all 0.2s ease",
                        }}
                      >
                        <Box
                          component="img"
                          src={`/api/image?path=${encodeURIComponent(image)}`}
                          alt={`${propertyName} - Imagen secundaria ${
                            index + 1
                          }`}
                          sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                        {index === imageLayout.count - 1 &&
                          secondaryImages.length > imageLayout.count && (
                            <Box
                              sx={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backgroundColor: "rgba(0, 0, 0, 0.6)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "white",
                                fontSize: "0.8rem",
                                fontWeight: 600,
                              }}
                            >
                              +{secondaryImages.length - imageLayout.count}
                            </Box>
                          )}
                      </Box>
                    ))}
                </Box>
              </Grid>
            )}
          </Grid>
        </Box>
      </Card>

      {/* Modal para video expandido */}
      {showVideo && (
        <Modal
          open={expandedVideo}
          onClose={handleCloseVideo}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
            sx: { backgroundColor: "rgba(0, 0, 0, 0.9)" },
          }}
        >
          <Fade in={expandedVideo}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "90vw",
                height: "90vh",
                bgcolor: "black",
                borderRadius: 2,
                boxShadow: 24,
                outline: "none",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  p: 2,
                  borderBottom: "1px solid #333",
                }}
              >
                <Typography variant="h6" sx={{ color: "white" }}>
                  {propertyName} - Video
                </Typography>
                <IconButton onClick={handleCloseVideo} sx={{ color: "white" }}>
                  <CloseIcon />
                </IconButton>
              </Box>
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  p: 2,
                }}
              >
                <VideoPlayer
                  videoUrl={videoUrl}
                  loading={videoLoading}
                  error={videoError}
                  autoplay={true}
                  muted={false}
                  controls={true}
                  sx={{
                    // Simular dimensiones de celular para videos verticales
                    width: { xs: "100%", sm: "390px" }, // Ancho típico de iPhone/Android
                    height: { xs: "auto", sm: "844px" }, // Altura típica de celular moderno
                    maxWidth: { xs: "100%", sm: "390px" },
                    maxHeight: { xs: "auto", sm: "844px" },
                    // Centrar el video horizontalmente
                    margin: "0 auto",
                    display: "block",
                  }}
                />
              </Box>
            </Box>
          </Fade>
        </Modal>
      )}
    </>
  );
};
