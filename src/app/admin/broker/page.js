"use client";
import React from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Chip,
  Pagination,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  Paper,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  CalendarToday as CalendarIcon,
  Business as BusinessIcon,
  FilterList as FilterIcon,
} from "@mui/icons-material";
import AdminNavbar from "../components/AdminNavbar";
import { useBrokers } from "../../../hooks/useBrokers";

export default function BrokerAdminPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  
  const {
    brokers,
    loading,
    error,
    pagination,
    filters,
    handlePageChange,
    handlePageSizeChange,
    handleSearchChange,
    handleActiveFilterChange,
    clearFilters,
  } = useBrokers();

  // Handle search input change with debounce
  const handleSearchInputChange = (event) => {
    const value = event.target.value;
    // Simple debounce - you could implement a more sophisticated one
    setTimeout(() => {
      handleSearchChange(value);
    }, 300);
  };

  return (
    <>
      <AdminNavbar />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 600,
              color: "#37474F",
              mb: 1,
            }}
          >
            Gestión de Brokers
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "#607D8B",
            }}
          >
            Administra y visualiza todos los brokers registrados en la plataforma
          </Typography>
        </Box>

        {/* Filters Section */}
        <Paper
          elevation={2}
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 2,
            border: "1px solid rgba(240, 185, 43, 0.2)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <FilterIcon sx={{ mr: 1, color: "#F0B92B" }} />
            <Typography variant="h6" sx={{ color: "#37474F", fontWeight: 600 }}>
              Filtros
            </Typography>
          </Box>

          <Grid container spacing={2} alignItems="center">
            {/* Search */}
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Buscar por nombre, email o teléfono"
                variant="outlined"
                size="small"
                defaultValue={filters.search}
                onChange={handleSearchInputChange}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: "#F0B92B" }} />,
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": {
                      borderColor: "#F0B92B",
                    },
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#F0B92B",
                  },
                }}
              />
            </Grid>

            {/* Status Filter */}
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Estado</InputLabel>
                <Select
                  value={filters.active || ""}
                  onChange={(e) => handleActiveFilterChange(e.target.value || undefined)}
                  label="Estado"
                  sx={{
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(0, 0, 0, 0.23)",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#F0B92B",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#F0B92B",
                    },
                  }}
                >
                  <MenuItem value="">Todos</MenuItem>
                  <MenuItem value={true}>Activos</MenuItem>
                  <MenuItem value={false}>Inactivos</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Page Size */}
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Por página</InputLabel>
                <Select
                  value={pagination.pageSize}
                  onChange={(e) => handlePageSizeChange(e.target.value)}
                  label="Por página"
                  sx={{
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(0, 0, 0, 0.23)",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#F0B92B",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#F0B92B",
                    },
                  }}
                >
                  <MenuItem value={5}>5</MenuItem>
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={20}>20</MenuItem>
                  <MenuItem value={50}>50</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Clear Filters */}
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="outlined"
                startIcon={<ClearIcon />}
                onClick={clearFilters}
                sx={{
                  borderColor: "#F0B92B",
                  color: "#F0B92B",
                  "&:hover": {
                    borderColor: "#D8A01F",
                    backgroundColor: "rgba(240, 185, 43, 0.04)",
                  },
                }}
              >
                Limpiar Filtros
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Loading State */}
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress sx={{ color: "#F0B92B" }} />
          </Box>
        )}

        {/* Brokers Grid */}
        {!loading && (
          <>
            {/* Results Count */}
            <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="body2" sx={{ color: "#607D8B" }}>
                Mostrando {brokers.length} de {pagination.totalRecords} brokers
              </Typography>
              <Typography variant="body2" sx={{ color: "#607D8B" }}>
                Página {pagination.currentPage} de {pagination.totalPages}
              </Typography>
            </Box>

            {/* Brokers Cards */}
            <Grid container spacing={3}>
              {brokers.map((broker) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={broker.brokerSalesId}>
                  <Card
                    sx={{
                      height: "100%",
                      borderRadius: 2,
                      border: "1px solid rgba(240, 185, 43, 0.2)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 8px 25px rgba(240, 185, 43, 0.15)",
                      },
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      {/* Header with Status */}
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <PersonIcon sx={{ mr: 1, color: "#F0B92B" }} />
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 600,
                              color: "#37474F",
                              fontSize: "1rem",
                            }}
                          >
                            {broker.fullName}
                          </Typography>
                        </Box>
                        <Chip
                          label={broker.statusText}
                          color={broker.statusColor}
                          size="small"
                          sx={{
                            fontSize: "0.75rem",
                            height: "24px",
                          }}
                        />
                      </Box>

                      <Divider sx={{ mb: 2 }} />

                      {/* Contact Information */}
                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                          <EmailIcon sx={{ mr: 1, color: "#607D8B", fontSize: "1rem" }} />
                          <Typography
                            variant="body2"
                            sx={{
                              color: "#607D8B",
                              fontSize: "0.875rem",
                            }}
                          >
                            {broker.mainEmail}
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                          <PhoneIcon sx={{ mr: 1, color: "#607D8B", fontSize: "1rem" }} />
                          <Typography
                            variant="body2"
                            sx={{
                              color: "#607D8B",
                              fontSize: "0.875rem",
                            }}
                          >
                            {broker.mainPhone}
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <CalendarIcon sx={{ mr: 1, color: "#607D8B", fontSize: "1rem" }} />
                          <Typography
                            variant="body2"
                            sx={{
                              color: "#607D8B",
                              fontSize: "0.875rem",
                            }}
                          >
                            {broker.recordDate}
                          </Typography>
                        </Box>
                      </Box>

                      {/* ID */}
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <BusinessIcon sx={{ mr: 1, color: "#607D8B", fontSize: "1rem" }} />
                        <Typography
                          variant="caption"
                          sx={{
                            color: "#607D8B",
                            fontSize: "0.75rem",
                          }}
                        >
                          ID: {broker.brokerSalesId}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Empty State */}
            {brokers.length === 0 && !loading && (
              <Box sx={{ textAlign: "center", py: 8 }}>
                <PersonIcon sx={{ fontSize: "4rem", color: "#607D8B", mb: 2 }} />
                <Typography variant="h6" sx={{ color: "#607D8B", mb: 1 }}>
                  No se encontraron brokers
                </Typography>
                <Typography variant="body2" sx={{ color: "#607D8B" }}>
                  Intenta ajustar los filtros de búsqueda
                </Typography>
              </Box>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <Pagination
                  count={pagination.totalPages}
                  page={pagination.currentPage}
                  onChange={(_, page) => handlePageChange(page)}
                  color="primary"
                  sx={{
                    "& .MuiPaginationItem-root": {
                      color: "#37474F",
                    },
                    "& .MuiPaginationItem-root.Mui-selected": {
                      backgroundColor: "#F0B92B",
                      color: "#37474F",
                      "&:hover": {
                        backgroundColor: "#D8A01F",
                      },
                    },
                  }}
                />
              </Box>
            )}
          </>
        )}
      </Container>
    </>
  );
}
