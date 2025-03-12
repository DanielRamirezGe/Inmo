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
              Nuestro objetivo es ayudarte a encontrar más que una casa: tu
              verdadero hogar. En Minkaasa, combinamos la confianza con el poder
              de la tecnología, porque sabemos que cada puerta que se abre marca
              el inicio de una nueva historia.
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
