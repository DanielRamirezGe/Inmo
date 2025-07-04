import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  Typography,
  Grid,
  CircularProgress,
} from "@mui/material";
import { VerticalVideoPlayer } from "./videoStream";

export const PropertyHeroCard = ({
  mainImage,
  secondaryImages = [],
  propertyName,
  onImageClick,
  showVideo = false,
  videoPath = null,
}) => {
  // Función optimizada para calcular layout de imágenes secundarias con proporciones verticales
  const calculateSecondaryImageLayout = () => {
    const totalImages = secondaryImages.length;
    if (totalImages === 0) return { count: 0, height: 0, gap: 0 };

    // Altura disponible aumentada para mejor proporción vertical
    const containerHeight = 520; // Aumentado de 384 a 520
    const imageHeight = 100; // Aumentado ligeramente
    const gap = 8;
    const maxPossibleImages = Math.floor(
      (containerHeight + gap) / (imageHeight + gap)
    );
    const maxVisible = Math.min(maxPossibleImages, totalImages, 5); // Aumentamos a 5 imágenes máximo

    return {
      count: maxVisible,
      height: imageHeight,
      gap: gap,
    };
  };

  const imageLayout = calculateSecondaryImageLayout();

  if (!mainImage) {
    return null;
  }

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
        {/* Contenedor principal con altura optimizada para imágenes verticales */}
        <Box
          sx={{
            // Alturas optimizadas para proporciones verticales
            height: { xs: "400px", sm: "550px" }, // Aumentado significativamente
            position: "relative",
            overflow: "hidden",
            p: 1,
          }}
        >
          {/* Mobile: Solo imagen principal con proporción vertical optimizada */}
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
                objectFit: "cover", // Mantiene proporción sin deformar
                objectPosition: "center", // Centra la imagen
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

          {/* Desktop/Tablet: Grid layout optimizado para proporciones verticales */}
          <Grid
            container
            spacing={1}
            sx={{
              height: "100%",
              display: { xs: "none", sm: "flex" },
              m: 0,
              width: "100%",
            }}
          >
            {/* Bloque principal - reducido para dar más espacio a imágenes secundarias */}
            <Grid
              item
              xs={secondaryImages.length > 0 ? 7 : 12} // Reducido de 8 a 7 para mejor balance
              sx={{ p: "4px !important" }}
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
                {/* Imagen principal con proporción vertical optimizada */}
                <Grid
                  item
                  xs={showVideo && videoPath ? 7 : 12} // Ajustado para mejor proporción
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
                      // Proporción vertical mejorada
                      minHeight: "500px", // Altura mínima para mantener proporción vertical
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
                        objectFit: "cover", // Mantiene proporción sin deformar
                        objectPosition: "center", // Centra la imagen
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

                {/* Video con proporción vertical coordinada */}
                {showVideo && videoPath && (
                  <Grid item xs={5} sx={{ p: "4px !important" }}> {/* Aumentado de 3 a 5 */}
                    <Box
                      sx={{
                        height: "100%",
                        borderRadius: 1,
                        overflow: "hidden",
                        minHeight: "500px", // Altura mínima coordinada con imagen principal
                      }}
                    >
                      <VerticalVideoPlayer
                        videoPath={videoPath}
                        height="100%"
                        showControls={true}
                        autoPlay={false}
                        onError={(error) => {
                          console.error('Error en reproductor de video:', error);
                        }}
                      />
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Grid>

            {/* Imágenes secundarias con más espacio y mejor proporción */}
            {secondaryImages.length > 0 && (
              <Grid item xs={5} sx={{ p: "4px !important" }}> {/* Aumentado de 4 a 5 */}
                <Box
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    gap: `${imageLayout.gap}px`,
                    overflow: "hidden",
                    justifyContent: "flex-start", // Alinear desde arriba
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
                            objectPosition: "center", // Centra las imágenes secundarias
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
    </>
  );
};
