"use client";
import * as React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import CardHouse from "../components/card";
import DrawerAppBar from "../components/navBarGen";
import styles from "./results.module.css";

export default function ResultsPage() {
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
      <Box className={styles.container} sx={{ marginTop: "80px" }}>
        <Typography variant="h4" className={styles.title}>
          Resultados de la Búsqueda
        </Typography>
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
                  columns={{ xs: 2, sm: 8, md: 12 }}
                >
                  {house.houseExpample.map((houseExpample) => (
                    <Grid
                      key={houseExpample.key}
                      size={{ xs: 4, sm: 4, md: 4 }}
                    >
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
      </Box>
    </>
  );
}
