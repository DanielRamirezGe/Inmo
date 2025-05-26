"use client";
import React, { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Container,
  Grid,
  Box,
  CircularProgress,
  Alert,
  Typography,
  Button,
  Card,
  CardContent,
  Breadcrumbs,
  Link as MuiLink,
} from "@mui/material";
import Link from "next/link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchIcon from "@mui/icons-material/Search";
import PropertyCard from "@/components/PropertyCard/PropertyCard";
import { api } from "@/services/api";
import { usePublicAxios } from "@/utils/axiosMiddleware";

// Componente interno que usa useSearchParams
const PrototypeResultsContent = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();
  const axiosInstance = usePublicAxios();

  // Usar refs para controlar la carga
  const mountedRef = useRef(true);

  // Component lifecycle
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      setTimeout(() => {
        mountedRef.current = false;
      }, 100);
    };
  }, []);

  // Función para cargar resultados de búsqueda
  const loadSearchResults = async (searchText) => {
    if (!axiosInstance || !searchText?.trim()) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await api.getPublicSearchProperties(
        axiosInstance,
        searchText
      );

      if (response?.data) {
        setProperties(response.data);
      }
    } catch (err) {
      console.error("Error fetching search results:", err);
      setError(
        "No se pudieron cargar los resultados de búsqueda. Intenta de nuevo más tarde."
      );
    } finally {
      setLoading(false);
    }
  };

  // Effect para obtener el término de búsqueda y cargar resultados
  useEffect(() => {
    const searchText = searchParams.get("q");
    if (searchText) {
      setSearchTerm(searchText);
      loadSearchResults(searchText);
    } else {
      setLoading(false);
      setError("No se proporcionó un término de búsqueda.");
    }
  }, [searchParams, axiosInstance]);

  const handleDetailClick = (propertyId) => {
    if (propertyId) {
      router.push(`/prototypeView/${propertyId}`);
    }
  };

  const handleRetry = () => {
    if (searchTerm) {
      loadSearchResults(searchTerm);
    }
  };

  const handleBackToHome = () => {
    router.push("/");
  };

  return (
    <Container
      maxWidth="lg"
      sx={{ mt: { xs: 2, md: 4 }, mb: { xs: 4, md: 8 } }}
    >
      {/* Card del encabezado con botón de regreso */}
      <Card
        sx={{
          mb: { xs: 3, md: 4 },
          borderRadius: 3,
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
          border: "1px solid",
          borderColor: "primary.light",
          overflow: "hidden",
          background:
            "linear-gradient(135deg, #FFFFFF 0%, rgba(255, 207, 64, 0.05) 100%)",
        }}
      >
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          {/* Breadcrumbs */}

          {/* Botón de regreso y encabezado */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", sm: "center" },
              gap: { xs: 2, sm: 3 },
              mb: { xs: 2, md: 3 },
            }}
          >
            {/* Encabezado principal */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flex: 1,
                justifyContent: { xs: "flex-start", sm: "center" },
              }}
            >
              <SearchIcon
                sx={{
                  fontSize: { xs: "1.8rem", md: "2.2rem" },
                  color: "primary.main",
                  mr: { xs: 1, md: 1.5 },
                }}
              />
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  fontSize: { xs: "1.6rem", md: "2.25rem" },
                  fontWeight: 700,
                  color: "secondary.main",
                  textAlign: { xs: "left", sm: "center" },
                }}
              >
                Resultados de búsqueda
              </Typography>
            </Box>
          </Box>

          {/* Información de búsqueda */}
          <Box sx={{ textAlign: { xs: "left", sm: "center" } }}>
            {searchTerm && (
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{
                  fontSize: { xs: "0.9rem", md: "1.05rem" },
                  mb: 1,
                  fontWeight: 500,
                }}
              >
                Búsqueda:{" "}
                <span style={{ color: "#F0B92B", fontWeight: 600 }}>
                  "{searchTerm}"
                </span>
              </Typography>
            )}

            {!loading && properties.length > 0 && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  fontSize: { xs: "0.85rem", md: "0.95rem" },
                  opacity: 0.8,
                }}
              >
                Se encontraron <strong>{properties.length}</strong> propiedades
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Estados de carga, error y contenido */}
      {loading && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "40vh",
          }}
        >
          <CircularProgress />
        </Box>
      )}

      {error && !loading && (
        <Box textAlign="center" sx={{ my: 5 }}>
          <Alert severity="error" sx={{ mb: 2, justifyContent: "center" }}>
            {error}
          </Alert>
          {searchTerm && (
            <Button variant="outlined" onClick={handleRetry}>
              Reintentar búsqueda
            </Button>
          )}
        </Box>
      )}

      {!loading && !error && properties.length === 0 && searchTerm && (
        <Box
          sx={{
            textAlign: "center",
            py: 6,
            px: 2,
          }}
        >
          <SearchIcon
            sx={{
              fontSize: { xs: "3rem", md: "4rem" },
              color: "text.secondary",
              mb: 2,
            }}
          />
          <Typography
            variant="h5"
            color="text.secondary"
            gutterBottom
            sx={{ fontSize: { xs: "1.3rem", md: "1.5rem" } }}
          >
            No se encontraron resultados
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              mb: 4,
              fontSize: { xs: "0.9rem", md: "1rem" },
            }}
          >
            No encontramos propiedades que coincidan con "{searchTerm}".
            <br />
            Intenta con otros términos de búsqueda.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleBackToHome}
            sx={{
              px: 4,
              py: 1.5,
              fontSize: { xs: "0.9rem", md: "1rem" },
            }}
          >
            Ver todas las propiedades
          </Button>
        </Box>
      )}

      {!loading && !error && properties.length > 0 && (
        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
          {properties.map((property, index) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              key={
                property.prototypeId
                  ? `${property.prototypeId}-${index}`
                  : `search-result-${index}`
              }
            >
              <PropertyCard
                property={property}
                onDetailClick={() => handleDetailClick(property.prototypeId)}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

// Componente principal con Suspense
const PrototypeResultsPage = () => {
  return (
    <Suspense
      fallback={
        <Container
          maxWidth="lg"
          sx={{ mt: { xs: 2, md: 4 }, mb: { xs: 4, md: 8 } }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "60vh",
            }}
          >
            <CircularProgress size={60} />
          </Box>
        </Container>
      }
    >
      <PrototypeResultsContent />
    </Suspense>
  );
};

export default PrototypeResultsPage;
