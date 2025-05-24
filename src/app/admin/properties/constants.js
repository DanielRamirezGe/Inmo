export const FORM_TYPES = {
  DEVELOPER: "developer",
  DEVELOPMENT: "development",
  PROPERTY_NOT_PUBLISHED: "propertyNotPublished",
  PROPERTY_PUBLISHED: "propertyPublished",
  PROPERTY_MINKAASA_UNPUBLISHED: "propertyMinkaasaUnpublished",
  PROPERTY_MINKAASA_PUBLISHED: "propertyMinkaasaPublished",
  AGENCY: "agency",
};

export const TAB_INDICES = {
  DEVELOPER: 0,
  DEVELOPMENT: 1,
  PROPERTY_NOT_PUBLISHED: 2,
  PROPERTY_PUBLISHED: 3,
  PROPERTY_MINKAASA_UNPUBLISHED: 4,
  PROPERTY_MINKAASA_PUBLISHED: 5,
};

export const TAB_FORM_TYPE_MAP = {
  [TAB_INDICES.DEVELOPER]: FORM_TYPES.DEVELOPER,
  [TAB_INDICES.DEVELOPMENT]: FORM_TYPES.DEVELOPMENT,
  [TAB_INDICES.PROPERTY_NOT_PUBLISHED]: FORM_TYPES.PROPERTY_NOT_PUBLISHED,
  [TAB_INDICES.PROPERTY_PUBLISHED]: FORM_TYPES.PROPERTY_PUBLISHED,
  [TAB_INDICES.PROPERTY_MINKAASA_UNPUBLISHED]:
    FORM_TYPES.PROPERTY_MINKAASA_UNPUBLISHED,
  [TAB_INDICES.PROPERTY_MINKAASA_PUBLISHED]:
    FORM_TYPES.PROPERTY_MINKAASA_PUBLISHED,
};

export const ENTITY_LABELS = {
  [FORM_TYPES.DEVELOPER]: {
    singular: "Desarrolladora Inmobiliaria",
    plural: "Desarrolladoras Inmobiliarias",
  },
  [FORM_TYPES.DEVELOPMENT]: {
    singular: "Desarrollo",
    plural: "Desarrollos",
  },
  [FORM_TYPES.PROPERTY_NOT_PUBLISHED]: {
    singular: "Propiedad No Publicada",
    plural: "Propiedades No Publicadas",
  },
  [FORM_TYPES.PROPERTY_PUBLISHED]: {
    singular: "Propiedad Publicada",
    plural: "Propiedades Publicadas",
  },
  [FORM_TYPES.PROPERTY_MINKAASA_UNPUBLISHED]: {
    singular: "Propiedad Minkaasa No Publicada",
    plural: "Propiedades Minkaasa No Publicadas",
  },
  [FORM_TYPES.PROPERTY_MINKAASA_PUBLISHED]: {
    singular: "Propiedad Minkaasa Publicada",
    plural: "Propiedades Minkaasa Publicadas",
  },
};

// Helper functions to get labels consistently
export const getTabLabel = (formType) => ENTITY_LABELS[formType].singular;
export const getTabTitle = (formType) => ENTITY_LABELS[formType].plural;

// Derived arrays/objects for components that need them
export const TAB_LABELS = Object.values(TAB_FORM_TYPE_MAP).map(getTabLabel);
export const TAB_TITLES = Object.keys(ENTITY_LABELS).reduce((acc, key) => {
  acc[key] = ENTITY_LABELS[key].plural;
  return acc;
}, {});
