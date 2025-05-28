"use client";
import React from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import TopNavigationBar from "@/components/TopNavigationBar";
import BottomNavigationBar from "@/components/BottomNavigationBar";
import ContactForm from "@/components/ContactForm";
import {
  CheckCircle as CheckCircleIcon,
  TrendingUp as TrendingUpIcon,
  Security as SecurityIcon,
  Support as SupportIcon,
  AccountBalance as AccountBalanceIcon,
  Assignment as AssignmentIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
} from "@mui/icons-material";

export default function AsesoriaPage() {
  // Handle form submission
  const handleContactSubmit = async (userData) => {
    try {
      // Here you would typically send the data to your API
      console.log("Advisory contact form submitted:", userData);

      // For now, we'll simulate a successful submission
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // You can integrate with your existing contact API here
      // return await api.submitAdvisoryContact(userData);

      return { success: true };
    } catch (error) {
      throw new Error("Error al enviar la solicitud de asesoría");
    }
  };

  const handleFormSuccess = () => {
    console.log("Advisory form submitted successfully!");
  };

  const services = [
    // {
    //   icon: TrendingUpIcon,
    //   title: "Inversión Inmobiliaria",
    //   description:
    //     "Te ayudamos a identificar las mejores oportunidades de inversión en el mercado actual.",
    // },
    {
      icon: SecurityIcon,
      title: "Asesoría Legal",
      description:
        "Acompañamiento completo en todos los aspectos legales de tu transacción inmobiliaria.",
    },
    {
      icon: AccountBalanceIcon,
      title: "Financiamiento",
      description:
        "Te conectamos con las mejores opciones de crédito hipotecario del mercado.",
    },
    // {
    //   icon: AssignmentIcon,
    //   title: "Valuación Profesional",
    //   description:
    //     "Obtén el valor real de tu propiedad con nuestros avalúos certificados.",
    // },
    {
      icon: SupportIcon,
      title: "Acompañamiento Integral",
      description:
        "Te acompañamos desde la búsqueda hasta la entrega de llaves de tu nueva propiedad.",
    },
  ];

  const benefits = [
    "Más de 10 años de experiencia en el mercado inmobiliario mexicano",
    "Equipo de asesores certificados y especializados",
    "Red de contactos con desarrolladores, notarios y instituciones financieras",
    "Proceso transparente y sin comisiones ocultas",
    "Seguimiento personalizado durante todo el proceso",
    // "Acceso exclusivo a propiedades  pre-venta y oportunidades únicas",
  ];

  return (
    <>
      {/* Top Navigation Bar for Desktop/Tablet */}
      <TopNavigationBar />

      <Container
        maxWidth="lg"
        sx={{ py: { xs: 3, md: 4 }, mb: { xs: 10, md: 4 } }}
      >
        {/* Hero Section */}
        <Paper
          elevation={0}
          sx={{
            background:
              "linear-gradient(135deg, rgba(240, 185, 43, 0.08) 0%, rgba(255, 255, 255, 0.95) 100%)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(240, 185, 43, 0.3)",
            borderRadius: 4,
            p: { xs: 3, md: 5 },
            mb: 4,
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "4px",
              background:
                "linear-gradient(90deg, #F0B92B 0%, rgba(240, 185, 43, 0.6) 100%)",
            },
          }}
        >
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontSize: { xs: "2rem", md: "3rem" },
                fontWeight: 700,
                color: "#37474F",
                mb: 2,
                lineHeight: 1.2,
              }}
            >
              Asesoría Inmobiliaria
              <Box component="span" sx={{ color: "#F0B92B" }}>
                {" "}
                Profesional
              </Box>
            </Typography>

            <Typography
              variant="h5"
              sx={{
                fontSize: { xs: "1.1rem", md: "1.3rem" },
                color: "text.secondary",
                maxWidth: 800,
                mx: "auto",
                lineHeight: 1.6,
              }}
            >
              Expertos en bienes raíces comprometidos con encontrar la solución
              perfecta para tus necesidades inmobiliarias. Tu sueño de hogar,
              nuestra misión.
            </Typography>
          </Box>
        </Paper>

        {/* Services Section */}
        <Box sx={{ mb: 5 }}>
          <Typography
            variant="h4"
            component="h2"
            sx={{
              fontSize: { xs: "1.8rem", md: "2.2rem" },
              fontWeight: 600,
              color: "#37474F",
              mb: 3,
              textAlign: "center",
            }}
          >
            Nuestros Servicios
          </Typography>

          <Grid container spacing={3}>
            {services.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <Grid item xs={12} md={6} key={index}>
                  <Card
                    sx={{
                      height: "100%",
                      borderRadius: 3,
                      border: "1px solid rgba(240, 185, 43, 0.2)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 8px 25px rgba(240, 185, 43, 0.15)",
                        borderColor: "rgba(240, 185, 43, 0.4)",
                      },
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 2,
                        }}
                      >
                        <Box
                          sx={{
                            width: 50,
                            height: 50,
                            borderRadius: "50%",
                            background:
                              "linear-gradient(135deg, #F0B92B 0%, #E6A623 100%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <IconComponent
                            sx={{ fontSize: "1.5rem", color: "white" }}
                          />
                        </Box>
                        <Box>
                          <Typography
                            variant="h6"
                            sx={{
                              fontSize: "1.1rem",
                              fontWeight: 600,
                              color: "#37474F",
                              mb: 1,
                            }}
                          >
                            {service.title}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: "text.secondary",
                              lineHeight: 1.6,
                            }}
                          >
                            {service.description}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Box>

        {/* Main Content Grid */}
        <Grid container spacing={4}>
          {/* Benefits Section */}
          <Grid item xs={12} md={8}>
            <Paper
              sx={{
                p: { xs: 3, md: 4 },
                borderRadius: 3,
                border: "1px solid rgba(240, 185, 43, 0.2)",
                background: "rgba(255, 255, 255, 0.8)",
                backdropFilter: "blur(10px)",
              }}
            >
              <Typography
                variant="h5"
                component="h3"
                sx={{
                  fontSize: { xs: "1.3rem", md: "1.5rem" },
                  fontWeight: 600,
                  color: "#37474F",
                  mb: 3,
                }}
              >
                ¿Por qué elegir Minkaasa?
              </Typography>

              <List sx={{ p: 0 }}>
                {benefits.map((benefit, index) => (
                  <ListItem key={index} sx={{ px: 0, py: 1 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <CheckCircleIcon
                        sx={{ color: "#F0B92B", fontSize: "1.2rem" }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={benefit}
                      sx={{
                        "& .MuiListItemText-primary": {
                          fontSize: { xs: "0.9rem", md: "1rem" },
                          lineHeight: 1.6,
                          color: "text.primary",
                        },
                      }}
                    />
                  </ListItem>
                ))}
              </List>

              <Divider sx={{ my: 3 }} />

              {/* Contact Information */}
              <Typography
                variant="h6"
                sx={{
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  color: "#37474F",
                  mb: 2,
                }}
              >
                Información de Contacto
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <PhoneIcon sx={{ color: "#F0B92B", fontSize: "1.2rem" }} />
                  <Typography variant="body2" sx={{ fontSize: "0.95rem" }}>
                    +52 55 1234 5678
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <EmailIcon sx={{ color: "#F0B92B", fontSize: "1.2rem" }} />
                  <Typography variant="body2" sx={{ fontSize: "0.95rem" }}>
                    contacto@minkaasa.com
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <LocationIcon sx={{ color: "#F0B92B", fontSize: "1.2rem" }} />
                  <Typography variant="body2" sx={{ fontSize: "0.95rem" }}>
                    Ciudad de México, México
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Contact Form Section */}
          <Grid item xs={12} md={4}>
            <Paper
              sx={{
                p: { xs: 3, md: 4 },
                borderRadius: 3,
                border: "1px solid rgba(240, 185, 43, 0.3)",
                background:
                  "linear-gradient(135deg, rgba(240, 185, 43, 0.05) 0%, rgba(255, 255, 255, 0.95) 100%)",
                backdropFilter: "blur(10px)",
                position: "sticky",
                top: 20,
              }}
            >
              <Typography
                variant="h6"
                component="h3"
                sx={{
                  fontSize: { xs: "1.1rem", md: "1.2rem" },
                  fontWeight: 600,
                  color: "#37474F",
                  mb: 2,
                  textAlign: "center",
                }}
              >
                Solicita tu Asesoría Gratuita
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  mb: 3,
                  textAlign: "center",
                  lineHeight: 1.5,
                }}
              >
                Completa el formulario y uno de nuestros asesores se pondrá en
                contacto contigo
              </Typography>

              <ContactForm
                onSubmit={handleContactSubmit}
                onSuccess={handleFormSuccess}
                submitLabel="Solicitar Asesoría"
                sendingLabel="Enviando solicitud..."
                sentLabel="Solicitud enviada"
                sx={{
                  "& .MuiTextField-root": {
                    mb: 2,
                  },
                  "& .MuiButton-root": {
                    mt: 1,
                  },
                }}
              />
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Bottom Navigation Bar for Mobile */}
      <BottomNavigationBar />
    </>
  );
}
