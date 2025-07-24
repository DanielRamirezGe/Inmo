# 🚀 **Prompt para Implementar Solución de Cache en Backend/API**

## **Contexto del Problema:**
Estamos experimentando un bug crítico donde las propiedades se muestran de forma inconsistente después de operaciones de creación/edición. El problema parece ser de cache, donde las peticiones HTTP devuelven datos obsoletos o mezclados entre diferentes estados de la base de datos.

## **Objetivo:**
Implementar una solución completa de cache-busting y headers anti-cache en el backend para asegurar que todas las peticiones de propiedades devuelvan datos frescos y consistentes.

---

## **📋 Instrucciones de Implementación:**

### **1. Middleware Global de Cache-Control**

Crear un middleware que aplique headers anti-cache a todas las rutas de propiedades:

```javascript
// Middleware para rutas de propiedades
const propertyCacheMiddleware = (req, res, next) => {
  // Aplicar a todas las rutas que contengan 'prototype'
  if (req.path.includes('/prototype') || req.path.includes('/api/v1/prototype')) {
    res.set({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Last-Modified': new Date().toUTCString(),
      'ETag': `"${Date.now()}"`
    });
  }
  next();
};

// Aplicar el middleware
app.use(propertyCacheMiddleware);
```

### **2. Middleware de Cache-Busting**

Crear un middleware que maneje automáticamente el parámetro `_t` del frontend:

```javascript
// Middleware para cache-busting
const cacheBustingMiddleware = (req, res, next) => {
  // Remover parámetro _t para no afectar la lógica de negocio
  if (req.query._t) {
    delete req.query._t;
  }
  
  // Agregar headers anti-cache adicionales
  res.set({
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  });
  
  next();
};

// Aplicar específicamente a rutas de propiedades
app.use('/api/v1/prototype', cacheBustingMiddleware);
```

### **3. Headers Específicos por Endpoint**

Para cada endpoint de propiedades, agregar headers específicos:

**Endpoints a modificar:**
- `GET /api/v1/prototype` (propiedades no publicadas)
- `GET /api/v1/prototype/published` (propiedades publicadas)
- `GET /api/v1/prototype/minkaasa-not-published` (Minkaasa no publicadas)
- `GET /api/v1/prototype/minkaasa-published` (Minkaasa publicadas)

```javascript
// Ejemplo para endpoint de propiedades Minkaasa
app.get('/api/v1/prototype/minkaasa-not-published', async (req, res) => {
  try {
    // Tu lógica actual de consulta a la base de datos...
    
    // Agregar headers anti-cache específicos
    res.set({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Last-Modified': new Date().toUTCString(),
      'ETag': `"${Date.now()}"`
    });
    
    res.json({
      data: properties,
      page: page,
      pageSize: pageSize,
      total: total
    });
  } catch (error) {
    console.error('Error fetching Minkaasa unpublished properties:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
```

### **4. Logging para Debugging**

Agregar logs detallados para rastrear las peticiones:

```javascript
// Middleware de logging para propiedades
const propertyLoggingMiddleware = (req, res, next) => {
  if (req.path.includes('/prototype')) {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`, {
      query: req.query,
      userAgent: req.get('User-Agent'),
      timestamp: Date.now(),
      cacheBusting: req.query._t ? 'Yes' : 'No'
    });
  }
  next();
};

app.use(propertyLoggingMiddleware);
```

### **5. Validación de Timestamps (Opcional)**

Implementar validación de timestamps para peticiones muy antiguas:

```javascript
const validateRequestTimestamp = (req, res, next) => {
  const { _t } = req.query;
  
  if (_t) {
    const requestTime = parseInt(_t);
    const currentTime = Date.now();
    const timeDiff = currentTime - requestTime;
    
    // Rechazar peticiones más antiguas de 5 minutos
    if (timeDiff > 5 * 60 * 1000) {
      return res.status(400).json({
        error: 'Request too old, please refresh the page',
        timestamp: currentTime,
        requestTime: requestTime,
        timeDiff: timeDiff
      });
    }
  }
  
  next();
};

