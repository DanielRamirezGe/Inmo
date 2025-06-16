import React from "react";
import { Box, Typography, Paper, Button, Alert, Fade } from "@mui/material";
import { CheckCircleOutline, Event } from "@mui/icons-material";
import { getButtonStyle, appointmentTheme } from "../styles/appointmentTheme";

const SuccessStep = ({
  selectedDate,
  selectedTime,
  propertyName,
  appointmentCreated,
  onSuccess,
  formatDateTime,
}) => {
  const getSuccessIconStyle = () => ({
    fontSize: 80,
    color: appointmentTheme.colors.primary,
    mb: 2,
  });

  const getSuccessTitleStyle = () => ({
    variant: "h5",
    sx: {
      mb: 2,
      color: appointmentTheme.colors.text.primary,
      fontWeight: 600,
    },
  });

  const getVisitInfoPaperStyle = () => ({
    p: { xs: 2.5, md: 3 },
    borderRadius: { xs: 2, md: 3 },
    backgroundColor: appointmentTheme.colors.background.selected,
    border: { xs: "1px solid", md: "2px solid" },
    borderColor: appointmentTheme.colors.primary,
    textAlign: "center",
    mb: 3,
  });

  const getVisitHeaderStyle = () => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    mb: 1,
  });

  return (
    <Fade in timeout={500}>
      <Box sx={{ textAlign: "center" }}>
        <CheckCircleOutline sx={getSuccessIconStyle()} />

        <Typography {...getSuccessTitleStyle()}>
          ¡Visita Agendada Exitosamente!
        </Typography>

        {/* Información de la visita programada */}
        <Box sx={{ mb: 3 }}>
          <Paper elevation={0} sx={getVisitInfoPaperStyle()}>
            <Box sx={getVisitHeaderStyle()}>
              <Event sx={{ color: appointmentTheme.colors.primary, mr: 1 }} />
              <Typography
                variant="h6"
                sx={{
                  color: appointmentTheme.colors.text.primary,
                  fontWeight: 600,
                }}
              >
                Tu Visita
              </Typography>
            </Box>
            <Typography
              variant="body1"
              sx={{
                color: "text.primary",
                fontWeight: 500,
              }}
            >
              <strong>Programada para:</strong>{" "}
              {formatDateTime(selectedDate, selectedTime)}
            </Typography>
            {propertyName && (
              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  mt: 1,
                }}
              >
                <strong>Propiedad:</strong> {propertyName}
              </Typography>
            )}
          </Paper>
        </Box>

        {appointmentCreated?.data?.calendarEvent?.success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            <Typography variant="body2">
              Tu visita ha sido registrada en nuestro calendario. Te
              contactaremos para confirmar la dirección exacta y coordinar los
              detalles.
            </Typography>
          </Alert>
        )}

        <Typography
          variant="body1"
          sx={{ mb: 3, color: appointmentTheme.colors.text.primary }}
        >
          Hemos recibido tu solicitud de visita. Nuestro equipo se pondrá en
          contacto contigo para confirmar los detalles y coordinar el encuentro
          en la propiedad.
        </Typography>

        <Button variant="contained" onClick={onSuccess} sx={getButtonStyle()}>
          Entendido
        </Button>
      </Box>
    </Fade>
  );
};

export default SuccessStep;
