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
} from "@mui/material";
import { useRouter } from "next/navigation";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import BottomNavigationBar from "@/components/BottomNavigationBar";
import TopNavigationBar from "@/components/TopNavigationBar";

export default function TerminosCondicionesPage() {
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
            Términos y Condiciones
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: "text.secondary",
              fontSize: "1.1rem",
            }}
          >
            Última actualización: Enero 2025
          </Typography>
        </Box>

        <Paper
          elevation={2}
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 3,
            border: "1px solid rgba(240, 185, 43, 0.2)",
          }}
        >
          {/* Introducción */}
          <Typography
            variant="h5"
            gutterBottom
            sx={{ color: "#37474F", fontWeight: 600 }}
          >
            1. INTRODUCCIÓN
          </Typography>
          <Typography paragraph sx={{ textAlign: "justify", lineHeight: 1.8 }}>
            Los presentes términos y condiciones (en adelante, los "Términos")
            rigen el uso del sitio web y los servicios ofrecidos por{" "}
            <strong>MINKAASA</strong>, empresa mexicana especializada en
            servicios inmobiliarios, con domicilio en Ciudad de México, México.
          </Typography>
          <Typography paragraph sx={{ textAlign: "justify", lineHeight: 1.8 }}>
            Al acceder y utilizar este sitio web, usted acepta quedar obligado
            por estos Términos y todas las leyes y regulaciones aplicables,
            incluyendo pero no limitándose a la Ley Federal de Protección al
            Consumidor, el Código Civil Federal y la Ley Federal de Protección
            de Datos Personales en Posesión de los Particulares.
          </Typography>

          <Divider sx={{ my: 3 }} />

          {/* Definiciones */}
          <Typography
            variant="h5"
            gutterBottom
            sx={{ color: "#37474F", fontWeight: 600 }}
          >
            2. DEFINICIONES
          </Typography>
          <List>
            <ListItem>
              <ListItemText
                primary="Usuario"
                secondary="Cualquier persona física o moral que acceda y utilice el sitio web de Minkaasa."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Servicios"
                secondary="Servicios inmobiliarios incluyendo compra, venta, renta, asesoría y valuación de propiedades."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Contenido"
                secondary="Toda la información, imágenes, textos, videos y demás material disponible en el sitio web."
              />
            </ListItem>
          </List>

          <Divider sx={{ my: 3 }} />

          {/* Servicios */}
          <Typography
            variant="h5"
            gutterBottom
            sx={{ color: "#37474F", fontWeight: 600 }}
          >
            3. SERVICIOS OFRECIDOS
          </Typography>
          <Typography paragraph sx={{ textAlign: "justify", lineHeight: 1.8 }}>
            Minkaasa ofrece servicios de intermediación inmobiliaria conforme a
            la legislación mexicana vigente:
          </Typography>
          <List>
            <ListItem>
              <ListItemText primary="• Compra y venta de bienes inmuebles" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Arrendamiento de propiedades" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Asesoría inmobiliaria especializada" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Valuación de propiedades" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Consultoría en inversión inmobiliaria" />
            </ListItem>
          </List>

          <Divider sx={{ my: 3 }} />

          {/* Obligaciones del Usuario */}
          <Typography
            variant="h5"
            gutterBottom
            sx={{ color: "#37474F", fontWeight: 600 }}
          >
            4. OBLIGACIONES DEL USUARIO
          </Typography>
          <Typography paragraph sx={{ textAlign: "justify", lineHeight: 1.8 }}>
            El Usuario se compromete a:
          </Typography>
          <List>
            <ListItem>
              <ListItemText primary="• Proporcionar información veraz y actualizada" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Utilizar el sitio web de manera lícita y conforme a estos Términos" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• No realizar actividades que puedan dañar o interferir con el funcionamiento del sitio" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Respetar los derechos de propiedad intelectual de Minkaasa" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Cumplir con todas las leyes y regulaciones aplicables" />
            </ListItem>
          </List>

          <Divider sx={{ my: 3 }} />

          {/* Limitación de Responsabilidad */}
          <Typography
            variant="h5"
            gutterBottom
            sx={{ color: "#37474F", fontWeight: 600 }}
          >
            5. LIMITACIÓN DE RESPONSABILIDAD
          </Typography>
          <Typography paragraph sx={{ textAlign: "justify", lineHeight: 1.8 }}>
            Minkaasa actúa como intermediario en las operaciones inmobiliarias.
            La información sobre propiedades es proporcionada por terceros y,
            aunque se hace el mejor esfuerzo por verificar su exactitud, no se
            garantiza la precisión completa de la misma.
          </Typography>
          <Typography paragraph sx={{ textAlign: "justify", lineHeight: 1.8 }}>
            Minkaasa no será responsable por daños directos, indirectos,
            incidentales o consecuenciales que puedan surgir del uso del sitio
            web o de los servicios prestados, en la medida permitida por la ley
            mexicana.
          </Typography>

          <Divider sx={{ my: 3 }} />

          {/* Propiedad Intelectual */}
          <Typography
            variant="h5"
            gutterBottom
            sx={{ color: "#37474F", fontWeight: 600 }}
          >
            6. PROPIEDAD INTELECTUAL
          </Typography>
          <Typography paragraph sx={{ textAlign: "justify", lineHeight: 1.8 }}>
            Todo el contenido del sitio web, incluyendo textos, gráficos,
            logotipos, iconos, imágenes, clips de audio, descargas digitales y
            software, es propiedad de Minkaasa y está protegido por las leyes
            mexicanas e internacionales de derechos de autor y marcas
            registradas.
          </Typography>

          <Divider sx={{ my: 3 }} />

          {/* Modificaciones */}
          <Typography
            variant="h5"
            gutterBottom
            sx={{ color: "#37474F", fontWeight: 600 }}
          >
            7. MODIFICACIONES
          </Typography>
          <Typography paragraph sx={{ textAlign: "justify", lineHeight: 1.8 }}>
            Minkaasa se reserva el derecho de modificar estos Términos en
            cualquier momento. Las modificaciones serán efectivas inmediatamente
            después de su publicación en el sitio web. El uso continuado del
            sitio constituye la aceptación de dichas modificaciones.
          </Typography>

          <Divider sx={{ my: 3 }} />

          {/* Ley Aplicable */}
          <Typography
            variant="h5"
            gutterBottom
            sx={{ color: "#37474F", fontWeight: 600 }}
          >
            8. LEY APLICABLE Y JURISDICCIÓN
          </Typography>
          <Typography paragraph sx={{ textAlign: "justify", lineHeight: 1.8 }}>
            Estos Términos se rigen por las leyes de los Estados Unidos
            Mexicanos. Cualquier controversia que surja en relación con estos
            Términos será sometida a la jurisdicción de los tribunales
            competentes de la Ciudad de México, México.
          </Typography>

          <Divider sx={{ my: 3 }} />

          {/* Contacto */}
          <Typography
            variant="h5"
            gutterBottom
            sx={{ color: "#37474F", fontWeight: 600 }}
          >
            9. CONTACTO
          </Typography>
          <Typography paragraph sx={{ textAlign: "justify", lineHeight: 1.8 }}>
            Para cualquier consulta sobre estos Términos y Condiciones, puede
            contactarnos a través de:
          </Typography>
          <Box sx={{ ml: 2 }}>
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
        </Paper>
      </Container>

      {/* Bottom Navigation Bar for Mobile */}
      <BottomNavigationBar />
    </>
  );
}
