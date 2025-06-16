import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  TextField,
  Fade,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
} from "@mui/material";
import {
  CalendarToday,
  AccessTime,
  Check,
  ChevronLeft,
  ChevronRight,
} from "@mui/icons-material";
import {
  getFieldContainerStyle,
  getTextFieldStyle,
  appointmentTheme,
} from "../styles/appointmentTheme";

const DateTimeStep = ({
  selectedDate,
  selectedTime,
  onDateChange,
  onTimeChange,
}) => {
  const [timeDialogOpen, setTimeDialogOpen] = useState(false);
  const [tempSelectedTime, setTempSelectedTime] = useState(selectedTime || "");
  const [dateDialogOpen, setDateDialogOpen] = useState(false);
  const [tempSelectedDate, setTempSelectedDate] = useState(selectedDate || "");

  // Generar horarios disponibles de 9:00 a 18:00 cada 30 minutos
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 18; hour++) {
      for (let minutes = 0; minutes < 60; minutes += 30) {
        if (hour === 18 && minutes > 0) break; // No generar 18:30
        const timeString = `${hour.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}`;
        slots.push(timeString);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const formatTime = (time) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const period = hour >= 12 ? "PM" : "AM";
    const hour12 = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${hour12}:${minutes} ${period}`;
  };

  const handleTimeDialogOpen = () => {
    setTempSelectedTime(selectedTime || "");
    setTimeDialogOpen(true);
  };

  const handleTimeDialogClose = () => {
    setTimeDialogOpen(false);
    setTempSelectedTime(selectedTime || "");
  };

  const handleTimeConfirm = () => {
    onTimeChange(tempSelectedTime);
    setTimeDialogOpen(false);
  };

  const handleDateDialogOpen = () => {
    setTempSelectedDate(selectedDate || "");
    setDateDialogOpen(true);
  };

  const handleDateDialogClose = () => {
    setDateDialogOpen(false);
    setTempSelectedDate(selectedDate || "");
  };

  const handleDateConfirm = () => {
    onDateChange(tempSelectedDate);
    setDateDialogOpen(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const [currentMonth, setCurrentMonth] = useState(new Date());

  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const today = new Date();
    const maxDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);

      const isCurrentMonth = date.getMonth() === month;
      const isToday = date.toDateString() === today.toDateString();
      const isPast = date < today;
      const isFuture = date > maxDate;
      const isDisabled = isPast || isFuture || !isCurrentMonth;

      days.push({
        date: date,
        day: date.getDate(),
        dateString: date.toISOString().split("T")[0],
        isCurrentMonth,
        isToday,
        isPast,
        isFuture,
        isDisabled,
      });
    }

    return days;
  };

  const calendarDays = generateCalendarDays();

  const goToPreviousMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() - 1);
    setCurrentMonth(newMonth);
  };

  const goToNextMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + 1);
    setCurrentMonth(newMonth);
  };

  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

  const getIconBoxStyle = (isSelected) => ({
    p: { xs: 1, md: 1.5 },
    borderRadius: 2,
    backgroundColor: isSelected
      ? appointmentTheme.colors.successLight
      : "rgba(255, 255, 255, 0.8)",
    mr: { xs: 1.5, md: 2 },
    transition: appointmentTheme.transitions.fast,
    boxShadow: isSelected
      ? "0 2px 12px rgba(22, 160, 133, 0.1)"
      : "0 2px 8px rgba(0, 0, 0, 0.08)",
  });

  const getHeaderStyle = () => ({
    display: "flex",
    alignItems: "center",
    mb: { xs: 2, md: 3 },
  });

  const getTitleStyle = () => ({
    fontSize: { xs: "1rem", md: "1.25rem" },
    color: appointmentTheme.colors.text.primary,
    fontWeight: 600,
  });

  return (
    <Fade in timeout={500}>
      <Box>
        <Typography
          variant="h6"
          sx={{
            mb: 3,
            color: appointmentTheme.colors.text.primary,
            fontWeight: 600,
            textAlign: "center",
          }}
        >
          ¿Cuándo te gustaría visitar la propiedad?
        </Typography>

        <Grid container spacing={{ xs: 2, md: 4 }}>
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={getFieldContainerStyle(selectedDate, !!selectedDate)}
            >
              <Box sx={getHeaderStyle()}>
                <Box sx={getIconBoxStyle(selectedDate)}>
                  <CalendarToday
                    sx={{
                      color: selectedDate
                        ? appointmentTheme.colors.success
                        : appointmentTheme.colors.primaryLight,
                      fontSize: { xs: "1.2rem", md: "1.5rem" },
                      transition: appointmentTheme.transitions.fast,
                    }}
                  />
                </Box>
                <Typography variant="h6" sx={getTitleStyle()}>
                  Seleccionar Fecha
                </Typography>
              </Box>
              <Button
                fullWidth
                variant="outlined"
                onClick={handleDateDialogOpen}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  borderColor: selectedDate
                    ? appointmentTheme.colors.success
                    : appointmentTheme.colors.primary,
                  color: selectedDate
                    ? appointmentTheme.colors.success
                    : appointmentTheme.colors.primary,
                  backgroundColor: selectedDate
                    ? appointmentTheme.colors.successLight
                    : "rgba(255, 255, 255, 0.8)",
                  fontSize: "1rem",
                  fontWeight: 500,
                  textTransform: "none",
                  textAlign: "left",
                  justifyContent: "flex-start",
                  "&:hover": {
                    borderColor: selectedDate
                      ? appointmentTheme.colors.success
                      : appointmentTheme.colors.primaryHover,
                    backgroundColor: selectedDate
                      ? "rgba(22, 160, 133, 0.02)"
                      : appointmentTheme.colors.background.normalHover,
                  },
                }}
              >
                {selectedDate ? formatDate(selectedDate) : "Seleccionar fecha"}
              </Button>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={getFieldContainerStyle(selectedTime, !!selectedTime)}
            >
              <Box sx={getHeaderStyle()}>
                <Box sx={getIconBoxStyle(selectedTime)}>
                  <AccessTime
                    sx={{
                      color: selectedTime
                        ? appointmentTheme.colors.success
                        : appointmentTheme.colors.primaryLight,
                      fontSize: { xs: "1.2rem", md: "1.5rem" },
                      transition: appointmentTheme.transitions.fast,
                    }}
                  />
                </Box>
                <Typography variant="h6" sx={getTitleStyle()}>
                  Seleccionar Hora
                </Typography>
              </Box>

              <Button
                fullWidth
                variant="outlined"
                onClick={handleTimeDialogOpen}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  borderColor: selectedTime
                    ? appointmentTheme.colors.success
                    : appointmentTheme.colors.primary,
                  color: selectedTime
                    ? appointmentTheme.colors.success
                    : appointmentTheme.colors.primary,
                  backgroundColor: selectedTime
                    ? appointmentTheme.colors.successLight
                    : "rgba(255, 255, 255, 0.8)",
                  fontSize: "1rem",
                  fontWeight: 500,
                  textTransform: "none",
                  "&:hover": {
                    borderColor: selectedTime
                      ? appointmentTheme.colors.success
                      : appointmentTheme.colors.primaryHover,
                    backgroundColor: selectedTime
                      ? "rgba(22, 160, 133, 0.02)"
                      : appointmentTheme.colors.background.normalHover,
                  },
                }}
              >
                {selectedTime ? formatTime(selectedTime) : "Seleccionar hora"}
              </Button>
            </Paper>
          </Grid>
        </Grid>

        {/* Dialog para selección de fecha */}
        <Dialog
          open={dateDialogOpen}
          onClose={handleDateDialogClose}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              px: 1,
              py: 2,
            },
          }}
        >
          <DialogTitle
            sx={{
              textAlign: "center",
              color: appointmentTheme.colors.text.primary,
              fontWeight: 600,
              pb: 1,
            }}
          >
            Selecciona una fecha
          </DialogTitle>

          <DialogContent sx={{ px: 3 }}>
            {/* Header del calendario con navegación */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
                px: 1,
              }}
            >
              <Button
                onClick={goToPreviousMonth}
                sx={{
                  minWidth: "auto",
                  p: 1,
                  color: appointmentTheme.colors.text.primary,
                  "&:hover": {
                    backgroundColor:
                      appointmentTheme.colors.background.normalHover,
                  },
                }}
              >
                <ChevronLeft />
              </Button>

              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: appointmentTheme.colors.text.primary,
                  textAlign: "center",
                  minWidth: "200px",
                }}
              >
                {monthNames[currentMonth.getMonth()]}{" "}
                {currentMonth.getFullYear()}
              </Typography>

              <Button
                onClick={goToNextMonth}
                sx={{
                  minWidth: "auto",
                  p: 1,
                  color: appointmentTheme.colors.text.primary,
                  "&:hover": {
                    backgroundColor:
                      appointmentTheme.colors.background.normalHover,
                  },
                }}
              >
                <ChevronRight />
              </Button>
            </Box>

            {/* Días de la semana */}
            <Grid container sx={{ mb: 1 }}>
              {dayNames.map((dayName) => (
                <Grid item xs key={dayName} sx={{ textAlign: "center" }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      color: appointmentTheme.colors.text.secondary,
                      py: 1,
                    }}
                  >
                    {dayName}
                  </Typography>
                </Grid>
              ))}
            </Grid>

            {/* Calendario */}
            <Grid container spacing={0.5}>
              {calendarDays.map((dayData, index) => (
                <Grid item xs key={index} sx={{ textAlign: "center" }}>
                  <Button
                    onClick={() =>
                      !dayData.isDisabled &&
                      setTempSelectedDate(dayData.dateString)
                    }
                    disabled={dayData.isDisabled}
                    sx={{
                      width: "100%",
                      height: 40,
                      minWidth: "auto",
                      borderRadius: 1,
                      fontSize: "0.875rem",
                      fontWeight: dayData.isToday ? 700 : 500,
                      color: dayData.isDisabled
                        ? "grey.400"
                        : tempSelectedDate === dayData.dateString
                        ? "white"
                        : dayData.isToday
                        ? appointmentTheme.colors.primary
                        : appointmentTheme.colors.text.primary,
                      backgroundColor:
                        tempSelectedDate === dayData.dateString
                          ? appointmentTheme.colors.success
                          : dayData.isToday
                          ? "rgba(246, 200, 66, 0.1)"
                          : "transparent",
                      border: dayData.isToday
                        ? `2px solid ${appointmentTheme.colors.primary}`
                        : tempSelectedDate === dayData.dateString
                        ? `2px solid ${appointmentTheme.colors.success}`
                        : "2px solid transparent",
                      "&:hover": {
                        backgroundColor: dayData.isDisabled
                          ? "transparent"
                          : tempSelectedDate === dayData.dateString
                          ? appointmentTheme.colors.success
                          : dayData.isToday
                          ? "rgba(246, 200, 66, 0.2)"
                          : appointmentTheme.colors.background.normalHover,
                      },
                      "&:disabled": {
                        color: "grey.300",
                        backgroundColor: "transparent",
                      },
                      transition: appointmentTheme.transitions.fast,
                    }}
                  >
                    {dayData.day}
                  </Button>
                </Grid>
              ))}
            </Grid>
          </DialogContent>

          <DialogActions sx={{ px: 3, pt: 2, gap: 2 }}>
            <Button
              onClick={handleDateDialogClose}
              sx={{
                color: appointmentTheme.colors.text.secondary,
                textTransform: "none",
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleDateConfirm}
              variant="contained"
              disabled={!tempSelectedDate}
              startIcon={<Check />}
              sx={{
                backgroundColor: appointmentTheme.colors.success,
                color: "white",
                borderRadius: 2,
                px: 3,
                textTransform: "none",
                fontWeight: 600,
                "&:hover": {
                  backgroundColor: "#138a73",
                },
                "&:disabled": {
                  backgroundColor: "grey.300",
                  color: "grey.500",
                },
              }}
            >
              Aceptar
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog para selección de hora */}
        <Dialog
          open={timeDialogOpen}
          onClose={handleTimeDialogClose}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              px: 1,
              py: 2,
            },
          }}
        >
          <DialogTitle
            sx={{
              textAlign: "center",
              color: appointmentTheme.colors.text.primary,
              fontWeight: 600,
              pb: 1,
            }}
          >
            Selecciona una hora
          </DialogTitle>

          <DialogContent sx={{ px: 3 }}>
            <Typography
              variant="body2"
              sx={{
                textAlign: "center",
                color: appointmentTheme.colors.text.secondary,
                mb: 3,
              }}
            >
              Horarios disponibles de 9:00 AM a 6:00 PM
            </Typography>

            <Stack
              direction="row"
              flexWrap="wrap"
              gap={1}
              justifyContent="center"
            >
              {timeSlots.map((time) => (
                <Chip
                  key={time}
                  label={formatTime(time)}
                  clickable
                  onClick={() => setTempSelectedTime(time)}
                  sx={{
                    minWidth: "80px",
                    py: 1,
                    backgroundColor:
                      tempSelectedTime === time
                        ? appointmentTheme.colors.success
                        : "rgba(255, 255, 255, 0.9)",
                    color:
                      tempSelectedTime === time
                        ? "white"
                        : appointmentTheme.colors.text.primary,
                    border:
                      tempSelectedTime === time
                        ? `2px solid ${appointmentTheme.colors.success}`
                        : "2px solid transparent",
                    "&:hover": {
                      backgroundColor:
                        tempSelectedTime === time
                          ? appointmentTheme.colors.success
                          : appointmentTheme.colors.background.normalHover,
                      transform: "scale(1.05)",
                    },
                    transition: appointmentTheme.transitions.fast,
                  }}
                />
              ))}
            </Stack>
          </DialogContent>

          <DialogActions sx={{ px: 3, pt: 2, gap: 2 }}>
            <Button
              onClick={handleTimeDialogClose}
              sx={{
                color: appointmentTheme.colors.text.secondary,
                textTransform: "none",
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleTimeConfirm}
              variant="contained"
              disabled={!tempSelectedTime}
              startIcon={<Check />}
              sx={{
                backgroundColor: appointmentTheme.colors.success,
                color: "white",
                borderRadius: 2,
                px: 3,
                textTransform: "none",
                fontWeight: 600,
                "&:hover": {
                  backgroundColor: "#138a73",
                },
                "&:disabled": {
                  backgroundColor: "grey.300",
                  color: "grey.500",
                },
              }}
            >
              Aceptar
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Fade>
  );
};

export default DateTimeStep;