// Aplicar a rutas de propiedades
app.use('/api/v1/prototype', validateRequestTimestamp);
```

### **6. Configuración de Base de Datos**

Asegurar que no haya cache en consultas de base de datos:

```javascript
// Si usas Sequelize
const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect,
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  // Desactivar cache de consultas
  define: {
    timestamps: true
  }
});

// Si usas TypeORM
const dataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "user",
  password: "password",
  database: "database",
  synchronize: false,
  logging: false,
  cache: false // Desactivar cache
});

// Si usas MongoDB
const mongoose = require('mongoose');
mongoose.set('debug', false); // Desactivar logs de debug
```

### **7. Headers de CORS**

Configurar CORS para permitir headers de cache:

```javascript
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'Cache-Control', 
    'Pragma', 
    'Expires',
    'Last-Modified',
    'ETag'
  ],
  exposedHeaders: [
    'Cache-Control', 
    'Pragma', 
    'Expires',
    'Last-Modified',
    'ETag'
  ]
}));
```

### **8. Configuración de Proxy Reverso (si aplica)**

Si usas Nginx o Apache, agregar configuración:

```nginx
# Nginx configuration
location /api/v1/prototype {
    add_header Cache-Control "no-cache, no-store, must-revalidate";
    add_header Pragma "no-cache";
    add_header Expires "0";
    add_header Last-Modified $date_gmt;
    add_header ETag "\"$time\"";
    
    proxy_pass http://your_backend;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

---

## **🧪 Testing y Verificación:**

### **Comandos para verificar la implementación:**

```bash
# Verificar headers en las respuestas
curl -I "http://your-api.com/api/v1/prototype/minkaasa-not-published?_t=1234567890"

# Verificar que no hay cache
curl -v "http://your-api.com/api/v1/prototype/minkaasa-not-published?_t=1234567890"
```

### **Headers esperados en las respuestas:**

```
Cache-Control: no-cache, no-store, must-revalidate
Pragma: no-cache
Expires: 0
Last-Modified: [timestamp]
ETag: "[timestamp]"
```

---

## **📝 Checklist de Implementación:**

- [ ] Middleware global de cache-control implementado
- [ ] Middleware de cache-busting implementado
- [ ] Headers específicos agregados a todos los endpoints de propiedades
- [ ] Logging implementado para debugging
- [ ] Validación de timestamps implementada (opcional)
- [ ] Configuración de base de datos sin cache
- [ ] Headers de CORS configurados
- [ ] Configuración de proxy reverso actualizada (si aplica)
- [ ] Testing realizado con curl/Postman
- [ ] Verificación de headers en DevTools del navegador

---

## **🎯 Resultado Esperado:**

Después de implementar estos cambios, todas las peticiones de propiedades deberían:
- Devolver datos frescos de la base de datos
- No ser cacheadas por navegadores o proxies
- Mostrar logs detallados para debugging
- Mantener consistencia entre operaciones de creación/edición

**Nota:** Esta implementación complementa las mejoras ya realizadas en el frontend y debería resolver completamente el problema de cache inconsistente.

---

## **🔗 Referencias del Frontend:**

Este prompt complementa las siguientes mejoras implementadas en el frontend:

1. **Cache-busting en API calls** (`src/services/api.js`)
2. **Headers anti-cache en axios** (`src/utils/axiosMiddleware.js`)
3. **Force refresh en useEntityData** (`src/hooks/useEntityData.js`)
4. **Mejoras en manejo de estado** (`src/app/admin/properties/page.js`)

---

## **📞 Soporte:**

Si tienes dudas sobre la implementación o necesitas ayuda adicional, revisa:
- Los logs del servidor para debugging
- Los headers de respuesta en DevTools
- La documentación de tu framework específico 