"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Paper,
} from "@mui/material";
import { useAxiosMiddleware } from "../../../utils/axiosMiddleware";

export default function CommentsSection({
  idUser,
  existingComments = [],
  refreshData,
}) {
  const [newComment, setNewComment] = useState("");
  const axiosInstance = useAxiosMiddleware();
  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    try {
      await axiosInstance.post("/comment", {
        comment: newComment,
        idUser: parseInt(idUser),
      });

      setNewComment("");
      refreshData();
    } catch (error) {
      console.error("Error al guardar el comentario:", error);
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Comentarios
      </Typography>

      <Paper elevation={0} sx={{ bgcolor: "#f5f5f5", p: 2, mb: 2 }}>
        <TextField
          fullWidth
          multiline
          rows={2}
          variant="outlined"
          placeholder="Agregar un comentario..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          sx={{ mb: 1 }}
        />
        <Button variant="contained" onClick={handleSubmitComment}>
          Agregar Comentario
        </Button>
      </Paper>

      <List sx={{ maxHeight: 200, overflow: "auto" }}>
        {existingComments.map((comment, index) => (
          <ListItem
            key={index}
            sx={{
              bgcolor: "background.paper",
              mb: 1,
              borderRadius: 1,
              boxShadow: 1,
            }}
          >
            <ListItemText
              primary={comment.comment}
              secondary={new Date(comment.recordDate).toLocaleString("es-ES", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
