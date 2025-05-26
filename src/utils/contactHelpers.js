import apiConfig from "@/config/apiConfig"; // Importar la configuración

/**
 * Abre un chat de WhatsApp con un mensaje predefinido
 *
 * @param {Object} options - Opciones de configuración
 * @param {string} options.phoneNumber - Número de teléfono sin formato (solo números)
 * @param {string} options.message - Mensaje predefinido
 */
export const openWhatsAppChat = ({
  phoneNumber = apiConfig.whatsAppPhoneNumber, // Usar el número de la configuración
  message = "",
}) => {
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  window.open(whatsappUrl, "_blank");
};

/**
 * Abre un chat de Facebook Messenger con un mensaje predefinido
 *
 * @param {Object} options - Opciones de configuración
 * @param {string} options.pageId - ID de la página de Facebook
 * @param {string} options.message - Mensaje predefinido
 */
export const openMessengerChat = ({
  pageId = apiConfig.facebookPageId, // Usar el ID de la página de la configuración
  message = "",
}) => {
  const encodedMessage = encodeURIComponent(message);
  const messengerUrl = `https://m.me/${pageId}?ref=${encodedMessage}`;
  window.open(messengerUrl, "_blank");
};

/**
 * Genera un mensaje predefinido para una propiedad
 *
 * @param {Object} property - Información de la propiedad
 * @param {string} property.name - Nombre de la propiedad
 * @param {string} property.development - Nombre del desarrollo o condominio
 * @param {string} [messageType='interest'] - Tipo de mensaje (interest, inquiry, visit)
 * @returns {string} Mensaje predefinido
 */
export const generatePropertyMessage = ({
  name,
  development,
  messageType = "interest",
}) => {
  const messages = {
    interest: `Hola, estoy interesado en la propiedad ${name} en ${development}`,
    inquiry: `Hola, me gustaría recibir más información sobre la propiedad ${name} en ${development}`,
    visit: `Hola, me gustaría agendar una visita para conocer la propiedad ${name} en ${development}`,
  };

  return messages[messageType] || messages.interest;
};
