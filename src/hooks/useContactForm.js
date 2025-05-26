import { useState } from "react";

/**
 * Hook personalizado para manejar el formulario de contacto
 * @param {Object} options - Opciones de configuración
 * @param {Function} options.onSubmit - Función a ejecutar cuando se envía el formulario
 * @param {Function} options.onSuccess - Callback opcional que se llama después de un envío exitoso
 * @returns {Object} Estado del formulario y funciones de manejo
 */
const useContactForm = ({ onSubmit, onSuccess = () => {} }) => {
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [contactSending, setContactSending] = useState(false);
  const [contactSent, setContactSent] = useState(false);
  const [contactError, setContactError] = useState(null);

  /**
   * Maneja el envío del formulario
   * @param {Event} e - Evento del formulario
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación básica
    if (!contactName.trim() || !contactPhone.trim() || !contactMessage.trim())
      return;

    setContactSending(true);
    setContactError(null);

    try {
      // Llamar a la función de envío proporcionada
      await onSubmit({
        name: contactName,
        phone: contactPhone,
        message: contactMessage,
      });

      // Actualizar el estado después del envío exitoso
      setContactSent(true);
      setContactName("");
      setContactPhone("");
      setContactMessage("");

      // Llamar al callback de éxito
      onSuccess();
    } catch (error) {
      console.error("Error al enviar el mensaje:", error);
      setContactError(
        error.response?.data?.message ||
          "Ocurrió un error al enviar el mensaje. Por favor intenta nuevamente."
      );
    } finally {
      setContactSending(false);
    }
  };

  /**
   * Resetea el formulario a su estado inicial
   */
  const resetForm = () => {
    setContactName("");
    setContactPhone("");
    setContactMessage("");
    setContactSent(false);
    setContactError(null);
  };

  return {
    // Estado del formulario
    contactName,
    contactPhone,
    contactMessage,
    contactSending,
    contactSent,
    contactError,
    // Setters
    setContactName,
    setContactPhone,
    setContactMessage,
    // Acciones
    handleSubmit,
    resetForm,
    // Estado compuesto
    isValid: contactName.trim() && contactPhone.trim() && contactMessage.trim(),
    isDisabled: contactSending || contactSent,
  };
};

export default useContactForm;
