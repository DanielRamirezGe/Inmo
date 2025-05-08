// Datos de ejemplo
export const MOCK_DEVELOPERS = [];

export const MOCK_DEVELOPMENTS = [
  {
    id: 1,
    name: "Residencial Los Pinos",
    description:
      "Complejo residencial con 120 departamentos, áreas verdes y amenidades premium.",
    location: "Zona Norte, Ciudad de México",
    developerId: 1,
    status: "En construcción",
  },
  {
    id: 2,
    name: "Torres Ejecutivas Centro",
    description:
      "Edificio de oficinas clase A con vistas panorámicas y estacionamiento privado.",
    location: "Centro Financiero, Monterrey",
    developerId: 2,
    status: "Completado",
  },
  {
    id: 3,
    name: "Condominio Las Brisas",
    description:
      "Desarrollo ecológico con paneles solares y sistemas de captación de agua pluvial.",
    location: "Zona Costera, Cancún",
    developerId: 3,
    status: "Pre-venta",
  },
  {
    id: 4,
    name: "Fraccionamiento El Bosque",
    description:
      "Casas unifamiliares en entorno natural con club privado y seguridad 24/7.",
    location: "Periferia Sur, Guadalajara",
    developerId: 1,
    status: "En construcción",
  },
  {
    id: 5,
    name: "Plaza Comercial Andares",
    description:
      "Centro comercial con locales de diferentes dimensiones y alto flujo peatonal.",
    location: "Zapopan, Jalisco",
    developerId: 4,
    status: "Completado",
  },
];

export const MOCK_AGENCIES = [
  {
    id: 1,
    name: "Inmobiliaria Siglo XXI",
    description:
      "Red nacional de agentes especializada en propiedades residenciales y comerciales.",
    contactName: "Carlos Ramírez",
    contactPhone: "555-111-2222",
    contactEmail: "carlos@sigloxxi.com",
  },
  {
    id: 2,
    name: "MegaCasas",
    description:
      "Agencia premium enfocada en propiedades de lujo y exclusivas.",
    contactName: "Patricia Herrera",
    contactPhone: "555-333-4444",
    contactEmail: "patricia@megacasas.com",
  },
  {
    id: 3,
    name: "TuHogar Inmobiliaria",
    description:
      "Especialistas en primera vivienda y opciones accesibles para familias.",
    contactName: "Javier Méndez",
    contactPhone: "555-555-6666",
    contactEmail: "javier@tuhogar.com",
  },
];

export const MOCK_PROPERTIES = [
  {
    id: 1,
    title: "Departamento de lujo en Los Pinos",
    description:
      "Hermoso departamento de 3 recámaras con vista panorámica, acabados de lujo y terraza privada.",
    price: 4500000,
    location: "Torre Norte, Piso 15, Los Pinos",
    developmentId: 1,
    type: "Departamento",
    status: "Disponible",
  },
  {
    id: 2,
    title: "Oficina ejecutiva en Torres Centro",
    description:
      "Oficina de 120m² completamente equipada, 3 privados, sala de juntas y recepción.",
    price: 3800000,
    location: "Piso 8, Torres Ejecutivas Centro",
    developmentId: 2,
    type: "Oficina",
    status: "Disponible",
  },
  {
    id: 3,
    title: "Villa frente al mar",
    description:
      "Espectacular villa de 4 habitaciones con acceso directo a la playa, piscina privada y jardín tropical.",
    price: 12500000,
    location: "Condominio Las Brisas, Villa 7",
    developmentId: 3,
    externalAgencyId: 2,
    type: "Casa",
    status: "Pre-venta",
  },
  {
    id: 4,
    title: "Casa familiar en El Bosque",
    description:
      "Acogedora casa de 3 recámaras, 2.5 baños, jardín amplio y cochera para 2 autos.",
    price: 3200000,
    location: "Calle Roble 123, Fraccionamiento El Bosque",
    developmentId: 4,
    externalAgencyId: 1,
    type: "Casa",
    status: "Disponible",
  },
  {
    id: 5,
    title: "Local comercial en Plaza Andares",
    description:
      "Local de 75m² en ubicación privilegiada con alto tráfico de visitantes, ideal para retail.",
    price: 5800000,
    location: "Local B-15, Plaza Comercial Andares",
    developmentId: 5,
    externalAgencyId: 3,
    type: "Comercial",
    status: "Disponible",
  },
  {
    id: 6,
    title: "Penthouse de lujo",
    description:
      "Impresionante penthouse con 4 habitaciones, terraza panorámica y helipuerto privado.",
    price: 18500000,
    location: "Torre Sur, Piso 30, Los Pinos",
    developmentId: 1,
    externalAgencyId: 2,
    type: "Penthouse",
    status: "Disponible",
  },
];
