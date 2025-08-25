// Constantes del sistema de mapas

// Breakpoints para responsive design
export const BREAKPOINTS = {
  MOBILE: 450,
  SMALL_TABLET: 730,
  TABLET: 768,
  DESKTOP: 1024,
};

// Tamaños de pines
export const PIN_SIZES = {
  NORMAL: 80,
  LARGE: 400,
  STREET_VIEW: 400,
};

// Colores del sistema
export const COLORS = {
  PRIMARY: "#1976d2",
  SUCCESS: "#2e7d32",
  WARNING: "#e6a820fa",
  ERROR: "#d32f2f",
  INFO: "#0288d1",
};

// Configuración de animaciones
export const ANIMATION_DELAYS = {
  MARKER_UPDATE: 200,
  STREET_VIEW_DETECTION: 300,
  INFO_WINDOW_OPEN: 100,
  MAP_RESIZE: 100,
  VIEW_ADJUSTMENT: 500,
  INTERACTION_UNBLOCK: 500,
};

// Configuración de viewport
export const VIEWPORT_LIMITS = {
  MIN_SIZE: 0.1, // 0.1 grados (~11km)
  MAX_SIZE: 5, // 5 grados (~550km)
  DEBOUNCE_DELAY: 300,
  ZOOM_DEBOUNCE: 300,
  BOUNDS_DEBOUNCE: 500,
};

// Configuración de cache
export const CACHE_CONFIG = {
  MAX_REGIONS: 10,
  CLEANUP_DISTANCE: 2, // grados
  PREFETCH_DISTANCE: 0.5, // grados
};

// Configuración de marcadores
export const MARKER_CONFIG = {
  MAX_INITIAL_MARKERS: 15,
  Z_INDEX: 1000,
  ANIMATION_INTERVAL: 2000, // 2 segundos
};

// URLs y endpoints
export const ENDPOINTS = {
  PROPERTY_DETAILS: "https://minkaasa.com/property/",
  IMAGE_BASE: "https://minkaasa-images.s3.us-east-1.amazonaws.com/",
};

// Mensajes del sistema
export const MESSAGES = {
  LOADING: "Cargando...",
  NO_PROPERTIES: "No hay propiedades disponibles en esta área",
  ERROR_LOADING: "Error al cargar propiedades. Intenta de nuevo más tarde.",
  ERROR_AREA: "Error al cargar propiedades para esta área",
  GEOLOCATION_ERROR: "Error: The Geolocation service failed.",
  CONNECTED: "Conectado",
  LOADING_PROPERTIES: "Cargando propiedades de la zona...",
  PROPERTIES_FOUND: "propiedades encontradas en esta zona",
  PROPERTY_FOUND: "propiedad encontrada en esta zona",
  TRY_AGAIN: "Reintentar",
  VER_MAS_DETALLES: "Ver más detalles",
  LISTA_PROPRIEDADES: "Lista de Propiedades",
  INTENTA_MOVER_MAPA:
    "Intenta mover el mapa o hacer zoom para ver más propiedades.",
};

// Configuración de la ventana de información
export const INFO_WINDOW_CONFIG = {
  MAX_WIDTH: 350,
  IMAGE_HEIGHT: 140,
  PADDING: 12,
  BORDER_RADIUS: 8,
  GRID_GAP: 4,
  ICON_SIZE: 14,
  BUTTON_PADDING: "6px 12px",
};

// Configuración de estilos CSS
export const CSS_CLASSES = {
  MAP_CONTAINER: "mapContainer",
  MAP_ELEMENT: "mapElement",
  NO_PROPERTIES_MESSAGE: "noPropertiesMessage",
  LOADING_OVERLAY: "loadingOverlay",
  CONTROLS_CONTAINER: "controlsContainer",
  MAP_CONTROLS: "mapControls",
};
