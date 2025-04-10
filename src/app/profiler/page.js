"use client";
import * as React from "react";
import { Typography, Box, Alert, Pagination, Tabs, Tab } from "@mui/material";
import { useAxiosMiddleware } from "../../utils/axiosMiddleware";
import PerfiladorNavBar from "./components/navBarProfiler";
import ClientCardProfiler from "./components/ClientCardProfiler";
import Grid from "@mui/material/Grid2";

export default function PerfiladorPage() {
  const [data, setData] = React.useState([]);
  const [error, setError] = React.useState(null);
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [tabValue, setTabValue] = React.useState(0); // State for tab selection
  const axiosInstance = useAxiosMiddleware();

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
      const response = await axiosInstance.get("/user", {
        params: {
          page,
          status, // Pass the status parameter to the API
        },
      });
      setData(response.data.data);
      setTotalPages(response.data.pagination.totalPages);
    } catch (error) {
      setError(error.message);
    }
  };

  React.useEffect(() => {
    fetchData(page, statusOptions[tabValue]); // Fetch data based on the current tab
  }, [page, tabValue]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setPage(1); // Reset to the first page when switching tabs
  };

  // Exponer la función fetchData para que pueda ser usada por componentes hijos
  const refreshData = () => {
    fetchData(page, statusOptions[tabValue]);
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
        {error && (
          <Alert severity="error">{`Error fetching data: ${error}`}</Alert>
        )}
        <Grid container spacing={2} justifyContent="center">
          {data.map((client) => (
            <Grid key={client.idUserProcess} xs={12} sm={6} md={4}>
              <ClientCardProfiler
                client={client}
                statusOptions={statusOptions[tabValue]}
                refreshData={refreshData} // Pasar la función de actualización
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
