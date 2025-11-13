# 📝 Sistema de Blog (Publicaciones) - Guía para el Frontend

## 🏗️ Estructura General

El sistema de blog está compuesto por 3 entidades principales:
1. **Publicación** (blog post/artículo)
2. **Etiquetas** (tags)
3. **Comentarios**

---

## 1️⃣ PUBLICACIONES

### Modelo de datos

```typescript
{
  id_publicacion: number,      // ID único (generado automáticamente)
  titulo: string,              // Título del post (obligatorio)
  contenido: string,           // Contenido del post (obligatorio)
  fecha_creacion: string,      // Fecha de creación (automática)
  id_usuario: number,          // ID del autor (automático del token)
  id_categoria: number,        // ID de categoría (obligatorio)
  tipo: string,                // Tipo: 'articulo', 'pregunta', 'recurso', etc.
  
  // Relaciones (incluidas en respuestas GET):
  usuario: {
    id_usuario: number,
    nombre: string,
    apellido: string,
    foto_perfil: string
  },
  categoria: {
    id_categoria: number,
    nombre: string
  },
  etiquetas: [
    {
      id_etiqueta: number,
      nombre: string
    }
  ]
}
```

### Endpoints disponibles

#### ✅ Crear publicación (requiere autenticación)

```http
POST /api/publicaciones
Headers: 
  Authorization: Bearer <token>
  Content-Type: application/json

Body:
{
  "titulo": "Introducción a TypeScript",
  "contenido": "TypeScript es un superset...",
  "id_categoria": 1,
  "tipo": "articulo",              // opcional
  "etiquetas": [1, 2, 3]          // opcional: array de IDs
}
```

**Respuesta exitosa (201):**
```json
{
  "id_publicacion": 1,
  "titulo": "Introducción a TypeScript",
  "contenido": "TypeScript es un superset...",
  "fecha_creacion": "2025-11-03T10:30:00Z",
  "id_usuario": 1,
  "id_categoria": 1,
  "tipo": "articulo",
  "usuario": {
    "id_usuario": 1,
    "nombre": "Juan",
    "apellido": "Pérez",
    "foto_perfil": "https://..."
  },
  "categoria": {
    "id_categoria": 1,
    "nombre": "Tecnología"
  },
  "etiquetas": [
    { "id_etiqueta": 1, "nombre": "TypeScript" },
    { "id_etiqueta": 2, "nombre": "JavaScript" }
  ]
}
```

---

#### ✅ Listar todas las publicaciones

```http
GET /api/publicaciones
```

**Respuesta exitosa (200):**
```json
[
  {
    "id_publicacion": 1,
    "titulo": "Introducción a TypeScript",
    "contenido": "...",
    "fecha_creacion": "2025-11-03T10:30:00Z",
    "usuario": { ... },
    "categoria": { ... },
    "etiquetas": [ ... ]
  },
  ...
]
```

---

#### ✅ Obtener publicación específica

```http
GET /api/publicaciones/:id
```

**Ejemplo:**
```http
GET /api/publicaciones/1
```

---

#### ✅ Obtener publicaciones por usuario

```http
GET /api/publicaciones/usuario/:userId
```

**Ejemplo:**
```http
GET /api/publicaciones/usuario/5
```

---

#### ✅ Obtener publicaciones por categoría

```http
GET /api/publicaciones/categoria/:categoryId
```

**Ejemplo:**
```http
GET /api/publicaciones/categoria/2
```

---

#### ✅ Obtener mis publicaciones (requiere autenticación)

```http
GET /api/publicaciones/mis-publicaciones
Headers: 
  Authorization: Bearer <token>
```

---

#### ✅ Actualizar publicación (solo autor o admin)

```http
PUT /api/publicaciones/:id
Headers: 
  Authorization: Bearer <token>
  Content-Type: application/json

Body:
{
  "titulo": "Nuevo título",           // opcional
  "contenido": "Nuevo contenido",     // opcional
  "id_categoria": 2,                  // opcional
  "tipo": "recurso",                  // opcional
  "etiquetas": [2, 4]                // opcional
}
```

