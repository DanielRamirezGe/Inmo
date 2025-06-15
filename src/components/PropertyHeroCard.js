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
import { VolumeOff, VolumeUp } from "@mui/icons-material";
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
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasTriedAutoplay, setHasTriedAutoplay] = useState(false);
  const videoRef = useRef(null);

  // Verificar si el usuario ya experimentó autoplay
  const hasUserExperiencedAutoplay = () => {
    try {
      return localStorage.getItem("video-autoplay-experienced") === "true";
    } catch (error) {
      return false;
    }
  };

  // Marcar que el usuario ya experimentó autoplay
  const markUserExperiencedAutoplay = () => {
    try {
      localStorage.setItem("video-autoplay-experienced", "true");
    } catch (error) {
      console.log("Could not save to localStorage:", error);
    }
  };

  // Manejar reproducción automática del video
  useEffect(() => {
    const video = videoRef.current;
    if (video && videoUrl && showVideo) {
      const handleEnded = () => {
        video.pause();
        video.removeAttribute("autoplay");
        setIsPlaying(false);
      };
      const handleLoadedData = () => {
        video.volume = 0.7;
        // Asegurar que el video esté silenciado para autoplay
        video.muted = true;
      };

      video.addEventListener("ended", handleEnded);
      video.addEventListener("loadeddata", handleLoadedData);

      if (video.readyState >= 2) {
        handleLoadedData();
      }

      return () => {
        video.removeEventListener("ended", handleEnded);
        video.removeEventListener("loadeddata", handleLoadedData);
      };
    }
  }, [videoUrl, showVideo, isMuted]);

  // Intentar autoplay con audio, si falla usar silenciado
  useEffect(() => {
    const video = videoRef.current;
    if (video && videoUrl && showVideo && !hasTriedAutoplay) {
      const tryPlayWithAudio = async () => {
        // Marcar que ya intentamos autoplay
        setHasTriedAutoplay(true);

        // Pausar cualquier reproducción previa
        video.pause();
        video.currentTime = 0;

        // Pausar otros videos en la página
        const allVideos = document.querySelectorAll("video");
        allVideos.forEach((v) => {
          if (v !== video && !v.paused) {
            v.pause();
          }
        });

        // Verificar si el usuario ya experimentó autoplay antes
        const userAlreadyExperienced = hasUserExperiencedAutoplay();

        if (!userAlreadyExperienced) {
          // Primera vez: intentar autoplay con audio
          try {
            video.muted = false;
            video.volume = 0.7;
            await video.play();

            // Si funciona, marcar como experimentado y actualizar estados
            markUserExperiencedAutoplay();
            setIsMuted(false);
            setIsPlaying(true);
            console.log("First-time autoplay with audio successful!");
            return;
          } catch (error) {
            console.log(
              "First-time autoplay with audio failed, trying muted:",
              error
            );

            // Si falla con audio, intentar silenciado solo esta vez
            try {
              video.muted = true;
              await video.play();
              setIsPlaying(true);
              markUserExperiencedAutoplay(); // Marcar como experimentado aunque haya sido silenciado
              console.log("First-time autoplay muted successful!");
              return;
            } catch (mutedError) {
              console.log("First-time autoplay completely failed:", mutedError);
              markUserExperiencedAutoplay(); // Marcar como experimentado para evitar futuros intentos
            }
          }
        } else {
          // Usuario ya experimentó autoplay antes - NO reproducir automáticamente
          console.log(
            "User already experienced autoplay before, waiting for user interaction"
          );
          // Asegurar que el video esté pausado y listo para interacción manual
          video.pause();
          video.currentTime = 0;
          setIsPlaying(false);
        }
      };

      // Intentar reproducir después de un pequeño delay
      const timer = setTimeout(tryPlayWithAudio, 100);
      return () => clearTimeout(timer);
    }
  }, [videoUrl, showVideo, hasTriedAutoplay]);

  const handleVideoClick = () => {
    // Pausar el video original antes de abrir el modal
    const video = videoRef.current;
    if (video && !video.paused) {
      video.pause();
    }
    setExpandedVideo(true);
  };

  const handleCloseVideo = () => {
    setExpandedVideo(false);
    // Resetear el estado del video original cuando se cierra el modal
    setIsPlaying(false);
  };

  const handleToggleMute = () => {
    const video = videoRef.current;
    if (video) {
      const newMutedState = !isMuted;
      video.muted = newMutedState;
      setIsMuted(newMutedState);
    }
  };

  const handlePlayVideo = async () => {
    const video = videoRef.current;
    if (video) {
      try {
        // Pausar otros videos
        const allVideos = document.querySelectorAll("video");
        allVideos.forEach((v) => {
          if (v !== video && !v.paused) {
            v.pause();
          }
        });

        // Resetear el video
        video.currentTime = 0;

        // Intentar reproducir con audio primero
        video.muted = false;
        video.volume = 0.7;
        setIsMuted(false);

        await video.play();
        setIsPlaying(true);
        markUserExperiencedAutoplay(); // Marcar como experimentado
        console.log("Manual video play with audio successful!");
      } catch (error) {
        console.log(
          "Manual video play with audio failed, trying muted:",
          error
        );
        try {
          // Si falla con audio, intentar silenciado
          video.muted = true;
          setIsMuted(true);
          await video.play();
          setIsPlaying(true);
          console.log("Manual video play muted successful!");
        } catch (mutedError) {
          console.log("Manual video play completely failed:", mutedError);
        }
      }
    }
  };

  if (!mainImage) {
    return null;
  }

  // Función para calcular layout de imágenes secundarias
  const calculateSecondaryImageLayout = () => {
    const totalImages = secondaryImages.length;

    if (totalImages === 0) return { count: 0, height: 0, gap: 0 };

    // Configuración simple y fija que no depende del tamaño de pantalla
    const imageHeight = 90; // Altura fija para cada imagen
    const gap = 8; // Gap fijo entre imágenes
    const maxVisible = Math.min(4, totalImages); // Máximo 4 imágenes visibles

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

                          {/* Botón de play - solo visible cuando está pausado */}
                          {!isPlaying && (
                            <Box
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePlayVideo();
                              }}
                              sx={{
                                position: "absolute",
                                top: 12,
                                left: 12,
                                background:
                                  "linear-gradient(135deg, #F0B92B 0%, #FFD666 100%)",
                                borderRadius: "50%",
                                p: 1,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                boxShadow: "0 3px 12px rgba(240, 185, 43, 0.4)",
                                border: "2px solid rgba(255, 255, 255, 0.9)",
                                zIndex: 10,
                                transition:
                                  "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                "&:hover": {
                                  transform: "scale(1.1)",
                                  boxShadow:
                                    "0 4px 16px rgba(240, 185, 43, 0.6)",
                                },
                              }}
                            >
                              <PlayArrowIcon
                                sx={{
                                  color: "#37474F",
                                  fontSize: "1.5rem",
                                  filter:
                                    "drop-shadow(0 1px 2px rgba(0,0,0,0.1))",
                                  ml: 0.2,
                                }}
                              />
                            </Box>
                          )}

                          {/* Botón de control de audio - solo visible cuando está reproduciéndose */}
                          {isPlaying && (
                            <IconButton
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleMute();
                              }}
                              sx={{
                                position: "absolute",
                                bottom: 6,
                                right: 6,
                                backgroundColor: "rgba(0, 0, 0, 0.7)",
                                color: "white",
                                zIndex: 999,
                                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
                                width: 28,
                                height: 28,
                                "&:hover": {
                                  backgroundColor: "rgba(0, 0, 0, 0.9)",
                                  transform: "scale(1.1)",
                                },
                                transition: "all 0.2s ease-in-out",
                              }}
                            >
                              {isMuted ? (
                                <VolumeOff sx={{ fontSize: 16 }} />
                              ) : (
                                <VolumeUp sx={{ fontSize: 16 }} />
                              )}
                            </IconButton>
                          )}
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
                    justifyContent: "flex-start",
                    gap: `${imageLayout.gap}px`,
                    p: 1,
                    overflowY: "hidden", // Evitar scroll, mantener contenido dentro del contenedor
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
                      // Simular dimensiones de celular para videos verticales
                      width: { xs: "100%", sm: "390px" }, // Ancho típico de iPhone/Android
                      height: { xs: "auto", sm: "844px" }, // Altura típica de celular moderno
                      maxWidth: { xs: "100%", sm: "390px" },
                      maxHeight: { xs: "auto", sm: "844px" },
                      objectFit: "contain",
                      // Centrar el video horizontalmente
                      margin: "0 auto",
                      display: "block",
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
