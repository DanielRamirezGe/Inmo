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
  const { houseDetails } = props;
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value) => {
    setOpen(false);
    setSelectedValue(value);
  };

  return (
    <>
      <DialogImage
        selectedValue={selectedValue}
        open={open}
        onClose={handleClose}
        houseDetails={houseDetails}
      />
      <Card sx={{ maxWidth: 345 }}>
        <CardHeader
          title={houseDetails.title}
          subheader={houseDetails.subheader}
        />
        <CardActionArea onClick={handleClickOpen}>
          <CardMedia
            component="img"
            height="194"
            image={houseDetails.image}
            alt="Paella dish"
          />
        </CardActionArea>
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            $ 1,012,700
          </Typography>
          <CardActions disableSpacing onClick={handleExpandClick}>
            <Typography variant="body3" color="text.secondary">
              <Box display="flex" alignItems="center">
                <HouseIcon /> {houseDetails.size} m2 | <BedIcon />{" "}
                {houseDetails.bed} | <ShowerIcon /> {houseDetails.shower} |{" "}
                <DirectionsCarIcon /> {houseDetails.car}
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
              {houseDetails.description}
            </Typography>
          </CardContent>
        </Collapse>
      </Card>
    </>
  );
}
