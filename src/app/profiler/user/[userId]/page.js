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
import { useRouter } from "next/navigation";\
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
    suburb: "",
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
    comments: [],
    credit: "Infonavit",
  });
  const [userStatus, setUserStatus] = React.useState(
    "Interesado con seguimiento"
  );
  const router = useRouter();
  const axiosInstance = useAxiosMiddleware();

  const fetchUser = async () => {
    if (!userId) return;

    try {
      const response = await axiosInstance.get(`/user/${userId}`);
      if (response.status === 200) {
        setUser(response.data.data); // Assuming the API returns user details
      } else {
        console.error("Unexpected response status:", response.status);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  React.useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setUserId(resolvedParams.userId);
    };

    resolveParams();
  }, [params]);

  React.useEffect(() => {
    fetchUser();
  }, [userId]);

  const [formData, setFormData] = React.useState({
    name: "",
    lastNameP: "",
    lastNameM: "",
    mainEmail: "",
    mainPhone: "",
    street: "",
    suburb: "",
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
    if (name === "budget") {
      // Remove all non-numeric characters
      const numbers = value.replace(/\D/g, "");

      // Format with commas every three digits
      const formattedValue = numbers.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

      setFormData({ ...formData, [name]: formattedValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const formatCurrency = (value) => {
    // Remove all non-numeric characters
    const numbers = value.replace(/\D/g, "");

    // If empty, return empty string
    if (!numbers) return "";

    // Convert to number and format
    const number = parseInt(numbers);
    if (isNaN(number)) return "";

    // Format with Mexican peso symbol and thousands separator
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(number);
  };

  const formatPhoneNumber = (value) => {
    // Remove all non-numeric characters
    const numbers = value.replace(/\D/g, "");
    // Limit to 10 digits
    const truncated = numbers.slice(0, 10);

    // Check if it's a valid Mexican phone number
    const isValidLada = /^[1-9][0-9]{1}$/.test(truncated.slice(0, 2));

    if (truncated.length === 10 && isValidLada) {
      // Format as (XX)-XX-XX-XX-XX
      const lada = truncated.slice(0, 2);
      const part1 = truncated.slice(2, 4);
      const part2 = truncated.slice(4, 6);
      const part3 = truncated.slice(6, 8);
      const part4 = truncated.slice(8, 10);
      return `(${lada})-${part1}-${part2}-${part3}-${part4}`;
    }

    return truncated;
  };

  const handlePhoneChange = (e) => {
    const { name, value } = e.target;
    const formattedValue = formatPhoneNumber(value);
    setFormData({ ...formData, [name]: formattedValue });
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
      const token = localStorage.getItem("token");
      let payloadValue = value;

      // Convert budget from currency string to float before sending to API
      if (fieldName === "budget") {
        // Remove currency symbol, commas and convert to float
        const numericValue = value.replace(/[$,]/g, "");
        payloadValue = parseFloat(numericValue);
      }

      // Handle comments separately
      if (fieldName === "comments") {
        await handleCommentUpdate(value);
        return;
      }

      const response = await axios.patch(
        `/api/user/${userId}`,
        {
          [fieldName]: payloadValue,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        await fetchUser();
        // Clear the form field after successful update
        setFormData((prevData) => ({
          ...prevData,
          [fieldName]: "",
        }));
      }
    } catch (error) {
      console.error(`Error updating field ${fieldName}:`, error);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Error response:", error.response.data);
        console.error("Error status:", error.response.status);
      } else if (error.request) {
        // The request was made but no response was received
        console.error("No response received:", error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error setting up request:", error.message);
      }
    }
  };

  const handleCommentUpdate = async (comment) => {
    try {
      const response = await axiosInstance.post(`/comment`, {
        idUser: userId,
        comment,
      });
      if (response.status === 200 || response.status === 201) {
        // Fetch updated user data to refresh comments
        await fetchUser();
        // Clear the comments field after successful update
        setFormData((prevData) => ({
          ...prevData,
          comments: "",
        }));
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      if (error.response) {
        console.error("Error response:", error.response.data);
        console.error("Error status:", error.response.status);
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Error setting up request:", error.message);
      }
    }
  };

  const handleStatusUpdate = async () => {
    try {
      const response = await axiosInstance.patch(`/api/userProcess/${userId}`, {
        status: userStatus,
      });
      if (response.status === 200) {
        router.push("/profiler"); // Redirect to /profiler after successful update
      }
    } catch (error) {
      console.error("Error updating user status:", error);
      if (error.response) {
        console.error("Error response:", error.response.data);
        console.error("Error status:", error.response.status);
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Error setting up request:", error.message);
      }
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
                    onBlur={(e) => {
                      const formattedValue = formatCurrency(e.target.value);
                      setFormData({ ...formData, budget: formattedValue });
                    }}
                    fullWidth
                    type="text"
                    inputProps={{
                      inputMode: "numeric",
                      pattern: "[0-9,]*",
                      placeholder: "Ingrese el presupuesto",
                    }}
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
                {
                  label: "Telefono",
                  name: "mainPhone",
                  type: "tel",
                  inputProps: {
                    maxLength: 17,
                    pattern: "(d{2})-d{2}-d{2}-d{2}-d{2}",
                    placeholder: "(XX)-XX-XX-XX-XX",
                  },
                },
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
                      onChange={
                        field.name === "mainPhone"
                          ? handlePhoneChange
                          : handleInputChange
                      }
                      fullWidth
                      type={field.type || "text"}
                      inputProps={field.inputProps}
                      error={
                        field.name === "mainPhone" &&
                        formData[field.name] &&
                        !/^\(\d{2}\)-\d{2}-\d{2}-\d{2}-\d{2}$/.test(
                          formData[field.name]
                        )
                      }
                      helperText={
                        field.name === "mainPhone" &&
                        formData[field.name] &&
                        !/^\(\d{2}\)-\d{2}-\d{2}-\d{2}-\d{2}$/.test(
                          formData[field.name]
                        )
                          ? "Ingrese un número de teléfono válido (ej: (55)-12-34-56-78)"
                          : ""
                      }
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
                { label: "Colonia", name: "suburb" },
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

              {/* <Grid size={12} sx={{ height: "60px" }}>
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
              </Grid> */}
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
                <Typography>
                  <strong>Presupuesto:</strong>{" "}
                  {user.budget
                    ? new Intl.NumberFormat("es-MX", {
                        style: "currency",
                        currency: "MXN",
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }).format(user.budget)
                    : ""}
                </Typography>
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
                  <strong>Colonia:</strong> {user.suburb}
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

              {/* <Grid size={12} sx={{ height: "60px" }}>
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
              </Grid> */}
              <Grid size={12} sx={{ height: "60px" }}>
                <Typography variant="h6">Comentario</Typography>
              </Grid>
              <Grid container size={12}>
                <Box sx={{ width: "100%" }}>
                  {user.comments && user.comments.length > 0 ? (
                    user.comments.map((comment) => (
                      <Box
                        key={comment.idComment}
                        sx={{
                          backgroundColor: "#f5f5f5",
                          borderRadius: "8px",
                          padding: "12px",
                          marginBottom: "12px",
                          boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
                        }}
                      >
                        <Typography
                          sx={{
                            color: "#666",
                            fontSize: "0.9rem",
                            marginBottom: "4px",
                          }}
                        >
                          {new Date(comment.recordDate).toLocaleString(
                            "es-MX",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </Typography>
                        <Typography
                          sx={{
                            color: "#333",
                            fontSize: "1rem",
                            lineHeight: "1.5",
                          }}
                        >
                          {comment.comment}
                        </Typography>
                        <Typography
                          sx={{
                            color: "#888",
                            fontSize: "0.8rem",
                            marginTop: "4px",
                            textTransform: "capitalize",
                          }}
                        >
                          {comment.role}
                        </Typography>
                      </Box>
                    ))
                  ) : (
                    <Typography
                      sx={{
                        color: "#666",
                        fontStyle: "italic",
                        textAlign: "center",
                        padding: "20px",
                      }}
                    >
                      No hay comentarios registrados
                    </Typography>
                  )}
                </Box>
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
