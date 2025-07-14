import React from "react";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";

const PeriodSelector = ({ period, onPeriodChange, label = "Período" }) => {
  const periods = [
    { value: "7d", label: "Últimos 7 días" },
    { value: "30d", label: "Últimos 30 días" },
    { value: "90d", label: "Últimos 90 días" },
    { value: "1y", label: "Último año" },
    { value: "all", label: "Todo el tiempo" },
  ];

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
      <Typography variant="h6" component="h2">
        {label}
      </Typography>
      <FormControl size="small" sx={{ minWidth: 200 }}>
        <InputLabel>Período</InputLabel>
        <Select
          value={period}
          label="Período"
          onChange={(e) => onPeriodChange(e.target.value)}
        >
          {periods.map((p) => (
            <MenuItem key={p.value} value={p.value}>
              {p.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default PeriodSelector;
