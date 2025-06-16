import React from "react";
import {
  Dialog,
  DialogContent,
  IconButton,
  Box,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import AppointmentScheduler from "./AppointmentScheduler";

const AppointmentDialog = ({
  open,
  onClose,
  prototypeId = null,
  propertyName = "",
  propertyData = null,
  onSuccess = () => {},
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleSuccess = () => {
    onSuccess();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      fullScreen={false}
      scroll="body"
      PaperProps={{
        sx: {
          borderRadius: { xs: 2, md: 3 },
          maxHeight: { xs: "95vh", md: "90vh" },
          overflow: "hidden",
          m: { xs: 0.5, md: 2 },
          width: { xs: "calc(100% - 8px)", md: "auto" },
          maxWidth: { xs: "100%", md: "800px" },
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          backdropFilter: "blur(10px)",
        },
      }}
      BackdropProps={{
        sx: {
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          backdropFilter: "blur(4px)",
        },
      }}
    >
      <Box
        sx={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        {/* Close Button */}
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            zIndex: 1000,
            bgcolor: "rgba(255, 255, 255, 0.95)",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            width: 44,
            height: 44,
            "&:hover": {
              bgcolor: "rgba(255, 255, 255, 1)",
              transform: "scale(1.05)",
              boxShadow: "0 6px 16px rgba(0, 0, 0, 0.2)",
            },
            transition: "all 0.2s ease",
          }}
        >
          <Close />
        </IconButton>

        <DialogContent
          sx={{
            p: { xs: 2, sm: 3, md: 4 },
            display: "flex",
            flexDirection: "column",
            overflow: "auto",
            background:
              "linear-gradient(135deg, #fffdf7 0%, #fefcf3 50%, #fdf9e8 100%)",
            maxHeight: { xs: "95vh", md: "90vh" },
            minHeight: { xs: "auto", md: "600px" },
          }}
        >
          <AppointmentScheduler
            prototypeId={prototypeId}
            propertyName={propertyName}
            propertyData={propertyData}
            onSuccess={handleSuccess}
            onCancel={onClose}
          />
        </DialogContent>
      </Box>
    </Dialog>
  );
};

export default AppointmentDialog;
