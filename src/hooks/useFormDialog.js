import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { FORM_TYPES } from "../app/admin/properties/constants";
import { useEntityData, useGlobalEntityState } from "./useGlobalEntityState";
import { useImageHandling } from "./useImageHandling";
import { useMultiStepProperty } from "./useMultiStepProperty";
import { useMultiStepPropertyEdit } from "./useMultiStepPropertyEdit";
import { api } from "../services/api";
import {
  getInitialDataForFormType,
  getFieldsForFormType,
  getFieldSectionsForFormType,
  getBasicPropertySections,
} from "../app/admin/properties/components/fieldsConfig";

// ✅ Configuración para tipos de formulario
const FORM_CONFIG = {
  SIMPLE_FORMS: [FORM_TYPES.DEVELOPER, FORM_TYPES.DEVELOPMENT],
  PROPERTY_FORMS: [
    FORM_TYPES.PROPERTY_NOT_PUBLISHED,
    FORM_TYPES.PROPERTY_PUBLISHED,
    FORM_TYPES.PROPERTY_MINKAASA_UNPUBLISHED,
    FORM_TYPES.PROPERTY_MINKAASA_PUBLISHED,
  ],
  MINKAASA_FORMS: [
    FORM_TYPES.PROPERTY_MINKAASA_UNPUBLISHED,
    FORM_TYPES.PROPERTY_MINKAASA_PUBLISHED,
  ],
};

// ✅ Utilidades para determinar tipos de formulario
const FormUtils = {
  isSimpleForm: (formType) => FORM_CONFIG.SIMPLE_FORMS.includes(formType),
  isPropertyForm: (formType) => FORM_CONFIG.PROPERTY_FORMS.includes(formType),
  isMinkaasaForm: (formType) => FORM_CONFIG.MINKAASA_FORMS.includes(formType),
  isCreationMode: (currentItem) => !currentItem,
  isEditMode: (currentItem) => !!currentItem,

  getDialogTitle: (formType, isEditing, entityLabels) => {
    const entityLabel = entityLabels[formType]?.singular || "Elemento";
    if (formType === FORM_TYPES.PROPERTY_PUBLISHED) {
      return `Ver ${entityLabel}`;
    }
    return isEditing ? `Editar ${entityLabel}` : `Agregar ${entityLabel}`;
  },

  getCurrentItemId: (currentItem, formType) => {
    if (!currentItem) return null;

    switch (formType) {
      case FORM_TYPES.DEVELOPER:
        return currentItem.realEstateDevelopmentId || currentItem.id;
      case FORM_TYPES.DEVELOPMENT:
        return currentItem.developmentId || currentItem.id;
      case FORM_TYPES.PROPERTY_NOT_PUBLISHED:
      case FORM_TYPES.PROPERTY_PUBLISHED:
      case FORM_TYPES.PROPERTY_MINKAASA_UNPUBLISHED:
      case FORM_TYPES.PROPERTY_MINKAASA_PUBLISHED:
        return (
          currentItem.prototypeId || currentItem.propertyId || currentItem.id
        );
      default:
        return currentItem.id;
    }
  },
};

/**
 * ✅ Hook personalizado para manejar toda la lógica de FormDialog
 *
 * Responsabilidades:
 * - Gestión de estado del formulario
 * - Carga de datos iniciales
 * - Validación y manejo de errores
 * - Integración con hooks multi-step
 * - Manejo de imágenes
 * - Operaciones CRUD
 */
