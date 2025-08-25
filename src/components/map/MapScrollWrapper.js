"use client";
import React, { useRef, useEffect } from "react";
import { Box } from "@mui/material";
import { useMapScrollPrevention } from "@/hooks/useMapScrollPrevention";
import styles from "./MapScrollWrapper.module.css";

const MapScrollWrapper = ({ children, className = "", isEnabled = true }) => {
  const wrapperRef = useRef(null);

  // Usar el hook personalizado para prevenir scroll
  const {
    isScrollBlocked,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleWheel,
    handleKeyDown,
  } = useMapScrollPrevention(isEnabled, wrapperRef);

  // Agregar event listeners
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper || !isEnabled) return;

    wrapper.addEventListener("touchstart", handleTouchStart, {
      passive: false,
    });
    wrapper.addEventListener("touchmove", handleTouchMove, { passive: false });
    wrapper.addEventListener("touchend", handleTouchEnd, { passive: false });
    wrapper.addEventListener("wheel", handleWheel, { passive: false });
    wrapper.addEventListener("keydown", handleKeyDown);

    return () => {
      wrapper.removeEventListener("touchstart", handleTouchStart);
      wrapper.removeEventListener("touchmove", handleTouchMove);
      wrapper.removeEventListener("touchend", handleTouchEnd);
      wrapper.removeEventListener("wheel", handleWheel);
      wrapper.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    isEnabled,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleWheel,
    handleKeyDown,
  ]);

  return (
    <Box
      ref={wrapperRef}
      className={`${styles.mapScrollWrapper} ${className} ${
        isScrollBlocked ? styles.scrollBlocked : ""
      }`}
      tabIndex={-1} // Para capturar eventos de teclado
    >
      {children}
    </Box>
  );
};

export default MapScrollWrapper;
