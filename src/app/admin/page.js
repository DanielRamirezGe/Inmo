"use client";
import * as React from "react";
import axios from "axios";
import { Typography, Box, Alert, Pagination } from "@mui/material";
import { useRouter } from "next/navigation";
import ClientCard from "../components/ClientCard";
import Grid from "@mui/material/Grid2";
import AdminNavbar from "./components/AdminNavbar";

export default function AdminPage() {
  const [data, setData] = React.useState([]);
  const [error, setError] = React.useState(null);
  const [unauthorized, setUnauthorized] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const router = useRouter();

  const fetchData = async (page) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:3010/api/v1/user/adminAll",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            page,
          },
        }
      );
      setData(response.data.data);
      console.log(response.data.data);
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
    fetchData(page);
  }, [page, router]);

  const handlePageChange = (event, value) => {
    setPage(value);
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
          Datos de Contacto
        </Typography>
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
              <ClientCard client={client} />
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
