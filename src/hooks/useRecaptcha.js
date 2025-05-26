"use client";
import { useState, useEffect } from "react";

export const useRecaptcha = () => {
  const [isRecaptchaLoaded, setIsRecaptchaLoaded] = useState(false);
  // Usar una variable de entorno o un valor temporal para desarrollo
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  // Variable para controlar si estamos en modo de desarrollo/prueba
  const isDevelopmentMode = !siteKey || siteKey === "6LcXXXXXXXXXXXXXXXXXXXXX";

  useEffect(() => {
    // Si estamos en modo de desarrollo, simplemente marcamos como cargado
    if (isDevelopmentMode) {
      setIsRecaptchaLoaded(true);
      return;
    }

    // Verificar si reCAPTCHA ya está cargado
    if (window.grecaptcha && window.grecaptcha.ready) {
      setIsRecaptchaLoaded(true);
      return;
    }

    // Función para cargar el script de reCAPTCHA
    const loadRecaptcha = () => {
      const script = document.createElement("script");
      script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        window.grecaptcha.ready(() => {
          setIsRecaptchaLoaded(true);
        });
      };

      document.head.appendChild(script);
    };

    loadRecaptcha();

    // Limpieza al desmontar
    return () => {
      const recaptchaScript = document.querySelector(
        `script[src*="recaptcha/api.js"]`
      );
      if (recaptchaScript) {
        document.head.removeChild(recaptchaScript);
      }
    };
  }, [siteKey, isDevelopmentMode]);

  const executeRecaptcha = async (action) => {
    // Si estamos en modo de desarrollo, devolvemos un token simulado
    if (isDevelopmentMode) {
      console.warn(
        "Usando reCAPTCHA en modo de desarrollo - generando token simulado"
      );
      return (
        "development-mode-token-" + Math.random().toString(36).substring(2)
      );
    }

    if (!isRecaptchaLoaded) {
      console.warn("reCAPTCHA no está cargado todavía");
      return null;
    }

    try {
      const token = await window.grecaptcha.execute(siteKey, { action });
      return token;
    } catch (error) {
      console.error("Error ejecutando reCAPTCHA:", error);
      return null;
    }
  };

  return { executeRecaptcha, isRecaptchaLoaded, isDevelopmentMode };
};
