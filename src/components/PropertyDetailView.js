"use client";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Container,
  Typography,
  Grid,
  Divider,
  Button,
  Card,
  CardContent,
  TextField,
  CircularProgress,
  Stack,
  Skeleton,
  Alert,
  Modal,
  Fade,
  Backdrop,
  Paper,
} from "@mui/material";
import Link from "next/link";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import HomeIcon from "@mui/icons-material/Home";
import KingBedIcon from "@mui/icons-material/KingBed";
import BathtubIcon from "@mui/icons-material/Bathtub";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import SquareFootIcon from "@mui/icons-material/SquareFoot";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SendIcon from "@mui/icons-material/Send";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ForumIcon from "@mui/icons-material/Forum";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import PropertyCard from "@/components/PropertyCard";
import ImageGalleryModal from "@/components/ImageGalleryModal";
import PropertyFeature from "@/components/PropertyFeature";
import { formatBathrooms, formatArea, formatPrice } from "@/utils/formatters";
import DescriptionCard from "@/components/DescriptionCard";
import apiConfig from "@/config/apiConfig";
import {
  generatePropertyMessage,
  openWhatsAppChat,
  openMessengerChat,
} from "@/utils/contactHelpers";

/**
 * Shared Property Detail View component
 * Used by both admin preview and public property view
 */
