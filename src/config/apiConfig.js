const isDevelopment = process.env.NODE_ENV === "development";

console.log(process.env.API_URL_DEV);

const apiConfig = {
  baseURL: isDevelopment
    ? "https://adonaipayment.com/minkaasa_test"
    : "https://adonaipayment.com/minkaasa",
  whatsAppPhoneNumber: "+525651562698", // Número de WhatsApp para contacto
  facebookPageId: "61573640081107", // ID de la página de Facebook para Messenger
};

export default apiConfig;
