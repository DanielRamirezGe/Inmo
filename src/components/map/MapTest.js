"use client";
import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import MapComponent from "./MapComponent";

// Datos de prueba para el mapa
const TEST_PROPERTIES = [
  {
    id: "test-1",
    prototypeName: "Casa de Prueba en CDMX",
    price: 3500000,
    type: "house",
    lat: 19.4326,
    lng: -99.1332,
    state: "CDMX",
    city: "Ciudad de México",
    size: 180,
    bedroom: 4,
    bathroom: 3,
    developmentName: "Residencial Test",
  },
  {
    id: "test-2",
    prototypeName: "Departamento de Prueba en Polanco",
    price: 2800000,
    type: "apartment",
    lat: 19.4342,
    lng: -99.2,
    state: "CDMX",
    city: "Ciudad de México",
    size: 120,
    bedroom: 2,
    bathroom: 2,
    developmentName: "Polanco Premium",
  },
  {
    id: "test-3",
    prototypeName: "Casa de Prueba en Lomas",
    price: 4500000,
    type: "house",
    lat: 19.4285,
    lng: -99.1276,
    state: "CDMX",
    city: "Ciudad de México",
    size: 220,
    bedroom: 5,
    bathroom: 4,
    developmentName: "Lomas Residencial",
  },
  {
    id: "test-4",
    prototypeName: "Departamento de Prueba en Condesa",
    price: 3200000,
    type: "apartment",
    lat: 19.4158,
    lng: -99.1626,
    state: "CDMX",
    city: "Ciudad de México",
    size: 95,
    bedroom: 2,
    bathroom: 1,
    developmentName: "Condesa Modern",
  },
];

