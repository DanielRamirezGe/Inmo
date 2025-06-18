/**
 * Video Optimization Utilities - EMERGENCY OPTIMIZED
 * ⚡ DISEÑADO PARA DETENER REQUESTS INFINITAS
 *
 * CAMBIOS CRÍTICOS:
 * - Rate limiting ultra estricto (2+ segundos)
 * - Seeking threshold reducido drásticamente
 * - Emergency stops para desarrollo
 * - Solo logs críticos para errores severos
 */

// ⚡ ESTADÍSTICAS CRÍTICAS SIMPLIFICADAS
let globalSeekingStats = {
  totalSeeks: 0,
  seekingByVideo: new Map(),
  lastResetTime: Date.now(),
  rateLimitHits: 0,
  emergencyStops: 0,
};

// ⚡ CONSTANTES ULTRA RESTRICTIVAS
const EMERGENCY_SEEK_LIMIT = 5; // 5 seeks máximo en 30 segundos
const CRITICAL_SEEK_LIMIT = 3; // 3 seeks máximo en 10 segundos
const MIN_SEEK_INTERVAL = 2000; // 2 segundos mínimo entre seeks
const EMERGENCY_TIMEOUT = 30000; // 30 segundos para reset automático

/**
 * ⚡ EMERGENCY FUNCTION - Detener TODO el seeking inmediatamente
 */
export const emergencyStopAllSeeking = () => {
  console.error("🚨 EMERGENCY STOP - ALL SEEKING DISABLED");

  globalSeekingStats.emergencyStops++;
  globalSeekingStats.seekingByVideo.clear();

  // Deshabilitar seeking en todos los videos de la página
  const allVideos = document.querySelectorAll("video");
  allVideos.forEach((video, index) => {
    // Remover event listeners problemáticos
    const newVideo = video.cloneNode(true);
    video.parentNode.replaceChild(newVideo, video);
    console.warn(`🚫 Video ${index + 1} seeking DISABLED`);
  });

  return true;
};

/**
 * ⚡ ULTRA RESTRICTIVE SEEKING TRACKER
 */
export const trackSeeking = (videoUrl, currentTime, duration) => {
  const now = Date.now();
  globalSeekingStats.totalSeeks++;

  if (!globalSeekingStats.seekingByVideo.has(videoUrl)) {
    globalSeekingStats.seekingByVideo.set(videoUrl, {
      seekCount: 0,
      positions: [],
      lastSeekTime: 0,
      emergencyTriggered: false,
    });
  }

  const videoStats = globalSeekingStats.seekingByVideo.get(videoUrl);
  videoStats.seekCount++;
  videoStats.lastSeekTime = now;

  // ⚡ AGREGAR POSICIÓN CON TIMESTAMP
  videoStats.positions.push({
    time: currentTime,
    percentage: (currentTime / duration) * 100,
    timestamp: now,
  });

  // ⚡ LIMPIAR POSICIONES VIEJAS (solo últimos 30 segundos)
  videoStats.positions = videoStats.positions.filter(
    (p) => now - p.timestamp < EMERGENCY_TIMEOUT
  );

  // ⚡ DETECCIÓN CRÍTICA: 3 seeks en 10 segundos
  const recentSeeks = videoStats.positions.filter(
    (p) => now - p.timestamp < 10000
  );

  if (recentSeeks.length >= CRITICAL_SEEK_LIMIT) {
    console.error(`💀 CRITICAL SEEKING DETECTED - ${videoUrl}`);

    if (!videoStats.emergencyTriggered) {
      videoStats.emergencyTriggered = true;

      // ⚡ EMERGENCY STOP para este video específico
      setTimeout(() => {
        const videos = document.querySelectorAll(
          `video[src*="${videoUrl.split("/").pop()}"]`
        );
        videos.forEach((video) => {
          video.pause();
          video.removeAttribute("src");
          console.error(`🚫 EMERGENCY: Video source removed for ${videoUrl}`);
        });
      }, 100);
    }

    return {
      isErratic: true,
      shouldThrottle: true,
      recentSeeks: recentSeeks.length,
      emergency: true,
    };
  }

  // ⚡ DETECCIÓN MODERATE: 5 seeks en 30 segundos
  const thirtySecSeeks = videoStats.positions.filter(
    (p) => now - p.timestamp < EMERGENCY_TIMEOUT
  );

  if (thirtySecSeeks.length >= EMERGENCY_SEEK_LIMIT) {
    console.error(
      `🚨 MODERATE SEEKING DETECTED - ${videoUrl}: ${thirtySecSeeks.length} seeks`
    );

    return {
      isErratic: true,
      shouldThrottle: true,
      recentSeeks: thirtySecSeeks.length,
      warning: true,
    };
  }

  return {
    isErratic: false,
    shouldThrottle: recentSeeks.length > 2,
    recentSeeks: recentSeeks.length,
  };
};

/**
 * ⚡ ULTRA RESTRICTIVE SEEKING VALIDATION
 */
