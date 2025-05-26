"use client";
import * as React from "react";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("xs"));
  const router = useRouter();

  const [searchTerm, setSearchTerm] = React.useState("");

  const handleSearch = () => {
    const trimmedSearch = searchTerm.trim();
    if (trimmedSearch) {
      // Navegar a la página de resultados con el término de búsqueda como parámetro
      router.push(`/prototypeResults?q=${encodeURIComponent(trimmedSearch)}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div
      style={{
        borderRadius: "4px",
        display: "flex",
        alignItems: "center",
        padding: "2px 8px",
        boxShadow: "0 1px 6px rgba(32,33,36,0.28)",
        backgroundColor: "white",
      }}
    >
      <SearchIcon
        sx={{
          color: "text.secondary",
          mr: 1,
          fontSize: { xs: "1.2rem", md: "1.5rem" },
        }}
      />
      <InputBase
        sx={{
          ml: 1,
          flex: 1,
          fontSize: { xs: "0.875rem", md: "1rem" },
        }}
        placeholder="Desarrollo, Municipio, Precios, etc."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleKeyDown}
        inputProps={{
          "aria-label": "buscar propiedades",
        }}
      />
      <IconButton
        type="button"
        sx={{
          p: "8px",
          fontSize: { xs: "0.8rem", md: "0.9rem" },
          color: "primary.main",
          "&:hover": {
            backgroundColor: "primary.light",
            color: "primary.dark",
          },
          transition: "all 0.2s ease",
        }}
        aria-label="buscar"
        onClick={handleSearch}
        disabled={!searchTerm.trim()}
      >
        Buscar
      </IconButton>
    </div>
  );
}
