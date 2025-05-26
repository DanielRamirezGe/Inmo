const isDevelopment = process.env.NODE_ENV === "development";

const apiConfig = {
  baseURL: isDevelopment
    ? "http://localhost:3010"
    : "https://adonaipayment.com/minkaasa",
  whatsAppPhoneNumber: "+525651562698", // Número de WhatsApp para contacto
  facebookPageId: "61573640081107", // ID de la página de Facebook para Messenger
};

export default apiConfig;
