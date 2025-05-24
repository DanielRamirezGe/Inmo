// Lista de estados de México
export const ESTADOS_MEXICO = [
  { id: "Aguascalientes", name: "Aguascalientes" },
  { id: "Baja California", name: "Baja California" },
  { id: "Baja California Sur", name: "Baja California Sur" },
  { id: "Campeche", name: "Campeche" },
  { id: "Chiapas", name: "Chiapas" },
  { id: "Chihuahua", name: "Chihuahua" },
  { id: "Ciudad de México", name: "Ciudad de México" },
  { id: "Coahuila", name: "Coahuila" },
  { id: "Colima", name: "Colima" },
  { id: "Durango", name: "Durango" },
  { id: "Estado de México", name: "Estado de México" },
  { id: "Guanajuato", name: "Guanajuato" },
  { id: "Guerrero", name: "Guerrero" },
  { id: "Hidalgo", name: "Hidalgo" },
  { id: "Jalisco", name: "Jalisco" },
  { id: "Michoacán", name: "Michoacán" },
  { id: "Morelos", name: "Morelos" },
  { id: "Nayarit", name: "Nayarit" },
  { id: "Nuevo León", name: "Nuevo León" },
  { id: "Oaxaca", name: "Oaxaca" },
  { id: "Puebla", name: "Puebla" },
  { id: "Querétaro", name: "Querétaro" },
  { id: "Quintana Roo", name: "Quintana Roo" },
  { id: "San Luis Potosí", name: "San Luis Potosí" },
  { id: "Sinaloa", name: "Sinaloa" },
  { id: "Sonora", name: "Sonora" },
  { id: "Tabasco", name: "Tabasco" },
  { id: "Tamaulipas", name: "Tamaulipas" },
  { id: "Tlaxcala", name: "Tlaxcala" },
  { id: "Veracruz", name: "Veracruz" },
  { id: "Yucatán", name: "Yucatán" },
  { id: "Zacatecas", name: "Zacatecas" },
];

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
  {
    name: "commission",
    label: "Comisión %",
    type: "number",
    inputProps: {
      step: 1,
      min: 0,
      max: 100,
    },
  },
  { name: "url", label: "URL" },
  // Campos de ubicación
  {
    name: "state",
    label: "Estado",
    type: "select",
    options: ESTADOS_MEXICO,
  },
  { name: "city", label: "Ciudad o Municipio" },
  {
    name: "zipCode",
    label: "Código Postal",
    type: "number",
    inputProps: { min: 0 },
  },
  { name: "street", label: "Calle" },
  { name: "extNum", label: "Número Exterior", type: "text" },
  { name: "intNum", label: "Número Interior", type: "text" },
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
  {
    name: "price",
    label: "Precio",
    type: "number",
    required: true,
    inputProps: {
      min: 0,
      step: "0.01",
    },
  },
  // { name: "street", label: "Calle" },
  // { name: "exteriorNumber", label: "Número Exterior", type: "text" },
  // { name: "interiorNumber", label: "Número Interior", type: "text" },
  // { name: "suburb", label: "Colonia" },
  // { name: "city", label: "Ciudad" },
  // {
  //   name: "state",
  //   label: "Estado",
  //   type: "select",
  //   options: ESTADOS_MEXICO,
  // },
  // {
  //   name: "zipCode",
  //   label: "Código Postal",
  //   type: "number",
  //   inputProps: { min: 0 },
  // },
  {
    name: "bedroom",
    label: "Recámaras",
    type: "number",
    inputProps: {
      min: 0,
      step: 1,
    },
  },
  {
    name: "bathroom",
    label: "Baños",
    type: "number",
    inputProps: {
      min: 0,
      step: 1,
    },
  },
  {
    name: "halfBathroom",
    label: "Medios Baños",
    type: "number",
    inputProps: {
      min: 0,
      step: 1,
    },
  },
  {
    name: "parking",
    label: "Estacionamiento",
    type: "number",
    inputProps: {
      min: 0,
      step: 1,
    },
  },
  {
    name: "size",
    label: "Tamaño m2",
    type: "number",
    inputProps: {
      min: 0,
      step: "0.01",
    },
  },
  { name: "mapLocation", label: "Ubicación en Mapa" },
];
