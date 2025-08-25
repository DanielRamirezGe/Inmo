import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Divider,
  useMediaQuery,
} from "@mui/material";
import { MapComponent } from "./map";
import MapPropertiesGrid from "./MapPropertiesGrid";

const MapPropertiesCard = ({
  properties = [],
  loading = false,
  error = null,
  onPropertyClick = null,
  onMapPinClick = null,
  onPropertiesUpdate = null,
  height = "600px",
  showControls = true,
  className = "",
  compact = false,
}) => {
  const isSmallTablet = useMediaQuery("(min-width:730px)");

  // Estado local para mantener las propiedades durante la carga
  const [displayProperties, setDisplayProperties] = useState([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Efecto para manejar las propiedades de manera inteligente
  useEffect(() => {
    if (properties.length > 0) {
      // Si hay propiedades nuevas, actualizarlas
      setDisplayProperties(properties);
      setIsInitialLoad(false);
    } else if (isInitialLoad && loading) {
      // Solo mostrar loading en la carga inicial
      setDisplayProperties([]);
    }
    // Si no hay propiedades y no es carga inicial, mantener las anteriores
  }, [properties, loading, isInitialLoad]);

  // Contar propiedades válidas (con coordenadas) para mostrar
  const validProperties = displayProperties.filter(
    (property) =>
      property.lat &&
      property.lng &&
      !isNaN(parseFloat(property.lat)) &&
      !isNaN(parseFloat(property.lng))
  );

  const propertiesCount = validProperties.length;

  // Determinar si mostrar el indicador de carga
  const showLoadingIndicator = loading && isInitialLoad;

  return (
    <Card
      className={className}
      sx={{
        width: "100%",
        borderRadius: { xs: 2, md: 3 },
        background: "linear-gradient(145deg, #ffffff 0%, #fefcf7 100%)",
        border: "1px solid rgba(240, 185, 43, 0.4)",
        boxShadow:
          "0 4px 20px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(240, 185, 43, 0.05)",
        overflow: "hidden",
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "3px",
          background:
            "linear-gradient(90deg, #F0B92B 0%, #FFD700 50%, #F0B92B 100%)",
          opacity: 0.8,
        },
      }}
    >
      {/* Header de la card */}
      <CardContent
        sx={{
          p: { xs: 2, md: 3 },
          pb: { xs: 1.5, md: 2 },
          background:
            "linear-gradient(135deg, rgba(240, 185, 43, 0.05) 0%, rgba(255, 215, 0, 0.02) 100%)",
          borderBottom: "1px solid rgba(240, 185, 43, 0.2)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "flex-start", sm: "center" },
            justifyContent: "space-between",
            gap: { xs: 1, sm: 2 },
          }}
        >
          {/* Título principal */}
          <Box>
            <Typography
              variant="h5"
              component="h2"
              sx={{
                fontSize: { xs: "1.25rem", md: "1.5rem" },
                fontWeight: 700,
                color: "#1976d2",
                lineHeight: 1.2,
                mb: 0.5,
              }}
            >
              Propiedades en esta zona
            </Typography>

            {/* Contador de propiedades */}
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: "0.875rem", md: "1rem" },
                color: "#2e7d32",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Box
                component="span"
                sx={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: "#2e7d32",
                  display: "inline-block",
                }}
              />
              {propertiesCount}{" "}
              {propertiesCount === 1
                ? "propiedad encontrada"
                : "propiedades encontradas"}{" "}
              en esta zona
            </Typography>
          </Box>

          {/* Indicador de estado eliminado para evitar movimiento del mapa */}
        </Box>
      </CardContent>

      {/* Contenido principal */}
      <CardContent
        sx={{
          p: { xs: 1, md: 2 },
          "&:last-child": { pb: { xs: 1, md: 2 } },
        }}
      >
        {/* Layout de dos columnas para tablets y desktop */}
        {isSmallTablet ? (
          <Box
            sx={{
              display: "flex",
              gap: 2,
              alignItems: "flex-start",
            }}
          >
            {/* Columna del Mapa */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <MapComponent
                properties={validProperties}
                height={height}
                showControls={showControls}
                onPropertyClick={onPropertyClick}
                onPropertiesUpdate={onPropertiesUpdate}
                onMapPinClick={onMapPinClick}
              />
            </Box>

            {/* Columna de Propiedades */}
            <Box
              sx={{
                flex: 1,
                minWidth: 0,
                maxHeight: height,
                overflowY: "auto",
                pl: 2,
                borderLeft: "1px solid rgba(240, 185, 43, 0.3)",
                position: "relative",
              }}
            >
              <MapPropertiesGrid
                properties={validProperties}
                loading={showLoadingIndicator}
                error={error}
                onPropertyClick={onPropertyClick}
                compact={true}
                showTitle={false}
              />
            </Box>
          </Box>
        ) : (
          /* Layout de una columna para mobile */
          <Box>
            {/* Mapa */}
            <Box sx={{ mb: 2 }}>
              <MapComponent
                properties={validProperties}
                height={height}
                showControls={showControls}
                onPropertyClick={onPropertyClick}
                onPropertiesUpdate={onPropertiesUpdate}
                onMapPinClick={onMapPinClick}
              />
            </Box>

            {/* Separador visual */}
            <Divider
              sx={{
                my: 2,
                borderColor: "rgba(240, 185, 43, 0.3)",
                "&::before": {
                  content: '""',
                  flex: 1,
                  borderTop: "1px solid rgba(240, 185, 43, 0.3)",
                },
                "&::after": {
                  content: '""',
                  flex: 1,
                  borderTop: "1px solid rgba(240, 185, 43, 0.3)",
                },
              }}
            >
              <Box
                sx={{
                  px: 2,
                  py: 0.5,
                  backgroundColor: "rgba(240, 185, 43, 0.1)",
                  borderRadius: 2,
                  border: "1px solid rgba(240, 185, 43, 0.3)",
                  position: "relative",
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: "#e6a820",
                    fontWeight: 600,
                    fontSize: "0.75rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Lista de Propiedades
                </Typography>
              </Box>
            </Divider>

            {/* Grid de propiedades */}
            <MapPropertiesGrid
              properties={validProperties}
              loading={showLoadingIndicator}
              error={error}
              onPropertyClick={onPropertyClick}
              compact={compact}
              showTitle={false}
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default MapPropertiesCard;
