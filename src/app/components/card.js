"use client";
import * as React from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import CardActionArea from "@mui/material/CardActionArea";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HouseIcon from "@mui/icons-material/House";
import BedIcon from "@mui/icons-material/Bed";
import ShowerIcon from "@mui/icons-material/Shower";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import Box from "@mui/material/Box";
import DialogImage from "./dialogImage";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Button from "@mui/material/Button";
import { useRouter } from "next/navigation"; // Asegúrate de importar desde 'next/router'
import { formatCurrency } from "../../utils/formatters";
const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme }) => ({
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
  variants: [
    {
      props: ({ expand }) => !expand,
      style: {
        transform: "rotate(0deg)",
      },
    },
    {
      props: ({ expand }) => !!expand,
      style: {
        transform: "rotate(180deg)",
      },
    },
  ],
}));

export default function CardHouse(props) {
  const { prototype, developmentName } = props;
  const [expanded, setExpanded] = React.useState(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down(330));
  const router = useRouter();

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState();

  const handleClickOpen = (imageList) => {
    setSelectedValue(imageList);
    setOpen(true);
  };

  const handleClose = (value) => {
    setOpen(false);
    setSelectedValue(value);
  };

  const handleViewDetails = (idHouse) => {
    router.push(`/singleHouse/${idHouse}`);
  };

  return (
    <>
      <DialogImage
        imageArray={selectedValue}
        open={open}
        onClose={handleClose}
        prototype={prototype}
      />
      <Card sx={{ maxWidth: 345 }}>
        <CardHeader
          title={prototype.nombrePrototipo}
          subheader={developmentName}
        />
        <CardActionArea
          onClick={() => handleClickOpen(prototype.imagenSecundaria)}
        >
          <CardMedia
            component="img"
            height="194"
            image={prototype.imagenPrincipal}
            alt={prototype.nombrePrototipo}
          />
        </CardActionArea>
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            {formatCurrency(prototype.precio)}
          </Typography>
          <CardActions disableSpacing onClick={handleExpandClick}>
            <Typography variant="body3" color="text.secondary">
              <Box
                display="flex"
                alignItems="center"
                sx={{ fontSize: "0.7rem" }}
              >
                <HouseIcon sx={{ fontSize: isSmallScreen ? 16 : 22 }} />{" "}
                {prototype.size} m2 |{" "}
                <BedIcon sx={{ fontSize: isSmallScreen ? 16 : 22 }} />{" "}
                {prototype.bed} |{" "}
                <ShowerIcon sx={{ fontSize: isSmallScreen ? 16 : 22 }} />{" "}
                {prototype.shower} |{" "}
                <DirectionsCarIcon sx={{ fontSize: isSmallScreen ? 16 : 22 }} />{" "}
                {prototype.car}
                <ExpandMore
                  expand={expanded}
                  onClick={handleExpandClick}
                  aria-expanded={expanded}
                  aria-label="show more"
                >
                  <ExpandMoreIcon />
                </ExpandMore>
              </Box>
            </Typography>
          </CardActions>
        </CardContent>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography sx={{ marginBottom: 2 }}>
              {prototype.shortDescription}
            </Typography>
          </CardContent>
          <CardActions>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <Button
                size="small"
                onClick={() => handleViewDetails(prototype.id)}
              >
                Ver la propiedad
              </Button>
            </Box>
          </CardActions>
        </Collapse>
      </Card>
    </>
  );
}
