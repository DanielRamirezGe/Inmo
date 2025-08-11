// 🔄 MIGRATED: Este hook ahora redirige al sistema global
// Para mantener compatibilidad con componentes existentes

import { useEntityData as useGlobalEntityData } from "./useGlobalEntityState";

export const useEntityData = (entityType) => {
  // Redirigir al sistema global para mantener compatibilidad
  return useGlobalEntityData(entityType);
};
