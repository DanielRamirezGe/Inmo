import React, { useRef, useEffect } from "react";
import { Box, CircularProgress, Card } from "@mui/material";
import { useMainVideo } from "../hooks/useMainVideo";

export const MainVideo = () => {
  const { videoUrl, loading, error } = useMainVideo();
  const videoRef = useRef(null);

  // Manejar reproducción automática una sola vez
  useEffect(() => {
    const video = videoRef.current;
    if (video && videoUrl) {
      // Configurar el video para que se reproduzca una vez y luego se pause
      const handleEnded = () => {
        video.pause();
        // Remover el autoplay después del primer ciclo
        video.removeAttribute("autoplay");
      };

      video.addEventListener("ended", handleEnded);

      // Cleanup
      return () => {
        if (video) {
          video.removeEventListener("ended", handleEnded);
        }
      };
    }
  }, [videoUrl]);

  // Si hay error o no hay video, no mostrar nada
  if (error || !videoUrl) {
    return null;
  }

  // Mostrar loading state discreto
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60px",
          mb: { xs: 2, md: 3 },
        }}
      >
        <CircularProgress size={30} />
      </Box>
    );
  }

  // Mostrar video responsivo
  return (
    <Card
      sx={{
        mb: { xs: 2, md: 0 }, // Sin margen bottom en desktop cuando está al lado de imágenes
        boxShadow: { xs: 1, md: 2 }, // Sombra más sutil en móvil
        borderRadius: { xs: 2, md: 1 }, // Bordes redondeados en móvil para estética, pequeños en desktop
        overflow: "hidden",
        border: "1px solid",
        borderColor: "primary.light",
        // En móvil: márgenes mínimos para efecto "peek"
        mx: { xs: 0, md: 0 }, // Sin márgenes adicionales, el Container ya maneja el spacing
        height: {
          xs: "80vh", // 80% de altura de pantalla móvil para mostrar navbar
          md: "100%", // Altura completa en desktop para igualar las imágenes
        },
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: {
            xs: "80vh", // 80% de altura de pantalla móvil
            md: "100%", // Altura completa en desktop
          },
          paddingTop: {
            xs: 0, // Sin padding en móvil, usar altura real de viewport
            md: 0, // Sin padding en desktop, usar altura real
          },
          overflow: "hidden",
        }}
      >
        <Box
          component="video"
          ref={videoRef}
          autoPlay
          playsInline
          controls
          crossOrigin="anonymous"
          onError={() => {
            // Si hay error de reproducción, el componente padre se re-renderizará
            // y el hook manejará el estado de error
          }}
          sx={{
            position: "static", // Static en ambos casos ahora
            width: "100%",
            height: "100%",
            objectFit: "contain", // Cambio de 'cover' a 'contain' para mostrar video completo
          }}
        >
          <source src={videoUrl} type="video/mp4" />
        </Box>
      </Box>
    </Card>
  );
};
