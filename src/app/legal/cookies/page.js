"use client";
import React from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
} from "@mui/material";
import { useRouter } from "next/navigation";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import BottomNavigationBar from "@/components/BottomNavigationBar";
import TopNavigationBar from "@/components/TopNavigationBar";

export default function PoliticaCookiesPage() {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <>
      {/* Top Navigation Bar for Desktop/Tablet */}
      <TopNavigationBar />

      <Container maxWidth="md" sx={{ py: 4, mb: { xs: 10, md: 4 } }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            sx={{
              mb: 3,
              color: "#F0B92B",
              "&:hover": {
                backgroundColor: "rgba(240, 185, 43, 0.1)",
              },
            }}
          >
            Regresar
          </Button>

          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 700,
              color: "#37474F",
              mb: 2,
              fontSize: { xs: "2rem", md: "2.5rem" },
            }}
          >
            Política de Cookies
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: "text.secondary",
              fontSize: "1.1rem",
            }}
          >
            Información sobre el uso de cookies y tecnologías similares en
            nuestro sitio web
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              fontSize: "0.9rem",
              mt: 1,
            }}
          >
            Última actualización: Enero 2025
          </Typography>
        </Box>

        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            Al continuar navegando en nuestro sitio web, usted acepta el uso de
            cookies de acuerdo con esta política.
          </Typography>
        </Alert>

        <Paper
          elevation={2}
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 3,
            border: "1px solid rgba(240, 185, 43, 0.2)",
          }}
        >
          {/* ¿Qué son las cookies? */}
          <Typography
            variant="h5"
            gutterBottom
            sx={{ color: "#37474F", fontWeight: 600 }}
          >
            1. ¿QUÉ SON LAS COOKIES?
          </Typography>
          <Typography paragraph sx={{ textAlign: "justify", lineHeight: 1.8 }}>
            Las cookies son pequeños archivos de texto que se almacenan en su
            dispositivo (computadora, tablet o móvil) cuando visita nuestro
            sitio web. Estas cookies nos permiten reconocer su dispositivo y
            recordar información sobre su visita, como sus preferencias de
            navegación.
          </Typography>
          <Typography paragraph sx={{ textAlign: "justify", lineHeight: 1.8 }}>
            Las cookies son ampliamente utilizadas para hacer que los sitios web
            funcionen de manera más eficiente, así como para proporcionar
            información a los propietarios del sitio.
          </Typography>

          <Divider sx={{ my: 3 }} />

          {/* Tipos de cookies */}
          <Typography
            variant="h5"
            gutterBottom
            sx={{ color: "#37474F", fontWeight: 600 }}
          >
            2. TIPOS DE COOKIES QUE UTILIZAMOS
          </Typography>

          <TableContainer sx={{ my: 3 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "rgba(240, 185, 43, 0.1)" }}>
                  <TableCell>
                    <strong>Tipo de Cookie</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Propósito</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Duración</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <strong>Cookies Esenciales</strong>
                  </TableCell>
                  <TableCell>
                    Necesarias para el funcionamiento básico del sitio web
                  </TableCell>
                  <TableCell>Sesión</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Cookies de Rendimiento</strong>
                  </TableCell>
                  <TableCell>
                    Nos ayudan a entender cómo los visitantes usan el sitio
                  </TableCell>
                  <TableCell>2 años</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Cookies de Funcionalidad</strong>
                  </TableCell>
                  <TableCell>
                    Permiten recordar sus preferencias y configuraciones
                  </TableCell>
                  <TableCell>1 año</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Cookies de Marketing</strong>
                  </TableCell>
                  <TableCell>
                    Se utilizan para mostrar anuncios relevantes
                  </TableCell>
                  <TableCell>2 años</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          <Divider sx={{ my: 3 }} />

          {/* Cookies específicas */}
          <Typography
            variant="h5"
            gutterBottom
            sx={{ color: "#37474F", fontWeight: 600 }}
          >
            3. COOKIES ESPECÍFICAS QUE UTILIZAMOS
          </Typography>

          <Typography
            variant="h6"
            gutterBottom
            sx={{ color: "#37474F", fontWeight: 600, mt: 2 }}
          >
            Cookies Propias:
          </Typography>
          <List>
            <ListItem>
              <ListItemText
                primary="minkaasa_session"
                secondary="Mantiene la sesión del usuario activa durante la navegación"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="minkaasa_preferences"
                secondary="Guarda las preferencias del usuario (idioma, región, etc.)"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="minkaasa_search_history"
                secondary="Almacena el historial de búsquedas para mejorar la experiencia"
              />
            </ListItem>
          </List>

          <Typography
            variant="h6"
            gutterBottom
            sx={{ color: "#37474F", fontWeight: 600, mt: 2 }}
          >
            Cookies de Terceros:
          </Typography>
          <List>
            <ListItem>
              <ListItemText
                primary="Google Analytics (_ga, _gid, _gat)"
                secondary="Análisis de tráfico web y comportamiento de usuarios"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Google reCAPTCHA"
                secondary="Protección contra spam y bots automatizados"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Facebook Pixel"
                secondary="Seguimiento de conversiones y remarketing en redes sociales"
              />
            </ListItem>
          </List>

          <Divider sx={{ my: 3 }} />

          {/* Finalidades */}
          <Typography
            variant="h5"
            gutterBottom
            sx={{ color: "#37474F", fontWeight: 600 }}
          >
            4. FINALIDADES DEL USO DE COOKIES
          </Typography>
          <Typography paragraph sx={{ textAlign: "justify", lineHeight: 1.8 }}>
            Utilizamos cookies para los siguientes propósitos:
          </Typography>
          <List>
            <ListItem>
              <ListItemText primary="• Asegurar el correcto funcionamiento del sitio web" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Personalizar su experiencia de navegación" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Recordar sus preferencias de búsqueda y filtros" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Analizar el tráfico web y el comportamiento de los usuarios" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Mejorar nuestros servicios y contenido" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Mostrar publicidad relevante y personalizada" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Proporcionar funciones de redes sociales" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Prevenir fraudes y mejorar la seguridad" />
            </ListItem>
          </List>

          <Divider sx={{ my: 3 }} />

          {/* Datos recopilados */}
          <Typography
            variant="h5"
            gutterBottom
            sx={{ color: "#37474F", fontWeight: 600 }}
          >
            5. DATOS RECOPILADOS A TRAVÉS DE COOKIES
          </Typography>
          <Typography paragraph sx={{ textAlign: "justify", lineHeight: 1.8 }}>
            A través de las cookies, podemos recopilar la siguiente información:
          </Typography>
          <List>
            <ListItem>
              <ListItemText primary="• Dirección IP del dispositivo" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Tipo de navegador y versión" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Sistema operativo" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Páginas visitadas y tiempo de permanencia" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Fecha y hora de las visitas" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Sitio web de referencia" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Términos de búsqueda utilizados" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Preferencias de navegación y configuraciones" />
            </ListItem>
          </List>

          <Divider sx={{ my: 3 }} />

          {/* Gestión de cookies */}
          <Typography
            variant="h5"
            gutterBottom
            sx={{ color: "#37474F", fontWeight: 600 }}
          >
            6. CÓMO GESTIONAR LAS COOKIES
          </Typography>
          <Typography paragraph sx={{ textAlign: "justify", lineHeight: 1.8 }}>
            Usted puede controlar y/o eliminar las cookies como desee. Puede
            eliminar todas las cookies que ya están en su dispositivo y puede
            configurar la mayoría de los navegadores para evitar que se
            coloquen.
          </Typography>

          <Typography
            variant="h6"
            gutterBottom
            sx={{ color: "#37474F", fontWeight: 600, mt: 2 }}
          >
            Configuración por navegador:
          </Typography>

          <Box sx={{ ml: 2 }}>
            <Typography paragraph>
              <strong>Google Chrome:</strong> Configuración → Privacidad y
              seguridad → Cookies y otros datos del sitio
            </Typography>
            <Typography paragraph>
              <strong>Mozilla Firefox:</strong> Opciones → Privacidad y
              seguridad → Cookies y datos del sitio
            </Typography>
            <Typography paragraph>
              <strong>Safari:</strong> Preferencias → Privacidad → Cookies y
              datos del sitio web
            </Typography>
            <Typography paragraph>
              <strong>Microsoft Edge:</strong> Configuración → Cookies y
              permisos del sitio → Cookies y datos del sitio
            </Typography>
          </Box>

          <Alert severity="warning" sx={{ my: 2 }}>
            <Typography variant="body2">
              <strong>Importante:</strong> Si deshabilita las cookies, algunas
              funciones de nuestro sitio web pueden no funcionar correctamente,
              lo que podría afectar su experiencia de navegación.
            </Typography>
          </Alert>

          <Divider sx={{ my: 3 }} />

          {/* Cookies de terceros */}
          <Typography
            variant="h5"
            gutterBottom
            sx={{ color: "#37474F", fontWeight: 600 }}
          >
            7. COOKIES DE TERCEROS
          </Typography>
          <Typography paragraph sx={{ textAlign: "justify", lineHeight: 1.8 }}>
            Algunos de nuestros socios comerciales pueden establecer cookies en
            su dispositivo cuando visita nuestro sitio. No tenemos control sobre
            estas cookies de terceros, por lo que le recomendamos revisar las
            políticas de privacidad de estos terceros:
          </Typography>

          <List>
            <ListItem>
              <ListItemText
                primary="Google Analytics"
                secondary="Política de privacidad: https://policies.google.com/privacy"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Facebook"
                secondary="Política de cookies: https://www.facebook.com/policies/cookies/"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Google reCAPTCHA"
                secondary="Términos de servicio: https://policies.google.com/terms"
              />
            </ListItem>
          </List>

          <Divider sx={{ my: 3 }} />

          {/* Consentimiento */}
          <Typography
            variant="h5"
            gutterBottom
            sx={{ color: "#37474F", fontWeight: 600 }}
          >
            8. CONSENTIMIENTO Y ACEPTACIÓN
          </Typography>
          <Typography paragraph sx={{ textAlign: "justify", lineHeight: 1.8 }}>
            Al continuar navegando en nuestro sitio web, usted acepta el uso de
            cookies de acuerdo con esta política. Si no está de acuerdo con el
            uso de cookies, puede configurar su navegador para rechazarlas o
            abandonar nuestro sitio web.
          </Typography>
          <Typography paragraph sx={{ textAlign: "justify", lineHeight: 1.8 }}>
            Para las cookies no esenciales, solicitamos su consentimiento
            explícito mediante un banner de cookies que aparece al visitar
            nuestro sitio por primera vez.
          </Typography>

          <Divider sx={{ my: 3 }} />

          {/* Modificaciones */}
          <Typography
            variant="h5"
            gutterBottom
            sx={{ color: "#37474F", fontWeight: 600 }}
          >
            9. MODIFICACIONES A ESTA POLÍTICA
          </Typography>
          <Typography paragraph sx={{ textAlign: "justify", lineHeight: 1.8 }}>
            Podemos actualizar esta Política de Cookies ocasionalmente para
            reflejar cambios en las cookies que utilizamos o por otras razones
            operativas, legales o reglamentarias. Le recomendamos revisar esta
            política periódicamente para mantenerse informado sobre nuestro uso
            de cookies.
          </Typography>

          <Divider sx={{ my: 3 }} />

          {/* Contacto */}
          <Typography
            variant="h5"
            gutterBottom
            sx={{ color: "#37474F", fontWeight: 600 }}
          >
            10. CONTACTO
          </Typography>
          <Typography paragraph sx={{ textAlign: "justify", lineHeight: 1.8 }}>
            Si tiene preguntas sobre esta Política de Cookies, puede
            contactarnos a través de:
          </Typography>
          <Box
            sx={{
              ml: 2,
              p: 2,
              bgcolor: "rgba(240, 185, 43, 0.1)",
              borderRadius: 1,
            }}
          >
            <Typography paragraph>
              <strong>Email:</strong> contacto@minkaasa.com
            </Typography>
            <Typography paragraph>
              <strong>Teléfono:</strong> +52 55 1234 5678
            </Typography>
            <Typography paragraph>
              <strong>Dirección:</strong> Ciudad de México, México
            </Typography>
          </Box>

          <Box sx={{ mt: 4, p: 3, bgcolor: "#f5f5f5", borderRadius: 2 }}>
            <Typography
              variant="body2"
              sx={{ fontStyle: "italic", textAlign: "center" }}
            >
              Esta Política de Cookies está diseñada para cumplir con las
              mejores prácticas internacionales y la legislación mexicana
              aplicable en materia de protección de datos.
            </Typography>
          </Box>
        </Paper>
      </Container>

      {/* Bottom Navigation Bar for Mobile */}
      <BottomNavigationBar />
    </>
  );
}
