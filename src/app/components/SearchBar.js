"use client";
import * as React from "react";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("xs"));
  const router = useRouter();

  const [searchResults, setSearchResults] = React.useState([]);

  const handleSearch = (input) => {
    router.push(`/results/${searchResults}`);
  };

  return (
    <div
      style={{
        // border: "1px solid #ccc",
        borderRadius: "4px",
        display: "flex",
        alignItems: "center",
        padding: "2px 8px",
        boxShadow: "0 1px 6px rgba(32,33,36,0.28)",
      }}
    >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Desarrollo, Municipio, Precios, etc."
        inputProps={{
          style: {
            fontSize: isXs ? "12px" : "inherit", // Aplica el tamaño de fuente solo en pantallas xs
          },
        }}
        onChange={(e) => setSearchResults(e.target.value)} // Actualizar searchResults en cada cambio de input
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearch(e.target.value); // Llamar a handleSearch al presionar Enter
          }
        }}
      />
      <IconButton
        type="button"
        sx={{ p: "10px", fontSize: "14px", marginLeft: "8px" }} // Reducir el tamaño del texto del botón y agregar margen izquierdo
        aria-label="buscar"
        onClick={() => handleSearch(searchResults)}
      >
        Buscar
      </IconButton>
    </div>
  );
}
