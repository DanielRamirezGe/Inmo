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
  const isSmallMobile = useMediaQuery("(max-width:425px)");
  const imagen = [
    "/mainBanner/minkaasa.png",
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
            maxHeight: isSmallMobile ? "100px" : "400px",
            height: isSmallMobile ? "100px" : "auto",
            overflow: "hidden",
          }}
        >
          <Carousel showThumbs={false} autoPlay infiniteLoop>
            {imagen.map((item, index) => (
              <div key={index}>
                <img
                  src={item}
                  style={{
                    maxWidth: isSmallMobile ? "100%" : "500px",
                    width: isSmallMobile ? "100%" : "auto",
                    height: isSmallMobile ? "100px" : "auto",
                    objectFit: isSmallMobile ? "contain" : "scale-down",
                    objectPosition: "center",
                  }}
                />
              </div>
            ))}
          </Carousel>
        </Box>
      </Paper>
    </>
  );
}
