import React from "react";
import { Container, Box, Typography, Paper } from "@mui/material";
import AppointmentScheduler from "./AppointmentScheduler";

const AppointmentPage = ({
  prototypeId = null,
  propertyName = "",
  onSuccess = () => {},
}) => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #f1f5f9 100%)",
        py: { xs: 4, md: 8 },
      }}
    >
      <Container maxWidth="lg">
        {/* Header elegante */}
        <Box sx={{ textAlign: "center", mb: { xs: 6, md: 8 } }}>
          <Box
            sx={{
              display: "inline-block",
              p: 2,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              mb: 3,
              boxShadow: "0 8px 32px rgba(102, 126, 234, 0.3)",
            }}
          >
            <Typography
              sx={{
                fontSize: "2rem",
                color: "white",
              }}
            >
              📅
            </Typography>
          </Box>

          <Typography
            variant="h2"
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontWeight: 800,
              mb: 3,
              fontSize: { xs: "2.5rem", md: "3.5rem" },
              letterSpacing: "-0.02em",
            }}
          >
            Agenda tu Visita
          </Typography>

          <Typography
            variant="h5"
            sx={{
              color: "#64748b",
              maxWidth: 700,
              mx: "auto",
              fontSize: { xs: "1.1rem", md: "1.3rem" },
              fontWeight: 400,
              lineHeight: 1.6,
              mb: 2,
            }}
          >
            Programa una experiencia personalizada para conocer tu futura
            propiedad
          </Typography>

          <Box
            sx={{
              width: 80,
              height: 4,
              background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
              mx: "auto",
              borderRadius: 2,
            }}
          />
        </Box>

        {/* Contenedor principal con diseño glass */}
        <Paper
          elevation={0}
          sx={{
            background: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            borderRadius: 6,
            overflow: "hidden",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.1)",
            position: "relative",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "1px",
              background:
                "linear-gradient(90deg, transparent 0%, rgba(102, 126, 234, 0.5) 50%, transparent 100%)",
            },
          }}
        >
          <AppointmentScheduler
            prototypeId={prototypeId}
            propertyName={propertyName}
            onSuccess={onSuccess}
          />
        </Paper>

        {/* Footer elegante */}
        <Box sx={{ textAlign: "center", mt: 6 }}>
          <Typography
            variant="body2"
            sx={{
              color: "#94a3b8",
              fontSize: "0.9rem",
            }}
          >
            Tu información está protegida y será utilizada únicamente para
            coordinar tu visita
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default AppointmentPage;
