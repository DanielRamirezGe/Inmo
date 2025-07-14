"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Typography,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  People,
  Chat,
  Speed,
  CheckCircle,
  TrendingUp,
  Assignment,
} from "@mui/icons-material";

import PeriodSelector from "./common/PeriodSelector";
import MetricCard from "./common/MetricCard";
import { useBotPerformance } from "@/hooks/botPerformance/useBotPerformance";

const OverviewTab = ({ period, onPeriodChange }) => {
  const [data, setData] = useState(null);
  const { loading, error, getOverview } = useBotPerformance();

  useEffect(() => {
    loadOverviewData();
  }, [period]);

  const loadOverviewData = async () => {
    try {
      const response = await getOverview(period);
      setData(response.data);
    } catch (error) {
      console.error("Error loading overview data:", error);
    }
  };

  if (loading) {
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
        No se pudieron cargar los datos del overview
      </Alert>
    );
  }

  const {
    totalUsers,
    activeUsers,
    totalConversations,
    avgMessagesPerUser,
    avgResponseTime,
    profileCompletionRate,
    actionDistribution,
    userSatisfaction,
    topPerformingActions,
    conversionMetrics,
  } = data;

  return (
    <Box>
      <PeriodSelector period={period} onPeriodChange={onPeriodChange} />

      {/* Métricas Principales */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Usuarios"
            value={totalUsers?.toLocaleString() || "0"}
            subtitle="Usuarios registrados"
            icon={<People />}
            color="primary"
            size="medium"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Usuarios Activos"
            value={activeUsers?.toLocaleString() || "0"}
            subtitle="Últimos 7 días"
            icon={<TrendingUp />}
            color="success"
            size="medium"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Conversaciones"
            value={totalConversations?.toLocaleString() || "0"}
            subtitle="Total de mensajes"
            icon={<Chat />}
            color="info"
            size="medium"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Tiempo Respuesta"
            value={`${(avgResponseTime / 1000).toFixed(1)}s`}
            subtitle="Promedio"
            icon={<Speed />}
            color="warning"
            size="medium"
          />
        </Grid>
      </Grid>

      {/* Segunda fila de métricas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Mensajes/Usuario"
            value={avgMessagesPerUser?.toFixed(1) || "0"}
            subtitle="Promedio por usuario"
            icon={<Chat />}
            color="secondary"
            size="small"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Perfiles Completos"
            value={`${profileCompletionRate?.toFixed(1)}%`}
            subtitle="Tasa de completitud"
            icon={<CheckCircle />}
            color="success"
            size="small"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Citas Creadas"
            value={conversionMetrics?.appointmentsCreated || "0"}
            subtitle="Conversiones"
            icon={<Assignment />}
            color="positiveAccent"
            size="small"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Solicitudes Asesor"
            value={conversionMetrics?.advisorRequests || "0"}
            subtitle="Solicitudes"
            icon={<People />}
            color="info"
            size="small"
          />
        </Grid>
      </Grid>

      {/* Gráficas y Análisis */}
      <Grid container spacing={3}>
        {/* Distribución de Acciones */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" gutterBottom>
              Distribución de Acciones
            </Typography>
            <Box sx={{ mt: 2 }}>
              {actionDistribution &&
                typeof actionDistribution === "object" &&
                Object.entries(actionDistribution).map(([action, data]) => (
                  <Box
                    key={action}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      py: 1,
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ textTransform: "capitalize" }}
                    >
                      {action ? action.replace("-", " ") : "Acción desconocida"}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        {data?.count || 0}
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {data?.percentage || 0}%
                      </Typography>
                    </Box>
                  </Box>
                ))}
            </Box>
          </Paper>
        </Grid>

        {/* Satisfacción del Usuario */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" gutterBottom>
              Satisfacción del Usuario
            </Typography>
            <Box sx={{ mt: 2 }}>
              {userSatisfaction &&
                typeof userSatisfaction === "object" &&
                Object.entries(userSatisfaction).map(([sentiment, count]) => (
                  <Box
                    key={sentiment}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      py: 1,
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        textTransform: "capitalize",
                        color:
                          sentiment === "positive"
                            ? "success.main"
                            : sentiment === "negative"
                            ? "error.main"
                            : "warning.main",
                      }}
                    >
                      {sentiment === "positive"
                        ? "Positivo"
                        : sentiment === "negative"
                        ? "Negativo"
                        : "Neutral"}
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {count}
                    </Typography>
                  </Box>
                ))}
            </Box>
          </Paper>
        </Grid>

        {/* Acciones Top Performing */}
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Acciones con Mejor Performance
            </Typography>
            <Box sx={{ mt: 2 }}>
              {topPerformingActions &&
              Array.isArray(topPerformingActions) &&
              topPerformingActions.length > 0 ? (
                topPerformingActions.map((action, index) => (
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
                      <Typography
                        variant="body1"
                        fontWeight="medium"
                        sx={{ textTransform: "capitalize" }}
                      >
                        {action.detected_action
                          ? action.detected_action.replace("-", " ")
                          : "Acción desconocida"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {action?.usage_count || 0} usos
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: "right" }}>
                      <Typography
                        variant="h6"
                        color="success.main"
                        fontWeight="bold"
                      >
                        {action?.success_rate || 0}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Tasa de éxito
                      </Typography>
                    </Box>
                  </Box>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No hay datos de acciones disponibles
                </Typography>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OverviewTab;
