"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Loader } from "@googlemaps/js-api-loader";
import { useViewportBasedLoading } from "@/hooks/useViewportBasedLoading";
import MapControls from "./MapControls";
import styles from "./MapComponent.module.css";

// Configuración del mapa
const MAP_CONFIG = {
  center: { lat: 19.4326, lng: -99.1332 }, // Ciudad de México por defecto
  zoom: 12,
  minZoom: 8,
  maxZoom: 18,
  styles: [
    {
      featureType: "poi",
      elementType: "labels",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "transit",
      elementType: "labels",
      stylers: [{ visibility: "off" }],
    },
  ],
};

const MapComponent = ({
  properties = null,
  height = "600px",
  showControls = true,
  onPropertyClick = null,
  onPropertiesUpdate = null,
  className = "",
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery("(max-width:450px)"); // Solo pantallas muy pequeñas < 450px

  // Estado para altura responsiva
  const [responsiveHeight, setResponsiveHeight] = useState(height);
  const [originalHeight, setOriginalHeight] = useState(height);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const infoWindowRef = useRef(null);
  const googleRef = useRef(null);

  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [isAdjustingView, setIsAdjustingView] = useState(false);
  const [hasInitialBounds, setHasInitialBounds] = useState(false);
  const [isInfoWindowOpen, setIsInfoWindowOpen] = useState(false);
  const [isMapInteractionBlocked, setIsMapInteractionBlocked] = useState(false);

  // Usar el hook de carga por viewport
  const {
    viewportProperties,
    loading,
    error: viewportError,
    loadPropertiesDebounced,
    loadPropertiesByViewport,
    cleanupDistantCache,
    getViewportStats,
    loadedRegionsCount,
    cacheSize,
  } = useViewportBasedLoading();

  // Usar todas las propiedades del viewport
  const filteredProperties = viewportProperties;

  // Guardar altura original cuando cambie la prop height
  useEffect(() => {
    setOriginalHeight(height);
    setResponsiveHeight(height);
  }, [height]);

  if (filteredProperties.length > 0) {
    // Propiedades disponibles
  }

  // Crear estilos de pines personalizados con tema de inmobiliaria
  const createPinStyles = useCallback((google) => {
    if (!google) return {};

    const createSVG = (type, price, color) => {
      // Formatear precio
      const formatPrice = (price) => {
        if (!price) return "N/A";
        const numPrice = parseFloat(price);
        if (numPrice >= 1000000) {
          return (numPrice / 1000000).toFixed(1) + "M";
        } else if (numPrice >= 1000) {
          return (numPrice / 1000).toFixed(0) + "k";
        }
        return numPrice.toString();
      };

      const formattedPrice = formatPrice(price);
      const typeLabel = type === "house" ? "Casa" : "Apt";

      return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
        <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <!-- Fondo del pin con sombra -->
          <defs>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="2" dy="2" stdDeviation="2" flood-color="rgba(0,0,0,0.3)"/>
            </filter>
          </defs>
          
          <!-- Pin principal con forma de casa y punta de alfiler - FONDO BLANCO -->
          <path d="M50 10 L75 37 L75 54 L50 60 L25 54 L25 37 Z" fill="white" stroke="${color}" stroke-width="2" filter="url(#shadow)"/>
          
          <!-- Techo triangular - FONDO BLANCO -->
          <path d="M50 10 L75 37 L25 37 Z" fill="white" stroke="${color}" stroke-width="2" filter="url(#shadow)"/>
          
          <!-- Punta de alfiler en la parte inferior - FONDO BLANCO -->
          <path d="M50 56 L55 65 L50 75 L45 65 Z" fill="white" stroke="${color}" stroke-width="2" filter="url(#shadow)"/>
          

          
          <!-- Tipo de propiedad -->
          <text x="50" y="30" text-anchor="middle" fill="black" font-size="9" font-weight="bold" font-family="Arial, sans-serif">${typeLabel}</text>
          
          <!-- Precio -->
          <text x="50" y="53" text-anchor="middle" fill="black" font-size="12" font-weight="bold" font-family="Arial, sans-serif">${formattedPrice}</text>
        </svg>
      `)}`;
    };

    return {
      default: {
        url: createSVG("default", null, "#1976d2"),
        scaledSize: new google.maps.Size(100, 100),
        anchor: new google.maps.Point(50, 50),
      },
      house: {
        url: createSVG("house", null, "#2e7d32"),
        scaledSize: new google.maps.Size(100, 100),
        anchor: new google.maps.Point(50, 50),
      },
      apartment: {
        url: createSVG("apartment", null, "#FFD700"),
        scaledSize: new google.maps.Size(100, 100),
        anchor: new google.maps.Point(50, 50),
      },
    };
  }, []);

  // Función para actualizar el tamaño de todos los marcadores según la vista
  const updateAllMarkersSize = useCallback(() => {
    if (
      !mapInstanceRef.current ||
      !googleRef.current ||
      markersRef.current.length === 0
    ) {
      console.log("🗺️ No se pueden actualizar marcadores:", {
        hasMap: !!mapInstanceRef.current,
        hasGoogle: !!googleRef.current,
        markersCount: markersRef.current.length,
      });
      return;
    }

    const map = mapInstanceRef.current;

    try {
      // Detectar si estamos en Street View usando múltiples métodos
      const streetView = map.getStreetView();
      const isStreetView = streetView && streetView.getVisible();

      console.log(
        "🗺️ Actualizando tamaño de marcadores. Street View:",
        isStreetView
      );

      // Actualizar todos los marcadores
      markersRef.current.forEach((marker) => {
        if (marker.updatePinSize) {
          marker.updatePinSize(isStreetView);
        }
      });
    } catch (error) {
      console.error("🗺️ Error al actualizar marcadores:", error);
    }
  }, []);

  // Inicializar Google Maps
  const initializeMap = useCallback(async () => {
    // Evitar inicialización múltiple
    if (mapInstanceRef.current || isMapLoaded) {
      // Mapa ya inicializado, saltando...
      return;
    }

    try {
      // Iniciando carga de Google Maps...

      const loader = new Loader({
        apiKey:
          process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "YOUR_API_KEY_HERE",
        version: "weekly",
        libraries: ["places"],
      });

      const google = await loader.load();
      googleRef.current = google;

      if (!mapRef.current) {
        // Ref del mapa no disponible, abortando...
        return;
      }

      // Crear estilos de pines después de cargar Google Maps
      const pinStyles = createPinStyles(google);

      // Creando instancia del mapa...

      const map = new google.maps.Map(mapRef.current, {
        ...MAP_CONFIG,
        center: MAP_CONFIG.center,
        zoom: MAP_CONFIG.zoom,
        styles: MAP_CONFIG.styles,
        mapTypeControl: false, // Deshabilitar selector de tipo de mapa
        streetViewControl: true, // Habilitar control de Street View
        fullscreenControl: true,
        zoomControl: false, // Deshabilitar controles de zoom
        panControl: false, // Deshabilitar control de navegación con flechas
        scrollwheel: true, // Habilitar scroll del mouse
        gestureHandling: "greedy", // Permitir arrastre libre del mapa
        disableDefaultUI: false,
        draggable: true, // Asegurar que el arrastre esté habilitado
      });

      mapInstanceRef.current = map;

      // Esperar a que el mapa esté completamente cargado antes de continuar
      google.maps.event.addListenerOnce(map, "idle", () => {
        // Mapa completamente cargado
        setIsMapLoaded(true);

        // Crear ventana de información
        infoWindowRef.current = new google.maps.InfoWindow();

        // Función para restaurar altura (captura el valor actual de isMobile)
        const restoreMapHeight = () => {
          const currentIsMobile = window.innerWidth <= 450; // Solo pantallas muy pequeñas

          if (currentIsMobile) {
            setResponsiveHeight(originalHeight);

            // Forzar la actualización del mapa después de restaurar la altura
            setTimeout(() => {
              if (mapInstanceRef.current) {
                google.maps.event.trigger(mapInstanceRef.current, "resize");
              }
            }, 100);
          }
        };

        // Listener para cuando se cierre la ventana de información
        infoWindowRef.current.addListener("closeclick", () => {
          setIsInfoWindowOpen(false);

          // Restaurar altura del mapa
          restoreMapHeight();

          // Delay para evitar que se disparen eventos inmediatamente
          setTimeout(() => {
            setIsMapInteractionBlocked(false);
          }, 500);
        });

        // Listener para cuando se cierre la ventana por cualquier medio
        infoWindowRef.current.addListener("close", () => {
          setIsInfoWindowOpen(false);

          // Restaurar altura del mapa
          restoreMapHeight();

          // Delay para evitar que se disparen eventos inmediatamente
          setTimeout(() => {
            setIsMapInteractionBlocked(false);
          }, 500);
        });

        // Agregar listener para cerrar ventana de información al hacer clic en el mapa
        map.addListener("click", () => {
          if (infoWindowRef.current) {
            infoWindowRef.current.close();
            setIsInfoWindowOpen(false);

            // Restaurar altura del mapa
            restoreMapHeight();

            // Delay para evitar que se disparen eventos inmediatamente
            setTimeout(() => {
              setIsMapInteractionBlocked(false);
            }, 500);
          }
        });

        // Agregar listeners para cambios de viewport con debounce más inteligente
        let boundsChangedTimeout;
        let lastBounds = null;

        map.addListener("bounds_changed", () => {
          if (isAdjustingView || isInfoWindowOpen || isMapInteractionBlocked) {
            return;
          }

          clearTimeout(boundsChangedTimeout);
          boundsChangedTimeout = setTimeout(() => {
            const bounds = map.getBounds();
            if (bounds) {
              const ne = bounds.getNorthEast();
              const sw = bounds.getSouthWest();
              const currentBounds = {
                north: ne.lat(),
                south: sw.lat(),
                east: ne.lng(),
                west: sw.lng(),
              };

              // Solo cargar si los bounds han cambiado significativamente
              if (
                !lastBounds ||
                Math.abs(currentBounds.north - lastBounds.north) > 0.01 ||
                Math.abs(currentBounds.south - lastBounds.south) > 0.01 ||
                Math.abs(currentBounds.east - lastBounds.east) > 0.01 ||
                Math.abs(currentBounds.west - lastBounds.west) > 0.01
              ) {
                lastBounds = currentBounds;
                loadPropertiesDebounced(currentBounds);
              }
            }
          }, 500); // Aumentado el debounce para reducir recargas
        });

        // Agregar listener para zoom con debounce
        let zoomChangedTimeout;
        map.addListener("zoom_changed", () => {
          if (isAdjustingView || isInfoWindowOpen || isMapInteractionBlocked) {
            return;
          }

          clearTimeout(zoomChangedTimeout);
          zoomChangedTimeout = setTimeout(() => {
            const bounds = map.getBounds();
            if (bounds) {
              const ne = bounds.getNorthEast();
              const sw = bounds.getSouthWest();
              const viewportBounds = {
                north: ne.lat(),
                south: sw.lat(),
                east: ne.lng(),
                west: sw.lng(),
              };
              cleanupDistantCache(viewportBounds);
            }
          }, 300);
        });

        // Listener para detectar cuando se abre/cierra Street View
        map.addListener("streetview_changed", () => {
          // Delay para asegurar que Street View esté completamente cargado
          setTimeout(() => {
            updateAllMarkersSize();
          }, 300);
        });

        // Listener para detectar clics en el mapa (puede abrir Street View)
        map.addListener("click", () => {
          // Verificar si se abrió Street View después de un delay
          setTimeout(() => {
            updateAllMarkersSize();
          }, 500);
        });

        // Listener para detectar cambios en el zoom (puede afectar Street View)
        map.addListener("zoom_changed", () => {
          // Verificar Street View después del zoom
          setTimeout(() => {
            updateAllMarkersSize();
          }, 200);
        });

        // Cargar propiedades iniciales después de que el mapa esté listo
        const initialBounds = map.getBounds();
        if (initialBounds) {
          const ne = initialBounds.getNorthEast();
          const sw = initialBounds.getSouthWest();
          const viewportBounds = {
            north: ne.lat(),
            south: sw.lat(),
            east: ne.lng(),
            west: sw.lng(),
          };
          loadPropertiesByViewport(viewportBounds);
        }

        // Verificar el estado inicial de Street View
        setTimeout(() => {
          updateAllMarkersSize();
        }, 1000);

        // Agregar listener específico para el botón de Street View
        const streetViewControl = document.querySelector(
          '[title="Street View"]'
        );
        if (streetViewControl) {
          streetViewControl.addEventListener("click", () => {
            setTimeout(() => {
              updateAllMarkersSize();
            }, 800);
          });
        }

        // Marcar que ya se establecieron los bounds iniciales
        setHasInitialBounds(true);
      });
    } catch (err) {
      // Error initializing Google Maps
    }
  }, [
    createPinStyles,
    loadPropertiesDebounced,
    loadPropertiesByViewport,
    cleanupDistantCache,
    isMapLoaded,
    updateAllMarkersSize,
  ]);

  // Crear marcadores en el mapa
  const createMarkers = useCallback(() => {
    if (
      !mapInstanceRef.current ||
      !isMapLoaded ||
      !googleRef.current ||
      isAdjustingView ||
      isMapInteractionBlocked
    ) {
      return;
    }

    // Evitar recrear marcadores si ya existen y las propiedades son las mismas
    if (
      markersRef.current.length > 0 &&
      markersRef.current.length === filteredProperties.length &&
      !isAdjustingView
    ) {
      return;
    }

    const google = googleRef.current;
    const pinStyles = createPinStyles(google);

    console.log(
      `🗺️ Creando marcadores para ${filteredProperties.length} propiedades`
    );

    // Limpiar marcadores existentes
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    const validProperties = filteredProperties.filter((property) => {
      const hasValidCoords =
        property.lat &&
        property.lng &&
        !isNaN(parseFloat(property.lat)) &&
        !isNaN(parseFloat(property.lng));

      if (!hasValidCoords) {
        // Propiedad sin coordenadas válidas
      }

      return hasValidCoords;
    });

    if (validProperties.length === 0) {
      return;
    }

    validProperties.forEach((property) => {
      const position = {
        lat: parseFloat(property.lat),
        lng: parseFloat(property.lng),
      };

      // Crear pin personalizado con precio específico
      const createCustomPin = (type, price, isLarge = false) => {
        const formatPrice = (price) => {
          if (!price) return "N/A";
          const numPrice = parseFloat(price);
          if (numPrice >= 1000000) {
            return (numPrice / 1000000).toFixed(1) + "M";
          } else if (numPrice >= 1000) {
            return (numPrice / 1000).toFixed(0) + "k";
          }
          return numPrice.toString();
        };

        const formattedPrice = formatPrice(price);
        const typeLabel = type === "house" ? "Casa" : "Apt";
        const color =
          type === "house"
            ? "#2e7d32"
            : type === "apartment"
            ? "#e6a820fa"
            : "#1976d2";

        // Tamaño del pin: más grande para Street View
        const size = isLarge ? 400 : 80;
        const fontSize = isLarge ? 45 : 11;
        const typeFontSize = isLarge ? 40 : 9;

        return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
          <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
            <!-- Fondo del pin con sombra -->
            <defs>
              <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="1" dy="1" stdDeviation="1" flood-color="rgba(0,0,0,0.3)"/>
              </filter>
            </defs>
            
            <!-- Pin principal con forma de casa y punta de alfiler - FONDO BLANCO -->
            <path d="M${size / 2} ${size * 0.1} L${size * 0.75} ${
          size * 0.375
        } L${size * 0.75} ${size * 0.55} L${size / 2} ${size * 0.6125} L${
          size * 0.25
        } ${size * 0.55} L${size * 0.25} ${
          size * 0.375
        } Z" fill="white" stroke="${color}" stroke-width="2" filter="url(#shadow)"/>
            
            <!-- Techo triangular - FONDO BLANCO -->
            <path d="M${size / 2} ${size * 0.1} L${size * 0.75} ${
          size * 0.375
        } L${size * 0.25} ${
          size * 0.375
        } Z" fill="white" stroke="${color}" stroke-width="2" filter="url(#shadow)"/>
            
            <!-- Punta de alfiler en la parte inferior - FONDO BLANCO -->
            <path d="M${size / 2} ${size * 0.5625} L${size * 0.5625} ${
          size * 0.65
        } L${size / 2} ${size * 0.75} L${size * 0.4375} ${
          size * 0.65
        } Z" fill="white" stroke="${color}" stroke-width="2" filter="url(#shadow)"/>
            
            <!-- Tipo de propiedad -->
            <text x="${size / 2}" y="${
          size * 0.3
        }" text-anchor="middle" fill="black" font-size="${typeFontSize}" font-weight="bold" font-family="Arial, sans-serif">${typeLabel}</text>
            
            <!-- Precio -->
            <text x="${size / 2}" y="${
          size * 0.5125
        }" text-anchor="middle" fill="black" font-size="${fontSize}" font-weight="bold" font-family="Arial, sans-serif">${formattedPrice}</text>
          </svg>
        `)}`;
      };

      const customPin = createCustomPin(property.type, property.price, false); // Pin normal para mapa
      const largePin = createCustomPin(property.type, property.price, true); // Pin grande para Street View

      const marker = new google.maps.Marker({
        position,
        map: mapInstanceRef.current,
        icon: {
          url: customPin, // Usar pin normal por defecto
          scaledSize: new google.maps.Size(80, 80),
          anchor: new google.maps.Point(40, 40),
        },
        title: property.prototypeName || property.name || "Propiedad",
        zIndex: 1000, // Asegurar que los marcadores estén por encima
        // Configuración para Street View
        optimized: false, // Mejor renderizado en Street View
      });

      // Función para cambiar el tamaño del pin según la vista
      const updatePinSize = (isStreetView) => {
        try {
          console.log(
            `🗺️ Actualizando pin ${
              property.prototypeName || property.name
            }. Street View:`,
            isStreetView
          );

          if (isStreetView) {
            marker.setIcon({
              url: largePin,
              scaledSize: new google.maps.Size(400, 400),
              anchor: new google.maps.Point(200, 200),
            });
            // Pin cambiado a GRANDE
          } else {
            marker.setIcon({
              url: customPin,
              scaledSize: new google.maps.Size(80, 80),
              anchor: new google.maps.Point(40, 40),
            });
            // Pin cambiado a NORMAL
          }
        } catch (error) {
          // Error al actualizar pin
        }
      };

      // Agregar el marcador a la lista para poder actualizarlo después
      marker.updatePinSize = updatePinSize;

      // Crear contenido de la ventana de información
      const infoContent = createInfoWindowContent(property);

      // Agregar listener para mostrar información
      marker.addListener("click", () => {
        console.log(
          "🗺️ Abriendo ventana de información - bloqueando interacciones del mapa"
        );
        setIsInfoWindowOpen(true);
        setIsMapInteractionBlocked(true);

        // En móviles, cambiar la altura del mapa a 600px cuando se abra el InfoWindow
        if (isMobile) {
          setResponsiveHeight("600px");

          // Forzar la actualización del mapa después del cambio de altura
          setTimeout(() => {
            if (mapInstanceRef.current) {
              google.maps.event.trigger(mapInstanceRef.current, "resize");
            }
          }, 200);
        }

        // Delay para permitir que la ventana se abra completamente
        setTimeout(() => {
          infoWindowRef.current.setContent(infoContent);
          infoWindowRef.current.open(mapInstanceRef.current, marker);
        }, 100);

        if (onPropertyClick) {
          onPropertyClick(property);
        }
      });

      markersRef.current.push(marker);
    });

    // Ajustar vista del mapa SOLO la primera vez que se cargan marcadores
    if (
      markersRef.current.length > 0 &&
      markersRef.current.length <= 15 &&
      !hasInitialBounds
    ) {
      // Ajustando vista inicial del mapa para mostrar marcadores

      const bounds = new google.maps.LatLngBounds();
      markersRef.current.forEach((marker) => {
        bounds.extend(marker.getPosition());
      });

      setIsAdjustingView(true);
      mapInstanceRef.current.fitBounds(bounds);

      setTimeout(() => {
        setIsAdjustingView(false);
        setHasInitialBounds(true); // Marcar que ya se ajustó la vista inicial
      }, 500);
    }

    // Marcadores creados exitosamente

    // Verificar el estado de Street View después de crear los marcadores
    setTimeout(() => {
      updateAllMarkersSize();
    }, 500);
  }, [
    filteredProperties,
    isMapLoaded,
    createPinStyles,
    onPropertyClick,
    updateAllMarkersSize,
  ]);

  // Crear contenido de la ventana de información
  const createInfoWindowContent = (property) => {
    const formatPrice = (price) => {
      if (!price) return "Precio no disponible";
      return new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: "MXN",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(price);
    };

    const formatPriceShort = (price) => {
      if (!price) return "N/A";
      const numPrice = parseFloat(price);
      if (numPrice >= 1000000) {
        return (numPrice / 1000000).toFixed(1) + "M";
      } else if (numPrice >= 1000) {
        return (numPrice / 1000).toFixed(0) + "k";
      }
      return numPrice.toString();
    };

    // Función para formatear el precio con formato mexicano
    const formatfullPrice = (price) => {
      if (!price) return "Precio no disponible";

      // Convertir a número si es string
      const numPrice = typeof price === "string" ? parseFloat(price) : price;

      // Formatear con comas para miles y 2 decimales
      return new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: "MXN",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(numPrice);
    };

    const getTypeColor = (type) => {
      return type === "house"
        ? "#2e7d32"
        : type === "apartment"
        ? "#e6a820fa"
        : "#1976d2";
    };
    property.mainImage = property.mainImage.replace("uploads/prototypes/", "");

    return `
      <div style="padding: 0; max-width: 350px; font-family: 'Segoe UI', Arial, sans-serif; border-radius: 8px; overflow: hidden;">
        <!-- Imagen principal arriba -->
        ${
          property.mainImage
            ? `<div style="width: 100%; height: 140px; background-image: url('https://minkaasa-images.s3.us-east-1.amazonaws.com/${encodeURIComponent(
                property.mainImage
              )}'); background-size: cover; background-position: center; background-repeat: no-repeat; border-radius: 8px 8px 0 0;"></div>`
            : ""
        }
        
        <!-- Contenido de la información -->
        <div style="padding: 12px;">
                    <!-- Header con título y tipo -->
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; padding-bottom: 6px; border-bottom: 2px solid ${getTypeColor(
            property.type
          )};">
            <h3 style="margin: 0; color: #1976d2; font-size: 13px; font-weight: 600; line-height: 1.2;">
              ${property.street} - ${property.city}
            </h3>
            <span style="font-weight: 600; text-transform: uppercase; font-size: 10px; letter-spacing: 0.5px; color: ${getTypeColor(
              property.type
            )}; margin-left: 12px;">
              <div style="width: 6px; height: 6px; border-radius: 50%; background-color: ${getTypeColor(
                property.type
              )}; margin-right: 3px; display: inline-block; vertical-align: middle;"></div>
              ${
                property.type === "house"
                  ? "Casa"
                  : property.type === "apartment"
                  ? "Apt"
                  : property.type
              }
            </span>
          </div>
          
          <!-- Detalles de la propiedad con cuadrícula 2x2 -->
          <div style="margin-bottom: 8px;">
            <!-- Precio centrado arriba de los iconos -->
            <div style="text-align: center; margin-bottom: 8px;">
              <div style="font-weight: bold; color: #2e7d32; font-size: 14px; padding: 6px 12px; background-color: #f5f5f5; border-radius: 6px; display: block; width: 100%; box-sizing: border-box;">
                ${formatfullPrice(property.price)}
              </div>
            </div>
            
            <!-- Cuadrícula 2x2 de información -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px; margin-bottom: 8px;">
              ${
                property.size
                  ? `<div style="display: flex; align-items: center; padding: 4px; background-color: #f8f9fa; border-radius: 4px;">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="#666" style="margin-right: 6px;">
                        <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V9h2v2zm0-4h-2V5h2v2z"/>
                      </svg>
                      <span style="font-weight: 600; color: #333; font-size: 11px;">${property.size} m²</span>
                    </div>`
                  : ""
              }
              ${
                property.bedroom
                  ? `<div style="display: flex; align-items: center; padding: 4px; background-color: #f8f9fa; border-radius: 4px;">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="#666" style="margin-right: 6px;">
                        <path d="M7 13c1.65 0 3-1.35 3-3S8.65 7 7 7s-3 1.35-3 3 1.35 3 3 3zm12-6h-8v7H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z"/>
                      </svg>
                      <span style="font-weight: 600; color: #333; font-size: 11px;">${property.bedroom} rec</span>
                    </div>`
                  : ""
              }
              ${
                property.bathroom
                  ? `<div style="display: flex; align-items: center; padding: 6px; background-color: #f8f9fa; border-radius: 4px;">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="#666" style="margin-right: 8px;">
                        <path d="M7 14c1.66 0 3 1.34 3 3 0 1.31-1.16 2-2 2 0.61 0 1.33-.5 1.33-1.33 0-.74-.59-1.33-1.33-1.33-2.33 0-7 1.79-7 5v2h14v-2c0-2.21-4.67-4-7-4z"/>
                      </svg>
                      <span style="font-weight: 600; color: #333; font-size: 11px;">${
                        property.bathroom
                      } ${property.bathroom === "1" ? "baño" : "baños"}</span>
                    </div>`
                  : ""
              }
              ${
                property.parking
                  ? `<div style="display: flex; align-items: center; padding: 4px; background-color: #f8f9fa; border-radius: 4px;">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="#666" style="margin-right: 6px;">
                        <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
                      </svg>
                      <span style="font-weight: 600; color: #333; font-size: 11px;">${property.parking} est</span>
                    </div>`
                  : ""
              }
            </div>
            
            <!-- Botón centrado al final -->
            <div style="text-align: center;">
              <a href="https://minkaasa.com/prototype/${
                property.prototypeId
              }" target="_blank" style="display: block; width: 100%; background-color: #1976d2; color: white; text-decoration: none; padding: 6px 12px; border-radius: 6px; font-weight: 600; font-size: 11px; transition: background-color 0.2s; box-sizing: border-box;">
                Ver más detalles
              </a>
            </div>
          </div>
        </div>
      </div>
    `;
  };

  // Manejadores de eventos
  const handleRefresh = () => {
    if (mapInstanceRef.current) {
      const bounds = mapInstanceRef.current.getBounds();
      if (bounds) {
        const ne = bounds.getNorthEast();
        const sw = bounds.getSouthWest();
        const viewportBounds = {
          north: ne.lat(),
          south: sw.lat(),
          east: ne.lng(),
          west: sw.lng(),
        };
        loadPropertiesByViewport(viewportBounds, true);
      }
    }
  };

  const handleResetView = () => {
    if (mapInstanceRef.current && markersRef.current.length > 0) {
      // Reseteando vista del mapa a todos los marcadores

      const bounds = new google.maps.LatLngBounds();
      markersRef.current.forEach((marker) => {
        bounds.extend(marker.getPosition());
      });

      setIsAdjustingView(true);
      mapInstanceRef.current.fitBounds(bounds);

      setTimeout(() => {
        setIsAdjustingView(false);
      }, 500);
    }
  };

  const handleLocationClick = () => {
    if (navigator.geolocation && mapInstanceRef.current) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          setIsAdjustingView(true);
          mapInstanceRef.current.setCenter(pos);
          mapInstanceRef.current.setZoom(15);

          setTimeout(() => {
            setIsAdjustingView(false);
          }, 500);
        },
        () => {
          // Error: The Geolocation service failed.
        }
      );
    }
  };

  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      setIsAdjustingView(true);
      mapInstanceRef.current.setZoom(mapInstanceRef.current.getZoom() + 1);
      setTimeout(() => {
        setIsAdjustingView(false);
      }, 300);
    }
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      setIsAdjustingView(true);
      mapInstanceRef.current.setZoom(mapInstanceRef.current.getZoom() - 1);
      setTimeout(() => {
        setIsAdjustingView(false);
      }, 300);
    }
  };

  // Efectos
  useEffect(() => {
    // Solo inicializar si no hay instancia del mapa y no está cargado
    if (!mapInstanceRef.current && !isMapLoaded) {
      // Efecto de inicialización ejecutado
      initializeMap();
    }
  }, []); // Dependencias vacías para ejecutar solo una vez

  // Efecto para verificar periódicamente el estado de Street View
  useEffect(() => {
    if (!isMapLoaded || markersRef.current.length === 0) return;

    const interval = setInterval(() => {
      updateAllMarkersSize();
    }, 2000); // Verificar cada 2 segundos

    return () => clearInterval(interval);
  }, [isMapLoaded, updateAllMarkersSize]);

  useEffect(() => {
    if (isMapLoaded && filteredProperties.length > 0 && !isAdjustingView) {
      // Creando marcadores...
      const timeoutId = setTimeout(() => {
        createMarkers();
      }, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [isMapLoaded, filteredProperties, isAdjustingView]); // Removido createMarkers de dependencias

  // Limpiar al desmontar
  useEffect(() => {
    return () => {
      if (infoWindowRef.current) {
        infoWindowRef.current.close();
      }
      markersRef.current.forEach((marker) => marker.setMap(null));
    };
  }, []);

  // Notificar cambios en las propiedades del viewport al componente padre
  useEffect(() => {
    if (onPropertiesUpdate && typeof onPropertiesUpdate === "function") {
      onPropertiesUpdate(filteredProperties, loading, viewportError);
    }
  }, [filteredProperties, loading, viewportError, onPropertiesUpdate]);

  // Effect para altura responsiva
  useEffect(() => {
    const updateHeight = () => {
      const width = window.innerWidth;
      if (width <= 430) {
        setResponsiveHeight("300px");
      } else if (width <= 700) {
        setResponsiveHeight("300px");
      } else {
        setResponsiveHeight(height);
      }
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);

    return () => window.removeEventListener("resize", updateHeight);
  }, [height]);

  // Renderizado condicional para mensajes informativos
  const renderInfoMessages = () => {
    // Si hay error real de API, mostrar mensaje de error
    if (viewportError) {
      return (
        <Box className={styles.noPropertiesMessage}>
          <Typography
            variant="body2"
            color="error"
            gutterBottom
            sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
          >
            {viewportError}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontSize: { xs: "0.65rem", sm: "0.75rem" } }}
          >
            Verifica tu conexión e intenta de nuevo
          </Typography>
        </Box>
      );
    }

    // Si el mapa está cargado pero no hay propiedades, mostrar mensaje informativo
    if (isMapLoaded && filteredProperties.length === 0) {
      return (
        <Box className={styles.noPropertiesMessage}>
          <Typography
            variant="body2"
            color="text.secondary"
            gutterBottom
            sx={{
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
              fontWeight: { xs: 500, sm: 400 },
            }}
          >
            No hay propiedades disponibles en esta área
          </Typography>
        </Box>
      );
    }

    // Si hay propiedades, no mostrar mensaje
    return null;
  };

  return (
    <Box
      className={`${className} ${styles.mapContainer}`}
      sx={{ width: "100%", position: "relative" }}
    >
      {/* Controles del mapa */}
      {showControls && (
        <MapControls
          onRefresh={handleRefresh}
          onLocationClick={handleLocationClick}
        />
      )}

      {/* Mapa */}
      <Box sx={{ position: "relative" }}>
        {/* Renderizar mensajes informativos */}
        {renderInfoMessages()}

        {/* El mapa siempre está presente */}
        <Box
          ref={mapRef}
          className={styles.mapElement}
          sx={{ height: responsiveHeight }}
        />

        {/* Indicador de carga sutil como overlay */}
        {loading && (
          <Box
            sx={{
              position: "absolute",
              top: "10px",
              right: "10px",
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              borderRadius: "8px",
              padding: "8px 12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              zIndex: 1000,
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <CircularProgress size={16} />
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontSize: "11px" }}
            >
              Cargando...
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default MapComponent;
