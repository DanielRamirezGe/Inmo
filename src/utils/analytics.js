import apiConfig from "@/config/apiConfig";
import { usePublicAxios } from "./axiosMiddleware";


const LIMIT_COLA = 10;
const STORAGE_ANON_KEY = "analytics_anon_v1";
export const STORAGE_KEY = "analytics_consent";

const cola = [];
let permisos = false;
let timer = null;

// IDs
let anonId = null; // persistente (localStorage)
let sessionId = genId(); // por pestaña (memoria)

// ──────────────────────────────
// Helpers de ID
function genId() {
  return (globalThis.crypto?.randomUUID?.() ?? `id-${Math.random().toString(36).slice(2)}`);
}

function ensureAnonId() {
  if (!permisos) return null; // solo si hay consentimiento
  if (anonId) return anonId;

  try {
    const saved = localStorage.getItem(STORAGE_ANON_KEY);
    if (saved) {
      anonId = saved;
      return anonId;
    }
    const created = genId();
    localStorage.setItem(STORAGE_ANON_KEY, created);
    anonId = created;
    return anonId;
  } catch {
    // Si localStorage no está disponible, crea uno en memoria
    anonId = genId();
    return anonId;
  }
}

function clearIds() {
  anonId = null;
  sessionId = genId(); // reinicia sesión
  try {
    localStorage.removeItem(STORAGE_ANON_KEY);
  } catch {}
}

// ──────────────────────────────
// Cambiar permisos (consentimiento)
export function setPermisos(granted) {
  permisos = !!granted;
  console.log("Analytics permisos set to:", permisos);
  if (!permisos) {
    // Retiro de consentimiento: limpia todo
    cola.length = 0;
    clearTimer();
    clearIds();
  } else {
    // Consentimiento dado: asegura anonId
    ensureAnonId();
  }
}

// (Opcional) fuerza nueva sesión (p.ej. tras 30 min de inactividad)
export function newSession() {
  sessionId = genId();
}

// ──────────────────────────────
// type = "click", "scroll", "view", etc.
export async function tracker(type, data) {
  console.log("tracker called with:", type, data, permisos);
  if (!permisos) return;
  if (typeof window === "undefined") return;

  // Asegura anonId al primer evento tras consentimiento
  const aId = ensureAnonId();

  cola.push({
    type,
    date: new Date(),
    path: location.pathname + location.search,
    referrer: document.referrer || null,
    userAgent: navigator.userAgent,
    anonId: aId,
    sessionId,
    data: data || {},
  });

  if (cola.length >= LIMIT_COLA) {
    flush();
  } else {
    scheduler();
  }
}

export const trackerClick = (name, element, data) =>
  tracker("click", { name, element, ...(data || {}) });

/* Utils */
export async function logCola() {
  console.log("Logging analytics cola:", cola);
}

// ──────────────────────────────
// Envío de cola (batch)
async function flush() {
  console.log("Flushing analytics cola, length:", cola.length);
  if (!permisos || cola.length === 0) return;

  // Tomar solo el primer evento de la cola
  const evento = cola[0];

  console.log("Sending analytics event:", evento);
/* 
"body": {
  "anonId": "user_12345",
  "sessionId": "session_67890",
  "path": "/prototype/123",
  "eventType": "page_view",
  "prototypeId": 123
}
*/

  // 1) sendBeacon si está disponible
  if (typeof navigator !== "undefined" && navigator.sendBeacon) {
    // Enviar el evento individual, no como array
    const body = JSON.stringify({
      anonId: evento.anonId,
      sessionId: evento.sessionId,
      path: evento.path,
      eventType: evento.type,
      prototypeId: evento.data.prototypeId
    });
    const blob = new Blob([body], { type: "application/json" });

    const ok = navigator.sendBeacon(apiConfig.baseURL + "/api/v1/public/analytics", blob);
    if (ok) {
      // Remover solo el primer evento
      cola.shift();
      clearTimer();
      if (cola.length > 0) scheduler();
      return;
    }
  }

  // 2) Fallback: axios
  try {
    // Enviar el evento individual, no como array
    const res = await usePublicAxios().post("/api/v1/public/analytics", evento);
    if (res.status === 200) {
      // Remover solo el primer evento
      cola.shift();
    }
  } catch (error) {
    console.log("Error enviando datos de analítica:", error);
  } finally {
    clearTimer();
    if (cola.length > 0) scheduler();
  }
}

// Programar un envío futuro si no hay uno ya programado
const scheduler = () => {
  if (timer) return;
  timer = setTimeout(() => {
    flush().finally(() => {
      timer = null;
      if (cola.length > 0) scheduler();
    });
  }, 5000);
};

function clearTimer() {
  if (!timer) return;
  clearTimeout(timer);
  timer = null;
}

// ──────────────────────────────
// Enviar lo que quede al perder visibilidad o al navegar fuera
if (typeof window !== "undefined") {
  window.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") flush();
  });
  window.addEventListener("pagehide", () => {
    flush();
  });
}
