"use client";
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { useRouter } from "next/navigation";

const adminNavItems = [
  "Usuarios",
  "Agregar Usuario",
  "Perfiladores",
  "Datos Web",
  "Propiedades",
  "Bot Performance",
];

export default function AdminNavBar() {
  const router = useRouter();

  const handleNavigation = (item) => {
    if (item === "Usuarios") {
      router.push("/admin");
    } else if (item === "Perfiladores") {
      router.push("/admin/profiler");
    } else if (item === "Datos Web") {
      router.push("/admin/webPerformance");
    } else if (item === "Agregar Usuario") {
      router.push("/admin/addUser");
    } else if (item === "Propiedades") {
      router.push("/admin/properties");
    } else if (item === "Bot Performance") {
      router.push("/admin/botPerformance");
    }
    //  else if (item === "Settings") {
    //   router.push("/admin/settings");
    // }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          ></IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Admin Panel
          </Typography>
          {adminNavItems.map((item) => (
            <Button
              key={item}
              color="inherit"
              onClick={() => handleNavigation(item)}
            >
              {item}
            </Button>
          ))}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
