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
import NavBarGen from "../../components/navBarGen";
import DialogImage from "../../components/dialogImage";
import styles from "./../singleHouse.module.css";
import { useState, useEffect } from "react";
import { formatCurrency } from "../../../utils/formatters";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid2";

export default function Page({ params }) {
  const router = useRouter();
  const [houseId, setHouseId] = useState(null);
  const [houseDetails, setHouseDetails] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setHouseId(resolvedParams.houseId);
    };

    resolveParams();
  }, [params]);

  useEffect(() => {
    const fetchHouseDetails = async () => {
      if (!houseId) return;
      try {
        const res = await fetch(`/api/houses/${houseId}`);
        if (!res.ok) {
          throw new Error("Failed to fetch house details");
        }
        const data = await res.json();
        setHouseDetails(data);
      } catch (error) {
        console.error("Error fetching house details:", error);
      }
    };

    fetchHouseDetails();
  }, [houseId]);

  const [selectedValue, setSelectedValue] = React.useState();

  const handleClickOpen = (image) => {
    console.log(image);
    setSelectedImage(image);
    setOpenDialog(true);
  };

  const handleClose = (value) => {
    setOpenDialog(false);
    setSelectedValue(value);
  };

  return (
    <>
      <NavBarGen />
      <Box className={styles.container}>
        <Typography variant="h4" className={styles.title}>
          {houseDetails.nombrePrototipo}
        </Typography>
        <Typography variant="h5" className={styles.title}>
          {houseDetails.municipio} - {houseDetails.estado}
        </Typography>
        <Box className={styles.carouselContainer}>
          <Carousel showThumbs={false} autoPlay infiniteLoop>
            {houseDetails.imagenSecundaria?.map((item, index) => (
              <div key={index} onClick={() => handleClickOpen(item)}>
                <img
                  src={item}
                  className={styles.image}
                  style={{ width: "100%", height: "300px", objectFit: "cover" }}
                />
              </div>
            ))}
          </Carousel>
        </Box>
        <Box
          className={styles.detailsContainer}
          sx={{ width: "100%", padding: { xs: "10px", sm: "20px" } }}
        >
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid xs={6}>
              <Typography
                className={styles.price}
                fontWeight="bold"
                sx={{ fontSize: { xs: "17px", sm: "30px" } }}
                marginTop="10px"
                marginBottom="10px"
              >
                {formatCurrency(houseDetails.precio)} MXN
              </Typography>
            </Grid>
            <Grid xs={6} sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="contained"
                color="success"
                startIcon={<WhatsAppIcon />}
                href={`https://wa.me/525651562698?text=Hola,%20me%20gustaría%20obtener%20más%20información%20sobre%20la%20propiedad%20${houseDetails.nombrePrototipo}%20en%20${houseDetails.developmentName},%20ubicada%20en%20${houseDetails.municipio},%20${houseDetails.estado}.`}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ fontSize: { xs: "0.7rem", sm: "0.8rem" } }}
              >
                WhatsApp
              </Button>
            </Grid>
          </Grid>
          <Box className={styles.detail} sx={{ marginTop: "10px" }}>
            <HouseIcon sx={{ fontSize: 22 }} />
            <Typography sx={{ fontSize: { xs: "14px", sm: "16px" } }}>
              Superficie: {houseDetails.size} m2
            </Typography>
          </Box>
          <Box className={styles.detail} sx={{ marginTop: "10px" }}>
            <BedIcon sx={{ fontSize: 22 }} />
            <Typography sx={{ fontSize: { xs: "14px", sm: "16px" } }}>
              Recámaras: {houseDetails.bed}
            </Typography>
          </Box>
          <Box className={styles.detail} sx={{ marginTop: "10px" }}>
            <ShowerIcon sx={{ fontSize: 22 }} />
            <Typography sx={{ fontSize: { xs: "14px", sm: "16px" } }}>
              Baños: {houseDetails.shower}
            </Typography>
          </Box>
          <Box className={styles.detail} sx={{ marginTop: "10px" }}>
            <DirectionsCarIcon sx={{ fontSize: 22 }} />
            <Typography sx={{ fontSize: { xs: "14px", sm: "16px" } }}>
              Estacionamiento: {houseDetails.car}
            </Typography>
          </Box>
        </Box>
        <Box className={styles.descriptionContainer}>
          <Typography variant="h6">Descripción</Typography>
          <Typography>{houseDetails.shortDescription}</Typography>
        </Box>
      </Box>
      <DialogImage
        selectedValue={selectedValue}
        open={openDialog}
        onClose={handleClose}
        imageAlone={selectedImage}
      />
    </>
  );
}
