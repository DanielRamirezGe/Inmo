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
  Card,
  CardContent,
  Tabs,
  Tab,
} from "@mui/material";
import {
  Search,
  LocationOn,
  Home,
  AttachMoney,
  Bed,
  TrendingUp,
  Visibility,
  People,
  CheckCircle,
  Warning,
  Info,
  Map,
  Analytics,
  FilterList,
} from "@mui/icons-material";

import PeriodSelector from "./common/PeriodSelector";
import MetricCard from "./common/MetricCard";
import { useBotPerformance } from "@/hooks/botPerformance/useBotPerformance";

const InventoryTab = ({ period, onPeriodChange }) => {
  const [data, setData] = useState(null);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [typeFilter, setTypeFilter] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const { loading, error, getInventory } = useBotPerformance();

  useEffect(() => {
    loadInventoryData();
  }, [period, page, pageSize, typeFilter]);

  const loadInventoryData = async () => {
    try {
      const response = await getInventory({
        period,
        page: page + 1,
        pageSize,
        type: typeFilter,
      });
      setData(response.data);
    } catch (error) {
      console.error("Error loading inventory data:", error);
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

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getConversionColor = (rate) => {
    if (rate >= 80) return "success";
    if (rate >= 50) return "warning";
    return "error";
  };

  const getDemandColor = (count) => {
    if (count >= 100) return "success";
    if (count >= 50) return "warning";
    return "error";
  };

  const getBudgetColor = (range) => {
    if (range?.includes("500k-1M") || range?.includes("1M-2M"))
      return "success";
    if (range?.includes("2M-5M")) return "warning";
    return "error";
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
        No se pudieron cargar los datos de análisis de inventario
      </Alert>
    );
  }

  const {
    searchAnalytics = {},
    searchCriteria = {},
    propertyViews = {},
    marketTrends = {},
    budgetDistribution = {},
    userBehavior = {},
    page: currentPage = 1,
    pageSize: currentPageSize = 20,
    total = 0,
  } = data || {};

  const tabs = [
    { label: "Resumen", value: 0 },
    { label: "Búsquedas", value: 1 },
    { label: "Presupuestos", value: 2 },
    { label: "Propiedades", value: 3 },
    { label: "Tendencias", value: 4 },
  ];

  return (
    <Box>
      <PeriodSelector period={period} onPeriodChange={onPeriodChange} />

      {/* Métricas Principales */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Búsquedas"
            value={searchAnalytics?.total_searches?.toLocaleString() || "0"}
            subtitle="En el período"
            icon={<Search />}
            color="primary"
            size="medium"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Usuarios Únicos"
            value={searchAnalytics?.unique_users?.toLocaleString() || "0"}
            subtitle="Buscadores activos"
            icon={<People />}
            color="success"
            size="medium"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Propiedades Vistas"
            value={propertyViews?.total_views?.toLocaleString() || "0"}
            subtitle="Total de visualizaciones"
            icon={<Visibility />}
            color="info"
            size="medium"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Presupuesto Promedio"
            value={formatCurrency(
              budgetDistribution?.summary?.avg_budget_overall || 0
            )}
            subtitle="Promedio general"
            icon={<AttachMoney />}
            color="warning"
            size="medium"
          />
        </Grid>
      </Grid>

      {/* Filtros y Tabs */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Tipo de Análisis</InputLabel>
              <Select
                value={typeFilter}
                onChange={handleTypeFilterChange}
                label="Tipo de Análisis"
              >
                <MenuItem value="">Todos los análisis</MenuItem>
                <MenuItem value="searches">Búsquedas</MenuItem>
                <MenuItem value="criteria">Criterios</MenuItem>
                <MenuItem value="properties">Propiedades</MenuItem>
                <MenuItem value="trends">Tendencias</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={8}>
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
          </Grid>
        </Grid>
      </Paper>

      {/* Contenido por Tabs */}
      {activeTab === 0 && (
        /* Tab: Resumen */
        <Grid container spacing={3}>
          {/* Ciudades Más Buscadas */}
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3, height: "100%" }}>
              <Typography variant="h6" gutterBottom>
                Ciudades Más Buscadas
              </Typography>
              <Box sx={{ mt: 2 }}>
                {(searchCriteria?.popular_cities || []).map((city, index) => (
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
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <LocationOn color="primary" />
                      <Box>
                        <Typography variant="body1" fontWeight="medium">
                          {city.city}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {city.search_count} búsquedas
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ textAlign: "right" }}>
                      <Typography
                        variant="h6"
                        color="success.main"
                        fontWeight="bold"
                      >
                        {formatCurrency(city.avg_budget)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Presupuesto promedio
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>

          {/* Tipos de Propiedad */}
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3, height: "100%" }}>
              <Typography variant="h6" gutterBottom>
                Tipos de Propiedad Más Buscados
              </Typography>
              <Box sx={{ mt: 2 }}>
                {(searchCriteria?.popular_property_types || []).map(
                  (type, index) => (
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
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Home color="secondary" />
                        <Box>
                          <Typography
                            variant="body1"
                            fontWeight="medium"
                            sx={{ textTransform: "capitalize" }}
                          >
                            {type.property_type}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {type.search_count} búsquedas
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ textAlign: "right" }}>
                        <Typography
                          variant="h6"
                          color="info.main"
                          fontWeight="bold"
                        >
                          {formatCurrency(type.avg_budget)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Presupuesto promedio
                        </Typography>
                      </Box>
                    </Box>
                  )
                )}
              </Box>
            </Paper>
          </Grid>

          {/* Resumen de Presupuestos */}
          <Grid item xs={12}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Resumen de Presupuestos
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <Search color="primary" />
                        <Box>
                          <Typography
                            variant="h4"
                            color="primary"
                            fontWeight="bold"
                          >
                            {budgetDistribution?.summary?.total_searches?.toLocaleString() ||
                              0}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Total de Búsquedas
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <People color="success" />
                        <Box>
                          <Typography
                            variant="h4"
                            color="success.main"
                            fontWeight="bold"
                          >
                            {budgetDistribution?.summary?.total_users?.toLocaleString() ||
                              0}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Usuarios Únicos
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <AttachMoney color="warning" />
                        <Box>
                          <Typography
                            variant="h4"
                            color="warning.main"
                            fontWeight="bold"
                          >
                            {budgetDistribution?.summary
                              ?.budget_ranges_available || 0}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Rangos Disponibles
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <TrendingUp color="info" />
                        <Box>
                          <Typography
                            variant="h4"
                            color="info.main"
                            fontWeight="bold"
                          >
                            {budgetDistribution?.summary?.most_popular_range ||
                              "N/A"}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Rango Más Popular
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      )}

      {activeTab === 1 && (
        /* Tab: Búsquedas */
        <Grid container spacing={3}>
          {/* Distribución de Presupuestos */}
          <Grid item xs={12} md={8}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Distribución de Presupuestos
              </Typography>
              <Box sx={{ mt: 2 }}>
                {(budgetDistribution?.overall_distribution || []).map(
                  (budget, index) => (
                    <Box key={index} sx={{ mb: 2 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 1,
                        }}
                      >
                        <Typography variant="body2" fontWeight="medium">
                          {budget.budget_range}
                        </Typography>
                        <Typography variant="body2" fontWeight="bold">
                          {budget.search_count} búsquedas ({budget.percentage}%)
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={budget.percentage || 0}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: "grey.200",
                          "& .MuiLinearProgress-bar": {
                            backgroundColor: getBudgetColor(
                              budget.budget_range
                            ),
                          },
                        }}
                      />
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mt: 0.5,
                        }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          {budget.unique_users} usuarios únicos
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Promedio: {formatCurrency(budget.avg_budget)}
                        </Typography>
                      </Box>
                    </Box>
                  )
                )}
              </Box>
            </Paper>
          </Grid>

          {/* Preferencias de Recámaras */}
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 3, height: "100%" }}>
              <Typography variant="h6" gutterBottom>
                Preferencias de Recámaras
              </Typography>
              <Box sx={{ mt: 2 }}>
                {(searchCriteria?.bedroom_preferences || []).map(
                  (pref, index) => (
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
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Bed color="primary" />
                        <Typography variant="body1" fontWeight="medium">
                          {pref.bedrooms} recámaras
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: "right" }}>
                        <Typography
                          variant="h6"
                          color="primary.main"
                          fontWeight="bold"
                        >
                          {pref.search_count}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {formatCurrency(pref.avg_budget)}
                        </Typography>
                      </Box>
                    </Box>
                  )
                )}
              </Box>
            </Paper>
          </Grid>

          {/* Rangos de Presupuesto */}
          <Grid item xs={12}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Rangos de Presupuesto
              </Typography>
              <Grid container spacing={2}>
                {(searchCriteria?.budget_ranges || []).map((range, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <Box
                      sx={{ p: 2, border: "1px solid #eee", borderRadius: 1 }}
                    >
                      <Typography
                        variant="body1"
                        fontWeight="medium"
                        gutterBottom
                      >
                        {range.range}
                      </Typography>
                      <Typography
                        variant="h5"
                        color="primary"
                        fontWeight="bold"
                      >
                        {range.search_count}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        búsquedas
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      )}

      {activeTab === 2 && (
        /* Tab: Presupuestos */
        <Grid container spacing={3}>
          {/* Distribución por Tipo de Propiedad */}
          <Grid item xs={12}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Distribución de Presupuestos por Tipo de Propiedad
              </Typography>
              <Grid container spacing={2}>
                {Object.entries(budgetDistribution?.by_property_type || {}).map(
                  ([propertyType, budgets]) => (
                    <Grid item xs={12} md={6} key={propertyType}>
                      <Box
                        sx={{ p: 2, border: "1px solid #eee", borderRadius: 1 }}
                      >
                        <Typography
                          variant="subtitle1"
                          fontWeight="medium"
                          sx={{ textTransform: "capitalize", mb: 2 }}
                        >
                          {propertyType}
                        </Typography>
                        {budgets.map((budget, index) => (
                          <Box key={index} sx={{ mb: 1 }}>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                mb: 0.5,
                              }}
                            >
                              <Typography variant="body2">
                                {budget.budget_range}
                              </Typography>
                              <Typography variant="body2" fontWeight="bold">
                                {budget.search_count} búsquedas
                              </Typography>
                            </Box>
                            <LinearProgress
                              variant="determinate"
                              value={
                                (budget.search_count /
                                  Math.max(
                                    ...budgets.map((b) => b.search_count)
                                  )) *
                                100
                              }
                              sx={{
                                height: 6,
                                borderRadius: 3,
                                backgroundColor: "grey.200",
                                "& .MuiLinearProgress-bar": {
                                  backgroundColor: "primary.main",
                                },
                              }}
                            />
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Promedio: {formatCurrency(budget.avg_budget)} |{" "}
                              {budget.unique_users} usuarios
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </Grid>
                  )
                )}
              </Grid>
            </Paper>
          </Grid>

          {/* Distribución por Ciudad */}
          <Grid item xs={12}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Distribución de Presupuestos por Ciudad
              </Typography>
              <Grid container spacing={2}>
                {Object.entries(budgetDistribution?.by_city || {}).map(
                  ([city, budgets]) => (
                    <Grid item xs={12} md={4} key={city}>
                      <Box
                        sx={{ p: 2, border: "1px solid #eee", borderRadius: 1 }}
                      >
                        <Typography
                          variant="subtitle1"
                          fontWeight="medium"
                          sx={{ mb: 2 }}
                        >
                          {city}
                        </Typography>
                        {budgets.map((budget, index) => (
                          <Box key={index} sx={{ mb: 1 }}>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                mb: 0.5,
                              }}
                            >
                              <Typography variant="body2">
                                {budget.budget_range}
                              </Typography>
                              <Typography variant="body2" fontWeight="bold">
                                {budget.search_count}
                              </Typography>
                            </Box>
                            <LinearProgress
                              variant="determinate"
                              value={
                                (budget.search_count /
                                  Math.max(
                                    ...budgets.map((b) => b.search_count)
                                  )) *
                                100
                              }
                              sx={{
                                height: 6,
                                borderRadius: 3,
                                backgroundColor: "grey.200",
                                "& .MuiLinearProgress-bar": {
                                  backgroundColor: "secondary.main",
                                },
                              }}
                            />
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Promedio: {formatCurrency(budget.avg_budget)} |{" "}
                              {budget.unique_users} usuarios
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </Grid>
                  )
                )}
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      )}

      {activeTab === 3 && (
        /* Tab: Propiedades */
        <Grid container spacing={3}>
          {/* Propiedades Más Vistas */}
          <Grid item xs={12}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Propiedades Más Vistas
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Propiedad</TableCell>
                      <TableCell>Ciudad</TableCell>
                      <TableCell>Precio</TableCell>
                      <TableCell>Recámaras</TableCell>
                      <TableCell>Vistas</TableCell>
                      <TableCell>Usuarios Únicos</TableCell>
                      <TableCell>Performance</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(propertyViews?.top_viewed_properties || []).map(
                      (property) => (
                        <TableRow key={property.property_id} hover>
                          <TableCell>
                            <Typography variant="body2" fontWeight="medium">
                              {property.title}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={property.city}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight="bold">
                              {formatCurrency(property.price)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <Bed fontSize="small" />
                              <Typography variant="body2">
                                {property.bedrooms}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={property.view_count}
                              color={getDemandColor(property.view_count)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {property.unique_viewers}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={`${(
                                (property.unique_viewers /
                                  property.view_count) *
                                100
                              ).toFixed(1)}%`}
                              color="info"
                              size="small"
                              variant="outlined"
                            />
                          </TableCell>
                        </TableRow>
                      )
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>

          {/* Tasas de Conversión */}
          <Grid item xs={12}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Tasas de Conversión
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Card>
                    <CardContent>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <Visibility color="primary" />
                        <Box>
                          <Typography
                            variant="h4"
                            color="primary"
                            fontWeight="bold"
                          >
                            {userBehavior?.conversion_rates
                              ?.view_to_criteria_rate || 0}
                            %
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Vista → Criterios
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card>
                    <CardContent>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <People color="success" />
                        <Box>
                          <Typography
                            variant="h4"
                            color="success.main"
                            fontWeight="bold"
                          >
                            {userBehavior?.conversion_rates
                              ?.view_to_advisor_rate || 0}
                            %
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Vista → Asesor
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card>
                    <CardContent>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <CheckCircle color="warning" />
                        <Box>
                          <Typography
                            variant="h4"
                            color="warning.main"
                            fontWeight="bold"
                          >
                            {userBehavior?.conversion_rates
                              ?.view_to_appointment_rate || 0}
                            %
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Vista → Cita
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      )}

      {activeTab === 4 && (
        /* Tab: Tendencias */
        <Grid container spacing={3}>
          {/* Tendencias Temporales */}
          <Grid item xs={12}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Tendencias Temporales de Presupuestos
              </Typography>
              <Grid container spacing={2}>
                {Object.entries(budgetDistribution?.trends_over_time || {}).map(
                  ([date, trends]) => (
                    <Grid item xs={12} md={6} key={date}>
                      <Box
                        sx={{ p: 2, border: "1px solid #eee", borderRadius: 1 }}
                      >
                        <Typography
                          variant="subtitle1"
                          fontWeight="medium"
                          sx={{ mb: 2 }}
                        >
                          {new Date(date).toLocaleDateString()}
                        </Typography>
                        {Object.entries(trends).map(([range, data]) => (
                          <Box key={range} sx={{ mb: 1 }}>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                mb: 0.5,
                              }}
                            >
                              <Typography variant="body2">{range}</Typography>
                              <Typography variant="body2" fontWeight="bold">
                                {data.search_count} búsquedas
                              </Typography>
                            </Box>
                            <LinearProgress
                              variant="determinate"
                              value={
                                (data.search_count /
                                  Math.max(
                                    ...Object.values(trends).map(
                                      (t) => t.search_count
                                    )
                                  )) *
                                100
                              }
                              sx={{
                                height: 6,
                                borderRadius: 3,
                                backgroundColor: "grey.200",
                                "& .MuiLinearProgress-bar": {
                                  backgroundColor: "info.main",
                                },
                              }}
                            />
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Promedio: {formatCurrency(data.avg_budget)} |{" "}
                              {data.unique_users} usuarios
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </Grid>
                  )
                )}
              </Grid>
            </Paper>
          </Grid>

          {/* Indicadores de Demanda */}
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3, height: "100%" }}>
              <Typography variant="h6" gutterBottom>
                Indicadores de Demanda
              </Typography>
              <Box sx={{ mt: 2 }}>
                {marketTrends?.demand_indicators && (
                  <>
                    <Box sx={{ mb: 2 }}>
                      <Typography
                        variant="body2"
                        fontWeight="medium"
                        gutterBottom
                      >
                        Ciudades con Alta Demanda:
                      </Typography>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                        {(
                          marketTrends.demand_indicators.high_demand_cities ||
                          []
                        ).map((city, index) => (
                          <Chip
                            key={index}
                            label={city}
                            color="success"
                            size="small"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography
                        variant="body2"
                        fontWeight="medium"
                        gutterBottom
                      >
                        Tipos de Propiedad Demandados:
                      </Typography>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                        {(
                          marketTrends.demand_indicators
                            .high_demand_property_types || []
                        ).map((type, index) => (
                          <Chip
                            key={index}
                            label={type}
                            color="primary"
                            size="small"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography
                        variant="body2"
                        fontWeight="medium"
                        gutterBottom
                      >
                        Rango de Precio Más Buscado:
                      </Typography>
                      <Chip
                        label={
                          marketTrends.demand_indicators.price_range_demand
                        }
                        color="warning"
                        size="small"
                      />
                    </Box>

                    <Box>
                      <Typography
                        variant="body2"
                        fontWeight="medium"
                        gutterBottom
                      >
                        Preferencia de Recámaras:
                      </Typography>
                      <Chip
                        label={`${marketTrends.demand_indicators.bedroom_demand} recámaras`}
                        color="info"
                        size="small"
                      />
                    </Box>
                  </>
                )}
              </Box>
            </Paper>
          </Grid>

          {/* Ciudades Trending */}
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3, height: "100%" }}>
              <Typography variant="h6" gutterBottom>
                Ciudades en Tendencia
              </Typography>
              <Box sx={{ mt: 2 }}>
                {(marketTrends?.trending_cities || []).map((city, index) => (
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
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <TrendingUp color="success" />
                      <Typography variant="body1" fontWeight="medium">
                        {city.city}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: "right" }}>
                      <Typography
                        variant="h6"
                        color="success.main"
                        fontWeight="bold"
                      >
                        {city.view_count}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {formatCurrency(city.avg_price)}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Patrones de Usuario (siempre visible) */}
      <Paper elevation={2} sx={{ p: 3, mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Patrones de Búsqueda de Usuarios
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Usuario</TableCell>
                <TableCell>Búsquedas</TableCell>
                <TableCell>Ciudades</TableCell>
                <TableCell>Tipos</TableCell>
                <TableCell>Presupuesto Promedio</TableCell>
                <TableCell>Última Búsqueda</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(userBehavior?.search_patterns || []).map((pattern, index) => (
                <TableRow key={index} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      Usuario {pattern.user_id}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={pattern.searches_performed}
                      color="primary"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={pattern.cities_searched}
                      color="secondary"
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={pattern.property_types_searched}
                      color="info"
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      {formatCurrency(pattern.avg_budget)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(pattern.last_search).toLocaleDateString()}
                    </Typography>
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

export default InventoryTab;
