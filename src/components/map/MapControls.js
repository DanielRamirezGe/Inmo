import React from "react";
import {
  Box,
  IconButton,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import {
  Refresh as RefreshIcon,
  MyLocation as LocationIcon,
} from "@mui/icons-material";

const MapControls = ({ onRefresh, onLocationClick, className = "" }) => {
  const isMobile = useMediaQuery("(max-width:750px)");

  return (
    <Box
      className={className}
      sx={{
        position: "absolute",
        top: isMobile ? "6px" : "10px",
        left: isMobile ? "6px" : "10px",
        zIndex: 1000,
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        borderRadius: isMobile ? "4px" : "8px",
        padding: isMobile ? "4px" : "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        display: "flex",
        flexDirection: "column",
        gap: isMobile ? "2px" : "4px",
      }}
    >
      <Tooltip title="Refrescar propiedades" placement="right">
        <Box
          onClick={onRefresh}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: isMobile ? "4px" : "8px",
            padding: isMobile ? "4px 6px" : "8px 12px",
            borderRadius: isMobile ? "3px" : "6px",
            cursor: "pointer",
            "&:hover": {
              backgroundColor: "rgba(25, 118, 210, 0.1)",
            },
          }}
        >
          <RefreshIcon
            fontSize={isMobile ? "small" : "small"}
            color="primary"
            sx={{
              fontSize: isMobile ? "0.875rem" : "1.25rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          />
          <Typography
            variant="caption"
            color="primary"
            sx={{
              fontWeight: 500,
              fontSize: isMobile ? "0.65rem" : "0.75rem",
              lineHeight: isMobile ? 1.1 : 1.4,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: isMobile ? "0.875rem" : "1.25rem",
            }}
          >
            {isMobile ? "Cargar" : "Cargar propiedades"}
          </Typography>
        </Box>
      </Tooltip>

      <Tooltip title="Mi ubicación" placement="right">
        <Box
          onClick={onLocationClick}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: isMobile ? "4px" : "8px",
            padding: isMobile ? "4px 6px" : "8px 12px",
            borderRadius: isMobile ? "3px" : "6px",
            cursor: "pointer",
            "&:hover": {
              backgroundColor: "rgba(25, 118, 210, 0.1)",
            },
          }}
        >
          <LocationIcon
            fontSize={isMobile ? "small" : "small"}
            color="primary"
            sx={{
              fontSize: isMobile ? "0.875rem" : "1.25rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          />
          <Typography
            variant="caption"
            color="primary"
            sx={{
              fontWeight: 500,
              fontSize: isMobile ? "0.65rem" : "0.75rem",
              lineHeight: isMobile ? 1.1 : 1.4,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: isMobile ? "0.875rem" : "1.25rem",
            }}
          >
            {isMobile ? "Mi ubicación" : "Buscar en mi ubicación"}
          </Typography>
        </Box>
      </Tooltip>
    </Box>
  );
};

export default MapControls;
