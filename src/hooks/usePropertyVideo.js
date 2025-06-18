import { useState, useEffect, useRef, useCallback } from "react";
import { videoService } from "../services/videoService";

// Cache global para URLs de video construidas (muy ligero, solo URLs)
const videoUrlCache = new Map();
const CACHE_EXPIRY = 5 * 60 * 1000; // ⚡ REDUCIDO A 5 MINUTOS - Más agresivo

// Cache para peticiones en progreso - evita HEAD requests duplicados
const pendingRequests = new Map();

// Rate limiting global más estricto
const REQUEST_COOLDOWN = 2000; // ⚡ 2 segundos mínimo entre requests
const lastRequestTimes = new Map();

// ⚡ CIRCUIT BREAKER para Hot Reload y errores 429
const circuitBreaker = new Map(); // prototypeId -> { failures, lastFailure, blocked }
const MAX_FAILURES = 3;
const CIRCUIT_BREAKER_TIMEOUT = 30000; // 30 segundos

// ⚡ HOT RELOAD DETECTION - MEJORADA
const hotReloadDetection = {
  lastReload: Date.now(),
  suppressDuration: 3000, // ⚡ REDUCIDO A 3 segundos
  maxSuppressionTime: 10000, // ⚡ MÁXIMO 10 segundos total
  isInSuppression: false,
  suppressionStartTime: 0,
};

// Detectar hot reload - MENOS AGRESIVO
if (typeof window !== "undefined") {
  const originalConsoleLog = console.log;
  console.log = function (...args) {
    if (
      args.some(
        (arg) =>
          typeof arg === "string" &&
          (arg.includes("[Fast Refresh]") || arg.includes("rebuilding"))
      )
    ) {
      const now = Date.now();

      // ⚡ NO reactivar si ya está en supresión por mucho tiempo
      if (
        hotReloadDetection.isInSuppression &&
        now - hotReloadDetection.suppressionStartTime >
          hotReloadDetection.maxSuppressionTime
      ) {
        console.warn("⏰ Hot reload suppression EXPIRED - Allowing requests");
        hotReloadDetection.isInSuppression = false;
        return originalConsoleLog.apply(console, args);
      }

      // Solo activar si no está ya en supresión
      if (!hotReloadDetection.isInSuppression) {
        console.warn("🔥 HOT RELOAD DETECTED - Suppressing video requests");
        hotReloadDetection.isInSuppression = true;
        hotReloadDetection.suppressionStartTime = now;

        // Auto-clear después de suppressDuration
        setTimeout(() => {
          hotReloadDetection.isInSuppression = false;
          console.warn("✅ Hot reload suppression ended");
        }, hotReloadDetection.suppressDuration);
      }

      hotReloadDetection.lastReload = now;
    }
    return originalConsoleLog.apply(console, args);
  };
}

