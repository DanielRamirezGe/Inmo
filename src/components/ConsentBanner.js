"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Box,
  Paper,
  Button,
  Typography,
  IconButton,
  Tooltip,
  Stack,
  Link as MUILink,
  Fade,
  Fab,
} from "@mui/material";
import { setPermisos, STORAGE_KEY } from "@/utils/analytics";
import { Cookie, Close } from "@mui/icons-material";

export default function ConsentMUI() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const saved = localStorage.getItem(STORAGE_KEY);
    console.log("saved",saved)
    const granted = saved === "true";
    console.log("granted",granted)

    setPermisos(granted);
    setVisible(!granted);
  }, []);

  const applyConsent = useCallback((granted) => {
    setPermisos(granted);
    localStorage.setItem(STORAGE_KEY, String(granted));
    setVisible(false);
  }, []);

  const handleAccept = () => applyConsent(true);
  const handleReject = () => applyConsent(false);
  const handleClose = () => {
    // Cerrar sin decidir no es recomendable; si quieres, puedes tratarlo como reject
    setVisible(false);
  };

  // Reabrir preferencias
  const openPreferences = () => setVisible(true);

  return (
    <>
        <Tooltip title="Preferencias de privacidad" placement="left">
          <Fab
            color="default"
            size="medium"
            onClick={openPreferences}
            sx={{
              position: "fixed",
              bottom: { xs: 16, sm: 20 },
              left: { xs: 16, sm: 20 },
              zIndex: (t) => t.zIndex.modal + 1,
            }}
          >
            <Cookie />
          </Fab>
        </Tooltip>

      {/* Banner de consentimiento */}
      <Fade in={visible} unmountOnExit>
        <Box
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: (t) => t.zIndex.snackbar,
            display: "flex",
            justifyContent: "center",
            px: 2,
            pb: 2,
          }}
        >
          <Paper
            elevation={8}
            sx={{
              width: "100%",
              maxWidth: 900,
              borderRadius: 2,
              p: 2,
              bgcolor: "background.paper",
            }}
          >
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              alignItems="center"
            >
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Permiso de analítica
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Usamos cookies y almacenamiento local para medir el uso de la
                  app y mejorar la experiencia. Puedes revisar detalles en
                  nuestra{" "}
                  <MUILink
                    href={"legal/privacidad"}
                    target="_blank"
                    rel="noopener"
                  >
                    política de privacidad
                  </MUILink>
                  .
                </Typography>
              </Box>

              <Stack direction="row" spacing={1} alignItems="center">
                <Button variant="outlined" onClick={handleReject}>
                  Rechazar
                </Button>
                <Button variant="contained" onClick={handleAccept}>
                  Aceptar
                </Button>

                <IconButton aria-label="cerrar" onClick={handleClose}>
                  <Close />
                </IconButton>
              </Stack>
            </Stack>
          </Paper>
        </Box>
      </Fade>
    </>
  );
}