---

#### ✅ Eliminar publicación (solo autor o admin)

```http
DELETE /api/publicaciones/:id
Headers: 
  Authorization: Bearer <token>
```

**Respuesta exitosa (200):**
```json
{
  "message": "Publicación eliminada correctamente"
}
```

---

## 2️⃣ ETIQUETAS

### ¿Cómo funcionan?

- Las etiquetas son palabras clave que se asocian a publicaciones
- Una publicación puede tener múltiples etiquetas
- Una etiqueta puede estar en múltiples publicaciones (relación muchos a muchos)
- Las etiquetas deben existir previamente en la base de datos

### Al crear/actualizar publicación

Envía un array de IDs de etiquetas existentes:

```json
{
  "titulo": "Mi artículo",
  "contenido": "...",
  "id_categoria": 1,
  "etiquetas": [1, 2, 3]
}
```

### En la respuesta

```json
{
  "id_publicacion": 1,
  "titulo": "Mi artículo",
  "etiquetas": [
    { "id_etiqueta": 1, "nombre": "TypeScript" },
    { "id_etiqueta": 2, "nombre": "JavaScript" },
    { "id_etiqueta": 3, "nombre": "Tutorial" }
  ]
}
```

---

## 3️⃣ COMENTARIOS

### Modelo de datos

```typescript
{
  id_comentario: number,       // ID único (generado automáticamente)
  contenido: string,           // Contenido del comentario (obligatorio)
  fecha: string,               // Fecha de creación (automática)
  id_usuario: number,          // ID del autor (automático del token)
  id_publicacion: number,      // ID de la publicación (obligatorio)
  
  // Relación (incluida en respuestas GET):
  usuario: {
    id_usuario: number,
    nombre: string,
    apellido: string,
    foto_perfil: string
  }
}
```

### Endpoints disponibles

#### ✅ Crear comentario (requiere autenticación)

```http
POST /api/comentarios
Headers: 
  Authorization: Bearer <token>
  Content-Type: application/json

Body:
{
  "contenido": "Excelente artículo!",
  "id_publicacion": 5
}
```

**Respuesta exitosa (201):**
```json
{
  "id_comentario": 1,
  "contenido": "Excelente artículo!",
  "fecha": "2025-11-03T11:00:00Z",
  "id_usuario": 2,
  "id_publicacion": 5,
  "usuario": {
    "id_usuario": 2,
    "nombre": "María",
    "apellido": "González",
    "foto_perfil": "https://..."
  }
}
```

---

#### ✅ Obtener comentarios de una publicación

```http
GET /api/comentarios/publicacion/:publicacionId
```

**Ejemplo:**
```http
GET /api/comentarios/publicacion/5
```

**Uso típico:** Mostrar todos los comentarios de un post.

---

#### ✅ Contar comentarios de una publicación

```http
GET /api/comentarios/publicacion/:publicacionId/count
```

**Respuesta exitosa (200):**
```json
{
  "count": 42
}
```

---

#### ✅ Obtener comentarios por usuario

```http
GET /api/comentarios/usuario/:userId
```

---

#### ✅ Obtener mis comentarios (requiere autenticación)

```http
GET /api/comentarios/mis-comentarios
Headers: 
  Authorization: Bearer <token>
```

---

#### ✅ Actualizar comentario (solo autor o admin)

```http
PUT /api/comentarios/:id
Headers: 
  Authorization: Bearer <token>
  Content-Type: application/json

Body:
{
  "contenido": "Comentario actualizado"
}
```

---

#### ✅ Eliminar comentario (solo autor o admin)

```http
DELETE /api/comentarios/:id
Headers: 
  Authorization: Bearer <token>
```

**Respuesta exitosa (200):**
```json
{
  "message": "Comentario eliminado correctamente"
}
```

---

## 🎨 Flujo de uso típico para el Frontend

### 1. Mostrar lista de publicaciones

