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
import { useRouter } from "next/navigation";
import { formatCurrency } from "../../utils/formatters";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import Grid from "@mui/material/Grid2";

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
      <Card
        sx={{ width: "100%", boxShadow: 6, marginBottom: 2, height: "100%" }}
      >
        <CardHeader
          title={
            <Typography
              variant="h6"
              sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
            >
              {`${prototype.nombrePrototipo} - ${developmentName}`}
            </Typography>
          }
          subheader={`${prototype.municipio} - ${prototype.estado}`}
          sx={{
            padding: { xs: "8px", sm: "12px" },
          }}
          onClick={() => handleViewDetails(prototype.id)}
        />
        <CardActionArea
          onClick={() => handleClickOpen(prototype.imagenSecundaria)}
        >
          <CardMedia
            component="img"
            height="194"
            image={prototype.imagenPrincipal}
            alt={prototype.nombrePrototipo}
            sx={{ objectFit: "cover" }}
          />
        </CardActionArea>
        <CardContent sx={{ paddingBottom: "1px" }}>
          <Grid
            container
            alignItems="center"
            justifyContent="space-between"
            sx={{ width: "100%" }}
          >
            <Grid xs={6}>
              <Typography
                fontSize={{ xs: "14px", sm: "14px" }}
                color="text.secondary"
                fontWeight="bold"
              >
                {formatCurrency(prototype.precio)} MXN
              </Typography>
            </Grid>
            <Grid xs={6} sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="contained"
                color="success"
                startIcon={<WhatsAppIcon />}
                href={`https://wa.me/525651562698?text=Hola,%20me%20gustaría%20obtener%20más%20información%20sobre%20la%20propiedad%20${prototype.nombrePrototipo}%20en%20${developmentName},%20ubicada%20en%20${prototype.municipio},%20${prototype.estado}.`}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ fontSize: { xs: "0.7rem", sm: "0.8rem" } }}
              >
                WhatsApp
              </Button>
            </Grid>
          </Grid>

          <CardActions disableSpacing onClick={handleExpandClick}>
            <Typography variant="body3" color="text.secondary">
              <Box
                display="flex"
                alignItems="center"
                sx={{
                  fontSize: { xs: "12px", sm: "12px", md: "14px" },
                  width: "100%",
                }}
              >
                <HouseIcon sx={{ fontSize: isSmallScreen ? 16 : 22 }} />{" "}
                {prototype.size} m2 |{" "}
                <BedIcon sx={{ fontSize: isSmallScreen ? 16 : 22 }} />{" "}
                {prototype.bed} |{" "}
                <ShowerIcon sx={{ fontSize: isSmallScreen ? 16 : 22 }} />{" "}
                {prototype.shower} |{" "}
                <DirectionsCarIcon sx={{ fontSize: isSmallScreen ? 16 : 22 }} />{" "}
                {prototype.car}
              </Box>
            </Typography>

            <Box sx={{ marginLeft: "auto" }}>
              <ExpandMore
                expand={expanded}
                onClick={handleExpandClick}
                aria-expanded={expanded}
                aria-label="show more"
              >
                <ExpandMoreIcon />
              </ExpandMore>
            </Box>
          </CardActions>
        </CardContent>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography sx={{ marginBottom: 2 }}>
              {prototype.shortDescription}
            </Typography>
          </CardContent>
          <CardActions sx={{ marginTop: "auto" }}>
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
                sx={{ fontSize: { xs: "0.7rem", sm: "0.8rem" } }}
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
