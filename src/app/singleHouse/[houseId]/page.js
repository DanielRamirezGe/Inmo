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
          {houseDetails.nombrePrototipo} - {houseDetails.municipio} -{" "}
          {houseDetails.estado}
        </Typography>
        <Box className={styles.carouselContainer}>
          <Carousel showThumbs={false} autoPlay infiniteLoop>
            {houseDetails.imagenSecundaria?.map((item, index) => (
              <div key={index} onClick={() => handleClickOpen(item)}>
                <img src={item} className={styles.image} />
              </div>
            ))}
          </Carousel>
        </Box>
        <Box className={styles.detailsContainer}>
          <Typography variant="h5" className={styles.price}>
            {houseDetails.precio}
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
