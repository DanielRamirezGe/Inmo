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
  TableRow,
} from "@mui/material";
import { useRouter } from "next/navigation";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import BottomNavigationBar from "@/components/BottomNavigationBar";
import TopNavigationBar from "@/components/TopNavigationBar";

export default function AvisoPrivacidadPage() {
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
            Aviso de Privacidad
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: "text.secondary",
              fontSize: "1.1rem",
            }}
          >
            Conforme a la Ley Federal de Protección de Datos Personales en
            Posesión de los Particulares
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

        <Paper
          elevation={2}
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 3,
            border: "1px solid rgba(240, 185, 43, 0.2)",
          }}
        >
          {/* Responsable */}
          <Typography
            variant="h5"
            gutterBottom
            sx={{ color: "#37474F", fontWeight: 600 }}
          >
            1. RESPONSABLE DE LA PROTECCIÓN DE SUS DATOS PERSONALES
          </Typography>
          <Typography paragraph sx={{ textAlign: "justify", lineHeight: 1.8 }}>
            <strong>MINKAASA</strong>, con domicilio en Ciudad de México,
            México, es el responsable del uso y protección de sus datos
            personales, en términos de la Ley Federal de Protección de Datos
            Personales en Posesión de los Particulares (LFPDPPP).
          </Typography>

          <TableContainer sx={{ my: 2 }}>
            <Table size="small">
              <TableBody>
                <TableRow>
                  <TableCell>
                    <strong>Razón Social:</strong>
                  </TableCell>
                  <TableCell>Minkaasa</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Domicilio:</strong>
                  </TableCell>
                  <TableCell>Ciudad de México, México</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Email de contacto:</strong>
                  </TableCell>
                  <TableCell>contacto@minkaasa.com</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Teléfono:</strong>
                  </TableCell>
                  <TableCell>+52 55 1234 5678</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          <Divider sx={{ my: 3 }} />

          {/* Finalidades */}
          <Typography
            variant="h5"
            gutterBottom
            sx={{ color: "#37474F", fontWeight: 600 }}
          >
            2. FINALIDADES DEL TRATAMIENTO
          </Typography>
          <Typography paragraph sx={{ textAlign: "justify", lineHeight: 1.8 }}>
            Sus datos personales serán utilizados para las siguientes
            finalidades:
          </Typography>

          <Typography
            variant="h6"
            gutterBottom
            sx={{ color: "#37474F", fontWeight: 600, mt: 2 }}
          >
            Finalidades Primarias (necesarias para el servicio):
          </Typography>
          <List>
            <ListItem>
              <ListItemText primary="• Identificación y contacto con clientes y prospectos" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Prestación de servicios inmobiliarios (compra, venta, renta)" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Elaboración de contratos y documentos legales" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Seguimiento y atención a solicitudes" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Cumplimiento de obligaciones fiscales y legales" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Verificación de identidad y solvencia económica" />
            </ListItem>
          </List>

          <Typography
            variant="h6"
            gutterBottom
            sx={{ color: "#37474F", fontWeight: 600, mt: 2 }}
          >
            Finalidades Secundarias (opcionales):
          </Typography>
          <List>
            <ListItem>
              <ListItemText primary="• Envío de información promocional y publicitaria" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Invitaciones a eventos inmobiliarios" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Estudios de mercado y estadísticas" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Mejora de servicios y experiencia del cliente" />
            </ListItem>
          </List>

          <Divider sx={{ my: 3 }} />

          {/* Datos Recabados */}
          <Typography
            variant="h5"
            gutterBottom
            sx={{ color: "#37474F", fontWeight: 600 }}
          >
            3. DATOS PERSONALES QUE RECABAMOS
          </Typography>
          <Typography paragraph sx={{ textAlign: "justify", lineHeight: 1.8 }}>
            Para cumplir con las finalidades descritas, utilizamos los
            siguientes datos personales:
          </Typography>

          <Typography
            variant="h6"
            gutterBottom
            sx={{ color: "#37474F", fontWeight: 600, mt: 2 }}
          >
            Datos de Identificación:
          </Typography>
          <List>
            <ListItem>
              <ListItemText primary="• Nombre completo" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Fecha de nacimiento" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Nacionalidad" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Estado civil" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• CURP, RFC" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Credencial de elector (INE/IFE)" />
            </ListItem>
          </List>

          <Typography
            variant="h6"
            gutterBottom
            sx={{ color: "#37474F", fontWeight: 600, mt: 2 }}
          >
            Datos de Contacto:
          </Typography>
          <List>
            <ListItem>
              <ListItemText primary="• Domicilio" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Teléfono(s)" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Correo electrónico" />
            </ListItem>
          </List>

          <Typography
            variant="h6"
            gutterBottom
            sx={{ color: "#37474F", fontWeight: 600, mt: 2 }}
          >
            Datos Económicos:
          </Typography>
          <List>
            <ListItem>
              <ListItemText primary="• Ingresos mensuales" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Ocupación y lugar de trabajo" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Referencias crediticias" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Historial crediticio" />
            </ListItem>
          </List>

          <Divider sx={{ my: 3 }} />

          {/* Transferencias */}
          <Typography
            variant="h5"
            gutterBottom
            sx={{ color: "#37474F", fontWeight: 600 }}
          >
            4. TRANSFERENCIAS DE DATOS
          </Typography>
          <Typography paragraph sx={{ textAlign: "justify", lineHeight: 1.8 }}>
            Sus datos personales pueden ser transferidos y tratados dentro y
            fuera del país, por personas distintas a esta empresa. En ese
            sentido, su información puede ser compartida con:
          </Typography>
          <List>
            <ListItem>
              <ListItemText primary="• Instituciones financieras para verificación crediticia" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Notarios públicos para formalización de operaciones" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Autoridades fiscales y gubernamentales" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Empresas valuadoras y de servicios inmobiliarios" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Compañías de seguros" />
            </ListItem>
          </List>

          <Divider sx={{ my: 3 }} />

          {/* Derechos ARCO */}
          <Typography
            variant="h5"
            gutterBottom
            sx={{ color: "#37474F", fontWeight: 600 }}
          >
            5. DERECHOS ARCO
          </Typography>
          <Typography paragraph sx={{ textAlign: "justify", lineHeight: 1.8 }}>
            Usted tiene derecho a conocer qué datos personales tenemos de usted,
            para qué los utilizamos y las condiciones del uso que les damos
            (Acceso). Asimismo, es su derecho solicitar la corrección de su
            información personal en caso de que esté desactualizada, sea
            inexacta o incompleta (Rectificación); que la eliminemos de nuestros
            registros o bases de datos cuando considere que la misma no está
            siendo utilizada adecuadamente (Cancelación); así como oponerse al
            uso de sus datos personales para fines específicos (Oposición).
          </Typography>

          <Typography paragraph sx={{ textAlign: "justify", lineHeight: 1.8 }}>
            Para ejercer cualquiera de los derechos ARCO, puede enviar una
            solicitud a:
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
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Consentimiento */}
          <Typography
            variant="h5"
            gutterBottom
            sx={{ color: "#37474F", fontWeight: 600 }}
          >
            6. CONSENTIMIENTO
          </Typography>
          <Typography paragraph sx={{ textAlign: "justify", lineHeight: 1.8 }}>
            Al proporcionar sus datos personales por cualquier medio, usted
            consiente tácitamente en el tratamiento de los mismos conforme a los
            términos y condiciones establecidos en el presente Aviso de
            Privacidad.
          </Typography>

          <Divider sx={{ my: 3 }} />

          {/* Modificaciones */}
          <Typography
            variant="h5"
            gutterBottom
            sx={{ color: "#37474F", fontWeight: 600 }}
          >
            7. MODIFICACIONES AL AVISO DE PRIVACIDAD
          </Typography>
          <Typography paragraph sx={{ textAlign: "justify", lineHeight: 1.8 }}>
            Nos reservamos el derecho de efectuar modificaciones o
            actualizaciones al presente Aviso de Privacidad, para la atención de
            novedades legislativas, políticas internas o nuevos requerimientos
            para la prestación u ofrecimiento de nuestros servicios.
          </Typography>
          <Typography paragraph sx={{ textAlign: "justify", lineHeight: 1.8 }}>
            Estas modificaciones estarán disponibles al público a través de
            nuestro sitio web
            <strong> www.minkaasa.com</strong>, o bien, pueden ser solicitadas
            en nuestro domicilio.
          </Typography>

          <Divider sx={{ my: 3 }} />

          {/* Cookies */}
          <Typography
            variant="h5"
            gutterBottom
            sx={{ color: "#37474F", fontWeight: 600 }}
          >
            8. USO DE COOKIES Y TECNOLOGÍAS SIMILARES
          </Typography>
          <Typography paragraph sx={{ textAlign: "justify", lineHeight: 1.8 }}>
            Le informamos que en nuestra página de internet utilizamos cookies,
            web beacons u otras tecnologías, a través de las cuales es posible
            monitorear su comportamiento como usuario de internet, así como
            brindarle un mejor servicio y experiencia al navegar en nuestra
            página.
          </Typography>
          <Typography paragraph sx={{ textAlign: "justify", lineHeight: 1.8 }}>
            Los datos personales que obtenemos de estas tecnologías de rastreo
            son los siguientes: horario de navegación, tiempo en el sitio web,
            secciones consultadas, y página de internet desde la cual accedió a
            la nuestra.
          </Typography>

          <Box sx={{ mt: 4, p: 3, bgcolor: "#f5f5f5", borderRadius: 2 }}>
            <Typography
              variant="body2"
              sx={{ fontStyle: "italic", textAlign: "center" }}
            >
              Este Aviso de Privacidad cumple con los requisitos establecidos en
              la Ley Federal de Protección de Datos Personales en Posesión de
              los Particulares, su Reglamento y los Lineamientos del Aviso de
              Privacidad.
            </Typography>
          </Box>
        </Paper>
      </Container>

      {/* Bottom Navigation Bar for Mobile */}
      <BottomNavigationBar />
    </>
  );
}
