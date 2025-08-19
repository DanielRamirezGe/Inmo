import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  Grid,
  IconButton,
  Typography,
  CircularProgress,
} from "@mui/material";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import { VerticalVideoPlayer } from "./videoStream";
import { AWS_IMAGE_CONFIG } from "@/config/imageConfig";

// Constantes de configuración
const BREAKPOINTS = {
  xs: 375,
  sm: 390,
  md: 414,
  lg: 425,
};

const CARD_HEIGHTS = {
  base: {
    xs: 350,
    sm: 360,
    md: 380,
    lg: 410,
    xl: 380,
  },
  fewImages: {
    xs: 420,
    sm: 440,
    md: 460,
    lg: 480,
    xl: 500,
  },
  videoOnly: {
    xs: 400,
    sm: 420,
    md: 440,
    lg: 460,
    xl: 480,
  },
};

const IMAGE_CONFIG = {
  minHeight: 60,
  maxHeight: 120,
  minGap: 4,
  padding: 6,
  fewImagesThreshold: 5,
  baseHeightMobile: 65,
  baseHeightDesktop: 75,
  minHeightMobile: 55,
  maxHeightMobile: 100,
};

const GRID_CONFIG = {
  videoColumns: 7,
  imagesColumns: 5,
};

// Utilidades para breakpoints
const getBreakpointValue = (screenWidth, values) => {
  if (screenWidth <= BREAKPOINTS.xs) return values.xs;
  if (screenWidth <= BREAKPOINTS.sm) return values.sm;
  if (screenWidth <= BREAKPOINTS.md) return values.md;
  if (screenWidth <= BREAKPOINTS.lg) return values.lg;
  return values.xl;
};

// Funciones de cálculo de dimensiones
const calculateCardHeight = (screenWidth, totalImages) => {
  const baseHeight = getBreakpointValue(screenWidth, CARD_HEIGHTS.base);

  if (totalImages === 0) {
    const videoOnlyHeight = getBreakpointValue(
      screenWidth,
      CARD_HEIGHTS.videoOnly
    );
    return Math.max(baseHeight, videoOnlyHeight);
  }

  if (totalImages <= IMAGE_CONFIG.fewImagesThreshold) {
    const fewImagesHeight = getBreakpointValue(
      screenWidth,
      CARD_HEIGHTS.fewImages
    );
    const minImagesHeight = calculateMinImagesHeight(totalImages);
    return Math.max(baseHeight, fewImagesHeight, minImagesHeight);
  }

  return baseHeight;
};

const calculateMinImagesHeight = (totalImages) => {
  const totalGapSpace = IMAGE_CONFIG.minGap * (totalImages - 1);
  return (
    IMAGE_CONFIG.minHeight * totalImages +
    totalGapSpace +
    IMAGE_CONFIG.padding * 2
  );
};

const calculateImageLayout = (screenWidth, totalImages, cardHeight) => {
  if (totalImages === 0) {
    return { count: 0, height: 0, gap: 0 };
  }

  const availableHeight = cardHeight - IMAGE_CONFIG.padding * 2;

  if (totalImages <= IMAGE_CONFIG.fewImagesThreshold) {
    return calculateFewImagesLayout(totalImages, availableHeight);
  }

  return calculateManyImagesLayout(screenWidth, totalImages, availableHeight);
};

const calculateFewImagesLayout = (totalImages, availableHeight) => {
  const totalGapSpace = IMAGE_CONFIG.minGap * (totalImages - 1);
  let imageHeight = Math.floor((availableHeight - totalGapSpace) / totalImages);
  imageHeight = Math.max(
    IMAGE_CONFIG.minHeight,
    Math.min(imageHeight, IMAGE_CONFIG.maxHeight)
  );

  return {
    count: totalImages,
    height: imageHeight,
    gap: IMAGE_CONFIG.minGap,
  };
};

const calculateManyImagesLayout = (
  screenWidth,
  totalImages,
  availableHeight
) => {
  const baseHeight =
    screenWidth <= BREAKPOINTS.xs
      ? IMAGE_CONFIG.baseHeightMobile
      : IMAGE_CONFIG.baseHeightDesktop;

  let maxVisible = Math.floor(
    availableHeight / (baseHeight + IMAGE_CONFIG.minGap)
  );
  maxVisible = Math.max(3, Math.min(maxVisible, totalImages));

  const totalGapSpace = IMAGE_CONFIG.minGap * (maxVisible - 1);
  let imageHeight = Math.floor((availableHeight - totalGapSpace) / maxVisible);
  imageHeight = Math.max(
    IMAGE_CONFIG.minHeightMobile,
    Math.min(imageHeight, IMAGE_CONFIG.maxHeightMobile)
  );

  return {
    count: maxVisible,
    height: imageHeight,
    gap: IMAGE_CONFIG.minGap,
  };
};

