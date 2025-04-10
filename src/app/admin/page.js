"use client";
import * as React from "react";
import {
  Typography,
  Box,
  Alert,
  Pagination,
  Tabs,
  Tab,
  TextField,
  Button,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { useRouter } from "next/navigation";
import ClientCardWithSelect from "./components/ClientCardWithSelect";
import Grid from "@mui/material/Grid2";
import AdminNavbar from "./components/AdminNavbar";
import { useAxiosMiddleware } from "../../utils/axiosMiddleware";

export default function AdminPage() {
  const [data, setData] = React.useState([]);
  const [error, setError] = React.useState(null);
  const [unauthorized, setUnauthorized] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [profilers, setProfilers] = React.useState([]);
  const [tabValue, setTabValue] = React.useState(0); // State for active tab
  const [searchQuery, setSearchQuery] = React.useState(""); // State for search query input
  const [searchValue, setSearchValue] = React.useState(""); // State for search query to fetch
  const [filterPhone, setFilterPhone] = React.useState(false); // State for phone filter
  const [filterEmail, setFilterEmail] = React.useState(false); // State for email filter
  const router = useRouter();
  const axiosInstance = useAxiosMiddleware();
  const [totalUsers, setTotalUsers] = React.useState(0);

  const statusOptions = [
    "not_assign",
    // "assigned",
    "call",
    "message",
    "pending",
    "interested",
    "discarded",
    "all",
  ]; // Define status options

  const fetchData = async (page, status, query, phone, email) => {
    try {
      const response = await axiosInstance.get("/user/adminAll", {
        params: {
          page,
          status,
          query,
          phone,
          email,
        },
      });
      console.log(response.data);
      setData(response.data.data);
      setTotalPages(response.data.pagination.totalPages);
      setTotalUsers(response.data.pagination.totalItems);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setUnauthorized(true);
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        setError(error.message);
      }
    }
  };

  const fetchProfilers = async () => {
    try {
      const response = await axiosInstance.get("/profiler");
      setProfilers(response.data.data);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleProfilerChange = async (idUserProcess, profilerId) => {
    try {
      await axiosInstance.post("/userProcess/addProfiler", {
        userProcessId: idUserProcess,
        profilerId: profilerId,
      });
      alert("Action registered successfully!");
      fetchData(
        page,
        statusOptions[tabValue],
        searchValue,
        filterPhone,
        filterEmail
      );
    } catch (error) {
      setError(error.message);
    }
  };

  React.useEffect(() => {
    fetchData(
      page,
      statusOptions[tabValue],
      searchValue,
      filterPhone,
      filterEmail
    ); // Fetch data based on filters
  }, [page, tabValue, searchValue, filterPhone, filterEmail]); // Trigger fetchData when filters change

  React.useEffect(() => {
    fetchProfilers(); // Fetch profilers only once on component mount
  }, []);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setPage(1); // Reset to the first page when switching tabs
  };

  const handleSearch = () => {
    setSearchValue(searchQuery); // Update the search value to trigger fetch
    setPage(1); // Reset to the first page when searching
  };

  const refreshData = () => {
    fetchData(
      page,
      statusOptions[tabValue],
      searchValue,
      filterPhone,
      filterEmail
    );
  };

  return (
    <>
      <AdminNavbar />
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
          <Tab label="No asignado a perfilador" />
          {/* <Tab label="Asignado a perfilador" /> */}
          <Tab label="Sin realizar Llamada" />
          <Tab label="En Mensaje" />
          <Tab label="Pendiente" />
          <Tab label="Interesado" />
          <Tab label="Descartado" />
          <Tab label="Todos mis clientes" />
        </Tabs>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            marginBottom: 4,
            alignItems: "center",
            width: "100%",
            maxWidth: 800,
          }}
        >
          <TextField
            fullWidth
            label="Buscar por nombre"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSearch}
            sx={{ height: "56px" }}
          >
            Buscar
          </Button>
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: 4,
            marginBottom: 4,
            alignItems: "center",
          }}
        >
          <FormControlLabel
            control={
              <Switch
                checked={filterPhone}
                onChange={(e) => setFilterPhone(e.target.checked)}
              />
            }
            label="Teléfono"
          />
          <FormControlLabel
            control={
              <Switch
                checked={filterEmail}
                onChange={(e) => setFilterEmail(e.target.checked)}
              />
            }
            label="Correo"
          />
        </Box>
        {unauthorized && (
          <Alert severity="warning">
            No autorizado. Redirigiendo a la página de inicio de sesión...
          </Alert>
        )}
        {error && !unauthorized && (
          <Alert severity="error">{`Error: ${error}`}</Alert>
        )}
        <Grid container spacing={2} justifyContent="center">
          {data.map((client, index) => (
            <Grid
              xs={12}
              sm={6}
              md={3}
              key={client.idUser}
              sx={{ display: "flex" }}
            >
              <ClientCardWithSelect
                client={client}
                profilers={profilers}
                onProfilerChange={handleProfilerChange}
                refreshData={refreshData}
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
