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
  currentTab,
  allDevelopers,
}) => {
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);
  const [publishing, setPublishing] = useState(false);

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

  // Función para obtener el nombre de la desarrolladora
  const getDeveloperName = (developerId) => {
    const developer = allDevelopers.find(
      (dev) => dev.realEstateDevelopmentId === developerId
    );
    return developer ? developer.realEstateDevelopmentName : "No especificado";
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
        return (
          <PropertyCard
            property={item}
            onWhatsAppClick={() => {
              /* Implementar lógica de WhatsApp */
            }}
            onAgendaClick={() => {
              /* Implementar lógica de Agenda */
            }}
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
            onClick={() =>
              onEdit(
                TAB_FORM_TYPE_MAP[currentTab] === FORM_TYPES.PROPERTY_PUBLISHED
                  ? "property"
                  : item
              )
            }
          >
            Editar
          </Button>
          {TAB_FORM_TYPE_MAP[currentTab] ===
            FORM_TYPES.PROPERTY_NOT_PUBLISHED && (
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
    </>
  );
};

export default ItemCard;
