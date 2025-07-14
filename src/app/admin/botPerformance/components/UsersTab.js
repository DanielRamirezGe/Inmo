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
} from "@mui/material";
import {
  People,
  TrendingUp,
  CheckCircle,
  Search,
  LocationOn,
  AttachMoney,
} from "@mui/icons-material";

import PeriodSelector from "./common/PeriodSelector";
import MetricCard from "./common/MetricCard";
import { useBotPerformance } from "@/hooks/botPerformance/useBotPerformance";

const UsersTab = ({ period, onPeriodChange }) => {
  const [data, setData] = useState(null);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState("last_interaction");
  const [sortOrder, setSortOrder] = useState("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const { loading, error, getUsers } = useBotPerformance();

  useEffect(() => {
    loadUsersData();
  }, [period, page, pageSize, sortBy, sortOrder]);

  const loadUsersData = async () => {
    try {
      const response = await getUsers({
        period,
        page: page + 1,
        pageSize,
        sortBy,
        sortOrder,
        search: searchTerm,
      });
      setData(response.data);
    } catch (error) {
      console.error("Error loading users data:", error);
    }
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const getCompletenessColor = (completeness) => {
    if (completeness >= 80) return "success";
    if (completeness >= 60) return "warning";
    return "error";
  };

  const getCompletenessLabel = (completeness) => {
    if (completeness >= 80) return "Completo";
    if (completeness >= 60) return "Parcial";
    return "Incompleto";
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
        No se pudieron cargar los datos de usuarios
      </Alert>
    );
  }

  const { users, demographics, profileCompleteness, userEngagement, total } =
    data;

  return (
    <Box>
      <PeriodSelector period={period} onPeriodChange={onPeriodChange} />

      {/* Métricas de Resumen */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Usuarios"
            value={total?.toLocaleString() || "0"}
            subtitle="Usuarios registrados"
            icon={<People />}
            color="primary"
            size="medium"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Tasa de Engagement"
            value={`${userEngagement?.engagement_rate || 0}%`}
            subtitle="Usuarios activos"
            icon={<TrendingUp />}
            color="success"
            size="medium"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Completitud Promedio"
            value={`${(profileCompleteness?.average * 100).toFixed(1)}%`}
            subtitle="Perfiles completos"
            icon={<CheckCircle />}
            color="info"
            size="medium"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Usuarios Activos"
            value={userEngagement?.active_users?.toLocaleString() || "0"}
            subtitle="Últimos 7 días"
            icon={<People />}
            color="positiveAccent"
            size="medium"
          />
        </Grid>
      </Grid>

      {/* Filtros y Búsqueda */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Buscar por nombre o teléfono"
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <Search sx={{ mr: 1, color: "text.secondary" }} />
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Ordenar por</InputLabel>
              <Select
                value={sortBy}
                onChange={handleSortChange}
                label="Ordenar por"
              >
                <MenuItem value="last_interaction">Última interacción</MenuItem>
                <MenuItem value="profile_completeness">
                  Completitud de perfil
                </MenuItem>
                <MenuItem value="total_messages">Total de mensajes</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Orden</InputLabel>
              <Select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                label="Orden"
              >
                <MenuItem value="desc">Descendente</MenuItem>
                <MenuItem value="asc">Ascendente</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Gráficas de Demografía */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Distribución de Edades */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" gutterBottom>
              Distribución por Edad
            </Typography>
            <Box sx={{ mt: 2 }}>
              {demographics?.age_ranges &&
                Object.entries(demographics.age_ranges).map(
                  ([range, count]) => (
                    <Box
                      key={range}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        py: 1,
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      <Typography variant="body2">{range} años</Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {count}
                      </Typography>
                    </Box>
                  )
                )}
            </Box>
          </Paper>
        </Grid>

        {/* Tamaño Familiar */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" gutterBottom>
              Tamaño Familiar
            </Typography>
            <Box sx={{ mt: 2 }}>
              {demographics?.family_sizes &&
                Object.entries(demographics.family_sizes).map(
                  ([size, count]) => (
                    <Box
                      key={size}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        py: 1,
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      <Typography variant="body2">{size} miembros</Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {count}
                      </Typography>
                    </Box>
                  )
                )}
            </Box>
          </Paper>
        </Grid>

        {/* Ocupaciones */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" gutterBottom>
              Ocupaciones Principales
            </Typography>
            <Box sx={{ mt: 2 }}>
              {demographics?.occupations &&
                Object.entries(demographics.occupations)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 5)
                  .map(([occupation, count]) => (
                    <Box
                      key={occupation}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        py: 1,
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      <Typography variant="body2">{occupation}</Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {count}
                      </Typography>
                    </Box>
                  ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Completitud de Perfil */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Distribución de Completitud de Perfil
        </Typography>
        <Box sx={{ mt: 2 }}>
          {profileCompleteness?.distribution &&
            Object.entries(profileCompleteness.distribution).map(
              ([range, count]) => (
                <Box key={range} sx={{ mb: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2">{range}</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {count} usuarios
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={
                      (count /
                        Math.max(
                          ...Object.values(profileCompleteness.distribution)
                        )) *
                      100
                    }
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: "grey.200",
                      "& .MuiLinearProgress-bar": {
                        backgroundColor:
                          range.includes("80-100") || range.includes("60-80")
                            ? "success.main"
                            : "warning.main",
                      },
                    }}
                  />
                </Box>
              )
            )}
        </Box>
      </Paper>

      {/* Tabla de Usuarios */}
      <Paper elevation={2}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Usuario</TableCell>
                <TableCell>Teléfono</TableCell>
                <TableCell>Completitud</TableCell>
                <TableCell>Mensajes</TableCell>
                <TableCell>Ciudad</TableCell>
                <TableCell>Presupuesto Máx</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users &&
                users.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {user.name || "Sin nombre"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {user.phone || "Sin teléfono"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getCompletenessLabel(
                          user.profile_completeness * 100
                        )}
                        color={getCompletenessColor(
                          user.profile_completeness * 100
                        )}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {user.total_messages || 0}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <LocationOn fontSize="small" color="action" />
                        <Typography variant="body2">
                          {user.current_city || "No especificada"}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <AttachMoney fontSize="small" color="action" />
                        <Typography variant="body2">
                          $
                          {user.current_budget_max?.toLocaleString() ||
                            "No especificado"}
                        </Typography>
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

export default UsersTab;
