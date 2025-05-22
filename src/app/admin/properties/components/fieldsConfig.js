// Lista de estados de México
const ESTADOS_MEXICO = [
  { value: "Aguascalientes", label: "Aguascalientes" },
  { value: "Baja California", label: "Baja California" },
  { value: "Baja California Sur", label: "Baja California Sur" },
  { value: "Campeche", label: "Campeche" },
  { value: "Chiapas", label: "Chiapas" },
  { value: "Chihuahua", label: "Chihuahua" },
  { value: "Ciudad de México", label: "Ciudad de México" },
  { value: "Coahuila", label: "Coahuila" },
  { value: "Colima", label: "Colima" },
  { value: "Durango", label: "Durango" },
  { value: "Estado de México", label: "Estado de México" },
  { value: "Guanajuato", label: "Guanajuato" },
  { value: "Guerrero", label: "Guerrero" },
  { value: "Hidalgo", label: "Hidalgo" },
  { value: "Jalisco", label: "Jalisco" },
  { value: "Michoacán", label: "Michoacán" },
  { value: "Morelos", label: "Morelos" },
  { value: "Nayarit", label: "Nayarit" },
  { value: "Nuevo León", label: "Nuevo León" },
  { value: "Oaxaca", label: "Oaxaca" },
  { value: "Puebla", label: "Puebla" },
  { value: "Querétaro", label: "Querétaro" },
  { value: "Quintana Roo", label: "Quintana Roo" },
  { value: "San Luis Potosí", label: "San Luis Potosí" },
  { value: "Sinaloa", label: "Sinaloa" },
  { value: "Sonora", label: "Sonora" },
  { value: "Tabasco", label: "Tabasco" },
  { value: "Tamaulipas", label: "Tamaulipas" },
  { value: "Tlaxcala", label: "Tlaxcala" },
  { value: "Veracruz", label: "Veracruz" },
  { value: "Yucatán", label: "Yucatán" },
  { value: "Zacatecas", label: "Zacatecas" },
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
