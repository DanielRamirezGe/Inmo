import { useState } from "react";
import { api } from "../services/api";

export const useBrokerForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    lastNameP: "",
    lastNameM: "",
    mainEmail: "",
    mainPhone: "",
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Validaciones
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "El nombre es requerido";
    }

    if (!formData.lastNameP.trim()) {
      newErrors.lastNameP = "El apellido paterno es requerido";
    }

    if (!formData.mainEmail.trim()) {
      newErrors.mainEmail = "El correo electrónico es requerido";
    } else if (!/\S+@\S+\.\S+/.test(formData.mainEmail)) {
      newErrors.mainEmail = "El formato del correo electrónico no es válido";
    }

    if (!formData.mainPhone.trim()) {
      newErrors.mainPhone = "El teléfono es requerido";
    } else if (!/^[\d\s\-\+\(\)]+$/.test(formData.mainPhone)) {
      newErrors.mainPhone = "El número de teléfono no es válido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar cambios en el formulario
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      const response = await api.registerBroker(formData);
      
      setSuccess(true);
      setSnackbar({
        open: true,
        message: response.message || "¡Registro exitoso! Nos pondremos en contacto contigo pronto.",
        severity: "success",
      });
      
      // Limpiar formulario
      setFormData({
        name: "",
        lastNameP: "",
        lastNameM: "",
        mainEmail: "",
        mainPhone: "",
      });
      
    } catch (error) {
      console.error("Error al registrar broker:", error);
      
      let errorMessage = "Error al procesar el registro. Por favor, inténtalo de nuevo.";
      
      if (error.response?.data) {
        const errorData = error.response.data;
        
        // Mostrar mensajes específicos del API
        if (errorData.message) {
          errorMessage = errorData.message;
        }
        
        // Mostrar errores de campos específicos
        if (errorData.fieldErrors && Array.isArray(errorData.fieldErrors)) {
          const fieldErrors = {};
          errorData.fieldErrors.forEach(err => {
            fieldErrors[err.field] = err.message;
          });
          setErrors(fieldErrors);
        }
      }
      
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      lastNameP: "",
      lastNameM: "",
      mainEmail: "",
      mainPhone: "",
    });
    setErrors({});
    setSuccess(false);
    setSnackbar({
      open: false,
      message: "",
      severity: "success",
    });
  };

  return {
    // State
    formData,
    errors,
    loading,
    success,
    snackbar,
    
    // Actions
    handleInputChange,
    handleSubmit,
    handleCloseSnackbar,
    resetForm,
    
    // Validations
    validateForm,
  };
}; 