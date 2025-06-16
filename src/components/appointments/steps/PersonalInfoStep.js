import React from "react";
import { Box, Typography, Grid, Paper, TextField, Fade } from "@mui/material";
import { Person, Email, Phone, Comment } from "@mui/icons-material";
import {
  getFieldContainerStyle,
  getTextFieldStyle,
  appointmentTheme,
} from "../styles/appointmentTheme";

const PersonalInfoStep = ({ formData, onInputChange, isValid }) => {
  const fields = [
    {
      key: "userName",
      label: "Nombre(s)*",
      icon: <Person sx={{ mr: 1, color: "primary.main" }} />,
      required: true,
      gridSize: { xs: 12, md: 6 },
    },
    {
      key: "userLastNameP",
      label: "Apellido Paterno*",
      required: true,
      gridSize: { xs: 12, md: 6 },
    },
    {
      key: "userLastNameM",
      label: "Apellido Materno",
      required: false,
      gridSize: { xs: 12, md: 6 },
    },
    {
      key: "phone",
      label: "Teléfono*",
      icon: <Phone sx={{ mr: 1, color: "primary.main" }} />,
      required: true,
      gridSize: { xs: 12, md: 6 },
    },
    {
      key: "email",
      label: "Correo Electrónico*",
      type: "email",
      icon: <Email sx={{ mr: 1, color: "primary.main" }} />,
      required: true,
      gridSize: { xs: 12 },
    },
    {
      key: "comment",
      label: "Comentarios adicionales (opcional)",
      multiline: true,
      rows: 3,
      icon: (
        <Comment
          sx={{ mr: 1, color: "primary.main", alignSelf: "flex-start", mt: 1 }}
        />
      ),
      placeholder:
        "¿Hay algo específico que te gustaría conocer durante la visita? (opcional)",
      gridSize: { xs: 12 },
    },
  ];

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
          Cuéntanos sobre ti
        </Typography>

        <Paper elevation={0} sx={getFieldContainerStyle(isValid, isValid)}>
          <Grid container spacing={{ xs: 2, md: 3 }}>
            {fields.map(
              ({
                key,
                label,
                type = "text",
                icon,
                required,
                multiline,
                rows,
                placeholder,
                gridSize,
              }) => {
                const fieldValue = formData[key];
                const hasValue = !!fieldValue;
                const isFieldCompleted = hasValue; // Verde para cualquier campo con valor

                return (
                  <Grid item {...gridSize} key={key}>
                    <TextField
                      fullWidth
                      label={label}
                      type={type}
                      value={fieldValue}
                      onChange={(e) => onInputChange(key, e.target.value)}
                      InputProps={icon ? { startAdornment: icon } : undefined}
                      required={required}
                      multiline={multiline}
                      rows={rows}
                      placeholder={placeholder}
                      sx={getTextFieldStyle(isFieldCompleted, hasValue)}
                    />
                  </Grid>
                );
              }
            )}
          </Grid>
        </Paper>
      </Box>
    </Fade>
  );
};

export default PersonalInfoStep;
