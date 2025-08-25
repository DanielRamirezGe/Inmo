/**
 * Tipos y estructuras de datos para el componente del mapa
 * Este archivo sirve como documentación de la API del componente
 */

/**
 * Estructura de una propiedad inmobiliaria
 * @typedef {Object} Property
 * @property {number} id - ID único de la propiedad
 * @property {string} prototypeName - Nombre de la propiedad
 * @property {number} price - Precio en MXN
 * @property {string} type - Tipo de propiedad ('house', 'apartment', 'land', 'commercial')
 * @property {number} lat - Latitud de la ubicación
 * @property {number} lng - Longitud de la ubicación
 * @property {string} state - Estado o entidad federativa
 * @property {string} city - Ciudad
 * @property {number} size - Tamaño en metros cuadrados
 * @property {number} bedroom - Número de habitaciones
 * @property {number} bathroom - Número de baños
 * @property {number} [halfBathroom] - Número de medios baños
 * @property {number} [parking] - Número de estacionamientos
 * @property {string} [mainImage] - URL de la imagen principal
 * @property {Array|Object} [secondaryImages] - Imágenes secundarias
 * @property {string} [developmentName] - Nombre del desarrollo
 * @property {string} [condominium] - Nombre del condominio
 * @property {number} [developmentId] - ID del desarrollo
 */

/**
 * Estadísticas del mapa
 * @typedef {Object} MapStats
 * @property {number} totalProperties - Total de propiedades
 * @property {number} houses - Número de casas
 * @property {number} apartments - Número de departamentos
 * @property {number} totalPrice - Suma total de precios
 * @property {number} avgPrice - Precio promedio
 */

/**
 * Configuración del mapa
 * @typedef {Object} MapConfig
 * @property {Object} center - Centro del mapa {lat, lng}
 * @property {number} zoom - Nivel de zoom inicial
 * @property {number} minZoom - Zoom mínimo permitido
 * @property {number} maxZoom - Zoom máximo permitido
 * @property {Array} styles - Estilos personalizados del mapa
 */

/**
 * Estilo de pin personalizado
 * @typedef {Object} PinStyle
 * @property {string} url - URL del SVG del pin
 * @property {Object} scaledSize - Tamaño del pin
 * @property {Object} anchor - Punto de anclaje del pin
 */

/**
 * Props del componente MapComponent
 * @typedef {Object} MapComponentProps
 * @property {Array<Property>} [properties] - Propiedades para mostrar
 * @property {string} [height] - Altura del contenedor
 * @property {boolean} [showControls] - Mostrar controles
 * @property {function} [onPropertyClick] - Callback al hacer clic
 * @property {string} [className] - Clases CSS adicionales
 * @property {'vertical'|'horizontal'} [layout] - Layout de controles
 */

/**
 * Props del componente MapControls
 * @typedef {Object} MapControlsProps
 * @property {MapStats} [stats] - Estadísticas del mapa
 * @property {function} [onRefresh] - Callback para refrescar
 * @property {function} [onFilterChange] - Callback para cambio de filtro
 * @property {function} [onLocationClick] - Callback para ubicación
 * @property {function} [onZoomIn] - Callback para zoom in
 * @property {function} [onZoomOut] - Callback para zoom out
 * @property {string} [className] - Clases CSS adicionales
 */

/**
 * Función de callback para clic en propiedad
 * @callback PropertyClickCallback
 * @param {Property} property - Propiedad seleccionada
 */

/**
 * Función de callback para cambio de filtro
 * @callback FilterChangeCallback
 * @param {string|null} type - Tipo de propiedad seleccionado
 */

/**
 * Función de callback para refrescar propiedades
 * @callback RefreshCallback
 */

/**
 * Función de callback para ubicación del usuario
 * @callback LocationCallback
 */

/**
 * Función de callback para zoom
 * @callback ZoomCallback
 */

/**
 * Configuración de la ventana de información
 * @typedef {Object} InfoWindowConfig
 * @property {number} maxWidth - Ancho máximo de la ventana
 * @property {Object} styles - Estilos de la ventana
 */

/**
 * Configuración de animaciones
 * @typedef {Object} AnimationConfig
 * @property {boolean} markerDrop - Animación de caída de marcadores
 * @property {boolean} markerBounce - Animación de rebote
 * @property {boolean} infoWindowOpen - Animación de apertura de ventana
 */

/**
 * Configuración de controles del mapa
 * @typedef {Object} ControlsConfig
 * @property {boolean} mapTypeControl - Control de tipo de mapa
 * @property {boolean} streetViewControl - Control de Street View
 * @property {boolean} fullscreenControl - Control de pantalla completa
 * @property {boolean} zoomControl - Control de zoom
 * @property {boolean} scaleControl - Control de escala
 */

/**
 * Respuesta de la API de propiedades
 * @typedef {Object} PropertiesApiResponse
 * @property {Array<Property>} data - Array de propiedades
 * @property {number} page - Página actual
 * @property {number} pageSize - Tamaño de página
 * @property {number} total - Total de propiedades
 */

/**
 * Función para formatear precios
 * @callback PriceFormatter
 * @param {number} price - Precio a formatear
 * @param {string} [currency] - Moneda (por defecto 'MXN')
 * @returns {string} Precio formateado
 */

/**
 * Función para validar coordenadas
 * @callback CoordinateValidator
 * @param {number|string} lat - Latitud
 * @param {number|string} lng - Longitud
 * @returns {boolean} True si las coordenadas son válidas
 */

/**
 * Función para generar SVG de pin
 * @callback PinSVGGenerator
 * @param {string} type - Tipo de propiedad
 * @param {string} [customColor] - Color personalizado
 * @returns {string} URL del SVG del pin
 */

// Exportar tipos para uso en JSDoc
export const MapTypes = {
  Property: "Property",
  MapStats: "MapStats",
  MapConfig: "MapConfig",
  PinStyle: "PinStyle",
  MapComponentProps: "MapComponentProps",
  MapControlsProps: "MapControlsProps",
  InfoWindowConfig: "InfoWindowConfig",
  AnimationConfig: "AnimationConfig",
  ControlsConfig: "ControlsConfig",
  PropertiesApiResponse: "PropertiesApiResponse",
};

// Ejemplo de uso en JSDoc:
/**
 * @param {Property} property - Propiedad a procesar
 * @returns {string} Información formateada de la propiedad
 */
export function formatPropertyInfo(property) {
  return `${property.prototypeName} - $${property.price.toLocaleString(
    "es-MX"
  )}`;
}
