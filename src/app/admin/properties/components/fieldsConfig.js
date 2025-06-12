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
  // { name: "contactName", label: "Nombre de Contacto" },
  // { name: "contactLastNameP", label: "Apellido Paterno de Contacto" },
  // { name: "contactLastNameM", label: "Apellido Materno de Contacto" },
  // { name: "contactPhone", label: "Teléfono de Contacto" },
  // { name: "contactRole", label: "Rol del Contacto" },
  // { name: "contactEmail", label: "Email de Contacto" },
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
          title: "Información del Desarrollador",
          fields: developerFields,
        },
      ];

    case "development":
      return [
        {
          title: "Información del Desarrollo",
          fields: developmentFields,
        },
      ];

    case "propertyNotPublished":
    case "propertyPublished":
      return [
        {
          title: "Información Básica de la Propiedad",
          fields: propertyFields.filter(
            (field) => !field.showFor || field.showFor.includes(formType)
          ),
        },
      ];

    case "propertyMinkaasaUnpublished":
    case "propertyMinkaasaPublished":
      return [
        {
          title: "Información Básica de la Propiedad",
          fields: propertyFields.filter(
            (field) => !field.showFor || field.showFor.includes(formType)
          ),
        },
        {
          title: "Información del Contacto Externo",
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

// Campos básicos para el primer paso de creación (solo datos esenciales)
export const getBasicPropertyFields = (formType) => {
  const basicFields = [
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

  // Para propiedades normales (no Minkaasa), agregar el campo de desarrollo
  if (formType === "propertyNotPublished" || formType === "propertyPublished") {
    basicFields.splice(2, 0, {
      name: "developmentId",
      label: "Desarrollo",
      required: true,
      type: "select",
      endpoint: "/development/basic",
      optionLabel: (option) =>
        `${option.developmentName} - ${option.realEstateDevelopmentName}`,
      optionValue: "developmentId",
    });
  }

  // Para propiedades Minkaasa, agregar campos de contacto
  if (
    formType === "propertyMinkaasaUnpublished" ||
    formType === "propertyMinkaasaPublished"
  ) {
    basicFields.push(
      { name: "name", label: "Nombre", required: true },
      { name: "lastNameP", label: "Apellido Paterno", required: true },
      { name: "lastNameM", label: "Apellido Materno" },
      {
        name: "mainEmail",
        label: "Email Principal",
        type: "email",
        required: true,
      },
      {
        name: "mainPhone",
        label: "Teléfono Principal",
        type: "tel",
        required: true,
      },
      { name: "agent", label: "Agente" },
      {
        name: "commission",
        label: "Comisión",
        type: "number",
        inputProps: {
          min: 0,
          step: "0.01",
        },
      }
    );
  }

  return basicFields;
};

// Secciones para el primer paso
export const getBasicPropertySections = (formType) => {
  const basicFields = getBasicPropertyFields(formType);

  if (
    formType === "propertyMinkaasaUnpublished" ||
    formType === "propertyMinkaasaPublished"
  ) {
    // Para Minkaasa, dividir en dos secciones
    const propertyFields = basicFields.slice(0, 10); // Campos de propiedad (incluyendo url y mapLocation)
    const contactFields = basicFields.slice(10); // Campos de contacto

    return [
      {
        title: "Datos Básicos de la Propiedad",
        fields: propertyFields,
      },
      {
        title: "Información del Contacto Externo",
        fields: contactFields,
      },
    ];
  } else {
    // Para propiedades normales, dividir en secciones lógicas
    const mainPropertyFields = basicFields.slice(0, 9); // Desde prototypeName hasta size
    const additionalFields = basicFields.slice(9); // url y mapLocation

    return [
      {
        title: "Información Principal",
        fields: mainPropertyFields,
      },
      {
        title: "Información Adicional",
        fields: additionalFields,
      },
    ];
  }
};
