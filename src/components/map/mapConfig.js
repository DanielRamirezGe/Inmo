// Configuración centralizada para el mapa
export const MAP_CONFIG = {
  // Configuración por defecto del mapa
  center: { lat: 19.4326, lng: -99.1332 }, // Ciudad de México
  zoom: 12,
  minZoom: 8,
  maxZoom: 18,

  // Configuración de controles
  mapTypeControl: false,
  streetViewControl: true,
  fullscreenControl: true,
  zoomControl: false,
  panControl: false,
  scrollwheel: true,
  gestureHandling: "greedy",
  disableDefaultUI: false,
  draggable: true,

  // Estilos personalizados del mapa
  styles: [
    {
      featureType: "poi",
      elementType: "labels",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "transit",
      elementType: "labels",
      stylers: [{ visibility: "off" }],
    },
  ],
};

// Configuración para diferentes ciudades
export const CITY_CONFIGS = {
  cdmx: {
    center: { lat: 19.4326, lng: -99.1332 },
    zoom: 12,
  },
  monterrey: {
    center: { lat: 25.6866, lng: -100.3161 },
    zoom: 12,
  },
  guadalajara: {
    center: { lat: 20.6597, lng: -103.3496 },
    zoom: 12,
  },
  puebla: {
    center: { lat: 19.0413, lng: -98.2062 },
    zoom: 12,
  },
};

// Configuración de pines por tipo de propiedad
export const PIN_CONFIGS = {
  house: {
    color: "#2e7d32",
    symbol: "Casa",
    shortSymbol: "C",
  },
  apartment: {
    color: "#e6a820fa",
    symbol: "Apt",
    shortSymbol: "A",
  },
  default: {
    color: "#1976d2",
    symbol: "Propiedad",
    shortSymbol: "$",
  },
};

// Configuración de viewport
export const VIEWPORT_CONFIG = {
  minSize: 0.1, // 0.1 grados (~11km)
  maxSize: 5, // 5 grados (~550km)
  debounceDelay: 300,
  pageSize: 50,
  searchRadius: 0.5, // 0.5 grados (~55km)
};

// Función para obtener configuración de ciudad
export const getCityConfig = (cityCode) => {
  return CITY_CONFIGS[cityCode] || MAP_CONFIG;
};

// Función para formatear precios
export const formatPrice = (price, currency = "MXN") => {
  if (!price || isNaN(price)) return "Precio no disponible";

  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

// Función para formatear precios cortos
export const formatPriceShort = (price) => {
  if (!price) return "N/A";
  const numPrice = parseFloat(price);
  if (numPrice >= 1000000) {
    return (numPrice / 1000000).toFixed(1) + "M";
  } else if (numPrice >= 1000) {
    return (numPrice / 1000).toFixed(0) + "k";
  }
  return numPrice.toString();
};

// Función para validar coordenadas
export const isValidCoordinates = (lat, lng) => {
  const latNum = parseFloat(lat);
  const lngNum = parseFloat(lng);

  return (
    !isNaN(latNum) &&
    !isNaN(lngNum) &&
    latNum >= -90 &&
    latNum <= 90 &&
    lngNum >= -180 &&
    lngNum <= 180
  );
};

// Función para obtener bounds del viewport
export const getViewportBounds = (map) => {
  if (!map) return null;

  const bounds = map.getBounds();
  if (!bounds) return null;

  const ne = bounds.getNorthEast();
  const sw = bounds.getSouthWest();

  return {
    north: ne.lat(),
    south: sw.lat(),
    east: ne.lng(),
    west: sw.lng(),
  };
};
