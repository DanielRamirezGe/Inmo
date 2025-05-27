import { useState, useCallback, useMemo } from "react";
import { api } from "../services/api";

export const useFieldOptions = (fields = []) => {
  const [selectOptions, setSelectOptions] = useState({});
  const [loadingOptions, setLoadingOptions] = useState({});
  const [error, setError] = useState(null);

  // Calcular si hay algún campo cargando
  const isLoading = useMemo(() => {
    return Object.values(loadingOptions).some((loading) => loading === true);
  }, [loadingOptions]);

  // Función para cargar las opciones de un campo específico
  const loadOptionsForField = useCallback(async (field) => {
    if (!field.endpoint || field.type !== "select") return;

    console.log(
      `Loading options for field ${field.name} from endpoint ${field.endpoint}`
    );
    try {
      setLoadingOptions((prev) => ({ ...prev, [field.name]: true }));
      const options = await api.getFieldOptions(field.endpoint);
      console.log(`Options loaded for field ${field.name}:`, options);
      setSelectOptions((prev) => ({ ...prev, [field.name]: options }));
    } catch (error) {
      console.error(`Error al cargar opciones para ${field.name}:`, error);
      setError(`Error al cargar opciones para ${field.label}`);
    } finally {
      setLoadingOptions((prev) => ({ ...prev, [field.name]: false }));
    }
  }, []);

  // Función para cargar todas las opciones de campos
  const loadFieldOptions = useCallback(async () => {
    setError(null);
    const selectFields = fields.filter(
      (field) => field.type === "select" && field.endpoint
    );
    console.log("Fields to load options for:", selectFields);

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
    isLoading,
    error,
    loadFieldOptions,
    loadOptionsForField,
    setSelectOptions,
  };
};
