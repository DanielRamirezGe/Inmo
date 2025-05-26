import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  Grid,
  Button,
} from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import ForumIcon from "@mui/icons-material/Forum";

/**
 * Componente de tarjeta de contacto con botones para WhatsApp y Messenger
 *
 * @param {Object} props - Propiedades del componente
 * @param {Function} props.onWhatsAppClick - Función para manejar clic en WhatsApp
 * @param {Function} props.onMessengerClick - Función para manejar clic en Messenger
 * @param {string} [props.title] - Título personalizado de la tarjeta
 * @param {string} [props.description] - Descripción personalizada
 * @param {string} [props.footer] - Texto de pie de página personalizado
 * @param {Object} [props.sx] - Estilos adicionales para la tarjeta
 */
const ContactCard = ({
  onWhatsAppClick,
  onMessengerClick,
  title = "¿Te interesa esta propiedad?",
  description = "Selecciona tu método de contacto preferido para recibir información sobre esta propiedad:",
  footer = "Respuesta rápida • Atención personalizada • Asistencia inmediata",
  sx = {},
}) => {
  return (
    <Card
      sx={{
        boxShadow: 3,
        p: { xs: 1.5, md: 2 },
        background:
          "linear-gradient(135deg, #FFFFFF 0%, rgba(255, 207, 64, 0.15) 100%)",
        position: "relative",
        borderRadius: 2,
        overflow: "hidden",
        ...sx,
      }}
    >
      <CardContent
        sx={{
          px: { xs: 2, md: 3 },
          py: { xs: 2, md: 3 },
          color: "white",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 2.5,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontSize: { xs: "1.1rem", md: "1.25rem" },
              fontWeight: 600,
              flex: 1,
              color: "secondary.main",
            }}
          >
            {title}
          </Typography>
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <ForumIcon
              sx={{
                fontSize: { xs: "1.8rem", md: "2rem" },
                color: "custom.facebookBlue",
              }}
            />
            <WhatsAppIcon
              sx={{
                fontSize: { xs: "1.8rem", md: "2rem" },
                color: "success.main",
              }}
            />
          </Stack>
        </Box>

        <Typography
          variant="body2"
          sx={{
            mb: 2.5,
            color: "text.secondary",
            fontSize: { xs: "0.85rem", md: "0.9rem" },
          }}
        >
          {description}
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Button
              variant="contained"
              fullWidth
              startIcon={
                <ForumIcon
                  sx={{
                    fontSize: { xs: "1.1rem", md: "1.25rem" },
                    color: "white",
                  }}
                />
              }
              onClick={onMessengerClick}
              sx={{
                py: { xs: 1, md: 1.3 },
                fontSize: { xs: "0.8rem", md: "0.9rem" },
                fontWeight: 500,
                boxShadow: 2,
                bgcolor: "custom.facebookBlue",
                color: "white",
                "&:hover": {
                  bgcolor: "#0b5fcc",
                  boxShadow: 4,
                  transform: "translateY(-2px)",
                },
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
              }}
            >
              Messenger
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              variant="contained"
              color="success"
              fullWidth
              startIcon={
                <WhatsAppIcon
                  sx={{
                    fontSize: { xs: "1.1rem", md: "1.25rem" },
                    color: "white",
                  }}
                />
              }
              onClick={onWhatsAppClick}
              sx={{
                py: { xs: 1, md: 1.3 },
                fontSize: { xs: "0.8rem", md: "0.9rem" },
                fontWeight: 500,
                boxShadow: 2,
                bgcolor: "custom.whatsappGreen",
                color: "white",
                "&:hover": {
                  bgcolor: "#128C7E",
                  boxShadow: 4,
                  transform: "translateY(-2px)",
                },
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
              }}
            >
              WhatsApp
            </Button>
          </Grid>
        </Grid>

        <Typography
          variant="caption"
          align="center"
          sx={{
            display: "block",
            mt: 2,
            fontSize: { xs: "0.75rem", md: "0.8rem" },
            color: "text.secondary",
          }}
        >
          {footer}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ContactCard;
