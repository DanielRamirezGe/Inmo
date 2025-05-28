import React from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  Divider,
  Stack,
  IconButton,
} from "@mui/material";
import {
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  WhatsApp as WhatsAppIcon,
  Home as HomeIcon,
} from "@mui/icons-material";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#37474F",
        color: "white",
        pt: { xs: 2, md: 3 },
        pb: { xs: 7, md: 2.5 },
        mt: { xs: 2, md: 3 },
        position: "relative",
        zIndex: 1,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 1.5, md: 2.5 }}>
          {/* Company Information
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <HomeIcon
                  sx={{
                    fontSize: "2rem",
                    color: "#F0B92B",
                    mr: 1,
                  }}
                />
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    color: "#F0B92B",
                    fontSize: { xs: "1.3rem", md: "1.5rem" },
                  }}
                >
                  Minkaasa
                </Typography>
              </Box>
              <Typography
                variant="body2"
                sx={{
                  color: "rgba(255, 255, 255, 0.8)",
                  lineHeight: 1.6,
                  fontSize: "0.9rem",
                }}
              >
                Donde tus sueños encuentran un hogar. Especialistas en bienes
                raíces con más de 10 años de experiencia en el mercado mexicano.
              </Typography>
            </Box>
          </Grid> */}
          {/* Contact Information - Horizontal layout on mobile */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                mb: { xs: 1, md: 1.5 },
                color: "#F0B92B",
                fontSize: { xs: "0.9rem", md: "1rem" },
              }}
            >
              Contacto
            </Typography>

            {/* Mobile: Horizontal layout, Desktop: Vertical */}
            <Box
              sx={{
                display: { xs: "block", sm: "block" },
              }}
            >
              {/* Mobile compact layout */}
              <Box
                sx={{
                  display: { xs: "flex", sm: "none" },
                  flexDirection: "column",
                  gap: 0.5,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: "0.75rem",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <LocationIcon
                    sx={{ fontSize: "0.8rem", mr: 0.5, color: "#F0B92B" }}
                  />
                  CDMX, México
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: "0.75rem",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <PhoneIcon
                    sx={{ fontSize: "0.8rem", mr: 0.5, color: "#F0B92B" }}
                  />
                  +52 55 1234 5678
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: "0.75rem",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <EmailIcon
                    sx={{ fontSize: "0.8rem", mr: 0.5, color: "#F0B92B" }}
                  />
                  contacto@minkaasa.com
                </Typography>
              </Box>

              {/* Desktop layout */}
              <Stack spacing={1} sx={{ display: { xs: "none", sm: "flex" } }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <LocationIcon
                    sx={{ fontSize: "1rem", mr: 1, color: "#F0B92B" }}
                  />
                  <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
                    Ciudad de México, México
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <PhoneIcon
                    sx={{ fontSize: "1rem", mr: 1, color: "#F0B92B" }}
                  />
                  <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
                    +52 55 1234 5678
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <EmailIcon
                    sx={{ fontSize: "1rem", mr: 1, color: "#F0B92B" }}
                  />
                  <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
                    contacto@minkaasa.com
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Grid>
          {/* Services */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                mb: { xs: 1, md: 1.5 },
                color: "#F0B92B",
                fontSize: { xs: "0.9rem", md: "1rem" },
              }}
            >
              Servicios
            </Typography>
            <Stack spacing={{ xs: 0.3, md: 0.5 }}>
              <Link
                href="#"
                sx={{
                  color: "rgba(255, 255, 255, 0.8)",
                  textDecoration: "none",
                  fontSize: { xs: "0.75rem", md: "0.8rem" },
                  "&:hover": {
                    color: "#F0B92B",
                    textDecoration: "underline",
                  },
                }}
              >
                Venta de Propiedades
              </Link>
              <Link
                href="#"
                sx={{
                  color: "rgba(255, 255, 255, 0.8)",
                  textDecoration: "none",
                  fontSize: { xs: "0.75rem", md: "0.8rem" },
                  "&:hover": {
                    color: "#F0B92B",
                    textDecoration: "underline",
                  },
                }}
              >
                Renta de Inmuebles
              </Link>
              <Link
                href="#"
                sx={{
                  color: "rgba(255, 255, 255, 0.8)",
                  textDecoration: "none",
                  fontSize: { xs: "0.75rem", md: "0.8rem" },
                  "&:hover": {
                    color: "#F0B92B",
                    textDecoration: "underline",
                  },
                }}
              >
                Asesoría Inmobiliaria
              </Link>
              {/* <Link
                href="#"
                sx={{
                  color: "rgba(255, 255, 255, 0.8)",
                  textDecoration: "none",
                  fontSize: "0.85rem",
                  "&:hover": {
                    color: "#F0B92B",
                    textDecoration: "underline",
                  },
                }}
              >
                Valuación de Propiedades
              </Link> */}
            </Stack>
          </Grid>
          {/* Legal & Social */}
          <Grid item xs={12} sm={12} md={4}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                mb: { xs: 1, md: 1.5 },
                color: "#F0B92B",
                fontSize: { xs: "0.9rem", md: "1rem" },
              }}
            >
              Legal
            </Typography>
            <Stack
              spacing={{ xs: 0.3, md: 0.5 }}
              sx={{ mb: { xs: 1.5, md: 2 } }}
            >
              <Link
                href="/legal/terminos"
                sx={{
                  color: "rgba(255, 255, 255, 0.8)",
                  textDecoration: "none",
                  fontSize: { xs: "0.75rem", md: "0.8rem" },
                  "&:hover": {
                    color: "#F0B92B",
                    textDecoration: "underline",
                  },
                }}
              >
                Términos y Condiciones
              </Link>
              <Link
                href="/legal/privacidad"
                sx={{
                  color: "rgba(255, 255, 255, 0.8)",
                  textDecoration: "none",
                  fontSize: { xs: "0.75rem", md: "0.8rem" },
                  "&:hover": {
                    color: "#F0B92B",
                    textDecoration: "underline",
                  },
                }}
              >
                Aviso de Privacidad
              </Link>
              <Link
                href="/legal/cookies"
                sx={{
                  color: "rgba(255, 255, 255, 0.8)",
                  textDecoration: "none",
                  fontSize: { xs: "0.75rem", md: "0.8rem" },
                  "&:hover": {
                    color: "#F0B92B",
                    textDecoration: "underline",
                  },
                }}
              >
                Política de Cookies
              </Link>
            </Stack>

            {/* Social Media
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                mb: 1,
                color: "#F0B92B",
                fontSize: "0.9rem",
              }}
            >
              Síguenos
            </Typography>
            <Stack direction="row" spacing={1}>
              <IconButton
                sx={{
                  color: "rgba(255, 255, 255, 0.8)",
                  "&:hover": {
                    color: "#1877F2",
                    backgroundColor: "rgba(24, 119, 242, 0.1)",
                  },
                }}
              >
                <FacebookIcon />
              </IconButton>
              <IconButton
                sx={{
                  color: "rgba(255, 255, 255, 0.8)",
                  "&:hover": {
                    color: "#E4405F",
                    backgroundColor: "rgba(228, 64, 95, 0.1)",
                  },
                }}
              >
                <InstagramIcon />
              </IconButton>
              <IconButton
                sx={{
                  color: "rgba(255, 255, 255, 0.8)",
                  "&:hover": {
                    color: "#25D366",
                    backgroundColor: "rgba(37, 211, 102, 0.1)",
                  },
                }}
              >
                <WhatsAppIcon />
              </IconButton>
            </Stack> */}
          </Grid>
        </Grid>

        <Divider
          sx={{
            my: { xs: 1.5, md: 2 },
            borderColor: "rgba(255, 255, 255, 0.2)",
          }}
        />

        {/* Ultra-compact Legal Disclaimers */}
        <Box sx={{ mb: { xs: 1, md: 1.5 } }}>
          <Typography
            variant="body2"
            sx={{
              color: "rgba(255, 255, 255, 0.7)",
              fontSize: { xs: "0.7rem", md: "0.75rem" },
              lineHeight: 1.4,
              textAlign: "center",
            }}
          >
            <strong>AVISO:</strong> Empresa mexicana de servicios inmobiliarios.
            Precios sujetos a cambios. Imágenes ilustrativas. Cumplimos con
            LFPDPPP - consulte nuestro Aviso de Privacidad.
          </Typography>
        </Box>

        {/* Ultra-compact Copyright */}
        <Box
          sx={{
            textAlign: "center",
            pt: { xs: 1, md: 1.5 },
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: "rgba(255, 255, 255, 0.6)",
              fontSize: { xs: "0.7rem", md: "0.75rem" },
            }}
          >
            © {currentYear} Minkaasa. Todos los derechos reservados.
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "rgba(255, 255, 255, 0.5)",
              fontSize: { xs: "0.65rem", md: "0.7rem" },
              mt: 0.3,
            }}
          >
            Desarrollado con ❤️ para conectar familias con sus hogares ideales
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
