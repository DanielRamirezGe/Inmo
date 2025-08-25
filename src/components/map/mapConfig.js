// Configuración centralizada para el mapa
export const MAP_CONFIG = {
  // Configuración por defecto del mapa
  default: {
    center: { lat: 19.4326, lng: -99.1332 }, // Ciudad de México
    zoom: 12,
    minZoom: 8,
    maxZoom: 18,
    // Configuración para resolver problemas de scroll
    scrollwheel: true, // Habilitar scroll del mouse
    gestureHandling: "cooperative", // Permitir scroll de página
    disableDefaultUI: false, // Mantener controles por defecto
    zoomControl: true,
    mapTypeControl: true,
    streetViewControl: true,
    fullscreenControl: true,
    // Estilos personalizados para mejorar la apariencia
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
      {
        featureType: "landscape",
        elementType: "geometry",
        stylers: [{ color: "#f5f5f2" }],
      },
      {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#a1d5f1" }],
      },
    ],
  },

  // Configuración para diferentes ciudades
  cities: {
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
  },

  // Estilos de pines personalizados optimizados
  pinStyles: {
    default: {
      color: "#1976d2",
      symbol: "$",
      size: 32,
    },
    house: {
      color: "#2e7d32",
      symbol: "H",
      size: 32,
    },
    apartment: {
      color: "#ed6c02",
      symbol: "A",
      size: 32,
    },
    land: {
      color: "#8e24aa",
      symbol: "T",
      size: 32,
    },
    commercial: {
      color: "#d32f2f",
      symbol: "C",
      size: 32,
    },
  },

  // Configuración de la ventana de información
  infoWindow: {
    maxWidth: 280,
    styles: {
      title: {
        color: "#1976d2",
        fontSize: "16px",
        fontWeight: "bold",
        margin: "0 0 8px 0",
      },
      price: {
        color: "#2e7d32",
        fontSize: "18px",
        fontWeight: "bold",
        margin: "8px 0",
      },
      detail: {
        color: "#666",
        margin: "5px 0",
      },
    },
  },

  // Configuración de animaciones
  animations: {
    markerDrop: true,
    markerBounce: false,
    infoWindowOpen: true,
  },

  // Configuración de controles
  controls: {
    mapTypeControl: true,
    streetViewControl: true,
    fullscreenControl: true,
    zoomControl: true,
    scaleControl: false,
  },

  // Configuración de marcadores
  markers: {
    defaultSize: 32,
    animationDuration: 1000,
    zIndex: 1000,
    clickable: true,
    draggable: false,
  },

  // Configuración de viewport
  viewport: {
    minSize: 0.1, // 0.1 grados (~11km)
    maxSize: 5, // 5 grados (~550km)
    debounceDelay: 300,
    pageSize: 50,
    searchRadius: 0.5, // 0.5 grados (~55km)
  },
};

// Función para obtener configuración de ciudad
export const getCityConfig = (cityCode) => {
  return MAP_CONFIG.cities[cityCode] || MAP_CONFIG.default;
};

// Función para generar estilos de pin SVG optimizados
export const generatePinSVG = (type = "default", customColor = null) => {
  const style = MAP_CONFIG.pinStyles[type] || MAP_CONFIG.pinStyles.default;
  const color = customColor || style.color;
  const size = style.size;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <circle cx="${size / 2}" cy="${size / 2}" r="${
    size / 2 - 2
  }" fill="${color}" stroke="#ffffff" stroke-width="2"/>
      <text x="${size / 2}" y="${
    size / 2 + 4
  }" text-anchor="middle" fill="white" font-size="${
    size / 3
  }" font-weight="bold">${style.symbol}</text>
    </svg>
  `)}`;
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

// Función para obtener el tipo de propiedad
export const getPropertyType = (property) => {
  if (property.type) return property.type;

  // Inferir tipo basado en características
  if (property.bedroom > 2 && property.size > 150) return "house";
  if (property.bedroom <= 2 && property.size <= 120) return "apartment";

  return "default";
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

// Función para calcular distancia entre dos puntos
export const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371; // Radio de la Tierra en km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
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

// Función para ajustar vista del mapa a marcadores
export const fitMapToMarkers = (map, markers, padding = 50) => {
  if (!map || !markers || markers.length === 0) return;

  const bounds = new google.maps.LatLngBounds();
  markers.forEach((marker) => {
    bounds.extend(marker.getPosition());
  });

  map.fitBounds(bounds, padding);
};

// Función para crear marcador optimizado
export const createOptimizedMarker = (google, options) => {
  if (!google || !google.maps) return null;

  const defaultOptions = {
    animation: google.maps.Animation.DROP,
    zIndex: MAP_CONFIG.markers.zIndex,
    clickable: MAP_CONFIG.markers.clickable,
    draggable: MAP_CONFIG.markers.draggable,
  };

  return new google.maps.Marker({
    ...defaultOptions,
    ...options,
  });
};
