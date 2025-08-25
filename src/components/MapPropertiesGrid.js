import React from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Grid,
  Box,
  Typography,
  Alert,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import PropertyCard from "@/components/PropertyCard/PropertyCard";

const MapPropertiesGrid = ({
  properties = [],
  loading = false,
  error = null,
  onPropertyClick = null,
  title = "Propiedades en esta zona",
  showTitle = true,
  compact = false,
}) => {
  const router = useRouter();
  const theme = useTheme();
  const isSmallMobile = useMediaQuery("(max-width:425px)");

  const handleDetailClick = (propertyId) => {
    if (propertyId) {
      // If onPropertyClick callback is provided, use it (for drawer)
      // Otherwise, use new property page navigation
      if (onPropertyClick) {
        onPropertyClick(propertyId);
      } else {
        router.push(`/property/${propertyId}`);
      }
    }
  };

  const handleRetry = () => {
    // Since this component doesn't load data itself,
    // we'll trigger a parent refresh if needed
    if (onPropertyClick && typeof onPropertyClick === "function") {
      onPropertyClick("refresh");
    }
  };

  // Don't render anything if no properties and not loading
  if (!loading && !error && properties.length === 0) {
    return null;
  }

  return (
    <Container
      maxWidth={compact ? false : "lg"}
      disableGutters={compact}
      sx={{
        mt: compact ? 0 : { xs: 2, md: 4 },
        mb: compact ? 0 : { xs: 2, md: 2 },
        pb: compact ? 0 : { xs: 2, md: 0 },
        height: compact ? "100%" : "auto",
      }}
    >
      {/* Título de la sección */}
      {showTitle && properties.length > 0 && (
        <Box
          sx={{
            mb: compact ? (isSmallMobile ? 1 : 2) : 3,
            textAlign: compact ? "left" : "center",
          }}
        >
          <Typography
            variant={compact ? (isSmallMobile ? "body1" : "h6") : "h4"}
            component="h2"
            sx={{
              fontWeight: 600,
              color: "text.primary",
              mb: compact ? (isSmallMobile ? 0.25 : 0.5) : 1,
              fontSize: isSmallMobile ? "0.875rem" : undefined,
              lineHeight: isSmallMobile ? 1.2 : undefined,
            }}
          >
            {title}
          </Typography>
          <Typography
            variant={compact ? (isSmallMobile ? "caption" : "body2") : "body1"}
            color="text.secondary"
            sx={{
              mb: compact ? (isSmallMobile ? 0.5 : 1) : 2,
              fontSize: isSmallMobile ? "0.75rem" : undefined,
              lineHeight: isSmallMobile ? 1.1 : undefined,
            }}
          >
            {properties.length} propiedad{properties.length !== 1 ? "es" : ""}{" "}
            encontrada{properties.length !== 1 ? "s" : ""} en esta zona
          </Typography>
        </Box>
      )}

      {/* Estado de carga */}
      {loading && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: compact ? "10vh" : "20vh",
          }}
        >
          <Typography
            variant={compact ? "body2" : "body1"}
            color="text.secondary"
          >
            Cargando propiedades de la zona...
          </Typography>
        </Box>
      )}

      {/* Estado de error */}
      {error && !loading && (
        <Box
          textAlign={compact ? "left" : "center"}
          sx={{ my: compact ? 2 : 3 }}
        >
          <Alert severity="error" sx={{ mb: 2, justifyContent: "center" }}>
            {error}
          </Alert>
          <Button
            variant="outlined"
            onClick={handleRetry}
            size={compact ? "small" : "medium"}
          >
            Reintentar
          </Button>
        </Box>
      )}

      {/* Grid de propiedades */}
      {!loading && !error && properties.length > 0 && (
        <Grid
          container
          spacing={compact ? (isSmallMobile ? 1 : 2) : { xs: 2, sm: 3, md: 4 }}
        >
          {properties.map((property, index) => (
            <Grid
              item
              xs={12}
              sm={compact ? 12 : 6}
              md={compact ? 12 : 4}
              lg={compact ? 6 : 4}
              key={
                property.prototypeId
                  ? `${property.prototypeId}-${index}`
                  : `map-property-item-${index}`
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

      {/* Mensaje cuando no hay propiedades */}
      {!loading && !error && properties.length === 0 && (
        <Box
          textAlign={compact ? "left" : "center"}
          sx={{ my: compact ? 3 : 5 }}
        >
          <Typography
            variant={compact ? "body2" : "h6"}
            color="text.secondary"
            sx={{
              fontSize: {
                xs: "0.875rem",
                sm: compact ? "0.875rem" : "1.25rem",
              },
              fontWeight: { xs: 500, sm: compact ? 500 : 600 },
            }}
          >
            No hay propiedades disponibles en esta zona.
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mt: 1,
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
              lineHeight: { xs: 1.2, sm: 1.4 },
            }}
          >
            Intenta mover el mapa o hacer zoom para ver más propiedades.
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default MapPropertiesGrid;
