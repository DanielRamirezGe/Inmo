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

  const listRef = React.useRef(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [existingComments]);

  return (
    <Box sx={{ mt: 2, width: "100%" }}>
      <Typography variant="h6" gutterBottom>
        Comentarios
      </Typography>

      <List
        ref={listRef}
        sx={{
          maxHeight: 200,
          minHeight: 150,
          overflow: "auto",
          overflowX: "hidden",
          display: "flex",
          flexDirection: "column-reverse",
          mb: 2,
          border: "1px solid #e0e0e0",
          borderRadius: 1,
          backgroundColor: "#fff",
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-track": {
            background: "#f1f1f1",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#888",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: "#555",
          },
        }}
      >
        {[...existingComments].reverse().map((comment, index) => (
          <ListItem
            key={comment.id || index}
            sx={{
              bgcolor: "background.paper",
              mb: 1,
              mx: 1,
              borderRadius: 1,
              boxShadow: 1,
              width: "auto",
              maxWidth: "calc(100% - 16px)",
            }}
          >
            <ListItemText
              primary={comment.comment}
              primaryTypographyProps={{
                sx: {
                  wordBreak: "break-word",
                  fontSize: "0.9rem",
                  whiteSpace: "pre-wrap",
                  overflowWrap: "break-word",
                },
              }}
              secondary={new Date(comment.recordDate).toLocaleString("es-ES", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
              secondaryTypographyProps={{
                sx: {
                  fontSize: "0.8rem",
                  whiteSpace: "normal",
                },
              }}
            />
          </ListItem>
        ))}
      </List>

      <Paper
        elevation={0}
        sx={{
          bgcolor: "#f5f5f5",
          p: 2,
          width: "100%",
          borderRadius: 1,
        }}
      >
        <TextField
          fullWidth
          multiline
          rows={2}
          variant="outlined"
          placeholder="Agregar un comentario..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          sx={{
            mb: 1,
            "& .MuiOutlinedInput-root": {
              backgroundColor: "#fff",
            },
          }}
        />
        <Button variant="contained" onClick={handleSubmitComment} fullWidth>
          Agregar Comentario
        </Button>
      </Paper>
    </Box>
  );
}
