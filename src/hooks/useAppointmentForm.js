import { useState } from "react";

export const useAppointmentForm = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [formData, setFormData] = useState({
    userName: "",
    userLastNameP: "",
    userLastNameM: "",
    email: "",
    phone: "",
    comment: "",
  });
  const [appointmentCreated, setAppointmentCreated] = useState(null);

  // Validaciones
  const isStep1Valid = selectedDate && selectedTime;
  const isStep2Valid =
    formData.userName &&
    formData.userLastNameP &&
    formData.email &&
    formData.phone;

  // Handlers
  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setActiveStep(0);
    setSelectedDate("");
    setSelectedTime("");
    setFormData({
      userName: "",
      userLastNameP: "",
      userLastNameM: "",
      email: "",
      phone: "",
      comment: "",
    });
    setAppointmentCreated(null);
  };

  // Utilidades
  const formatDateTime = (date, time) => {
    if (!date || !time) return "";
    const dateObj = new Date(`${date}T${time}`);
    return dateObj.toLocaleString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const generatePropertyComment = (propertyName, propertyData) => {
    if (!propertyName && !propertyData) return "";

    const lines = ["📋 INFORMACIÓN DE LA PROPIEDAD DE INTERÉS:", ""];

    // Información básica
    if (propertyData?.name || propertyName) {
      lines.push(`🏠 Propiedad: ${propertyData?.name || propertyName}`);
    }

    if (propertyData?.development) {
      lines.push(`🏗️ Desarrollo: ${propertyData.development}`);
    }

    // Ubicación
    const locationParts = [];
    if (propertyData?.location) locationParts.push(propertyData.location);
    if (propertyData?.city) locationParts.push(propertyData.city);
    if (propertyData?.state) locationParts.push(propertyData.state);

    if (locationParts.length > 0) {
      lines.push(`📍 Ubicación: ${locationParts.join(", ")}`);
    }

    // Características
    if (propertyData?.price) {
      const formatter = new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: "MXN",
        maximumFractionDigits: 0,
      });
      lines.push(`💰 Precio: ${formatter.format(propertyData.price)}`);
    }

    const features = [];
    if (propertyData?.bedroom)
      features.push(`${propertyData.bedroom} recámaras`);
    if (propertyData?.bathroom) features.push(`${propertyData.bathroom} baños`);
    if (propertyData?.parking)
      features.push(`${propertyData.parking} estacionamientos`);
    if (propertyData?.size) features.push(`${propertyData.size} m²`);

    if (features.length > 0) {
      lines.push(`🏡 Características: ${features.join(", ")}`);
    }

    lines.push("", "💬 Comentarios adicionales del cliente:");
    return lines.join("\n");
  };

  const buildAppointmentData = (prototypeId, propertyName, propertyData) => {
    if (!isStep1Valid || !isStep2Valid) return null;

    // Combinar fecha y hora en formato ISO
    const appointmentDateTime = new Date(`${selectedDate}T${selectedTime}`);

    // Construir comentario final
    const propertyInfo = generatePropertyComment(propertyName, propertyData);
    const userComments = formData.comment?.trim();

    let finalComment = "";
    if (propertyInfo) {
      finalComment = propertyInfo;
      if (userComments) {
        finalComment = propertyInfo.replace(
          "💬 Comentarios adicionales del cliente:",
          `💬 Comentarios adicionales del cliente:\n${userComments}`
        );
      }
    } else if (userComments) {
      finalComment = userComments;
    }

    return {
      prototypeId,
      date: appointmentDateTime.toISOString(),
      userName: formData.userName,
      userLastNameP: formData.userLastNameP,
      userLastNameM: formData.userLastNameM || undefined,
      email: formData.email,
      phone: formData.phone,
      comment: finalComment || undefined,
    };
  };

  return {
    // State
    activeStep,
    selectedDate,
    selectedTime,
    formData,
    appointmentCreated,

    // Validations
    isStep1Valid,
    isStep2Valid,

    // Actions
    handleNext,
    handleBack,
    handleInputChange,
    setSelectedDate,
    setSelectedTime,
    setAppointmentCreated,
    resetForm,

    // Utilities
    formatDateTime,
    buildAppointmentData,
  };
};
