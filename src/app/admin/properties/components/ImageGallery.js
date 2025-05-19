import React, { useState } from "react";
import { Box, Modal, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import apiConfig from "../../../../config/apiConfig";

const ImageGallery = ({ mainImage, secondaryImages }) => {
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleOpen = (img) => {
    setSelectedImage(img);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedImage(null);
  };

  // Helper function to get the full image URL
  const getImageUrl = (path) => {
    // If the path is already a blob URL (preview) or absolute URL, return as is
    if (path?.startsWith('blob:') || path?.startsWith('http')) {
      return path;
    }
    // Otherwise, construct the full API URL
    return `${apiConfig.baseURL}/api/v1/image?path=${encodeURIComponent(path)}`;
  };

  return (
    <Box>
      {/* Imagen principal */}
      {mainImage && (
        <Box
          sx={{
            mb: 2,
            borderRadius: 2,
            overflow: "hidden",
            boxShadow: 2,
            width: 320,
            height: 200,
            cursor: "pointer",
            display: "inline-block",
            mr: 2,
            background: "#fafafa",
          }}
          onClick={() => handleOpen(mainImage)}
        >
          <img
            src={getImageUrl(mainImage)}
            alt="Imagen principal"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </Box>
      )}

      {/* Carrusel de imágenes secundarias */}
      {secondaryImages && secondaryImages.length > 0 && (
        <Box sx={{ display: "flex", gap: 1, alignItems: "center", flexWrap: "wrap" }}>
          {secondaryImages.map((img, idx) => (
            <Box
              key={idx}
              sx={{
                borderRadius: 2,
                overflow: "hidden",
                boxShadow: 1,
                width: 80,
                height: 60,
                cursor: "pointer",
                background: "#fafafa",
                border: "2px solid #eee",
                transition: "border 0.2s",
                '&:hover': { border: '2px solid #25D366' },
              }}
              onClick={() => handleOpen(img)}
            >
              <img
                src={getImageUrl(img)}
                alt={`Secundaria ${idx + 1}`}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </Box>
          ))}
        </Box>
      )}

      {/* Modal para ver imagen grande */}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 2,
            borderRadius: 2,
            outline: "none",
            maxWidth: "90vw",
            maxHeight: "90vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <IconButton
            onClick={handleClose}
            sx={{ position: "absolute", top: 8, right: 8, zIndex: 2 }}
          >
            <CloseIcon />
          </IconButton>
          {selectedImage && (
            <img
              src={getImageUrl(selectedImage)}
              alt="Vista grande"
              style={{
                maxWidth: "80vw",
                maxHeight: "80vh",
                borderRadius: 8,
                boxShadow: "0 2px 16px rgba(0,0,0,0.15)",
              }}
            />
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default ImageGallery; 