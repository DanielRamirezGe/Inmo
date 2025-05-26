export const formatCurrency = (value) => {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(value);
};

/**
 * Formatea un número como precio en pesos mexicanos
 * @param {number} price - El precio a formatear
 * @param {number} [minimumFractionDigits=2] - Mínimo de dígitos decimales
 * @param {number} [maximumFractionDigits=2] - Máximo de dígitos decimales
 * @returns {string} Precio formateado
 */
export const formatPrice = (
  price,
  minimumFractionDigits = 2,
  maximumFractionDigits = 2
) => {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(price);
};

/**
 * Formatea un área en metros cuadrados
 * @param {number} size - El tamaño en metros cuadrados
 * @returns {string} Área formateada
 */
export const formatArea = (size) => {
  return `${size} m²`;
};

/**
 * Formatea una cantidad de baños, incluyendo medios baños
 * @param {number} bathrooms - Número de baños completos
 * @param {number} halfBathrooms - Número de medios baños
 * @returns {string} Cantidad de baños formateada
 */
export const formatBathrooms = (bathrooms, halfBathrooms) => {
  if (!halfBathrooms || halfBathrooms <= 0) {
    return String(bathrooms);
  }
  return `${bathrooms} ½`;
};

/**
 * Trunca un texto a una longitud específica
 * @param {string} text - Texto a truncar
 * @param {number} maxLength - Longitud máxima
 * @returns {string} Texto truncado
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return `${text.substring(0, maxLength).trim()}...`;
};

/**
 * Formatea una dirección completa
 * @param {Object} address - Objeto con información de dirección
 * @param {string} address.street - Calle
 * @param {string} address.city - Ciudad
 * @param {string} address.state - Estado
 * @param {string} address.zipCode - Código postal
 * @returns {string} Dirección formateada
 */
export const formatAddress = ({ street, city, state, zipCode }) => {
  return `${street}, ${city}, ${state}, C.P. ${zipCode}`;
};
