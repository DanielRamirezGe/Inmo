import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";

// Componente de diálogo de confirmación para eliminar
const DeleteDialog = ({ open, onClose, onDelete, itemToDelete, loading }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirmar eliminación</DialogTitle>
      <DialogContent>
        <Typography>
          ¿Estás seguro de que deseas eliminar{" "}
          <strong>
            {itemToDelete?.realEstateDevelopmentName ||
              itemToDelete?.developmentName ||
              itemToDelete?.name ||
              itemToDelete?.title}
          </strong>
          ? Esta acción no se puede deshacer.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          color="error"
          onClick={onDelete}
          disabled={loading}
          sx={{
            color: "white",
            bgcolor: "error.main",
            "&:hover": { bgcolor: "error.dark" },
          }}
        >
          {loading ? <CircularProgress size={24} /> : "Eliminar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteDialog;
