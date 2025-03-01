"use client";
import * as React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import NavBar from "../components/navBar";
import styles from "./about.module.css";

export default function AboutPage() {
  return (
    <>
      <NavBar />
      <Box
        className={styles.container}
        sx={{ width: "80%", marginTop: "50px" }}
      >
        <Typography variant="h4" className={styles.title}>
          Sobre Nosotros
        </Typography>
        <Box className={styles.imageContainer}>
          <img
            src="/house_test/CalliLogoBlack.jpeg"
            alt="Nuestra Empresa"
            className={styles.image}
          />
        </Box>
        <Typography variant="body1" className={styles.text}>
          Nuestro objetivo es ayudarte a encontrar más que una casa, su
          verdadero hogar, combinando la esencia de la confianza con el poder de
          la tecnología. Porque en Calli, cada puerta que se abre es el inicio
          de una nueva historia.
        </Typography>
        {/* <Typography variant="body1" className={styles.text}>
          Nuestro equipo de profesionales está comprometido en ayudarte a
          encontrar la casa de tus sueños. Ofrecemos una amplia variedad de
          propiedades que se adaptan a tus necesidades y presupuesto.
        </Typography> */}
        <Box className={styles.imageContainer}>
          <img
            src="/house_test/CalliLogoBlack.jpeg"
            alt="Nuestro Equipo"
            className={styles.image}
          />
        </Box>
        <Typography variant="body1" className={styles.text}>
          Con más de 10 años de experiencia en el sector inmobiliario, contamos
          con un equipo altamente capacitado en perfilamiento, asesoría
          crediticia y estrategias de ventas. Nuestro compromiso es brindar a
          cada cliente un servicio personalizado, basado en una sólida formación
          y certificaciones en esquemas de crédito, oratoria, manejo de
          personalidad y técnicas de ventas. En Calli, nos aseguramos de
          ofrecerte la mejor asesoría para que tomes decisiones seguras y
          acertadas en la compra, venta o renta de tu propiedad.
        </Typography>
      </Box>
    </>
  );
}
