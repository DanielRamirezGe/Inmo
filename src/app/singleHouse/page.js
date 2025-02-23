"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import HouseIcon from "@mui/icons-material/House";
import BedIcon from "@mui/icons-material/Bed";
import ShowerIcon from "@mui/icons-material/Shower";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import NavBarGen from "../components/navBarGen";
import styles from "./singleHouse.module.css";

export default function SingleHousePage() {
  const router = useRouter();
  //   const { house } = router.query;
  const houseDetails = {
    municipio: "Tecámac",
    estado: "Estado de México",
    title: "Los Héroes San Pablo",
    subheader: "Tecámac - Estado de México",
    address: "Calle San Pablo, Tecámac, Estado de México",
    image: "house_test/los-heroes-san-pablo-sauce.jpg",
    description:
      "Los Héroes San Pablo es un proyecto de vivienda de interés social en el municipio de Bello, Antioquia. Cuenta con apartamentos de 2 y 3 alcobas, con áreas desde 47 m2 hasta 65 m2. El proyecto cuenta con zonas comunes como piscina, juegos infantiles, gimnasio, cancha múltiple, salón social, entre otros.",
    bed: 2,
    shower: 1,
    car: 1,
    size: 57.41,
    key: 1213123,
    prize: 10000,
    imageList: [
      {
        img: "house_test/los-heroes-san-pablo-sauce.jpg",
        title: "Breakfast",
        rows: 2,
        cols: 2,
      },
      {
        img: "house_test/sanPabloDepartamento1.jpg",
        title: "Burger",
      },
      {
        img: "house_test/sanPabloDepartamento2.jpg",
        title: "Camera",
      },
      {
        img: "house_test/sanPabloDepartamento3.jpg",
        title: "Coffee",
        cols: 2,
      },
      {
        img: "house_test/sanPabloDepartamento4.jpg",
        title: "Hats",
        cols: 2,
      },
    ],
    credit: [
      {
        name: "Crédito Infonavit",
        description:
          "Si eres derechohabiente Infonavit, el Instituto te ofrece diferentes productos de financiamiento para comprar tu casa. Recuerda que para solicitar el crédito debes cumplir con el requisito mínimo de 1080 puntos. La puntuación la determina tu edad, salario con el que cotizas, el ahorro acumulado en tu Subcuenta de Vivienda, los bimestres de cotización continua que tengas y factores que califican a la empresa en que laboras.",
      },
      {
        name: "Crédito Fovisste",
        description:
          "Si eres derechohabiente del FOVISSSTE tienes diversas opciones de crédito para adquirir tu casa.",
      },
      {
        name: "Crédito Bancario",
        description:
          "Si no cuentas con el recurso necesario para comprar tu casa y no estás afiliado al Infonavit o al Fovissste, existe la alternativa de un crédito bancario; en Grupo Sadasi trabajamos con los principales Bancos y Sofomes del país para ofrecer también diferentes opciones de crédito para adquirir tu casa.",
      },
    ],
  };

  //   if (!house) {
  //     return <div>Loading...</div>;
  //   }

  //   const houseDetails = JSON.parse(house);

  return (
    <>
      <NavBarGen />
      <Box className={styles.container}>
        <Typography variant="h4" className={styles.title}>
          {houseDetails.title} - {houseDetails.estado}
        </Typography>
        <Box className={styles.carouselContainer}>
          <Carousel showThumbs={false} autoPlay infiniteLoop>
            {houseDetails.imageList.map((item) => (
              <div key={item.img}>
                <img src={item.img} alt={item.title} className={styles.image} />
              </div>
            ))}
          </Carousel>
        </Box>
        <Box className={styles.detailsContainer}>
          <Typography variant="h5" className={styles.price}>
            {houseDetails.prize}
          </Typography>
          <Box className={styles.detail}>
            <HouseIcon sx={{ fontSize: 22 }} />
            <Typography>Superficie: {houseDetails.size} m2</Typography>
          </Box>
          <Box className={styles.detail}>
            <BedIcon sx={{ fontSize: 22 }} />
            <Typography>Recámaras: {houseDetails.bed}</Typography>
          </Box>
          <Box className={styles.detail}>
            <ShowerIcon sx={{ fontSize: 22 }} />
            <Typography>Baños: {houseDetails.shower}</Typography>
          </Box>
          <Box className={styles.detail}>
            <DirectionsCarIcon sx={{ fontSize: 22 }} />
            <Typography>Estacionamiento: {houseDetails.car}</Typography>
          </Box>
        </Box>
        <Box className={styles.descriptionContainer}>
          <Typography variant="h6">Descripción</Typography>
          <Typography>{houseDetails.description}</Typography>
        </Box>
        <Box className={styles.creditContainer}>
          <Typography variant="h6">Créditos</Typography>
          {houseDetails.credit.map((item) => (
            <Box key={item.name} className={styles.creditItem}>
              <Typography variant="h6">{item.name}</Typography>
              <Typography>{item.description}</Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </>
  );
}
