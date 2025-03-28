"use client";
import * as React from "react";
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Box,
  Button,
  Modal,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { useRouter } from "next/navigation"; // Import useRouter

export default function ClientCard({ client, statusOptions }) {
  const router = useRouter(); // Initialize router
  const [callModalOpen, setCallModalOpen] = React.useState(false); // State for the first modal
  const [formModalOpen, setFormModalOpen] = React.useState(false); // State for the form modal
  const [formData, setFormData] = React.useState({
    name: "",
    lastNameP: "",
    lastNameM: "",
    email: "",
    street: "",
    neighborhood: "",
    city: "",
    state: "",
    postalCode: "",
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
  }); // State for form data

  const handleCallButtonClick = () => {
    setCallModalOpen(true);
  };

  const handleCallModalClose = () => {
    setCallModalOpen(false);
  };

  const handleFormModalClose = () => {
    setFormModalOpen(false);
  };

  const handleOptionSelect = (option) => {
    setCallModalOpen(false);
    if (option === "contesto") {
      router.push(`/profiler/user/${client.idUser}`); // Redirect to the new page with client ID
    }
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

  const handleFormSubmit = () => {
    console.log("Form data submitted:", formData);
    setFormModalOpen(false);
  };

  return (
    <Card sx={{ maxWidth: 345, margin: 2, height: "100%" }}>
      <CardContent
        sx={{ display: "flex", flexDirection: "column", height: "100%" }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 2,
          }}
        >
          <Avatar sx={{ marginRight: 2, width: 56, height: 56 }}>
            <img
              src="user.jpg"
              alt="Client Photo"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </Avatar>
          <Typography variant="h6">
            {client.name} {client.lastNameP}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Teléfono: {client.mainPhone}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Correo: {client.mainEmail}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Comentario: {client.comment}
        </Typography>
        {client.quality &&
          client.quality.map((quality, index) => (
            <div key={`${client.mainEmail}-${client.mainPhone}`}>
              <Typography
                variant="body2"
                color="text.secondary"
                key={`${client.mainEmail}-${client.mainPhone}`}
              >
                Calidad: {quality.typeQuality}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Descripción: {quality.description}
              </Typography>
            </div>
          ))}
        {statusOptions === "call" && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleCallButtonClick}
            sx={{ marginTop: 2 }}
          >
            Realizar Llamada
          </Button>
        )}
      </CardContent>

      {/* Modal for call options */}
      <Modal open={callModalOpen} onClose={handleCallModalClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 300,
            bgcolor: "background.paper",
            p: 4,
            borderRadius: 2,
            boxShadow: 24,
          }}
        >
          <Typography variant="h6" gutterBottom>
            ¿Contestó la llamada?
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 2,
            }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleOptionSelect("contesto")}
              sx={{ flex: 1, marginRight: 1 }}
            >
              Contestó
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => handleOptionSelect("no-contesto")}
              sx={{ flex: 1, marginLeft: 1 }}
            >
              No Contestó
            </Button>
          </Box>
        </Box>
      </Modal>
    </Card>
  );
}
