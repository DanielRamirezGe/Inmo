import React from "react";
import { Box, Typography } from "@mui/material";

/**
 * Componente para mostrar una característica de propiedad con un icono y texto
 *
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.icon - Componente de icono a mostrar
 * @param {string} props.value - Valor numérico o texto principal a mostrar
 * @param {string} props.label - Etiqueta descriptiva de la característica
 * @param {Object} [props.sx] - Estilos adicionales para el contenedor principal
 */
const PropertyFeature = ({ icon, value, label, sx = {} }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        transition: "transform 0.2s ease",
        "&:hover": {
          transform: "translateY(-5px)",
        },
        ...sx,
      }}
    >
      <Box
        className="icon-circle-primary"
        sx={{
          width: { xs: 40, md: 56 },
          height: { xs: 40, md: 56 },
          mb: 1,
        }}
      >
        {React.cloneElement(icon, {
          color: "primaryInverted",
          sx: { fontSize: { xs: "1.5rem", md: "2rem" } },
        })}
      </Box>
      <Typography
        variant="h6"
        sx={{
          fontSize: { xs: "1rem", md: "1.4rem" },
          fontWeight: 600,
          mb: 0.5,
          color: "secondary.main",
        }}
      >
        {value}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          fontSize: { xs: "0.7rem", md: "0.9rem" },
          color: "text.secondary",
        }}
      >
        {label}
      </Typography>
    </Box>
  );
};

export default PropertyFeature;
