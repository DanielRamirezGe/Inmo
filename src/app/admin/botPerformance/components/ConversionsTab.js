"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Chip,
  LinearProgress,
} from "@mui/material";
import {
  TrendingUp,
  Assignment,
  People,
  Home,
  CheckCircle,
  Cancel,
  Schedule,
} from "@mui/icons-material";

import PeriodSelector from "./common/PeriodSelector";
import MetricCard from "./common/MetricCard";
import { useBotPerformance } from "@/hooks/botPerformance/useBotPerformance";

const ConversionsTab = ({ period, onPeriodChange }) => {
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const { loading, error, getConversions } = useBotPerformance();

  useEffect(() => {
    loadConversionsData();
  }, [period]);

  const loadConversionsData = async () => {
    try {
      const response = await getConversions({
        period,
      });
      setData(response.data);
    } catch (error) {
      console.error("Error loading conversions data:", error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (loading && !data) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!data) {
    return (
      <Alert severity="error">
        No se pudieron cargar los datos de conversiones
      </Alert>
    );
  }

  const { appointments, advisorRequests, properties, conversionFunnel } = data;

  const tabs = [
    { label: "Embudo de Conversión", value: 0 },
    { label: "Citas", value: 1 },
    { label: "Solicitudes de Asesor", value: 2 },
    { label: "Propiedades", value: 3 },
  ];

  const renderFunnelTab = () => (
    <Box>
      {/* Métricas de Conversión */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Tasa de Conversión"
            value={`${(
              (appointments?.completed / appointments?.total) * 100 || 0
            ).toFixed(1)}%`}
            subtitle="Citas completadas"
            icon={<TrendingUp />}
            color="success"
            size="medium"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Citas Creadas"
            value={appointments?.total || "0"}
            subtitle="Total de citas"
            icon={<Assignment />}
            color="primary"
            size="medium"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Solicitudes Asesor"
            value={advisorRequests?.total || "0"}
            subtitle="Solicitudes totales"
            icon={<People />}
            color="info"
            size="medium"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Propiedades Vistas"
            value={properties?.total_shown || "0"}
            subtitle="Propiedades mostradas"
            icon={<Home />}
            color="positiveAccent"
            size="medium"
          />
        </Grid>
      </Grid>

      {/* Embudo de Conversión */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Embudo de Conversión
        </Typography>
        <Box sx={{ mt: 3 }}>
          {conversionFunnel?.stages &&
            conversionFunnel.stages.map((stage, index) => (
              <Box key={index} sx={{ mb: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography
                    variant="body1"
                    fontWeight="medium"
                    sx={{ textTransform: "capitalize" }}
                  >
                    {stage.stage.replace("_", " ")}
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {stage.conversion_rate}%
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    {stage.completed} de {stage.total} usuarios
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={stage.conversion_rate}
                  sx={{
                    height: 12,
                    borderRadius: 6,
                    backgroundColor: "grey.200",
                    "& .MuiLinearProgress-bar": {
                      backgroundColor:
                        stage.conversion_rate >= 70
                          ? "success.main"
                          : stage.conversion_rate >= 40
                          ? "warning.main"
                          : "error.main",
                    },
                  }}
                />
              </Box>
            ))}
        </Box>
      </Paper>

      {/* Análisis de Dropoff */}
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Análisis de Dropoff
        </Typography>
        <Box sx={{ mt: 2 }}>
          {conversionFunnel?.dropoff_rates &&
            Object.entries(conversionFunnel.dropoff_rates).map(
              ([stage, rate]) => (
                <Box
                  key={stage}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    py: 2,
                    px: 2,
                    mb: 1,
                    backgroundColor: "background.default",
                    borderRadius: 1,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ textTransform: "capitalize" }}
                  >
                    {stage.replace(/_/g, " ")}
                  </Typography>
                  <Chip
                    label={`${rate}%`}
                    color={
                      rate <= 20 ? "success" : rate <= 40 ? "warning" : "error"
                    }
                    size="small"
                  />
                </Box>
              )
            )}
        </Box>
      </Paper>
    </Box>
  );

  const renderAppointmentsTab = () => (
    <Box>
      {/* Métricas de Citas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Citas Completadas"
            value={appointments?.completed || "0"}
            subtitle="Citas exitosas"
            icon={<CheckCircle />}
            color="success"
            size="medium"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Citas Canceladas"
            value={appointments?.cancelled || "0"}
            subtitle="Citas canceladas"
            icon={<Cancel />}
            color="error"
            size="medium"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Tasa de Completitud"
            value={`${appointments?.conversion_rate || 0}%`}
            subtitle="Citas completadas"
            icon={<TrendingUp />}
            color="primary"
            size="medium"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Tiempo Promedio"
            value={`${appointments?.avg_completion_time || 0} días`}
            subtitle="Hasta completar"
            icon={<Schedule />}
            color="info"
            size="medium"
          />
        </Grid>
      </Grid>

      {/* Distribución de Citas */}
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Distribución de Citas
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: "center", p: 2 }}>
                <Typography variant="h4" color="success.main" fontWeight="bold">
                  {appointments?.completed || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Completadas
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: "center", p: 2 }}>
                <Typography variant="h4" color="warning.main" fontWeight="bold">
                  {appointments?.total -
                    appointments?.completed -
                    appointments?.cancelled || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Pendientes
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: "center", p: 2 }}>
                <Typography variant="h4" color="error.main" fontWeight="bold">
                  {appointments?.cancelled || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Canceladas
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );

  const renderAdvisorRequestsTab = () => (
    <Box>
      {/* Métricas de Solicitudes */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Solicitudes Resueltas"
            value={advisorRequests?.resolved || "0"}
            subtitle="Solicitudes atendidas"
            icon={<CheckCircle />}
            color="success"
            size="medium"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Solicitudes Pendientes"
            value={advisorRequests?.pending || "0"}
            subtitle="En espera"
            icon={<Schedule />}
            color="warning"
            size="medium"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Tasa de Resolución"
            value={`${(
              (advisorRequests?.resolved / advisorRequests?.total) * 100 || 0
            ).toFixed(1)}%`}
            subtitle="Solicitudes resueltas"
            icon={<TrendingUp />}
            color="primary"
            size="medium"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Alta Prioridad"
            value={advisorRequests?.priority_distribution?.high || "0"}
            subtitle="Solicitudes urgentes"
            icon={<People />}
            color="error"
            size="medium"
          />
        </Grid>
      </Grid>

      {/* Distribución por Prioridad */}
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Distribución por Prioridad
        </Typography>
        <Box sx={{ mt: 2 }}>
          {advisorRequests?.priority_distribution &&
            Object.entries(advisorRequests.priority_distribution).map(
              ([priority, count]) => (
                <Box
                  key={priority}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    py: 2,
                    px: 2,
                    mb: 1,
                    backgroundColor: "background.default",
                    borderRadius: 1,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ textTransform: "capitalize" }}
                  >
                    {priority === "high"
                      ? "Alta"
                      : priority === "medium"
                      ? "Media"
                      : "Baja"}
                  </Typography>
                  <Chip
                    label={count}
                    color={
                      priority === "high"
                        ? "error"
                        : priority === "medium"
                        ? "warning"
                        : "default"
                    }
                    size="small"
                  />
                </Box>
              )
            )}
        </Box>
      </Paper>
    </Box>
  );

  const renderPropertiesTab = () => (
    <Box>
      {/* Métricas de Propiedades */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Propiedades Mostradas"
            value={properties?.total_shown || "0"}
            subtitle="Total de vistas"
            icon={<Home />}
            color="primary"
            size="medium"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Usuarios Únicos"
            value={properties?.unique_users || "0"}
            subtitle="Usuarios que vieron propiedades"
            icon={<People />}
            color="info"
            size="medium"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Promedio por Usuario"
            value={properties?.avg_per_user?.toFixed(1) || "0"}
            subtitle="Propiedades por usuario"
            icon={<TrendingUp />}
            color="success"
            size="medium"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Propiedades Populares"
            value={properties?.top_properties?.length || "0"}
            subtitle="Con más vistas"
            icon={<Home />}
            color="positiveAccent"
            size="medium"
          />
        </Grid>
      </Grid>

      {/* Propiedades Más Vistas */}
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Propiedades Más Vistas
        </Typography>
        <Box sx={{ mt: 2 }}>
          {properties?.top_properties &&
            properties.top_properties.map((property, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  py: 2,
                  px: 2,
                  mb: 1,
                  backgroundColor: "background.default",
                  borderRadius: 1,
                }}
              >
                <Box>
                  <Typography variant="body1" fontWeight="medium">
                    Propiedad #{property.property_id}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {property.view_count} vistas
                  </Typography>
                </Box>
                <Chip label={`#${index + 1}`} color="primary" size="small" />
              </Box>
            ))}
        </Box>
      </Paper>
    </Box>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return renderFunnelTab();
      case 1:
        return renderAppointmentsTab();
      case 2:
        return renderAdvisorRequestsTab();
      case 3:
        return renderPropertiesTab();
      default:
        return renderFunnelTab();
    }
  };

  return (
    <Box>
      <PeriodSelector period={period} onPeriodChange={onPeriodChange} />

      {/* Tabs de Conversiones */}
      <Paper elevation={2} sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          {tabs.map((tab) => (
            <Tab key={tab.value} label={tab.label} />
          ))}
        </Tabs>
      </Paper>

      {/* Contenido del Tab */}
      {renderTabContent()}
    </Box>
  );
};

export default ConversionsTab;
