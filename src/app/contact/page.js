"use client";
import * as React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import NavBarGen from "../components/navBarGen";
import styles from "./contact.module.css";

export default function ContactPage() {
  const [nombre, setNombre] = React.useState("");
  const [telefono, settelefono] = React.useState("");
  const [mensaje, setMensaje] = React.useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nombre, telefono, mensaje }),
    });
    // print(res);
    if (res.ok) {
      alert("Mensaje enviado exitosamente");
      setNombre("");
      settelefono("");
      setMensaje("");
    } else {
      alert("Error al enviar el mensaje");
    }
  };

  return (
    <>
      <NavBarGen />
      <Box className={styles.container} sx={{ marginTop: "80px" }}>
        <Typography variant="h4" className={styles.title}>
          Contáctanos
        </Typography>
        <Typography variant="body1" className={styles.text}>
          Estamos aquí para ayudarte. Si tienes alguna pregunta o necesitas más
          información sobre nuestras propiedades, no dudes en contactarnos.
        </Typography>
        <Box className={styles.contactInfo}>
          <Typography variant="h6">Información de Contacto</Typography>
          {/* <Typography variant="body1">
            <strong>Dirección:</strong> Calle San Pablo, Tecámac, Estado de
            México
          </Typography> */}
          <Typography variant="body1">
            <strong>Teléfono:</strong> 56 5872 4119
          </Typography>
          <Typography variant="body1">
            <strong>telefono:</strong> especialista.inmobiliario.88@gmail.com
          </Typography>
          <Typography variant="body1">
            <a
              href="https://www.facebook.com/profile.php?id=100084180904633"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              Facebook
            </a>
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
              label="Teléfono"
              variant="outlined"
              fullWidth
              margin="normal"
              value={telefono}
              onChange={(e) => settelefono(e.target.value)}
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
