"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Container, Typography, Box, Paper, Chip } from "@mui/material";
import PropertiesGrid from "@/components/PropertiesGrid";
import PublicPropertyFiltersBar from "@/components/PublicPropertyFiltersBar";
import BottomNavigationBar from "@/components/BottomNavigationBar";
import TopNavigationBar from "@/components/TopNavigationBar";
import { api } from "@/services/api";
import { ENTITY_PAGINATION_CONFIG } from "../../constants/pagination";
import SearchIcon from "@mui/icons-material/Search";
import HomeIcon from "@mui/icons-material/Home";

export default function SearchPage() {
  const router = useRouter();
  const [filteredProperties, setFilteredProperties] = useState(null);
  const [isFiltered, setIsFiltered] = useState(false);
  const [currentFilters, setCurrentFilters] = useState({});
  const [allProperties, setAllProperties] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filtersLoaded, setFiltersLoaded] = useState(false);

  // Load saved filters from sessionStorage on mount
  useEffect(() => {
    const savedFilters = sessionStorage.getItem("searchFilters");
    if (savedFilters) {
      try {
        const parsedFilters = JSON.parse(savedFilters);
        setCurrentFilters(parsedFilters);
        setIsFiltered(Object.keys(parsedFilters).length > 0);
      } catch (error) {
        console.error("Error parsing saved filters:", error);
      }
    }
    setFiltersLoaded(true);
  }, []);

  // Load all properties on page mount
  useEffect(() => {
    if (filtersLoaded) {
      loadAllProperties();
    }
  }, [filtersLoaded]);

  const loadAllProperties = async () => {
    try {
      setLoading(true);

      // If we have saved filters, apply them immediately
      if (Object.keys(currentFilters).length > 0) {
        const searchFilters = { ...currentFilters, type: "all" };

        // Mapear campos específicos para la API
        if (searchFilters.propertyType) {
          searchFilters.propertyTypeId = searchFilters.propertyType;
          delete searchFilters.propertyType;
        }
        if (searchFilters.development) {
          searchFilters.developmentId = searchFilters.development;
          delete searchFilters.development;
        }

        const results = await api.searchPublicProperties(
          searchFilters,
          1,
          ENTITY_PAGINATION_CONFIG.PUBLIC_PROPERTIES.PAGE_SIZE
        );
        setFilteredProperties(results);
      } else {
        // Load all properties if no filters
        const response = await api.getPublicProperties(
          1,
          ENTITY_PAGINATION_CONFIG.PUBLIC_PROPERTIES.PAGE_SIZE * 4
        ); // Cargar más para la página inicial
        setAllProperties(response);
        setFilteredProperties(response);
      }
    } catch (error) {
      console.error("Error loading properties:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFiltersChange = (filters, results) => {
    setCurrentFilters(filters);

    // Save filters to sessionStorage
    if (Object.keys(filters).length > 0) {
      sessionStorage.setItem("searchFilters", JSON.stringify(filters));
    } else {
      sessionStorage.removeItem("searchFilters");
    }

    if (results) {
      setFilteredProperties(results);
      setIsFiltered(true);
    } else if (Object.keys(filters).length === 0) {
      // Si no hay filtros, mostrar todas las propiedades
      setFilteredProperties(allProperties);
      setIsFiltered(false);
    }
  };

  const handleLoadMore = async (page) => {
    try {
      if (Object.keys(currentFilters).length > 0) {
        const searchFilters = { ...currentFilters, type: "all" };

        // Mapear campos específicos para la API
        if (searchFilters.propertyType) {
          searchFilters.propertyTypeId = searchFilters.propertyType;
          delete searchFilters.propertyType;
        }
        if (searchFilters.development) {
          searchFilters.developmentId = searchFilters.development;
          delete searchFilters.development;
        }

        const results = await api.searchPublicProperties(
          searchFilters,
          page,
          ENTITY_PAGINATION_CONFIG.PUBLIC_PROPERTIES.PAGE_SIZE
        );
        setFilteredProperties(results);
      } else {
        // Load more general properties
        const results = await api.getPublicProperties(
          page,
          ENTITY_PAGINATION_CONFIG.PUBLIC_PROPERTIES.PAGE_SIZE
        );
        setFilteredProperties(results);
      }
    } catch (error) {
      console.error("Error loading more properties:", error);
    }
  };

  // Calculate property count
  const getPropertyCount = () => {
    if (!filteredProperties) return 0;
    return filteredProperties.data?.length || 0;
  };

  const getTotalCount = () => {
    if (!filteredProperties) return 0;
    return filteredProperties.total || filteredProperties.data?.length || 0;
  };

  // No drawer needed - properties will navigate directly to property page

  return (
    <>
      {/* Top Navigation Bar for Desktop/Tablet */}
      <TopNavigationBar />

      {/* Sophisticated Page Header */}
      <Container maxWidth="lg" sx={{ mt: { xs: 2, md: 3 }, mb: 2 }}>
        <Paper
          elevation={0}
          sx={{
            background:
              "linear-gradient(135deg, rgba(240, 185, 43, 0.08) 0%, rgba(255, 255, 255, 0.95) 100%)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(240, 185, 43, 0.3)",
            borderRadius: 3,
            p: { xs: 2.5, md: 3 },
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "3px",
              background:
                "linear-gradient(90deg, #F0B92B 0%, rgba(240, 185, 43, 0.6) 100%)",
            },
          }}
        >
          <Box>
            {/* Top row: Title and subtitle */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 1.5,
              }}
            >
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  fontSize: { xs: "1.3rem", md: "1.6rem" },
                  fontWeight: 700,
                  color: "#37474F",
                  lineHeight: 1.2,
                }}
              >
                Buscar Propiedades
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: "0.85rem", md: "0.95rem" },
                  color: "text.secondary",
                  lineHeight: 1.3,
                  textAlign: "right",
                }}
              >
                Encuentra tu hogar ideal con nuestros filtros avanzados
              </Typography>
            </Box>

            {/* Bottom row: Property info */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
              }}
            >
              {!loading && (
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: { xs: "0.8rem", md: "0.85rem" },
                    color: "#F0B92B",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                  }}
                >
                  {isFiltered
                    ? `${getPropertyCount()} de ${getTotalCount()} propiedades`
                    : `+ de ${getTotalCount() - 1} propiedades disponibles`}
                  <HomeIcon sx={{ fontSize: "0.9rem" }} />
                </Typography>
              )}

              {isFiltered && (
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: "0.75rem",
                    color: "#4CAF50",
                    fontWeight: 500,
                    fontStyle: "italic",
                  }}
                >
                  • Filtros aplicados
                </Typography>
              )}
            </Box>
          </Box>
        </Paper>
      </Container>

      {/* Filters Bar */}
      <Container maxWidth="lg" sx={{ mb: 2 }}>
        <PublicPropertyFiltersBar
          filterType="all"
          onFiltersChange={handleFiltersChange}
          initialFilters={currentFilters}
        />
      </Container>

      {/* Properties Grid */}
      <PropertiesGrid
        key="search-properties-grid"
        filteredProperties={filteredProperties}
        onLoadMore={handleLoadMore}
        isFiltered={isFiltered}
        // No onPropertyClick - will use default page navigation
      />

      {/* Bottom Navigation Bar for Mobile */}
      <BottomNavigationBar />
    </>
  );
}
