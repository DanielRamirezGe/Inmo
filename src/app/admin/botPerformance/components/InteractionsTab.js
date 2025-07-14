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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  TextField,
  InputAdornment,
} from "@mui/material";
import {
  Speed,
  Memory,
  Error,
  TrendingUp,
  Psychology,
  CheckCircle,
  Warning,
  Search,
  Lightbulb,
  AutoFixHigh,
  Token,
} from "@mui/icons-material";

import PeriodSelector from "./common/PeriodSelector";
import MetricCard from "./common/MetricCard";
import { useBotPerformance } from "@/hooks/botPerformance/useBotPerformance";

const InteractionsTab = ({ period, onPeriodChange }) => {
  const [data, setData] = useState(null);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [typeFilter, setTypeFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const { loading, error, getInteractions } = useBotPerformance();

  useEffect(() => {
    loadInteractionsData();
  }, [period, page, pageSize, typeFilter]);

  const loadInteractionsData = async () => {
    try {
      const response = await getInteractions({
        period,
        page: page + 1,
        pageSize,
        type: typeFilter,
      });
      setData(response.data);
    } catch (error) {
      console.error("Error loading interactions data:", error);
    }
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleTypeFilterChange = (event) => {
    setTypeFilter(event.target.value);
    setPage(0);
  };

  const getEfficiencyColor = (tokens) => {
    if (tokens <= 50) return "success";
    if (tokens <= 100) return "info";
    if (tokens <= 200) return "warning";
    if (tokens <= 500) return "error";
    return "error";
  };

  const getEfficiencyLabel = (tokens) => {
    if (tokens <= 50) return "Excelente";
    if (tokens <= 100) return "Bueno";
    if (tokens <= 200) return "Mediano";
    if (tokens <= 500) return "Malo";
    return "Cambiar";
  };

  const getEfficiencyRating = (tokens) => {
    if (tokens <= 50) return "Excelente (≤50)";
    if (tokens <= 100) return "Bueno (51-100)";
    if (tokens <= 200) return "Mediano (101-200)";
    if (tokens <= 500) return "Malo (201-500)";
    return "Cambiar (>500)";
  };

  const formatProcessingTime = (timeMs) => {
    return `${(timeMs / 1000).toFixed(1)}s`;
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
        No se pudieron cargar los datos de análisis de prompts
      </Alert>
    );
  }

  const {
    interactions = [],
    tokenAnalysis = {},
    tokenDistribution = {},
    promptOptimization = {},
    errorAnalysis = {},
    page: currentPage = 1,
    pageSize: currentPageSize = 20,
    total = 0,
  } = data || {};

  // Filtrar interacciones por término de búsqueda
  const filteredInteractions = (interactions || []).filter((interaction) =>
    searchTerm
      ? (interaction.user_input?.toLowerCase() || "").includes(
          searchTerm.toLowerCase()
        ) ||
        (interaction.detected_action?.toLowerCase() || "").includes(
          searchTerm.toLowerCase()
        )
      : true
  );

  return (
    <Box>
      <PeriodSelector period={period} onPeriodChange={onPeriodChange} />

      {/* Métricas de Tokens */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Promedio de Tokens"
            value={tokenAnalysis?.avg_tokens || "0"}
            subtitle="Por interacción"
            icon={<Token />}
            color={getEfficiencyColor(tokenAnalysis?.avg_tokens || 0)}
            size="medium"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Mínimo de Tokens"
            value={tokenAnalysis?.min_tokens || "0"}
            subtitle="Prompt más eficiente"
            icon={<CheckCircle />}
            color="success"
            size="medium"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Máximo de Tokens"
            value={tokenAnalysis?.max_tokens || "0"}
            subtitle="Prompt más pesado"
            icon={<Warning />}
            color="error"
            size="medium"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Interacciones"
            value={tokenAnalysis?.total_interactions?.toLocaleString() || "0"}
            subtitle="En el período"
            icon={<TrendingUp />}
            color="primary"
            size="medium"
          />
        </Grid>
      </Grid>

      {/* Filtros */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Filtrar por tipo</InputLabel>
              <Select
                value={typeFilter}
                onChange={handleTypeFilterChange}
                label="Filtrar por tipo"
              >
                <MenuItem value="">Todos los tipos</MenuItem>
                <MenuItem value="response_generation">
                  Generación de Respuesta
                </MenuItem>
                <MenuItem value="action_detection">
                  Detección de Acción
                </MenuItem>
                <MenuItem value="user_analysis">Análisis de Usuario</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Buscar en prompts"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Distribución de Eficiencia */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" gutterBottom>
              Distribución de Eficiencia de Tokens
            </Typography>
            <Box sx={{ mt: 2 }}>
              {tokenDistribution &&
                typeof tokenDistribution === "object" &&
                Object.entries(tokenDistribution).map(([category, count]) => (
                  <Box key={category} sx={{ mb: 2 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography variant="body2" fontWeight="medium">
                        {category}
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {count} prompts
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={
                        (count /
                          Math.max(...Object.values(tokenDistribution))) *
                        100
                      }
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: "grey.200",
                        "& .MuiLinearProgress-bar": {
                          backgroundColor:
                            category.includes("Excelente") ||
                            category.includes("Bueno")
                              ? "success.main"
                              : category.includes("Mediano")
                              ? "warning.main"
                              : "error.main",
                        },
                      }}
                    />
                  </Box>
                ))}
            </Box>
          </Paper>
        </Grid>

        {/* Análisis de Errores */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" gutterBottom>
              Análisis de Errores
            </Typography>
            <Box sx={{ mt: 2 }}>
              {errorAnalysis?.error_types &&
                typeof errorAnalysis.error_types === "object" &&
                Object.entries(errorAnalysis.error_types).map(
                  ([errorType, count]) => (
                    <Box
                      key={errorType}
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
                        {errorType.replace("_", " ")}
                      </Typography>
                      <Chip label={count} color="error" size="small" />
                    </Box>
                  )
                )}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Prompts Pesados y Recomendaciones */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Prompts Pesados */}
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Prompts Pesados (Top 10)
            </Typography>
            {promptOptimization?.heavy_prompts &&
            (promptOptimization?.heavy_prompts || []).length > 0 ? (
              <List>
                {promptOptimization.heavy_prompts
                  .slice(0, 10)
                  .map((prompt, index) => (
                    <React.Fragment key={index}>
                      <ListItem>
                        <ListItemIcon>
                          <Warning color="error" />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box>
                              <Typography variant="body2" fontWeight="medium">
                                {prompt.user_input?.substring(0, 100)}...
                              </Typography>
                              <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                                <Chip
                                  label={`${prompt.tokens_used} tokens`}
                                  color="error"
                                  size="small"
                                />
                                <Chip
                                  label={prompt.detected_action}
                                  color="primary"
                                  size="small"
                                  variant="outlined"
                                />
                                <Chip
                                  label={prompt.efficiency_rating}
                                  color={getEfficiencyColor(prompt.tokens_used)}
                                  size="small"
                                />
                              </Box>
                            </Box>
                          }
                          secondary={`Tipo: ${prompt.interaction_type} | ID: ${prompt.id}`}
                        />
                      </ListItem>
                      {index <
                        Math.min(
                          9,
                          promptOptimization.heavy_prompts.length - 1
                        ) && <Divider />}
                    </React.Fragment>
                  ))}
              </List>
            ) : (
              <Box sx={{ textAlign: "center", py: 3 }}>
                <CheckCircle color="success" sx={{ fontSize: 48, mb: 2 }} />
                <Typography variant="body1" color="text.secondary">
                  No hay prompts pesados identificados
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Recomendaciones */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" gutterBottom>
              Recomendaciones de Optimización
            </Typography>
            {(promptOptimization?.recommendations || []).length > 0 ? (
              <List>
                {promptOptimization.recommendations.map(
                  (recommendation, index) => (
                    <React.Fragment key={index}>
                      <ListItem>
                        <ListItemIcon>
                          <Lightbulb color="info" />
                        </ListItemIcon>
                        <ListItemText
                          primary={recommendation}
                          sx={{
                            "& .MuiListItemText-primary": {
                              fontSize: "0.875rem",
                              lineHeight: 1.4,
                            },
                          }}
                        />
                      </ListItem>
                      {index <
                        promptOptimization.recommendations.length - 1 && (
                        <Divider />
                      )}
                    </React.Fragment>
                  )
                )}
              </List>
            ) : (
              <Box sx={{ textAlign: "center", py: 3 }}>
                <AutoFixHigh color="success" sx={{ fontSize: 48, mb: 2 }} />
                <Typography variant="body1" color="text.secondary">
                  No hay recomendaciones pendientes
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Tabla de Interacciones */}
      <Paper elevation={2}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Usuario</TableCell>
                <TableCell>Input del Usuario</TableCell>
                <TableCell>Acción Detectada</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Tiempo</TableCell>
                <TableCell>Tokens</TableCell>
                <TableCell>Eficiencia</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredInteractions.map((interaction) => (
                <TableRow key={interaction.id} hover>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {interaction.user_name ||
                          `Usuario ${interaction.user_id}`}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {interaction.user_phone}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{
                        maxWidth: 200,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {interaction.user_input || "N/A"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={interaction.detected_action || "N/A"}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={
                        interaction.interaction_type?.replace("_", " ") || "N/A"
                      }
                      size="small"
                      color="secondary"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={formatProcessingTime(
                        interaction.processing_time_ms
                      )}
                      color="info"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={interaction.llm_tokens_used || "0"}
                      color={getEfficiencyColor(interaction.llm_tokens_used)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getEfficiencyLabel(interaction.llm_tokens_used)}
                      color={getEfficiencyColor(interaction.llm_tokens_used)}
                      size="small"
                      variant="outlined"
                    />
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
          rowsPerPageOptions={[5, 10, 20, 50]}
          labelRowsPerPage="Filas por página:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
          }
        />
      </Paper>
    </Box>
  );
};

export default InteractionsTab;
