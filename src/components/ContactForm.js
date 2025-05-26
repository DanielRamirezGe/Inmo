import React from "react";
import { TextField, Button, Alert, Box } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import useContactForm from "../hooks/useContactForm";

/**
 * Componente de formulario de contacto reutilizable
 *
 * @param {Object} props - Propiedades del componente
 * @param {Function} props.onSubmit - Función para manejar el envío del formulario
 * @param {Function} [props.onSuccess] - Callback opcional tras un envío exitoso
 * @param {string} [props.submitLabel] - Texto para el botón de envío
 * @param {string} [props.sendingLabel] - Texto para el botón cuando está enviando
 * @param {string} [props.sentLabel] - Texto para el botón cuando ya se envió
 * @param {Object} [props.sx] - Estilos adicionales para el formulario
 */
const ContactForm = ({
  onSubmit,
  onSuccess,
  submitLabel = "Enviar mensaje",
  sendingLabel = "Enviando...",
  sentLabel = "Mensaje enviado",
  sx = {},
}) => {
  const {
    contactName,
    contactPhone,
    contactMessage,
    contactSending,
    contactSent,
    contactError,
    setContactName,
    setContactPhone,
    setContactMessage,
    handleSubmit,
    isValid,
    isDisabled,
  } = useContactForm({
    onSubmit,
    onSuccess,
  });

  return (
    <Box component="form" sx={{ ...sx }} onSubmit={handleSubmit}>
      <TextField
        fullWidth
        label="Nombre completo"
        value={contactName}
        onChange={(e) => setContactName(e.target.value)}
        margin="normal"
        required
        disabled={isDisabled}
        InputProps={{
          sx: { fontSize: { xs: "0.9rem", md: "1rem" } },
        }}
        InputLabelProps={{
          sx: { fontSize: { xs: "0.9rem", md: "1rem" } },
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            "&.Mui-focused fieldset": {
              borderColor: "primary.main",
            },
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: "primary.main",
          },
        }}
      />

      <TextField
        fullWidth
        label="Número telefónico"
        value={contactPhone}
        onChange={(e) => setContactPhone(e.target.value)}
        margin="normal"
        required
        disabled={isDisabled}
        InputProps={{
          sx: { fontSize: { xs: "0.9rem", md: "1rem" } },
        }}
        InputLabelProps={{
          sx: { fontSize: { xs: "0.9rem", md: "1rem" } },
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            "&.Mui-focused fieldset": {
              borderColor: "primary.main",
            },
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: "primary.main",
          },
        }}
      />

      <TextField
        fullWidth
        label="Escribe tu mensaje aquí"
        multiline
        rows={4}
        value={contactMessage}
        onChange={(e) => setContactMessage(e.target.value)}
        margin="normal"
        required
        disabled={isDisabled}
        InputProps={{
          sx: { fontSize: { xs: "0.9rem", md: "1rem" } },
        }}
        InputLabelProps={{
          sx: { fontSize: { xs: "0.9rem", md: "1rem" } },
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            "&.Mui-focused fieldset": {
              borderColor: "primary.main",
            },
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: "primary.main",
          },
        }}
      />

      <Button
        type="submit"
        variant="contained"
        fullWidth
        startIcon={
          <SendIcon sx={{ fontSize: { xs: "1.1rem", md: "1.25rem" } }} />
        }
        disabled={!isValid || isDisabled}
        sx={{
          mt: 2,
          py: { xs: 1, md: 1.5 },
          fontSize: { xs: "0.9rem", md: "1rem" },
          bgcolor: "primary.main",
          color: "secondary.main",
          fontWeight: 600,
          "&:hover": {
            bgcolor: "primary.dark",
          },
          "&.Mui-disabled": {
            bgcolor: "primary.light",
            color: "secondary.light",
          },
        }}
      >
        {contactSending ? sendingLabel : contactSent ? sentLabel : submitLabel}
      </Button>

      {contactError && (
        <Alert
          severity="error"
          sx={{
            mt: 2,
            fontSize: { xs: "0.8rem", md: "0.9rem" },
          }}
        >
          {contactError}
        </Alert>
      )}
    </Box>
  );
};

export default ContactForm;
