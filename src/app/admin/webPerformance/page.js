"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import AdminNavbar from "../components/AdminNavbar";
import { useAxiosMiddleware } from "../../../utils/axiosMiddleware";
import PersonIcon from "@mui/icons-material/Person";
import VisibilityIcon from "@mui/icons-material/Visibility";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

export default function WebPerformancePage() {
  const [performanceData, setPerformanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const axiosInstance = useAxiosMiddleware();

  useEffect(() => {
    const fetchPerformanceData = async () => {
      try {
        const response = await axiosInstance.get("/metadataWeb");
        const performanceData = response.data.data;
        setPerformanceData(performanceData);
      } catch (error) {
        setError("Error al cargar los datos de rendimiento");
        console.error("Error fetching performance data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPerformanceData();
  }, []);

  const StatCard = ({ title, value, icon, color }) => (
    <Card
      sx={{
        height: "100%",
        backgroundColor: `${color}10`,
        border: `1px solid ${color}30`,
        transition: "transform 0.2s",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: 3,
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          {icon}
          <Typography variant="h6" sx={{ ml: 1, color: `${color}` }}>
            {title}
          </Typography>
        </Box>
        <Typography
          variant={value !== "Información próximamente..." ? "h4" : "h6d"}
          sx={{ textAlign: "center", color: `${color}` }}
        >
          {value}
        </Typography>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <>
        <AdminNavbar />
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "calc(100vh - 64px)",
          }}
        >
          <CircularProgress />
        </Box>
      </>
    );
  }

  if (error) {
    return (
      <>
        <AdminNavbar />
        <Box sx={{ p: 3 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      </>
    );
  }

  return (
    <>
      <AdminNavbar />
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
          Rendimiento de la Página Web
        </Typography>

        <Grid container spacing={3}>
          <Grid xs={12} md={4}>
            <StatCard
              title="Total de Visitas"
              value={performanceData?.totalVisits || 0}
              icon={<VisibilityIcon sx={{ color: "#2196f3" }} />}
              color="#2196f3"
            />
          </Grid>

          <Grid xs={12} md={4}>
            <StatCard
              title="Usuarios Registrados"
              value={
                performanceData?.registeredUsers ||
                "Información próximamente..."
              }
              icon={<PersonIcon sx={{ color: "#4caf50" }} />}
              color="#4caf50"
            />
          </Grid>

          <Grid xs={12} md={4}>
            <StatCard
              title="Tasa de Conversión"
              //   value={`${(
              //     (performanceData?.registeredUsers /
              //       performanceData?.totalVisits) *
              //       100 || 0
              //   ).toFixed(2)}%`}
              value={"Información próximamente..."}
              icon={<TrendingUpIcon sx={{ color: "#ff9800" }} />}
              color="#ff9800"
            />
          </Grid>
        </Grid>

        {/* Sección para estadísticas adicionales */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Detalles Adicionales
          </Typography>
          <Grid container spacing={3}>
            <Grid xs={12} md={6}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Fuentes de Tráfico
                  </Typography>
                  {/* Aquí puedes agregar más detalles cuando estén disponibles */}
                  <Typography variant="body1" color="text.secondary">
                    Información próximamente...
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid xs={12} md={6}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Tendencias de Registro
                  </Typography>
                  {/* Aquí puedes agregar más detalles cuando estén disponibles */}
                  <Typography variant="body1" color="text.secondary">
                    Información próximamente...
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
}
