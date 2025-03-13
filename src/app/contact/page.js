"use client";
import * as React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import NavBarGen from "../components/navBarGen";
import styles from "./contact.module.css";
import FacebookIcon from "@mui/icons-material/Facebook";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

export default function ContactPage() {
  const [nombre, setNombre] = React.useState("");
  const [mensaje, setMensaje] = React.useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const whatsappMessage = `Hola, soy ${nombre}. ${mensaje}`;
    const whatsappUrl = `https://wa.me/525651562698?text=${encodeURIComponent(
      whatsappMessage
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <>
      <NavBarGen />
      <Box className={styles.container} sx={{ marginTop: "80px" }}>
        <Typography variant="h4" className={styles.title} marginBottom="40px">
          Contáctanos
        </Typography>
        <Typography variant="body1" className={styles.text}>
          Estamos aquí para ayudarte. Si tienes alguna pregunta o necesitas más
          información sobre nuestras propiedades, no dudes en contactarnos.
        </Typography>
        <Box className={styles.contactInfo}>
          <Typography variant="h6">Información de Contacto</Typography>
          <Typography variant="body1">
            <strong>Teléfono:</strong> 5651562698
          </Typography>
          <Typography variant="body1">
            <strong>telefono:</strong> informacion@minkaasa.com
          </Typography>
          <Typography variant="body1">
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#1877F2",
                color: "white",
                marginTop: "16px",
              }}
              startIcon={<FacebookIcon />}
              href="https://www.facebook.com/profile.php?id=61573640081107"
              target="_blank"
              rel="noopener noreferrer"
            >
              Facebook
            </Button>
          </Typography>
          <Typography variant="body1">
            <Button
              variant="contained"
              color="success"
              startIcon={<WhatsAppIcon />}
              href="https://wa.me/525651562698?text=Hola,%20me%20gustaría%20obtener%20más%20información."
              target="_blank"
              rel="noopener noreferrer"
              sx={{ marginTop: "16px" }}
            >
              WhatsApp
            </Button>
          </Typography>
        </Box>
        <Box className={styles.formContainer}>
          <Typography variant="h6">Formulario de Contacto</Typography>
          <form className={styles.form} onSubmit={handleSubmit}>
            <TextField
              label="Nombre"
              variant="outlined"
              fullWidth
              margin="normal"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
            <TextField
              label="Mensaje"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              margin="normal"
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              className={styles.button}
              type="submit"
            >
              Enviar
            </Button>
          </form>
        </Box>
      </Box>
    </>
  );
}
