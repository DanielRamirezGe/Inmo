"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Tabs,
  Tab,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Typography,
  Alert,
} from "@mui/material";
import AdminNavbar from "../components/AdminNavbar";
import { useAxiosMiddleware } from "../../../utils/axiosMiddleware";

export default function ProfilerPage() {
  const [tabValue, setTabValue] = useState(0);
  const [profilers, setProfilers] = useState([]);
  const [formData, setFormData] = useState({
    user: "",
    name: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState(null); // State for error feedback
  const [successMessage, setSuccessMessage] = useState(null); // State for success feedback
  const axiosInstance = useAxiosMiddleware();

  const fetchProfilers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axiosInstance.get("/api/v1/profiler", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProfilers(response.data.data);
    } catch (error) {
      console.error("Error fetching profilers:", error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setErrorMessage(null); // Clear error message when switching tabs
    setSuccessMessage(null); // Clear success message when switching tabs
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axiosInstance.post("/api/v1/profiler", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSuccessMessage("Perfilador registrado exitosamente");
      setErrorMessage(null); // Clear any previous error messages
      setFormData({ user: "", name: "", password: "" });
      fetchProfilers(); // Refresh the list of profilers
    } catch (error) {
      if (error.response?.status === 400) {
        setErrorMessage("Datos inválidos. Por favor verifica los campos.");
      } else if (error.response?.status === 409) {
        setErrorMessage("El usuario ya existe. Intenta con otro nombre.");
      } else {
        setErrorMessage(
          error.response?.data?.message || "Error al registrar el perfilador."
        );
      }
      setSuccessMessage(null); // Clear any previous success messages
    }
  };

  useEffect(() => {
    fetchProfilers();
  }, []);

  return (
    <>
      <AdminNavbar currentTab={1} onTabChange={setTabValue} />
      <Box sx={{ padding: 4 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{ marginBottom: 4 }}
        >
          <Tab label="Registrar Perfiladores" />
          <Tab label="Ver Perfiladores" />
        </Tabs>
        {tabValue === 0 && (
          <Box
            component="form"
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              maxWidth: 400,
              margin: "0 auto",
            }}
          >
            {errorMessage && (
              <Alert severity="error" onClose={() => setErrorMessage(null)}>
                {errorMessage}
              </Alert>
            )}
            {successMessage && (
              <Alert severity="success" onClose={() => setSuccessMessage(null)}>
                {successMessage}
              </Alert>
            )}
            <TextField
              label="Usuario"
              name="user"
              value={formData.user}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Nombre"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Contraseña"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              fullWidth
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleRegister}
            >
              Registrar
            </Button>
          </Box>
        )}
        {tabValue === 1 && (
          <Grid container spacing={2}>
            {profilers.map((profiler) => (
              <Grid item xs={12} sm={6} md={4} key={profiler.idProfiler}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">{profiler.name}</Typography>
                    <Typography variant="body2">
                      Usuario: {profiler.user}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </>
  );
}
