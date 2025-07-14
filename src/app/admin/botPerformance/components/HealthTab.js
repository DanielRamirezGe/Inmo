"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import {
  CheckCircle,
  Error,
  Warning,
  Speed,
  Memory,
  Storage,
  NetworkCheck,
  Schedule,
  TrendingUp,
} from "@mui/icons-material";

import PeriodSelector from "./common/PeriodSelector";
import MetricCard from "./common/MetricCard";
import { useBotPerformance } from "@/hooks/botPerformance/useBotPerformance";

const HealthTab = ({ period, onPeriodChange }) => {
  const [data, setData] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const { loading, error, getHealth } = useBotPerformance();

  useEffect(() => {
    loadHealthData();
    // Actualizar cada 30 segundos
    const interval = setInterval(() => {
      loadHealthData();
      setLastUpdate(new Date());
    }, 30000);

    return () => clearInterval(interval);
  }, [period]);

  const loadHealthData = async () => {
    try {
      const response = await getHealth();
      setData(response.data);
    } catch (error) {
      console.error("Error loading health data:", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "healthy":
        return "success";
      case "warning":
        return "warning";
      case "critical":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "healthy":
        return <CheckCircle color="success" />;
      case "warning":
        return <Warning color="warning" />;
      case "critical":
        return <Error color="error" />;
      default:
        return <Error color="disabled" />;
    }
  };

  const getUptimeDisplay = (seconds) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const getPerformanceColor = (value, thresholds) => {
    if (value <= thresholds.good) return "success";
    if (value <= thresholds.warning) return "warning";
    return "error";
  };

  const formatMetricValue = (value) => {
    if (typeof value === "object" && value !== null) {
      // If it's an object with specific keys, format it nicely
      if (
        value.threadsConnected !== undefined ||
        value.threadsRunning !== undefined
      ) {
        return `${value.threadsConnected || 0}/${
          value.threadsRunning || 0
        } threads`;
      }
      // For other objects, show as JSON
      return JSON.stringify(value);
    }
    return String(value);
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
        No se pudieron cargar los datos de salud del sistema
      </Alert>
    );
  }

  const {
    status,
    uptime,
    database_health,
    performance_metrics,
    performance_alerts,
    recommendations,
  } = data;

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <PeriodSelector period={period} onPeriodChange={onPeriodChange} />
        <Typography variant="body2" color="text.secondary">
          Última actualización: {lastUpdate.toLocaleTimeString()}
        </Typography>
      </Box>

      {/* Estado General del Sistema */}
      <Paper
        elevation={2}
        sx={{
          p: 3,
          mb: 4,
          border: `2px solid ${
            getStatusColor(status) === "success"
              ? "#4caf50"
              : getStatusColor(status) === "warning"
              ? "#ff9800"
              : "#f44336"
          }`,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          {getStatusIcon(status)}
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{ textTransform: "capitalize" }}
          >
            Estado:{" "}
            {status === "healthy"
              ? "Saludable"
              : status === "warning"
              ? "Advertencia"
              : "Crítico"}
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">
          Uptime: {getUptimeDisplay(uptime)}
        </Typography>
      </Paper>

      {/* Métricas Críticas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Tasa de Errores"
            value={`${performance_metrics?.error_rate || 0}%`}
            subtitle="Errores del sistema"
            icon={<Error />}
            color={getPerformanceColor(performance_metrics?.error_rate || 0, {
              good: 2,
              warning: 5,
            })}
            size="medium"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Tiempo de Respuesta"
            value={`${(performance_metrics?.avg_response_time / 1000).toFixed(
              1
            )}s`}
            subtitle="Promedio"
            icon={<Speed />}
            color={getPerformanceColor(
              performance_metrics?.avg_response_time || 0,
              { good: 2000, warning: 5000 }
            )}
            size="medium"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Usuarios Activos"
            value={performance_metrics?.active_users_last_hour || "0"}
            subtitle="Última hora"
            icon={<TrendingUp />}
            color="primary"
            size="medium"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Estado DB"
            value={
              database_health?.status === "healthy" ? "Saludable" : "Problema"
            }
            subtitle="Base de datos"
            icon={<Storage />}
            color={database_health?.status === "healthy" ? "success" : "error"}
            size="medium"
          />
        </Grid>
      </Grid>

      {/* Métricas de Base de Datos */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" gutterBottom>
              Métricas de Base de Datos
            </Typography>
            <Box sx={{ mt: 2 }}>
              {database_health?.metrics &&
                typeof database_health.metrics === "object" &&
                Object.entries(database_health.metrics).map(
                  ([metric, value]) => (
                    <Box
                      key={metric}
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
                        {metric.replace("_", " ")}
                      </Typography>
                      <Chip
                        label={formatMetricValue(value)}
                        color={
                          metric.includes("long_running") &&
                          typeof value === "number" &&
                          value > 0
                            ? "error"
                            : "success"
                        }
                        size="small"
                      />
                    </Box>
                  )
                )}
            </Box>
          </Paper>
        </Grid>

        {/* Performance Metrics */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" gutterBottom>
              Métricas de Performance
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" gutterBottom>
                  Tiempo Máximo de Respuesta
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(
                    (performance_metrics?.max_response_time / 10000) * 100,
                    100
                  )}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: "grey.200",
                    "& .MuiLinearProgress-bar": {
                      backgroundColor: getPerformanceColor(
                        performance_metrics?.max_response_time || 0,
                        { good: 5000, warning: 8000 }
                      ),
                    },
                  }}
                />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 0.5 }}
                >
                  {(performance_metrics?.max_response_time / 1000).toFixed(1)}s
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" gutterBottom>
                  Respuestas Lentas (&gt;5s)
                </Typography>
                <Chip
                  label={performance_metrics?.slow_responses || 0}
                  color={
                    performance_metrics?.slow_responses > 10
                      ? "error"
                      : performance_metrics?.slow_responses > 5
                      ? "warning"
                      : "success"
                  }
                  size="small"
                />
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Alertas y Recomendaciones */}
      <Grid container spacing={3}>
        {/* Alertas Activas */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Alertas Activas
            </Typography>
            {performance_alerts && performance_alerts.length > 0 ? (
              <List>
                {performance_alerts.map((alert, index) => (
                  <React.Fragment key={index}>
                    <ListItem>
                      <ListItemIcon>
                        <Warning color="warning" />
                      </ListItemIcon>
                      <ListItemText
                        primary={alert.message}
                        secondary={`Detectado: ${new Date(
                          alert.timestamp
                        ).toLocaleString()}`}
                      />
                    </ListItem>
                    {index < performance_alerts.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Box sx={{ textAlign: "center", py: 3 }}>
                <CheckCircle color="success" sx={{ fontSize: 48, mb: 2 }} />
                <Typography variant="body1" color="text.secondary">
                  No hay alertas activas
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Recomendaciones */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recomendaciones
            </Typography>
            {recommendations && recommendations.length > 0 ? (
              <List>
                {recommendations.map((recommendation, index) => (
                  <React.Fragment key={index}>
                    <ListItem>
                      <ListItemIcon>
                        <TrendingUp color="info" />
                      </ListItemIcon>
                      <ListItemText
                        primary={recommendation.title}
                        secondary={recommendation.description}
                      />
                    </ListItem>
                    {index < recommendations.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Box sx={{ textAlign: "center", py: 3 }}>
                <CheckCircle color="success" sx={{ fontSize: 48, mb: 2 }} />
                <Typography variant="body1" color="text.secondary">
                  No hay recomendaciones pendientes
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HealthTab;
