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
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import {
  generatePropertyMessage,
  openWhatsAppChat,
} from "@/utils/contactHelpers";

const PropertyCard = ({ property, onDetailClick }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    prototypeName,
    state,
    city,
    price,
    size,
    bedroom,
    bathroom,
    halfBathroom,
    parking,
    mainImage,
    secondaryImages,
    images = [],
    developmentName,
    condominium,
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

  // Función de WhatsApp - siempre la misma lógica
  const handleWhatsAppClick = () => {
    const message = generatePropertyMessage({
      name: property.prototypeName,
      development: property.developmentName || property.condominium,
      messageType: "interest",
    });
    openWhatsAppChat({ message });
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
          minWidth: { xs: "100%", sm: "320px" },
          maxWidth: "100%",
          overflow: "hidden",
          borderRadius: { xs: 1, md: 2 },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: { xs: 0.35, md: 0.75 },
            pb: { xs: 0.2, md: 0.5 },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontSize: { xs: "1rem", sm: "1.3rem", md: "1.1rem" },
              textAlign: "center",
              width: "100%",
              fontWeight: 600,
              // lineHeight: 1.2,
              // m: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              // height: { xs: "2.5em", md: "2.4em" },
            }}
          >
            {prototypeName} - {developmentName || condominium}
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
            {mainImage && !property.isMock ? (
              <CardMedia
                component="img"
                sx={{ height: "100%", objectFit: "cover" }}
                image={`/api/image?path=${encodeURIComponent(mainImage)}`}
                alt={prototypeName}
              />
            ) : (
              <Box
                sx={{
                  height: "100%",
                  backgroundColor: "#e0e0e0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  p: { xs: 1, md: 2 },
                }}
              >
                <HomeIcon
                  sx={{
                    fontSize: { xs: 30, md: 40 },
                    color: "text.secondary",
                    mb: 0.5,
                  }}
                />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  align="center"
                  sx={{ fontSize: { xs: "0.65rem", md: "0.8rem" } }}
                >
                  {property.isMock ? "Imagen de muestra" : "Sin imagen"}
                </Typography>
              </Box>
            )}
          </Box>

          {/* Columna derecha - Información */}
          <Box
            sx={{
              width: "40%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <CardContent
              sx={{
                py: { xs: 0.5, md: 0.5 },
                px: { xs: 0.5, md: 1 },
                flex: 1,
                cursor: "pointer",
                borderRadius: 1,
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.04)",
                  boxShadow: "inset 0 0 0 1px rgba(25, 118, 210, 0.2)",
                },
                transition: "all 0.2s ease",
              }}
              onClick={onDetailClick}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  mb: { xs: 0.5, md: 1 },
                  fontWeight: "bold",
                  textAlign: "center",
                  fontSize: { xs: "0.8rem", sm: "1rem", md: "1rem" },
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "2px",
                  "&:hover": {
                    color: "primary.main",
                  },
                  transition: "color 0.2s ease",
                }}
              >
                {formatPrice(price)}
              </Typography>

              <Grid container spacing={0.25}>
                <Grid item xs={12}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.25,
                      mb: 0.25,
                      "&:hover .feature-icon": {
                        color: "primary.dark",
                        transform: "scale(1.1)",
                      },
                      transition: "all 0.2s ease",
                    }}
                  >
                    <HomeIcon
                      className="feature-icon"
                      color="primary"
                      sx={{
                        fontSize: { xs: "0.8rem", md: "1rem" },
                        transition: "all 0.2s ease",
                      }}
                    />
                    <Typography
                      variant="caption"
                      sx={{ fontSize: { xs: "0.65rem", md: "0.75rem" } }}
                    >
                      <strong>Sup:</strong> {size} m²
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.25,
                      mb: 0.25,
                      "&:hover .feature-icon": {
                        color: "primary.dark",
                        transform: "scale(1.1)",
                      },
                      transition: "all 0.2s ease",
                    }}
                  >
                    <KingBedIcon
                      className="feature-icon"
                      color="primary"
                      sx={{
                        fontSize: { xs: "0.8rem", md: "1rem" },
                        transition: "all 0.2s ease",
                      }}
                    />
                    <Typography
                      variant="caption"
                      sx={{ fontSize: { xs: "0.65rem", md: "0.75rem" } }}
                    >
                      <strong>Rec:</strong> {bedroom}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.25,
                      mb: 0.25,
                      "&:hover .feature-icon": {
                        color: "primary.dark",
                        transform: "scale(1.1)",
                      },
                      transition: "all 0.2s ease",
                    }}
                  >
                    <BathtubIcon
                      className="feature-icon"
                      color="primary"
                      sx={{
                        fontSize: { xs: "0.8rem", md: "1rem" },
                        transition: "all 0.2s ease",
                      }}
                    />
                    <Typography
                      variant="caption"
                      sx={{ fontSize: { xs: "0.65rem", md: "0.75rem" } }}
                    >
                      <strong>Baños:</strong> {bathroom}{" "}
                      {halfBathroom === "1" ? "½" : ""}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.25,
                      mb: 0.25,
                      "&:hover .feature-icon": {
                        color: "primary.dark",
                        transform: "scale(1.1)",
                      },
                      transition: "all 0.2s ease",
                    }}
                  >
                    <DirectionsCarIcon
                      className="feature-icon"
                      color="primary"
                      sx={{
                        fontSize: { xs: "0.8rem", md: "1rem" },
                        transition: "all 0.2s ease",
                      }}
                    />
                    <Typography
                      variant="caption"
                      sx={{ fontSize: { xs: "0.65rem", md: "0.75rem" } }}
                    >
                      <strong>Est:</strong> {parking}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 0.25,
                      mb: 0.25,
                      "&:hover .feature-icon": {
                        color: "primary.dark",
                        transform: "scale(1.1)",
                      },
                      transition: "all 0.2s ease",
                    }}
                  >
                    <LocationOnIcon
                      className="feature-icon"
                      color="primary"
                      sx={{
                        fontSize: { xs: "0.8rem", md: "1rem" },
                        mt: "2px",
                        transition: "all 0.2s ease",
                      }}
                    />
                    <Typography
                      variant="caption"
                      sx={{
                        color: "text.secondary",
                        fontSize: { xs: "0.6rem", md: "0.7rem" },
                        lineHeight: 1.3,
                        wordBreak: "break-word",
                        whiteSpace: "normal",
                      }}
                    >
                      {state} - {city}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>

            <Box sx={{ p: { xs: 0.5, md: 1 } }}>
              <Button
                fullWidth
                variant="contained"
                color="whatsapp"
                onClick={handleWhatsAppClick}
                size="small"
                startIcon={
                  <WhatsAppIcon
                    sx={{ fontSize: { xs: "0.8rem", md: "1rem" } }}
                  />
                }
                sx={{
                  fontSize: { xs: "0.75rem", md: "0.85rem" },
                  px: { xs: 1.5, md: 2 },
                  minHeight: { xs: "28px", md: "36px" },
                  "& .MuiButton-startIcon": {
                    marginRight: { xs: "4px", md: "6px" },
                  },
                }}
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
              py: { xs: 1, md: 1 },
              color: "text.primary",
              "&:hover": {
                background: "linear-gradient(to right, #e3f2fd, #bbdefb)",
                color: "primary.main",
              },
              display: "flex",
              justifyContent: "space-between",
              px: { xs: 1.5, md: 3 },
              fontSize: { xs: "0.9rem", md: "0.85rem" },
            }}
          >
            <Typography
              variant="button"
              sx={{
                fontWeight: "medium",
                fontSize: "inherit",
              }}
            >
              Ver a detalle
            </Typography>
            <ArrowForwardIcon
              sx={{ fontSize: { xs: "0.9rem", md: "1.2rem" } }}
            />
          </Button>
        </Box>
      </Card>

      <ImageGalleryModal
        open={isModalOpen}
        onClose={handleCloseModal}
        images={allImages}
        propertyName={`${prototypeName} - ${developmentName || condominium}`}
      />
    </>
  );
};

export default PropertyCard;
