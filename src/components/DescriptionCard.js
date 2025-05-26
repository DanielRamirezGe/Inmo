import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";

/**
 * Componente para mostrar una tarjeta de descripción con un icono y contenido
 *
 * @param {Object} props - Propiedades del componente
 * @param {string} props.title - Título de la descripción
 * @param {string} props.description - Contenido de la descripción
 * @param {number} props.index - Índice para determinar qué icono mostrar
 * @param {Object} [props.sx] - Estilos adicionales para la tarjeta
 */
const DescriptionCard = ({ title, description, index, sx = {} }) => {
  // Seleccionar el icono según el índice
  const getIcon = () => {
    switch (index % 4) {
      case 0:
        return (
          <StarIcon
            color="primaryInverted"
            sx={{ fontSize: { xs: 22, md: 26 } }}
          />
        );
      case 1:
        return (
          <CheckCircleIcon
            color="primaryInverted"
            sx={{ fontSize: { xs: 22, md: 26 } }}
          />
        );
      case 2:
        return (
          <ThumbUpIcon
            color="primaryInverted"
            sx={{ fontSize: { xs: 22, md: 26 } }}
          />
        );
      case 3:
        return (
          <SentimentSatisfiedAltIcon
            color="primaryInverted"
            sx={{ fontSize: { xs: 22, md: 26 } }}
          />
        );
      default:
        return (
          <StarIcon
            color="primaryInverted"
            sx={{ fontSize: { xs: 22, md: 26 } }}
          />
        );
    }
  };

  return (
    <Card
      sx={{
        mb: { xs: 2, md: 3 },
        overflow: "hidden",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
        },
        borderRadius: 2,
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "primary.light",
        ...sx,
      }}
      elevation={1}
    >
      {/* Header de la Card */}
      <Box
        sx={{
          p: { xs: 2, md: 2.5 },
          borderBottom: "1px solid",
          borderColor: "divider",
          background:
            "linear-gradient(135deg, #FFFFFF 0%, rgba(255, 207, 64, 0.2) 80%)",
          display: "flex",
          alignItems: "center",
          gap: 1.5,
        }}
      >
        <Box
          className="icon-circle-primary"
          sx={{
            width: { xs: 40, md: 48 },
            height: { xs: 40, md: 48 },
            flexShrink: 0,
          }}
        >
          {getIcon()}
        </Box>
        <Typography
          variant="h6"
          sx={{
            fontSize: { xs: "0.95rem", md: "1.25rem" },
            fontWeight: 600,
            color: "secondary.main",
            lineHeight: 1.3,
          }}
        >
          {title}
        </Typography>
      </Box>

      {/* Contenido de la Card */}
      <CardContent
        sx={{
          p: { xs: 2.5, md: 3 },
          bgcolor: "background.paper",
          "&:last-child": { pb: 2.5 },
        }}
      >
        <Typography
          variant="body1"
          component="div"
          sx={{
            whiteSpace: "pre-wrap",
            overflowWrap: "break-word",
            fontSize: { xs: "0.8rem", md: "0.95rem" },
            lineHeight: { xs: 1.4, md: 1.7 },
            color: "text.secondary",
            "& strong": {
              color: "secondary.main",
              fontWeight: 600,
            },
          }}
        >
          {description.split("\n").map((paragraph, i) => {
            if (paragraph.startsWith("•")) {
              return (
                <Box
                  key={i}
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    mb: 1.5,
                    pl: { xs: 0.5, md: 1 },
                  }}
                >
                  <Box
                    component={index % 2 === 0 ? StarIcon : CheckCircleIcon}
                    sx={{
                      fontSize: { xs: "0.8rem", md: "1rem" },
                      color: "primary.main",
                      mt: 0.4,
                      mr: 1.5,
                      flexShrink: 0,
                    }}
                  />
                  <Typography
                    component="span"
                    sx={{
                      fontSize: { xs: "0.8rem", md: "0.95rem" },
                      lineHeight: { xs: 1.4, md: 1.6 },
                      color: "text.secondary",
                    }}
                  >
                    {paragraph.replace("•", "").trim()}
                  </Typography>
                </Box>
              );
            } else if (paragraph.trim() !== "") {
              return (
                <Typography
                  key={i}
                  component="div"
                  sx={{
                    mb: 2,
                    fontSize: { xs: "0.8rem", md: "0.95rem" },
                    lineHeight: { xs: 1.4, md: 1.6 },
                    color: "text.secondary",
                  }}
                >
                  {paragraph}
                </Typography>
              );
            }
            return null;
          })}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default DescriptionCard;
