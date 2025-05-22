import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Grid,
  Button,
  CardActions,
  Divider,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import KingBedIcon from "@mui/icons-material/KingBed";
import BathtubIcon from "@mui/icons-material/Bathtub";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ImageGalleryModal from "../ImageGalleryModal";
import apiConfig from "@/config/apiConfig";

const PropertyCard = ({ property, onWhatsAppClick, onDetailClick }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    prototypeName,
    state,
    city,
    price,
    size,
    bedroom,
    bathroom,
    parking,
    mainImage,
    secondaryImages,
    images = [],
    developmentName,
  } = property;

  // Asegurarse de que mainImage esté primero en el array de imágenes
  const allImages = [
    mainImage,
    ...(Array.isArray(secondaryImages)
      ? secondaryImages.map((img) => img.pathImage)
      : secondaryImages?.pathImage
      ? [secondaryImages.pathImage]
      : []),
    ...images.filter(
      (img) =>
        img !== mainImage &&
        !secondaryImages?.some((secImg) => secImg.pathImage === img)
    ),
  ].filter(Boolean);

  const handleImageClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const formatPrice = (price) => {
    const formattedPrice = new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);

    // Separar el símbolo de moneda y el valor
    const [amount] = formattedPrice.split("MXN");

    return (
      <>
        {amount.trim()}
        <span style={{ fontSize: "0.8em", marginLeft: "2px" }}>MXN</span>
      </>
    );
  };

  return (
    <>
      <Card
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          boxShadow: 6,
          minWidth: "320px",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontSize: "1.1rem",
              textAlign: "center",
              width: "100%",
            }}
          >
            {prototypeName} - {developmentName}
          </Typography>
        </Box>

        {/* Contenido principal */}
        <Box sx={{ display: "flex" }}>
          {/* Columna izquierda - Imagen */}
          <Box
            sx={{
              width: "60%",
              cursor: "pointer",
              "&:hover": {
                opacity: 0.9,
              },
            }}
            onClick={handleImageClick}
          >
            <CardMedia
              component="img"
              sx={{ height: "100%", objectFit: "cover" }}
              image={
                mainImage
                  ? `${
                      apiConfig.baseURL
                    }/api/v1/image?path=${encodeURIComponent(mainImage)}`
                  : "/placeholder-house.jpg"
              }
              alt={prototypeName}
            />
          </Box>

          {/* Columna derecha - Información */}
          <Box
            sx={{
              width: "40%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <CardContent sx={{ py: 0.5, px: 1, flex: 1 }}>
              <Typography
                variant="subtitle1"
                sx={{
                  mb: 1,
                  fontWeight: "bold",
                  textAlign: "center",
                  fontSize: "1rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "2px",
                }}
              >
                {formatPrice(price)}
              </Typography>

              <Grid container spacing={0.5}>
                <Grid item xs={12}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      mb: 0.5,
                    }}
                  >
                    <HomeIcon color="primary" sx={{ fontSize: "1rem" }} />
                    <Typography variant="caption">
                      <strong>Sup:</strong> {size} m²
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      mb: 0.5,
                    }}
                  >
                    <KingBedIcon color="primary" sx={{ fontSize: "1rem" }} />
                    <Typography variant="caption">
                      <strong>Rec:</strong> {bedroom}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      mb: 0.5,
                    }}
                  >
                    <BathtubIcon color="primary" sx={{ fontSize: "1rem" }} />
                    <Typography variant="caption">
                      <strong>Baños:</strong> {bathroom}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      mb: 0.5,
                    }}
                  >
                    <DirectionsCarIcon
                      color="primary"
                      sx={{ fontSize: "1rem" }}
                    />
                    <Typography variant="caption">
                      <strong>Est:</strong> {parking}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      mb: 0.5,
                    }}
                  >
                    <LocationOnIcon color="primary" sx={{ fontSize: "1rem" }} />
                    <Typography
                      variant="caption"
                      sx={{ color: "text.secondary", fontSize: "0.7rem" }}
                    >
                      {state} - {city}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>

            <Box sx={{ p: 1 }}>
              <Button
                fullWidth
                variant="contained"
                color="success"
                onClick={onWhatsAppClick}
                size="small"
              >
                WhatsApp
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Footer */}
        <Box
          sx={{
            mt: "auto",
            borderTop: "1px solid",
            borderColor: "divider",
            background: "linear-gradient(to right, #f5f5f5, #ffffff)",
          }}
        >
          <Button
            fullWidth
            onClick={onDetailClick}
            sx={{
              py: 1,
              color: "text.primary",
              "&:hover": {
                background: "linear-gradient(to right, #e3f2fd, #bbdefb)",
                color: "primary.main",
              },
              display: "flex",
              justifyContent: "space-between",
              px: 3,
            }}
          >
            <Typography variant="button" sx={{ fontWeight: "medium" }}>
              Ver a detalle
            </Typography>
            <ArrowForwardIcon sx={{ fontSize: "1.2rem" }} />
          </Button>
        </Box>
      </Card>

      <ImageGalleryModal
        open={isModalOpen}
        onClose={handleCloseModal}
        images={allImages}
      />
    </>
  );
};

export default PropertyCard;
