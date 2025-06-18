import React, {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useCallback,
} from "react";
import { Box, CircularProgress, IconButton } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { VolumeOff, VolumeUp } from "@mui/icons-material";
import {
  emergencyStopAllRequests,
  clearVideoCache,
  resetCircuitBreaker,
  getVideoCacheStats,
  disableHotReloadSuppression,
} from "../../hooks/usePropertyVideo";

/**
 * VideoPlayer - Componente centralizado para reproducir videos de propiedades
 * ⚡ SOLUCIÓN CON HEADERS DEL SERVIDOR PARA DETENER LLAMADAS INFINITAS
 *
 * CAMBIOS CRÍTICOS:
 * - x-video-is-complete: true (video completamente descargado)
 * - x-video-range-end: número del último byte válido
 * - content-range: comparar con range-end para detectar completitud
 * - Auto-stop cuando video está completo
 */
const VideoPlayer = forwardRef(
  (
    {
      videoUrl,
      loading = false,
      error = null,
      autoplay = false,
      muted = true,
      controls = false,
      onClick,
      showPlayButton = true,
      showVolumeControl = true,
      fallbackComponent = null,
      sx = {},
      ...videoProps
    },
    ref
  ) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(muted);
    const [hasTriedAutoplay, setHasTriedAutoplay] = useState(false);
    const [streamError, setStreamError] = useState(null);
    const [streamStatus, setStreamStatus] = useState("ready");
    const [retryCount, setRetryCount] = useState(0);
    const videoRef = useRef(null);
    const videoCompleteRef = useRef(false);
    const videoRangeEndRef = useRef(null);
    const maxRetries = 1;

    // ⚡ RATE LIMITING MÁS ESTRICTO
    const [seekingCount, setSeekingCount] = useState(0);
    const [lastSeekTime, setLastSeekTime] = useState(0);
    const seekingThrottleRef = useRef(null);
    const timeUpdateThrottleRef = useRef(null);
    const MIN_SEEK_INTERVAL = 2000; // ⚡ 2 segundos mínimo entre seeks

    // Combinar refs
    React.useImperativeHandle(ref, () => videoRef.current);

    // ⚡ INTERCEPTAR Y ANALIZAR HEADERS DEL SERVIDOR
    const setupServerHeaderMonitoring = useCallback(() => {
      if (!videoUrl) return;

      console.log("🔧 Setting up server header monitoring for:", videoUrl);

      // Interceptar fetch requests para este video específico
      const originalFetch = window.fetch;

      window.fetch = function (url, options = {}) {
        // Solo interceptar requests a nuestro video
        if (typeof url === "string" && url.includes(videoUrl)) {
          // Si ya sabemos que el video está completo, bloquear futuras requests
          if (videoCompleteRef.current) {
            console.log("🚫 VIDEO COMPLETE - Blocking unnecessary request");

            // Devolver una respuesta mock para evitar requests innecesarias
            return Promise.resolve(
              new Response(new Blob(), {
                status: 206,
                statusText: "Partial Content (Cached)",
                headers: new Headers({
                  "content-range": `bytes 0-${videoRangeEndRef.current}/${
                    videoRangeEndRef.current + 1
                  }`,
                  "x-video-is-complete": "true",
                  "x-video-range-end":
                    videoRangeEndRef.current?.toString() || "0",
                }),
              })
            );
          }

          // Interceptar response para analizar headers del servidor
          return originalFetch
            .call(this, url, options)
            .then((response) => {
              const isComplete = response.headers.get("x-video-is-complete");
              const rangeEnd = response.headers.get("x-video-range-end");
              const contentRange = response.headers.get("content-range");

              console.log("📊 Server Headers Analysis:", {
                isComplete: isComplete,
                rangeEnd: rangeEnd,
                contentRange: contentRange,
                url: url,
              });

              // ⚡ DETECTAR COMPLETITUD DEL VIDEO
              if (isComplete === "true") {
                console.log("✅ SERVER CONFIRMS: Video is complete");
                videoCompleteRef.current = true;
                videoRangeEndRef.current = parseInt(rangeEnd) || null;
              } else if (contentRange && rangeEnd) {
                // Analizar content-range vs range-end
                const match = contentRange.match(/bytes (\d+)-(\d+)\/(\d+)/);

                if (match) {
                  const [, start, end, total] = match;
                  const currentEnd = parseInt(end);
                  const expectedEnd = parseInt(rangeEnd);
                  const totalSize = parseInt(total);

                  console.log("🔍 Range Analysis:", {
                    start: parseInt(start),
                    currentEnd: currentEnd,
                    expectedEnd: expectedEnd,
                    totalSize: totalSize,
                    isAtEnd: currentEnd >= expectedEnd,
                  });

                  // ⚡ DETECTAR SI YA LLEGAMOS AL FINAL
                  if (currentEnd >= expectedEnd) {
                    console.log("🎯 RANGE COMPLETE: currentEnd >= expectedEnd");
                    videoCompleteRef.current = true;
                    videoRangeEndRef.current = expectedEnd;

                    // Actualizar fetch para futuras requests
                    window.fetch = function (url, options = {}) {
                      if (typeof url === "string" && url.includes(videoUrl)) {
                        console.log("🚫 BLOCKING: Video already complete");
                        return Promise.resolve(
                          new Response(new Blob(), {
                            status: 206,
                            statusText: "Partial Content (Complete)",
                            headers: new Headers({
                              "content-range": `bytes 0-${expectedEnd}/${totalSize}`,
                              "x-video-is-complete": "true",
                              "x-video-range-end": expectedEnd.toString(),
                            }),
                          })
                        );
                      }
                      return originalFetch.call(this, url, options);
                    };
                  } else {
                    console.log(
                      `⏳ PARTIAL: Need more data (${currentEnd} < ${expectedEnd})`
                    );
                  }
                }
              }

              return response;
            })
            .catch((error) => {
              console.error("❌ Fetch intercept error:", error);
              return Promise.reject(error);
            });
        }

        return originalFetch.call(this, url, options);
      };
    }, [videoUrl]);

    // ⚡ SEEKING HANDLER ULTRA RESTRICTIVO
    const handleSeeking = useCallback(
      (e) => {
        const currentTime = Date.now();
        const video = e.target;

        // ⚡ BLOQUEAR SI VIDEO YA ESTÁ COMPLETO Y HAY MUCHOS SEEKS
        if (videoCompleteRef.current && seekingCount > 3) {
          console.log("🚫 SEEKING BLOCKED - Video complete, too many seeks");
          e.preventDefault();
          return false;
        }

        // ⚡ RATE LIMITING ESTRICTO: 2 segundos mínimo
        if (currentTime - lastSeekTime < MIN_SEEK_INTERVAL) {
          console.error(
            `🚫 SEEKING BLOCKED - Too frequent (${
              currentTime - lastSeekTime
            }ms)`
          );
          e.preventDefault();
          return false;
        }

        setLastSeekTime(currentTime);
        setSeekingCount((prev) => {
          const newCount = prev + 1;

          // ⚡ ADVERTENCIA CRÍTICA después de 5 seeks
          if (newCount > 5) {
            console.error(
              `🚨 CRITICAL: ${newCount} seeks detected - Possible infinite loop`
            );
            if (newCount > 10) {
              console.error(
                `💀 EXTREME: ${newCount} seeks - BLOCKING ALL SEEKING`
              );
              e.preventDefault();
              return newCount;
            }
          }

          return newCount;
        });

        // ⚡ LOG SOLO PARA DEBUGGING CRÍTICO
        if (process.env.NODE_ENV === "development" && seekingCount > 3) {
          console.warn(
            `⚠️ SEEK: ${video.currentTime.toFixed(
              1
            )}s | Count: ${seekingCount} | Complete: ${
              videoCompleteRef.current
            }`
          );
        }

        // ⚡ THROTTLING ADAPTATIVO
        if (seekingThrottleRef.current) {
          clearTimeout(seekingThrottleRef.current);
        }

        const throttleTime = seekingCount > 5 ? 5000 : 2000;
        seekingThrottleRef.current = setTimeout(() => {
          // Solo reset, sin logs adicionales
        }, throttleTime);
      },
      [lastSeekTime, seekingCount]
    );

    // ⚡ TIME UPDATE THROTTLED
    const handleTimeUpdate = useCallback((e) => {
      if (timeUpdateThrottleRef.current) return;

      timeUpdateThrottleRef.current = setTimeout(() => {
        timeUpdateThrottleRef.current = null;
      }, 5000);
    }, []);

    // Manejar clic en el video
    const handleVideoClick = () => {
      if (onClick) {
        onClick();
      } else if (!isPlaying) {
        handlePlayVideo();
      }
    };

    // ⚡ PLAY VIDEO OPTIMIZADO
    const handlePlayVideo = async () => {
      const video = videoRef.current;
      if (!video || !videoUrl) return;

      try {
        // Pausar otros videos en la página
        const allVideos = document.querySelectorAll("video");
        allVideos.forEach((v) => {
          if (v !== video && !v.paused) {
            v.pause();
          }
        });

        // ⚡ CRÍTICO: NO TOCAR currentTime para evitar seeking

        // Intentar reproducir con audio primero
        try {
          video.muted = false;
          video.volume = 0.7;
          await video.play();
          setIsMuted(false);
          setIsPlaying(true);
        } catch (audioError) {
          // Si falla con audio, intentar silenciado
          video.muted = true;
          await video.play();
          setIsMuted(true);
          setIsPlaying(true);
        }
      } catch (error) {
        console.error("❌ VideoPlayer: Manual play failed:", error);
      }
    };

    // Toggle mute
    const handleToggleMute = (e) => {
      e.stopPropagation();
      const video = videoRef.current;
      if (video) {
        const newMutedState = !isMuted;
        video.muted = newMutedState;
        setIsMuted(newMutedState);
      }
    };

    // ⚡ SETUP DE SERVER HEADER MONITORING
    useEffect(() => {
      if (videoUrl) {
        setupServerHeaderMonitoring();
      }

      return () => {
        // Reset flags al cambiar video
        videoCompleteRef.current = false;
        videoRangeEndRef.current = null;
      };
    }, [videoUrl, setupServerHeaderMonitoring]);

    // ⚡ MANEJAR EVENTOS DE VIDEO
    useEffect(() => {
      const video = videoRef.current;
      if (!video) {
        return;
      }

      // Reset estados
      setStreamError(null);
      setStreamStatus("loading");
      setRetryCount(0);
      setSeekingCount(0);

      const handleLoadStartInternal = () => {
        setStreamStatus("loading");
        setStreamError(null);
      };

      const handleLoadedDataInternal = () => {
        video.volume = 0.7;
        video.muted = muted;
        setIsMuted(muted);
        setStreamStatus("ready");
        setStreamError(null);
      };

      const handleCanPlayInternal = () => {
        setStreamStatus("ready");
      };

      const handleLoadedMetadataInternal = () => {
        // ⚡ NO HACER SEEKING AUTOMÁTICO
      };

      const handleError = (e) => {
        const error = e.target.error;
        let errorMessage = "Error al cargar el video";
        let errorType = "error";

        console.error("🚨 Video Error Details:", {
          code: error?.code,
          message: error?.message,
          networkState: e.target.networkState,
          readyState: e.target.readyState,
          currentSrc: e.target.currentSrc,
          videoComplete: videoCompleteRef.current,
          rangeEnd: videoRangeEndRef.current,
        });

        switch (error?.code) {
          case 1: // MEDIA_ERR_ABORTED
            errorMessage = "Carga del video cancelada";
            break;
          case 2: // MEDIA_ERR_NETWORK
            errorMessage = "Error de red";

            // ⚡ RETRY SOLO SI EL VIDEO NO ESTÁ COMPLETO
            if (retryCount < maxRetries && !videoCompleteRef.current) {
              console.warn(
                `🔄 Retrying network error (attempt ${retryCount + 1})`
              );
              setTimeout(() => {
                setRetryCount((prev) => prev + 1);
                video.load(); // Reload video
              }, 3000 * (retryCount + 1));
              return;
            } else if (videoCompleteRef.current) {
              console.log("✅ Network error but video is complete - ignoring");
              setStreamStatus("ready");
              return;
            }
            break;
          case 3: // MEDIA_ERR_DECODE
            errorMessage = "Error al decodificar el video";
            break;
          case 4: // MEDIA_ERR_SRC_NOT_SUPPORTED
            errorMessage = "Video no disponible o formato no soportado";
            errorType = "not-found";
            break;
          default:
            errorMessage = "Error desconocido al cargar el video";
        }

        setStreamError(errorMessage);
        setStreamStatus(errorType);
      };

      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);
      const handleEnded = () => {
        setIsPlaying(false);
        video.removeAttribute("autoplay");
      };

      // ⚡ AGREGAR EVENTOS
      video.addEventListener("loadstart", handleLoadStartInternal);
      video.addEventListener("loadeddata", handleLoadedDataInternal);
      video.addEventListener("loadedmetadata", handleLoadedMetadataInternal);
      video.addEventListener("canplay", handleCanPlayInternal);
      video.addEventListener("error", handleError);
      video.addEventListener("play", handlePlay);
      video.addEventListener("pause", handlePause);
      video.addEventListener("ended", handleEnded);

      if (video.readyState >= 2) {
        handleLoadedDataInternal();
      }

      return () => {
        video.removeEventListener("loadstart", handleLoadStartInternal);
        video.removeEventListener("loadeddata", handleLoadedDataInternal);
        video.removeEventListener(
          "loadedmetadata",
          handleLoadedMetadataInternal
        );
        video.removeEventListener("canplay", handleCanPlayInternal);
        video.removeEventListener("error", handleError);
        video.removeEventListener("play", handlePlay);
        video.removeEventListener("pause", handlePause);
        video.removeEventListener("ended", handleEnded);

        if (seekingThrottleRef.current) {
          clearTimeout(seekingThrottleRef.current);
        }
        if (timeUpdateThrottleRef.current) {
          clearTimeout(timeUpdateThrottleRef.current);
        }
      };
    }, [videoUrl, muted]);

    // ⚡ CLEANUP AL DESMONTAR
    useEffect(() => {
      return () => {
        if (seekingThrottleRef.current) {
          clearTimeout(seekingThrottleRef.current);
        }
        if (timeUpdateThrottleRef.current) {
          clearTimeout(timeUpdateThrottleRef.current);
        }

        const video = videoRef.current;
        if (video && !video.paused) {
          video.pause();
        }
      };
    }, []);

    // ⚡ AUTOPLAY CONSERVADOR
    useEffect(() => {
      const video = videoRef.current;
      if (!video || !videoUrl || !autoplay || hasTriedAutoplay) return;

      const tryAutoplay = async () => {
        setHasTriedAutoplay(true);

        try {
          const allVideos = document.querySelectorAll("video");
          allVideos.forEach((v) => {
            if (v !== video && !v.paused) {
              v.pause();
            }
          });

          video.muted = true;
          await video.play();
          setIsPlaying(true);
        } catch (error) {
          // Autoplay silent fail
        }
      };

      const timer = setTimeout(tryAutoplay, 500);
      return () => clearTimeout(timer);
    }, [videoUrl, autoplay, hasTriedAutoplay]);

    // ⚡ MONITORING CRÍTICO
    useEffect(() => {
      if (seekingCount > 10) {
        console.error(`💀 CRITICAL SEEKING OVERLOAD: ${seekingCount} seeks`);
        setTimeout(() => {
          setSeekingCount(0);
          setLastSeekTime(0);
        }, 10000);
      }
    }, [seekingCount]);

    // ⚡ DESARROLLO: Funciones de diagnóstico
    useEffect(() => {
      if (process.env.NODE_ENV === "development") {
        window.getVideoPlayerStats = () => ({
          seekingCount,
          lastSeekTime,
          isPlaying,
          streamStatus,
          retryCount,
          videoComplete: videoCompleteRef.current,
          rangeEnd: videoRangeEndRef.current,
        });

        window.resetVideoPlayer = () => {
          setSeekingCount(0);
          setLastSeekTime(0);
          videoCompleteRef.current = false;
          videoRangeEndRef.current = null;
          console.log("🔄 VideoPlayer stats reset");
        };

        window.forceVideoComplete = () => {
          videoCompleteRef.current = true;
          console.log("✅ Video manually marked as complete");
        };

        window.getServerHeaders = () => ({
          videoComplete: videoCompleteRef.current,
          rangeEnd: videoRangeEndRef.current,
          url: videoUrl,
        });

        // ⚡ EMERGENCY FUNCTIONS
        window.emergencyStopAllRequests = emergencyStopAllRequests;
        window.clearVideoCache = clearVideoCache;
        window.resetCircuitBreaker = resetCircuitBreaker;
        window.getVideoCacheStats = getVideoCacheStats;
        window.disableHotReloadSuppression = disableHotReloadSuppression;

        console.log("🔧 Emergency functions loaded:", {
          emergencyStopAllRequests: "🚨 Stop all video requests",
          clearVideoCache: "🗑️ Clear video cache",
          resetCircuitBreaker: "🔧 Reset circuit breaker",
          getVideoCacheStats: "�� Get cache stats",
          disableHotReloadSuppression: "🚫 Disable hot reload suppression",
        });
      }
    }, [
      seekingCount,
      lastSeekTime,
      isPlaying,
      streamStatus,
      retryCount,
      videoUrl,
    ]);

    // ⚡ LOADING
    if (loading && !videoUrl) {
      return (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#000",
            borderRadius: 1,
            minHeight: 200,
            gap: 2,
            ...sx,
          }}
        >
          <CircularProgress sx={{ color: "white" }} />
          <Box
            sx={{ color: "white", fontSize: "0.875rem", textAlign: "center" }}
          >
            {retryCount > 0
              ? `Reintentando... (${retryCount}/${maxRetries})`
              : "Cargando..."}
          </Box>
        </Box>
      );
    }

    // ⚡ FALLBACK
    if (
      error ||
      streamError ||
      !videoUrl ||
      streamStatus === "error" ||
      streamStatus === "not-found"
    ) {
      const displayError = streamError || error || "Video no disponible";

      return (
        fallbackComponent || (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#f5f5f5",
              borderRadius: 1,
              minHeight: 200,
              color: "text.secondary",
              gap: 1,
              padding: 2,
              textAlign: "center",
              ...sx,
            }}
          >
            <Box sx={{ fontSize: "1rem", fontWeight: 500 }}>
              {streamStatus === "not-found"
                ? "Video no encontrado"
                : "Video no disponible"}
            </Box>
            <Box sx={{ fontSize: "0.875rem", opacity: 0.7 }}>
              {displayError}
            </Box>
          </Box>
        )
      );
    }

    // ⚡ RENDERIZAR VIDEO CON SERVER HEADER MONITORING
    return (
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: "100%",
          backgroundColor: "#000",
          borderRadius: 1,
          overflow: "hidden",
          cursor: onClick ? "pointer" : "default",
          ...sx,
        }}
        onClick={handleVideoClick}
      >
        <video
          ref={(el) => {
            videoRef.current = el;
          }}
          src={videoUrl}
          muted={muted}
          playsInline
          controls={controls}
          preload="metadata"
          crossOrigin="anonymous"
          onSeeking={handleSeeking}
          onTimeUpdate={handleTimeUpdate}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
          {...videoProps}
        >
          Tu navegador no soporta el elemento video.
        </video>

        {/* ⚡ BOTÓN DE PLAY */}
        {showPlayButton && !isPlaying && !controls && (
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              handlePlayVideo();
            }}
            sx={{
              position: "absolute",
              top: 12,
              left: 12,
              background: "linear-gradient(135deg, #F0B92B 0%, #FFD666 100%)",
              borderRadius: "50%",
              color: "#37474F",
              boxShadow: "0 3px 12px rgba(240, 185, 43, 0.4)",
              border: "2px solid rgba(255, 255, 255, 0.9)",
              zIndex: 10,
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                transform: "scale(1.1)",
                boxShadow: "0 4px 16px rgba(240, 185, 43, 0.6)",
                background: "linear-gradient(135deg, #FFD666 0%, #F0B92B 100%)",
              },
            }}
          >
            <PlayArrowIcon sx={{ fontSize: "1.5rem", ml: 0.2 }} />
          </IconButton>
        )}

        {/* ⚡ CONTROL DE VOLUMEN */}
        {showVolumeControl && isPlaying && !controls && (
          <IconButton
            onClick={handleToggleMute}
            sx={{
              position: "absolute",
              bottom: 8,
              right: 8,
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              color: "white",
              zIndex: 10,
              width: 32,
              height: 32,
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.9)",
                transform: "scale(1.1)",
              },
              transition: "all 0.2s ease-in-out",
            }}
          >
            {isMuted ? (
              <VolumeOff sx={{ fontSize: 16 }} />
            ) : (
              <VolumeUp sx={{ fontSize: 16 }} />
            )}
          </IconButton>
        )}
      </Box>
    );
  }
);

VideoPlayer.displayName = "VideoPlayer";

export default VideoPlayer;
