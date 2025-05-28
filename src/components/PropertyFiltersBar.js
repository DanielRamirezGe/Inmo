import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Chip,
  Typography,
  CircularProgress,
  Alert,
  Divider,
  Collapse,
  Fade,
  Slide,
} from "@mui/material";
import {
  FilterList as FilterIcon,
  Clear as ClearIcon,
  Search as SearchIcon,
  Tune as TuneIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
} from "@mui/icons-material";
import { usePropertyFilters } from "../hooks/usePropertyFilters";
import { api } from "../services/api";

// Constantes
const MOBILE_BREAKPOINT = 600;
const THEME_COLORS = {
  primary: "#F0B92B",
  secondary: "#37474F",
  text: "#607D8B",
  background: "rgba(255, 255, 255, 0.95)",
  border: "rgba(240, 185, 43, 0.2)",
};

// Estilos reutilizables
const createStyles = () => ({
  filterField: {
    color: THEME_COLORS.secondary,
    bgcolor: "rgba(255, 255, 255, 0.8)",
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(55, 71, 79, 0.3)",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: THEME_COLORS.primary,
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: THEME_COLORS.primary,
      borderWidth: "2px",
    },
    "& .MuiSvgIcon-root": {
      color: THEME_COLORS.text,
    },
  },
  inputLabel: {
    color: THEME_COLORS.text,
    fontSize: { xs: "0.85rem", sm: "0.875rem" },
    textAlign: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "&.Mui-focused, &.MuiFormLabel-filled": {
      fontSize: { xs: "0.85rem", sm: "0.875rem" },
    },
    "&.MuiInputLabel-shrink": {
      textAlign: "left",
      justifyContent: "flex-start",
    },
  },
  paper: {
    p: { xs: 1, sm: 1.5 },
    borderRadius: 1,
    bgcolor: THEME_COLORS.background,
    backdropFilter: "blur(10px)",
    border: `1px solid ${THEME_COLORS.border}`,
    boxShadow: `0 2px 8px ${THEME_COLORS.border}`,
  },
  button: {
    fontWeight: 600,
    px: { xs: 1.5, sm: 2, md: 3 },
    py: { xs: 0.6, sm: 0.8, md: 1 },
    fontSize: { xs: "0.8rem", sm: "0.85rem", md: "0.9rem" },
    minWidth: { xs: "auto", sm: "100px", md: "140px" },
    flex: { xs: 1, md: 0 },
    transition: "all 0.2s ease",
  },
});

// Configuración de filtros
const FILTER_CONFIG = [
  {
    key: "state",
    label: "Estado",
    size: { xs: 6, sm: 6, md: 3 },
    type: "select",
    options: "states",
  },
  {
    key: "city",
    label: "Ciudad",
    size: { xs: 6, sm: 6, md: 3 },
    type: "select",
    options: "cities",
  },
  {
    key: "bedroom",
    label: "Recámaras",
    size: { xs: 6, sm: 4, md: 2 },
    type: "select",
    options: "bedrooms",
  },
  {
    key: "bathroom",
    label: "Baños",
    size: { xs: 6, sm: 4, md: 2 },
    type: "select",
    options: "bathrooms",
  },
  {
    key: "parking",
    label: "Estacionamiento",
    size: { xs: 6, sm: 4, md: 2 },
    type: "select",
    options: "parkings",
  },
  {
    key: "propertyType",
    label: "Tipo de Propiedad",
    size: { xs: 6, sm: 6, md: 3 },
    type: "select",
    options: "propertyTypes",
    valueKey: "nameTypeId",
    labelKey: "nameType",
  },
  {
    key: "development",
    label: "Desarrollo",
    size: { xs: 12, sm: 6, md: 3 },
    type: "select",
    options: "developments",
    valueKey: "developmentId",
    labelKey: "developmentName",
    conditional: true,
  },
  {
    key: "minPrice",
    label: "Precio mínimo",
    size: { xs: 6, sm: 6, md: 3 },
    type: "number",
    prefix: "$",
  },
  {
    key: "maxPrice",
    label: "Precio máximo",
    size: { xs: 6, sm: 6, md: 3 },
    type: "number",
    prefix: "$",
  },
];

