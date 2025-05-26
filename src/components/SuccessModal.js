import React from "react";
import {
  Modal,
  Fade,
  Backdrop,
  Paper,
  Box,
  Typography,
  Button,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

/**
 * Componente para mostrar un modal de éxito
 *
 * @param {Object} props - Propiedades del componente
 * @param {boolean} props.open - Indica si el modal está abierto
 * @param {Function} props.onClose - Función para cerrar el modal
 * @param {string} [props.title] - Título del modal
 * @param {string} [props.message] - Mensaje a mostrar
 * @param {string} [props.buttonText] - Texto del botón
 * @param {Object} [props.sx] - Estilos adicionales para el modal
 */
const SuccessModal = ({
  open,
  onClose,
  title = "¡Mensaje enviado con éxito!",
  message = "Gracias por tu interés en esta propiedad. Nuestro equipo te contactará muy pronto para brindarte toda la información que necesitas.",
  buttonText = "Entendido",
  sx = {},
}) => {
  return (
    <Modal
      aria-labelledby="success-modal-title"
      aria-describedby="success-modal-description"
      open={open}
      onClose={onClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Fade in={open}>
        <Paper
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "85%", sm: "70%", md: "450px" },
            bgcolor: "background.paper",
            borderRadius: 3,
            boxShadow: 24,
            p: { xs: 3, sm: 4 },
            outline: "none",
            border: "1px solid",
            borderColor: "primary.light",
            ...sx,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <Box
              sx={{
                mb: 2,
                width: { xs: 70, sm: 80 },
                height: { xs: 70, sm: 80 },
                borderRadius: "50%",
                bgcolor: "primary.main",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                boxShadow: "0 4px 12px rgba(255, 207, 64, 0.3)",
              }}
            >
              <CheckCircleOutlineIcon
                sx={{
                  fontSize: { xs: "2.5rem", sm: "3rem" },
                  color: "white",
                }}
              />
            </Box>
            <Typography
              id="success-modal-title"
              variant="h5"
              component="h2"
              gutterBottom
              sx={{
                fontSize: { xs: "1.3rem", sm: "1.5rem" },
                fontWeight: 600,
                color: "secondary.main",
                mb: 1,
              }}
            >
              {title}
            </Typography>
            <Typography
              id="success-modal-description"
              sx={{
                mt: 1,
                color: "text.secondary",
                fontSize: { xs: "0.9rem", sm: "1rem" },
                lineHeight: 1.6,
                mb: 3,
              }}
            >
              {message}
            </Typography>
            <Button
              variant="contained"
              onClick={onClose}
              sx={{
                bgcolor: "primary.main",
                color: "secondary.main",
                px: { xs: 3, sm: 4 },
                py: 1,
                fontWeight: 500,
                "&:hover": {
                  bgcolor: "primary.dark",
                },
              }}
            >
              {buttonText}
            </Button>
          </Box>
        </Paper>
      </Fade>
    </Modal>
  );
};

export default SuccessModal;
