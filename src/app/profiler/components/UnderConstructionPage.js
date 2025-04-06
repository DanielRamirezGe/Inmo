"use client";
import React from "react";
import { Box, Typography, CircularProgress, Container } from "@mui/material";
import ConstructionIcon from "@mui/icons-material/Construction";

export default function UnderConstructionPage() {
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          gap: 3,
        }}
      >
        <ConstructionIcon
          sx={{
            fontSize: 80,
            color: "#25D366",
            animation: "bounce 2s infinite",
          }}
        />

        <Typography variant="h4" component="h1" gutterBottom>
          Página en Construcción
        </Typography>

        <Typography variant="body1" color="text.secondary" paragraph>
          Estamos trabajando para mejorar tu experiencia. Esta página estará
          disponible próximamente.
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <CircularProgress size={20} sx={{ color: "#25D366" }} />
          <Typography variant="body2" color="text.secondary">
            Trabajando en las mejoras...
          </Typography>
        </Box>

        <style jsx global>{`
          @keyframes bounce {
            0%,
            100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-10px);
            }
          }
        `}</style>
      </Box>
    </Container>
  );
}
