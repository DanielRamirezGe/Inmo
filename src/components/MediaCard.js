import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Card,
  Grid,
  Modal,
  Fade,
  Backdrop,
  IconButton,
  Typography,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { useMainVideo } from "../hooks/useMainVideo";

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
    <PlayArrowIcon sx={{ color: "white", fontSize: "2rem" }} />
  </Box>
);

const VideoContent = ({ videoUrl, videoRef, onVideoClick }) => (
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
    <PlayButton />
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
  videoRef,
  onVideoClick,
  secondaryImages,
  propertyName,
}) => (
  <Grid item xs={GRID_CONFIG.videoColumns}>
    <Box
      sx={{
        height: "100%",
        display: "flex",
        position: "relative",
        cursor: videoUrl && !videoError ? "pointer" : "default",
        backgroundColor: "#000",
        borderRadius: 1,
        overflow: "hidden",
      }}
      onClick={videoUrl && !videoError ? onVideoClick : undefined}
    >
      {videoLoading ? (
        <LoadingSpinner />
      ) : videoUrl && !videoError ? (
        <VideoContent
          videoUrl={videoUrl}
          videoRef={videoRef}
          onVideoClick={onVideoClick}
        />
      ) : (
        secondaryImages.length > 0 && (
          <FallbackImage
            imageSrc={secondaryImages[0]}
            propertyName={propertyName}
          />
        )
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
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      fontSize: "0.75rem",
      fontWeight: 600,
    }}
  >
    +{remainingCount}
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
      alt={`${propertyName} - Imagen secundaria ${index + 1}`}
      sx={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
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
);

// Componente principal
export const MediaCard = ({
  secondaryImages = [],
  propertyName = "",
  onOpenGallery,
}) => {
  const { videoUrl, loading: videoLoading, error: videoError } = useMainVideo();
  const [expandedVideo, setExpandedVideo] = useState(false);
  const [dimensions, setDimensions] = useState({
    cardHeight: 320,
    imageLayout: { count: 0, height: 0, gap: 0 },
  });
  const videoRef = useRef(null);

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

  // Manejar video
  useEffect(() => {
    const video = videoRef.current;
    if (video && videoUrl) {
      const handleEnded = () => {
        video.pause();
        video.removeAttribute("autoplay");
      };
      video.addEventListener("ended", handleEnded);
      return () => video.removeEventListener("ended", handleEnded);
    }
  }, [videoUrl]);

  // Handlers
  const handleVideoClick = () => setExpandedVideo(true);
  const handleImageClick = () => onOpenGallery?.();
  const handleCloseVideo = () => setExpandedVideo(false);

  // Early return si no hay contenido
  if (!secondaryImages.length && (!videoUrl || videoError)) {
    return null;
  }

  return (
    <>
      <Card
        sx={{
          mb: 2,
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
            height: `${dimensions.cardHeight}px`,
            minHeight: "280px",
          }}
        >
          <Grid container sx={{ height: "100%" }} spacing={0.5}>
            <VideoSection
              videoLoading={videoLoading}
              videoUrl={videoUrl}
              videoError={videoError}
              videoRef={videoRef}
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
