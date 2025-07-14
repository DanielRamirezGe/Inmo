# Bot Performance Analytics Dashboard

Esta página proporciona un análisis completo del performance del chatbot inmobiliario con métricas detalladas y visualizaciones interactivas.

## 🎯 Características

### 1. **Vista General (Overview)**

- Métricas principales del bot (usuarios, conversaciones, tiempo de respuesta)
- Distribución de acciones detectadas
- Satisfacción del usuario
- Acciones con mejor performance
- Métricas de conversión

### 2. **Análisis de Usuarios**

- Demografía de usuarios (edad, tamaño familiar, ocupación)
- Completitud de perfiles
- Engagement y actividad
- Tabla detallada de usuarios con filtros y búsqueda
- Distribución de presupuestos y ciudades

### 3. **Análisis de Conversaciones**

- Calidad de las conversaciones
- Análisis por tipo de acción
- Satisfacción del usuario por conversación
- Tabla de conversaciones con detalles
- Métricas de confianza del bot

### 4. **Análisis de Interacciones**

- Performance técnica (tiempo de respuesta, tokens utilizados)
- Análisis por modelo de LLM
- Tasa de errores y análisis de problemas
- Costos estimados por interacción
- Tendencias de satisfacción

### 5. **Análisis de Conversiones**

- Embudo de conversión completo
- Métricas de citas (creadas, completadas, canceladas)
- Solicitudes de asesor por prioridad
- Propiedades más vistas
- Análisis de dropoff entre etapas

### 6. **Salud del Sistema**

- Estado general del bot en tiempo real
- Métricas de base de datos
- Alertas activas y recomendaciones
- Uptime y performance del sistema
- Actualización automática cada 30 segundos

## 🚀 Uso

### Navegación

- **Tabs**: Navega entre las diferentes secciones de análisis
- **Período**: Selecciona el rango de tiempo para los datos (7d, 30d, 90d, 1y, all)
- **Filtros**: Cada sección tiene filtros específicos para refinar los datos
- **Búsqueda**: Busca usuarios o conversaciones específicas

### Métricas Clave

#### Vista General

- **Total Usuarios**: Número total de usuarios registrados
- **Usuarios Activos**: Usuarios con actividad en los últimos 7 días
- **Conversaciones**: Total de mensajes procesados
- **Tiempo de Respuesta**: Velocidad promedio del bot

#### Usuarios

- **Tasa de Engagement**: Porcentaje de usuarios activos
- **Completitud Promedio**: Promedio de perfiles completados
- **Demografía**: Distribución por edad, familia y ocupación

#### Conversaciones

- **Score de Calidad**: Calidad promedio de las conversaciones
- **Tasa de Confianza**: Qué tan segura está el bot de sus respuestas
- **Satisfacción**: Distribución de feedback del usuario

#### Interacciones

- **Tiempo de Procesamiento**: Velocidad de respuesta del LLM
- **Uso de Tokens**: Eficiencia en el uso de recursos
- **Tasa de Errores**: Errores del sistema

#### Conversiones

- **Tasa de Conversión**: Porcentaje de usuarios que completan el embudo
- **Citas Completadas**: Citas exitosas vs canceladas
- **Propiedades Vistas**: Engagement con el catálogo

#### Salud del Sistema

- **Estado**: Saludable, Advertencia o Crítico
- **Uptime**: Tiempo de funcionamiento continuo
- **Alertas**: Problemas detectados automáticamente

## 📊 Interpretación de Datos

### Colores y Estados

- **Verde**: Métricas buenas, estado saludable
- **Amarillo**: Advertencias, atención requerida
- **Rojo**: Problemas críticos, acción inmediata necesaria

### Tendencias

- **Flecha hacia arriba**: Mejora en la métrica
- **Flecha hacia abajo**: Deterioro en la métrica
- **Línea horizontal**: Sin cambios significativos

### Umbrales de Performance

- **Tiempo de Respuesta**: < 2s (bueno), 2-5s (advertencia), > 5s (crítico)
- **Tasa de Errores**: < 2% (bueno), 2-5% (advertencia), > 5% (crítico)
- **Satisfacción**: > 80% (bueno), 60-80% (advertencia), < 60% (crítico)

## 🔧 Configuración

### Arquitectura

La página sigue la arquitectura establecida del proyecto:

- **API Service**: Métodos centralizados en `src/services/api.js`
- **Custom Hook**: Lógica de estado y llamadas en `src/hooks/botPerformance/useBotPerformance.js`
- **Componentes**: UI modular y reutilizable

### Endpoints Requeridos

La página requiere los siguientes endpoints de la API:

- `GET /api/v1/bot-performance/overview`
- `GET /api/v1/bot-performance/users`
- `GET /api/v1/bot-performance/conversations`
- `GET /api/v1/bot-performance/interactions`
- `GET /api/v1/bot-performance/conversions`
- `GET /api/v1/bot-performance/health`

### Autenticación

Todos los endpoints requieren autenticación de administrador.

### Parámetros

- `period`: Período de tiempo (7d, 30d, 90d, 1y, all)
- `page`: Número de página para paginación
- `pageSize`: Elementos por página
- `sortBy`: Campo de ordenamiento
- `sortOrder`: Orden (asc, desc)

## 📱 Responsive Design

La página está optimizada para:

- **Desktop**: Vista completa con todas las métricas
- **Tablet**: Layout adaptado con tabs scrollables
- **Mobile**: Navegación simplificada y métricas apiladas

## 🎨 Temas y Personalización

La página utiliza el tema de Material-UI configurado en `src/theme.js` con:

- Colores corporativos (amarillo dorado, grises)
- Tipografía Roboto
- Componentes personalizados para métricas
- Iconografía consistente

## 🔄 Actualización de Datos

- **Automática**: El tab de Salud se actualiza cada 30 segundos
- **Manual**: Cambiar el período actualiza todos los datos
- **Caché**: Los datos se mantienen en memoria para mejor performance

## 🐛 Solución de Problemas

### Errores Comunes

1. **"No se pudieron cargar los datos"**: Verificar conectividad con la API
2. **Datos vacíos**: Verificar que el período seleccionado tenga datos
3. **Errores de autenticación**: Verificar permisos de administrador

### Logs

Los errores se muestran en:

- Alertas en la parte superior de la página
- Console del navegador para debugging
- Network tab para verificar llamadas a la API

## 📈 Mejoras Futuras

- Gráficas interactivas con Chart.js o Recharts
- Exportación de datos a Excel/PDF
- Alertas por email para métricas críticas
- Comparación de períodos
- Análisis predictivo de tendencias
- Integración con herramientas de monitoreo externas
