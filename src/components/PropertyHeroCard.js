import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Card,
  Typography,
  Grid,
  Modal,
  Fade,
  Backdrop,
  IconButton,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { useMainVideo } from "../hooks/useMainVideo";

export const PropertyHeroCard = ({
  mainImage,
  secondaryImages = [],
  propertyName,
  onImageClick,
  showVideo = false,
}) => {
  const { videoUrl, loading: videoLoading, error: videoError } = useMainVideo();
  const [expandedVideo, setExpandedVideo] = useState(false);
  const videoRef = useRef(null);

  // Manejar reproducción automática del video
  useEffect(() => {
    const video = videoRef.current;
    if (video && videoUrl && showVideo) {
      const handleEnded = () => {
        video.pause();
        video.removeAttribute("autoplay");
      };
      video.addEventListener("ended", handleEnded);
      return () => video.removeEventListener("ended", handleEnded);
    }
  }, [videoUrl, showVideo]);

  const handleVideoClick = () => {
    setExpandedVideo(true);
  };

  const handleCloseVideo = () => {
    setExpandedVideo(false);
  };

  if (!mainImage) {
    return null;
  }

  // Función para calcular layout de imágenes secundarias
  const calculateSecondaryImageLayout = () => {
    const isTabletPlus = window.innerWidth >= 576;
    const totalImages = secondaryImages.length;

    if (totalImages === 0) return { count: 0, height: 0, gap: 0 };

    const totalHeight = 400; // Altura fija para tablet+
    const padding = isTabletPlus ? 8 : 4;
    const availableHeight = totalHeight - padding * 2;

    let imageHeight, gap, maxVisible;

    if (isTabletPlus) {
      // Tablet+: Optimizar para el espacio disponible
      if (totalImages <= 4) {
        maxVisible = totalImages;
        const minGap = 6;
        const totalGapSpace = minGap * (maxVisible - 1);
        imageHeight = Math.floor(
          (availableHeight - totalGapSpace) / maxVisible
        );

        const remainingSpace =
          availableHeight - (imageHeight * maxVisible + totalGapSpace);
        gap = minGap + Math.floor(remainingSpace / Math.max(1, maxVisible - 1));
      } else {
        const baseHeight = 85;
        const baseGap = 6;
        maxVisible = Math.floor(availableHeight / (baseHeight + baseGap));
        maxVisible = Math.max(2, Math.min(maxVisible, totalImages));

        const totalGapSpace = baseGap * (maxVisible - 1);
        imageHeight = Math.floor(
          (availableHeight - totalGapSpace) / maxVisible
        );

        const remainingSpace =
          availableHeight - (imageHeight * maxVisible + totalGapSpace);
        gap =
          baseGap + Math.floor(remainingSpace / Math.max(1, maxVisible - 1));
      }
    } else {
      // Mobile: Usar el espacio de la imagen principal
      const mobileHeight = 250;
      const mobileAvailableHeight = mobileHeight - padding * 2;

      if (totalImages <= 3) {
        maxVisible = totalImages;
        const minGap = 3;
        const totalGapSpace = minGap * (maxVisible - 1);
        imageHeight = Math.floor(
          (mobileAvailableHeight - totalGapSpace) / maxVisible
        );
        imageHeight = Math.max(50, Math.min(imageHeight, 120));
        gap = minGap;
      } else {
        imageHeight = 60;
        gap = 3;
        maxVisible = Math.floor(mobileAvailableHeight / (imageHeight + gap));
        maxVisible = Math.max(2, Math.min(maxVisible, totalImages));
      }
    }

    return {
      count: Math.min(maxVisible, totalImages),
      height: Math.max(imageHeight, 50),
      gap: Math.max(gap, 2),
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
        <Box
          sx={{
            height: { xs: "250px", sm: "400px" },
            minHeight: "200px",
          }}
        >
          {/* Mobile: Solo imagen principal */}
          <Box
            sx={{
              display: { xs: "block", sm: "none" },
              position: "relative",
              width: "100%",
              height: "100%",
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

          {/* Tablet+: Grid simétrico 8:4 con subdivisión 6:2 */}
          <Grid
            container
            spacing={1}
            sx={{ height: "100%", display: { xs: "none", sm: "flex" } }}
          >
            {/* Bloque principal (8/12) - Imagen principal + Video */}
            <Grid item xs={secondaryImages.length > 0 ? 8 : 12}>
              <Grid container spacing={1} sx={{ height: "100%" }}>
                {/* Imagen principal (6/8 del bloque principal) */}
                <Grid item xs={showVideo && videoUrl && !videoError ? 9 : 12}>
                  <Box
                    sx={{
                      position: "relative",
                      width: "100%",
                      height: "100%",
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
                        p: 3,
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

                {/* Video (3/12 del bloque principal = 2/8) */}
                {showVideo && videoUrl && !videoError && (
                  <Grid item xs={3}>
                    <Box
                      sx={{
                        height: "100%",
                        position: "relative",
                        cursor: "pointer",
                        backgroundColor: "#000",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 1,
                        overflow: "hidden",
                      }}
                      onClick={handleVideoClick}
                    >
                      {videoLoading ? (
                        <CircularProgress sx={{ color: "white" }} />
                      ) : (
                        <>
                          <Box
                            component="video"
                            ref={videoRef}
                            autoPlay
                            muted
                            playsInline
                            sx={{
                              height: "100%",
                              width: "100%",
                              objectFit: "contain",
                            }}
                          >
                            <source src={videoUrl} type="video/mp4" />
                          </Box>
                          <Box
                            sx={{
                              position: "absolute",
                              top: "50%",
                              left: "50%",
                              transform: "translate(-50%, -50%)",
                              bgcolor: "rgba(0, 0, 0, 0.6)",
                              borderRadius: "50%",
                              p: 1,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              opacity: 0,
                              transition: "opacity 0.3s ease",
                              "&:hover": {
                                opacity: 1,
                              },
                            }}
                          >
                            <PlayArrowIcon
                              sx={{ color: "white", fontSize: "1.5rem" }}
                            />
                          </Box>
                        </>
                      )}
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Grid>

            {/* Imágenes secundarias (4/12) */}
            {secondaryImages.length > 0 && (
              <Grid item xs={4}>
                <Box
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent:
                      imageLayout.count <= 3 ? "center" : "flex-start",
                    gap: `${imageLayout.gap}px`,
                    p: 0.5,
                    overflowY: "auto",
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
                {videoUrl && (
                  <Box
                    component="video"
                    controls
                    autoPlay
                    sx={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                    }}
                  >
                    <source src={videoUrl} type="video/mp4" />
                    Tu navegador no soporta el elemento video.
                  </Box>
                )}
              </Box>
            </Box>
          </Fade>
        </Modal>
      )}
    </>
  );
};
