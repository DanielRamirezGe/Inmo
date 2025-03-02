"use client";
import * as React from "react";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

export default function MainHeader() {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("xs"));

  const slogan = "Donde los sueños se encuentran hogar";

  return (
    <Paper
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
    >
      <Box sx={{ width: { xs: "100%", sm: "80%" }, margin: "auto" }}>
        <Paper
          component="form"
          sx={{
            p: "2px 4px",
            display: "flex",
            alignItems: "center",
            width: "auto",
            marginTop: { xs: "150px", sm: "10px" },
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
