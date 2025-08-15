import { useState, useCallback, useRef, useEffect } from "react";

// ✅ Configuración para tabs de edición de propiedades
const TAB_CONFIG = {
  BASIC_DATA: 0,
  DESCRIPTIONS: 1,
  IMAGES: 2,
  VIDEO: 3,
  TAB_NAMES: {
    0: "BASIC_DATA",
    1: "DESCRIPTIONS",
    2: "IMAGES",
    3: "VIDEO",
  },
  DEFAULT_MESSAGES: {
    0: "✅ Datos básicos actualizados correctamente",
    1: "✅ Descripciones actualizadas correctamente",
    2: "✅ Imágenes actualizadas correctamente",
    3: "✅ Video actualizado correctamente",
  },
};

/**
 * ✅ Hook personalizado para manejar la lógica de tabs de edición de propiedades
 *
 * Responsabilidades:
 * - Gestión de estado de tabs (loading, errores, tab actual)
 * - Coordinación de operaciones asíncronas
 * - Manejo unificado de errores y éxito
 * - Comunicación con componentes padre
 */
export const usePropertyEditTabs = ({
  onUpdateBasic,
  onUpdateDescriptions,
  onUpdateImages,
  onUpdateVideo,
  onClose,
  onRefresh,
  setFormData,
}) => {
  // Estados principales
  const [currentTab, setCurrentTab] = useState(TAB_CONFIG.BASIC_DATA);
  const [tabStates, setTabStates] = useState({
    [TAB_CONFIG.BASIC_DATA]: { loading: false, error: null },
    [TAB_CONFIG.DESCRIPTIONS]: { loading: false, error: null },
    [TAB_CONFIG.IMAGES]: { loading: false, error: null },
    [TAB_CONFIG.VIDEO]: { loading: false, error: null },
  });

  // Referencias para control de lifecycle
  const mountedRef = useRef(true);
  const operationInProgressRef = useRef(false);

  // ✅ Cleanup al desmontarse
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // ✅ Función para actualizar estado de un tab específico
  const updateTabState = useCallback((tabIndex, updates) => {
    if (!mountedRef.current) return;

    setTabStates((prev) => ({
      ...prev,
      [tabIndex]: {
        ...prev[tabIndex],
        ...updates,
      },
    }));
  }, []);

  // ✅ Función para limpiar error de un tab
  const clearTabError = useCallback(
    (tabIndex) => {
      updateTabState(tabIndex, { error: null });
    },
    [updateTabState]
  );

  // ✅ Función para limpiar todos los errores
  const clearAllErrors = useCallback(() => {
    Object.keys(tabStates).forEach((tabIndex) => {
      if (tabStates[tabIndex].error) {
        updateTabState(parseInt(tabIndex), { error: null });
      }
    });
  }, [tabStates, updateTabState]);

  // ✅ Función para mostrar éxito y cerrar modal
  const showSuccessAndClose = useCallback(
    (message) => {
      // ✅ SOLUCIÓN: No verificar mountedRef - las funciones del padre siguen siendo válidas
      // Dejar que el componente padre maneje tanto el cierre como la notificación
      if (onRefresh) {
        onRefresh(message);
      }
    },
    [onClose, onRefresh]
  );

  // ✅ Función genérica para manejar operaciones de tab
  const handleTabOperation = useCallback(
    async (tabIndex, operation, operationData, defaultSuccessMessage) => {
      if (operationInProgressRef.current) {
        console.warn("Operation already in progress, skipping...");
        return { success: false, error: "Operation already in progress" };
      }

      try {
        operationInProgressRef.current = true;
        updateTabState(tabIndex, { loading: true, error: null });

        const result = await operation(operationData);

        if (result && result.success) {
          const successMessage = result.message || defaultSuccessMessage;
          showSuccessAndClose(successMessage);
          return { success: true, data: result.data, message: successMessage };
        } else {
          const errorMessage = result?.error || "Error en la operación";
          updateTabState(tabIndex, { error: errorMessage });
          return { success: false, error: errorMessage };
        }
      } catch (error) {
        if (!mountedRef.current)
          return { success: false, error: "Component unmounted" };

        const errorMessage =
          error.message || "Error inesperado en la operación";
        updateTabState(tabIndex, { error: errorMessage });
        console.error(
          `❌ ${TAB_CONFIG.TAB_NAMES[tabIndex]} operation error:`,
          error
        );
        return { success: false, error: errorMessage };
      } finally {
        if (mountedRef.current) {
          updateTabState(tabIndex, { loading: false });
        }
        operationInProgressRef.current = false;
      }
    },
    [updateTabState, showSuccessAndClose]
  );

  // ✅ Manejadores específicos para cada tab
  const handleSaveBasic = useCallback(
    async (formData) => {
      await handleTabOperation(
        TAB_CONFIG.BASIC_DATA,
        onUpdateBasic,
        formData,
        TAB_CONFIG.DEFAULT_MESSAGES[TAB_CONFIG.BASIC_DATA]
      );
    },
    [handleTabOperation, onUpdateBasic]
  );

  const handleSaveDescriptions = useCallback(
    async (descriptions) => {
      const result = await handleTabOperation(
        TAB_CONFIG.DESCRIPTIONS,
        onUpdateDescriptions,
        descriptions,
        TAB_CONFIG.DEFAULT_MESSAGES[TAB_CONFIG.DESCRIPTIONS]
      );

      // Actualizar formData con las nuevas descripciones si la operación fue exitosa
      if (result.success && setFormData) {
        setFormData((prev) => ({ ...prev, descriptions }));
      }
    },
    [handleTabOperation, onUpdateDescriptions, setFormData]
  );

  const handleSaveImages = useCallback(
    async (mainImage, secondaryImages, imagesToDelete = []) => {
      await handleTabOperation(
        TAB_CONFIG.IMAGES,
        (data) =>
          onUpdateImages(
            data.mainImage,
            data.secondaryImages,
            data.imagesToDelete
          ),
        { mainImage, secondaryImages, imagesToDelete },
        TAB_CONFIG.DEFAULT_MESSAGES[TAB_CONFIG.IMAGES]
      );
    },
    [handleTabOperation, onUpdateImages]
  );

  const handleSaveVideo = useCallback(
    async (videoData) => {
      const result = await handleTabOperation(
        TAB_CONFIG.VIDEO,
        onUpdateVideo,
        videoData,
        TAB_CONFIG.DEFAULT_MESSAGES[TAB_CONFIG.VIDEO]
      );

      // Actualizar formData con el nuevo video si la operación fue exitosa
      if (result.success && setFormData) {
        if (videoData) {
          setFormData((prev) => ({ ...prev, videoPath: videoData.videoPath }));
        } else {
          // Video eliminado
          setFormData((prev) => ({ ...prev, videoPath: null }));
        }
      }
    },
    [handleTabOperation, onUpdateVideo, setFormData]
  );

  // ✅ Función para cambiar de tab
  const handleTabChange = useCallback((event, newValue) => {
    if (operationInProgressRef.current) {
      console.warn("Cannot change tabs while operation is in progress");
      return;
    }

    setCurrentTab(newValue);
    console.log(
      `🔄 Switched to tab ${newValue} (${TAB_CONFIG.TAB_NAMES[newValue]})`
    );
  }, []);

  // ✅ Función para ir a un tab específico
  const goToTab = useCallback((tabIndex) => {
    if (tabIndex >= 0 && tabIndex <= 3 && !operationInProgressRef.current) {
      setCurrentTab(tabIndex);
    }
  }, []);

  // ✅ Funciones de utilidad
  const getTabState = useCallback(
    (tabIndex) => {
      return tabStates[tabIndex] || { loading: false, error: null };
    },
    [tabStates]
  );

  const isAnyTabLoading = useCallback(() => {
    return Object.values(tabStates).some((state) => state.loading);
  }, [tabStates]);

  const hasAnyErrors = useCallback(() => {
    return Object.values(tabStates).some((state) => state.error);
  }, [tabStates]);

  const getTabsWithErrors = useCallback(() => {
    return Object.entries(tabStates)
      .filter(([_, state]) => state.error)
      .map(([tabIndex, _]) => parseInt(tabIndex));
  }, [tabStates]);

  // ✅ Función de debugging
  const debugState = useCallback(() => {
    console.group("🔍 PropertyEditTabs Debug");
    console.log(
      "Current Tab:",
      `${currentTab} (${TAB_CONFIG.TAB_NAMES[currentTab]})`
    );
    console.log(
      "Tab States:",
      Object.fromEntries(
        Object.entries(tabStates).map(([tabIndex, state]) => [
          `${tabIndex} (${TAB_CONFIG.TAB_NAMES[tabIndex]})`,
          state,
        ])
      )
    );
    console.log("Operation in Progress:", operationInProgressRef.current);
    console.log("Any Loading:", isAnyTabLoading());
    console.log("Any Errors:", hasAnyErrors());
    console.log("Tabs with Errors:", getTabsWithErrors());
    console.groupEnd();
  }, [currentTab, tabStates, isAnyTabLoading, hasAnyErrors, getTabsWithErrors]);

  // ✅ Return del hook
  return {
    // Estado actual
    currentTab,
    tabStates,

    // Manejadores de tabs
    handleTabChange,
    goToTab,

    // Manejadores de operaciones
    handleSaveBasic,
    handleSaveDescriptions,
    handleSaveImages,
    handleSaveVideo,

    // Manejadores de errores
    clearTabError,
    clearAllErrors,

    // Funciones de utilidad
    getTabState,
    isAnyTabLoading,
    hasAnyErrors,
    getTabsWithErrors,

    // Información de configuración
    tabConfig: TAB_CONFIG,

    // Estado de operación
    operationInProgress: operationInProgressRef.current,

    // Debugging
    debugState,

    // Helpers para componentes
    getTabLoading: (tabIndex) => tabStates[tabIndex]?.loading || false,
    getTabError: (tabIndex) => tabStates[tabIndex]?.error || null,
  };
};
