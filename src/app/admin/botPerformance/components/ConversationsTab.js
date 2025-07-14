"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import {
  Chat,
  Speed,
  CheckCircle,
  Search,
  ExpandMore,
  Psychology,
  ThumbUp,
  ThumbDown,
  Remove,
} from "@mui/icons-material";

import PeriodSelector from "./common/PeriodSelector";
import MetricCard from "./common/MetricCard";
import { useBotPerformance } from "@/hooks/botPerformance/useBotPerformance";

const ConversationsTab = ({ period, onPeriodChange }) => {
  const [data, setData] = useState(null);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [actionFilter, setActionFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const { loading, error, getConversations } = useBotPerformance();

  useEffect(() => {
    loadConversationsData();
  }, [period, page, pageSize, actionFilter]);

  const loadConversationsData = async () => {
    try {
      const response = await getConversations({
        period,
        page: page + 1,
        pageSize,
        action: actionFilter,
        search: searchTerm,
      });
      setData(response.data);
    } catch (error) {
      console.error("Error loading conversations data:", error);
    }
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleActionFilterChange = (event) => {
    setActionFilter(event.target.value);
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.9) return "success";
    if (confidence >= 0.7) return "warning";
    return "error";
  };

  const getConfidenceLabel = (confidence) => {
    if (confidence >= 0.9) return "Alta";
    if (confidence >= 0.7) return "Media";
    return "Baja";
  };

  const getSatisfactionIcon = (satisfaction) => {
    switch (satisfaction) {
      case "positive":
        return <ThumbUp color="success" fontSize="small" />;
      case "negative":
        return <ThumbDown color="error" fontSize="small" />;
      default:
        return <Remove color="disabled" fontSize="small" />;
    }
  };

  const getSatisfactionColor = (satisfaction) => {
    switch (satisfaction) {
      case "positive":
        return "success";
      case "negative":
        return "error";
      default:
        return "default";
    }
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
        No se pudieron cargar los datos de conversaciones
      </Alert>
    );
  }

  const {
    conversations,
    actionAnalysis,
    conversationFlow,
    qualityMetrics,
    total,
  } = data;

  return (
    <Box>
      <PeriodSelector period={period} onPeriodChange={onPeriodChange} />

      {/* Métricas Principales */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Conversaciones"
            value={total?.toLocaleString() || "0"}
            subtitle="Mensajes procesados"
            icon={<Chat />}
            color="primary"
            size="medium"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Longitud Promedio"
            value={conversationFlow?.avg_length || "0"}
            subtitle="Mensajes por conversación"
            icon={<Chat />}
            color="info"
            size="medium"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Tiempo Respuesta"
            value={`${(conversationFlow?.avg_response_time || 0).toFixed(1)}s`}
            subtitle="Promedio"
            icon={<Speed />}
            color="warning"
            size="medium"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Score de Calidad"
            value={`${(qualityMetrics?.avg_quality_score * 100 || 0).toFixed(
              1
            )}%`}
            subtitle="Promedio"
            icon={<CheckCircle />}
            color="success"
            size="medium"
          />
        </Grid>
      </Grid>

      {/* Filtros */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Buscar por usuario"
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <Search sx={{ mr: 1, color: "text.secondary" }} />
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Filtrar por acción</InputLabel>
              <Select
                value={actionFilter}
                onChange={handleActionFilterChange}
                label="Filtrar por acción"
              >
                <MenuItem value="">Todas las acciones</MenuItem>
                <MenuItem value="general-info">Información General</MenuItem>
                <MenuItem value="profiling">Perfilado</MenuItem>
                <MenuItem value="property-search">
                  Búsqueda de Propiedades
                </MenuItem>
                <MenuItem value="appointment-booking">
                  Reserva de Citas
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Análisis de Acciones */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" gutterBottom>
              Análisis por Acción
            </Typography>
            <Box sx={{ mt: 2 }}>
              {actionAnalysis &&
                Object.entries(actionAnalysis).map(([action, data]) => (
                  <Box
                    key={action}
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
                        {action.replace("-", " ")}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {data.count} conversaciones
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: "right" }}>
                      <Typography
                        variant="h6"
                        color="success.main"
                        fontWeight="bold"
                      >
                        {data.success_rate}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Tasa de éxito
                      </Typography>
                    </Box>
                  </Box>
                ))}
            </Box>
          </Paper>
        </Grid>

        {/* Satisfacción por Acción */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" gutterBottom>
              Satisfacción por Acción
            </Typography>
            <Box sx={{ mt: 2 }}>
              {actionAnalysis &&
                Object.entries(actionAnalysis).map(([action, data]) => (
                  <Box
                    key={action}
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
                      {action.replace("-", " ")}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Chip
                        label={`${data.avg_confidence * 100}%`}
                        color={getConfidenceColor(data.avg_confidence)}
                        size="small"
                      />
                    </Box>
                  </Box>
                ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Distribución de Satisfacción */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Distribución de Satisfacción del Usuario
        </Typography>
        <Box sx={{ mt: 2 }}>
          {qualityMetrics?.satisfaction_distribution &&
            Object.entries(qualityMetrics.satisfaction_distribution).map(
              ([sentiment, count]) => (
                <Box key={sentiment} sx={{ mb: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ textTransform: "capitalize" }}
                    >
                      {sentiment === "positive"
                        ? "Positivo"
                        : sentiment === "negative"
                        ? "Negativo"
                        : "Neutral"}
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {count} conversaciones
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={
                      (count /
                        Math.max(
                          ...Object.values(
                            qualityMetrics.satisfaction_distribution
                          )
                        )) *
                      100
                    }
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: "grey.200",
                      "& .MuiLinearProgress-bar": {
                        backgroundColor:
                          sentiment === "positive"
                            ? "success.main"
                            : sentiment === "negative"
                            ? "error.main"
                            : "warning.main",
                      },
                    }}
                  />
                </Box>
              )
            )}
        </Box>
      </Paper>

      {/* Tabla de Conversaciones */}
      <Paper elevation={2}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Usuario</TableCell>
                <TableCell>Mensaje</TableCell>
                <TableCell>Respuesta</TableCell>
                <TableCell>Acción</TableCell>
                <TableCell>Confianza</TableCell>
                <TableCell>Satisfacción</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {conversations &&
                conversations.map((conversation) => (
                  <TableRow key={conversation.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {conversation.user_name || "Usuario"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{
                          maxWidth: 200,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {conversation.user_message}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{
                          maxWidth: 200,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {conversation.bot_response}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={
                          conversation.detected_action?.replace("-", " ") ||
                          "N/A"
                        }
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getConfidenceLabel(
                          conversation.confidence_score
                        )}
                        color={getConfidenceColor(
                          conversation.confidence_score
                        )}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        {getSatisfactionIcon(conversation.user_satisfaction)}
                        <Chip
                          label={conversation.user_satisfaction || "N/A"}
                          color={getSatisfactionColor(
                            conversation.user_satisfaction
                          )}
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={total || 0}
          page={page}
          onPageChange={handlePageChange}
          rowsPerPage={pageSize}
          onRowsPerPageChange={handlePageSizeChange}
          rowsPerPageOptions={[5, 10, 15, 25]}
          labelRowsPerPage="Filas por página:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
          }
        />
      </Paper>
    </Box>
  );
};

export default ConversationsTab;
