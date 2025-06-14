import React from "react";
import {
  Box,
  Typography,
  LinearProgress,
  Card,
  CardContent,
  Chip,
  Alert,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

const ImageUploadProgress = ({
  uploadProgress,
  isVisible = false,
  operation = "upload", // 'upload' | 'delete' | 'mixed'
}) => {
  if (!isVisible || !uploadProgress.isUploading) {
    return null;
  }

  const { current, total, currentImageName } = uploadProgress;
  const progressPercentage = total > 0 ? (current / total) * 100 : 0;

  const getOperationIcon = () => {
    switch (operation) {
      case "delete":
        return <DeleteIcon sx={{ mr: 1, color: "error.main" }} />;
      case "mixed":
        return <CloudUploadIcon sx={{ mr: 1, color: "primary.main" }} />;
      default:
        return <CloudUploadIcon sx={{ mr: 1, color: "primary.main" }} />;
    }
  };

  const getOperationText = () => {
    switch (operation) {
      case "delete":
        return "Eliminando imágenes";
      case "mixed":
        return "Procesando imágenes";
      default:
        return "Subiendo imágenes";
    }
  };

  return (
    <Card
      sx={{
        mb: 3,
        border: "2px solid",
        borderColor: "primary.main",
        bgcolor: "primary.50",
      }}
    >
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          {getOperationIcon()}
          <Typography variant="h6" color="primary">
            {getOperationText()}
          </Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Progreso
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {current} de {total}
            </Typography>
          </Box>

          <LinearProgress
            variant="determinate"
            value={progressPercentage}
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: "grey.200",
              "& .MuiLinearProgress-bar": {
                borderRadius: 4,
                bgcolor: "primary.main",
              },
            }}
          />
        </Box>

        {currentImageName && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {operation === "delete" ? "Eliminando:" : "Procesando:"}
            </Typography>
            <Chip
              label={currentImageName}
              size="small"
              variant="outlined"
              color="primary"
            />
          </Box>
        )}

        {current === total && (
          <Alert severity="success" icon={<CheckCircleIcon />} sx={{ mt: 2 }}>
            {operation === "delete"
              ? `${total} imagen(es) eliminada(s) correctamente`
              : `${total} imagen(es) procesada(s) correctamente`}
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default ImageUploadProgress;
