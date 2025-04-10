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

const adminNavItems = ["Usuarios", "Metas"];

export default function ProfilerNavBar() {
  const router = useRouter();

  const handleNavigation = (item) => {
    if (item === "Usuarios") {
      router.push("/profiler");
    } else if (item === "Metas") {
      router.push("/profiler/performance");
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Perfilador Panel
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
