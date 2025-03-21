import React from "react";
import { Box, Select, MenuItem, Paper, Typography } from "@mui/material";
import ClientCard from "../../components/ClientCard";

export default function ClientCardWithSelect({
  client,
  profilers,
  onProfilerChange,
}) {
  return (
    <Paper
      elevation={3}
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
        padding: 2,
        borderRadius: 2,
        backgroundColor: "rgba(185, 185, 183, 0.25)",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <ClientCard client={client} />
      <Box sx={{ marginTop: 2 }}>
        {client.profilerName ? ( // Check if profilerName exists and is not empty
          <Typography variant="subtitle1" sx={{ marginBottom: 1 }}>
            <strong>Perfilador Asignado:</strong> {client.profilerName}
          </Typography>
        ) : (
          <>
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
          </>
        )}
      </Box>
    </Paper>
  );
}
