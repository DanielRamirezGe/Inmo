"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Button,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Breadcrumbs,
  Link as MuiLink,
} from "@mui/material";
import Link from "next/link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PropertyCard from "@/components/PropertyCard";

import { api } from "@/services/api";
import { useAxiosMiddleware } from "@/utils/axiosMiddleware";
import apiConfig from "@/config/apiConfig";

export default function PropertiesPreviewListPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Obtener axiosInstance
  const axiosInstance = useAxiosMiddleware();

  // Usar una referencia para controlar si ya se ha hecho la llamada a la API
  const fetchedRef = React.useRef(false);

  useEffect(() => {
    const fetchProperties = async () => {
      // Si ya se hizo la llamada, no se repite
      if (fetchedRef.current) return;

      try {
        setLoading(true);
        // Marcar que ya se hizo la llamada
        fetchedRef.current = true;

        // Obtener todas las propiedades
        const propertiesResponse = await api.getPublishedProperties(
          axiosInstance
        );
        setProperties(propertiesResponse?.data || []);
      } catch (err) {
        console.error("Error fetching properties:", err);
        setError("No se pudieron cargar las propiedades");
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();

    // Función de limpieza para reiniciar la referencia cuando el componente se desmonte
    return () => {
      fetchedRef.current = false;
    };
  }, []);

  // Datos de muestra para mostrar mientras se carga la API
  const mockProperties = [
    {
      prototypeId: "mock1",
      prototypeName: "Casa Modelo Alazán",
      developmentName: "Fuentes de Tizayuca II",
      price: 1154000,
      bedroom: 2,
      bathroom: 1,
      halfBathroom: 1,
      parking: 1,
      size: 69,
      city: "Tizayuca",
      state: "Hidalgo",
      mainImage: null,
      isMock: true,
    },
    {
      prototypeId: "mock2",
      prototypeName: "Casa Modelo Ciprés",
      developmentName: "Fuentes de Tizayuca II",
      price: 1255000,
      bedroom: 3,
      bathroom: 1,
      halfBathroom: 1,
      parking: 1,
      size: 67.8,
      city: "Tizayuca",
      state: "Hidalgo",
      mainImage: null,
      isMock: true,
    },
    {
      prototypeId: "mock3",
      prototypeName: "Departamento Modelo Gardenia",
      developmentName: "Fuentes de Tizayuca II",
      price: 837000,
      bedroom: 2,
      bathroom: 1,
      halfBathroom: 0,
      parking: 1,
      size: 50,
      city: "Tizayuca",
      state: "Hidalgo",
      mainImage: null,
      isMock: true,
    },
  ];

  const displayProperties = properties.length > 0 ? properties : mockProperties;

  const handleDetailClick = (propertyId) => {
    window.open(`/admin/preview/${propertyId}`, "_blank");
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container
      maxWidth="lg"
      sx={{ mt: { xs: 2, md: 4 }, mb: { xs: 4, md: 8 }, px: { xs: 2, md: 3 } }}
    >
      {/* Botón de regreso */}
      <Box sx={{ mb: { xs: 2, md: 3 } }}>
        <Button
          component={Link}
          href="/admin/properties"
          startIcon={
            <ArrowBackIcon sx={{ fontSize: { xs: "1.1rem", md: "1.25rem" } }} />
          }
          variant="outlined"
          size="small"
          sx={{
            fontSize: { xs: "0.8rem", md: "0.9rem" },
            py: { xs: 0.5, md: 0.75 },
          }}
        >
          Volver a administración
        </Button>
      </Box>

      {/* Breadcrumbs */}
      <Breadcrumbs
        aria-label="breadcrumb"
        sx={{
          mb: { xs: 2, md: 3 },
          "& .MuiBreadcrumbs-ol": {
            flexWrap: "wrap",
          },
          "& .MuiBreadcrumbs-li": {
            fontSize: { xs: "0.75rem", md: "0.875rem" },
          },
        }}
      >
        <MuiLink
          component={Link}
          href="/admin"
          underline="hover"
          sx={{ fontSize: { xs: "0.75rem", md: "0.875rem" } }}
        >
          Admin
        </MuiLink>
        <MuiLink
          component={Link}
          href="/admin/properties"
          underline="hover"
          sx={{ fontSize: { xs: "0.75rem", md: "0.875rem" } }}
        >
          Propiedades
        </MuiLink>
        <Typography
          color="text.primary"
          sx={{ fontSize: { xs: "0.75rem", md: "0.875rem" } }}
        >
          Vista previa
        </Typography>
      </Breadcrumbs>

      {/* Encabezado */}
      <Box sx={{ mb: { xs: 3, md: 4 } }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            fontSize: { xs: "1.5rem", md: "2.125rem" },
            fontWeight: 600,
          }}
        >
          Vista previa de propiedades
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}
        >
          Visualiza todas las propiedades disponibles como si fueras un usuario
          del sitio web.
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: { xs: 3, md: 4 } }}>
          {error}
        </Alert>
      )}

      {/* Listado de propiedades */}
      <Grid container spacing={{ xs: 2, sm: 2, md: 3 }}>
        {displayProperties.map((property, index) => (
          <Grid item xs={12} sm={6} md={4} key={property.prototypeId || index}>
            <PropertyCard
              property={property}
              onDetailClick={() => handleDetailClick(property.prototypeId)}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
