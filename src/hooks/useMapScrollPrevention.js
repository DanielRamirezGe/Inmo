import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Hook personalizado para prevenir el scroll de la página durante la interacción con el mapa
 * @param {boolean} isEnabled - Si el hook está habilitado
 * @param {React.RefObject} mapRef - Referencia al elemento del mapa
 * @returns {Object} - Estado y funciones del hook
 */
export const useMapScrollPrevention = (isEnabled = true, mapRef = null) => {
  const [isScrollBlocked, setIsScrollBlocked] = useState(false);
  const isScrollingRef = useRef(false);
  const startYRef = useRef(0);
  const startScrollYRef = useRef(0);
  const timeoutRef = useRef(null);

  // Función para detectar si el scroll está dentro del mapa
  const isScrollInMap = useCallback(
    (target) => {
      if (!mapRef?.current) return false;
      return mapRef.current.contains(target);
    },
    [mapRef]
  );

  // Función para bloquear scroll de la página
  const blockPageScroll = useCallback(() => {
    if (typeof window !== "undefined" && !isScrollBlocked && isEnabled) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
      setIsScrollBlocked(true);
    }
  }, [isScrollBlocked, isEnabled]);

  // Función para restaurar scroll de la página
  const restorePageScroll = useCallback(() => {
    if (typeof window !== "undefined" && isScrollBlocked) {
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || "0") * -1);
      }
      setIsScrollBlocked(false);
    }
  }, [isScrollBlocked]);

  // Función para restaurar scroll con delay
  const restorePageScrollDelayed = useCallback(
    (delay = 200) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(restorePageScroll, delay);
    },
    [restorePageScroll]
  );

  // Limpiar timeout al desmontar
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      restorePageScroll();
    };
  }, [restorePageScroll]);

  // Restaurar scroll cuando se pierde el foco o cambia la visibilidad
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        restorePageScroll();
      }
    };

    const handleBlur = () => {
      restorePageScroll();
    };

    const handleResize = () => {
      restorePageScroll();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("resize", handleResize);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("resize", handleResize);
    };
  }, [restorePageScroll]);

  // Event handlers
  const handleTouchStart = useCallback(
    (e) => {
      if (isScrollInMap(e.target)) {
        isScrollingRef.current = true;
        startYRef.current = e.touches[0].clientY;
        startScrollYRef.current = window.scrollY;
        blockPageScroll();
      }
    },
    [isScrollInMap, blockPageScroll]
  );

  const handleTouchMove = useCallback(
    (e) => {
      if (isScrollingRef.current && isScrollInMap(e.target)) {
        // Solo prevenir scroll vertical, permitir horizontal
        const currentY = e.touches[0].clientY;
        const deltaY = Math.abs(currentY - startYRef.current);

        if (deltaY > 5) {
          // Umbral mínimo para considerar scroll vertical
          e.preventDefault();
          e.stopPropagation();
        }
      }
    },
    [isScrollInMap]
  );

  const handleTouchEnd = useCallback(
    (e) => {
      if (isScrollingRef.current && isScrollInMap(e.target)) {
        isScrollingRef.current = false;
        restorePageScrollDelayed(200);
      }
    },
    [isScrollInMap, restorePageScrollDelayed]
  );

  const handleWheel = useCallback(
    (e) => {
      if (isScrollInMap(e.target)) {
        e.preventDefault();
        e.stopPropagation();
      }
    },
    [isScrollInMap]
  );

  const handleKeyDown = useCallback(
    (e) => {
      if (isScrollInMap(e.target)) {
        // Permitir navegación con teclado pero prevenir scroll
        if (
          [
            "ArrowUp",
            "ArrowDown",
            "PageUp",
            "PageDown",
            "Home",
            "End",
          ].includes(e.key)
        ) {
          e.preventDefault();
        }
      }
    },
    [isScrollInMap]
  );

  return {
    isScrollBlocked,
    blockPageScroll,
    restorePageScroll,
    restorePageScrollDelayed,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleWheel,
    handleKeyDown,
  };
};
