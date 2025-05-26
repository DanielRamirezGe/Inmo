import React, { useState } from "react";
import {
  Modal,
  Box,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import apiConfig from "@/config/apiConfig";

const ImageGalleryModal = ({
  open,
  onClose,
  images = [],
  propertyName = "",
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const allImages = images.filter(Boolean); // Filtrar imágenes nulas o vacías
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleNext = () => {
    setSelectedIndex((prev) => (prev + 1) % allImages.length);
  };

  const handlePrevious = () => {
    setSelectedIndex(
      (prev) => (prev - 1 + allImages.length) % allImages.length
    );
  };

  const handleThumbnailClick = (index) => {
    setSelectedIndex(index);
  };

  if (allImages.length === 0) return null;

  // Versión móvil: desplazamiento vertical de todas las imágenes
  if (isMobile) {
    return (
      <Modal
        open={open}
        onClose={onClose}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: "100%",
            bgcolor: "background.paper",
            outline: "none",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Encabezado fijo con botón de cerrar */}
          <Box
            sx={{
              position: "sticky",
              top: 0,
              left: 0,
              right: 0,
              p: 1.5,
              bgcolor: "background.paper",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              zIndex: 10,
              borderBottom: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontSize: "1rem",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: "85%",
              }}
            >
              {propertyName || "Imágenes"}
            </Typography>
            <IconButton
              onClick={onClose}
              sx={{
                color: "text.primary",
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Contenedor de imágenes con desplazamiento vertical */}
          <Box sx={{ p: 0, flex: 1, overflowY: "auto" }}>
            {allImages.map((image, index) => (
              <Box
                key={index}
                sx={{
                  width: "100%",
                  mb: 0.5,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    aspectRatio: "4/3",
                    position: "relative",
                    bgcolor: "white",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    overflow: "hidden",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                  }}
                >
                  <Box
                    component="img"
                    src={`${
                      apiConfig.baseURL
                    }/api/v1/image?path=${encodeURIComponent(image)}`}
                    alt={`Imagen ${index + 1}`}
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Modal>
    );
  }

  // Versión desktop: carrusel con miniaturas
  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: "90vw",
          maxWidth: "1200px",
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 2,
          outline: "none",
        }}
      >
        {/* Botón de cerrar */}
        <IconButton
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: "primary.main",
            bgcolor: "rgba(255,255,255,0.8)",
            "&:hover": {
              bgcolor: "rgba(255,255,255,0.9)",
            },
            zIndex: 1,
          }}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>

        {/* Imagen principal */}
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: "60vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            bgcolor: "white",
            borderRadius: 1,
            overflow: "hidden",
            boxShadow: "inset 0 0 10px rgba(0,0,0,0.1)",
          }}
        >
          <Box
            component="img"
            src={`${apiConfig.baseURL}/api/v1/image?path=${encodeURIComponent(
              allImages[selectedIndex]
            )}`}
            alt={`Imagen ${selectedIndex + 1}`}
            sx={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
            }}
          />

          {/* Botones de navegación */}
          {allImages.length > 1 && (
            <>
              <IconButton
                sx={{
                  position: "absolute",
                  left: 8,
                  color: "primary.main",
                  bgcolor: "rgba(255,255,255,0.8)",
                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.9)",
                  },
                }}
                onClick={handlePrevious}
              >
                <NavigateBeforeIcon />
              </IconButton>
              <IconButton
                sx={{
                  position: "absolute",
                  right: 8,
                  color: "primary.main",
                  bgcolor: "rgba(255,255,255,0.8)",
                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.9)",
                  },
                }}
                onClick={handleNext}
              >
                <NavigateNextIcon />
              </IconButton>
            </>
          )}
        </Box>

        {/* Miniaturas */}
        <Box
          sx={{
            mt: 2,
            p: 1,
            bgcolor: "background.default",
            overflowX: "auto",
            borderRadius: 1,
            boxShadow: "inset 0 0 6px rgba(0,0,0,0.05)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 1,
              minHeight: 100,
            }}
          >
            {allImages.map((image, index) => (
              <Box
                key={image}
                sx={{
                  width: 100,
                  height: 80,
                  flexShrink: 0,
                  cursor: "pointer",
                  border:
                    index === selectedIndex
                      ? "2px solid"
                      : "2px solid transparent",
                  borderColor: "primary.main",
                  borderRadius: 1,
                  overflow: "hidden",
                  transition: "all 0.2s",
                  "&:hover": {
                    transform: "scale(1.05)",
                  },
                }}
                onClick={() => handleThumbnailClick(index)}
              >
                <Box
                  component="img"
                  src={`${
                    apiConfig.baseURL
                  }/api/v1/image?path=${encodeURIComponent(image)}`}
                  alt={`Miniatura ${index + 1}`}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default ImageGalleryModal;
