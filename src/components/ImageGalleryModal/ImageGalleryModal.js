import React, { useState } from "react";
import {
  Modal,
  Box,
  IconButton,
  Paper,
  ImageList,
  ImageListItem,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import apiConfig from "@/config/apiConfig";

const ImageGalleryModal = ({ open, onClose, images = [] }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const allImages = images.filter(Boolean); // Filtrar imágenes nulas o vacías

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
          <img
            src={`${apiConfig.baseURL}/api/v1/image?path=${encodeURIComponent(
              allImages[selectedIndex]
            )}`}
            alt={`Imagen ${selectedIndex + 1}`}
            style={{
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
        <Paper
          elevation={3}
          sx={{
            mt: 2,
            p: 1,
            bgcolor: "background.default",
          }}
        >
          <ImageList
            sx={{
              width: "100%",
              height: 100,
              display: "flex",
              p: 0.5,
              m: 0,
            }}
            rowHeight={80}
          >
            {allImages.map((image, index) => (
              <ImageListItem
                key={image}
                sx={{
                  width: 100,
                  flexShrink: 0,
                  cursor: "pointer",
                  border: index === selectedIndex ? "2px solid" : "none",
                  borderColor: "primary.main",
                  borderRadius: 1,
                  overflow: "hidden",
                }}
                onClick={() => handleThumbnailClick(index)}
              >
                <img
                  src={`${
                    apiConfig.baseURL
                  }/api/v1/image?path=${encodeURIComponent(image)}`}
                  alt={`Miniatura ${index + 1}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </ImageListItem>
            ))}
          </ImageList>
        </Paper>
      </Box>
    </Modal>
  );
};

export default ImageGalleryModal;
