"use client";
import * as React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import NavBar from "../components/navBarGen";
import styles from "./about.module.css";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid2";

export default function AboutPage() {
  const imagen = [
    "/clientes/cinco.jpeg",
    "/clientes/dos.jpg",
    "/clientes/tres.jpg",
    "/clientes/cuatro.jpg",
    // Add more image paths as needed
  ];
  return (
    <>
      <NavBar />
      <Box className={styles.container} sx={{ marginTop: "80px" }}>
        <Typography variant="h4" className={styles.title}>
          Sobre Nosotros
        </Typography>
        <Grid container marginTop={{ xs: "0px", sm: "60px" }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Box className={styles.imageContainer}>
              <img
                src="/mainBanner/logo.png"
                alt="Nuestra Empresa"
                className={styles.image}
              />
            </Box>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="body1" className={styles.text}>
              Nuestro objetivo es ayudarte a encontrar más que una casa: tu
              verdadero hogar. En Minkaasa, combinamos la confianza con el poder
              de la tecnología, porque sabemos que cada puerta que se abre marca
              el inicio de una nueva historia.
            </Typography>
            <strong>¿Quiénes somos?</strong>
            <br />
            <br />
            <br />
            Somos una inmobiliaria mexicana comprometida con brindar un servicio
            basado en confianza, cercanía y tecnología. Nuestro equipo está
            formado por expertos en bienes raíces que te acompañarán en cada
            paso del camino, asegurando que tu experiencia sea transparente y
            satisfactoria.
            <br />
            <br />
          </Grid>
        </Grid>

        <Grid container spacing={4} margin="">
          <Grid
            size={{ xs: 12, sm: 6 }}
            sx={{ mr: 2, display: { sm: "none" }, color: "#000" }}
          >
            <Paper
              elevation={8}
              sx={{
                color: "white",
              }}
            >
              <Box
                sx={{
                  marginTop: "10px",
                }}
              >
                <Carousel showThumbs={false} autoPlay infiniteLoop>
                  {imagen.map((item, index) => (
                    <div key={index}>
                      <img
                        src={item}
                        style={{ maxHeight: "300px", maxWidth: "auto" }}
                      />
                    </div>
                  ))}
                </Carousel>
              </Box>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="body1" className={styles.text}>
              <strong>Nuestro compromiso</strong>
              <br />
              Creemos que cada hogar es un sueño hecho realidad. Por ello, nos
              esforzamos en ofrecerte opciones que se adapten a tus necesidades
              y deseos, para que encuentres el espacio perfecto para ti y tu
              familia.
              <br />
              <br />
              <strong>¿Por qué elegirnos?</strong>
            </Typography>
            <Box padding="20px">
              <ul className={styles.text}>
                <li>
                  <strong>Atención personalizada:</strong> Entendemos que cada
                  cliente es único, por lo que te ofrecemos soluciones a la
                  medida.
                </li>
                <li>
                  <strong>Tecnología innovadora:</strong> Utilizamos
                  herramientas digitales para hacer el proceso de compra, venta
                  o renta más eficiente y seguro.
                </li>
                <li>
                  <strong>Experiencia y transparencia:</strong> Contamos con un
                  equipo de profesionales con amplia trayectoria en el sector,
                  garantizando claridad en cada transacción.
                </li>
              </ul>
            </Box>
            <Typography variant="body1" className={styles.text}>
              <br />
              <strong>Nuestro proceso</strong>
            </Typography>
            <Box padding="20px">
              <ul className={styles.text}>
                <li>
                  <strong>Consulta inicial:</strong> Conocemos tus necesidades y
                  preferencias.
                </li>
                <li>
                  <strong>Selección de opciones:</strong> Te presentamos
                  propiedades alineadas con tus expectativas.
                </li>
                <li>
                  <strong>Visitas y asesoramiento:</strong> Te acompañamos en
                  cada recorrido, resolviendo tus dudas.
                </li>
                <li>
                  <strong>Cierre de contrato:</strong> Nos aseguramos de que
                  todo el proceso sea seguro y sin complicaciones.
                </li>
              </ul>
            </Box>
            <Typography variant="body1" className={styles.text}>
              <br />
              En Minkaasa, cada puerta que se abre marca el inicio de una nueva
              historia. ¡Permítenos ayudarte a encontrar el hogar que siempre
              has soñado!
            </Typography>
          </Grid>
          <Grid
            size={{ xs: 12, sm: 6 }}
            sx={{ display: { xs: "none", sm: "flex" }, color: "#000" }}
          >
            <Paper
              elevation={8}
              sx={{
                color: "white",
              }}
            >
              <Box
                sx={{
                  marginTop: "50px",
                  marginBottom: "50px",
                }}
              >
                <Carousel showThumbs={false} autoPlay infiniteLoop>
                  {imagen.map((item, index) => (
                    <div key={index}>
                      <img src={item} style={{ maxWidth: "auto" }} />
                    </div>
                  ))}
                </Carousel>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
