"use client";
import * as React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import CardHouse from "../../components/card";
import DrawerAppBar from "../../components/navBarGen";
import styles from "./../results.module.css";

export default function ResultsPage({ params }) {
  const [houseDetails, setHouseDetails] = React.useState([]);
  const [queryText, setQueryText] = React.useState("");

  React.useEffect(() => {
    const unwrapParams = async () => {
      const unwrappedParams = await params;
      setQueryText(unwrappedParams.queryText);
    };

    unwrapParams();
  }, [params]);

  React.useEffect(() => {
    const fetchHouseDetails = async () => {
      if (queryText) {
        const res = await fetch(`/api/results/${queryText}`);
        const data = await res.json();
        setHouseDetails(data);
      }
    };

    fetchHouseDetails();
  }, [queryText]);

  return (
    <>
      <DrawerAppBar />
      <Box className={styles.container} sx={{ marginTop: "80px" }}>
        <Typography variant="h4" className={styles.title}>
          Resultados de la Búsqueda
        </Typography>
        <div className={styles.page}>
          <main className={styles.main}>
            {/* {houseDetails.map((realState) => (
              <div key={realState.id}>
                {realState.development.map((development, index) => (
                  <Box
                    key={`${development.developmentName}-${index}`}
                    marginBottom={4}
                  > */}
            {/* <Typography variant="h5" color="text.secondary">
                      {development.municipio} - {development.estado}
                    </Typography> */}
            <Grid
              container
              spacing={{ xs: 2, md: 3 }}
              columns={{ xs: 4, sm: 8, md: 12 }}
            >
              {houseDetails.map((prototypes, index) => (
                <Grid key={index} size={{ xs: 4, sm: 4, md: 4 }}>
                  <CardHouse
                    prototype={prototypes}
                    developmentName={prototypes.developmentName}
                  />
                </Grid>
              ))}
            </Grid>
            {/*</Box>
                ))}
              </div>
            ))} */}
          </main>
        </div>
      </Box>
    </>
  );
}
