"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  useMediaQuery,
} from "@mui/material";
import { Loader } from "@googlemaps/js-api-loader";
import { useViewportBasedLoading } from "@/hooks/useViewportBasedLoading";
import MapControls from "./MapControls";
import MapScrollWrapper from "./MapScrollWrapper";
import {
  MAP_CONFIG,
  PIN_CONFIGS,
  formatPrice,
  formatPriceShort,
} from "./mapConfig";
import styles from "./MapComponent.module.css";

const MapComponent = ({
  properties = null,
  height = "600px",
  showControls = true,
  onPropertyClick = null,
  onPropertiesUpdate = null,
  className = "",
}) => {
  const isMobile = useMediaQuery("(max-width:450px)");

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
  } = useViewportBasedLoading();

  // Usar todas las propiedades del viewport
  const filteredProperties = viewportProperties;

  // Guardar altura original cuando cambie la prop height
  useEffect(() => {
    setOriginalHeight(height);
    setResponsiveHeight(height);
  }, [height]);

  // Crear estilos de pines personalizados
  const createPinStyles = useCallback((google) => {
    if (!google) return {};

    const createSVG = (type, price, color) => {
      const formattedPrice = formatPriceShort(price);
      const typeLabel = type === "house" ? "Casa" : "Apt";

      return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
        <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="2" dy="2" stdDeviation="2" flood-color="rgba(0,0,0,0.3)"/>
            </filter>
          </defs>
          
          <path d="M50 10 L75 37 L75 54 L50 60 L25 54 L25 37 Z" fill="white" stroke="${color}" stroke-width="2" filter="url(#shadow)"/>
          <path d="M50 10 L75 37 L25 37 Z" fill="white" stroke="${color}" stroke-width="2" filter="url(#shadow)"/>
          <path d="M50 56 L55 65 L50 75 L45 65 Z" fill="white" stroke="${color}" stroke-width="2" filter="url(#shadow)"/>
          
          <text x="50" y="30" text-anchor="middle" fill="black" font-size="9" font-weight="bold" font-family="Arial, sans-serif">${typeLabel}</text>
          <text x="50" y="53" text-anchor="middle" fill="black" font-size="12" font-weight="bold" font-family="Arial, sans-serif">${formattedPrice}</text>
        </svg>
      `)}`;
    };

    return {
      default: {
        url: createSVG("default", null, PIN_CONFIGS.default.color),
        scaledSize: new google.maps.Size(100, 100),
        anchor: new google.maps.Point(50, 50),
      },
      house: {
        url: createSVG("house", null, PIN_CONFIGS.house.color),
        scaledSize: new google.maps.Size(100, 100),
        anchor: new google.maps.Point(50, 50),
      },
      apartment: {
        url: createSVG("apartment", null, PIN_CONFIGS.apartment.color),
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
      return;
    }

    const map = mapInstanceRef.current;

    try {
      const streetView = map.getStreetView();
      const isStreetView = streetView && streetView.getVisible();

      markersRef.current.forEach((marker) => {
        if (marker.updatePinSize) {
          marker.updatePinSize(isStreetView);
        }
      });
    } catch (error) {
      console.error("Error al actualizar marcadores:", error);
    }
  }, []);

  // Inicializar Google Maps
  const initializeMap = useCallback(async () => {
    if (mapInstanceRef.current || isMapLoaded) {
      return;
    }

    try {
      const loader = new Loader({
        apiKey:
          process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "YOUR_API_KEY_HERE",
        version: "weekly",
        libraries: ["places"],
      });

      const google = await loader.load();
      googleRef.current = google;

      if (!mapRef.current) {
        return;
      }

      const pinStyles = createPinStyles(google);

      const map = new google.maps.Map(mapRef.current, {
        ...MAP_CONFIG,
        center: MAP_CONFIG.center,
        zoom: MAP_CONFIG.zoom,
        styles: MAP_CONFIG.styles,
      });

      mapInstanceRef.current = map;

      // Esperar a que el mapa esté completamente cargado
      google.maps.event.addListenerOnce(map, "idle", () => {
        setIsMapLoaded(true);
        infoWindowRef.current = new google.maps.InfoWindow();

        // Función para restaurar altura
        const restoreMapHeight = () => {
          const currentIsMobile = window.innerWidth <= 450;

          if (currentIsMobile) {
            setResponsiveHeight(originalHeight);

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
          restoreMapHeight();

          setTimeout(() => {
            setIsMapInteractionBlocked(false);
          }, 500);
        });

        infoWindowRef.current.addListener("close", () => {
          setIsInfoWindowOpen(false);
          restoreMapHeight();

          setTimeout(() => {
            setIsMapInteractionBlocked(false);
          }, 500);
        });

        // Agregar listener para cerrar ventana de información al hacer clic en el mapa
        map.addListener("click", () => {
          if (infoWindowRef.current) {
            infoWindowRef.current.close();
            setIsInfoWindowOpen(false);
            restoreMapHeight();

            setTimeout(() => {
              setIsMapInteractionBlocked(false);
            }, 500);
          }
        });

        // Agregar listeners para cambios de viewport con debounce
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
          }, 500);
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
          setTimeout(() => {
            updateAllMarkersSize();
          }, 300);
        });

        // Listener para detectar clics en el mapa
        map.addListener("click", () => {
          setTimeout(() => {
            updateAllMarkersSize();
          }, 500);
        });

        // Listener para detectar cambios en el zoom
        map.addListener("zoom_changed", () => {
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

        setHasInitialBounds(true);
      });
    } catch (err) {
      console.error("Error initializing Google Maps:", err);
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

    // Limpiar marcadores existentes
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    const validProperties = filteredProperties.filter((property) => {
      const hasValidCoords =
        property.lat &&
        property.lng &&
        !isNaN(parseFloat(property.lat)) &&
        !isNaN(parseFloat(property.lng));

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
        const formattedPrice = formatPriceShort(price);
        const typeLabel = type === "house" ? "Casa" : "Apt";
        const color = PIN_CONFIGS[type]?.color || PIN_CONFIGS.default.color;

        // Tamaño del pin: más grande para Street View
        const size = isLarge ? 400 : 80;
        const fontSize = isLarge ? 45 : 11;
        const typeFontSize = isLarge ? 40 : 9;

        return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
          <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="1" dy="1" stdDeviation="1" flood-color="rgba(0,0,0,0.3)"/>
              </filter>
            </defs>
            
            <path d="M${size / 2} ${size * 0.1} L${size * 0.75} ${
          size * 0.375
        } L${size * 0.75} ${size * 0.55} L${size / 2} ${size * 0.6125} L${
          size * 0.25
        } ${size * 0.55} L${size * 0.25} ${
          size * 0.375
        } Z" fill="white" stroke="${color}" stroke-width="2" filter="url(#shadow)"/>
            <path d="M${size / 2} ${size * 0.1} L${size * 0.75} ${
          size * 0.375
        } L${size * 0.25} ${
          size * 0.375
        } Z" fill="white" stroke="${color}" stroke-width="2" filter="url(#shadow)"/>
            <path d="M${size / 2} ${size * 0.5625} L${size * 0.5625} ${
          size * 0.65
        } L${size / 2} ${size * 0.75} L${size * 0.4375} ${
          size * 0.65
        } Z" fill="white" stroke="${color}" stroke-width="2" filter="url(#shadow)"/>
            
            <text x="${size / 2}" y="${
          size * 0.3
        }" text-anchor="middle" fill="black" font-size="${typeFontSize}" font-weight="bold" font-family="Arial, sans-serif">${typeLabel}</text>
            <text x="${size / 2}" y="${
          size * 0.5125
        }" text-anchor="middle" fill="black" font-size="${fontSize}" font-weight="bold" font-family="Arial, sans-serif">${formattedPrice}</text>
          </svg>
        `)}`;
      };

      const customPin = createCustomPin(property.type, property.price, false);
      const largePin = createCustomPin(property.type, property.price, true);

      const marker = new google.maps.Marker({
        position,
        map: mapInstanceRef.current,
        icon: {
          url: customPin,
          scaledSize: new google.maps.Size(80, 80),
          anchor: new google.maps.Point(40, 40),
        },
        title: property.prototypeName || property.name || "Propiedad",
        zIndex: 1000,
        optimized: false,
      });

      // Función para cambiar el tamaño del pin según la vista
      const updatePinSize = (isStreetView) => {
        try {
          if (isStreetView) {
            marker.setIcon({
              url: largePin,
              scaledSize: new google.maps.Size(400, 400),
              anchor: new google.maps.Point(200, 200),
            });
          } else {
            marker.setIcon({
              url: customPin,
              scaledSize: new google.maps.Size(80, 80),
              anchor: new google.maps.Point(40, 40),
            });
          }
        } catch (error) {
          console.error("Error al actualizar pin:", error);
        }
      };

      marker.updatePinSize = updatePinSize;

      // Crear contenido de la ventana de información
      const infoContent = createInfoWindowContent(property);

      // Agregar listener para mostrar información
      marker.addListener("click", () => {
        setIsInfoWindowOpen(true);
        setIsMapInteractionBlocked(true);

        // En móviles, cambiar la altura del mapa cuando se abra el InfoWindow
        if (isMobile) {
          setResponsiveHeight("600px");

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
      const bounds = new google.maps.LatLngBounds();
      markersRef.current.forEach((marker) => {
        bounds.extend(marker.getPosition());
      });

      setIsAdjustingView(true);
      mapInstanceRef.current.fitBounds(bounds);

      setTimeout(() => {
        setIsAdjustingView(false);
        setHasInitialBounds(true);
      }, 500);
    }

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
    const getTypeColor = (type) => {
      return PIN_CONFIGS[type]?.color || PIN_CONFIGS.default.color;
    };

    // Limpiar la ruta de la imagen
    const cleanImagePath =
      property.mainImage?.replace("uploads/prototypes/", "") || "";

    return `
      <div style="padding: 0; max-width: 350px; font-family: 'Segoe UI', Arial, sans-serif; border-radius: 8px; overflow: hidden;">
        ${
          cleanImagePath
            ? `<div style="width: 100%; height: 140px; background-image: url('https://minkaasa-images.s3.us-east-1.amazonaws.com/${encodeURIComponent(
                cleanImagePath
              )}'); background-size: cover; background-position: center; background-repeat: no-repeat; border-radius: 8px 8px 0 0;"></div>`
            : ""
        }
        
        <div style="padding: 12px;">
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
              ${PIN_CONFIGS[property.type]?.symbol || property.type}
            </span>
          </div>
          
          <div style="margin-bottom: 8px;">
            <div style="text-align: center; margin-bottom: 8px;">
              <div style="font-weight: bold; color: #2e7d32; font-size: 14px; padding: 6px 12px; background-color: #f5f5f5; border-radius: 6px; display: block; width: 100%; box-sizing: border-box;">
                ${formatPrice(property.price)}
              </div>
            </div>
            
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
            
            <div style="text-align: center;">
              <a href="https://minkaasa.com/property/${
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
          console.error("Error: The Geolocation service failed.");
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
    if (!mapInstanceRef.current && !isMapLoaded) {
      initializeMap();
    }
  }, []);

  // Efecto para verificar periódicamente el estado de Street View
  useEffect(() => {
    if (!isMapLoaded || markersRef.current.length === 0) return;

    const interval = setInterval(() => {
      updateAllMarkersSize();
    }, 2000);

    return () => clearInterval(interval);
  }, [isMapLoaded, updateAllMarkersSize]);

  useEffect(() => {
    if (isMapLoaded && filteredProperties.length > 0 && !isAdjustingView) {
      const timeoutId = setTimeout(() => {
        createMarkers();
      }, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [isMapLoaded, filteredProperties, isAdjustingView]);

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

    return null;
  };

  return (
    <MapScrollWrapper className={`${className} ${styles.mapContainer}`}>
      {/* Controles del mapa */}
      {showControls && (
        <MapControls
          onRefresh={handleRefresh}
          onLocationClick={handleLocationClick}
        />
      )}

      {/* Mapa */}
      <Box sx={{ position: "relative" }}>
        {renderInfoMessages()}

        <Box
          ref={mapRef}
          className={styles.mapElement}
          sx={{ height: responsiveHeight }}
        />

        {/* Indicador de carga eliminado para evitar movimiento del mapa */}
      </Box>
    </MapScrollWrapper>
  );
};

export default MapComponent;
