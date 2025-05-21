// Definiciones de campos para cada tipo de entidad
export const developerFields = [
  { name: "realEstateDevelopmentName", label: "Nombre", required: true },
  { name: "url", label: "Url web" },
  { name: "contactName", label: "Nombre de Contacto" },
  { name: "contactLastNameP", label: "Apellido Paterno de Contacto" },
  { name: "contactLastNameM", label: "Apellido Materno de Contacto" },
  { name: "contactPhone", label: "Teléfono de Contacto" },
  { name: "contactRole", label: "Rol del Contacto" },
  { name: "contactEmail", label: "Email de Contacto" },
];

export const developmentFields = [
  { name: "developmentName", label: "Nombre del Desarrollo", required: true },
  {
    name: "realEstateDevelopmentId",
    label: "Desarrolladora",
    type: "select",
    required: true,
    endpoint: "/realEstateDevelopment",
    optionValue: "realEstateDevelopmentId",
    optionLabel: (option) => option.realEstateDevelopmentName,
  },
  { name: "commission", label: "Comisión" },
  { name: "url", label: "URL" },
  // Campos de ubicación
  { name: "state", label: "Estado" },
  { name: "city", label: "Ciudad" },
  { name: "zipCode", label: "Código Postal" },
  { name: "street", label: "Calle" },
  { name: "extNum", label: "Número Exterior" },
  { name: "intNum", label: "Número Interior" },
  { name: "mapLocation", label: "Ubicación en Mapa" },
];

export const propertyFields = [
  { name: "prototypeName", label: "Nombre del Prototipo", required: true },
  {
    name: "developmentId",
    label: "Desarrollo",
    required: true,
    type: "select",
    endpoint: "/development/basic",
    optionLabel: (option) =>
      `${option.developmentName} - ${option.realEstateDevelopmentName}`,
    optionValue: "developmentId",
  },
  { name: "condominium", label: "Condominio" },
  { name: "price", label: "Precio", type: "number", required: true },
  { name: "street", label: "Calle" },
  { name: "exteriorNumber", label: "Número Exterior" },
  { name: "interiorNumber", label: "Número Interior" },
  { name: "suburb", label: "Colonia" },
  { name: "city", label: "Ciudad" },
  { name: "state", label: "Estado" },
  { name: "zipCode", label: "Código Postal" },
  { name: "bedroom", label: "Recámaras" },
  { name: "bathroom", label: "Baños" },
  { name: "halfBathroom", label: "Medios Baños" },
  { name: "parking", label: "Estacionamiento" },
  { name: "size", label: "Tamaño" },
  { name: "mapLocation", label: "Ubicación en Mapa" },
];
