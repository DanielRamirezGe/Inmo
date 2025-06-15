"use client";
import * as React from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
} from "@mui/material";
import { useRouter } from "next/navigation";
import axios from "axios";
import styles from "./login.module.css";
import apiConfig from "../../config/apiConfig";

export default function LoginPage() {
  const router = useRouter();
  const [user, setUser] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState(null);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        `${apiConfig.baseURL}/api/v1/auth/login`,
        {
          user,
          password,
        }
      );
      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        if (response.data.role === "admin") {
          router.push("/admin");
        } else {
          router.push("/profiler");
        }
      }
    } catch (error) {
      setError("Usuario o Contraseña incorrecto");
    }
  };

  return (
    <Box className={styles.container}>
      <Paper elevation={3} className={styles.paper}>
        <Box className={styles.logoContainer}>
          <img
            src="/mainBanner/minkaasa.png"
            alt="Logo"
            className={styles.logo}
          />
        </Box>
        <Typography variant="h5" className={styles.title}>
          Iniciar Sesión
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <form onSubmit={handleLogin} className={styles.form}>
          <TextField
            label="Usuario"
            variant="outlined"
            fullWidth
            margin="normal"
            required
            value={user}
            onChange={(e) => setUser(e.target.value)}
          />
          <TextField
            label="Contraseña"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            className={styles.button}
          >
            Iniciar Sesión
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
