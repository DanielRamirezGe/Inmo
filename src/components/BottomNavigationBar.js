import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { api } from "@/services/api";
import {
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  Box,
  CircularProgress,
} from "@mui/material";
import {
  Home as HomeIcon,
  Search as SearchIcon,
  Person as PersonIcon,
  Villa as VillaIcon,
} from "@mui/icons-material";

/**
 * Bottom Navigation Bar component
 * Fixed navigation bar at the bottom of the screen
 */
const BottomNavigationBar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [loadingRandomProperty, setLoadingRandomProperty] = useState(false);

  // Determine current value based on pathname
  const getCurrentValue = () => {
    if (pathname === "/") return 0;
    if (pathname === "/search") return 1;
    if (pathname.startsWith("/property/")) return 2;
    if (pathname === "/asesoria") return 3;
    return 0;
  };

  const [value, setValue] = useState(getCurrentValue());

  // Update value when pathname changes
  useEffect(() => {
    setValue(getCurrentValue());
  }, [pathname]);

  const handleChange = async (event, newValue) => {
    setValue(newValue);

    // Navigation logic
    switch (newValue) {
      case 0:
        router.push("/");
        break;
      case 1:
        router.push("/search");
        break;
      case 2:
        // Properties section - show random property from available ones
        await handlePropertiesClick();
        break;
      case 3:
        // Navigate to advisory page
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

  return (
    <Paper
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(240, 185, 43, 0.2)",
        boxShadow: "0 -4px 20px rgba(0, 0, 0, 0.1)",
        display: { xs: "block", md: "none" }, // Only show on mobile and small tablets
      }}
      elevation={0}
    >
      <BottomNavigation
        value={value}
        onChange={handleChange}
        showLabels={true}
        sx={{
          backgroundColor: "transparent",
          height: { xs: 70, sm: 80 },
          "& .MuiBottomNavigationAction-root": {
            color: "#37474F",
            minWidth: { xs: 60, sm: 80 },
            "&.Mui-selected": {
              color: "#F0B92B",
            },
            "& .MuiBottomNavigationAction-label": {
              fontSize: { xs: "0.7rem", sm: "0.75rem" },
              fontWeight: 500,
              opacity: 1,
              transform: "none",
              "&.Mui-selected": {
                fontSize: { xs: "0.7rem", sm: "0.75rem" },
                fontWeight: 600,
              },
            },
          },
        }}
      >
        <BottomNavigationAction
          label="Inicio"
          icon={
            <HomeIcon
              sx={{
                fontSize: { xs: "1.3rem", sm: "1.5rem" },
                transition: "all 0.2s ease",
              }}
            />
          }
        />
        <BottomNavigationAction
          label="Buscar"
          icon={
            <SearchIcon
              sx={{
                fontSize: { xs: "1.3rem", sm: "1.5rem" },
                transition: "all 0.2s ease",
              }}
            />
          }
        />
        <BottomNavigationAction
          label="Propiedades"
          icon={
            loadingRandomProperty ? (
              <CircularProgress
                size={20}
                sx={{
                  color: "#F0B92B",
                }}
              />
            ) : (
              <VillaIcon
                sx={{
                  fontSize: { xs: "1.3rem", sm: "1.5rem" },
                  transition: "all 0.2s ease",
                }}
              />
            )
          }
        />
        <BottomNavigationAction
          label="Asesoria"
          icon={
            <PersonIcon
              sx={{
                fontSize: { xs: "1.3rem", sm: "1.5rem" },
                transition: "all 0.2s ease",
              }}
            />
          }
        />
      </BottomNavigation>
    </Paper>
  );
};

export default BottomNavigationBar;
