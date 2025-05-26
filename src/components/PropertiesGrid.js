import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Grid,
  Box,
  CircularProgress,
  Alert,
  Typography,
  Pagination,
  Button,
} from "@mui/material";
import PropertyCard from "@/components/PropertyCard/PropertyCard";
import { api } from "@/services/api";
import { usePublicAxios } from "@/utils/axiosMiddleware";

const PropertiesGrid = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(12);
  const [totalProperties, setTotalProperties] = useState(0);

  const router = useRouter();
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

  // Función para cargar propiedades
  const loadProperties = async (currentPage = 1) => {
    if (!axiosInstance) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await api.getPublicProperties(
        axiosInstance,
        currentPage,
        pageSize
      );

      // Siempre actualizar las propiedades si tenemos datos válidos
      if (response?.data) {
        setProperties(response.data);
        setTotalProperties(response.total || 0);
      }
    } catch (err) {
      console.error("Error fetching properties:", err);
      setError(
        "No se pudieron cargar las propiedades. Intenta de nuevo más tarde."
      );
    } finally {
      // Siempre actualizar loading al final
      setLoading(false);
    }
  };

  // Effect para carga inicial y cambios de página
  useEffect(() => {
    if (axiosInstance) {
      loadProperties(page);
    }
  }, [axiosInstance, page]);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
    window.scrollTo(0, 0);
  };

  const handleDetailClick = (propertyId) => {
    if (propertyId) {
      router.push(`/prototypeView/${propertyId}`);
    }
  };

  const handleRetry = () => {
    loadProperties(page);
  };

  return (
    <Container
      maxWidth="lg"
      sx={{ mt: { xs: 2, md: 4 }, mb: { xs: 4, md: 8 } }}
    >
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
          <Button variant="outlined" onClick={handleRetry}>
            Reintentar
          </Button>
        </Box>
      )}

      {!loading && !error && properties.length === 0 && (
        <Typography variant="h6" textAlign="center" sx={{ my: 5 }}>
          No hay propiedades disponibles en este momento.
        </Typography>
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
                  : `property-item-${index}`
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

      {!loading &&
        !error &&
        properties.length > 0 &&
        totalProperties > pageSize && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4, mb: 2 }}>
            <Pagination
              count={Math.ceil(totalProperties / pageSize)}
              page={page}
              onChange={handlePageChange}
              color="primary"
              showFirstButton
              showLastButton
            />
          </Box>
        )}
    </Container>
  );
};

export default PropertiesGrid;