```javascript
// Obtener todas las publicaciones
fetch('http://localhost:5000/api/publicaciones')
  .then(res => res.json())
  .then(publicaciones => {
    // Muestra: título, extracto, autor, fecha, categoría, etiquetas
    publicaciones.forEach(pub => {
      console.log(pub.titulo, pub.usuario.nombre, pub.etiquetas);
    });
  });
```

---

### 2. Ver detalle de una publicación

```javascript
const publicacionId = 5;

// Obtener publicación completa
fetch(`http://localhost:5000/api/publicaciones/${publicacionId}`)
  .then(res => res.json())
  .then(publicacion => {
    // Muestra: contenido completo, autor, fecha, categoría, etiquetas
    console.log(publicacion);
  });

// Obtener comentarios de la publicación
fetch(`http://localhost:5000/api/comentarios/publicacion/${publicacionId}`)
  .then(res => res.json())
  .then(comentarios => {
    // Muestra todos los comentarios
    comentarios.forEach(com => {
      console.log(com.usuario.nombre, com.contenido);
    });
  });

// Obtener contador de comentarios (para mostrar en la UI)
fetch(`http://localhost:5000/api/comentarios/publicacion/${publicacionId}/count`)
  .then(res => res.json())
  .then(data => {
    console.log(`${data.count} comentarios`);
  });
```

---

### 3. Crear nueva publicación

```javascript
const token = localStorage.getItem('token');

fetch('http://localhost:5000/api/publicaciones', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    titulo: 'Mi nuevo post',
    contenido: 'Este es el contenido...',
    id_categoria: 1,
    tipo: 'articulo',
    etiquetas: [1, 2, 3]
  })
})
  .then(res => res.json())
  .then(publicacion => {
    console.log('Publicación creada:', publicacion);
  });
```

---

### 4. Comentar en una publicación

```javascript
const token = localStorage.getItem('token');
const publicacionId = 5;

fetch('http://localhost:5000/api/comentarios', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    contenido: '¡Gran artículo!',
    id_publicacion: publicacionId
  })
})
  .then(res => res.json())
  .then(comentario => {
    console.log('Comentario creado:', comentario);
  });
```

---

### 5. Filtrar publicaciones

```javascript
// Por categoría
fetch('http://localhost:5000/api/publicaciones/categoria/1')
  .then(res => res.json())
  .then(publicaciones => console.log(publicaciones));

// Por usuario
fetch('http://localhost:5000/api/publicaciones/usuario/3')
  .then(res => res.json())
  .then(publicaciones => console.log(publicaciones));

// Mis publicaciones (requiere autenticación)
const token = localStorage.getItem('token');
fetch('http://localhost:5000/api/publicaciones/mis-publicaciones', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
  .then(res => res.json())
  .then(publicaciones => console.log(publicaciones));
```

---

### 6. Editar publicación

```javascript
const token = localStorage.getItem('token');
const publicacionId = 5;

fetch(`http://localhost:5000/api/publicaciones/${publicacionId}`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    titulo: 'Título actualizado',
    contenido: 'Contenido actualizado',
    etiquetas: [2, 4, 5]
  })
})
  .then(res => res.json())
  .then(publicacion => {
    console.log('Publicación actualizada:', publicacion);
  });
```

---

### 7. Eliminar publicación

```javascript
const token = localStorage.getItem('token');
const publicacionId = 5;

