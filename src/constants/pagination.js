/**
 * Constantes de Paginación
 *
 * Este archivo centraliza toda la configuración de paginación para mantener
 * consistencia en toda la aplicación.
 */

// Configuración por defecto para todas las entidades
export const DEFAULT_PAGINATION = {
  PAGE: 1,
  PAGE_SIZE: 15,
  TOTAL: 0,
};

// Configuración específica por tipo de entidad
export const ENTITY_PAGINATION_CONFIG = {
  // Admin - Entidades principales
  DEVELOPERS: {
    PAGE_SIZE: 15,
    PAGE_SIZE_OPTIONS: [15, 30, 50],
  },
  DEVELOPMENTS: {
    PAGE_SIZE: 15,
    PAGE_SIZE_OPTIONS: [15, 30, 50],
  },
  PROPERTIES: {
    PAGE_SIZE: 15,
    PAGE_SIZE_OPTIONS: [15, 30, 50],
  },

  // Público - Propiedades para usuarios finales
  PUBLIC_PROPERTIES: {
    PAGE_SIZE: 10,
    PAGE_SIZE_OPTIONS: [10, 20],
  },

  // Admin - Usuarios y perfiladores
  USERS: {
    PAGE_SIZE: 20,
    PAGE_SIZE_OPTIONS: [20, 40, 60],
  },

  // Casos especiales
  DEVELOPMENTS_BASIC: {
    PAGE_SIZE: 1000, // Para dropdowns y selects
    PAGE_SIZE_OPTIONS: [1000],
  },
};

// Función helper para obtener configuración de paginación
export const getPaginationConfig = (entityType) => {
  return (
    ENTITY_PAGINATION_CONFIG[entityType] || {
      PAGE_SIZE: DEFAULT_PAGINATION.PAGE_SIZE,
      PAGE_SIZE_OPTIONS: [DEFAULT_PAGINATION.PAGE_SIZE],
    }
  );
};

// Función helper para crear estado inicial de paginación
export const createInitialPagination = (entityType = null) => {
  const config = entityType ? getPaginationConfig(entityType) : null;

  return {
    page: DEFAULT_PAGINATION.PAGE,
    pageSize: config ? config.PAGE_SIZE : DEFAULT_PAGINATION.PAGE_SIZE,
    total: DEFAULT_PAGINATION.TOTAL,
  };
};

// Función helper para validar parámetros de paginación
export const validatePaginationParams = (page, pageSize, entityType = null) => {
  const config = entityType ? getPaginationConfig(entityType) : null;

  const validPage = Math.max(1, parseInt(page) || DEFAULT_PAGINATION.PAGE);
  const validPageSize = config
    ? config.PAGE_SIZE_OPTIONS.includes(parseInt(pageSize))
      ? parseInt(pageSize)
      : config.PAGE_SIZE
    : parseInt(pageSize) || DEFAULT_PAGINATION.PAGE_SIZE;

  return {
    page: validPage,
    pageSize: validPageSize,
  };
};
