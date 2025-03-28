"use client";
import * as React from "react";
import axios from "axios";
import { Typography, Box, Alert, Pagination, Tabs, Tab } from "@mui/material";
import { useRouter } from "next/navigation";
import PerfiladorNavBar from "./components/navBarProfiler";
import ClientCardProfiler from "./components/ClientCardProfiler";
import Grid from "@mui/material/Grid2";

export default function PerfiladorPage() {
  const [data, setData] = React.useState([]);
  const [error, setError] = React.useState(null);
  const [unauthorized, setUnauthorized] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [tabValue, setTabValue] = React.useState(0); // State for tab selection
  const router = useRouter();

  const statusOptions = [
    "call",
    "message",
    "pending",
    "interested",
    "discarded",
    "all",
  ]; // Status options for API requests

  const fetchData = async (page, status) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:3010/api/v1/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page,
          status, // Pass the status parameter to the API
        },
      });
      setData(response.data.data);
      setTotalPages(response.data.pagination.totalPages);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setUnauthorized(true);
        setTimeout(() => {
          router.push("/login");
        }, 3000); // Redirect after 3 seconds
      } else {
        setError(error.message);
      }
    }
  };

  React.useEffect(() => {
    fetchData(page, statusOptions[tabValue]); // Fetch data based on the current tab
  }, [page, tabValue, router]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setPage(1); // Reset to the first page when switching tabs
  };

  return (
    <>
      <PerfiladorNavBar />
      <Box
        sx={{
          padding: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Usuarios
        </Typography>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{ marginBottom: 4 }}
        >
          <Tab label="Realizar Llamada" />
          <Tab label="Realizar Mensaje" />
          <Tab label="Pendiente" />
          <Tab label="Interesado" />
          <Tab label="Descartado" />
          <Tab label="Todos mis clientes" />
        </Tabs>
        {unauthorized && (
          <Alert severity="warning">
            No autorizado. Redirigiendo a la página de inicio de sesión...
          </Alert>
        )}
        {error && !unauthorized && (
          <Alert severity="error">{`Error fetching data: ${error}`}</Alert>
        )}
        <Grid container spacing={2} justifyContent="center">
          {data.map((client, index) => (
            <Grid xs={12} sm={6} md={3} key={index} sx={{ display: "flex" }}>
              <ClientCardProfiler
                client={client}
                statusOptions={statusOptions[tabValue]}
              />
            </Grid>
          ))}
        </Grid>
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          sx={{ marginTop: 4 }}
        />
      </Box>
    </>
  );
}
