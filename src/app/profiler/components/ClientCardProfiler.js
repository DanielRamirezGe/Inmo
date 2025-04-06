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
  Collapse,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { useRouter } from "next/navigation"; // Import useRouter
import axios from "axios";
import { styled } from "@mui/material/styles";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import Grid from "@mui/material/Grid2";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CommentsSection from "./CommentsSection";
import { useAxiosMiddleware } from "../../../utils/axiosMiddleware";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function ClientCard({ client, statusOptions, refreshData }) {
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
  const [expandedFirstContact, setExpandedFirstContact] = React.useState(false);
  const [expandedGoodbye, setExpandedGoodbye] = React.useState(false);
  const [firstContactSent, setFirstContactSent] = React.useState(
    client.introduceMessage || false
  );
  const [goodbyeSent, setGoodbyeSent] = React.useState(
    client.endMessage || false
  );
  const [confirmationModalOpen, setConfirmationModalOpen] =
    React.useState(false);
  const axiosInstance = useAxiosMiddleware();
  const [notInterestedModalOpen, setNotInterestedModalOpen] =
    React.useState(false);
  const [assignCloserModalOpen, setAssignCloserModalOpen] =
    React.useState(false);

  const handleCallButtonClick = () => {
    setCallModalOpen(true);
  };

  const handleCallModalClose = () => {
    setCallModalOpen(false);
  };

  const handleFormModalClose = () => {
    setFormModalOpen(false);
  };

  const handleCallOptionSelect = async (option) => {
    try {
      if (option === "contesto") {
        router.push(`/profiler/userProcess/${client.idUserProcess}`);
      } else if (option === "no-contesto") {
        const token = localStorage.getItem("token");
        const response = await axios.patch(
          `/api/userProcess/${client.idUserProcess}`,
          {
            initialCall: true,
            contactMessage: false,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          setCallModalOpen(false);
          refreshData();
        }
      }
    } catch (error) {
      console.error("Error updating contact message:", error);
      setCallModalOpen(false);
    }
  };

  const handleMessageOptionSelect = async (option) => {
    try {
      if (option === "contesto") {
        router.push(`/profiler/userProcess/${client.idUserProcess}`);
      } else if (option === "no-contesto") {
        setConfirmationModalOpen(true); // Abre el modal de confirmación para descartar
      }
    } catch (error) {
      console.error("Error in message option select:", error);
    }
  };

  const handleWhatsAppMessage = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        `/api/userProcess/${client.idUserProcess}`,
        {
          contactMessage: true,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        // Limpiamos el número de teléfono de cualquier carácter no numérico
        const phoneNumber = client.mainPhone.replace(/\D/g, "");

        // Aseguramos que el número tenga el formato correcto
        let formattedPhone = phoneNumber;
        if (!phoneNumber.startsWith("52")) {
          formattedPhone = `52${phoneNumber}`;
        }

        const message =
          `Hola ${client.name}! 👋\n\n` +
          `Mi nombre es ${client.profilerName}, soy asesor especializado de Minkaasa Inmobiliaria.\n\n` +
          `Me comunico contigo porque recibimos tu solicitud de información sobre propiedades. ` +
          `En Minkaasa nos especializamos en encontrar la casa ideal para ti y tu familia.\n\n` +
          `Te gustaría que conversemos sobre las opciones que tenemos disponibles?`;

        const encodedMessage = encodeURIComponent(message);

        // Intentamos primero con api.whatsapp.com
        const whatsappUrl = `https://api.whatsapp.com/send?phone=${formattedPhone}&text=${encodedMessage}`;

        // Abrimos en nueva ventana
        window.open(whatsappUrl, "_blank");
        refreshData();
      }
    } catch (error) {
      console.error("Error updating contact message:", error);
      if (error.response) {
        console.error("Error response:", error.response.data);
        console.error("Error status:", error.response.status);
      }
    }
  };

  const handleWhatsAppGoodbye = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        `/api/userProcess/${client.idUserProcess}`,
        {
          contactMessage: true,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        const phoneNumber = client.mainPhone.replace(/\D/g, "");
        let formattedPhone = phoneNumber;
        if (!phoneNumber.startsWith("52")) {
          formattedPhone = `52${phoneNumber}`;
        }

        const message =
          `Hola ${client.name}, gracias por tu tiempo. 👋\n\n` +
          `Entiendo que por el momento no estás interesado o no ha sido posible comunicarnos. ` +
          `Quedo a tus órdenes por si más adelante necesitas asesoría para encontrar tu hogar ideal.\n\n` +
          `¡Que tengas excelente día!\n` +
          `${client.profilerName}\n` +
          `Asesor Especializado Minkaasa Inmobiliaria`;

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://api.whatsapp.com/send?phone=${formattedPhone}&text=${encodedMessage}`;

        window.open(whatsappUrl, "_blank");
        refreshData();
      }
    } catch (error) {
      console.error("Error updating contact message:", error);
      if (error.response) {
        console.error("Error response:", error.response.data);
      }
    }
  };

  const handleWhatsAppOpen = () => {
    const phoneNumber = client.mainPhone.replace(/\D/g, "");
    let formattedPhone = phoneNumber;
    if (!phoneNumber.startsWith("52")) {
      formattedPhone = `52${phoneNumber}`;
    }
    window.open(
      `https://api.whatsapp.com/send?phone=${formattedPhone}`,
      "_blank"
    );
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
    setFormModalOpen(false);
  };

  const handleFirstContactCheck = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        `/api/userProcess/${client.idUserProcess}`,
        {
          introduceMessage: true,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setFirstContactSent(true);
        refreshData();
      }
    } catch (error) {
      console.error("Error updating first contact status:", error);
    }
  };

  const handleGoodbyeCheck = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        `/api/userProcess/${client.idUserProcess}`,
        {
          endMessage: true,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setGoodbyeSent(true);
        refreshData();
      }
    } catch (error) {
      console.error("Error updating goodbye contact status:", error);
    }
  };

  const handleConfirmNoAnswer = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        `/api/userProcess/${client.idUserProcess}`,
        {
          contactMessage: true,
          discarded: true,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setConfirmationModalOpen(false);
        setCallModalOpen(false);
        refreshData();
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleNotInterested = async () => {
    try {
      const token = localStorage.getItem("token");
      await axiosInstance.patch(`/api/userProcess/${client.idUserProcess}`, {
        interested: false,
        followUpMessage: true,
      });
      setNotInterestedModalOpen(false);
      refreshData();
    } catch (error) {
      console.error("Error marking as not interested:", error);
    }
  };

  const handleAssignCloser = async () => {
    try {
      const token = localStorage.getItem("token");
      await axiosInstance.patch(`/api/userProcess/${client.idUserProcess}`, {
        followUpMessage: true,
        interested: true,
      });
      setAssignCloserModalOpen(false);
      refreshData();
    } catch (error) {
      console.error("Error assigning to closer:", error);
    }
  };

  return (
    <Card
      sx={{
        maxWidth: 345,
        margin: 2,
        height: "fit-content",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          position: "relative",
          overflow: "visible",
        }}
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
        {statusOptions != "interested" &&
          statusOptions != "discarded" &&
          statusOptions != "all" && (
            <>
              <Typography variant="body2" color="text.secondary">
                Teléfono: {client.mainPhone}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Correo: {client.mainEmail}
              </Typography>
            </>
          )}
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
        {statusOptions === "message" && (
          <Box
            sx={{
              mt: 2,
              position: "relative",
              zIndex: 1,
            }}
          >
            <Box
              sx={{
                border: client.introduceMessage
                  ? "1px solid #25D366"
                  : "1px solid #e0e0e0",
                borderRadius: 1,
                overflow: "hidden",
                mb: 2,
                backgroundColor: "background.paper",
                boxShadow: client.introduceMessage
                  ? "0 0 5px rgba(37, 211, 102, 0.2)"
                  : "none",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  p: 2,
                  backgroundColor: client.introduceMessage
                    ? "rgba(37, 211, 102, 0.05)"
                    : "transparent",
                }}
                onClick={() => setExpandedFirstContact(!expandedFirstContact)}
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    flexGrow: 1,
                    color: client.introduceMessage ? "#25D366" : "text.primary",
                  }}
                >
                  Primer Contacto
                </Typography>
                <ExpandMore
                  expand={expandedFirstContact}
                  onClick={() => setExpandedFirstContact(!expandedFirstContact)}
                  aria-expanded={expandedFirstContact}
                  aria-label="mostrar mensaje inicial"
                >
                  <ExpandMoreIcon />
                </ExpandMore>
              </Box>

              <Collapse in={expandedFirstContact} timeout="auto" unmountOnExit>
                <Box sx={{ p: 2, bgcolor: "#f5f5f5" }}>
                  <Typography
                    variant="body2"
                    sx={{
                      whiteSpace: "pre-line",
                      mb: 2,
                      fontFamily: "inherit",
                      color: "text.primary",
                    }}
                  >
                    {`Hola ${client.name}! 👋

Mi nombre es ${client.profilerName}, soy asesor especializado de Minkaasa Inmobiliaria.

Me comunico contigo porque recibimos tu solicitud de información sobre propiedades. En Minkaasa nos especializamos en encontrar la casa ideal para ti y tu familia.

Te gustaría que conversemos sobre las opciones que tenemos disponibles?`}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Button
                      variant="contained"
                      startIcon={<WhatsAppIcon />}
                      onClick={handleWhatsAppMessage}
                      disabled={client.introduceMessage}
                      sx={{
                        flex: 1,
                        backgroundColor: "#25D366",
                        "&:hover": {
                          backgroundColor: "#128C7E",
                        },
                        "&.Mui-disabled": {
                          backgroundColor: "rgba(37, 211, 102, 0.5)",
                          color: "white",
                        },
                      }}
                    >
                      Presentación
                    </Button>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={client.introduceMessage || firstContactSent}
                          onChange={handleFirstContactCheck}
                          disabled={client.introduceMessage}
                          sx={{
                            color: "#25D366",
                            "&.Mui-checked": {
                              color: "#25D366",
                            },
                            "&.Mui-disabled": {
                              color: "#25D366",
                              opacity: 0.7,
                            },
                          }}
                        />
                      }
                      label="Enviado"
                      sx={{
                        margin: 0,
                        "& .MuiTypography-root": {
                          fontSize: "0.875rem",
                          color: "text.secondary",
                        },
                        "&.Mui-disabled": {
                          cursor: "not-allowed",
                        },
                      }}
                    />
                  </Box>
                </Box>
              </Collapse>
            </Box>
            <Box
              sx={{
                border: client.endMessage
                  ? "1px solid #25D366"
                  : "1px solid #e0e0e0",
                borderRadius: 1,
                overflow: "hidden",
                mb: 2,
                backgroundColor: "background.paper",
                boxShadow: client.endMessage
                  ? "0 0 5px rgba(37, 211, 102, 0.2)"
                  : "none",
              }}
            >
              <Box
                onClick={() => setExpandedGoodbye(!expandedGoodbye)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  p: 2,
                  backgroundColor: client.endMessage
                    ? "rgba(37, 211, 102, 0.05)"
                    : "transparent",
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    flexGrow: 1,
                    color: client.endMessage ? "#25D366" : "text.primary",
                  }}
                >
                  Mensaje de Despedida
                </Typography>
                <ExpandMore
                  expand={expandedGoodbye}
                  aria-expanded={expandedGoodbye}
                  aria-label="mostrar mensaje despedida"
                >
                  <ExpandMoreIcon />
                </ExpandMore>
              </Box>

              <Collapse in={expandedGoodbye} timeout="auto" unmountOnExit>
                <Box sx={{ p: 2, bgcolor: "#f5f5f5" }}>
                  <Typography
                    variant="body2"
                    sx={{
                      whiteSpace: "pre-line",
                      mb: 2,
                      fontFamily: "inherit",
                      color: "text.primary",
                    }}
                  >
                    {`Hola ${client.name}, gracias por tu tiempo. 👋

Entiendo que por el momento no estás interesado o no ha sido posible comunicarnos. Quedo a tus órdenes por si más adelante necesitas asesoría para encontrar tu hogar ideal.

¡Que tengas excelente día!
${client.profilerName}
Asesor Especializado Minkaasa Inmobiliaria`}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Button
                      variant="contained"
                      startIcon={<WhatsAppIcon />}
                      onClick={handleWhatsAppGoodbye}
                      disabled={client.endMessage}
                      sx={{
                        flex: 1,
                        backgroundColor: "#25D366",
                        "&:hover": {
                          backgroundColor: "#128C7E",
                        },
                        "&.Mui-disabled": {
                          backgroundColor: "rgba(37, 211, 102, 0.5)",
                          color: "white",
                        },
                      }}
                    >
                      Despedida
                    </Button>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={client.endMessage || goodbyeSent}
                          onChange={handleGoodbyeCheck}
                          disabled={client.endMessage}
                          sx={{
                            color: "#25D366",
                            "&.Mui-checked": {
                              color: "#25D366",
                            },
                            "&.Mui-disabled": {
                              color: "#25D366",
                              opacity: 0.7,
                            },
                          }}
                        />
                      }
                      label="Enviado"
                      sx={{
                        margin: 0,
                        "& .MuiTypography-root": {
                          fontSize: "0.875rem",
                          color: "text.secondary",
                        },
                        "&.Mui-disabled": {
                          cursor: "not-allowed",
                        },
                      }}
                    />
                  </Box>
                </Box>
              </Collapse>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<WhatsAppIcon />}
                onClick={handleWhatsAppOpen}
                sx={{
                  backgroundColor: "#25D366",
                  "&:hover": {
                    backgroundColor: "#128C7E",
                  },
                }}
              >
                Abrir WhatsApp
              </Button>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleMessageOptionSelect("contesto")}
                  sx={{ flex: 1 }}
                >
                  Contestó
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => handleMessageOptionSelect("no-contesto")}
                  sx={{ flex: 1 }}
                >
                  No Contestó
                </Button>
              </Box>
            </Box>
          </Box>
        )}
        {statusOptions === "pending" && (
          <Box
            sx={{
              mt: 2,
              position: "relative",
              zIndex: 1,
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<WhatsAppIcon />}
                onClick={handleWhatsAppOpen}
                sx={{
                  backgroundColor: "#25D366",
                  "&:hover": {
                    backgroundColor: "#128C7E",
                  },
                }}
              >
                Abrir WhatsApp
              </Button>

              <CommentsSection
                idUser={client.idUser}
                existingComments={client.comments}
                refreshData={() => {
                  refreshData();
                }}
              />
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => setNotInterestedModalOpen(true)}
                  sx={{ flex: 1 }}
                >
                  No Interesado
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setAssignCloserModalOpen(true)}
                  sx={{ flex: 1 }}
                >
                  Asignar a Cerrador
                </Button>
              </Box>
            </Box>
          </Box>
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
              onClick={() => handleCallOptionSelect("contesto")}
              sx={{ flex: 1, marginRight: 1 }}
            >
              Contestó
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => handleCallOptionSelect("no-contesto")}
              sx={{ flex: 1, marginLeft: 1 }}
            >
              No Contestó
            </Button>
          </Box>
        </Box>
      </Modal>

      <Modal
        open={confirmationModalOpen}
        onClose={() => setConfirmationModalOpen(false)}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" component="h2" gutterBottom>
            Confirmar No Contestó
          </Typography>
          <Typography sx={{ mt: 2, mb: 3 }} color="text.secondary">
            ¿Estás seguro? Al confirmar, se marcará este cliente descartado.
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => setConfirmationModalOpen(false)}
              sx={{
                color: "text.secondary",
                borderColor: "text.secondary",
                "&:hover": {
                  borderColor: "text.primary",
                },
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              onClick={handleConfirmNoAnswer}
              sx={{
                bgcolor: "#f44336",
                "&:hover": {
                  bgcolor: "#d32f2f",
                },
              }}
            >
              Confirmar
            </Button>
          </Box>
        </Box>
      </Modal>

      <Dialog
        open={notInterestedModalOpen}
        onClose={() => setNotInterestedModalOpen(false)}
      >
        <DialogTitle>Confirmar No Interesado</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Está seguro que desea marcar este cliente como no interesado?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNotInterestedModalOpen(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleNotInterested}
            color="error"
            variant="contained"
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={assignCloserModalOpen}
        onClose={() => setAssignCloserModalOpen(false)}
      >
        <DialogTitle>Confirmar Asignación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Está seguro que desea asignar este cliente a un cerrador?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAssignCloserModalOpen(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleAssignCloser}
            color="primary"
            variant="contained"
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
