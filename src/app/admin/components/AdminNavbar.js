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

const adminNavItems = ["Dashboard", "Users", "Settings"];

export default function AdminNavBar() {
  const router = useRouter();

  const handleNavigation = (item) => {
    if (item === "Dashboard") {
      router.push("/admin/dashboard");
    } else if (item === "Users") {
      router.push("/admin/users");
    } else if (item === "Settings") {
      router.push("/admin/settings");
    }
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
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            admin Panel
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
