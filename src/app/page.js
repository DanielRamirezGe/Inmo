"use client";
import * as React from "react";
import Image from "next/image";
import styles from "./page.module.css";
import CardHouse from "./components/card";
import MainHeader from "./components/mainHeader";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import DrawerAppBar from "./components/navBar";

export default function Home() {
  const [houseDetails, setHouseDetails] = React.useState([]);

  React.useEffect(() => {
    const fetchHouseDetails = async () => {
      const res = await fetch("/api/houses");
      const data = await res.json();
      setHouseDetails(data);
    };

    fetchHouseDetails();
  }, []);

  return (
    <>
      <DrawerAppBar />
      <MainHeader />

      <div className={styles.page}>
        <main className={styles.main}>
          {houseDetails.map((house, index) => (
            <Box key={index} marginBottom={4}>
              <Typography variant="h5" color="text.secondary">
                {house.municipio} - {house.estado}
              </Typography>
              <Grid
                container
                spacing={{ xs: 2, md: 3 }}
                columns={{ xs: 4, sm: 8, md: 12 }}
              >
                {house.houseExpample.map((houseExpample) => (
                  <Grid key={houseExpample.key} size={{ xs: 4, sm: 4, md: 4 }}>
                    <CardHouse
                      houseDetails={houseExpample}
                      key={houseExpample.key}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          ))}
        </main>
      </div>
    </>
  );
}
