"use client";
import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { api } from "@/services/api";
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  Typography,
  Container,
  CircularProgress,
  Paper,
} from "@mui/material";
import {
  Home as HomeIcon,
  Search as SearchIcon,
  Person as PersonIcon,
  Villa as VillaIcon,
} from "@mui/icons-material";

/**
 * Top Navigation Bar component
 * Horizontal navigation bar optimized for desktop and tablet screens
 */
const TopNavigationBar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [loadingRandomProperty, setLoadingRandomProperty] = useState(false);

  // Determine current active section based on pathname
  const getCurrentSection = () => {
    if (pathname === "/") return "home";
    if (pathname === "/search") return "search";
    if (pathname.startsWith("/property/")) return "properties";
    if (pathname === "/asesoria") return "advisory";
    return "home";
  };

  const [activeSection, setActiveSection] = useState(getCurrentSection());

  // Update active section when pathname changes
  useEffect(() => {
    setActiveSection(getCurrentSection());
  }, [pathname]);

  const handleNavigation = async (section) => {
    setActiveSection(section);

    switch (section) {
      case "home":
        router.push("/");
        break;
      case "search":
        router.push("/search");
        break;
      case "properties":
        await handlePropertiesClick();
        break;
      case "advisory":
        router.push("/asesoria");
        break;
      default:
        break;
    }
  };

  const handlePropertiesClick = async () => {
    try {
      setLoadingRandomProperty(true);

      // Get some properties to choose from
      const response = await api.getPublicProperties(1, 20);

      if (response?.data && response.data.length > 0) {
        // Select a random property
        const randomIndex = Math.floor(Math.random() * response.data.length);
        const randomProperty = response.data[randomIndex];

        if (randomProperty?.prototypeId) {
          router.push(`/property/${randomProperty.prototypeId}`);
        } else {
          // Fallback to search page if no valid property found
          router.push("/search");
        }
      } else {
        // Fallback to search page if no properties available
        router.push("/search");
      }
    } catch (error) {
      console.error("Error loading random property:", error);
      // Fallback to search page on error
      router.push("/search");
    } finally {
      setLoadingRandomProperty(false);
    }
  };

  const navigationItems = [
    {
      key: "home",
      label: "Inicio",
      icon: HomeIcon,
      description: "Página principal",
    },
    {
      key: "search",
      label: "Buscar",
      icon: SearchIcon,
      description: "Buscar propiedades",
    },
    {
      key: "properties",
      label: "Propiedades",
      icon: VillaIcon,
      description: "Ver propiedades",
    },
    {
      key: "advisory",
      label: "Asesoría",
      icon: PersonIcon,
      description: "Asesoría profesional",
    },
  ];

  return (
    <Paper
      component="nav"
      elevation={0}
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 1100,
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(240, 185, 43, 0.2)",
        display: { xs: "none", md: "block" }, // Only show on medium screens and up
      }}
    >
      <Container maxWidth="lg">
        <Toolbar
          sx={{
            minHeight: { md: 70 },
            px: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo/Brand */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography
              variant="h5"
              component="div"
              sx={{
                fontWeight: 700,
                color: "#37474F",
                fontSize: "1.5rem",
                mr: 1,
              }}
            >
              Minkaasa
            </Typography>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #F0B92B 0%, #E6A623 100%)",
                ml: 0.5,
              }}
            />
          </Box>
          {/* Navigation Items */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeSection === item.key;
              const isLoading =
                item.key === "properties" && loadingRandomProperty;

              return (
                <Button
                  key={item.key}
                  onClick={() => handleNavigation(item.key)}
                  disabled={isLoading}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 0.5,
                    px: 2.5,
                    py: 1.5,
                    borderRadius: 2,
                    minWidth: 90,
                    height: 60,
                    color: isActive ? "#F0B92B" : "#37474F",
                    backgroundColor: isActive
                      ? "rgba(240, 185, 43, 0.1)"
                      : "transparent",
                    border: isActive
                      ? "1px solid rgba(240, 185, 43, 0.3)"
                      : "1px solid transparent",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor: isActive
                        ? "rgba(240, 185, 43, 0.15)"
                        : "rgba(240, 185, 43, 0.05)",
                      border: "1px solid rgba(240, 185, 43, 0.2)",
                      transform: "translateY(-1px)",
                    },
                  }}
                >
                  {isLoading ? (
                    <CircularProgress size={20} sx={{ color: "#F0B92B" }} />
                  ) : (
                    <IconComponent
                      sx={{
                        fontSize: "1.3rem",
                        transition: "all 0.2s ease",
                      }}
                    />
                  )}
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: "0.75rem",
                      fontWeight: isActive ? 600 : 500,
                      lineHeight: 1,
                    }}
                  >
                    {item.label}
                  </Typography>
                </Button>
              );
            })}
          </Box>
          {/* Right side - could add user menu, notifications, etc. */}
          <Box sx={{ width: 120 }} /> {/* Spacer for balance */}
        </Toolbar>
      </Container>
    </Paper>
  );
};

export default TopNavigationBar;
