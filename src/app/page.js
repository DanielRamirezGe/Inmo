"use client";
import * as React from "react";
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import CardHouse from "./components/card";
import MainHeader from "./components/mainHeader";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import DrawerAppBar from "./components/navBarGen";
import axios from "axios";
import apiConfig from "../config/apiConfig";

export default function Home() {
  const [houseDetails, setHouseDetails] = useState([]);

  useEffect(() => {
    const fetchHouseDetails = async () => {
      try {
        // First fetch houses
        const res = await fetch("/api/houses");
        const data = await res.json();

        // Then try to post metadata
        try {
          await axios.post(`${apiConfig.baseURL}/api/v1/metadataWeb`);
        } catch (metadataError) {
          console.log(
            "Error posting metadata:",
            metadataError.response?.data || metadataError.message
          );
          // Continue execution even if metadata post fails
        }

        setHouseDetails(data);
      } catch (error) {
        console.error("Error fetching house details:", error);
        // Handle the error appropriately - maybe set an error state
      }
    };

    fetchHouseDetails();
  }, []);

  return (
    <>
      <DrawerAppBar />
      <MainHeader />

      <div className={styles.page}>
        <main className={styles.main}>
          {houseDetails.map((realState) => (
            <div key={realState.id}>
              {realState.development.map((development, index) => (
                <Box
                  key={`${development.developmentName}-${index}`}
                  marginBottom={4}
                >
                  <Typography
                    variant="h5"
                    color="text.secondary"
                    marginBottom={{ xs: "20px" }}
                    textAlign={{ xs: "center" }}
                  >
                    {development.municipio} - {development.estado}
                  </Typography>
                  <Grid
                    container
                    spacing={{ xs: 2 }}
                    // columns={{ xs: 4, sm: 8, md: 12 }}
                  >
                    {development.prototype ? (
                      development.prototype.map((prototypes, index) => (
                        <Grid
                          key={index}
                          size={{ xs: 12, sm: 6, md: 6, lg: 3 }}
                        >
                          <CardHouse
                            prototype={prototypes}
                            developmentName={development.developmentName}
                          />
                        </Grid>
                      ))
                    ) : (
                      <p>{`${development.calle}`}</p>
                    )}
                  </Grid>
                </Box>
              ))}
            </div>
          ))}
        </main>
      </div>
    </>
  );
}
