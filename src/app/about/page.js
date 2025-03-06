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
    "/clientes/uno.jpg",
    "/clientes/dos.jpg",
    "/clientes/tres.jpg",
    "/clientes/cuatro.jpg",
    // Add more image paths as needed
  ];
  return (
    <>
      <NavBar />
      <Box
        className={styles.container}
        sx={{ width: "80%", marginTop: "80px" }}
      >
        <Typography variant="h4" className={styles.title}>
          Sobre Nosotros
        </Typography>
        <Grid container marginTop="40px">
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
              Nuestro objetivo es ayudarte a encontrar más que una casa, su
              verdadero hogar, combinando la esencia de la confianza con el
              poder de la tecnología. Porque en Calli, cada puerta que se abre
              es el inicio de una nueva historia.
            </Typography>
          </Grid>
        </Grid>

        <Grid container spacing={4}>
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
              Con más de 10 años de experiencia en el sector inmobiliario,
              contamos con un equipo altamente capacitado en perfilamiento,
              asesoría crediticia y estrategias de ventas. Nuestro compromiso es
              brindar a cada cliente un servicio personalizado, basado en una
              sólida formación y certificaciones en esquemas de crédito,
              oratoria, manejo de personalidad y técnicas de ventas. En Calli,
              nos aseguramos de ofrecerte la mejor asesoría para que tomes
              decisiones seguras y acertadas en la compra, venta o renta de tu
              propiedad.
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
        </Grid>
      </Box>
    </>
  );
}