// Componentes auxiliares
const LoadingSpinner = () => (
  <Box
    sx={{
      width: "100%",
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      bgcolor: "grey.100",
    }}
  >
    <CircularProgress />
  </Box>
);

const VideoContent = ({ videoPath, onError }) => (
  <VerticalVideoPlayer
    videoPath={videoPath}
    height="100%"
    showControls={true}
    autoPlay={false}
    onError={onError}
  />
);

const FallbackImage = ({ imageSrc, propertyName }) => (
  <Box
    component="img"
    src={AWS_IMAGE_CONFIG.getImageUrl(imageSrc)}
    alt={`${propertyName} - Imagen secundaria`}
    sx={{
      width: "100%",
      height: "100%",
      objectFit: "cover",
      borderRadius: "8px",
    }}
  />
);

const VideoSection = ({
  videoPath,
  onError,
  secondaryImages,
  propertyName,
}) => (
  <Grid item xs={GRID_CONFIG.videoColumns} paddingBottom={1}>
    <Box
      sx={{
        height: "100%",
        display: "flex",
        position: "relative",
        backgroundColor: "#000",
        borderRadius: 2,
        overflow: "hidden",
        boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: videoPath ? "scale(1.02)" : "none",
          boxShadow: videoPath
            ? "0 6px 24px rgba(240,185,43,0.2)"
            : "0 4px 16px rgba(0,0,0,0.15)",
        },
      }}
    >
      {videoPath ? (
        <VideoContent videoPath={videoPath} onError={onError} />
      ) : (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            color: "white",
            textAlign: "center",
            p: 2,
          }}
        >
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            Video no disponible
          </Typography>
        </Box>
      )}
    </Box>
  </Grid>
);

const ImageOverlay = ({ remainingCount }) => (
  <Box
    sx={{
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background:
        "linear-gradient(135deg, rgba(55, 71, 79, 0.9) 0%, rgba(0, 0, 0, 0.8) 100%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      zIndex: 2,
      backdropFilter: "blur(2px)",
    }}
  >
    <Typography
      sx={{
        fontSize: "1.2rem",
        fontWeight: 700,
        mb: 0.5,
        textShadow: "0 1px 3px rgba(0,0,0,0.5)",
      }}
    >
      +{remainingCount}
    </Typography>
    <Typography
      sx={{
        fontSize: "0.65rem",
        fontWeight: 500,
        opacity: 0.9,
        textTransform: "uppercase",
        letterSpacing: "0.5px",
        textShadow: "0 1px 2px rgba(0,0,0,0.5)",
      }}
    >
      más fotos
    </Typography>
  </Box>
);

const SecondaryImage = ({
  image,
  index,
  propertyName,
  imageLayout,
  onImageClick,
  showOverlay,
  remainingCount,
}) => (
  <Box
    key={index}
    onClick={onImageClick}
    sx={{
      position: "relative",
      height: `${imageLayout.height}px`,
      borderRadius: 2,
      overflow: "hidden",
      cursor: "pointer",
      flexShrink: 0,
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      border: "1px solid rgba(240, 185, 43, 0.2)",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      "&:hover": {
        transform: "scale(1.05) translateY(-2px)",
        boxShadow: "0 8px 25px rgba(240, 185, 43, 0.3)",
        borderColor: "rgba(240, 185, 43, 0.5)",
      },
      "&::before": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background:
          "linear-gradient(135deg, rgba(240,185,43,0.1) 0%, transparent 50%)",
        opacity: 0,
        transition: "opacity 0.3s ease",
        zIndex: 1,
        pointerEvents: "none",
      },
      "&:hover::before": {
        opacity: 1,
      },
    }}
  >
    <Box
      component="img"
      src={AWS_IMAGE_CONFIG.getImageUrl(image)}
      alt={`${propertyName} - Imagen secundaria ${index + 1}`}
      sx={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        objectPosition: "center",
      }}
    />
    {showOverlay && <ImageOverlay remainingCount={remainingCount} />}
  </Box>
);

