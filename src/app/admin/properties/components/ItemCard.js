import React from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import apiConfig from "../../../../config/apiConfig";
import PropertyCard from "@/components/PropertyCard";

// Componente para las tarjetas de elementos
const ItemCard = ({ item, onEdit, onDelete, currentTab, allDevelopers }) => {
  // Función para obtener el nombre de la desarrolladora
  const getDeveloperName = (developerId) => {
    const developer = allDevelopers.find(
      (dev) => dev.realEstateDevelopmentId === developerId
    );
    return developer ? developer.realEstateDevelopmentName : "No especificado";
  };

  const renderContent = () => {
    if (currentTab === 0) {
      // Desarrolladora
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
    } else if (currentTab === 1) {
      // Desarrollo
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
    } else if (currentTab === 2) {
      // Propiedad
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
    }
  };

  return (
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
          onClick={() => onEdit(currentTab === 3 ? "property" : item)}
        >
          Editar
        </Button>
        <Button
          size="small"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={() => onDelete(item)}
        >
          Eliminar
        </Button>
      </CardActions>
    </Card>
  );
};

export default ItemCard;
