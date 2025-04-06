import React from "react";
import { Box, Select, MenuItem, Paper, Typography } from "@mui/material";
import ClientCard from "../../components/ClientCard";
import CommentsSection from "./../../profiler/components/CommentsSection";
export default function ClientCardWithSelect({
  client,
  profilers,
  onProfilerChange,
  refreshData,
}) {
  return (
    <Paper
      elevation={3}
      sx={{
        width: "100%",
        minWidth: "300px",
        maxWidth: "400px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
        padding: 2,
        borderRadius: 2,
        backgroundColor: "rgba(185, 185, 183, 0.25)",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        margin: "0 auto",
      }}
    >
      <ClientCard client={client} />
      <Box sx={{ marginTop: 2, width: "100%" }}>
        {client.profilerName ? (
          <Typography
            variant="subtitle1"
            sx={{
              marginBottom: 1,
              padding: "10px",
              backgroundColor: "#fff",
              borderRadius: 1,
              border: "1px solid #ccc",
            }}
          >
            <strong>Perfilador Asignado:</strong> {client.profilerName}
          </Typography>
        ) : (
          <Box sx={{ width: "100%" }}>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: "bold", marginBottom: 1 }}
            >
              Asignar Perfilador:
            </Typography>
            <Select
              defaultValue=""
              onChange={(e) =>
                onProfilerChange(client.idUserProcess, e.target.value)
              }
              displayEmpty
              fullWidth
              sx={{
                backgroundColor: "#fff",
                borderRadius: 1,
                "& .MuiSelect-select": {
                  padding: "10px",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#ccc",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#888",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#1976d2",
                },
              }}
            >
              <MenuItem value="" disabled>
                Seleccionar Perfilador
              </MenuItem>
              {profilers.map((profiler) => (
                <MenuItem key={profiler.idProfiler} value={profiler.idProfiler}>
                  {profiler.name}
                </MenuItem>
              ))}
            </Select>
          </Box>
        )}
      </Box>
      <Box sx={{ width: "100%" }}>
        <CommentsSection
          idUser={client.idUser}
          existingComments={client.comments}
          refreshData={refreshData}
        />
      </Box>
    </Paper>
  );
}