const ImagesSection = ({
  secondaryImages,
  imageLayout,
  onImageClick,
  propertyName,
}) => (
  <Grid item xs={GRID_CONFIG.imagesColumns}>
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: imageLayout.count <= 2 ? "center" : "flex-start",
        gap: `${imageLayout.gap}px`,
        p: 0.75,
        overflow: "hidden",
      }}
    >
      {secondaryImages.slice(0, imageLayout.count).map((image, index) => {
        const isLastImage = index === imageLayout.count - 1;
        const hasMoreImages = secondaryImages.length > imageLayout.count;
        const showOverlay = isLastImage && hasMoreImages;
        const remainingCount = secondaryImages.length - imageLayout.count;

        return (
          <SecondaryImage
            key={index}
            image={image}
            index={index}
            propertyName={propertyName}
            imageLayout={imageLayout}
            onImageClick={onImageClick}
            showOverlay={showOverlay}
            remainingCount={remainingCount}
          />
        );
      })}
    </Box>
  </Grid>
);

// Componente principal
export const MediaCard = ({
  secondaryImages = [],
  propertyName = "",
  onOpenGallery,
  videoPath = null,
}) => {
  const [dimensions, setDimensions] = useState({
    cardHeight: 320,
    imageLayout: { count: 0, height: 0, gap: 0 },
  });

  // Calcular dimensiones
  useEffect(() => {
    const calculateDimensions = () => {
      const screenWidth = window.innerWidth;
      const totalImages = secondaryImages.length;

      const cardHeight = calculateCardHeight(screenWidth, totalImages);
      const imageLayout = calculateImageLayout(
        screenWidth,
        totalImages,
        cardHeight
      );

      setDimensions({ cardHeight, imageLayout });
    };

    calculateDimensions();

    const handleResize = () => calculateDimensions();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [secondaryImages.length]);

  // Handlers
  const handleImageClick = () => onOpenGallery?.();

  const handleVideoError = (error) => {
    console.error("Error en video de MediaCard:", error);
  };

  // Early return si no hay contenido
  if (!secondaryImages.length && !videoPath) {
    return null;
  }

  return (
    <>
      <Card
        sx={{
          mb: 2,
          borderRadius: 3,
          overflow: "hidden",
          boxShadow: "0 8px 32px rgba(240, 185, 43, 0.15)",
          border: "2px solid",
          borderColor: "rgba(240, 185, 43, 0.3)",
          position: "relative",
          background: "linear-gradient(135deg, #ffffff 0%, #fefefe 100%)",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 12px 40px rgba(240, 185, 43, 0.25)",
            borderColor: "rgba(240, 185, 43, 0.5)",
          },
        }}
      >
        {/* Header con título y badges */}
        <Box
          sx={{
            background:
              "linear-gradient(135deg, rgba(240, 185, 43, 0.15) 0%, rgba(255, 214, 102, 0.1) 100%)",
            backdropFilter: "blur(10px)",
            px: 2,
            py: 1.5,
            position: "relative",
            overflow: "hidden",
            borderBottom: "1px solid rgba(240, 185, 43, 0.2)",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                "linear-gradient(45deg, rgba(255,255,255,0.3) 0%, transparent 100%)",
              pointerEvents: "none",
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              position: "relative",
              zIndex: 1,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
              <PhotoLibraryIcon
                sx={{
                  color: "#37474F",
                  fontSize: "1.3rem",
                  filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.15))",
                  opacity: 0.8,
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  color: "#37474F",
                  fontWeight: 600,
                  fontSize: { xs: "0.95rem", sm: "1.1rem" },
                  textShadow: "0 1px 2px rgba(255,255,255,0.7)",
                  letterSpacing: "0.3px",
                  opacity: 0.9,
                }}
              >
                Conoce más...
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Contenido principal */}
        <Box
          sx={{
            height: `${dimensions.cardHeight}px`,
            minHeight: "280px",
            position: "relative",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                "linear-gradient(180deg, rgba(240,185,43,0.02) 0%, transparent 20%)",
              pointerEvents: "none",
              zIndex: 1,
            },
          }}
        >
          <Grid
            container
            sx={{ height: "100%", position: "relative", zIndex: 2 }}
            spacing={0.5}
            paddingLeft={1}
          >
            <VideoSection
              videoPath={videoPath}
              onError={handleVideoError}
              secondaryImages={secondaryImages}
              propertyName={propertyName}
            />
            <ImagesSection
              secondaryImages={secondaryImages}
              imageLayout={dimensions.imageLayout}
              onImageClick={handleImageClick}
              propertyName={propertyName}
            />
          </Grid>
        </Box>

        {/* Decorative bottom accent */}
        <Box
          sx={{
            height: "4px",
            background:
              "linear-gradient(90deg, #F0B92B 0%, #FFD666 50%, #F0B92B 100%)",
            position: "relative",
            "&::after": {
              content: '""',
              position: "absolute",
              top: 0,
              left: "50%",
              transform: "translateX(-50%)",
              width: "60px",
              height: "4px",
              background:
                "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)",
            },
          }}
        />
      </Card>
    </>
  );
};
