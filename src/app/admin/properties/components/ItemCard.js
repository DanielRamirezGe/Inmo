import React from "react";
import { Box, Card, Typography, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

// Componente para las tarjetas de elementos
const ItemCard = ({ item, onEdit, onDelete, currentTab, allDevelopers }) => {
  // Función para obtener el nombre de la desarrolladora
  const getDeveloperName = (id) => {
    const developer = allDevelopers?.find(
      (dev) => dev.realEstateDevelopmentId === id
    );
    return developer
      ? developer.realEstateDevelopmentName
      : "Desarrolladora no encontrada";
  };

  return (
    <Card
      sx={{
        p: 2,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: 4,
        },
      }}
    >
      <Box>
        {/* Para Desarrolladoras */}
        {currentTab === 0 && (
          <>
            <Typography variant="h6" gutterBottom noWrap>
              {item.realEstateDevelopmentName}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              URL: {item.url || "No disponible"}
            </Typography>

            {item.contacts && item.contacts.length > 0 && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Contactos:
                </Typography>
                {item.contacts.map((contact, index) => (
                  <Box
                    key={contact.realEstateContactId || index}
                    sx={{ ml: 1, mb: 1 }}
                  >
                    <Typography variant="body2">
                      {`${contact.name} ${contact.lastNameP} ${contact.lastNameM}`}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {`${contact.role} - ${contact.mainPhone}`}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {contact.mainEmail}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
          </>
        )}

        {/* Para Desarrollos */}
        {currentTab === 1 && (
          <>
            <Typography variant="h6" gutterBottom noWrap>
              {item.developmentName}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Desarrolladora: {getDeveloperName(item.realEstateDevelopmentId)}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {`${item.street || ""} ${item.extNum || ""}${
                item.intNum ? ", Int. " + item.intNum : ""
              }`}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {`${item.city || ""}, ${item.state || ""} ${
                item.zipCode ? "- CP: " + item.zipCode : ""
              }`}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              URL: {item.url || "No disponible"}
            </Typography>

            {item.contacts && item.contacts.length > 0 && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Contactos:
                </Typography>
                {item.contacts.map((contact, index) => (
                  <Box
                    key={contact.developmentContactId || index}
                    sx={{ ml: 1, mb: 1 }}
                  >
                    <Typography variant="body2">
                      {`${contact.name} ${contact.lastNameP} ${contact.lastNameM}`}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {`${contact.role} - ${contact.mainPhone}`}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {contact.mainEmail}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
          </>
        )}

        {/* Para Agencias Externas */}
        {currentTab === 2 && (
          <>
            <Typography variant="h6" gutterBottom noWrap>
              {item.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {item.description}
            </Typography>
            <Typography variant="body2" gutterBottom>
              Contacto: {item.contactName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {item.contactPhone}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {item.contactEmail}
            </Typography>
          </>
        )}

        {/* Para Propiedades */}
        {currentTab === 3 && (
          <>
            <Typography variant="h6" gutterBottom noWrap>
              {item.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {item.description}
            </Typography>
            <Typography variant="body2" gutterBottom>
              Precio: ${item.price?.toLocaleString()}
            </Typography>
            <Typography variant="body2" gutterBottom>
              Ubicación: {item.location}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Tipo: {item.type} - Estado: {item.status}
            </Typography>
          </>
        )}
      </Box>

      <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
        <IconButton
          size="small"
          color="primary"
          onClick={() => onEdit(item)}
          sx={{ mr: 1 }}
        >
          <EditIcon />
        </IconButton>
        {currentTab !== 0 && (
          <IconButton size="small" color="error" onClick={() => onDelete(item)}>
            <DeleteIcon />
          </IconButton>
        )}
      </Box>
    </Card>
  );
};

export default ItemCard;
