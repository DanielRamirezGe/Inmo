"use client";
import * as React from "react";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import DirectionsIcon from "@mui/icons-material/Directions";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Image from "next/image";

export default function MainHeader() {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("xs"));

  return (
    <Paper
      elevation={8}
      sx={{
        backgroundImage: "url(/house_test/headerImg3.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "white",
        marginTop: {
          xs: "0px",
          sm: "50px",
        },
        padding: "20px",
        height: {
          xs: "350px",
          sm: "350px",
          md: "400px",
        },
      }}
    >
      <Box sx={{ width: { xs: "100%", sm: "80%" }, margin: "auto" }}>
        <Box padding={2}>
          <Typography
            variant="h4"
            color="white"
            sx={{ fontWeight: "bold", marginTop: { xs: "30px" } }}
          >
            No solo un lugar para vivir
          </Typography>
        </Box>
        <Paper
          component="form"
          sx={{
            p: "2px 4px",
            display: "flex",
            alignItems: "center",
            width: "auto",
          }}
          elevation={3}
        >
          <IconButton sx={{ p: "2px" }} aria-label="menu"></IconButton>
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Desarrollo, Municipio, Precios, etc."
            inputProps={{
              style: {
                fontSize: isXs ? "12px" : "inherit", // Aplica el tamaño de fuente solo en pantallas xs
              },
            }}
          />
          <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
            <SearchIcon />
          </IconButton>
        </Paper>
      </Box>
    </Paper>
  );
}
