"use client";
import React from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Alert,
  Grid,
  Card,
  CardContent,
  Fade,
  Slide,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Snackbar,
} from "@mui/material";
import {
  Person,
  Email,
  Phone,
  TrendingUp,
  Group,
  Support,
  Star,
  Handshake,
  MonetizationOn,
  Security,
  Visibility,
} from "@mui/icons-material";
import { useBrokerForm } from "../../hooks/useBrokerForm";

export default function BrokerPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  
  // Hook personalizado para manejar la lógica del formulario
  const {
    formData,
    errors,
    loading,
    success,
    snackbar,
    handleInputChange,
    handleSubmit,
    handleCloseSnackbar,
  } = useBrokerForm();

  // Beneficios para mostrar en la landing page
  const benefits = [
    {
      icon: <TrendingUp sx={{ color: "#F0B92B", fontSize: "2rem" }} />,
      title: "Crecimiento Exponencial",
      description: "Accede a un portafolio exclusivo de propiedades premium y maximiza tus comisiones.",
    },
    {
      icon: <Group sx={{ color: "#F0B92B", fontSize: "2rem" }} />,
      title: "Red de Clientes",
      description: "Conecta con compradores y vendedores calificados a través de nuestra plataforma.",
    },
    {
      icon: <Support sx={{ color: "#F0B92B", fontSize: "2rem" }} />,
      title: "Soporte Dedicado",
      description: "Recibe apoyo técnico y comercial para cerrar más ventas exitosamente.",
    },
    {
      icon: <MonetizationOn sx={{ color: "#F0B92B", fontSize: "2rem" }} />,
      title: "Comisiones Competitivas",
      description: "Disfruta de las mejores comisiones del mercado con pagos puntuales.",
    },
    {
      icon: <Security sx={{ color: "#F0B92B", fontSize: "2rem" }} />,
      title: "Plataforma Segura",
      description: "Trabaja con confianza en una plataforma tecnológica de vanguardia.",
    },
    {
      icon: <Visibility sx={{ color: "#F0B92B", fontSize: "2rem" }} />,
      title: "Visibilidad Garantizada",
      description: "Tus propiedades se destacan con marketing digital profesional.",
    },
  ];

  // Estadísticas para mostrar
