"use client";
import * as React from "react";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Typography from "@mui/material/Typography";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Box from "@mui/material/Box";
import SearchBar from "./SearchBar";

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
        sx={{
          color: "white",
          marginTop: {
            xs: "0px",
            sm: "50px",
          },
          padding: "20px",
          // height: {
          //   xs: "250px",
          //   sm: "350px",
          //   md: "400px",
          // },
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
      {/* <Paper
      elevation={8}
      sx={{
        backgroundImage: "url(/house_test/c.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "white",
        marginTop: {
          xs: "0px",
          sm: "50px",
        },
        padding: "20px",
        height: {
          xs: "250px",
          sm: "350px",
          md: "400px",
        },
      }}
    ></Paper> */}
    </>
  );
}
