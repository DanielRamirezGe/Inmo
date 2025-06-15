import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PublishIcon from "@mui/icons-material/Publish";
import UnpublishedIcon from "@mui/icons-material/Unpublished";
import apiConfig from "../../../../config/apiConfig";
import PropertyCard from "@/components/PropertyCard";
import axios from "axios";
import { FORM_TYPES, TAB_FORM_TYPE_MAP } from "../constants";

// Componente para las tarjetas de elementos
const ItemCard = ({
  item,
  onEdit,
  onDelete,
  onPublish,
  onUnpublish,
  currentTab,
  allDevelopers,
}) => {
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [unpublishDialogOpen, setUnpublishDialogOpen] = useState(false);
  const [unpublishing, setUnpublishing] = useState(false);

  const handlePublish = async () => {
    setPublishing(true);
    try {
      const success = await onPublish(item.prototypeId);
      if (success) {
        setPublishDialogOpen(false);
      }
    } catch (error) {
      console.error("Error publishing prototype:", error);
    } finally {
      setPublishing(false);
    }
  };

  const handleUnpublish = async () => {
    setUnpublishing(true);
    try {
      const success = await onUnpublish(item.prototypeId);
      if (success) {
        setUnpublishDialogOpen(false);
      }
    } catch (error) {
      console.error("Error unpublishing property:", error);
    } finally {
      setUnpublishing(false);
    }
  };

  // Función para obtener el nombre de la desarrolladora
  const getDeveloperName = (developerId) => {
    const developer = allDevelopers.find(
      (dev) => dev.realEstateDevelopmentId === developerId
    );
    return developer ? developer.realEstateDevelopmentName : "No especificado";
  };

  // Función para manejar la navegación a la página de preview
  const handlePreviewClick = () => {
    if (item.prototypeId) {
      window.open(`/admin/preview/${item.prototypeId}`, "_blank");
    }
  };

  const renderContent = () => {
    const currentFormType = TAB_FORM_TYPE_MAP[currentTab];

    switch (currentFormType) {
      case FORM_TYPES.DEVELOPER:
        return (
          <>
            <Typography variant="h6" component="div" noWrap>
              {item.realEstateDevelopmentName}
            </Typography>
            <Typography color="text.secondary" gutterBottom>
              URL: {item.url || "No especificada"}
            </Typography>
          </>
        );
      case FORM_TYPES.DEVELOPMENT:
        return (
          <>
            <Typography variant="h6" component="div" noWrap>
              {item.developmentName}
            </Typography>
            <Typography color="text.secondary" gutterBottom>
              Desarrolladora: {getDeveloperName(item.realEstateDevelopmentId)}
            </Typography>
            <Typography variant="body2">
              {item.state}, {item.city}
            </Typography>
          </>
        );
      case FORM_TYPES.PROPERTY_NOT_PUBLISHED:
      case FORM_TYPES.PROPERTY_PUBLISHED:
      case FORM_TYPES.PROPERTY_MINKAASA_UNPUBLISHED:
      case FORM_TYPES.PROPERTY_MINKAASA_PUBLISHED:
        return (
          <PropertyCard
            property={item}
            onAgendaClick={() => {
              /* Implementar lógica de Agenda */
            }}
            onDetailClick={handlePreviewClick}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Card
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <CardContent>{renderContent()}</CardContent>
        <CardActions sx={{ justifyContent: "space-between", px: 2 }}>
          {/* Botón de eliminar a la izquierda (separado) */}
          <Box>
            {(TAB_FORM_TYPE_MAP[currentTab] === FORM_TYPES.DEVELOPER ||
              TAB_FORM_TYPE_MAP[currentTab] === FORM_TYPES.DEVELOPMENT ||
              TAB_FORM_TYPE_MAP[currentTab] ===
                FORM_TYPES.PROPERTY_NOT_PUBLISHED ||
              TAB_FORM_TYPE_MAP[currentTab] ===
                FORM_TYPES.PROPERTY_MINKAASA_UNPUBLISHED) && (
              <Button
                size="small"
                startIcon={<DeleteIcon />}
                onClick={() => onDelete(item)}
                variant="outlined"
                sx={{
                  borderColor: "rgba(244, 67, 54, 0.6)",
                  color: "rgba(244, 67, 54, 0.8)",
                  backgroundColor: "rgba(244, 67, 54, 0.05)",
                  "&:hover": {
                    borderColor: "rgba(244, 67, 54, 0.8)",
                    color: "rgba(244, 67, 54, 1)",
                    backgroundColor: "rgba(244, 67, 54, 0.1)",
                    transform: "translateY(-1px)",
                    boxShadow: "0 4px 12px rgba(244, 67, 54, 0.2)",
                  },
                  "&:active": {
                    transform: "translateY(0)",
                  },
                }}
              >
                Eliminar
              </Button>
            )}
          </Box>

          {/* Botones de acción a la derecha */}
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              size="small"
              startIcon={<EditIcon />}
              onClick={() => onEdit(item)}
              variant="contained"
              sx={{
                bgcolor: "rgba(240, 185, 43, 0.9)",
                color: "#2C3E50",
                fontWeight: 600,
                "&:hover": {
                  bgcolor: "rgba(240, 185, 43, 1)",
                  transform: "translateY(-1px)",
                  boxShadow: "0 4px 12px rgba(240, 185, 43, 0.3)",
                },
                "&:active": {
                  transform: "translateY(0)",
                },
              }}
            >
              Editar
            </Button>

            {(TAB_FORM_TYPE_MAP[currentTab] ===
              FORM_TYPES.PROPERTY_NOT_PUBLISHED ||
              TAB_FORM_TYPE_MAP[currentTab] ===
                FORM_TYPES.PROPERTY_MINKAASA_UNPUBLISHED) && (
              <Button
                size="small"
                startIcon={<PublishIcon />}
                onClick={() => setPublishDialogOpen(true)}
                variant="contained"
                disabled={publishing}
                sx={{
                  bgcolor: "rgba(76, 175, 80, 0.8)",
                  color: "white",
                  "&:hover": {
                    bgcolor: "rgba(76, 175, 80, 0.9)",
                    transform: "translateY(-1px)",
                    boxShadow: "0 4px 12px rgba(76, 175, 80, 0.3)",
                  },
                  "&:disabled": {
                    bgcolor: "rgba(76, 175, 80, 0.4)",
                    color: "rgba(255, 255, 255, 0.7)",
                  },
                }}
              >
                {publishing ? "Publicando..." : "Publicar"}
              </Button>
            )}
            {(TAB_FORM_TYPE_MAP[currentTab] === FORM_TYPES.PROPERTY_PUBLISHED ||
              TAB_FORM_TYPE_MAP[currentTab] ===
                FORM_TYPES.PROPERTY_MINKAASA_PUBLISHED) && (
              <Button
                size="small"
                startIcon={<UnpublishedIcon />}
                onClick={() => setUnpublishDialogOpen(true)}
                variant="contained"
                disabled={unpublishing}
                sx={{
                  bgcolor: "rgba(255, 152, 0, 0.8)",
                  color: "white",
                  "&:hover": {
                    bgcolor: "rgba(255, 152, 0, 0.9)",
                    transform: "translateY(-1px)",
                    boxShadow: "0 4px 12px rgba(255, 152, 0, 0.3)",
                  },
                  "&:disabled": {
                    bgcolor: "rgba(255, 152, 0, 0.4)",
                    color: "rgba(255, 255, 255, 0.7)",
                  },
                }}
              >
                {unpublishing ? "Procesando..." : "Dejar de publicar"}
              </Button>
            )}
          </Box>
        </CardActions>
      </Card>

      {/* Modal de confirmación para publicar */}
      <Dialog
        open={publishDialogOpen}
        onClose={() => !publishing && setPublishDialogOpen(false)}
      >
        <DialogTitle>Confirmar publicación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas publicar este prototipo? Una vez
            publicado, estará visible para todos los usuarios.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setPublishDialogOpen(false)}
            disabled={publishing}
          >
            Cancelar
          </Button>
          <Button
            onClick={handlePublish}
            color="success"
            variant="contained"
            disabled={publishing}
          >
            {publishing ? "Publicando..." : "Publicar"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de confirmación para dejar de publicar */}
      <Dialog
        open={unpublishDialogOpen}
        onClose={() => !unpublishing && setUnpublishDialogOpen(false)}
      >
        <DialogTitle>Confirmar despublicación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas dejar de publicar esta propiedad? Una
            vez despublicada, no será visible para los usuarios.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setUnpublishDialogOpen(false)}
            disabled={unpublishing}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleUnpublish}
            color="warning"
            variant="contained"
            disabled={unpublishing}
          >
            {unpublishing ? "Procesando..." : "Dejar de publicar"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ItemCard;