export const usePropertyVideo = (prototypeId) => {
  const [videoData, setVideoData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const isMountedRef = useRef(true);
  const lastProcessedId = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // ⚡ CIRCUIT BREAKER LOGIC
  const checkCircuitBreaker = useCallback((id) => {
    const breaker = circuitBreaker.get(id);
    if (!breaker) return { canProceed: true };

    const now = Date.now();

    // Si está bloqueado, verificar si ya pasó el timeout
    if (
      breaker.blocked &&
      now - breaker.lastFailure > CIRCUIT_BREAKER_TIMEOUT
    ) {
      console.log(`🔧 Circuit breaker reset for video ${id}`);
      circuitBreaker.delete(id);
      return { canProceed: true };
    }

    if (breaker.blocked) {
      const timeLeft = Math.ceil(
        (CIRCUIT_BREAKER_TIMEOUT - (now - breaker.lastFailure)) / 1000
      );
      console.log(
        `🚫 Circuit breaker ACTIVE for video ${id} - ${timeLeft}s remaining`
      );
      return {
        canProceed: false,
        error: `Circuit breaker active. Try again in ${timeLeft} seconds.`,
        isCircuitBreaker: true,
      };
    }

    return { canProceed: true };
  }, []);

  // ⚡ UPDATE CIRCUIT BREAKER
  const updateCircuitBreaker = useCallback((id, isSuccess) => {
    const breaker = circuitBreaker.get(id) || {
      failures: 0,
      lastFailure: 0,
      blocked: false,
    };

    if (isSuccess) {
      // Reset on success
      circuitBreaker.delete(id);
    } else {
      breaker.failures += 1;
      breaker.lastFailure = Date.now();

      if (breaker.failures >= MAX_FAILURES) {
        breaker.blocked = true;
        console.error(
          `💥 Circuit breaker TRIGGERED for video ${id} after ${breaker.failures} failures`
        );
      }

      circuitBreaker.set(id, breaker);
    }
  }, []);

  // ⚡ CRÍTICO: useCallback SIN dependencias para evitar recreación
  const buildVideoUrl = useCallback(
    async (id) => {
      // ⚡ HOT RELOAD SUPPRESSION - MENOS AGRESIVA
      if (hotReloadDetection.isInSuppression) {
        const now = Date.now();
        const timeSinceStart = now - hotReloadDetection.suppressionStartTime;

        // ⚡ AUTO-EXPIRE si ha pasado mucho tiempo
        if (timeSinceStart > hotReloadDetection.maxSuppressionTime) {
          console.warn(
            "⏰ Hot reload suppression EXPIRED - Processing request"
          );
          hotReloadDetection.isInSuppression = false;
        } else {
          console.log(
            `🔥 HOT RELOAD SUPPRESSION - Skipping video ${id} request (${Math.ceil(
              (hotReloadDetection.maxSuppressionTime - timeSinceStart) / 1000
            )}s remaining)`
          );
          return {
            success: false,
            videoUrl: null,
            exists: false,
            error: "Hot reload in progress - Please wait",
            isHotReload: true,
          };
        }
      }

      // ⚡ CIRCUIT BREAKER CHECK
      const breakerCheck = checkCircuitBreaker(id);
      if (!breakerCheck.canProceed) {
        return {
          success: false,
          videoUrl: null,
          exists: false,
          error: breakerCheck.error,
          isCircuitBreaker: true,
        };
      }

      // Validación previa
      if (!id || id <= 0 || !Number.isInteger(Number(id))) {
        return {
          success: false,
          videoUrl: null,
          exists: false,
          error: "ID de prototipo inválido",
          isClientError: true,
        };
      }

      // ⚡ RATE LIMITING CRÍTICO
      const now = Date.now();
      const lastRequest = lastRequestTimes.get(id);
      if (lastRequest && now - lastRequest < REQUEST_COOLDOWN) {
        console.warn(`🚫 Rate limited for video ${id} - Too frequent requests`);
        // Retornar cache si existe, o error si no
        const cacheKey = `video_url_${id}`;
        const cachedUrl = videoUrlCache.get(cacheKey);
        if (cachedUrl) {
          return cachedUrl.data;
        }
        return {
          success: false,
          videoUrl: null,
          exists: false,
          error: "Rate limited - Please wait",
          isRateLimited: true,
        };
      }

      // Verificar cache primero
      const cacheKey = `video_url_${id}`;
      const cachedUrl = videoUrlCache.get(cacheKey);

      if (cachedUrl && Date.now() - cachedUrl.timestamp < CACHE_EXPIRY) {
        return cachedUrl.data;
      }

      // Verificar si ya hay una petición en progreso para este video
      const pendingKey = `pending_${id}`;
      if (pendingRequests.has(pendingKey)) {
        console.log(`⏳ Waiting for pending HEAD request for video ${id}`);
        return await pendingRequests.get(pendingKey);
      }

      // Construir URL usando el servicio
      const urlResult = videoService.getPublicPropertyVideoUrl(id);

      if (!urlResult.success) {
        return urlResult;
      }

      // ⚡ ACTUALIZAR TIMESTAMP ANTES de hacer request
      lastRequestTimes.set(id, now);

      // Crear promesa para la petición HEAD y guardarla en pendingRequests
      const headRequestPromise = (async () => {
        try {
          // ⚡ TIMEOUT AGRESIVO de 3 segundos
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 3000);

          console.log(`📡 HEAD request to: ${urlResult.videoUrl}`);

          const response = await fetch(urlResult.videoUrl, {
            method: "HEAD",
            headers: {
              Accept: "video/*",
            },
            signal: controller.signal,
          });

          clearTimeout(timeoutId);

          let result;

          if (response.ok) {
            // ⚡ SUCCESS - Reset circuit breaker
            updateCircuitBreaker(id, true);

            // Verificar si es video principal como fallback
            const videoSource = response.headers.get("X-Video-Source");
            const isMainFallback = videoSource === "main-fallback";

            console.log(
              `✅ Video available - Status: ${response.status}, Source: ${
                videoSource || "specific"
              }`
            );

            result = {
              success: true,
              videoUrl: urlResult.videoUrl,
              exists: true,
              isMainFallback,
              status: response.status,
              message: isMainFallback
                ? "Video principal (fallback)"
                : "Video específico del prototipo",
              headers: {
                contentType: response.headers.get("Content-Type"),
                acceptRanges: response.headers.get("Accept-Ranges"),
                videoSource,
              },
            };
          } else if (response.status === 429) {
            // ⚡ FAILURE - Update circuit breaker
            updateCircuitBreaker(id, false);

            console.error(
              `🚨 Rate limit (429) for video ${id} - Server overloaded`
            );
            result = {
              success: false,
              videoUrl: null,
              exists: false,
              status: 429,
              error:
                "Límite de solicitudes alcanzado. Esperando circuit breaker.",
              isRateLimited: true,
            };
          } else {
            console.warn(`⚠️ Video unavailable - Status: ${response.status}`);
            result = {
              success: false,
              videoUrl: null,
              exists: false,
              status: response.status,
              error: "Video no disponible",
            };
          }

          // Guardar en cache con timestamp
          videoUrlCache.set(cacheKey, {
            data: result,
            timestamp: Date.now(),
          });

          return result;
        } catch (error) {
          // ⚡ ERROR - Update circuit breaker
          updateCircuitBreaker(id, false);

          if (error.name === "AbortError") {
            console.error(`⏰ Request timeout for video ${id}`);
            const fallbackResult = {
              success: false,
              videoUrl: null,
              exists: false,
              error: "Timeout - Video verification failed",
              isTimeout: true,
            };

            videoUrlCache.set(cacheKey, {
              data: fallbackResult,
              timestamp: Date.now() - CACHE_EXPIRY / 2, // Expira más rápido
            });

            return fallbackResult;
          }

          console.error(
            `❌ Network error verifying video ${id}:`,
            error.message
          );

          // En caso de error de red, NO devolver la URL para evitar más requests
          const errorResult = {
            success: false,
            videoUrl: null,
            exists: false,
            error: `Error de conexión: ${error.message}`,
            isNetworkError: true,
          };

          // Cache el error por menos tiempo
          videoUrlCache.set(cacheKey, {
            data: errorResult,
            timestamp: Date.now() - CACHE_EXPIRY / 2, // Expira más rápido
          });

          return errorResult;
        } finally {
          // Limpiar la petición pendiente
          pendingRequests.delete(pendingKey);
        }
      })();

      // Guardar la promesa en pendingRequests
      pendingRequests.set(pendingKey, headRequestPromise);

      try {
        return await headRequestPromise;
      } catch (error) {
        // Limpiar la petición pendiente en caso de error
        pendingRequests.delete(pendingKey);
        throw error;
      }
    },
    [checkCircuitBreaker, updateCircuitBreaker]
  ); // ⚡ CIRCUIT BREAKER dependencies

  useEffect(() => {
    // ⚡ EVITAR PROCESAMIENTO DUPLICADO
    if (lastProcessedId.current === prototypeId) {
      return;
    }

    // ⚡ CLEAR PREVIOUS TIMEOUT
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Si no hay prototypeId, limpiar estados inmediatamente
    if (!prototypeId) {
      setVideoData(null);
      setLoading(false);
      setError(null);
      lastProcessedId.current = null;
      return;
    }

    // ⚡ HOT RELOAD SUPPRESSION CHECK
    if (hotReloadDetection.isInSuppression) {
      console.log(
        `🔥 Skipping video ${prototypeId} due to hot reload suppression`
      );
      setError("Hot reload in progress");
      setLoading(false);
      return;
    }

    // ⚡ DEBOUNCE MÁS AGRESIVO: 2000ms para hot reload
    timeoutRef.current = setTimeout(async () => {
      if (!isMountedRef.current) return;
      if (lastProcessedId.current === prototypeId) return; // Doble check

      // ⚡ FINAL HOT RELOAD CHECK
      if (hotReloadDetection.isInSuppression) {
        console.log(
          `🔥 Hot reload detected during timeout - Aborting video ${prototypeId}`
        );
        return;
      }

      lastProcessedId.current = prototypeId;

      setLoading(true);
      setError(null);

      try {
        const result = await buildVideoUrl(prototypeId);

        if (isMountedRef.current && lastProcessedId.current === prototypeId) {
          setVideoData(result);
          setLoading(false);

          if (!result.success) {
            setError(result.error);
          }
        }
      } catch (error) {
        if (isMountedRef.current && lastProcessedId.current === prototypeId) {
          setError(error.message);
          setLoading(false);
        }
      }
    }, 2000); // ⚡ AUMENTADO A 2 SEGUNDOS para hot reload

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [prototypeId, buildVideoUrl]); // ⚡ buildVideoUrl dependency

  return {
    videoData,
    loading,
    error,
    videoUrl: videoData?.videoUrl || null,
    videoExists: videoData?.exists || false,
    isMainFallback: videoData?.isMainFallback || false,
    videoHeaders: videoData?.headers || null,
  };
};

// ⚡ FUNCIONES DE LIMPIEZA MEJORADAS
export const clearVideoCache = (prototypeId) => {
  if (prototypeId) {
    videoUrlCache.delete(`video_url_${prototypeId}`);
    pendingRequests.delete(`pending_${prototypeId}`);
    lastRequestTimes.delete(prototypeId);
    circuitBreaker.delete(prototypeId);
  } else {
    videoUrlCache.clear();
    pendingRequests.clear();
    lastRequestTimes.clear();
    circuitBreaker.clear();
  }
};

// ⚡ FUNCIÓN DE EMERGENCIA - Para detener TODAS las requests
export const emergencyStopAllRequests = () => {
  console.warn("🚨 EMERGENCY STOP - Clearing all video requests");

  // Limpiar todas las caches
  videoUrlCache.clear();
  pendingRequests.clear();
  lastRequestTimes.clear();
  circuitBreaker.clear();

  // ⚡ FORCE HOT RELOAD SUPPRESSION
  hotReloadDetection.isInSuppression = true;
  setTimeout(() => {
    hotReloadDetection.isInSuppression = false;
  }, 10000); // 10 segundos de suppression

  // Abortar todas las requests fetch pendientes si es posible
  if (typeof window !== "undefined" && window.AbortController) {
    // Este es un método drástico, pero efectivo para desarrollo
    console.warn("⚠️ All pending video requests have been cleared");
  }
};

// ⚡ DISABLE HOT RELOAD SUPPRESSION
export const disableHotReloadSuppression = () => {
  hotReloadDetection.isInSuppression = false;
  console.warn("🔓 Hot reload suppression MANUALLY DISABLED");
};

// ⚡ RESET CIRCUIT BREAKER
export const resetCircuitBreaker = (prototypeId) => {
  if (prototypeId) {
    circuitBreaker.delete(prototypeId);
    console.log(`🔧 Circuit breaker reset for video ${prototypeId}`);
  } else {
    circuitBreaker.clear();
    console.log("🔧 All circuit breakers reset");
  }
};

// Utilidad para monitoreo CRÍTICO
export const getVideoCacheStats = () => {
  return {
    cacheSize: videoUrlCache.size,
    pendingRequests: pendingRequests.size,
    rateLimitedVideos: lastRequestTimes.size,
    circuitBreakers: circuitBreaker.size,
    hotReloadSuppression: hotReloadDetection.isInSuppression,
    cacheEntries: Array.from(videoUrlCache.keys()),
    pendingKeys: Array.from(pendingRequests.keys()),
    circuitBreakerStates: Array.from(circuitBreaker.entries()),
    requestCooldowns: Array.from(lastRequestTimes.entries()).map(
      ([id, time]) => ({
        id,
        timeAgo: Date.now() - time,
        canRequest: Date.now() - time > REQUEST_COOLDOWN,
      })
    ),
  };
};
