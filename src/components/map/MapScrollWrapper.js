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

    const eventHandlers = [
      ["touchstart", handleTouchStart, { passive: false }],
      ["touchmove", handleTouchMove, { passive: false }],
      ["touchend", handleTouchEnd, { passive: false }],
      ["wheel", handleWheel, { passive: false }],
      ["keydown", handleKeyDown],
    ];

    // Agregar todos los event listeners
    eventHandlers.forEach(([event, handler, options]) => {
      wrapper.addEventListener(event, handler, options);
    });

    // Cleanup function
    return () => {
      eventHandlers.forEach(([event, handler]) => {
        wrapper.removeEventListener(event, handler);
      });
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
      tabIndex={-1}
    >
      {children}
    </Box>
  );
};

export default MapScrollWrapper;
