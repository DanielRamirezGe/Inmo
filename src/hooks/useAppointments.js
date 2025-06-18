import { useState, useCallback } from "react";
import apiConfig from "../config/apiConfig";

export const useAppointments = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createAppointment = useCallback(async (appointmentData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${apiConfig.baseURL}/api/v1/appointments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(appointmentData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData.message || "Error al agendar la visita");
      }

      const data = await response.json();
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    createAppointment,
    loading,
    error,
  };
};
