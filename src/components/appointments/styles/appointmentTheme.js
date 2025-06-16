// Tema centralizado para los componentes de citas
export const appointmentTheme = {
  colors: {
    primary: "#f6c842",
    primaryHover: "#e6a828",
    primaryLight: "#f0b92b",
    secondary: "#2d3748",
    success: "#16a085", // Verde azulado más sofisticado
    successLight: "#ffffff", // Fondo blanco puro para máxima elegancia
    successBorder: "#16a085", // Mismo verde para consistencia
    background: {
      gradient:
        "linear-gradient(135deg, #fffdf7 0%, #fefcf3 50%, #fdf9e8 100%)",
      selected: "rgba(246, 200, 66, 0.08)",
      selectedHover: "rgba(246, 200, 66, 0.12)",
      normal: "rgba(255, 255, 255, 0.9)",
      normalHover: "rgba(246, 200, 66, 0.05)",
      completed: "rgba(255, 255, 255, 1)", // Fondo blanco puro
      completedHover: "rgba(22, 160, 133, 0.02)", // Apenas perceptible al hover
    },
    text: {
      primary: "#2d3748",
      secondary: "#64748b",
    },
  },

  borders: {
    selected: "2px solid #f6c842",
    normal: "2px solid #f0b92b",
    selectedMd: "3px solid #f6c842",
    normalMd: "3px solid #f0b92b",
    completed: "2px solid #16a085",
    completedMd: "3px solid #16a085",
  },

  shadows: {
    normal: {
      xs: "0 4px 15px rgba(240, 185, 43, 0.1)",
      md: "0 8px 25px rgba(240, 185, 43, 0.15)",
    },
    selected: {
      xs: "0 4px 15px rgba(246, 200, 66, 0.2)",
      md: "0 8px 25px rgba(246, 200, 66, 0.25)",
    },
    completed: {
      xs: "0 2px 8px rgba(22, 160, 133, 0.08)", // Sombra muy sutil
      md: "0 4px 12px rgba(22, 160, 133, 0.10)", // Sombra muy sutil
    },
    button: "0 4px 15px rgba(240, 185, 43, 0.3)",
    buttonHover: "0 6px 20px rgba(240, 185, 43, 0.4)",
  },

  borderRadius: {
    xs: 2,
    md: 3,
  },

  padding: {
    xs: 2.5,
    md: 4,
  },

  transitions: {
    all: "all 0.4s ease",
    fast: "all 0.3s ease",
    transform: "transform 0.2s ease, box-shadow 0.2s ease",
  },

  animations: {
    slideIn: {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: "4px",
      background: "linear-gradient(90deg, #f6c842 0%, #f0b92b 100%)",
      animation: "slideIn 0.5s ease-out",
      "@keyframes slideIn": {
        "0%": { transform: "translateX(-100%)" },
        "100%": { transform: "translateX(0%)" },
      },
    },
    completedSlideIn: {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: "4px",
      background: "linear-gradient(90deg, #16a085 0%, #16a085 100%)", // Color uniforme más elegante
      animation: "completedSlideIn 0.6s ease-out",
      "@keyframes completedSlideIn": {
        "0%": { transform: "translateX(-100%)", opacity: 0 },
        "50%": { opacity: 1 },
        "100%": { transform: "translateX(0%)", opacity: 1 },
      },
    },
    fieldComplete: {
      animation: "fieldComplete 0.4s ease-out",
      "@keyframes fieldComplete": {
        "0%": { transform: "scale(1)" },
        "50%": { transform: "scale(1.02)" },
        "100%": { transform: "scale(1)" },
      },
    },
  },
};

