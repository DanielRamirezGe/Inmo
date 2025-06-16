import React, { useState } from "react";
import { Button } from "@mui/material";
import { Event } from "@mui/icons-material";
import AppointmentDialog from "./AppointmentDialog";

const AppointmentButton = ({
  prototypeId = null,
  propertyName = "",
  propertyData = null,
  variant = "contained",
  size = "medium",
  fullWidth = false,
  sx = {},
  children = "Agendar Visita",
  onSuccess = () => {},
  ...buttonProps
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleSuccess = () => {
    onSuccess();
    setDialogOpen(false);
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        fullWidth={fullWidth}
        startIcon={<Event />}
        onClick={handleOpenDialog}
        sx={{
          bgcolor: "primary.main",
          color: "secondary.main",
          "&:hover": {
            bgcolor: "primary.dark",
            transform: "translateY(-2px)",
            boxShadow: 4,
          },
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
          ...sx,
        }}
        {...buttonProps}
      >
        {children}
      </Button>

      <AppointmentDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        prototypeId={prototypeId}
        propertyName={propertyName}
        propertyData={propertyData}
        onSuccess={handleSuccess}
      />
    </>
  );
};

export default AppointmentButton;
