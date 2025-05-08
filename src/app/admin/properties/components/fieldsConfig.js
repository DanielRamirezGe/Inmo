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
    label: "ID de Desarrolladora",
    required: true,
  },
  { name: "state", label: "Estado" },
  { name: "city", label: "Ciudad" },
  { name: "zipCode", label: "Código Postal" },
  { name: "street", label: "Calle" },
  { name: "extNum", label: "Número Exterior" },
  { name: "intNum", label: "Número Interior" },
  { name: "mapLocation", label: "Ubicación en Mapa" },
  { name: "url", label: "URL" },
];

export const externalAgencyFields = [
  { name: "name", label: "Nombre", required: true },
  { name: "description", label: "Descripción", multiline: true, rows: 3 },
  { name: "contactName", label: "Nombre de Contacto" },
  { name: "contactPhone", label: "Teléfono de Contacto" },
  { name: "contactEmail", label: "Email de Contacto" },
];

export const propertyFields = [
  { name: "title", label: "Título", required: true },
  { name: "description", label: "Descripción", multiline: true, rows: 3 },
  { name: "price", label: "Precio", type: "number", required: true },
  { name: "location", label: "Ubicación" },
  { name: "developmentId", label: "ID del Desarrollo" },
  { name: "externalAgencyId", label: "ID de Agencia Externa" },
  { name: "type", label: "Tipo de Propiedad" },
  { name: "status", label: "Estado" },
];
