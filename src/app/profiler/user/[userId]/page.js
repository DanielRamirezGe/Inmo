"use client";
import * as React from "react";
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  Checkbox,
  Button,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
  FormControl,
} from "@mui/material";
import PerfiladorNavBar from "./../../components/navBarProfiler";
import Grid from "@mui/material/Grid2";
import axios from "axios";
import { useRouter } from "next/navigation";
import apiConfig from "./../../../../config/apiConfig";
import { useAxiosMiddleware } from "../../../../utils/axiosMiddleware";

export default function UserPage({ params }) {
  const [userId, setUserId] = React.useState(null);
  const [user, setUser] = React.useState({
    name: "",
    lastNameP: "",
    lastNameM: "",
    mainEmail: "",
    mainPhone: "",
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
    houseType: "casa",
    bedrooms: "",
    propertyCondition: "nueva",
    comments: "",
    credit: "Infonavit",
  });
  const [userStatus, setUserStatus] = React.useState(
    "Interesado con seguimiento"
  );
  const router = useRouter();
  const axiosInstance = useAxiosMiddleware();

  React.useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setUserId(resolvedParams.userId);
    };

    resolveParams();
  }, [params]);

  React.useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return;

      try {
        const response = await axiosInstance.get(`/user/${userId}`);
        if (response.status === 200) {
          setUser(response.data.data); // Assuming the API returns user details
          console.log("User details fetched successfully:", response.data.data);
        } else {
          console.error("Unexpected response status:", response.status);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUser();
  }, [userId]);

  const [formData, setFormData] = React.useState({
    name: "",
    lastNameP: "",
    lastNameM: "",
    mainEmail: "",
    mainPhone: "",
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

  const handleUpdate = async (fieldName, value) => {
    try {
      const response = await axiosInstance.patch("/user", {
        userId,
        [fieldName]: value,
      });
      setUser({ ...user, [fieldName]: value });
      console.log(`Field ${fieldName} updated successfully:`, response.data);
    } catch (error) {
      console.error(`Error updating field ${fieldName}:`, error);
    }
  };

  const handleStatusUpdate = async () => {
    try {
      await axiosInstance.put("/profiler/userProcess", {
        userId,
        status: userStatus,
      });
      router.push("/profiler"); // Redirect to /profiler after successful update
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

  return (
    <>
      <PerfiladorNavBar />
      <Box textAlign={"center"} sx={{ padding: 4 }}>
        <Typography variant="h4">Datos del Cliente</Typography>
      </Box>
      <Grid container>
        <Grid size={6}>
          <Box sx={{ padding: 4, maxWidth: 600, margin: "0 auto" }}>
            <Grid container spacing={2}>
              <Grid size={12} sx={{ height: "60px" }}>
                <Typography variant="h6">Credito</Typography>
              </Grid>
              {/* <Grid container size={12} sx={{ height: "60px" }}>
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
                  <Button
                    variant="contained"
                    onClick={() => handleUpdate("credit", formData.credit)}
                  >
                    Guardar
                  </Button>
                </Grid>
              </Grid> */}
              <Grid container size={12} sx={{ height: "60px" }}>
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
                  <Button
                    variant="contained"
                    onClick={() => handleUpdate("budget", formData.budget)}
                  >
                    Guardar
                  </Button>
                </Grid>
              </Grid>
              <Grid size={12} sx={{ height: "60px" }}>
                <Typography variant="h6">Datos Personales</Typography>
              </Grid>

              {[
                { label: "Nombre", name: "name" },
                { label: "Apellido Paterno", name: "lastNameP" },
                { label: "Apellido Materno", name: "lastNameM" },
                { label: "Correo Electrónico", name: "mainEmail" },
                { label: "Telefono", name: "mainPhone" },
              ].map((field) => (
                <Grid
                  container
                  size={12}
                  sx={{ height: "60px" }}
                  key={field.name}
                >
                  <Grid size={10}>
                    <TextField
                      label={field.label}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleInputChange}
                      fullWidth
                      sx={{ marginBottom: 2 }}
                    />
                  </Grid>
                  <Grid size={2}>
                    <Button
                      variant="contained"
                      onClick={() =>
                        handleUpdate(field.name, formData[field.name])
                      }
                    >
                      Guardar
                    </Button>
                  </Grid>
                </Grid>
              ))}
              <Grid
                container
                size={12}
                sx={{ height: "60px", alignItems: "center" }}
              >
                <Grid size={4}>
                  <Typography>Estado civil:</Typography>
                </Grid>
                <Grid size={6}>
                  <FormControl fullWidth>
                    <InputLabel id="maritalStatus-label">
                      Estado civil
                    </InputLabel>
                    <Select
                      labelId="maritalStatus-label"
                      name="maritalStatus"
                      value={formData.maritalStatus}
                      onChange={handleInputChange}
                    >
                      {["Soltero", "Casado", "Divorsiado", "Union libre"].map(
                        (maritalStatus) => (
                          <MenuItem key={maritalStatus} value={maritalStatus}>
                            {maritalStatus}
                          </MenuItem>
                        )
                      )}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={2}>
                  <Button
                    variant="contained"
                    onClick={() =>
                      handleUpdate("maritalStatus", formData.maritalStatus)
                    }
                  >
                    Guardar
                  </Button>
                </Grid>
              </Grid>

              <Grid
                container
                size={12}
                sx={{ height: "60px", alignItems: "center" }}
              >
                <Grid size={4}>
                  <Typography>Número de Hijos:</Typography>
                </Grid>
                <Grid size={6}>
                  <FormControl fullWidth>
                    <InputLabel id="children-label">Número de Hijos</InputLabel>
                    <Select
                      labelId="children-label"
                      name="children"
                      value={formData.children}
                      onChange={handleInputChange}
                    >
                      {[1, 2, 3, 4, 5, 6].map((number) => (
                        <MenuItem key={number} value={number}>
                          {number}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={2}>
                  <Button
                    variant="contained"
                    onClick={() => handleUpdate("children", formData.children)}
                  >
                    Guardar
                  </Button>
                </Grid>
              </Grid>

              <Grid
                container
                size={12}
                sx={{ height: "60px", alignItems: "center" }}
              >
                <Grid size={4}>
                  <Typography>Sexo:</Typography>
                </Grid>
                <Grid size={6}>
                  <FormControl component="fieldset">
                    <RadioGroup
                      row
                      name="gender"
                      value={formData.gender}
                      onChange={(e) =>
                        setFormData({ ...formData, gender: e.target.value })
                      }
                    >
                      <FormControlLabel
                        value="Masculino"
                        control={<Radio />}
                        label="Masculino"
                      />
                      <FormControlLabel
                        value="Femenino"
                        control={<Radio />}
                        label="Femenino"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid size={2}>
                  <Button
                    variant="contained"
                    onClick={() => handleUpdate("gender", formData.gender)}
                  >
                    Guardar
                  </Button>
                </Grid>
              </Grid>

              <Grid size={12} sx={{ height: "60px" }}>
                <Typography variant="h6">Direccion</Typography>
              </Grid>
              {[
                { label: "Calle", name: "street" },
                { label: "Colonia", name: "neighborhood" },
                { label: "Municipio", name: "city" },
                { label: "Estado", name: "state" },
                { label: "Código Postal", name: "zipCode" },
              ].map((field) => (
                <Grid
                  container
                  size={12}
                  sx={{ height: "60px" }}
                  key={field.name}
                >
                  <Grid size={10}>
                    <TextField
                      label={field.label}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleInputChange}
                      fullWidth
                      sx={{ marginBottom: 2 }}
                    />
                  </Grid>
                  <Grid size={2}>
                    <Button
                      variant="contained"
                      onClick={() =>
                        handleUpdate(field.name, formData[field.name])
                      }
                    >
                      Guardar
                    </Button>
                  </Grid>
                </Grid>
              ))}

              <Grid size={12} sx={{ height: "60px" }}>
                <Typography variant="h6">Intereses</Typography>
              </Grid>

              <Grid container size={12} sx={{ height: "60px" }}>
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
                  <Button
                    variant="contained"
                    onClick={() =>
                      handleUpdate("houseType", formData.houseType)
                    }
                  >
                    Guardar
                  </Button>
                </Grid>
              </Grid>
              <Grid size={12} sx={{ height: "60px" }}>
                <Typography variant="h6">Habitaciones</Typography>
              </Grid>
              <Grid container size={12} sx={{ height: "60px" }}>
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
                  <Button
                    variant="contained"
                    onClick={() =>
                      handleUpdate("houseType", formData.houseType)
                    }
                  >
                    Guardar
                  </Button>
                </Grid>
              </Grid>
              <Grid size={12} sx={{ height: "60px" }}>
                <Typography variant="h6">Tipo de Propiedad</Typography>
              </Grid>
              <Grid container size={12} sx={{ height: "60px" }}>
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
                  <Button
                    variant="contained"
                    onClick={() =>
                      handleUpdate(
                        "propertyCondition",
                        formData.propertyCondition
                      )
                    }
                  >
                    Guardar
                  </Button>
                </Grid>
              </Grid>
              <Grid size={12} sx={{ height: "60px" }}>
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
                  <Button
                    variant="contained"
                    onClick={() => handleUpdate("comments", formData.comments)}
                  >
                    Guardar
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Grid>

        <Grid size={6}>
          <Box sx={{ padding: 4, maxWidth: 600, margin: "0 auto" }}>
            <Grid container spacing={2}>
              <Grid size={12} sx={{ height: "60px" }}>
                <Typography variant="h6">Credito</Typography>
              </Grid>
              {/* <Grid container size={12} sx={{ height: "60px" }}>
                <Typography>Tipo de credito: {user.credit}</Typography>
              </Grid> */}
              <Grid container size={12} sx={{ height: "60px" }}>
                <Typography>Presupuesto {user.budget}</Typography>
              </Grid>
              <Grid size={12} sx={{ height: "60px" }}>
                <Typography variant="h6">Datos Personales</Typography>
              </Grid>

              <Grid container size={12} sx={{ height: "60px" }}>
                <Typography>
                  <strong>Nombre:</strong> {user.name}
                </Typography>
              </Grid>
              <Grid container size={12} sx={{ height: "60px" }}>
                <Typography>
                  <strong>Apellido Paterno:</strong> {user.lastNameP}
                </Typography>
              </Grid>
              <Grid container size={12} sx={{ height: "60px" }}>
                <Typography>
                  <strong>Apellido Materno:</strong> {user.lastNameM}
                </Typography>
              </Grid>
              <Grid container size={12} sx={{ height: "60px" }}>
                <Typography>
                  <strong>Correo Electrónico:</strong> {user.mainEmail}
                </Typography>
              </Grid>
              <Grid container size={12} sx={{ height: "60px" }}>
                <Typography>
                  <strong>Telefono:</strong> {user.mainPhone}
                </Typography>
              </Grid>
              <Grid container size={12} sx={{ height: "60px" }}>
                <Typography>
                  <strong>Estado civil:</strong> {user.maritalStatus}
                </Typography>
              </Grid>
              <Grid container size={12} sx={{ height: "60px" }}>
                <Typography>
                  <strong>Numero de hijos:</strong> {user.children}
                </Typography>
              </Grid>
              <Grid container size={12} sx={{ height: "60px" }}>
                <Typography>
                  <strong>Genero:</strong> {user.gender}
                </Typography>
              </Grid>
              <Grid size={12} sx={{ height: "60px" }}>
                <Typography variant="h6">Direccion</Typography>
              </Grid>
              <Grid container size={12} sx={{ height: "60px" }}>
                <Typography>
                  <strong>Calle:</strong> {user.street}
                </Typography>
              </Grid>
              <Grid container size={12} sx={{ height: "60px" }}>
                <Typography>
                  <strong>Colonia:</strong> {user.neighborhood}
                </Typography>
              </Grid>
              <Grid container size={12} sx={{ height: "60px" }}>
                <Typography>
                  <strong>Municipio:</strong> {user.city}
                </Typography>
              </Grid>
              <Grid container size={12} sx={{ height: "60px" }}>
                <Typography>
                  <strong>Estado:</strong> {user.state}
                </Typography>
              </Grid>
              <Grid container size={12} sx={{ height: "60px" }}>
                <Typography>
                  <strong>Codigo postal:</strong> {user.zipCode}
                </Typography>
              </Grid>

              <Grid size={12} sx={{ height: "60px" }}>
                <Typography variant="h6">Intereses</Typography>
              </Grid>

              <Grid container size={12} sx={{ height: "60px" }}>
                <Typography>
                  <strong>Tipo de Casa:</strong> {user.houseType}
                </Typography>
              </Grid>
              <Grid size={12} sx={{ height: "60px" }}>
                <Typography variant="h6">Habitaciones</Typography>
              </Grid>
              <Grid container size={12} sx={{ height: "60px" }}>
                <Typography>
                  <strong>Habitaciones:</strong> {user.bedrooms}
                </Typography>
              </Grid>
              <Grid size={12} sx={{ height: "60px" }}>
                <Typography variant="h6">Tipo de Propiedad</Typography>
              </Grid>
              <Grid container size={12} sx={{ height: "60px" }}>
                <Typography>
                  <strong>Tipo de Propiedad:</strong> {user.propertyCondition}
                </Typography>
              </Grid>
              <Grid size={12} sx={{ height: "60px" }}>
                <Typography variant="h6">Comentario</Typography>
              </Grid>
              <Grid container size={12}>
                <Typography>
                  <strong>Comentarios:</strong> {user.propertyCondition}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
      <Grid container textAlign={"center"} sx={{ padding: 4 }}>
        <Grid size={12}>
          <Typography variant="h4">Tipo de cliente</Typography>
        </Grid>
        <Grid size={12}>
          <FormControl>
            <RadioGroup
              value={userStatus}
              onChange={(e) => setUserStatus(e.target.value)}
              name="radio-buttons-group"
            >
              <FormControlLabel
                value="Interesado con seguimiento"
                control={<Radio />}
                label="Interesado con seguimiento"
              />
              <FormControlLabel
                value="Interesado enviar a cerrador"
                control={<Radio />}
                label="Interesado enviar a cerrador"
              />
              <FormControlLabel
                value="No interesado"
                control={<Radio />}
                label="No interesado"
              />
            </RadioGroup>
          </FormControl>
        </Grid>

        <Grid size={12}>
          <Button variant="contained" onClick={handleStatusUpdate}>
            Guardar y salir
          </Button>
        </Grid>
      </Grid>
    </>
  );
}
