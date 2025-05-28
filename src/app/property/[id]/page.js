"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Box,
  Container,
  IconButton,
  Fade,
  CircularProgress,
  Alert,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PropertyDetailView from "@/components/PropertyDetailView";
import BottomNavigationBar from "@/components/BottomNavigationBar";
import TopNavigationBar from "@/components/TopNavigationBar";
import { propertyService } from "@/services/propertyService";
import { useRecaptcha } from "@/hooks/useRecaptcha";

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const propertyId = params.id;

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedProperties, setRelatedProperties] = useState([]);

  // Initialize reCaptcha
  const { executeRecaptcha, isDevelopmentMode } = useRecaptcha();

  // Fetch property data when component mounts
  useEffect(() => {
    if (propertyId) {
      fetchPropertyData();
    }
  }, [propertyId]);

  const fetchPropertyData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get property data using shared service
      const {
        property: propertyData,
        relatedProperties: related,
        error: fetchError,
      } = await propertyService.fetchPropertyDetails(propertyId, false); // false = public view

      setProperty(propertyData);
      setRelatedProperties(related);

      if (fetchError) {
        setError(fetchError);
      }
    } catch (err) {
      console.error("Error fetching property:", err);
      setError("No se pudo cargar la información de la propiedad");
    } finally {
      setLoading(false);
    }
  };

  // Function to handle contact form submission
  const handleSubmitContactForm = async (userData) => {
    return await propertyService.submitContactForm(userData);
  };

  // Handle back navigation
  const handleBack = () => {
    router.back();
  };

  return (
    <>
      {/* Top Navigation Bar for Desktop/Tablet */}
      <TopNavigationBar />

      {/* Header with back button */}
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(240, 185, 43, 0.2)",
          py: 1,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              onClick={handleBack}
              sx={{
                mr: 2,
                backgroundColor: "rgba(240, 185, 43, 0.1)",
                color: "#F0B92B",
                "&:hover": {
                  backgroundColor: "rgba(240, 185, 43, 0.2)",
                  transform: "translateX(-2px)",
                },
                transition: "all 0.2s ease",
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Box>
              <Box
                sx={{
                  fontSize: { xs: "0.9rem", md: "1rem" },
                  fontWeight: 600,
                  color: "secondary.main",
                }}
              >
                Detalles de la Propiedad
              </Box>
              <Box
                sx={{
                  fontSize: { xs: "0.75rem", md: "0.85rem" },
                  color: "text.secondary",
                }}
              >
                {property?.prototypeName || "Cargando..."}
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Main content */}
      <Box sx={{ pb: { xs: 0, md: 2 } }}>
        {loading && (
          <Fade in={loading}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "60vh",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <CircularProgress size={48} sx={{ color: "#F0B92B" }} />
              <Box sx={{ color: "#37474F", fontWeight: 500 }}>
                Cargando detalles de la propiedad...
              </Box>
            </Box>
          </Fade>
        )}

        {error && !loading && (
          <Fade in={!!error}>
            <Container maxWidth="lg" sx={{ mt: 4 }}>
              <Alert
                severity="error"
                sx={{
                  borderRadius: 2,
                  "& .MuiAlert-message": {
                    fontSize: "1rem",
                  },
                }}
              >
                {error}
              </Alert>
            </Container>
          </Fade>
        )}

        {property && !loading && !error && (
          <Fade in={!!property}>
            <Box>
              <PropertyDetailView
                property={property}
                loading={false}
                error={null}
                relatedProperties={relatedProperties}
                executeRecaptcha={executeRecaptcha}
                isDevelopmentMode={isDevelopmentMode}
                submitContactForm={handleSubmitContactForm}
                returnPath="/search"
                isAdmin={false}
                propertyId={propertyId}
              />
            </Box>
          </Fade>
        )}
      </Box>

      {/* Bottom Navigation Bar for Mobile */}
      <BottomNavigationBar />
    </>
  );
}