const MapTest = () => {
  const [showMap, setShowMap] = useState(false);
  const [mapLayout, setMapLayout] = useState("vertical");
  const [mapHeight, setMapHeight] = useState("600px");
  const [selectedHeight, setSelectedHeight] = useState("600px");

  const handlePropertyClick = (property) => {
    console.log("🔍 Propiedad seleccionada en prueba:", property);
    alert(
      `Propiedad seleccionada: ${
        property.prototypeName
      }\nPrecio: $${property.price.toLocaleString("es-MX")}`
    );
  };

  const toggleMap = () => {
    setShowMap(!showMap);
  };

  const changeLayout = () => {
    setMapLayout(mapLayout === "vertical" ? "horizontal" : "vertical");
  };

  const changeHeight = () => {
    const heights = ["400px", "500px", "600px", "700px", "800px"];
    const currentIndex = heights.indexOf(selectedHeight);
    const nextIndex = (currentIndex + 1) % heights.length;
    const newHeight = heights[nextIndex];
    setSelectedHeight(newHeight);
    setMapHeight(newHeight);
  };

  const handleHeightChange = (event) => {
    const newHeight = event.target.value;
    setSelectedHeight(newHeight);
    setMapHeight(newHeight);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom color="primary">
          🗺️ Prueba del Componente de Mapa
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Este componente permite probar todas las funcionalidades del mapa de
          Google Maps y verificar que se muestre correctamente sin cortarse.
        </Typography>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item>
            <Button
              variant="contained"
              onClick={toggleMap}
              color={showMap ? "secondary" : "primary"}
            >
              {showMap ? "Ocultar Mapa" : "Mostrar Mapa"}
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              onClick={changeLayout}
              disabled={!showMap}
            >
              Cambiar Layout ({mapLayout})
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              onClick={changeHeight}
              disabled={!showMap}
            >
              Cambiar Altura ({mapHeight})
            </Button>
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Altura del Mapa</InputLabel>
              <Select
                value={selectedHeight}
                label="Altura del Mapa"
                onChange={handleHeightChange}
                disabled={!showMap}
              >
                <MenuItem value="400px">400px (Móvil)</MenuItem>
                <MenuItem value="500px">500px (Tablet)</MenuItem>
                <MenuItem value="600px">600px (Desktop)</MenuItem>
                <MenuItem value="700px">700px (Grande)</MenuItem>
                <MenuItem value="800px">800px (Extra Grande)</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Propiedades de Prueba Disponibles:
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • {TEST_PROPERTIES.filter((p) => p.type === "house").length} Casas
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • {TEST_PROPERTIES.filter((p) => p.type === "apartment").length}{" "}
            Departamentos
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • Total: {TEST_PROPERTIES.length} propiedades
          </Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Funcionalidades a Probar:
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ✅ Scroll de la página (no debe interferir con el mapa)
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ✅ Pines visibles con colores diferentes por tipo
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ✅ Clic en pines para ver información
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ✅ Controles de zoom y navegación
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ✅ Filtros por tipo de propiedad
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ✅ Botón de ubicación del usuario
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontWeight: "bold", color: "primary.main" }}
          >
            ✅ Mapa se muestra completo sin cortarse
          </Typography>
        </Box>
      </Paper>

      {showMap && (
        <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Mapa de Prueba - Altura: {mapHeight}
          </Typography>
          <Box sx={{ border: "2px dashed #ccc", p: 1, borderRadius: 1, mb: 2 }}>
            <Typography variant="caption" color="text.secondary">
              Contenedor del mapa (borde punteado para verificar dimensiones)
            </Typography>
          </Box>
          <MapComponent
            properties={TEST_PROPERTIES}
            height={mapHeight}
            showControls={true}
            onPropertyClick={handlePropertyClick}
            layout={mapLayout}
            className="map-test-component"
          />
        </Paper>
      )}

      {!showMap && (
        <Paper elevation={1} sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="h6" color="text.secondary">
            Haz clic en "Mostrar Mapa" para comenzar la prueba
          </Typography>
        </Paper>
      )}

      <Paper elevation={1} sx={{ p: 2, mt: 3, backgroundColor: "#f5f5f5" }}>
        <Typography variant="h6" gutterBottom>
          📋 Instrucciones de Prueba
        </Typography>
        <Typography variant="body2" paragraph>
          1. <strong>Scroll de la página</strong>: Desplázate arriba y abajo
          para verificar que el mapa no interfiera
        </Typography>
        <Typography variant="body2" paragraph>
          2. <strong>Pines visibles</strong>: Verifica que aparezcan 4 pines en
          el mapa (2 casas verdes, 2 departamentos naranjas)
        </Typography>
        <Typography variant="body2" paragraph>
          3. <strong>Clic en pines</strong>: Haz clic en cualquier pin para ver
          la ventana de información
        </Typography>
        <Typography variant="body2" paragraph>
          4. <strong>Controles del mapa</strong>: Usa los botones de zoom,
          filtros y ubicación
        </Typography>
        <Typography variant="body2" paragraph>
          5. <strong>Navegación</strong>: Arrastra el mapa y haz zoom para
          probar la funcionalidad
        </Typography>
        <Typography variant="body2" paragraph>
          6. <strong>Responsive</strong>: Cambia el tamaño de la ventana para
          probar la adaptabilidad
        </Typography>
        <Typography
          variant="body2"
          paragraph
          sx={{ fontWeight: "bold", color: "primary.main" }}
        >
          7. <strong>Altura correcta</strong>: Verifica que el mapa se muestre
          completo sin cortarse en todas las alturas
        </Typography>
        <Typography variant="body2">
          8. <strong>Layout</strong>: Prueba cambiar entre layout vertical y
          horizontal
        </Typography>
      </Paper>

      <Paper elevation={1} sx={{ p: 2, mt: 3, backgroundColor: "#e3f2fd" }}>
        <Typography variant="h6" gutterBottom color="primary">
          🔧 Solución de Problemas de Altura
        </Typography>
        <Typography variant="body2" paragraph>
          Si el mapa se sigue cortando:
        </Typography>
        <Typography variant="body2" component="div" sx={{ pl: 2 }}>
          • Verifica que la altura especificada sea válida (ej: "600px", "50vh")
          • Asegúrate de que no haya estilos CSS que limiten la altura •
          Verifica que el contenedor padre tenga suficiente espacio • Revisa la
          consola del navegador para errores
        </Typography>
      </Paper>
    </Box>
  );
};

export default MapTest;