export const useFormDialog = ({
  open,
  formType,
  currentItem,
  onClose,
  onRefreshData,
  entityLabels = {},
}) => {
  // Estados principales
  const [formData, setFormData] = useState({});
  const [fieldErrors, setFieldErrors] = useState([]);
  const [selectOptions, setSelectOptions] = useState({});
  const [loadingOptions, setLoadingOptions] = useState({});
  const [isLoadingInitialData, setIsLoadingInitialData] = useState(false);
  const [showConfirmClose, setShowConfirmClose] = useState(false);
  const [error, setError] = useState(null);

  // Referencias para control de lifecycle
  const mountedRef = useRef(true);
  const loadingTimeoutRef = useRef(null);

  // ✅ Determinar características del formulario
  const formCharacteristics = useMemo(
    () => ({
      isSimpleForm: FormUtils.isSimpleForm(formType),
      isPropertyForm: FormUtils.isPropertyForm(formType),
      isMinkaasaForm: FormUtils.isMinkaasaForm(formType),
      isCreationMode: FormUtils.isCreationMode(currentItem),
      isEditMode: FormUtils.isEditMode(currentItem),
      currentItemId: FormUtils.getCurrentItemId(currentItem, formType),
    }),
    [formType, currentItem]
  );

  // ✅ Hooks especializados
  const {
    loading: loadingImages,
    error: imageError,
    loadPropertyImages,
    loadDevelopmentImages,
    createImagePreview,
    createImagesPreview,
  } = useImageHandling();

  const {
    items: availableEntities,
    loading: loadingEntities,
    error: entitiesError,
    getItemDetails,
  } = useEntityData(formType);

  // Hooks multi-step (solo para propiedades)
  const multiStepCreate = useMultiStepProperty();
  const multiStepEdit = useMultiStepPropertyEdit(
    formCharacteristics.currentItemId,
    formType
  );

  // ✅ Cleanup al desmontarse
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, []);

  // ✅ Obtener secciones de campos
  const fieldSections = useMemo(() => {
    if (!formCharacteristics.isPropertyForm) {
      return getFieldSectionsForFormType(formType);
    }

    // Para edición de propiedades: no mostrar campos individuales (se usan tabs)
    if (formCharacteristics.isEditMode) {
      return [];
    }

    // Para creación de propiedades: mostrar campos según el paso de creación
    if (multiStepCreate.currentStep === 1) {
      return getBasicPropertySections(formType);
    } else {
      // Pasos 2 y 3: sin campos (se manejan por separado)
      return [];
    }
  }, [
    formType,
    formCharacteristics.isPropertyForm,
    formCharacteristics.isEditMode,
    multiStepCreate.currentStep,
  ]);

  // ✅ Cargar opciones de campos select
  const loadOptionsForField = useCallback(async (field) => {
    if (!field.endpoint || field.type !== "select") return;

    try {
      setLoadingOptions((prev) => ({ ...prev, [field.name]: true }));

      let options = [];

      // Mapeo de endpoints
      switch (field.endpoint) {
        case "/nameType":
          options = await api.getNameTypeProperty();
          break;
        case "/development/basic":
          const response = await api.getDevelopmentsBasic();
          options = response?.data || [];
          break;
        case "/realEstateDevelopment":
          const devResponse = await api.getDevelopers(1, 10);
          options = devResponse?.data || [];
          break;
        default:
          options = await api.getFieldOptions(field.endpoint);
          break;
      }

      setSelectOptions((prev) => ({ ...prev, [field.name]: options }));
    } catch (error) {
      console.error(`Error loading options for ${field.label}:`, error);
      setError(`Error al cargar opciones para ${field.label}`);
    } finally {
      setLoadingOptions((prev) => ({ ...prev, [field.name]: false }));
    }
  }, []);

  // ✅ Inicializar formData según el tipo de formulario
  useEffect(() => {
    if (!open) return;

    const initialData = getInitialDataForFormType(formType);

    if (!currentItem) {
      setFormData(initialData);
    }
  }, [open, formType, currentItem]);

  // ✅ Inicializar nueva creación de propiedad
  useEffect(() => {
    if (!open || currentItem) return;

    if (formCharacteristics.isPropertyForm) {
      multiStepCreate.initializeNewCreation();
    }
  }, [open, currentItem, formCharacteristics.isPropertyForm, multiStepCreate]);

  // ✅ Cargar opciones de campos cuando se abre el diálogo
  useEffect(() => {
    if (!open) return;

    const loadFieldOptions = async () => {
      const sections = getFieldSectionsForFormType(formType);
      const allFields = sections.flatMap((section) => section.fields);
      const selectFields = allFields.filter(
        (field) => field.type === "select" && field.endpoint
      );

      if (selectFields.length > 0) {
        await Promise.all(
          selectFields.map((field) => loadOptionsForField(field))
        );
      }
    };

    loadFieldOptions();
  }, [open, formType, loadOptionsForField]);

  // ✅ Cargar datos iniciales cuando se edita un item
  useEffect(() => {
    const currentItemId = formCharacteristics.currentItemId;
    const isPropertyForm = formCharacteristics.isPropertyForm;
    const isMinkaasaForm = formCharacteristics.isMinkaasaForm;

    if (!open || !currentItemId) return;

    let isCancelled = false;

    const loadInitialData = async () => {
      try {
        if (isCancelled) return;
        setIsLoadingInitialData(true);

        const details = await getItemDetails(currentItemId);

        if (isCancelled || !details) {
          if (!details) {
            setError("No se pudieron cargar los detalles del elemento");
          }
          return;
        }

        // Procesar datos según el tipo
        let processedData = { ...details };

        // Mapear nameTypeId a propertyTypeId para propiedades
        if (isPropertyForm && details.nameTypeId) {
          processedData.propertyTypeId = details.nameTypeId;
        }

        // Procesar datos de propiedades Minkaasa
        if (isMinkaasaForm && details.externalAgreement) {
          const externalAgreementData = details.externalAgreement;
          const descriptionsData = details.descriptions || [];

          processedData = {
            ...processedData,
            name: externalAgreementData.name || "",
            lastNameP: externalAgreementData.lastNameP || "",
            lastNameM: externalAgreementData.lastNameM || "",
            mainEmail: externalAgreementData.mainEmail || "",
            mainPhone: externalAgreementData.mainPhone || "",
            agent: externalAgreementData.agent || "",
            commission: externalAgreementData.commission || 0,
            // Campos de ubicación desde el body principal
            condominium: details.condominium || "",
            street: details.street || "",
            exteriorNumber: details.exteriorNumber || "",
            interiorNumber: details.interiorNumber || "",
            suburb: details.suburb || "",
            city: details.city || "",
            state: details.state || "",
            zipCode: details.zipCode || "",
            descriptions: descriptionsData,
            videoPath: details.videoPath || null,
          };
        } else if (isPropertyForm) {
          processedData = {
            ...processedData,
            descriptions: details.descriptions || [],
            videoPath: details.videoPath || null,
          };
        }

        if (isCancelled) return;

        setFormData(processedData);

        // Cargar imágenes si es necesario
        if (isPropertyForm) {
          const updatedDetails = await loadPropertyImages(processedData);
          if (!isCancelled) {
            setFormData((prev) => ({
              ...prev,
              ...updatedDetails,
              videoPath: processedData.videoPath || null,
            }));
          }
        } else if (formType === FORM_TYPES.DEVELOPMENT) {
          await loadDevelopmentImages(processedData);
        }
      } catch (error) {
        if (!isCancelled) {
          console.error("Error loading initial data:", error);
          setError("Error al cargar los datos. Por favor, inténtalo de nuevo.");
        }
      } finally {
        if (!isCancelled) {
          setIsLoadingInitialData(false);
        }
      }
    };

    loadInitialData();

    // Cleanup function para cancelar operación si el componente se desmonta
    return () => {
      isCancelled = true;
    };
  }, [
    open,
    formCharacteristics.currentItemId,
    formType,
    getItemDetails,
    loadPropertyImages,
    loadDevelopmentImages,
  ]); // Eliminé las dependencias problemáticas de formCharacteristics

  // ✅ Manejar errores de los hooks
  useEffect(() => {
    const currentError =
      imageError ||
      entitiesError ||
      multiStepCreate.error ||
      multiStepEdit.error;
    if (currentError) {
      setError(currentError);
    }
  }, [imageError, entitiesError, multiStepCreate.error, multiStepEdit.error]);

  // ✅ Actualizar fieldErrors cuando hay errores en los campos
  useEffect(() => {
    if (error) {
      try {
        if (typeof error === "string" && error.trim().startsWith("{")) {
          const errorObj = JSON.parse(error);
          if (errorObj?.fieldErrors && Array.isArray(errorObj.fieldErrors)) {
            setFieldErrors(errorObj.fieldErrors);
          }
        } else if (typeof error === "object" && error.fieldErrors) {
          setFieldErrors(error.fieldErrors);
        }
      } catch (e) {
        // Error no es JSON válido, continuar sin fieldErrors
      }
    } else {
      setFieldErrors([]);
    }
  }, [error]);

  // ✅ Inicializar formData.descriptions si no existe (solo una vez al abrir)
  useEffect(() => {
    if (!open) return;

    setFormData((prev) => {
      // Solo actualizar si no existe descriptions
      if (!prev || !prev.descriptions) {
        return {
          ...prev,
          descriptions: [],
        };
      }
      return prev;
    });
  }, [open]); // Solo depende de 'open', no de 'formData'

  // ✅ Manejadores de cambios en los campos
  const handleFieldChange = useCallback((fieldName, value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  }, []);

  const handleImageChange = useCallback((fieldName, file) => {
    if (!file) return;
    setFormData((prev) => ({
      ...prev,
      [fieldName]: file,
    }));
  }, []);

  const handleImagesChange = useCallback((fieldName, files) => {
    if (!files || !files.length) return;
    setFormData((prev) => ({
      ...prev,
      [fieldName]: files,
    }));
  }, []);

  const handleImageDelete = useCallback((fieldName) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: null,
    }));
  }, []);

  const handleImageDeleteFromGallery = useCallback((fieldName, index) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: prev[fieldName].filter((_, i) => i !== index),
    }));
  }, []);

  // ✅ Manejadores de imágenes específicos
  const handleMainImageChange = useCallback(
    (file) => {
      if (file) {
        setFormData({
          ...formData,
          mainImage: file,
          mainImagePreview: createImagePreview(file),
        });
      }
    },
    [formData, createImagePreview]
  );

  const handleSecondaryImagesChange = useCallback(
    (files) => {
      if (files && files.length > 0) {
        const filesArray = Array.from(files);
        setFormData({
          ...formData,
          secondaryImages: filesArray,
          secondaryImagesPreview: createImagesPreview(filesArray),
        });
      }
    },
    [formData, createImagesPreview]
  );

  // ✅ Determinar si está cargando
  const isLoading = useMemo(() => {
    return (
      loadingImages ||
      loadingEntities ||
      multiStepCreate.loading ||
      multiStepEdit.loading ||
      Object.values(loadingOptions).some((loading) => loading === true) ||
      isLoadingInitialData
    );
  }, [
    loadingImages,
    loadingEntities,
    multiStepCreate.loading,
    multiStepEdit.loading,
    loadingOptions,
    isLoadingInitialData,
  ]);

  // ✅ Función para cerrar el diálogo
  const handleCloseAttempt = useCallback(() => {
    if (
      formCharacteristics.isPropertyForm &&
      formCharacteristics.isCreationMode &&
      multiStepCreate.isInCreationProcess()
    ) {
      setShowConfirmClose(true);
    } else {
      onClose();
    }
  }, [formCharacteristics, multiStepCreate, onClose]);

  const handleForceClose = useCallback(() => {
    if (
      formCharacteristics.isPropertyForm &&
      formCharacteristics.isCreationMode
    ) {
      multiStepCreate.clearCreationData();
    }
    onClose();
  }, [formCharacteristics, multiStepCreate, onClose]);

  const handleConfirmClose = useCallback(() => {
    setShowConfirmClose(false);
    handleForceClose();
  }, [handleForceClose]);

  // ✅ Obtener el título del diálogo
  const getDialogTitle = useCallback(() => {
    return FormUtils.getDialogTitle(
      formType,
      formCharacteristics.isEditMode,
      entityLabels
    );
  }, [formType, formCharacteristics.isEditMode, entityLabels]);

  // ✅ Ejecutar cleanup cuando se cierra el diálogo
  useEffect(() => {
    if (!open) {
      setFormData({});
      setFieldErrors([]);
      setSelectOptions({});
      setLoadingOptions({});
      setError(null);
      setShowConfirmClose(false);
      setIsLoadingInitialData(false);

      // Limpiar errores de hooks multi-step sin dependencias circulares
      if (multiStepCreate.setError) {
        multiStepCreate.setError(null);
      }
      if (multiStepEdit.setError) {
        multiStepEdit.setError(null);
      }
    }
  }, [open]); // Solo depende de 'open', no de los objetos hook

  // ✅ Return del hook
  return {
    // Estado del formulario
    formData,
    setFormData,
    fieldErrors,
    selectOptions,
    loadingOptions,
    isLoadingInitialData,
    error,
    setError,
    isLoading,

    // Características del formulario
    formCharacteristics,

    // Secciones de campos
    fieldSections,

    // Hooks especializados
    multiStepCreate,
    multiStepEdit,

    // Manejadores de eventos
    handleFieldChange,
    handleImageChange,
    handleImagesChange,
    handleImageDelete,
    handleImageDeleteFromGallery,
    handleMainImageChange,
    handleSecondaryImagesChange,

    // Manejadores de diálogo
    handleCloseAttempt,
    handleForceClose,
    handleConfirmClose,
    getDialogTitle,
    showConfirmClose,
    setShowConfirmClose,

    // Funciones de utilidad
    loadOptionsForField,

    // Props para componentes internos
    availableEntities,
    currentItemId: formCharacteristics.currentItemId,

    // Funciones para refresh
    onRefreshData,

    // Funciones de debugging
    debugState: () => {
      console.group("🔍 FormDialog Debug");
      console.log("Form Type:", formType);
      console.log("Form Characteristics:", formCharacteristics);
      console.log("Form Data Keys:", Object.keys(formData));
      console.log("Loading States:", {
        isLoading,
        loadingImages,
        loadingEntities,
        multiStepLoading: multiStepCreate.loading,
        editLoading: multiStepEdit.loading,
      });
      console.log("Error States:", {
        error,
        imageError,
        entitiesError,
        multiStepError: multiStepCreate.error,
        editError: multiStepEdit.error,
      });
      if (formCharacteristics.isPropertyForm) {
        if (formCharacteristics.isCreationMode) {
          multiStepCreate.debugState();
        } else {
          multiStepEdit.debugState();
        }
      }
      console.groupEnd();
    },
  };
};