export const shouldAllowSeeking = (videoUrl, lastSeekTime) => {
  const now = Date.now();
  const timeSinceLastSeek = now - lastSeekTime;

  // ⚡ RATE LIMITING ULTRA ESTRICTO: 2 segundos mínimo
  if (timeSinceLastSeek < MIN_SEEK_INTERVAL) {
    globalSeekingStats.rateLimitHits++;
    return {
      allowed: false,
      reason: "rate_limit_2s",
      waitTime: MIN_SEEK_INTERVAL - timeSinceLastSeek,
    };
  }

  // ⚡ VERIFICAR SI EL VIDEO ESTÁ EN EMERGENCY MODE
  const videoStats = globalSeekingStats.seekingByVideo.get(videoUrl);
  if (videoStats?.emergencyTriggered) {
    return {
      allowed: false,
      reason: "emergency_mode",
      emergency: true,
    };
  }

  // ⚡ VERIFICAR SEEKING RECIENTE
  if (videoStats) {
    const recentSeeks = videoStats.positions.filter(
      (p) => now - p.timestamp < 10000
    );

    if (recentSeeks.length >= CRITICAL_SEEK_LIMIT) {
      return {
        allowed: false,
        reason: "too_many_recent_seeks",
        recentSeeks: recentSeeks.length,
      };
    }
  }

  return {
    allowed: true,
    reason: "normal",
  };
};

/**
 * ⚡ ESTADÍSTICAS CRÍTICAS SIMPLIFICADAS
 */
export const getSeekingStats = () => {
  const now = Date.now();

  const stats = {
    totalSeeks: globalSeekingStats.totalSeeks,
    rateLimitHits: globalSeekingStats.rateLimitHits,
    emergencyStops: globalSeekingStats.emergencyStops,
    activeVideos: globalSeekingStats.seekingByVideo.size,
    uptime: now - globalSeekingStats.lastResetTime,
    videoStats: {},
    emergencyVideos: 0,
  };

  // ⚡ SOLO VIDEOS CON PROBLEMAS
  globalSeekingStats.seekingByVideo.forEach((data, url) => {
    if (data.seekCount > 3 || data.emergencyTriggered) {
      stats.videoStats[url] = {
        seekCount: data.seekCount,
        emergencyTriggered: data.emergencyTriggered,
        recentSeeks: data.positions.filter((p) => now - p.timestamp < 10000)
          .length,
        lastSeekTime: data.lastSeekTime,
      };

      if (data.emergencyTriggered) {
        stats.emergencyVideos++;
      }
    }
  });

  return stats;
};

/**
 * ⚡ RESET COMPLETO DE EMERGENCIA
 */
export const resetSeekingStats = () => {
  console.warn("🔄 EMERGENCY RESET - All seeking stats cleared");

  globalSeekingStats = {
    totalSeeks: 0,
    seekingByVideo: new Map(),
    lastResetTime: Date.now(),
    rateLimitHits: 0,
    emergencyStops: 0,
  };

  // ⚡ RESET DE TODOS LOS VIDEOS EN LA PÁGINA
  const allVideos = document.querySelectorAll("video");
  allVideos.forEach((video, index) => {
    video.currentTime = 0;
    console.log(`🔄 Video ${index + 1} reset to start`);
  });
};

/**
 * ⚡ CONFIGURACIÓN ULTRA OPTIMIZADA
 */
export const getOptimizedVideoConfig = () => {
  return {
    preload: "metadata", // ⚡ NUNCA 'auto'
    crossOrigin: "anonymous",
    playsInline: true,
    controls: false, // ⚡ USAR CONTROLES CUSTOM PARA MAYOR CONTROL
    autoplay: false, // ⚡ EVITAR AUTOPLAY PROBLEMAS
    seeking: false, // ⚡ DESHABILITAR SEEKING PROGRAMÁTICO

    // ⚡ CONFIGURACIONES CRÍTICAS
    loop: false,
    muted: true, // ⚡ SIEMPRE MUTEAR INICIALMENTE
  };
};

/**
 * ⚡ DIAGNÓSTICO CRÍTICO SOLAMENTE
 */
export const diagnoseBehavior = (videoUrl) => {
  const videoStats = globalSeekingStats.seekingByVideo.get(videoUrl);
  if (!videoStats) return { healthy: true, noData: true };

  const now = Date.now();
  const recentSeeks = videoStats.positions.filter(
    (p) => now - p.timestamp < 60000
  );

  // ⚡ SOLO DETECTAR PROBLEMAS CRÍTICOS
  const issues = [];
  let severity = "low";

  if (videoStats.emergencyTriggered) {
    issues.push("emergency_triggered");
    severity = "critical";
  }

  if (recentSeeks.length >= EMERGENCY_SEEK_LIMIT) {
    issues.push("excessive_seeking");
    severity = "critical";
  }

  if (recentSeeks.length >= CRITICAL_SEEK_LIMIT) {
    issues.push("rapid_seeking");
    severity = severity === "critical" ? "critical" : "high";
  }

  return {
    healthy: issues.length === 0,
    issues,
    severity,
    stats: {
      recentSeeks: recentSeeks.length,
      totalSeeks: videoStats.seekCount,
      emergencyTriggered: videoStats.emergencyTriggered,
    },
  };
};

/**
 * ⚡ FUNCIONES DE DESARROLLO PARA DEBUGGING
 */
if (process.env.NODE_ENV === "development") {
  // ⚡ Exponer funciones globalmente para debugging urgente
  window.emergencyStopSeeking = emergencyStopAllSeeking;
  window.resetVideoStats = resetSeekingStats;
  window.getVideoStats = getSeekingStats;
  window.diagnoseAllVideos = () => {
    const stats = getSeekingStats();
    console.table(stats.videoStats);
    return stats;
  };

  console.log("🚨 Video Emergency Functions Available:");
  console.log("- window.emergencyStopSeeking() - Stop all seeking immediately");
  console.log("- window.resetVideoStats() - Reset all video statistics");
  console.log("- window.getVideoStats() - Get current seeking statistics");
  console.log("- window.diagnoseAllVideos() - Diagnose all videos");
}
