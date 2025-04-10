"use client";
import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useRouter } from "next/navigation";

export default function AccessDeniedPage() {
  const router = useRouter();

  return (
    <Box textAlign="center" sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Acceso Denegado
      </Typography>
      <Typography variant="body1" gutterBottom>
        No tienes permisos para acceder a esta página.
      </Typography>
      <Button variant="contained" onClick={() => router.push("/")}>
        Volver al inicio
      </Button>
    </Box>
  );
}
