"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MainHeader from "./components/mainHeader";
import PropertiesGrid from "@/components/PropertiesGrid";
import BottomNavigationBar from "@/components/BottomNavigationBar";
import TopNavigationBar from "@/components/TopNavigationBar";
import MapPropertiesCard from "@/components/MapPropertiesCard";
import {
  Container,
  Typography,
  Box,
  Divider,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import styles from "./page.module.css";

export default function Home() {
  const theme = useTheme();
  const router = useRouter();
  const isTablet = useMediaQuery(theme.breakpoints.up("md")); // 900px y superior
  const isSmallTablet = useMediaQuery("(min-width:730px)"); // 750px y superior

  // Estado para las propiedades del mapa
  const [mapProperties, setMapProperties] = useState([]);
  const [mapLoading, setMapLoading] = useState(false);
  const [mapError, setMapError] = useState(null);

  const handlePropertyClick = (propertyId) => {
    // Navegar a la página de detalle de la propiedad
    if (propertyId) {
      router.push(`/property/${propertyId}`);
    }
  };

  // Callback para recibir las propiedades del mapa
  const handleMapPropertiesUpdate = (properties, loading, error) => {
    setMapProperties(properties || []);
    setMapLoading(loading || false);
    setMapError(error || null);
  };

  // Altura responsiva del mapa
  const getMapHeight = () => {
    if (isTablet) return "600px"; // Desktop y tablets grandes
    if (isSmallTablet) return "600px"; // Tablets medianos (750px+) - doble de largo que propiedades
    return "400px"; // Mobile
  };

  return (
    <>
      {/* Top Navigation Bar for Desktop/Tablet */}
      <TopNavigationBar />

      <MainHeader />

      {/* Sección del Mapa y Propiedades - Card unificada */}
      <Container maxWidth="xl" className={styles.mapPropertiesSection}>
        <MapPropertiesCard
          properties={mapProperties}
          loading={mapLoading}
          error={mapError}
          onPropertyClick={handlePropertyClick}
          onPropertiesUpdate={handleMapPropertiesUpdate}
          height={getMapHeight()}
          showControls={true}
          compact={!isSmallTablet}
        />
      </Container>

      {/* Bottom Navigation Bar for Mobile */}
      <BottomNavigationBar />
    </>
  );
}