// Funciones helper para generar estilos comunes
export const getFieldContainerStyle = (isSelected, isCompleted = false) => ({
  p: { xs: appointmentTheme.padding.xs, md: appointmentTheme.padding.md },
  borderRadius: {
    xs: appointmentTheme.borderRadius.xs,
    md: appointmentTheme.borderRadius.md,
  },
  border: {
    xs: isCompleted
      ? appointmentTheme.borders.completed
      : isSelected
      ? appointmentTheme.borders.selected
      : appointmentTheme.borders.normal,
    md: isCompleted
      ? appointmentTheme.borders.completedMd
      : isSelected
      ? appointmentTheme.borders.selectedMd
      : appointmentTheme.borders.normalMd,
  },
  backgroundColor: isCompleted
    ? appointmentTheme.colors.background.completed
    : isSelected
    ? appointmentTheme.colors.background.selected
    : appointmentTheme.colors.background.normal,
  transition: appointmentTheme.transitions.all,
  cursor: "pointer",
  position: "relative",
  overflow: "hidden",
  "&:hover": {
    borderColor: isCompleted
      ? appointmentTheme.colors.successBorder
      : isSelected
      ? appointmentTheme.colors.primaryHover
      : appointmentTheme.colors.primary,
    backgroundColor: isCompleted
      ? appointmentTheme.colors.background.completedHover
      : isSelected
      ? appointmentTheme.colors.background.selectedHover
      : appointmentTheme.colors.background.normalHover,
    transform: { xs: "none", md: "translateY(-2px)" },
    boxShadow: isCompleted
      ? appointmentTheme.shadows.completed
      : isSelected
      ? appointmentTheme.shadows.selected
      : appointmentTheme.shadows.normal,
  },
  "&::before": isCompleted
    ? appointmentTheme.animations.completedSlideIn
    : isSelected
    ? appointmentTheme.animations.slideIn
    : {},
  ...(isCompleted ? appointmentTheme.animations.fieldComplete : {}),
});

export const getTextFieldStyle = (isCompleted = false, hasValue = false) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: 2,
    backgroundColor: isCompleted
      ? appointmentTheme.colors.successLight
      : "rgba(255, 255, 255, 0.8)",
    transition: appointmentTheme.transitions.fast,
    "&:hover fieldset": {
      borderColor: isCompleted
        ? appointmentTheme.colors.successBorder
        : "primary.main",
    },
    "&.Mui-focused fieldset": {
      borderColor: isCompleted
        ? appointmentTheme.colors.successBorder
        : "primary.main",
      borderWidth: 2,
    },
    "& fieldset": {
      borderColor: isCompleted
        ? appointmentTheme.colors.successBorder
        : hasValue
        ? appointmentTheme.colors.primary
        : "rgba(0, 0, 0, 0.23)",
      transition: appointmentTheme.transitions.fast,
    },
    ...(isCompleted
      ? {
          animation: "fieldFillSuccess 0.5s ease-out",
          "@keyframes fieldFillSuccess": {
            "0%": {
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              transform: "scale(1)",
            },
            "50%": {
              backgroundColor: appointmentTheme.colors.successLight,
              transform: "scale(1.01)",
            },
            "100%": {
              backgroundColor: appointmentTheme.colors.successLight,
              transform: "scale(1)",
            },
          },
        }
      : {}),
  },
  "& .MuiInputLabel-root": {
    color: isCompleted
      ? appointmentTheme.colors.success
      : hasValue
      ? appointmentTheme.colors.primary
      : "text.secondary",
    fontWeight: isCompleted ? 600 : 500,
    transition: appointmentTheme.transitions.fast,
  },
  "& .MuiInputAdornment-root .MuiSvgIcon-root": {
    color: isCompleted
      ? appointmentTheme.colors.success
      : hasValue
      ? appointmentTheme.colors.primary
      : "rgba(0, 0, 0, 0.54)",
    transition: appointmentTheme.transitions.fast,
  },
});

export const getButtonStyle = () => ({
  bgcolor: appointmentTheme.colors.primary,
  color: appointmentTheme.colors.secondary,
  px: 4,
  py: 1.5,
  borderRadius: 2,
  fontWeight: 600,
  boxShadow: appointmentTheme.shadows.button,
  "&:hover": {
    bgcolor: appointmentTheme.colors.primaryHover,
    transform: "translateY(-2px)",
    boxShadow: appointmentTheme.shadows.buttonHover,
  },
  "&:disabled": {
    bgcolor: "grey.300",
    color: "grey.500",
    transform: "none",
    boxShadow: "none",
  },
  transition: appointmentTheme.transitions.fast,
});
