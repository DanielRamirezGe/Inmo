"use client";
import * as React from "react";
import Paper from "@mui/material/Paper";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Box from "@mui/material/Box";

export default function MainHeader() {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("xs"));
  const imagen = [
    "/mainBanner/logoDos.png",
    "/mainBanner/logo.png",
    // Add more image paths as needed
  ];
  const slogan = "Donde los sueños se encuentran hogar";

  return (
    <>
      <Paper
        elevation={8}
        padding="20px"
        sx={{
          color: "white",
          padding: "20px",
        }}
      >
        <Box
          sx={{
            marginTop: {
              xs: "40px",
              sm: "50px",
            },
            maxHeight: "600px",
            overflow: "hidden",
          }}
        >
          <Carousel showThumbs={false} autoPlay infiniteLoop>
            {imagen.map((item, index) => (
              <div key={index}>
                <img
                  src={item}
                  style={{ maxHeight: "300px", maxWidth: "800px" }}
                />
              </div>
            ))}
          </Carousel>
        </Box>
      </Paper>
    </>
  );
}
