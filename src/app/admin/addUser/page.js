"use client";
import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
  Container,
  Stack,
} from "@mui/material";
import AdminNavbar from "../components/AdminNavbar";
import { useAxiosMiddleware } from "../../../utils/axiosMiddleware";

export default function AddUserPage() {
  const axiosInstance = useAxiosMiddleware();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    secondLastName: "",
    phone: "",
    email: "",
    source: "",
    comment: "",
  });
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const sourcesOptions = [
    { value: "facebook", label: "Facebook" },
    { value: "instagram", label: "Instagram" },
    { value: "tiktok", label: "TikTok" },
    { value: "personal", label: "Personal" },
  ];

  const validateForm = () => {
    const newErrors = {};

    // Validaciones
    if (!formData.name.trim()) {
      newErrors.name = "El nombre es requerido";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "El apellido paterno es requerido";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "El teléfono es requerido";
    } else if (!/^\d{10}$/.test(formData.phone.trim())) {
      newErrors.phone = "El teléfono debe tener 10 dígitos";
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }

    if (!formData.source) {
      newErrors.source = "Debe seleccionar una fuente";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Limpiar errores al escribir
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      await axiosInstance.post("/user/singleUser", formData);

      setSnackbar({
        open: true,
        message: "Usuario creado exitosamente",
        severity: "success",
      });

      // Resetear formulario
      setFormData({
        name: "",
        lastName: "",
        secondLastName: "",
        phone: "",
        email: "",
        source: "",
        comment: "",
      });
    } catch (error) {
      console.error("Error al crear usuario:", error);

      setSnackbar({
        open: true,
        message: "Error al crear usuario",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AdminNavbar />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Card
          elevation={3}
          sx={{
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              bgcolor: "#015D76",
              py: 2,
              px: 3,
              color: "white",
            }}
          >
            <Typography variant="h5" fontWeight="500">
              Nuevo Usuario
            </Typography>
          </Box>

          <CardContent sx={{ p: 3 }}>
            <Box component="form" onSubmit={handleSubmit} noValidate>
              {/* Fila 1: Nombre y apellidos */}
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                sx={{ mb: 2 }}
              >
                <TextField
                  fullWidth
                  label="Nombre"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  error={!!errors.name}
                  helperText={errors.name}
                  required
                  sx={{ flex: 1, bgcolor: "white" }}
                />
                <TextField
                  fullWidth
                  label="Apellido Paterno"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  error={!!errors.lastName}
                  helperText={errors.lastName}
                  required
                  sx={{ flex: 1, bgcolor: "white" }}
                />
                <TextField
                  fullWidth
                  label="Apellido Materno"
                  name="secondLastName"
                  value={formData.secondLastName}
                  onChange={handleChange}
                  sx={{ flex: 1, bgcolor: "white" }}
                />
              </Stack>

              {/* Fila 2: Teléfono, email y fuente */}
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                sx={{ mb: 2 }}
              >
                <TextField
                  fullWidth
                  label="Teléfono"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  error={!!errors.phone}
                  helperText={errors.phone}
                  required
                  sx={{ flex: 1, bgcolor: "white" }}
                />
                <TextField
                  fullWidth
                  label="Correo Electrónico"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={!!errors.email}
                  helperText={errors.email}
                  sx={{ flex: 1, bgcolor: "white" }}
                />
                <FormControl
                  fullWidth
                  error={!!errors.source}
                  required
                  sx={{
                    flex: 1,
                    maxWidth: { xs: "100%", sm: "200px" },
                    bgcolor: "white",
                  }}
                >
                  <InputLabel>¿Cómo llegó?</InputLabel>
                  <Select
                    name="source"
                    value={formData.source}
                    onChange={handleChange}
                    label="¿Cómo llegó?"
                  >
                    {sourcesOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.source && (
                    <Typography
                      color="error"
                      variant="caption"
                      sx={{ ml: 2, mt: 0.5 }}
                    >
                      {errors.source}
                    </Typography>
                  )}
                </FormControl>
              </Stack>

              {/* Fila 3: Comentario */}
              <Box sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  label="Comentario"
                  name="comment"
                  multiline
                  rows={4}
                  value={formData.comment}
                  onChange={handleChange}
                  sx={{ bgcolor: "white" }}
                  placeholder="Información adicional sobre el usuario..."
                />
              </Box>

              {/* Botón */}
              <Box sx={{ mt: 3 }}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{
                    py: 1.5,
                    px: 4,
                    "&:hover": { bgcolor: "#128C7E" },
                    fontSize: "1rem",
                    fontWeight: "500",
                  }}
                >
                  {loading ? "Creando Usuario..." : "CREAR USUARIO"}
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
