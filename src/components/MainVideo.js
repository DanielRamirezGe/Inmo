import React, { useRef, useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  Card,
  IconButton,
  Typography,
} from "@mui/material";
import { VolumeOff, VolumeUp } from "@mui/icons-material";
import { useMainVideo } from "../hooks/useMainVideo";

export const MainVideo = () => {
  const { videoUrl, loading, error } = useMainVideo();
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);
  const [showUnmutePrompt, setShowUnmutePrompt] = useState(true);

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

  // Configurar volumen cuando el video se carga
  useEffect(() => {
    const video = videoRef.current;
    if (video && videoUrl) {
      const handleLoadedData = () => {
        video.volume = 0.7; // Volumen al 70%
        video.muted = isMuted; // Usar el estado de muted
      };

      video.addEventListener("loadeddata", handleLoadedData);

      // Si el video ya está cargado, aplicar configuración inmediatamente
      if (video.readyState >= 2) {
        handleLoadedData();
      }

      // Cleanup
      return () => {
        if (video) {
          video.removeEventListener("loadeddata", handleLoadedData);
        }
      };
    }
  }, [videoUrl, isMuted]);

  // Función para activar/desactivar audio
  const toggleMute = () => {
    const video = videoRef.current;
    if (video) {
      const newMutedState = !isMuted;
      video.muted = newMutedState;
      setIsMuted(newMutedState);

      // Ocultar el prompt después del primer clic
      if (showUnmutePrompt) {
        setShowUnmutePrompt(false);
      }
    }
  };

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
          overflow: "visible", // Cambiar a visible para mostrar botones
        }}
      >
        <Box
          component="video"
          ref={videoRef}
          autoPlay
          playsInline
          controls
          muted={true}
          volume={0.7}
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

        {/* Botón flotante para activar audio */}
        {showUnmutePrompt && (
          <Box
            onClick={toggleMute}
            sx={{
              position: "absolute",
              top: 20,
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              alignItems: "center",
              gap: 1,
              backgroundColor: "rgba(255, 193, 7, 0.95)",
              borderRadius: 3,
              padding: "12px 20px",
              color: "#000",
              zIndex: 1000,
              boxShadow: "0 6px 20px rgba(255, 193, 7, 0.4)",
              cursor: "pointer",
              animation: "bounce 1s infinite",
              "@keyframes bounce": {
                "0%, 20%, 50%, 80%, 100%": {
                  transform: "translateX(-50%) translateY(0)",
                },
                "40%": { transform: "translateX(-50%) translateY(-10px)" },
                "60%": { transform: "translateX(-50%) translateY(-5px)" },
              },
              "&:hover": {
                backgroundColor: "rgba(255, 193, 7, 1)",
                transform: "translateX(-50%) scale(1.05)",
              },
            }}
          >
            <VolumeOff sx={{ fontSize: 20 }} />
            <Typography
              variant="body2"
              sx={{ fontSize: "0.9rem", fontWeight: 700 }}
            >
              ¡Activa el audio!
            </Typography>
          </Box>
        )}

        {/* Botón de control de audio siempre visible */}
        <IconButton
          onClick={toggleMute}
          sx={{
            position: "absolute",
            bottom: 16,
            right: 16,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            color: "white",
            zIndex: 999,
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.9)",
              transform: "scale(1.1)",
            },
            transition: "all 0.2s ease-in-out",
          }}
        >
          {isMuted ? <VolumeOff /> : <VolumeUp />}
        </IconButton>
      </Box>
    </Card>
  );
};
