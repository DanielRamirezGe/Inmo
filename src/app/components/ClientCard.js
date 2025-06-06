"use client";
import * as React from "react";
import { Card, CardContent, Typography, Avatar, Box } from "@mui/material";

export default function ClientCard({ client }) {
  return (
    <Card sx={{ maxWidth: 345, margin: 2, height: "100%" }}>
      <CardContent
        sx={{ display: "flex", flexDirection: "column", height: "100%" }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 2,
          }}
        >
          <Avatar sx={{ marginRight: 2, width: 56, height: 56 }}>
            <img
              src="user.jpg"
              alt="Client Photo"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </Avatar>
          <Typography variant="h6">
            {client.name} {client.lastNameP}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Teléfono: {client.mainPhone}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Correo: {client.mainEmail}
        </Typography>
        {client.quality &&
          client.quality.map((quality, index) => (
            <div key={`${client.mainEmail}-${client.mainPhone}`}>
              <Typography
                variant="body2"
                color="text.secondary"
                key={`${client.mainEmail}-${client.mainPhone}`}
              >
                Calidad: {quality.typeQuality}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Calidad: {quality.typeQuality}
                Descripcion: {quality.description}
              </Typography>
            </div>
          ))}
      </CardContent>
    </Card>
  );
}
