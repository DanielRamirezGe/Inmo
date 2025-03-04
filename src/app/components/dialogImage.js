"use client";
import * as React from "react";
import Dialog from "@mui/material/Dialog";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import Box from "@mui/material/Box";
import Image from "next/image";

export default function DialogImage(props) {
  const { onClose, selectedValue, open, imageArray, imageAlone } = props;

  const handleClose = () => {
    onClose(selectedValue);
  };

  return (
    <Dialog onClose={handleClose} open={open} fullWidth={true}>
      <ImageList sx={{}} cols={1}>
        {imageArray ? (
          imageArray.map((item) => (
            <ImageListItem key={item}>
              <img srcSet={`${item}`} src={`${item}`} loading="lazy" />
            </ImageListItem>
          ))
        ) : (
          <Box
            sx={{ display: "flex", justifyContent: "center", maxWidth: "100%" }}
          >
            <img
              srcSet={`${imageAlone}`}
              src={`${imageAlone}`}
              loading="lazy"
              style={{ maxWidth: "100%", height: "auto" }}
            />
          </Box>
        )}
      </ImageList>
    </Dialog>
  );
}