export default function PropertyDetailView({
  property,
  loading,
  error,
  relatedProperties,
  executeRecaptcha,
  isDevelopmentMode,
  submitContactForm,
  returnPath = "/",
  isAdmin = false,
  propertyId,
}) {
  // State for the component
  const [contactMessage, setContactMessage] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactSending, setContactSending] = useState(false);
  const [contactSent, setContactSent] = useState(false);
  const [contactError, setContactError] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isHeaderWrapped, setIsHeaderWrapped] = useState(false);

  // Router for navigation
  const router = useRouter();

  // Ref for the header container to detect wrapping
  const headerRef = useRef(null);

  // Effect to detect if header text wraps
  useEffect(() => {
    const checkWrapping = () => {
      if (headerRef.current && property) {
        const container = headerRef.current;
        const prototypeNameElement = container.querySelector(".prototype-name");
        const developmentNameElement =
          container.querySelector(".development-name");

        if (prototypeNameElement && developmentNameElement) {
          const prototypeRect = prototypeNameElement.getBoundingClientRect();
          const developmentRect =
            developmentNameElement.getBoundingClientRect();

          // Se considera envuelto si el top de los elementos es significativamente diferente
          // Aumentamos el umbral a 15px para ser más tolerante con la alineación de línea de base
          const wrapped =
            Math.abs(prototypeRect.top - developmentRect.top) > 15;
          setIsHeaderWrapped(wrapped);
        } else if (prototypeNameElement && !developmentNameElement) {
          // Si solo hay nombre de prototipo, nunca está envuelto
          setIsHeaderWrapped(false);
        }
      }
    };

    // Ejecutar al montar, al cambiar la propiedad, y al redimensionar la ventana
    checkWrapping();
    window.addEventListener("resize", checkWrapping);

    // Limpieza
    return () => {
      window.removeEventListener("resize", checkWrapping);
    };
  }, [property]);

  // Use the provided property data
  const displayProperty = property;

  // Prepare images for the carousel
  const allImages = property
    ? [
        displayProperty.mainImage,
        ...(Array.isArray(displayProperty.secondaryImages)
          ? displayProperty.secondaryImages.map((img) => img.pathImage)
          : displayProperty.secondaryImages?.pathImage
          ? [displayProperty.secondaryImages.pathImage]
          : []),
      ].filter(Boolean)
    : [];

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!contactName.trim() || !contactPhone.trim() || !contactMessage.trim())
      return;

    setContactSending(true);
    setContactError(null);

    try {
      // Execute reCaptcha
      const recaptchaToken = await executeRecaptcha("contact_form");

      // In development mode, we always allow to continue
      if (!recaptchaToken && !isDevelopmentMode) {
        throw new Error(
          "No se pudo verificar el reCaptcha. Intenta nuevamente."
        );
      }

      // Prepare form data
      const userData = {
        name: contactName,
        mainPhone: contactPhone,
        comment: contactMessage,
        recaptchaToken: recaptchaToken || "development-mode-token",
        // Additional information about the property that interests the user
        propertyInfo: {
          propertyId: propertyId,
          propertyName: displayProperty?.prototypeName,
          developmentName:
            displayProperty?.developmentName || displayProperty?.condominium,
        },
      };

      // Submit the form
      await submitContactForm(userData);

      setContactSent(true);
      setContactMessage("");
      setContactName("");
      setContactPhone("");
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error sending message:", error);
      setContactError(
        error.response?.data?.message ||
          "Ocurrió un error al enviar el mensaje. Por favor intenta nuevamente."
      );
    } finally {
      setContactSending(false);
    }
  };

  const handleWhatsAppClick = () => {
    const message = generatePropertyMessage({
      name: displayProperty.prototypeName,
      development:
        displayProperty.developmentName || displayProperty.condominium,
    });
    openWhatsAppChat({ message });
  };

  const handleFacebookClick = () => {
    const message = generatePropertyMessage({
      name: displayProperty.prototypeName,
      development:
        displayProperty.developmentName || displayProperty.condominium,
      messageType: "inquiry",
    });
    openMessengerChat({ message });
  };

  const handleOpenGallery = () => {
    setIsGalleryOpen(true);
  };

  const handleCloseGallery = () => {
    setIsGalleryOpen(false);
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
  };

  // Loading state
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "calc(100vh - 100px)",
          gap: 3,
          px: 2,
        }}
      >
        <CircularProgress
          size={60}
          thickness={4}
          sx={{
            color: "primary.main",
          }}
        />
        <Typography
          variant="h6"
          sx={{
            color: "secondary.main",
            fontWeight: 500,
            textAlign: "center",
            animation: "pulse 1.5s infinite",
            "@keyframes pulse": {
              "0%": { opacity: 0.6 },
              "50%": { opacity: 1 },
              "100%": { opacity: 0.6 },
            },
          }}
        >
          Cargando información de la propiedad...
        </Typography>
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 5, mb: 5 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "60vh",
            textAlign: "center",
            px: 2,
          }}
        >
          <Card
            sx={{
              maxWidth: 500,
              width: "100%",
              borderRadius: 3,
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
              border: "1px solid",
              borderColor: "primary.light",
              overflow: "hidden",
            }}
          >
            {/* Header with gradient background */}
            <Box
              sx={{
                background: "linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)",
                py: 3,
                px: 3,
                color: "white",
                position: "relative",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(10px)",
                },
              }}
            >
              <Box sx={{ position: "relative", zIndex: 1 }}>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    bgcolor: "rgba(255, 255, 255, 0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mx: "auto",
                    mb: 2,
                    border: "3px solid rgba(255, 255, 255, 0.3)",
                  }}
                >
                  <HomeIcon
                    sx={{
                      fontSize: "2.5rem",
                      color: "white",
                      opacity: 0.9,
                    }}
                  />
                </Box>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 600,
                    fontSize: { xs: "1.3rem", md: "1.5rem" },
                    mb: 1,
                  }}
                >
                  ¡Oops! Algo salió mal
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    opacity: 0.9,
                    fontSize: { xs: "0.9rem", md: "1rem" },
                  }}
                >
                  No pudimos cargar la información
                </Typography>
              </Box>
            </Box>

            {/* Content */}
            <CardContent sx={{ p: 4 }}>
              <Typography
                variant="body1"
                sx={{
                  color: "text.secondary",
                  mb: 3,
                  lineHeight: 1.6,
                  fontSize: { xs: "0.95rem", md: "1rem" },
                }}
              >
                {error}
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  mb: 4,
                  fontSize: { xs: "0.85rem", md: "0.9rem" },
                }}
              >
                Por favor, intenta nuevamente o regresa para explorar otras
                propiedades disponibles.
              </Typography>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                sx={{ justifyContent: "center" }}
              >
                <Button
                  variant="contained"
                  startIcon={<ArrowBackIcon />}
                  component={Link}
                  href={returnPath}
                  sx={{
                    bgcolor: "primary.main",
                    color: "secondary.main",
                    px: 3,
                    py: 1.2,
                    fontWeight: 600,
                    borderRadius: 2,
                    "&:hover": {
                      bgcolor: "primary.dark",
                      transform: "translateY(-2px)",
                      boxShadow: "0 6px 20px rgba(255, 207, 64, 0.3)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  Regresar
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => window.location.reload()}
                  sx={{
                    borderColor: "primary.main",
                    color: "primary.main",
                    px: 3,
                    py: 1.2,
                    fontWeight: 500,
                    borderRadius: 2,
                    "&:hover": {
                      borderColor: "primary.dark",
                      color: "primary.dark",
                      bgcolor: "rgba(255, 207, 64, 0.05)",
                      transform: "translateY(-2px)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  Intentar de nuevo
                </Button>
              </Stack>
            </CardContent>
          </Card>

          {/* Additional help text */}
          <Typography
            variant="caption"
            sx={{
              mt: 3,
              color: "text.secondary",
              fontSize: { xs: "0.75rem", md: "0.8rem" },
              maxWidth: 400,
            }}
          >
            Si el problema persiste, no dudes en contactarnos. Estamos aquí para
            ayudarte a encontrar la propiedad perfecta.
          </Typography>
        </Box>
      </Container>
    );
  }

  // Property not found state
  if (!displayProperty) {
    return (
      <Container maxWidth="lg" sx={{ mt: 5, mb: 5 }}>
        <Box sx={{ textAlign: "center", py: 6 }}>
          <HomeIcon sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
          <Typography variant="h5" color="text.secondary" gutterBottom>
            Propiedad no encontrada
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={4}>
            No pudimos encontrar la información de esta propiedad.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<ArrowBackIcon />}
            component={Link}
            href={returnPath}
          >
            Regresar
          </Button>
        </Box>
      </Container>
    );
  }

  // The main property display
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      {/* Header */}
      <Box sx={{ mb: { xs: 3, md: 4 } }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 2,
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            {/* Smart layout that shows inline when possible, stacked when needed */}
            <Box
              ref={headerRef}
              sx={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "baseline",
                gap: 1,
                width: "100%",
              }}
            >
              <Typography
                className="prototype-name"
                variant="h4"
                component="h1"
                sx={{
                  fontSize: { xs: "1.8rem", md: "2.25rem" },
                  fontWeight: 600,
                  color: "secondary.main",
                  lineHeight: 1.2,
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                {displayProperty.prototypeName}
              </Typography>

              {!isHeaderWrapped &&
                (displayProperty.developmentName ||
                  displayProperty.condominium) && (
                  <Typography
                    className="separator"
                    sx={{
                      fontSize: { xs: "0.9rem", md: "1.1rem" },
                      color: "text.secondary",
                      userSelect: "none",
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                      mx: 0.5,
                    }}
                  >
                    |
                  </Typography>
                )}

              {(displayProperty.developmentName ||
                displayProperty.condominium) && (
                <Typography
                  className="development-name"
                  variant="h6"
                  sx={{
                    fontSize: { xs: "0.8rem", md: "1.2rem" },
                    color: "text.secondary",
                    fontWeight: 400,
                    lineHeight: 1.3,
                    whiteSpace: isHeaderWrapped ? "normal" : "nowrap",
                    overflow: isHeaderWrapped ? "visible" : "hidden",
                    textOverflow: isHeaderWrapped ? "clip" : "ellipsis",
                    minWidth: 0,
                    flexShrink: 1,
                    ...(isHeaderWrapped && {
                      width: "100%",
                      mt: 0.25,
                    }),
                  }}
                >
                  {displayProperty.developmentName ||
                    displayProperty.condominium}
                </Typography>
              )}
            </Box>
          </Box>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <LocationOnIcon
            sx={{
              mr: 1,
              fontSize: { xs: "1.3rem", md: "1.25rem" },
              color: "primary.main",
              flexShrink: 0,
            }}
          />
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: "0.875rem", md: "1rem" },
              color: "text.secondary",
            }}
          >
            {displayProperty.street}, {displayProperty.city},{" "}
            {displayProperty.state}, C.P. {displayProperty.zipCode}
          </Typography>
        </Box>
      </Box>

      {/* Image Gallery */}
      <Box
        sx={{
          position: "relative",
          mb: { xs: 3, md: 4 },
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        {allImages.length > 0 ? (
          <Grid container spacing={1} sx={{ width: "100%" }}>
            {/* Main image (takes 2/3 of the space) */}
            <Grid item xs={12} sm={8} md={8}>
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  height: { xs: "250px", sm: "320px", md: "400px" },
                  overflow: "hidden",
                  borderRadius: 1,
                  cursor: "pointer",
                  "&:hover": {
                    "& > .MuiBox-root": {
                      opacity: 1,
                    },
                  },
                }}
                onClick={handleOpenGallery}
              >
                <Box
                  component="img"
                  src={`${
                    apiConfig.baseURL
                  }/api/v1/image?path=${encodeURIComponent(allImages[0])}`}
                  alt={`Imagen principal de ${displayProperty.prototypeName}`}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 0.3s ease, opacity 0.5s ease",
                    "&:hover": {
                      transform: "scale(1.05)",
                    },
                  }}
                  onLoad={(e) => {
                    e.target.style.opacity = 1;
                  }}
                  style={{ opacity: 0 }}
                />
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height="100%"
                  animation="wave"
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    zIndex: -1,
                    bgcolor: "rgba(0, 0, 0, 0.08)",
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    color: "white",
                    padding: "8px 16px",
                    opacity: 0,
                    transition: "opacity 0.3s ease",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography variant="body2">
                    Ver todas las imágenes
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* Secondary images on the right (mosaic) */}
            <Grid item xs={12} sm={4} md={4}>
              <Grid container spacing={1} sx={{ height: "100%" }}>
                {/* Second image */}
                {allImages.length > 1 ? (
                  <Grid item xs={6} sm={12}>
                    <Box
                      sx={{
                        position: "relative",
                        width: "100%",
                        height: { xs: "120px", sm: "157px", md: "197px" },
                        overflow: "hidden",
                        borderRadius: 1,
                        cursor: "pointer",
                        "&:hover": {
                          "& > .MuiBox-root": {
                            opacity: 1,
                          },
                        },
                      }}
                      onClick={handleOpenGallery}
                    >
                      <Box
                        component="img"
                        src={`${
                          apiConfig.baseURL
                        }/api/v1/image?path=${encodeURIComponent(
                          allImages[1]
                        )}`}
                        alt={`Imagen 2 de ${displayProperty.prototypeName}`}
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          transition: "transform 0.3s ease, opacity 0.5s ease",
                          "&:hover": {
                            transform: "scale(1.05)",
                          },
                        }}
                        onLoad={(e) => {
                          e.target.style.opacity = 1;
                        }}
                        style={{ opacity: 0 }}
                      />
                      <Skeleton
                        variant="rectangular"
                        width="100%"
                        height="100%"
                        animation="wave"
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          zIndex: -1,
                          bgcolor: "rgba(0, 0, 0, 0.08)",
                        }}
                      />
                      <Box
                        sx={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          right: 0,
                          backgroundColor: "rgba(0, 0, 0, 0.5)",
                          color: "white",
                          padding: "4px 8px",
                          opacity: 0,
                          transition: "opacity 0.3s ease",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
                          Ver galería
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                ) : null}

                {/* Third image */}
                {allImages.length > 2 ? (
                  <Grid item xs={6} sm={12}>
                    <Box
                      sx={{
                        position: "relative",
                        width: "100%",
                        height: { xs: "120px", sm: "157px", md: "197px" },
                        overflow: "hidden",
                        borderRadius: 1,
                        cursor: "pointer",
                        "&:hover": {
                          "& > .MuiBox-root": {
                            opacity: 1,
                          },
                        },
                      }}
                      onClick={handleOpenGallery}
                    >
                      {allImages.length > 3 ? (
                        <>
                          <Box
                            component="img"
                            src={`${
                              apiConfig.baseURL
                            }/api/v1/image?path=${encodeURIComponent(
                              allImages[2]
                            )}`}
                            alt={`Imagen 3 de ${displayProperty.prototypeName}`}
                            sx={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              filter: "brightness(0.7)",
                              transition: "transform 0.3s ease",
                              "&:hover": {
                                transform: "scale(1.05)",
                              },
                            }}
                          />
                          <Box
                            sx={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              backgroundColor: "rgba(0, 0, 0, 0.4)",
                              color: "white",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexDirection: "column",
                            }}
                          >
                            <Typography
                              variant="h6"
                              sx={{
                                fontWeight: "bold",
                                fontSize: { xs: "1.2rem", md: "1.5rem" },
                              }}
                            >
                              +{allImages.length - 3}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                fontSize: { xs: "0.7rem", md: "0.8rem" },
                                textAlign: "center",
                              }}
                            >
                              imágenes más
                            </Typography>
                          </Box>
                        </>
                      ) : (
                        <>
                          <Box
                            component="img"
                            src={`${
                              apiConfig.baseURL
                            }/api/v1/image?path=${encodeURIComponent(
                              allImages[2]
                            )}`}
                            alt={`Imagen 3 de ${displayProperty.prototypeName}`}
                            sx={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              transition: "transform 0.3s ease",
                              "&:hover": {
                                transform: "scale(1.05)",
                              },
                            }}
                          />
                          <Box
                            sx={{
                              position: "absolute",
                              bottom: 0,
                              left: 0,
                              right: 0,
                              backgroundColor: "rgba(0, 0, 0, 0.5)",
                              color: "white",
                              padding: "4px 8px",
                              opacity: 0,
                              transition: "opacity 0.3s ease",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{ fontSize: "0.8rem" }}
                            >
                              Ver galería
                            </Typography>
                          </Box>
                        </>
                      )}
                    </Box>
                  </Grid>
                ) : null}
              </Grid>
            </Grid>
          </Grid>
        ) : (
          <Box
            sx={{
              width: "100%",
              height: { xs: "250px", sm: "320px", md: "400px" },
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#f5f5f5",
              borderRadius: 2,
            }}
          >
            <HomeIcon
              sx={{
                fontSize: { xs: 40, md: 60 },
                color: "text.secondary",
                mb: 2,
              }}
            />
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{
                fontSize: { xs: "1rem", md: "1.25rem" },
                px: 2,
                textAlign: "center",
              }}
            >
              {displayProperty.isMock
                ? "Imagen de muestra no disponible"
                : "No hay imágenes disponibles"}
            </Typography>
          </Box>
        )}
      </Box>

      <Grid container spacing={{ xs: 2, md: 4 }}>
        {/* Main information and descriptions */}
        <Grid item xs={12} md={8}>
          {/* Main features */}
          <Card
            sx={{
              mb: { xs: 2, md: 3 },
              boxShadow: 2,
              borderRadius: 2,
              overflow: "hidden",
              border: "1px solid",
              borderColor: "primary.light",
            }}
          >
            <CardContent sx={{ px: { xs: 2, md: 3 }, py: { xs: 2.5, md: 3 } }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: { xs: "0.8rem", sm: "1.1rem", md: "1.25rem" },
                    fontWeight: 600,
                    position: "relative",
                    color: "secondary.main",
                    mb: 0,
                    "& .full-text": {
                      display: { xs: "none", md: "inline" },
                      "@media (min-width: 375px)": {
                        display: "inline",
                      },
                    },
                    "& .short-text": {
                      display: { xs: "inline", md: "none" },
                      "@media (min-width: 375px)": {
                        display: "none",
                      },
                    },
                  }}
                >
                  <span className="short-text">Adquierela por:</span>
                  <span className="full-text">Adquiere esta propiedad por</span>
                </Typography>

                <Typography
                  variant="h4"
                  sx={{
                    fontSize: { xs: "1.3rem", sm: "1.8rem", md: "2.2rem" },
                    fontWeight: 700,
                    color: "positiveAccent.main",
                    lineHeight: 1.2,
                  }}
                >
                  {formatPrice(displayProperty.price)}
                </Typography>
              </Box>
              <Divider sx={{ mb: 3 }} />

              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  fontSize: { xs: "0.85rem", md: "0.95rem" },
                }}
              >
                Con las siguientes características:
              </Typography>

              <Grid
                container
                spacing={{ xs: 1.5, md: 3.5 }}
                sx={{ mt: { xs: 1, md: 1 } }}
              >
                <Grid item xs={3} sm={3}>
                  <PropertyFeature
                    icon={<KingBedIcon />}
                    value={displayProperty.bedroom}
                    label="Recámaras"
                  />
                </Grid>
                <Grid item xs={3} sm={3}>
                  <PropertyFeature
                    icon={<BathtubIcon />}
                    value={formatBathrooms(
                      displayProperty.bathroom,
                      displayProperty.halfBathroom
                    )}
                    label="Baños"
                  />
                </Grid>
                <Grid item xs={3} sm={3}>
                  <PropertyFeature
                    icon={<DirectionsCarIcon />}
                    value={displayProperty.parking}
                    label="Estacionamiento"
                  />
                </Grid>
                <Grid item xs={3} sm={3}>
                  <PropertyFeature
                    icon={<SquareFootIcon />}
                    value={formatArea(displayProperty.size)}
                    label="Superficie"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Contact card for WhatsApp and Messenger */}
          <Card
            sx={{
              mb: { xs: 3, md: 4 },
              boxShadow: 3,
              p: { xs: 1.5, md: 2 },
              background:
                "linear-gradient(135deg, #FFFFFF 0%, rgba(255, 207, 64, 0.15) 100%)",
              position: "relative",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <CardContent
              sx={{
                px: { xs: 2, md: 3 },
                py: { xs: 2, md: 3 },
                color: "white",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 2.5,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: { xs: "1.1rem", md: "1.25rem" },
                    fontWeight: 600,
                    flex: 1,
                    color: "secondary.main",
                  }}
                >
                  ¿Te interesa esta propiedad?
                </Typography>
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ alignItems: "center" }}
                >
                  <ForumIcon
                    sx={{
                      fontSize: { xs: "1.8rem", md: "2rem" },
                      color: "custom.facebookBlue",
                    }}
                  />
                  <WhatsAppIcon
                    sx={{
                      fontSize: { xs: "1.8rem", md: "2rem" },
                      color: "success.main",
                    }}
                  />
                </Stack>
              </Box>

              <Typography
                variant="body2"
                sx={{
                  mb: 2.5,
                  color: "text.secondary",
                  fontSize: { xs: "0.85rem", md: "0.9rem" },
                }}
              >
                Selecciona tu método de contacto preferido para recibir
                información sobre esta propiedad:
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    startIcon={
                      <ForumIcon
                        sx={{
                          fontSize: { xs: "1.1rem", md: "1.25rem" },
                          color: "white",
                        }}
                      />
                    }
                    onClick={handleFacebookClick}
                    sx={{
                      py: { xs: 1, md: 1.3 },
                      fontSize: { xs: "0.8rem", md: "0.9rem" },
                      fontWeight: 500,
                      boxShadow: 2,
                      bgcolor: "custom.facebookBlue",
                      color: "white",
                      "&:hover": {
                        bgcolor: "#0b5fcc",
                        boxShadow: 4,
                        transform: "translateY(-2px)",
                      },
                      transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    }}
                  >
                    Messenger
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    variant="contained"
                    color="success"
                    fullWidth
                    startIcon={
                      <WhatsAppIcon
                        sx={{
                          fontSize: { xs: "1.1rem", md: "1.25rem" },
                          color: "white",
                        }}
                      />
                    }
                    onClick={handleWhatsAppClick}
                    sx={{
                      py: { xs: 1, md: 1.3 },
                      fontSize: { xs: "0.8rem", md: "0.9rem" },
                      fontWeight: 500,
                      boxShadow: 2,
                      bgcolor: "custom.whatsappGreen",
                      color: "white",
                      "&:hover": {
                        bgcolor: "#128C7E",
                        boxShadow: 4,
                        transform: "translateY(-2px)",
                      },
                      transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    }}
                  >
                    WhatsApp
                  </Button>
                </Grid>
              </Grid>

              <Typography
                variant="caption"
                align="center"
                sx={{
                  display: "block",
                  mt: 2,
                  fontSize: { xs: "0.75rem", md: "0.8rem" },
                  color: "text.secondary",
                }}
              >
                Respuesta rápida • Atención personalizada • Asistencia inmediata
              </Typography>
            </CardContent>
          </Card>

          {/* Descriptions */}
          {displayProperty.descriptions && (
            <Box sx={{ mb: { xs: 3, md: 4 } }}>
              <Typography
                variant="h5"
                gutterBottom
                sx={{
                  fontSize: { xs: "1.3rem", md: "1.5rem" },
                  fontWeight: 600,
                  mb: { xs: 2, md: 3 },
                  textAlign: "center",
                  position: "relative",
                  color: "secondary.main",
                  "&:after": {
                    content: '""',
                    position: "absolute",
                    bottom: -8,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "60px",
                    height: "3px",
                    backgroundColor: "primary.main",
                    borderRadius: "2px",
                  },
                }}
              >
                Acerca de esta propiedad
              </Typography>

              {displayProperty.descriptions.map((desc, index) => (
                <DescriptionCard
                  key={index}
                  title={desc.title}
                  description={desc.description}
                  index={index}
                />
              ))}
            </Box>
          )}
        </Grid>

        {/* Sidebar with contact form */}
        <Grid item xs={12} md={4}>
          <Box sx={{ position: { xs: "static", md: "sticky" }, top: 20 }}>
            {/* Contact card */}
            <Card
              sx={{
                mb: { xs: 3, md: 4 },
                borderRadius: 2,
                boxShadow: 2,
                border: "1px solid",
                borderColor: "primary.light",
              }}
            >
              <CardContent sx={{ px: { xs: 2, md: 3 }, py: { xs: 2, md: 3 } }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    fontSize: { xs: "1.1rem", md: "1.25rem" },
                    color: "secondary.main",
                    fontWeight: 600,
                    position: "relative",
                    pb: 1,
                    "&:after": {
                      content: '""',
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      width: "40px",
                      height: "2px",
                      backgroundColor: "primary.main",
                      borderRadius: "2px",
                    },
                  }}
                >
                  ¿Quieres recibir asesoría personalizada?
                </Typography>

                <form id="contactForm" onSubmit={handleContactSubmit}>
                  <TextField
                    fullWidth
                    label="Nombre completo"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    margin="normal"
                    required
                    disabled={contactSending || contactSent}
                    InputProps={{
                      sx: { fontSize: { xs: "0.9rem", md: "1rem" } },
                    }}
                    InputLabelProps={{
                      sx: { fontSize: { xs: "0.9rem", md: "1rem" } },
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "&.Mui-focused fieldset": {
                          borderColor: "primary.main",
                        },
                      },
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: "primary.main",
                      },
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Número telefónico"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    margin="normal"
                    required
                    disabled={contactSending || contactSent}
                    InputProps={{
                      sx: { fontSize: { xs: "0.9rem", md: "1rem" } },
                    }}
                    InputLabelProps={{
                      sx: { fontSize: { xs: "0.9rem", md: "1rem" } },
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "&.Mui-focused fieldset": {
                          borderColor: "primary.main",
                        },
                      },
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: "primary.main",
                      },
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Escribe tu mensaje aquí"
                    multiline
                    rows={4}
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    margin="normal"
                    required
                    disabled={contactSending || contactSent}
                    InputProps={{
                      sx: { fontSize: { xs: "0.9rem", md: "1rem" } },
                    }}
                    InputLabelProps={{
                      sx: { fontSize: { xs: "0.9rem", md: "1rem" } },
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "&.Mui-focused fieldset": {
                          borderColor: "primary.main",
                        },
                      },
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: "primary.main",
                      },
                    }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    startIcon={
                      <SendIcon
                        sx={{ fontSize: { xs: "1.1rem", md: "1.25rem" } }}
                      />
                    }
                    disabled={
                      !contactName.trim() ||
                      !contactPhone.trim() ||
                      !contactMessage.trim() ||
                      contactSending ||
                      contactSent
                    }
                    sx={{
                      mt: 2,
                      py: { xs: 1, md: 1.5 },
                      fontSize: { xs: "0.9rem", md: "1rem" },
                      bgcolor: "primary.main",
                      color: "secondary.main",
                      fontWeight: 600,
                      "&:hover": {
                        bgcolor: "primary.dark",
                      },
                      "&.Mui-disabled": {
                        bgcolor: "primary.light",
                        color: "secondary.light",
                      },
                    }}
                  >
                    {contactSending
                      ? "Enviando..."
                      : contactSent
                      ? "Mensaje enviado"
                      : "Enviar mensaje"}
                  </Button>

                  {contactError && (
                    <Alert
                      severity="error"
                      sx={{
                        mt: 2,
                        fontSize: { xs: "0.8rem", md: "0.9rem" },
                      }}
                    >
                      {contactError}
                    </Alert>
                  )}
                </form>
              </CardContent>
            </Card>
          </Box>
        </Grid>
      </Grid>

      {/* Related properties */}
      {relatedProperties.length > 0 && (
        <Box sx={{ mt: { xs: 4, md: 6 } }}>
          <Typography
            variant="h5"
            gutterBottom
            sx={{ fontSize: { xs: "1.3rem", md: "1.5rem" }, fontWeight: 600 }}
          >
            Propiedades similares
          </Typography>
          <Divider sx={{ mb: { xs: 2, md: 4 } }} />

          <Grid container spacing={3}>
            {relatedProperties.map((relatedProperty) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                key={relatedProperty.prototypeId}
              >
                <PropertyCard
                  property={relatedProperty}
                  onDetailClick={() => {
                    if (relatedProperty.prototypeId) {
                      router.push(
                        `/prototypeView/${relatedProperty.prototypeId}`
                      );
                    }
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Image gallery modal */}
      <ImageGalleryModal
        open={isGalleryOpen}
        onClose={handleCloseGallery}
        images={allImages}
        propertyName={`${displayProperty.prototypeName} - ${
          displayProperty.developmentName || displayProperty.condominium
        }`}
      />

      {/* Success modal */}
      <Modal
        aria-labelledby="success-modal-title"
        aria-describedby="success-modal-description"
        open={showSuccessModal}
        onClose={handleCloseSuccessModal}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={showSuccessModal}>
          <Paper
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: { xs: "85%", sm: "70%", md: "450px" },
              bgcolor: "background.paper",
              borderRadius: 3,
              boxShadow: 24,
              p: { xs: 3, sm: 4 },
              outline: "none",
              border: "1px solid",
              borderColor: "primary.light",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <Box
                sx={{
                  mb: 2,
                  width: { xs: 70, sm: 80 },
                  height: { xs: 70, sm: 80 },
                  borderRadius: "50%",
                  bgcolor: "primary.main",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  boxShadow: "0 4px 12px rgba(255, 207, 64, 0.3)",
                }}
              >
                <CheckCircleOutlineIcon
                  sx={{
                    fontSize: { xs: "2.5rem", sm: "3rem" },
                    color: "white",
                  }}
                />
              </Box>
              <Typography
                id="success-modal-title"
                variant="h5"
                component="h2"
                gutterBottom
                sx={{
                  fontSize: { xs: "1.3rem", sm: "1.5rem" },
                  fontWeight: 600,
                  color: "secondary.main",
                  mb: 1,
                }}
              >
                ¡Mensaje enviado con éxito!
              </Typography>
              <Typography
                id="success-modal-description"
                sx={{
                  mt: 1,
                  color: "text.secondary",
                  fontSize: { xs: "0.9rem", sm: "1rem" },
                  lineHeight: 1.6,
                  mb: 3,
                }}
              >
                Gracias por tu interés en esta propiedad. Nuestro equipo te
                contactará muy pronto para brindarte toda la información que
                necesitas.
              </Typography>
              <Button
                variant="contained"
                onClick={handleCloseSuccessModal}
                sx={{
                  bgcolor: "primary.main",
                  color: "secondary.main",
                  px: { xs: 3, sm: 4 },
                  py: 1,
                  fontWeight: 500,
                  "&:hover": {
                    bgcolor: "primary.dark",
                  },
                }}
              >
                Entendido
              </Button>
            </Box>
          </Paper>
        </Fade>
      </Modal>
    </Container>
  );
}
