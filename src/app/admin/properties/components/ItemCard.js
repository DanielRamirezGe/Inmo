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
        <CardActions>
          <Button
            size="small"
            startIcon={<EditIcon />}
            onClick={() => onEdit(item)}
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
              color="success"
              disabled={publishing}
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
              color="warning"
              disabled={unpublishing}
            >
              {unpublishing ? "Procesando..." : "Dejar de publicar"}
            </Button>
          )}
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
