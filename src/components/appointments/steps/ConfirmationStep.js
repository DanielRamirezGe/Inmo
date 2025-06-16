import React from "react";
import { Box, Typography, Paper, Grid, Divider, Fade } from "@mui/material";
import { appointmentTheme } from "../styles/appointmentTheme";

const ConfirmationStep = ({
  selectedDate,
  selectedTime,
  formData,
  propertyName,
  formatDateTime,
}) => {
  const getConfirmationPaperStyle = () => ({
    p: 4,
    borderRadius: 3,
    border: "2px solid",
    borderColor: appointmentTheme.colors.primary,
    backgroundColor: appointmentTheme.colors.background.normal,
    background:
      "linear-gradient(145deg, rgba(255, 255, 255, 0.9) 0%, rgba(250, 250, 250, 0.9) 100%)",
  });

  const getSectionTitleStyle = () => ({
    variant: "h6",
    sx: { color: appointmentTheme.colors.text.primary, mb: 2 },
  });

  const getBodyTextStyle = () => ({
    variant: "body1",
    sx: { mb: 3, color: "text.secondary" },
  });

  const getDetailTextStyle = () => ({
    variant: "body2",
    color: "text.secondary",
  });

  return (
    <Fade in timeout={500}>
      <Box>
        <Typography
          variant="h6"
          sx={{
            mb: 3,
            color: appointmentTheme.colors.text.primary,
            fontWeight: 600,
            textAlign: "center",
          }}
        >
          Confirmar Detalles de la Visita
        </Typography>

        <Paper elevation={0} sx={getConfirmationPaperStyle()}>
          {propertyName && (
            <>
              <Typography {...getSectionTitleStyle()}>
                Propiedad de interés:
              </Typography>
              <Typography {...getBodyTextStyle()}>{propertyName}</Typography>
              <Divider sx={{ mb: 3 }} />
            </>
          )}

          <Typography {...getSectionTitleStyle()}>Fecha y Hora:</Typography>
          <Typography {...getBodyTextStyle()}>
            {formatDateTime(selectedDate, selectedTime)}
          </Typography>

          <Divider sx={{ mb: 3 }} />

          <Typography {...getSectionTitleStyle()}>
            Información de Contacto:
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography {...getDetailTextStyle()}>
                <strong>Nombre:</strong> {formData.userName}{" "}
                {formData.userLastNameP} {formData.userLastNameM}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography {...getDetailTextStyle()}>
                <strong>Teléfono:</strong> {formData.phone}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography {...getDetailTextStyle()}>
                <strong>Email:</strong> {formData.email}
              </Typography>
            </Grid>
            {formData.comment && (
              <Grid item xs={12}>
                <Typography {...getDetailTextStyle()}>
                  <strong>Comentarios:</strong> {formData.comment}
                </Typography>
              </Grid>
            )}
          </Grid>
        </Paper>
      </Box>
    </Fade>
  );
};

export default ConfirmationStep;
