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
    name: "propertyTypeId",
    label: "Tipo de Propiedad",
    type: "select",
    required: true,
    endpoint: "/nameType",
    optionValue: "nameTypeId",
    optionLabel: (option) => option.nameType,
  },
  {
    name: "developmentId",
    label: "Desarrollo",
    required: true,
    type: "select",
    endpoint: "/development/basic",
    optionLabel: (option) =>
      `${option.developmentName} - ${option.realEstateDevelopmentName}`,
    optionValue: "developmentId",
    // Solo para propiedades normales, no Minkaasa
    showFor: ["propertyNotPublished", "propertyPublished"],
  },
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
  { name: "url", label: "URL" },
  { name: "mapLocation", label: "Ubicación en Mapa" },
];

// Campos específicos para propiedades Minkaasa
export const minkaasaLocationFields = [
  { name: "condominium", label: "Condominio" },
  { name: "street", label: "Calle" },
  { name: "exteriorNumber", label: "Número Exterior" },
  { name: "interiorNumber", label: "Número Interior" },
  { name: "suburb", label: "Colonia" },
  { name: "city", label: "Ciudad" },
  {
    name: "state",
    label: "Estado",
    type: "select",
    options: ESTADOS_MEXICO,
  },
  { name: "zipCode", label: "Código Postal" },
];

export const minkaasaContactFields = [
  { name: "name", label: "Nombre" },
  { name: "lastNameP", label: "Apellido Paterno" },
  { name: "lastNameM", label: "Apellido Materno" },
  { name: "mainEmail", label: "Email Principal", type: "email" },
  { name: "mainPhone", label: "Teléfono Principal" },
  { name: "agent", label: "Agente" },
  {
    name: "commission",
    label: "Comisión %",
    type: "number",
    inputProps: { min: 0, max: 100 },
  },
];

// Función helper para obtener los campos organizados por secciones según el tipo de formulario
export const getFieldSectionsForFormType = (formType) => {
  switch (formType) {
    case "developer":
      return [
        {
          title: "Datos de la Desarrolladora",
          fields: developerFields,
        },
      ];

    case "development":
      return [
        {
          title: "Datos del Desarrollo",
          fields: developmentFields,
        },
      ];

    case "propertyNotPublished":
    case "propertyPublished":
      return [
        {
          title: "Datos de la Propiedad",
          fields: propertyFields.filter(
            (field) => !field.showFor || field.showFor.includes(formType)
          ),
        },
      ];

    case "propertyMinkaasaUnpublished":
    case "propertyMinkaasaPublished":
      return [
        {
          title: "Datos de la Propiedad",
          fields: propertyFields.filter(
            (field) =>
              field.name !== "developmentId" && // Excluir desarrollo para Minkaasa
              (!field.showFor || field.showFor.includes(formType))
          ),
        },
        {
          title: "Datos de Ubicación",
          fields: minkaasaLocationFields,
        },
        {
          title: "Datos de Contacto",
          fields: minkaasaContactFields,
        },
      ];

    default:
      return [];
  }
};

// Función helper para obtener los campos según el tipo de formulario (mantener para compatibilidad)
export const getFieldsForFormType = (formType) => {
  const sections = getFieldSectionsForFormType(formType);
  return sections.flatMap((section) => section.fields);
};

// Función helper para obtener los valores iniciales
export const getInitialDataForFormType = (formType) => {
  const basePropertyData = {
    prototypeName: "",
    propertyTypeId: "",
    price: "",
    bedroom: "",
    bathroom: "",
    halfBathroom: "",
    parking: "",
    size: "",
    url: "",
    mapLocation: "",
    descriptions: [],
    mainImage: null,
    mainImagePreview: null,
    secondaryImages: [],
    secondaryImagesPreview: [],
  };

  switch (formType) {
    case "developer":
      return {
        realEstateDevelopmentName: "",
        url: "",
      };
    case "development":
      return {
        developmentName: "",
        realEstateDevelopmentId: "",
        commission: "",
        url: "",
        state: "",
        city: "",
        zipCode: "",
        street: "",
        extNum: "",
        intNum: "",
        mapLocation: "",
        mainImage: null,
        mainImagePreview: null,
        secondaryImages: [],
        secondaryImagesPreview: [],
      };
    case "propertyNotPublished":
    case "propertyPublished":
      return {
        ...basePropertyData,
        developmentId: "",
        // Campos adicionales para compatibilidad con Minkaasa si es necesario
        street: "",
        exteriorNumber: "",
        interiorNumber: "",
        suburb: "",
        city: "",
        state: "",
        zipCode: "",
        name: "",
        lastNameP: "",
        lastNameM: "",
        mainEmail: "",
        mainPhone: "",
        agent: "",
        commission: "",
      };
    case "propertyMinkaasaUnpublished":
    case "propertyMinkaasaPublished":
      return {
        ...basePropertyData,
        condominium: "",
        street: "",
        exteriorNumber: "",
        interiorNumber: "",
        suburb: "",
        city: "",
        state: "",
        zipCode: "",
        name: "",
        lastNameP: "",
        lastNameM: "",
        mainEmail: "",
        mainPhone: "",
        agent: "",
        commission: "",
      };
    default:
      return {};
  }
};
