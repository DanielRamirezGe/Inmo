"use client";
import * as React from "react";
import Dialog from "@mui/material/Dialog";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import Box from "@mui/material/Box";
import Image from "next/image";

export default function DialogImage(props) {
  const { onClose, selectedValue, open, houseDetails } = props;

  const handleClose = () => {
    onClose(selectedValue);
  };

  return (
    <Dialog onClose={handleClose} open={open} fullWidth={true}>
      <ImageList sx={{}} cols={1}>
        {houseDetails.imageList ? (
          houseDetails.imageList.map((item) => (
            <ImageListItem key={item}>
              <img srcSet={`${item}`} src={`${item}`} loading="lazy" />
            </ImageListItem>
          ))
        ) : (
          <Box position="relative" width="100%" height={{ xs: 300, sm: 600 }}>
            <Image
              src={`/${houseDetails.image}`}
              alt={houseDetails.title}
              layout="fill"
              objectFit="cover"
              quality={100}
            />
          </Box>
        )}
      </ImageList>
    </Dialog>
  );
}
