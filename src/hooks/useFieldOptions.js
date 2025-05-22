import { useState, useCallback } from "react";
import { api } from "../services/api";
import { useAxiosMiddleware } from "../utils/axiosMiddleware";

export const useFieldOptions = (fields = []) => {
  const [selectOptions, setSelectOptions] = useState({});
  const [loadingOptions, setLoadingOptions] = useState({});
  const [error, setError] = useState(null);

  // Obtener axiosInstance
  const axiosInstance = useAxiosMiddleware();

  // Función para cargar las opciones de un campo específico
  const loadOptionsForField = useCallback(
    async (field) => {
      if (!field.endpoint || field.type !== "select") return;

      try {
        setLoadingOptions((prev) => ({ ...prev, [field.name]: true }));
        const options = await api.getFieldOptions(
          axiosInstance,
          field.endpoint
        );
        setSelectOptions((prev) => ({ ...prev, [field.name]: options }));
      } catch (error) {
        console.error(`Error al cargar opciones para ${field.name}:`, error);
        setError(`Error al cargar opciones para ${field.label}`);
      } finally {
        setLoadingOptions((prev) => ({ ...prev, [field.name]: false }));
      }
    },
    [axiosInstance]
  );

  // Función para cargar todas las opciones de campos
  const loadFieldOptions = useCallback(async () => {
    setError(null);
    const selectFields = fields.filter(
      (field) => field.type === "select" && field.endpoint
    );

    try {
      await Promise.all(
        selectFields.map((field) => loadOptionsForField(field))
      );
    } catch (error) {
      console.error("Error al cargar opciones de campos:", error);
      setError("Error al cargar las opciones de los campos");
    }
  }, [fields, loadOptionsForField]);

  return {
    selectOptions,
    loadingOptions,
    error,
    loadFieldOptions,
    loadOptionsForField,
  };
};
