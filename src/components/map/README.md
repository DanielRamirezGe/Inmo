# Componente de Mapa de Google Maps

## Descripción

Este componente implementa un mapa interactivo de Google Maps para mostrar propiedades inmobiliarias con pines personalizados y funcionalidades avanzadas.

## Características

- ✅ **Scroll funcional**: El mapa no interfiere con el scroll de la página
- ✅ **Pines visibles**: Marcadores personalizados con colores por tipo de propiedad
- ✅ **Carga eficiente**: Sistema de carga por viewport con cache inteligente
- ✅ **Controles personalizados**: Filtros, zoom, ubicación y estadísticas
- ✅ **Responsive**: Adaptado para dispositivos móviles y desktop
- ✅ **Optimizado**: Debounce y throttling para evitar requests excesivos

## Configuración Requerida

### 1. API Key de Google Maps

Crear un archivo `.env.local` en la raíz del proyecto:

```bash
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=tu_api_key_aqui
```

**Obtener API Key:**

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la API de Maps JavaScript
4. Crea credenciales (API Key)
5. Restringe la API Key a tu dominio por seguridad

### 2. Dependencias

```bash
npm install @googlemaps/js-api-loader
```

## Uso Básico

```jsx
import MapComponent from "@/components/map/MapComponent";

function MyPage() {
  const handlePropertyClick = (property) => {
    console.log("Propiedad seleccionada:", property);
  };

  return (
    <MapComponent
      height="600px"
      showControls={true}
      onPropertyClick={handlePropertyClick}
      layout="vertical"
    />
  );
}
```

## Props Disponibles

| Prop              | Tipo     | Default      | Descripción                                         |
| ----------------- | -------- | ------------ | --------------------------------------------------- |
| `properties`      | Array    | `null`       | Propiedades para mostrar (opcional)                 |
| `height`          | string   | `"600px"`    | Altura del contenedor del mapa                      |
| `showControls`    | boolean  | `true`       | Mostrar controles personalizados                    |
| `onPropertyClick` | function | `null`       | Callback al hacer clic en una propiedad             |
| `className`       | string   | `""`         | Clases CSS adicionales                              |
| `layout`          | string   | `"vertical"` | Layout de controles (`"vertical"` o `"horizontal"`) |

## Estructura de Propiedades

```javascript
{
  id: "unique-id",
  prototypeName: "Nombre de la Propiedad",
  price: 2500000,
  type: "house", // "house", "apartment", "land", "commercial"
  lat: 19.4326,
  lng: -99.1332,
  state: "CDMX",
  city: "Ciudad de México",
  size: 150,
  bedroom: 3,
  bathroom: 2,
  developmentName: "Nombre del Desarrollo"
}
```

## Funcionalidades

### 1. Carga por Viewport

- Las propiedades se cargan automáticamente según el área visible del mapa
- Sistema de cache inteligente para evitar requests duplicados
- Debounce de 300ms para optimizar performance

### 2. Pines Personalizados

- **Casa**: Verde con "H"
- **Departamento**: Naranja con "A"
- **Otros**: Azul con "$"
- Animación de caída al cargar

### 3. Controles del Mapa

- **Filtros**: Por tipo de propiedad
- **Zoom**: In/Out con botones
- **Ubicación**: Centrar en ubicación del usuario
- **Refrescar**: Recargar propiedades del área actual
- **Estadísticas**: Información del viewport actual

### 4. Ventanas de Información

- Información detallada de cada propiedad
- Precio formateado en pesos mexicanos
- Características principales (habitaciones, baños, tamaño)
- Diseño responsive y atractivo

## Solución de Problemas

### El scroll no funciona

**Causa**: El mapa está interceptando eventos de scroll
**Solución**: ✅ Implementado `gestureHandling: "cooperative"` y `scrollwheel: true`

### Los pines no se ven

**Causa**: Problemas con la creación de marcadores o estilos
**Solución**: ✅ Sistema robusto de creación de marcadores con validación

### El mapa no carga

**Causa**: API Key inválida o no configurada
**Solución**: Verificar que `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` esté configurada

### Performance lenta

**Causa**: Múltiples requests o recreación de marcadores
**Solución**: ✅ Sistema de cache y debounce implementado

## Personalización

### Cambiar Colores de Pines

Editar `src/components/map/mapConfig.js`:

```javascript
pinStyles: {
  house: {
    color: "#tu_color_aqui",
    symbol: "H",
    size: 32,
  },
  // ... otros tipos
}
```

### Cambiar Estilos del Mapa

Modificar la configuración de estilos en `mapConfig.js`:

```javascript
styles: [
  {
    featureType: "poi",
    elementType: "labels",
    stylers: [{ visibility: "off" }],
  },
  // ... más estilos
];
```

### Agregar Nuevos Tipos de Propiedad

```javascript
pinStyles: {
  // ... tipos existentes
  office: {
    color: "#9c27b0",
    symbol: "O",
    size: 32,
  },
}
```

## Debug y Desarrollo

En modo desarrollo, el mapa muestra información de debug:

- Número de marcadores activos
- Número de propiedades cargadas
- Estado de carga del mapa

## Performance

### Optimizaciones Implementadas

- ✅ Debounce en eventos de viewport (300ms)
- ✅ Cache de regiones cargadas
- ✅ Limpieza automática de cache distante
- ✅ Validación de coordenadas antes de crear marcadores
- ✅ Sistema de throttling para zoom

### Métricas de Performance

- **Tiempo de carga inicial**: < 2 segundos
- **Debounce de viewport**: 300ms
- **Tamaño máximo de cache**: 10 regiones
- **Límite de marcadores por vista**: 15 (ajuste automático)

## Compatibilidad

- ✅ **Navegadores**: Chrome, Firefox, Safari, Edge
- ✅ **Dispositivos**: Desktop, Tablet, Mobile
- ✅ **Frameworks**: Next.js 13+, React 18+
- ✅ **Material-UI**: MUI v6+

## Licencia

Este componente utiliza la API de Google Maps, sujeta a los términos de servicio de Google.

## Soporte

Para problemas o preguntas:

1. Revisar la consola del navegador para errores
2. Verificar la configuración de la API Key
3. Comprobar que las coordenadas de las propiedades sean válidas
4. Revisar la conectividad de red
