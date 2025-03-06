"use client";
import * as React from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useRouter } from "next/navigation";
import SearchBar from "./SearchBar";
import Grid from "@mui/material/Grid2";

const drawerWidth = 240;
const navItems = ["Home", "Nosotros", "Contacto"];
const nameImno = "Minkaasa";

function DrawerAppBar(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const router = useRouter();
  const imageIcon = "/logo/icon.png";
  const handleNavigation = (item) => {
    if (item === "Nosotros") {
      router.push("/about");
    } else if (item === "Home") {
      router.push("/");
    } else if (item === "Contacto") {
      router.push("/contact");
    }
  };

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        {nameImno}
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item} disablePadding>
            <ListItemButton
              sx={{ textAlign: "center" }}
              onClick={() => handleNavigation(item)}
            >
              <ListItemText primary={item} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar component="nav" sx={{ backgroundColor: "#fff" }}>
        <Toolbar>
          <Grid container sx={{ width: "100%" }}>
            <Grid size={{ xs: 2, sm: 4 }}>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2, display: { sm: "none" }, color: "#000" }}
              >
                <MenuIcon />
              </IconButton>
              <Typography
                variant="h6"
                component="div"
                sx={{
                  flexGrow: 1,
                  display: { xs: "none", sm: "block" },
                  color: "#000",
                }}
              >
                {nameImno}
              </Typography>
            </Grid>
            <Grid size={{ xs: 8, sm: 4 }}>
              <Box
                sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}
              >
                <Box sx={{ width: "100%", maxWidth: "800px" }}>
                  <SearchBar />
                </Box>
              </Box>
            </Grid>
            <Grid
              size={{ xs: 2, sm: 4 }}
              sx={{
                display: { xs: "flex", sm: "none" },
                justifyContent: "flex-end",
              }}
            >
              <img
                src={imageIcon}
                style={{ maxHeight: "40px", maxWidth: "50px" }}
              />
            </Grid>

            <Grid size={{ xs: 10, sm: 4 }}>
              <Box
                sx={{
                  display: { xs: "none", sm: "flex" },
                  justifyContent: "flex-end",
                }}
              >
                {navItems.map((item) => (
                  <Button
                    key={item}
                    sx={{ color: "#000", fontSize: { sm: "12px", md: "16px" } }}
                    onClick={() => handleNavigation(item)}
                  >
                    {item}
                  </Button>
                ))}
              </Box>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
    </Box>
  );
}

DrawerAppBar.propTypes = {
  window: PropTypes.func,
};

export default DrawerAppBar;
