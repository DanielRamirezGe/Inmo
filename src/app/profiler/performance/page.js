"use client";
import UnderConstructionPage from "../components/UnderConstructionPage";
import PerfiladorNavBar from "../components/navBarProfiler";
import { Box } from "@mui/material";

export default function PerformancePage() {
  return (
    <>
      <PerfiladorNavBar />
      <Box
        sx={{
          width: "100%",
          minHeight: "calc(100vh - 64px)", // Restamos la altura del NavBar
          bgcolor: "background.default",
        }}
      >
        <UnderConstructionPage />
      </Box>
    </>
  );
}