// Función para formatear etiquetas de chips
const formatChipLabel = (key, value, filters) => {
  const formatters = {
    propertyType: () => {
      const type = filters.propertyTypes?.find(
        (t) => t.nameTypeId.toString() === value.toString()
      );
      return type ? `Tipo: ${type.nameType}` : `${key}: ${value}`;
    },
    development: () => {
      const dev = filters.developments?.find(
        (d) => d.developmentId.toString() === value.toString()
      );
      return dev ? `Desarrollo: ${dev.developmentName}` : `${key}: ${value}`;
    },
    search: () => `Búsqueda: "${value}"`,
    minPrice: () => `Precio mín: $${value}`,
    maxPrice: () => `Precio máx: $${value}`,
  };

  return formatters[key] ? formatters[key]() : `${key}: ${value}`;
};

// Componente para renderizar un filtro
const FilterField = ({ config, value, onChange, filters, styles }) => {
  if (config.conditional && !filters.showDevelopments) return null;

  if (config.type === "select") {
    const options = filters[config.options] || [];
    return (
      <FormControl fullWidth size="small">
        <InputLabel sx={styles.inputLabel}>{config.label}</InputLabel>
        <Select
          value={value || ""}
          onChange={onChange}
          label={config.label}
          sx={styles.filterField}
          MenuProps={{
            PaperProps: {
              sx: {
                bgcolor: "white",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
              },
            },
          }}
        >
          <MenuItem value="">Todos</MenuItem>
          {options.map((option) => {
            const optionValue = config.valueKey
              ? option[config.valueKey]
              : option;
            const optionLabel = config.labelKey
              ? option[config.labelKey]
              : option;
            return (
              <MenuItem key={optionValue} value={optionValue}>
                {optionLabel}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    );
  }

  if (config.type === "number") {
    return (
      <TextField
        fullWidth
        size="small"
        label={config.label}
        type="number"
        value={value || ""}
        onChange={onChange}
        InputProps={config.prefix ? { startAdornment: config.prefix } : {}}
        InputLabelProps={{ sx: styles.inputLabel }}
        sx={{
          "& .MuiOutlinedInput-root": {
            color: THEME_COLORS.secondary,
            bgcolor: "rgba(255, 255, 255, 0.8)",
            "& fieldset": { borderColor: "rgba(55, 71, 79, 0.3)" },
            "&:hover fieldset": { borderColor: THEME_COLORS.primary },
            "&.Mui-focused fieldset": {
              borderColor: THEME_COLORS.primary,
              borderWidth: "2px",
            },
          },
        }}
      />
    );
  }

  return null;
};

/**
 * Componente reutilizable de barra de filtros para propiedades
 * @param {Object} props
 * @param {string} props.filterType - Tipo de filtro para la API
 * @param {function} props.onFiltersChange - Callback cuando cambian los filtros
 * @param {boolean} props.showDevelopments - Mostrar filtro de desarrollos
 * @param {boolean} props.compact - Modo compacto (menos filtros visibles)
 * @param {string} props.title - Título personalizado
 */
const PropertyFiltersBar = ({
  filterType = "all",
  onFiltersChange,
  showDevelopments = true,
  compact = false,
  title = "Filtros de Propiedades",
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [lastSearchFilters, setLastSearchFilters] = useState({});
  const [clearLoading, setClearLoading] = useState(false);
  const [filtersExpanded, setFiltersExpanded] = useState(false);

  const styles = createStyles();

  useEffect(() => {
    const checkIsMobile = () =>
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  const {
    filters,
    loading,
    error,
    appliedFilters,
    updateFilter,
    clearFilters,
    getActiveFilters,
    searchWithFilters,
    searchLoading,
    searchError,
  } = usePropertyFilters(filterType);

  // Funciones de utilidad
  const notifyFiltersChange = (activeFilters, results = null) => {
    if (onFiltersChange) {
      onFiltersChange(activeFilters, results);
    }
  };

  const getFilteredActiveFilters = (updatedFilters) => {
    const activeFilters = {};
    Object.entries(updatedFilters).forEach(([key, val]) => {
      if (val !== "" && val !== null && val !== undefined) {
        activeFilters[key] = val;
      }
    });
    return activeFilters;
  };

  const hasActiveSelectorFilters = () => {
    return Object.keys(appliedFilters)
      .filter((key) => key !== "search")
      .some((key) => appliedFilters[key] && appliedFilters[key] !== "");
  };

  // Manejadores de eventos
  const handleFilterChange = (filterName, value) => {
    updateFilter(filterName, value);
    const updatedFilters = { ...appliedFilters, [filterName]: value };
    const activeFilters = getFilteredActiveFilters(updatedFilters);
    notifyFiltersChange(activeFilters);
  };

  const handleSearch = async () => {
    try {
      const currentFilters = getActiveFilters();
      setLastSearchFilters(currentFilters);
      const results = await searchWithFilters();
      setFiltersExpanded(false);
      notifyFiltersChange(currentFilters, results);
    } catch (error) {
      console.error("Error en búsqueda:", error);
    }
  };

  const handleRemoveFilter = async (filterKey) => {
    handleFilterChange(filterKey, "");
    const updatedFilters = { ...lastSearchFilters };
    delete updatedFilters[filterKey];
    setLastSearchFilters(updatedFilters);

    try {
      if (Object.keys(updatedFilters).length === 0) {
        const emptyFilters = { type: filterType };
        const results = await api.searchProperties(emptyFilters, 1, 10);
        notifyFiltersChange({}, results);
      } else {
        const searchFilters = { ...updatedFilters, type: filterType };

        // Mapear campos específicos para la API
        if (searchFilters.propertyType) {
          searchFilters.propertyTypeId = searchFilters.propertyType;
          delete searchFilters.propertyType;
        }
        if (searchFilters.development) {
          searchFilters.developmentId = searchFilters.development;
          delete searchFilters.development;
        }

        const results = await api.searchProperties(searchFilters, 1, 10);
        notifyFiltersChange(updatedFilters, results);
      }
    } catch (error) {
      console.error("Error al actualizar filtros:", error);
    }
  };

  const handleClearAll = async () => {
    setClearLoading(true);
    try {
      setLastSearchFilters({});
      const emptyFilters = { type: filterType };
      const results = await api.searchProperties(emptyFilters, 1, 10);
      clearFilters();
      notifyFiltersChange({}, results);
    } catch (error) {
      console.error("Error al limpiar filtros:", error);
    } finally {
      setClearLoading(false);
    }
  };

  if (error) {
    return (
      <Paper sx={{ p: 2, mb: 2 }}>
        <Alert severity="error">Error al cargar filtros: {error}</Alert>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={4}
      sx={{
        mb: { xs: 1, sm: 1.5 },
        borderRadius: { xs: 1, sm: 1.5 },
        overflow: "hidden",
        background:
          "linear-gradient(135deg, #FFFFFF 0%, rgba(255, 207, 64, 0.15) 100%)",
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(10px)",
        },
      }}
    >
      <Box sx={{ position: "relative", zIndex: 1, p: { xs: 1, sm: 1.5 } }}>
        {/* Sección de búsqueda por texto y control de filtros */}
        <Paper sx={{ ...styles.paper, mb: { xs: 1, sm: 1.5 } }}>
          <Grid container spacing={{ xs: 1, sm: 1.5 }} alignItems="center">
            {/* Sección de búsqueda - 8/12 */}
            <Grid item xs={9} sm={8}>
              <Typography
                variant="subtitle1"
                sx={{
                  mb: { xs: 0.6, sm: 0.8 },
                  color: THEME_COLORS.secondary,
                  fontWeight: 600,
                  fontSize: { xs: "0.8rem", sm: "0.95rem" },
                  display: { xs: "none", sm: "flex" },
                  alignItems: "center",
                  gap: 0.6,
                }}
              >
                <SearchIcon
                  sx={{
                    color: THEME_COLORS.primary,
                    fontSize: { xs: "1.1rem", sm: "1.3rem" },
                  }}
                />
                Búsqueda Inteligente
              </Typography>

              <TextField
                fullWidth
                size="medium"
                placeholder="Buscar propiedades por ubicación, tipo, características..."
                value={appliedFilters.search || ""}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                InputProps={{
                  startAdornment: (
                    <SearchIcon
                      sx={{
                        color: THEME_COLORS.text,
                        mr: 1,
                        fontSize: { xs: "1.2rem", sm: "1.4rem" },
                        transition: "color 0.2s ease",
                      }}
                    />
                  ),
                  endAdornment: appliedFilters.search && (
                    <Box
                      sx={{
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: { xs: "28px", sm: "32px" },
                        height: { xs: "28px", sm: "32px" },
                        borderRadius: "50%",
                        bgcolor: "rgba(240, 185, 43, 0.1)",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          bgcolor: "rgba(240, 185, 43, 0.2)",
                          transform: "scale(1.1)",
                        },
                      }}
                      onClick={() => handleFilterChange("search", "")}
                    >
                      <ClearIcon
                        sx={{
                          color: THEME_COLORS.primary,
                          fontSize: { xs: "0.9rem", sm: "1rem" },
                        }}
                      />
                    </Box>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "rgba(255, 255, 255, 0.95)",
                    borderRadius: { xs: 3, sm: 4 }, // Más redondeado
                    border: "2px solid transparent",
                    boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
                    color: THEME_COLORS.secondary,
                    fontSize: { xs: "0.9rem", sm: "1rem" },
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      border: `2px solid rgba(240, 185, 43, 0.4)`,
                      boxShadow: "0 4px 20px rgba(240, 185, 43, 0.15)",
                      transform: "translateY(-1px)",
                    },
                    "&.Mui-focused": {
                      border: `2px solid ${THEME_COLORS.primary}`,
                      boxShadow: "0 4px 24px rgba(240, 185, 43, 0.25)",
                      transform: "translateY(-1px)",
                      "& .MuiInputAdornment-root .MuiSvgIcon-root": {
                        color: THEME_COLORS.primary,
                      },
                    },
                    "& fieldset": {
                      border: "none", // Removemos el borde por defecto
                    },
                  },
                  "& .MuiOutlinedInput-input": {
                    color: THEME_COLORS.secondary,
                    py: { xs: 1.2, sm: 1.5 },
                    px: { xs: 0.5, sm: 1 },
                    fontWeight: 500,
                    "&::placeholder": {
                      color: THEME_COLORS.text,
                      opacity: 0.8,
                      fontWeight: 400,
                      fontSize: { xs: "0.85rem", sm: "0.95rem" },
                    },
                  },
                }}
              />
            </Grid>

            {/* Separador */}
            <Grid item xs={1} sm={2}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <Divider
                  orientation="vertical"
                  sx={{
                    height: "30px",
                    borderColor: THEME_COLORS.border,
                    borderWidth: "1px",
                  }}
                />
              </Box>
            </Grid>

            {/* Sección de control de filtros - 2/12 */}
            <Grid item xs={2} sm={2}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  py: { xs: 0.5, sm: 0.8 },
                  px: { xs: 0.2, sm: 0.3 },
                  borderRadius: 1,
                  transition: "all 0.2s ease",
                  "&:hover": { bgcolor: "rgba(240, 185, 43, 0.08)" },
                }}
                onClick={() => setFiltersExpanded(!filtersExpanded)}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: THEME_COLORS.secondary,
                    fontWeight: 600,
                    fontSize: { xs: "0.65rem", sm: "0.75rem" },
                    mb: { xs: 0.3, sm: 0.4 },
                    lineHeight: 1,
                    textAlign: "center",
                  }}
                >
                  Filtros
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: { xs: 0.2, sm: 0.3 },
                  }}
                >
                  <TuneIcon
                    sx={{
                      color: THEME_COLORS.primary,
                      fontSize: { xs: "1rem", sm: "1.2rem" },
                      transform: filtersExpanded
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                      transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  />
                  <KeyboardArrowDownIcon
                    sx={{
                      color: THEME_COLORS.secondary,
                      fontSize: { xs: "1rem", sm: "1.2rem" },
                      transform: filtersExpanded
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                      transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Sección de filtros por características */}
        <Collapse
          in={filtersExpanded}
          timeout={400}
          easing={{
            enter: "cubic-bezier(0.4, 0, 0.2, 1)",
            exit: "cubic-bezier(0.4, 0, 0.6, 1)",
          }}
        >
          <Fade in={filtersExpanded} timeout={300}>
            <Paper
              sx={{
                ...styles.paper,
                mb: { xs: 1, sm: 1.5 },
                transform: filtersExpanded
                  ? "translateY(0)"
                  : "translateY(-10px)",
                transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
                  <CircularProgress
                    size={24}
                    sx={{ color: THEME_COLORS.secondary }}
                  />
                </Box>
              ) : (
                <Grid container spacing={{ xs: 0.8, sm: 1 }}>
                  {FILTER_CONFIG.map((config, index) => {
                    if (config.key === "development" && !showDevelopments)
                      return null;
                    return (
                      <Slide
                        key={config.key}
                        direction="up"
                        in={filtersExpanded}
                        timeout={300 + index * 50} // Animación escalonada
                        easing="cubic-bezier(0.4, 0, 0.2, 1)"
                      >
                        <Grid item {...config.size}>
                          <FilterField
                            config={config}
                            value={appliedFilters[config.key]}
                            onChange={(e) =>
                              handleFilterChange(config.key, e.target.value)
                            }
                            filters={{ ...filters, showDevelopments }}
                            styles={styles}
                          />
                        </Grid>
                      </Slide>
                    );
                  })}
                </Grid>
              )}
            </Paper>
          </Fade>
        </Collapse>

        {/* Sección de filtros aplicados */}
        <Collapse
          in={Object.keys(lastSearchFilters).length > 0}
          timeout={350}
          easing={{
            enter: "cubic-bezier(0.4, 0, 0.2, 1)",
            exit: "cubic-bezier(0.4, 0, 0.6, 1)",
          }}
        >
          <Fade in={Object.keys(lastSearchFilters).length > 0} timeout={250}>
            <Paper
              sx={{
                ...styles.paper,
                mb: { xs: 1, sm: 1.5 },
                transform:
                  Object.keys(lastSearchFilters).length > 0
                    ? "translateY(0)"
                    : "translateY(-8px)",
                transition: "transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  mb: { xs: 0.6, sm: 0.8 },
                  color: THEME_COLORS.secondary,
                  fontWeight: 600,
                  fontSize: { xs: "0.7rem", sm: "0.8rem" },
                }}
              >
                Filtros aplicados en la búsqueda:
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: { xs: 0.4, sm: 0.6 },
                }}
              >
                {Object.entries(lastSearchFilters).map(
                  ([key, value], index) => (
                    <Slide
                      key={key}
                      direction="right"
                      in={Object.keys(lastSearchFilters).length > 0}
                      timeout={200 + index * 100} // Animación escalonada para cada chip
                      easing="cubic-bezier(0.4, 0, 0.2, 1)"
                    >
                      <Chip
                        label={formatChipLabel(key, value, filters)}
                        onDelete={() => handleRemoveFilter(key)}
                        size="small"
                        sx={{
                          bgcolor: THEME_COLORS.background,
                          color: THEME_COLORS.secondary,
                          backdropFilter: "blur(10px)",
                          border: `1px solid ${THEME_COLORS.border}`,
                          fontWeight: 500,
                          fontSize: "0.75rem",
                          height: "24px",
                          boxShadow: `0 1px 4px ${THEME_COLORS.border}`,
                          "& .MuiChip-label": { px: 1, fontSize: "0.75rem" },
                          "& .MuiChip-deleteIcon": {
                            color: THEME_COLORS.text,
                            fontSize: "0.9rem",
                            "&:hover": { color: THEME_COLORS.secondary },
                          },
                          "&:hover": {
                            bgcolor: "white",
                            transform: "translateY(-0.5px) scale(1.02)",
                            boxShadow: "0 2px 6px rgba(240, 185, 43, 0.15)",
                            border: "1px solid rgba(240, 185, 43, 0.5)",
                          },
                          transition: "all 0.15s ease",
                        }}
                      />
                    </Slide>
                  )
                )}
              </Box>
            </Paper>
          </Fade>
        </Collapse>

        {/* Sección de botones de acción */}
        <Paper sx={styles.paper}>
          <Box
            sx={{
              display: "flex",
              gap: { xs: 0.6, sm: 0.8 },
              justifyContent: "center",
            }}
          >
            <Button
              variant="contained"
              size="small"
              onClick={handleSearch}
              disabled={
                searchLoading ||
                (!appliedFilters.search && !hasActiveSelectorFilters())
              }
              startIcon={
                searchLoading ? (
                  <CircularProgress size={14} sx={{ color: "white" }} />
                ) : (
                  <SearchIcon sx={{ fontSize: "1rem" }} />
                )
              }
              sx={{
                ...styles.button,
                bgcolor: THEME_COLORS.secondary,
                color: "white",
                boxShadow: "0 2px 8px rgba(55, 71, 79, 0.2)",
                "&:hover": {
                  bgcolor: "#263238",
                  transform: "translateY(-1px)",
                  boxShadow: "0 4px 12px rgba(55, 71, 79, 0.3)",
                },
                "&:disabled": { bgcolor: "#607D8B", color: "white" },
              }}
            >
              {searchLoading ? "Buscando..." : "Buscar"}
            </Button>

            {Object.keys(lastSearchFilters).length > 0 && (
              <Button
                variant="outlined"
                size="small"
                onClick={handleClearAll}
                disabled={clearLoading}
                startIcon={
                  clearLoading ? (
                    <CircularProgress
                      size={14}
                      sx={{ color: THEME_COLORS.secondary }}
                    />
                  ) : (
                    <ClearIcon sx={{ fontSize: "1rem" }} />
                  )
                }
                sx={{
                  ...styles.button,
                  color: THEME_COLORS.secondary,
                  borderColor: "rgba(240, 185, 43, 0.6)",
                  borderWidth: "1px",
                  boxShadow: "0 1px 4px rgba(240, 185, 43, 0.1)",
                  "&:hover": {
                    borderColor: THEME_COLORS.primary,
                    bgcolor: "rgba(240, 185, 43, 0.08)",
                    transform: "translateY(-1px)",
                    boxShadow: "0 2px 8px rgba(240, 185, 43, 0.2)",
                  },
                  "&:disabled": { borderColor: "#E0E0E0", color: "#BDBDBD" },
                }}
              >
                {clearLoading ? "Limpiando..." : "Limpiar"}
              </Button>
            )}
          </Box>
        </Paper>

        {/* Error de búsqueda */}
        {searchError && (
          <Alert
            severity="error"
            sx={{
              mt: { xs: 1, sm: 1.5 },
              fontSize: "0.875rem",
              py: { xs: 0.5, sm: 0.8 },
            }}
          >
            {searchError}
          </Alert>
        )}
      </Box>
    </Paper>
  );
};

export default PropertyFiltersBar;
