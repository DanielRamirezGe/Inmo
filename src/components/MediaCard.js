import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Card,
  Grid,
  Modal,
  Fade,
  Backdrop,
  IconButton,
  Typography,
  Chip,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ExploreIcon from "@mui/icons-material/Explore";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import { usePropertyVideo } from "../hooks/usePropertyVideo";
import VideoPlayer from "./VideoPlayer";

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

const PlayButton = () => (
  <Box
    sx={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      background: "linear-gradient(135deg, #F0B92B 0%, #FFD666 100%)",
      borderRadius: "50%",
      p: 1.5,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      opacity: 0,
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      boxShadow: "0 4px 20px rgba(240, 185, 43, 0.4)",
      border: "3px solid rgba(255, 255, 255, 0.9)",
      zIndex: 10,
      "&:hover": {
        opacity: 1,
        transform: "translate(-50%, -50%) scale(1.1)",
        boxShadow: "0 6px 30px rgba(240, 185, 43, 0.6)",
      },
    }}
  >
    <PlayArrowIcon
      sx={{
        color: "#37474F",
        fontSize: "2.5rem",
        filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.1))",
        ml: 0.3, // Ajuste visual para centrar el ícono de play
      }}
    />
  </Box>
);

const VideoContent = ({
  videoUrl,
  videoRef,
  onVideoClick,
  isMuted,
  onToggleMute,
  isPlaying,
  onPlayVideo,
}) => (
  <>
    <Box
      component="video"
      ref={videoRef}
      autoPlay
      muted
      playsInline
      sx={{
        width: "100%",
        height: "100%",
        objectFit: "contain",
      }}
    >
      <source src={videoUrl} type="video/mp4" />
    </Box>
    {!isPlaying && (
      <Box
        onClick={(e) => {
          e.stopPropagation();
          onPlayVideo();
        }}
        sx={{
          position: "absolute",
          top: 12,
          left: 12,
          background: "linear-gradient(135deg, #F0B92B 0%, #FFD666 100%)",
          borderRadius: "50%",
          p: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: "0 3px 12px rgba(240, 185, 43, 0.4)",
          border: "2px solid rgba(255, 255, 255, 0.9)",
          zIndex: 10,
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            transform: "scale(1.1)",
            boxShadow: "0 4px 16px rgba(240, 185, 43, 0.6)",
          },
        }}
      >
        <PlayArrowIcon
          sx={{
            color: "#37474F",
            fontSize: "1.5rem",
            filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.1))",
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
          onToggleMute();
        }}
        sx={{
          position: "absolute",
          bottom: 8,
          right: 8,
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          color: "white",
          zIndex: 999,
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
          width: 32,
          height: 32,
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.9)",
            transform: "scale(1.1)",
          },
          transition: "all 0.2s ease-in-out",
        }}
      >
        {isMuted ? (
          <VolumeOff sx={{ fontSize: 18 }} />
        ) : (
          <VolumeUp sx={{ fontSize: 18 }} />
        )}
      </IconButton>
    )}
  </>
);

const FallbackImage = ({ imageSrc, propertyName }) => (
  <Box
    component="img"
    src={`/api/image?path=${encodeURIComponent(imageSrc)}`}
    alt={`${propertyName} - Imagen secundaria`}
    sx={{
      width: "100%",
      height: "100%",
      objectFit: "cover",
    }}
  />
);

const VideoSection = ({
  videoLoading,
  videoUrl,
  videoError,
  onVideoClick,
  secondaryImages,
  propertyName,
}) => {
  // Debug: Log de VideoSection
  console.log("🎬 VideoSection - Rendering with:", {
    videoLoading,
    videoUrl,
    videoError,
    propertyName,
  });

  return (
    <Grid item xs={GRID_CONFIG.videoColumns} paddingBottom={1}>
      <VideoPlayer
        videoUrl={videoUrl}
        loading={videoLoading}
        error={videoError}
        autoplay={true}
        muted={true}
        onClick={onVideoClick}
        fallbackComponent={
          secondaryImages.length > 0 ? (
            <FallbackImage
              imageSrc={secondaryImages[0]}
              propertyName={propertyName}
            />
          ) : null
        }
        sx={{
          height: "100%",
          borderRadius: 2,
          boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
          transition: "all 0.3s ease",
          "&:hover": {
            transform: videoUrl && !videoError ? "scale(1.02)" : "none",
            boxShadow:
              videoUrl && !videoError
                ? "0 6px 24px rgba(240,185,43,0.2)"
                : "0 4px 16px rgba(0,0,0,0.15)",
          },
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "linear-gradient(135deg, rgba(240,185,43,0.1) 0%, transparent 30%)",
            pointerEvents: "none",
            zIndex: 1,
            opacity: videoUrl && !videoError ? 1 : 0,
          },
        }}
      />
    </Grid>
  );
};

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
      src={`/api/image?path=${encodeURIComponent(image)}`}
      alt={`${propertyName} - Imagen secundaria ${index + 1}`}
      sx={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        transition: "transform 0.3s ease",
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

const VideoModal = ({ open, onClose, videoUrl, propertyName }) => (
  <Modal
    open={open}
    onClose={onClose}
    closeAfterTransition
    BackdropComponent={Backdrop}
    BackdropProps={{
      timeout: 500,
      sx: { backgroundColor: "rgba(0, 0, 0, 0.9)" },
    }}
  >
    <Fade in={open}>
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
          <IconButton onClick={onClose} sx={{ color: "white" }}>
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
            loading={false}
            error={null}
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
);

// Componente principal
export const MediaCard = ({
  prototypeId,
  secondaryImages = [],
  propertyName = "",
  onOpenGallery,
}) => {
  const {
    videoUrl,
    loading: videoLoading,
    error: videoError,
  } = usePropertyVideo(prototypeId);

  const [expandedVideo, setExpandedVideo] = useState(false);
  const [screenWidth, setScreenWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 375
  );

  // Calcular dimensiones con useMemo para optimizar
  const dimensions = useMemo(() => {
    const totalImages = secondaryImages.length;
    const cardHeight = calculateCardHeight(screenWidth, totalImages);
    const imageLayout = calculateImageLayout(
      screenWidth,
      totalImages,
      cardHeight
    );

    return { cardHeight, imageLayout };
  }, [screenWidth, secondaryImages.length]);

  // Detectar cambios de tamaño de pantalla
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handlers
  const handleVideoClick = () => {
    setExpandedVideo(true);
  };

  const handleImageClick = () => onOpenGallery?.();

  const handleCloseVideo = () => {
    setExpandedVideo(false);
  };

  // Early return si no hay contenido
  if (!secondaryImages.length && (!videoUrl || videoError)) {
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
              videoLoading={videoLoading}
              videoUrl={videoUrl}
              videoError={videoError}
              onVideoClick={handleVideoClick}
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

      <VideoModal
        open={expandedVideo}
        onClose={handleCloseVideo}
        videoUrl={videoUrl}
        propertyName={propertyName}
      />
    </>
  );
};
