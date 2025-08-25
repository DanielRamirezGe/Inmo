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
  Chip,
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
import { AWS_IMAGE_CONFIG } from "@/config/imageConfig";

const PropertyCard = ({ property, onDetailClick, compact = false }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

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
    developmentId,
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
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);

    // Separar el símbolo de moneda y el valor
    const [amount] = formattedPrice.split("MXN");

    return (
      <>
        {amount.trim()}
        <span style={{ fontSize: "0.75em", marginLeft: "3px", opacity: 0.8 }}>
          MXN
        </span>
      </>
    );
  };

  return (
    <>
      <Card
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          minWidth: { xs: "100%", sm: "320px" },
          maxWidth: "100%",
          overflow: "hidden",
          borderRadius: { xs: 2, md: 3 },
          background: "linear-gradient(145deg, #ffffff 0%, #fefcf7 100%)",
          border: "1px solid rgba(240, 185, 43, 0.4)",
          boxShadow: isHovered
            ? "0 12px 40px rgba(240, 185, 43, 0.15), 0 4px 16px rgba(0, 0, 0, 0.1)"
            : "0 4px 20px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(240, 185, 43, 0.05)",
          transform: isHovered ? "translateY(-2px)" : "translateY(0)",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          position: "relative",
          "&:hover": {
            border: "1px solid rgba(240, 185, 43, 0.7)",
          },
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "3px",
            background:
              "linear-gradient(90deg, #F0B92B 0%, #FFD700 50%, #F0B92B 100%)",
            opacity: isHovered ? 1 : 0.8,
            transition: "opacity 0.3s ease",
          },
          "&::after": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "linear-gradient(135deg, rgba(240, 185, 43, 0.02) 0%, transparent 30%, transparent 70%, rgba(240, 185, 43, 0.02) 100%)",
            pointerEvents: "none",
            opacity: isHovered ? 0.8 : 0.4,
            transition: "opacity 0.3s ease",
          },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: { xs: 1, md: 1.25 },
            pb: { xs: 0.75, md: 1 },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderBottom: "1px solid rgba(240, 185, 43, 0.15)",
            background:
              "linear-gradient(135deg, rgba(240, 185, 43, 0.05) 0%, rgba(255, 255, 255, 0.9) 100%)",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontSize: { xs: "0.95rem", sm: "1.1rem", md: "1.05rem" },
              textAlign: "center",
              width: "100%",
              fontWeight: 700,
              color: "#2C3E50",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              lineHeight: 1.3,
              letterSpacing: "0.02em",
            }}
          >
            {prototypeName}{" "}
            {developmentName || condominium || city
              ? ` - ${developmentName || condominium || city}`
              : ""}
          </Typography>
        </Box>

        {/* Contenido principal */}
        <Box sx={{ display: "flex", flex: 1 }}>
          {/* Columna izquierda - Imagen */}
          <Box
            sx={{
              width: "60%",
              cursor: "pointer",
              position: "relative",
              overflow: "hidden",
              "&:hover": {
                "& .image-overlay": {
                  opacity: 1,
                },
                "& .card-image": {
                  transform: "scale(1.05)",
                },
              },
            }}
            onClick={handleImageClick}
          >
            {mainImage && !property.isMock ? (
              <>
                <CardMedia
                  component="img"
                  className="card-image"
                  sx={{
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                  image={AWS_IMAGE_CONFIG.getImageUrl(mainImage)}
                  alt={prototypeName}
                />
                <Box
                  className="image-overlay"
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background:
                      "linear-gradient(45deg, rgba(240, 185, 43, 0.1) 0%, rgba(0, 0, 0, 0.1) 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: 0,
                    transition: "opacity 0.3s ease",
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      color: "white",
                      backgroundColor: "rgba(0, 0, 0, 0.7)",
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 2,
                      fontSize: { xs: "0.7rem", md: "0.75rem" },
                      fontWeight: 600,
                    }}
                  >
                    Ver galería
                  </Typography>
                </Box>

                {/* Etiqueta de Casa Usada en footer de imagen */}
                {developmentId === null && (
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background:
                        "linear-gradient(135deg, rgba(240, 185, 43, 0.95) 0%, rgba(230, 168, 32, 0.98) 100%)",
                      backdropFilter: "blur(8px)",
                      borderTop: "1px solid rgba(255, 255, 255, 0.2)",
                      py: { xs: 0.5, md: 0.75 },
                      px: 1,
                      zIndex: 5,
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#1B2631",
                        fontSize: { xs: "0.7rem", md: "0.75rem" },
                        fontWeight: 700,
                        textAlign: "center",
                        display: "block",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        textShadow: "0 1px 2px rgba(255, 255, 255, 0.3)",
                        lineHeight: 1,
                      }}
                    >
                      Compra inmediata - Casa Usada
                    </Typography>
                  </Box>
                )}
              </>
            ) : (
              <Box
                sx={{
                  height: "100%",
                  background:
                    "linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  p: { xs: 1, md: 2 },
                  border: "2px dashed rgba(240, 185, 43, 0.3)",
                }}
              >
                <HomeIcon
                  sx={{
                    fontSize: { xs: 32, md: 44 },
                    color: "#F0B92B",
                    mb: 0.5,
                    opacity: 0.8,
                  }}
                />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  align="center"
                  sx={{
                    fontSize: { xs: "0.65rem", md: "0.75rem" },
                    fontWeight: 500,
                  }}
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
              background:
                "linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(254, 252, 247, 0.9) 100%)",
            }}
          >
            <CardContent
              sx={{
                py: { xs: 0.5, md: 0.75 },
                px: { xs: 0.75, md: 1.25 },
                flex: 1,
                cursor: "pointer",
                borderRadius: 1,
                "&:hover": {
                  backgroundColor: "rgba(240, 185, 43, 0.06)",
                  boxShadow: "inset 0 0 0 1px rgba(240, 185, 43, 0.25)",
                },
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
              onClick={onDetailClick}
            >
              {/* Precio destacado */}
              <Box
                sx={{
                  mb: { xs: 0.5, md: 0.75 },
                  textAlign: "center",
                  position: "relative",
                }}
              >
                <Chip
                  label={formatPrice(price)}
                  sx={{
                    background:
                      "linear-gradient(135deg, rgba(240, 185, 43, 0.15) 0%, rgba(255, 215, 0, 0.2) 100%)",
                    color: "#1B2631",
                    fontWeight: 700,
                    fontSize: { xs: "0.75rem", md: "0.85rem" },
                    height: { xs: 24, md: 28 },
                    borderRadius: 2,
                    border: "1px solid rgba(240, 185, 43, 0.6)",
                    boxShadow: "0 2px 8px rgba(240, 185, 43, 0.2)",
                    "&:hover": {
                      transform: "scale(1.02)",
                      background:
                        "linear-gradient(135deg, rgba(240, 185, 43, 0.25) 0%, rgba(255, 215, 0, 0.3) 100%)",
                      boxShadow: "0 4px 12px rgba(240, 185, 43, 0.3)",
                      border: "1px solid rgba(240, 185, 43, 0.8)",
                      color: "#0F1419",
                    },
                    transition: "all 0.2s ease",
                  }}
                />
              </Box>

              <Grid container spacing={0.25}>
                <Grid item xs={12}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.4,
                      mb: 0.25,
                      p: { xs: 0.25, md: 0.4 },
                      borderRadius: 1,
                      "&:hover": {
                        backgroundColor: "rgba(240, 185, 43, 0.08)",
                        "& .feature-icon": {
                          color: "#F0B92B",
                          transform: "scale(1.1)",
                        },
                      },
                      transition: "all 0.2s ease",
                    }}
                  >
                    <HomeIcon
                      className="feature-icon"
                      sx={{
                        fontSize: { xs: "0.85rem", md: "1rem" },
                        color: "#34495E",
                        transition: "all 0.2s ease",
                      }}
                    />
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: { xs: "0.65rem", md: "0.75rem" },
                        fontWeight: 600,
                        color: "#2C3E50",
                      }}
                    >
                      {size} m²
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.4,
                      mb: 0.25,
                      p: { xs: 0.25, md: 0.4 },
                      borderRadius: 1,
                      "&:hover": {
                        backgroundColor: "rgba(240, 185, 43, 0.08)",
                        "& .feature-icon": {
                          color: "#F0B92B",
                          transform: "scale(1.1)",
                        },
                      },
                      transition: "all 0.2s ease",
                    }}
                  >
                    <KingBedIcon
                      className="feature-icon"
                      sx={{
                        fontSize: { xs: "0.85rem", md: "1rem" },
                        color: "#34495E",
                        transition: "all 0.2s ease",
                      }}
                    />
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: { xs: "0.65rem", md: "0.75rem" },
                        fontWeight: 600,
                        color: "#2C3E50",
                      }}
                    >
                      {bedroom} rec
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.4,
                      mb: 0.25,
                      p: { xs: 0.25, md: 0.4 },
                      borderRadius: 1,
                      "&:hover": {
                        backgroundColor: "rgba(240, 185, 43, 0.08)",
                        "& .feature-icon": {
                          color: "#F0B92B",
                          transform: "scale(1.1)",
                        },
                      },
                      transition: "all 0.2s ease",
                    }}
                  >
                    <BathtubIcon
                      className="feature-icon"
                      sx={{
                        fontSize: { xs: "0.85rem", md: "1rem" },
                        color: "#34495E",
                        transition: "all 0.2s ease",
                      }}
                    />
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: { xs: "0.65rem", md: "0.75rem" },
                        fontWeight: 600,
                        color: "#2C3E50",
                      }}
                    >
                      {bathroom}
                      {halfBathroom === "1" ? ".5" : ""} baños
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.4,
                      mb: 0.25,
                      p: { xs: 0.25, md: 0.4 },
                      borderRadius: 1,
                      "&:hover": {
                        backgroundColor: "rgba(240, 185, 43, 0.08)",
                        "& .feature-icon": {
                          color: "#F0B92B",
                          transform: "scale(1.1)",
                        },
                      },
                      transition: "all 0.2s ease",
                    }}
                  >
                    <DirectionsCarIcon
                      className="feature-icon"
                      sx={{
                        fontSize: { xs: "0.85rem", md: "1rem" },
                        color: "#34495E",
                        transition: "all 0.2s ease",
                      }}
                    />
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: { xs: "0.65rem", md: "0.75rem" },
                        fontWeight: 600,
                        color: "#2C3E50",
                      }}
                    >
                      {parking} est
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 0.4,
                      p: { xs: 0.25, md: 0.4 },
                      borderRadius: 1,
                      "&:hover": {
                        backgroundColor: "rgba(240, 185, 43, 0.08)",
                        "& .feature-icon": {
                          color: "#F0B92B",
                          transform: "scale(1.1)",
                        },
                      },
                      transition: "all 0.2s ease",
                    }}
                  >
                    <LocationOnIcon
                      className="feature-icon"
                      sx={{
                        fontSize: { xs: "0.85rem", md: "1rem" },
                        color: "#34495E",
                        mt: "1px",
                        transition: "all 0.2s ease",
                      }}
                    />
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#5D6D7E",
                        fontSize: { xs: "0.6rem", md: "0.7rem" },
                        fontWeight: 500,
                        lineHeight: 1.2,
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

            <Box sx={{ p: { xs: 0.5, md: 0.75 } }}>
              <Button
                fullWidth
                variant="contained"
                onClick={handleWhatsAppClick}
                size="small"
                startIcon={
                  <WhatsAppIcon
                    sx={{ fontSize: { xs: "0.85rem", md: "1rem" } }}
                  />
                }
                sx={{
                  fontSize: { xs: "0.7rem", md: "0.8rem" },
                  fontWeight: 600,
                  px: { xs: 1, md: 1.5 },
                  py: { xs: 0.5, md: 0.75 },
                  minHeight: { xs: "28px", md: "36px" },
                  borderRadius: 2,
                  backgroundColor: "#128C7E",
                  color: "white",
                  boxShadow: "0 3px 12px rgba(18, 140, 126, 0.3)",
                  "&:hover": {
                    backgroundColor: "#075E54",
                    boxShadow: "0 6px 20px rgba(7, 94, 84, 0.4)",
                    transform: "translateY(-1px)",
                  },
                  "& .MuiButton-startIcon": {
                    marginRight: { xs: "4px", md: "6px" },
                  },
                  transition: "all 0.2s ease",
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
            borderTop: "1px solid rgba(240, 185, 43, 0.15)",
            background:
              "linear-gradient(135deg, rgba(240, 185, 43, 0.08) 0%, rgba(255, 255, 255, 0.95) 100%)",
          }}
        >
          <Button
            fullWidth
            onClick={onDetailClick}
            sx={{
              py: { xs: 0.75, md: 1 },
              color: "#2C3E50",
              fontWeight: 600,
              "&:hover": {
                background:
                  "linear-gradient(135deg, rgba(240, 185, 43, 0.12) 0%, rgba(240, 185, 43, 0.06) 100%)",
                color: "#F0B92B",
                "& .arrow-icon": {
                  transform: "translateX(4px)",
                },
              },
              display: "flex",
              justifyContent: "space-between",
              px: { xs: 1.5, md: 2.5 },
              fontSize: { xs: "0.8rem", md: "0.85rem" },
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            <Typography
              variant="button"
              sx={{
                fontWeight: "inherit",
                fontSize: "inherit",
                letterSpacing: "0.02em",
              }}
            >
              Ver detalles
            </Typography>
            <ArrowForwardIcon
              className="arrow-icon"
              sx={{
                fontSize: { xs: "0.9rem", md: "1.1rem" },
                transition: "transform 0.2s ease",
              }}
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
