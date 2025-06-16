import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { useAppointments } from "../../hooks/useAppointments";
import { useAppointmentForm } from "../../hooks/useAppointmentForm";
import { getButtonStyle, appointmentTheme } from "./styles/appointmentTheme";
import DateTimeStep from "./steps/DateTimeStep";
import PersonalInfoStep from "./steps/PersonalInfoStep";
import ConfirmationStep from "./steps/ConfirmationStep";
import SuccessStep from "./steps/SuccessStep";

const steps = [
  "Seleccionar Fecha y Hora",
  "Información Personal",
  "Confirmación",
];

const AppointmentScheduler = ({
  prototypeId = null,
  propertyName = "",
  propertyData = null,
  onSuccess = () => {},
  onCancel = () => {},
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { createAppointment, loading, error } = useAppointments();
  const {
    activeStep,
    selectedDate,
    selectedTime,
    formData,
    appointmentCreated,
    isStep1Valid,
    isStep2Valid,
    handleNext,
    handleBack,
    handleInputChange,
    setSelectedDate,
    setSelectedTime,
    setAppointmentCreated,
    formatDateTime,
    buildAppointmentData,
  } = useAppointmentForm();

  const handleSubmit = async () => {
    const appointmentData = buildAppointmentData(
      prototypeId,
      propertyName,
      propertyData
    );
    if (!appointmentData) return;

    try {
      const result = await createAppointment(appointmentData);
      setAppointmentCreated(result);
      handleNext();
    } catch (err) {
      // Error ya manejado por el hook
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <DateTimeStep
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onDateChange={setSelectedDate}
            onTimeChange={setSelectedTime}
          />
        );
      case 1:
        return (
          <PersonalInfoStep
            formData={formData}
            onInputChange={handleInputChange}
            isValid={isStep2Valid}
          />
        );
      case 2:
        return (
          <ConfirmationStep
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            formData={formData}
            propertyName={propertyName}
            formatDateTime={formatDateTime}
          />
        );
      case 3:
        return (
          <SuccessStep
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            propertyName={propertyName}
            appointmentCreated={appointmentCreated}
            onSuccess={onSuccess}
            formatDateTime={formatDateTime}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Card
      elevation={0}
      sx={{
        maxWidth: { xs: "100%", sm: 600, md: 800 },
        mx: "auto",
        borderRadius: 0,
        boxShadow: "none",
        border: "none",
        background: "transparent",
        overflow: "visible",
        minHeight: { xs: "100%", md: "auto" },
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
        {/* Header minimalista */}
        <Box sx={{ textAlign: "center", mb: { xs: 3, md: 5 } }}>
          <Typography
            variant="h4"
            sx={{
              fontSize: { xs: "1.5rem", sm: "1.8rem", md: "2.2rem" },
              background: `linear-gradient(135deg, ${appointmentTheme.colors.primary} 0%, ${appointmentTheme.colors.primaryHover} 100%)`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontWeight: 700,
              mb: { xs: 1, md: 2 },
              letterSpacing: "-0.01em",
              px: { xs: 1, md: 0 },
            }}
          >
            Agenda una visita
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: appointmentTheme.colors.text.primary,
              fontSize: { xs: "0.9rem", md: "1rem" },
              maxWidth: 500,
              mx: "auto",
              lineHeight: 1.5,
              px: { xs: 2, md: 0 },
            }}
          >
            {isMobile
              ? "1. Fecha, 2. Email, 3. Confirmar"
              : "Solo necesitamos algunos detalles para coordinar tu visita perfecta"}
          </Typography>
        </Box>

        {/* Stepper */}
        {activeStep < 3 && (
          <Stepper
            activeStep={activeStep}
            sx={{
              mb: { xs: 3, md: 4 },
              "& .MuiStepLabel-label": {
                fontSize: { xs: "0.9rem", sm: "1rem", md: "1.1rem" },
                fontWeight: { xs: 600, md: 500 },
                color: "text.primary",
                mt: { xs: 1, md: 0.5 },
                display: { xs: "none", sm: "block" },
              },
              "& .MuiStepIcon-root": {
                fontSize: { xs: "1.8rem", sm: "2rem", md: "2.2rem" },
                "&.Mui-active": {
                  color: appointmentTheme.colors.primary,
                },
                "&.Mui-completed": {
                  color: appointmentTheme.colors.success,
                },
              },
              "& .MuiStepConnector-line": {
                borderTopWidth: { xs: 2, md: 3 },
              },
              "& .MuiStep-root": {
                px: { xs: 0.5, md: 1 },
              },
            }}
          >
            {steps.map((label, index) => (
              <Step key={index}>
                <StepLabel
                  sx={{
                    "& .MuiStepLabel-labelContainer": {
                      maxWidth: { xs: "80px", sm: "120px", md: "none" },
                    },
                  }}
                >
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        )}

        {/* Error Display */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Step Content */}
        <Box sx={{ mb: { xs: 3, md: 4 } }}>{renderStepContent()}</Box>

        {/* Navigation Buttons */}
        {activeStep < 3 && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 4,
              pt: 3,
              borderTop: `1px solid ${appointmentTheme.colors.primary}`,
            }}
          >
            <Button
              onClick={activeStep === 0 ? onCancel : handleBack}
              startIcon={<ArrowBack />}
              sx={{
                color: appointmentTheme.colors.text.primary,
                px: 3,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 500,
                "&:hover": {
                  backgroundColor: appointmentTheme.colors.background.selected,
                },
              }}
            >
              {activeStep === 0 ? "Cancelar" : "Anterior"}
            </Button>

            <Button
              variant="contained"
              onClick={activeStep === 2 ? handleSubmit : handleNext}
              disabled={
                loading ||
                (activeStep === 0 && !isStep1Valid) ||
                (activeStep === 1 && !isStep2Valid)
              }
              endIcon={
                loading ? <CircularProgress size={20} /> : <ArrowForward />
              }
              sx={getButtonStyle()}
            >
              {loading
                ? "Creando..."
                : activeStep === 2
                ? "Confirmar Visita"
                : "Siguiente"}
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default AppointmentScheduler;
