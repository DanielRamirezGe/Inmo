"use client";
import * as React from "react";
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Checkbox,
  FormControlLabel,
  Button,
} from "@mui/material";
import PerfiladorNavBar from "./../../components/navBarProfiler";
import Grid from "@mui/material/Grid2";

export default function UserPage({ params }) {
  const [userId, setUserId] = React.useState(null);
  React.useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setUserId(resolvedParams.userId);
    };

    resolveParams();
  }, [params]);

  const [formData, setFormData] = React.useState({
    name: "",
    lastNameP: "",
    lastNameM: "",
    email: "",
    street: "",
    neighborhood: "",
    city: "",
    state: "",
    zipCode: "",
    gender: "",
    maritalStatus: "",
    children: "",
    creditOption: "",
    budget: "",
    houseType: {
      casa: false,
      departamento: false,
    },
    bedrooms: "",
    propertyCondition: {
      nueva: false,
      usada: false,
    },
    comments: "",
    credit: {
      infonavit: false,
      fovisste: false,
      bancario: false,
    },
  });

  const user = {
    name: "test info",
    lastNameP: "test info",
    lastNameM: "test info",
    email: "test info",
    street: "test info",
    neighborhood: "test info",
    city: "test info",
    state: "test info",
    zipCode: "test info",
    gender: "test info",
    maritalStatus: "test info",
    children: "test info",
    creditOption: "test info",
    budget: "test info",
    houseType: "casa",
    bedrooms: "test info",
    propertyCondition: "nueva",
    comments: "test info",
    credit: "Infonavit",
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    const [group, key] = name.split(".");
    setFormData({
      ...formData,
      [group]: { ...formData[group], [key]: checked },
    });
  };

  return (
    <>
      <PerfiladorNavBar />
      <Typography variant="h4">Datos del Cliente</Typography>
      <Grid container>
        <Grid size={4}>
          <Box sx={{ padding: 4, maxWidth: 600, margin: "0 auto" }}>
            <Grid container spacing={2}>
              <Grid size={12}>
                <Typography variant="h6">Credito</Typography>
              </Grid>
              <Grid container size={12}>
                <Grid size={10}>
                  <Box>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.credit.infonavit}
                          onChange={handleCheckboxChange}
                          name="credit.infonavit"
                        />
                      }
                      label="Infonavit"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.credit.fovisste}
                          onChange={handleCheckboxChange}
                          name="credit.fovisste"
                        />
                      }
                      label="Fovisste"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.credit.bancario}
                          onChange={handleCheckboxChange}
                          name="credit.bancario"
                        />
                      }
                      label="Bancario"
                    />
                  </Box>
                </Grid>
                <Grid size={2}>
                  <Button variant="contained">Guardar</Button>
                </Grid>
              </Grid>
              <Grid container size={12}>
                <Grid size={10}>
                  <TextField
                    label="Presupuesto"
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    fullWidth
                  />
                </Grid>
                <Grid size={2}>
                  <Button variant="contained">Guardar</Button>
                </Grid>
              </Grid>
              <Grid size={12}>
                <Typography variant="h6">Datos Personales</Typography>
              </Grid>

              <Grid container size={12}>
                <Grid size={10}>
                  <TextField
                    label="Nombre"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    fullWidth
                    sx={{ marginBottom: 2 }}
                  />
                </Grid>
                <Grid size={2}>
                  <Button variant="contained">Guardar</Button>
                </Grid>
              </Grid>
              <Grid container size={12}>
                <Grid size={10}>
                  <TextField
                    label="Apellido Paterno"
                    name="lastNameP"
                    value={formData.lastNameP}
                    onChange={handleInputChange}
                    fullWidth
                    sx={{ marginBottom: 2 }}
                  />
                </Grid>
                <Grid size={2}>
                  <Button variant="contained">Guardar</Button>
                </Grid>
              </Grid>
              <Grid container size={12}>
                <Grid size={10}>
                  <TextField
                    label="Apellido Materno"
                    name="lastNameM"
                    value={formData.lastNameM}
                    onChange={handleInputChange}
                    fullWidth
                    sx={{ marginBottom: 2 }}
                  />
                </Grid>
                <Grid size={2}>
                  <Button variant="contained">Guardar</Button>
                </Grid>
              </Grid>
              <Grid container size={12}>
                <Grid size={10}>
                  <TextField
                    label="Correo Electrónico"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    fullWidth
                    sx={{ marginBottom: 2 }}
                  />
                </Grid>
                <Grid size={2}>
                  <Button variant="contained">Guardar</Button>
                </Grid>
              </Grid>
              <Grid container size={12}>
                <Grid size={10}>
                  <TextField
                    label="Sexo"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    fullWidth
                    sx={{ marginBottom: 2 }}
                  />
                </Grid>
                <Grid size={2}>
                  <Button variant="contained">Guardar</Button>
                </Grid>
              </Grid>
              <Grid container size={12}>
                <Grid size={10}>
                  <TextField
                    label="Estado Civil"
                    name="maritalStatus"
                    value={formData.maritalStatus}
                    onChange={handleInputChange}
                    fullWidth
                    sx={{ marginBottom: 2 }}
                  />
                </Grid>
                <Grid size={2}>
                  <Button variant="contained">Guardar</Button>
                </Grid>
              </Grid>
              <Grid container size={12}>
                <Grid size={10}>
                  <TextField
                    label="Número de Hijos"
                    name="children"
                    value={formData.children}
                    onChange={handleInputChange}
                    fullWidth
                    sx={{ marginBottom: 2 }}
                  />
                </Grid>
                <Grid size={2}>
                  <Button variant="contained">Guardar</Button>
                </Grid>
              </Grid>
              <Grid size={12}>
                <Typography variant="h6">Direccion</Typography>
              </Grid>
              <Grid container size={12}>
                <Grid size={10}>
                  <TextField
                    label="Calle"
                    name="street"
                    value={formData.street}
                    onChange={handleInputChange}
                    fullWidth
                    sx={{ marginBottom: 2 }}
                  />
                </Grid>
                <Grid size={2}>
                  <Button variant="contained">Guardar</Button>
                </Grid>
              </Grid>
              <Grid container size={12}>
                <Grid size={10}>
                  <TextField
                    label="Colonia"
                    name="neighborhood"
                    value={formData.neighborhood}
                    onChange={handleInputChange}
                    fullWidth
                    sx={{ marginBottom: 2 }}
                  />
                </Grid>
                <Grid size={2}>
                  <Button variant="contained">Guardar</Button>
                </Grid>
              </Grid>
              <Grid container size={12}>
                <Grid size={10}>
                  <TextField
                    label="Municipio"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    fullWidth
                    sx={{ marginBottom: 2 }}
                  />
                </Grid>
                <Grid size={2}>
                  <Button variant="contained">Guardar</Button>
                </Grid>
              </Grid>
              <Grid container size={12}>
                <Grid size={10}>
                  <TextField
                    label="Estado"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    fullWidth
                    sx={{ marginBottom: 2 }}
                  />
                </Grid>
                <Grid size={2}>
                  <Button variant="contained">Guardar</Button>
                </Grid>
              </Grid>
              <Grid container size={12}>
                <Grid size={10}>
                  <TextField
                    label="Código Postal"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    fullWidth
                    sx={{ marginBottom: 2 }}
                  />
                </Grid>
                <Grid size={2}>
                  <Button variant="contained">Guardar</Button>
                </Grid>
              </Grid>

              <Grid size={12}>
                <Typography variant="h6">Intereses</Typography>
              </Grid>

              <Grid container size={12}>
                <Grid size={10}>
                  <Box sx={{ display: "flex", gap: 2, marginBottom: 2 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.houseType.casa}
                          onChange={handleCheckboxChange}
                          name="houseType.casa"
                        />
                      }
                      label="Casa"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.houseType.departamento}
                          onChange={handleCheckboxChange}
                          name="houseType.departamento"
                        />
                      }
                      label="Departamento"
                    />
                  </Box>
                </Grid>

                <Grid size={2}>
                  <Button variant="contained">Guardar</Button>
                </Grid>
              </Grid>
              <Grid size={12}>
                <Typography variant="h6">Habitaciones</Typography>
              </Grid>
              <Grid container size={12}>
                <Grid size={10}>
                  <Box sx={{ display: "flex", gap: 2, marginBottom: 2 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.houseType.habitaciones1}
                          onChange={handleCheckboxChange}
                          name="houseType.habitaciones1"
                        />
                      }
                      label="1"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.houseType.habitaciones2}
                          onChange={handleCheckboxChange}
                          name="houseType.habitaciones2"
                        />
                      }
                      label="2"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.houseType.habitaciones2}
                          onChange={handleCheckboxChange}
                          name="houseType.habitaciones3"
                        />
                      }
                      label="3"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.houseType.habitaciones2}
                          onChange={handleCheckboxChange}
                          name="houseType.habitaciones4"
                        />
                      }
                      label="4"
                    />
                  </Box>
                </Grid>
                <Grid size={2}>
                  <Button variant="contained">Guardar</Button>
                </Grid>
              </Grid>
              <Grid size={12}>
                <Typography variant="h6">Tipo de Propiedad</Typography>
              </Grid>
              <Grid container size={12}>
                <Grid size={10}>
                  <Box sx={{ display: "flex", gap: 2, marginBottom: 2 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.propertyCondition.nueva}
                          onChange={handleCheckboxChange}
                          name="propertyCondition.nueva"
                        />
                      }
                      label="Nueva"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.propertyCondition.usada}
                          onChange={handleCheckboxChange}
                          name="propertyCondition.usada"
                        />
                      }
                      label="Usada"
                    />
                  </Box>
                </Grid>
                <Grid size={2}>
                  <Button variant="contained">Guardar</Button>
                </Grid>
              </Grid>
              <Grid size={12}>
                <Typography variant="h6">Comentario</Typography>
              </Grid>
              <Grid container size={12}>
                <Grid size={10}>
                  <TextField
                    label="Comentarios"
                    name="comments"
                    value={formData.comments}
                    onChange={handleInputChange}
                    fullWidth
                    multiline
                    rows={4}
                    sx={{ marginBottom: 2 }}
                  />
                </Grid>
                <Grid size={2}>
                  <Button variant="contained">Guardar</Button>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Grid>

        <Grid size={4}>
          <Box sx={{ padding: 4, maxWidth: 600, margin: "0 auto" }}>
            <Grid container spacing={2}>
              <Grid size={12}>
                <Typography variant="h6">Credito</Typography>
              </Grid>
              <Grid container size={12}>
                <Typography>Tipo de credito: {user.credit}</Typography>
              </Grid>
              <Grid container size={12}>
                <Typography>Presupuesto {user.budget}</Typography>
              </Grid>
              <Grid size={12}>
                <Typography variant="h6">Datos Personales</Typography>
              </Grid>

              <Grid container size={12}>
                <Typography>Nombre: {user.name}</Typography>
              </Grid>
              <Grid container size={12}>
                <Typography>Apellido Paterno: {user.lastNameP}</Typography>
              </Grid>
              <Grid container size={12}>
                <Typography>Apellido Materno: {user.lastNameM}</Typography>
              </Grid>
              <Grid container size={12}>
                <Typography>Correo Electrónico: {user.email}</Typography>
              </Grid>
              <Grid container size={12}>
                <Typography>Genero: {user.gender}</Typography>
              </Grid>
              <Grid container size={12}>
                <Typography>Estado civil: {user.maritalStatus}</Typography>
              </Grid>
              <Grid container size={12}>
                <Typography>Estado civil: {user.children}</Typography>
              </Grid>
              <Grid size={12}>
                <Typography variant="h6">Direccion</Typography>
              </Grid>
              <Grid container size={12}>
                <Typography>Calle: {user.street}</Typography>
              </Grid>
              <Grid container size={12}>
                <Typography>Colonia: {user.neighborhood}</Typography>
              </Grid>
              <Grid container size={12}>
                <Typography>Municipio: {user.city}</Typography>
              </Grid>
              <Grid container size={12}>
                <Typography>Estado: {user.state}</Typography>
              </Grid>
              <Grid container size={12}>
                <Typography>Codigo postal: {user.zipCode}</Typography>
              </Grid>

              <Grid size={12}>
                <Typography variant="h6">Intereses</Typography>
              </Grid>

              <Grid container size={12}>
                <Typography>Tipo de Casa: {user.houseType}</Typography>
              </Grid>
              <Grid size={12}>
                <Typography variant="h6">Habitaciones</Typography>
              </Grid>
              <Grid container size={12}>
                <Typography>Habitaciones: {user.bedrooms}</Typography>
              </Grid>
              <Grid size={12}>
                <Typography variant="h6">Tipo de Propiedad</Typography>
              </Grid>
              <Grid container size={12}>
                <Typography>Habitaciones: {user.propertyCondition}</Typography>
              </Grid>
              <Grid size={12}>
                <Typography variant="h6">Comentario</Typography>
              </Grid>
              <Grid container size={12}>
                <Typography>Comentarios:{user.comments} </Typography>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}