fetch(`http://localhost:5000/api/publicaciones/${publicacionId}`, {
  method: 'DELETE',
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
  .then(res => res.json())
  .then(data => {
    console.log(data.message); // "Publicación eliminada correctamente"
  });
```

---

## 🔐 Autenticación y Permisos

### Endpoints públicos (sin token)

- ✅ Listar publicaciones: `GET /api/publicaciones`
- ✅ Ver publicación específica: `GET /api/publicaciones/:id`
- ✅ Ver comentarios: `GET /api/comentarios/publicacion/:id`
- ✅ Filtrar por categoría: `GET /api/publicaciones/categoria/:id`
- ✅ Filtrar por usuario: `GET /api/publicaciones/usuario/:id`

### Endpoints que requieren autenticación

- 🔒 Crear publicación: `POST /api/publicaciones`
- 🔒 Actualizar publicación: `PUT /api/publicaciones/:id` (solo autor o admin)
- 🔒 Eliminar publicación: `DELETE /api/publicaciones/:id` (solo autor o admin)
- 🔒 Crear comentario: `POST /api/comentarios`
- 🔒 Actualizar comentario: `PUT /api/comentarios/:id` (solo autor o admin)
- 🔒 Eliminar comentario: `DELETE /api/comentarios/:id` (solo autor o admin)
- 🔒 Ver mis publicaciones: `GET /api/publicaciones/mis-publicaciones`
- 🔒 Ver mis comentarios: `GET /api/comentarios/mis-comentarios`

### Roles

- **Usuario normal:** Puede crear, editar y eliminar solo sus propias publicaciones y comentarios
- **Admin (id_rol = 1):** Puede editar y eliminar cualquier publicación o comentario

---

## 📋 Tabla resumen de endpoints

| Acción | Endpoint | Método | Auth | Datos requeridos |
|--------|----------|--------|------|------------------|
| Listar posts | `/api/publicaciones` | GET | ❌ | - |
| Ver post | `/api/publicaciones/:id` | GET | ❌ | - |
| Crear post | `/api/publicaciones` | POST | ✅ | titulo, contenido, id_categoria |
| Editar post | `/api/publicaciones/:id` | PUT | ✅ | campos a actualizar |
| Eliminar post | `/api/publicaciones/:id` | DELETE | ✅ | - |
| Posts por usuario | `/api/publicaciones/usuario/:userId` | GET | ❌ | - |
| Posts por categoría | `/api/publicaciones/categoria/:categoryId` | GET | ❌ | - |
| Mis posts | `/api/publicaciones/mis-publicaciones` | GET | ✅ | - |
| Ver comentarios | `/api/comentarios/publicacion/:id` | GET | ❌ | - |
| Contar comentarios | `/api/comentarios/publicacion/:id/count` | GET | ❌ | - |
| Crear comentario | `/api/comentarios` | POST | ✅ | contenido, id_publicacion |
| Editar comentario | `/api/comentarios/:id` | PUT | ✅ | contenido |
| Eliminar comentario | `/api/comentarios/:id` | DELETE | ✅ | - |
| Comentarios por usuario | `/api/comentarios/usuario/:userId` | GET | ❌ | - |
| Mis comentarios | `/api/comentarios/mis-comentarios` | GET | ✅ | - |

---

## ⚠️ Manejo de errores

### Códigos de estado HTTP

- **200:** Operación exitosa
- **201:** Recurso creado exitosamente
- **400:** Datos inválidos o faltantes
- **401:** No autenticado (token faltante o inválido)
- **403:** Sin permisos (intentando editar/eliminar contenido de otro usuario)
- **404:** Recurso no encontrado
- **500:** Error del servidor

### Ejemplo de respuesta de error

```json
{
  "message": "Faltan campos obligatorios"
}
```

```json
{
  "message": "No tienes permisos para eliminar esta publicación"
}
```

---

## 💡 Consejos para el Frontend

1. **Guarda el token JWT** en `localStorage` o `sessionStorage` después del login
2. **Incluye el token** en todas las peticiones autenticadas:
   ```javascript
   headers: {
     'Authorization': `Bearer ${token}`
   }
   ```
3. **Valida los campos** antes de enviar (titulo, contenido, id_categoria son obligatorios)
4. **Maneja los errores 401/403** redirigiendo al login o mostrando mensaje de permisos
5. **Muestra feedback visual** al crear/editar/eliminar (loading, success, error)
6. **Actualiza la UI** después de crear comentarios sin recargar toda la página
7. **Implementa paginación** si hay muchas publicaciones (opcional, backend no incluido aún)

---

## 🚀 URL Base

Desarrollo: `http://localhost:5000`

Todas las rutas de la API comienzan con `/api/`

---

## 📞 Contacto

Si tienes dudas sobre algún endpoint o necesitas funcionalidad adicional, contacta al equipo de backend.