//   const stats = [
//     { number: "500+", label: "Propiedades Activas" },
//     { number: "1000+", label: "Clientes Satisfechos" },
//     { number: "95%", label: "Tasa de Éxito" },
//     { number: "24/7", label: "Soporte Disponible" },
//   ];



  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#F5F5F5" }}>
      {/* Hero Section with Registration Form */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #F0B92B 0%, #E6A623 100%)",
          color: "white",
          py: { xs: 6, md: 10 },
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            {/* Left Side - Content */}
            <Grid item xs={12} md={6}>
              <Fade in timeout={1000}>
                <Box>
                  <Typography
                    variant="h2"
                    component="h1"
                    sx={{
                      fontWeight: 700,
                      fontSize: { xs: "2.5rem", md: "3.5rem" },
                      mb: 2,
                      lineHeight: 1.2,
                    }}
                  >
                    Únete a Nuestro Equipo de Brokers
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      mb: 3,
                      opacity: 0.9,
                      fontSize: { xs: "1.1rem", md: "1.3rem" },
                      lineHeight: 1.5,
                    }}
                  >
                    Forma parte de la red inmobiliaria más exitosa y crece tu negocio con Minkaasa
                  </Typography>
                  
                  {/* Estadísticas */}
                  {/* <Grid container spacing={2} sx={{ mt: 4 }}>
                    {stats.map((stat, index) => (
                      <Grid item xs={6} sm={3} key={index}>
                        <Box sx={{ textAlign: "center" }}>
                          <Typography
                            variant="h4"
                            sx={{
                              fontWeight: 700,
                              fontSize: { xs: "1.5rem", md: "2rem" },
                            }}
                          >
                            {stat.number}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              opacity: 0.8,
                              fontSize: { xs: "0.8rem", md: "0.9rem" },
                            }}
                          >
                            {stat.label}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid> */}
                </Box>
              </Fade>
            </Grid>
            
            {/* Right Side - Registration Form */}
            <Grid item xs={12} md={6}>
              <Slide direction="left" in timeout={1200}>
                <Paper
                  elevation={8}
                  sx={{
                    p: { xs: 3, md: 4 },
                    borderRadius: 3,
                    background: "rgba(255, 255, 255, 0.95)",
                    backdropFilter: "blur(10px)",
                    color: "#37474F",
                  }}
                >
                  <Box sx={{ textAlign: "center", mb: 3 }}>
                    <img
                      src="/mainBanner/minkaasa.png"
                      alt="Minkaasa Logo"
                      style={{
                        maxWidth: "200px",
                        height: "auto",
                        marginBottom: "1rem",
                      }}
                    />
                    <Typography
                      variant="h4"
                      component="h2"
                      sx={{
                        fontWeight: 600,
                        mb: 1,
                        color: "#37474F",
                      }}
                    >
                      ¡Regístrate Ahora!
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: "#607D8B",
                        lineHeight: 1.6,
                      }}
                    >
                      Completa el formulario y nuestro equipo se pondrá en contacto contigo en menos de 24 horas
                    </Typography>
                  </Box>

                  <Box component="form" onSubmit={handleSubmit} noValidate>
                    <Grid container spacing={2}>
                      {/* Nombre */}
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Nombre *"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          error={!!errors.name}
                          helperText={errors.name}
                          required
                          InputProps={{
                            startAdornment: <Person sx={{ mr: 1, color: "#F0B92B" }} />,
                          }}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              "&.Mui-focused fieldset": {
                                borderColor: "#F0B92B",
                              },
                            },
                            "& .MuiInputLabel-root.Mui-focused": {
                              color: "#F0B92B",
                            },
                          }}
                        />
                      </Grid>

                      {/* Apellido Paterno */}
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Apellido Paterno *"
                          value={formData.lastNameP}
                          onChange={(e) => handleInputChange("lastNameP", e.target.value)}
                          error={!!errors.lastNameP}
                          helperText={errors.lastNameP}
                          required
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              "&.Mui-focused fieldset": {
                                borderColor: "#F0B92B",
                              },
                            },
                            "& .MuiInputLabel-root.Mui-focused": {
                              color: "#F0B92B",
                            },
                          }}
                        />
                      </Grid>

                      {/* Apellido Materno */}
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Apellido Materno"
                          value={formData.lastNameM}
                          onChange={(e) => handleInputChange("lastNameM", e.target.value)}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              "&.Mui-focused fieldset": {
                                borderColor: "#F0B92B",
                              },
                            },
                            "& .MuiInputLabel-root.Mui-focused": {
                              color: "#F0B92B",
                            },
                          }}
                        />
                      </Grid>

                      {/* Teléfono */}
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Teléfono *"
                          value={formData.mainPhone}
                          onChange={(e) => handleInputChange("mainPhone", e.target.value)}
                          error={!!errors.mainPhone}
                          helperText={errors.mainPhone}
                          required
                          InputProps={{
                            startAdornment: <Phone sx={{ mr: 1, color: "#F0B92B" }} />,
                          }}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              "&.Mui-focused fieldset": {
                                borderColor: "#F0B92B",
                              },
                            },
                            "& .MuiInputLabel-root.Mui-focused": {
                              color: "#F0B92B",
                            },
                          }}
                        />
                      </Grid>

                      {/* Email */}
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Correo Electrónico *"
                          type="email"
                          value={formData.mainEmail}
                          onChange={(e) => handleInputChange("mainEmail", e.target.value)}
                          error={!!errors.mainEmail}
                          helperText={errors.mainEmail}
                          required
                          InputProps={{
                            startAdornment: <Email sx={{ mr: 1, color: "#F0B92B" }} />,
                          }}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              "&.Mui-focused fieldset": {
                                borderColor: "#F0B92B",
                              },
                            },
                            "& .MuiInputLabel-root.Mui-focused": {
                              color: "#F0B92B",
                            },
                          }}
                        />
                      </Grid>

                      {/* Botón de envío */}
                      <Grid item xs={12}>
                        <Button
                          type="submit"
                          variant="contained"
                          fullWidth
                          size="large"
                          disabled={loading}
                          startIcon={
                            loading ? (
                              <CircularProgress size={20} sx={{ color: "white" }} />
                            ) : (
                              <Handshake sx={{ fontSize: "1.25rem" }} />
                            )
                          }
                          sx={{
                            py: 2,
                            fontSize: "1.1rem",
                            fontWeight: 600,
                            bgcolor: "#F0B92B",
                            color: "#37474F",
                            "&:hover": {
                              bgcolor: "#D8A01F",
                            },
                            "&:disabled": {
                              bgcolor: "#F0B92B",
                              opacity: 0.7,
                            },
                          }}
                        >
                          {loading ? "Enviando..." : "¡Registrarme como Broker!"}
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                </Paper>
              </Slide>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Promotional Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
        <Grid container spacing={4} alignItems="center">
          {/* Left Side - Content */}
          <Grid item xs={12} md={6}>
            <Fade in timeout={800}>
              <Box>
                <Typography
                  variant="h3"
                  component="h2"
                  sx={{
                    fontWeight: 600,
                    color: "#37474F",
                    mb: 3,
                    fontSize: { xs: "2rem", md: "2.5rem" },
                  }}
                >
                  Promoción Especial para Brokers
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: "#607D8B",
                    mb: 4,
                    lineHeight: 1.6,
                  }}
                >
                  Descubre las ventajas exclusivas que tenemos preparadas para ti. 
                  Únete a nuestra red y aprovecha beneficios únicos diseñados para 
                  maximizar tu éxito en el mercado inmobiliario.
                </Typography>
                
                {/* Call to Action */}
                <Box sx={{ mt: 4 }}>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 600,
                      color: "#F0B92B",
                      mb: 2,
                    }}
                  >
                    ¡Regístrate ahora y obtén acceso exclusivo!
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: "#607D8B",
                      lineHeight: 1.6,
                    }}
                  >
                    Nuestro equipo se pondrá en contacto contigo para explicarte 
                    todos los detalles de esta promoción especial.
                  </Typography>
                </Box>
              </Box>
            </Fade>
          </Grid>
          
          {/* Right Side - Promotional Image */}
          <Grid item xs={12} md={6}>
            <Fade in timeout={1000}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 3,
                  overflow: "hidden",
                  boxShadow: "0 8px 32px rgba(240, 185, 43, 0.2)",
                  border: "1px solid rgba(240, 185, 43, 0.2)",
                  background: "rgba(255, 255, 255, 0.9)",
                  backdropFilter: "blur(10px)",
                  p: 2,
                }}
              >
                <img
                  src="/brokers/brokerPromo.jpeg"
                  alt="Promoción Especial para Brokers Minkaasa"
                  style={{
                    width: "100%",
                    maxWidth: "500px",
                    height: "auto",
                    display: "block",
                    borderRadius: "8px",
                  }}
                />
              </Box>
            </Fade>
          </Grid>
        </Grid>
      </Container>

      {/* Benefits Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
        <Typography
          variant="h3"
          component="h2"
          sx={{
            textAlign: "center",
            fontWeight: 600,
            color: "#37474F",
            mb: 6,
            fontSize: { xs: "2rem", md: "2.5rem" },
          }}
        >
          ¿Por qué elegir Minkaasa?
        </Typography>

        <Grid container spacing={4}>
          {benefits.map((benefit, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Fade in timeout={800 + index * 200}>
                <Card
                  sx={{
                    height: "100%",
                    borderRadius: 3,
                    border: "1px solid rgba(240, 185, 43, 0.2)",
                    background: "rgba(255, 255, 255, 0.9)",
                    backdropFilter: "blur(10px)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "0 12px 30px rgba(240, 185, 43, 0.2)",
                    },
                  }}
                >
                  <CardContent sx={{ p: 3, textAlign: "center" }}>
                    <Box sx={{ mb: 2 }}>{benefit.icon}</Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        color: "#37474F",
                        mb: 2,
                      }}
                    >
                      {benefit.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#607D8B",
                        lineHeight: 1.6,
                      }}
                    >
                      {benefit.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Fade>
            </Grid>
          ))}
        </Grid>
      </Container>



      {/* Testimonials Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
        <Typography
          variant="h3"
          component="h2"
          sx={{
            textAlign: "center",
            fontWeight: 600,
            color: "#37474F",
            mb: 6,
            fontSize: { xs: "2rem", md: "2.5rem" },
          }}
        >
          Lo que dicen nuestros brokers
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                p: 3,
                borderRadius: 3,
                border: "1px solid rgba(240, 185, 43, 0.2)",
                background: "rgba(255, 255, 255, 0.9)",
                backdropFilter: "blur(10px)",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} sx={{ color: "#F0B92B", fontSize: "1.2rem" }} />
                ))}
              </Box>
              <Typography
                variant="body1"
                sx={{
                  fontStyle: "italic",
                  color: "#607D8B",
                  mb: 2,
                  lineHeight: 1.6,
                }}
              >
                "Minkaasa me ha permitido crecer mi negocio inmobiliario de manera exponencial. 
                La plataforma es increíble y el soporte es excepcional."
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 600, color: "#37474F" }}
              >
                - María González
              </Typography>
              <Typography variant="body2" sx={{ color: "#607D8B" }}>
                Broker Senior
              </Typography>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card
              sx={{
                p: 3,
                borderRadius: 3,
                border: "1px solid rgba(240, 185, 43, 0.2)",
                background: "rgba(255, 255, 255, 0.9)",
                backdropFilter: "blur(10px)",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} sx={{ color: "#F0B92B", fontSize: "1.2rem" }} />
                ))}
              </Box>
              <Typography
                variant="body1"
                sx={{
                  fontStyle: "italic",
                  color: "#607D8B",
                  mb: 2,
                  lineHeight: 1.6,
                }}
              >
                "Las comisiones son las mejores del mercado y los pagos son puntuales. 
                Definitivamente recomiendo Minkaasa a todos los brokers."
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 600, color: "#37474F" }}
              >
                - Carlos Rodríguez
              </Typography>
              <Typography variant="body2" sx={{ color: "#607D8B" }}>
                Broker Independiente
              </Typography>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card
              sx={{
                p: 3,
                borderRadius: 3,
                border: "1px solid rgba(240, 185, 43, 0.2)",
                background: "rgba(255, 255, 255, 0.9)",
                backdropFilter: "blur(10px)",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} sx={{ color: "#F0B92B", fontSize: "1.2rem" }} />
                ))}
              </Box>
              <Typography
                variant="body1"
                sx={{
                  fontStyle: "italic",
                  color: "#607D8B",
                  mb: 2,
                  lineHeight: 1.6,
                }}
              >
                "La tecnología de Minkaasa es de vanguardia. Me ha ayudado a cerrar 
                más ventas en menos tiempo. ¡Excelente plataforma!"
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 600, color: "#37474F" }}
              >
                - Ana Martínez
              </Typography>
              <Typography variant="body2" sx={{ color: "#607D8B" }}>
                Broker Digital
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Snackbar para mensajes */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
