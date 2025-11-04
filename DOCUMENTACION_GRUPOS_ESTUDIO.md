# 👥 Sistema de Grupos de Estudio - Guía para el Frontend

## 🏗️ Estructura General

El módulo de **Grupos de Estudio** permite crear y gestionar comunidades de aprendizaje colaborativo donde los estudiantes pueden organizarse, compartir conocimientos y trabajar en equipo.

### Conceptos clave:
1. **Grupo de Estudio** - Comunidad de usuarios con intereses comunes
2. **Miembros** - Usuarios que pertenecen al grupo
3. **Roles** - Niveles de permisos dentro del grupo (Administrador, Moderador, Miembro)

---

## 1️⃣ GRUPOS DE ESTUDIO

### Modelo de datos

```typescript
{
  id_grupo: number,            // ID único (generado automáticamente)
  nombre: string,              // Nombre del grupo (obligatorio)
  descripcion: string,         // Descripción opcional
  fecha_creacion: string,      // Fecha de creación (automática)
  
  // Información adicional (incluida en respuestas GET):
  miembros: [
    {
      id_usuario: number,
      nombre: string,
      apellido: string,
      foto_perfil: string,
      rol_grupo: string,       // 'administrador', 'moderador', 'miembro'
      fecha_union: string
    }
  ],
  total_miembros: number       // Cantidad total de miembros
}
```

### Roles en el grupo

| Rol | Permisos |
|-----|----------|
| **👑 Administrador** | Puede editar/eliminar el grupo, agregar/remover miembros, cambiar roles |
| **🛡️ Moderador** | Permisos intermedios (personalizable según implementación) |
| **👤 Miembro** | Puede ver contenido y participar, puede salirse del grupo |

---

## 📋 Endpoints disponibles

### ✅ Crear grupo de estudio (requiere autenticación)

El usuario que crea el grupo se convierte automáticamente en **administrador**.

```http
POST /api/grupos
Headers: 
  Authorization: Bearer <token>
  Content-Type: application/json

Body:
{
  "nombre": "Grupo de Programación Web",
  "descripcion": "Estudiamos HTML, CSS, JS y frameworks modernos"  // opcional
}
```

**Respuesta exitosa (201):**
```json
{
  "id_grupo": 1,
  "nombre": "Grupo de Programación Web",
  "descripcion": "Estudiamos HTML, CSS, JS y frameworks modernos",
  "fecha_creacion": "2025-11-03T10:00:00Z",
  "miembros": [
    {
      "id_usuario": 1,
      "nombre": "Juan",
      "apellido": "Pérez",
      "foto_perfil": "https://...",
      "rol_grupo": "administrador",
      "fecha_union": "2025-11-03T10:00:00Z"
    }
  ],
  "total_miembros": 1
}
```

---

### ✅ Listar todos los grupos

```http
GET /api/grupos
```

**Respuesta exitosa (200):**
```json
[
  {
    "id_grupo": 1,
    "nombre": "Grupo de Programación Web",
    "descripcion": "Estudiamos desarrollo web moderno",
    "fecha_creacion": "2025-11-03T10:00:00Z",
    "miembros": [ ... ],
    "total_miembros": 5
  },
  {
    "id_grupo": 2,
    "nombre": "Cálculo Diferencial",
    "descripcion": "Grupo de estudio de matemáticas",
    "fecha_creacion": "2025-11-02T14:30:00Z",
    "miembros": [ ... ],
    "total_miembros": 8
  }
]
```

---

### ✅ Obtener grupo específico

```http
GET /api/grupos/:id
```

**Ejemplo:**
```http
GET /api/grupos/1
```

**Respuesta exitosa (200):**
```json
{
  "id_grupo": 1,
  "nombre": "Grupo de Programación Web",
  "descripcion": "Estudiamos desarrollo web moderno",
  "fecha_creacion": "2025-11-03T10:00:00Z",
  "miembros": [
    {
      "id_usuario": 1,
      "nombre": "Juan",
      "apellido": "Pérez",
      "foto_perfil": "https://...",
      "rol_grupo": "administrador",
      "fecha_union": "2025-11-03T10:00:00Z"
    },
    {
      "id_usuario": 2,
      "nombre": "María",
      "apellido": "González",
      "foto_perfil": "https://...",
      "rol_grupo": "miembro",
      "fecha_union": "2025-11-04T09:15:00Z"
    }
  ],
  "total_miembros": 2
}
```

---

### ✅ Obtener mis grupos (requiere autenticación)

```http
GET /api/grupos/mis-grupos
Headers: 
  Authorization: Bearer <token>
```

Devuelve todos los grupos donde el usuario autenticado es miembro.

---

### ✅ Obtener grupos de un usuario

```http
GET /api/grupos/usuario/:userId
```

**Ejemplo:**
```http
GET /api/grupos/usuario/5
```

---

### ✅ Actualizar grupo (solo administradores)

```http
PUT /api/grupos/:id
Headers: 
  Authorization: Bearer <token>
  Content-Type: application/json

Body:
{
  "nombre": "Nuevo nombre del grupo",     // opcional
  "descripcion": "Nueva descripción"      // opcional
}
```

**Respuesta exitosa (200):**
```json
{
  "id_grupo": 1,
  "nombre": "Nuevo nombre del grupo",
  "descripcion": "Nueva descripción",
  "fecha_creacion": "2025-11-03T10:00:00Z",
  "miembros": [ ... ],
  "total_miembros": 5
}
```

---

### ✅ Eliminar grupo (solo administradores)

```http
DELETE /api/grupos/:id
Headers: 
  Authorization: Bearer <token>
```

**Respuesta exitosa (200):**
```json
{
  "message": "Grupo eliminado correctamente"
}
```

---

## 2️⃣ GESTIÓN DE MIEMBROS

### ✅ Obtener miembros de un grupo

```http
GET /api/grupos/:id/miembros
```

**Ejemplo:**
```http
GET /api/grupos/1/miembros
```

**Respuesta exitosa (200):**
```json
[
  {
    "id_usuario": 1,
    "nombre": "Juan",
    "apellido": "Pérez",
    "foto_perfil": "https://...",
    "rol_grupo": "administrador",
    "fecha_union": "2025-11-03T10:00:00Z"
  },
  {
    "id_usuario": 2,
    "nombre": "María",
    "apellido": "González",
    "foto_perfil": "https://...",
    "rol_grupo": "miembro",
    "fecha_union": "2025-11-04T09:15:00Z"
  }
]
```

---

### ✅ Contar miembros de un grupo

```http
GET /api/grupos/:id/miembros/count
```

**Respuesta exitosa (200):**
```json
{
  "count": 15
}
```

---

### ✅ Agregar miembro al grupo (solo administradores)

```http
POST /api/grupos/:id/miembros
Headers: 
  Authorization: Bearer <token>
  Content-Type: application/json

Body:
{
  "id_usuario": 5,
  "rol_grupo": "miembro"      // opcional: 'administrador', 'moderador', 'miembro' (default: 'miembro')
}
```

**Respuesta exitosa (201):**
```json
{
  "id_grupo": 1,
  "nombre": "Grupo de Programación Web",
  "miembros": [ ... ],
  "total_miembros": 6
}
```

**Errores posibles:**
- `409`: El usuario ya es miembro del grupo
- `403`: Solo administradores pueden agregar miembros
- `404`: Grupo no encontrado

---

### ✅ Remover miembro del grupo

Solo puede hacerlo:
- El administrador del grupo
- El propio usuario (salirse del grupo)
- Un admin global (id_rol = 1)

```http
DELETE /api/grupos/:id/miembros/:userId
Headers: 
  Authorization: Bearer <token>
```

**Ejemplo:**
```http
DELETE /api/grupos/1/miembros/5
```

**Respuesta exitosa (200):**
```json
{
  "message": "Miembro removido correctamente"
}
```

---

### ✅ Cambiar rol de un miembro (solo administradores)

```http
PUT /api/grupos/:id/miembros/:userId/rol
Headers: 
  Authorization: Bearer <token>
  Content-Type: application/json

Body:
{
  "rol_grupo": "moderador"    // 'administrador', 'moderador', 'miembro'
}
```

**Respuesta exitosa (200):**
```json
{
  "id_grupo": 1,
  "nombre": "Grupo de Programación Web",
  "miembros": [
    {
      "id_usuario": 5,
      "nombre": "Carlos",
      "apellido": "Ramírez",
      "foto_perfil": "https://...",
      "rol_grupo": "moderador",    // ← rol actualizado
      "fecha_union": "2025-11-05T11:20:00Z"
    }
  ],
  "total_miembros": 6
}
```

---

## 🎨 Flujo de uso típico para el Frontend

### 1. Listar todos los grupos disponibles

```javascript
// Obtener todos los grupos
fetch('http://localhost:5000/api/grupos')
  .then(res => res.json())
  .then(grupos => {
    grupos.forEach(grupo => {
      console.log(
        `${grupo.nombre} - ${grupo.total_miembros} miembros`
      );
    });
  });
```

---

### 2. Ver detalle de un grupo

```javascript
const grupoId = 1;

// Obtener información completa del grupo
fetch(`http://localhost:5000/api/grupos/${grupoId}`)
  .then(res => res.json())
  .then(grupo => {
    console.log('Grupo:', grupo.nombre);
    console.log('Descripción:', grupo.descripcion);
    console.log('Miembros:', grupo.miembros);
    console.log('Total miembros:', grupo.total_miembros);
  });

// Obtener solo la lista de miembros
fetch(`http://localhost:5000/api/grupos/${grupoId}/miembros`)
  .then(res => res.json())
  .then(miembros => {
    miembros.forEach(m => {
      console.log(`${m.nombre} ${m.apellido} - ${m.rol_grupo}`);
    });
  });

// Obtener contador de miembros (para mostrar en la UI)
fetch(`http://localhost:5000/api/grupos/${grupoId}/miembros/count`)
  .then(res => res.json())
  .then(data => {
    console.log(`${data.count} miembros en el grupo`);
  });
```

---

### 3. Crear un nuevo grupo

```javascript
const token = localStorage.getItem('token');

fetch('http://localhost:5000/api/grupos', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    nombre: 'Grupo de Machine Learning',
    descripcion: 'Estudiamos IA y aprendizaje automático'
  })
})
  .then(res => res.json())
  .then(grupo => {
    console.log('Grupo creado:', grupo);
    // El usuario creador es automáticamente administrador
  });
```

---

### 4. Ver mis grupos

```javascript
const token = localStorage.getItem('token');

fetch('http://localhost:5000/api/grupos/mis-grupos', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
  .then(res => res.json())
  .then(grupos => {
    console.log('Mis grupos:', grupos);
    grupos.forEach(grupo => {
      // Verificar mi rol en cada grupo
      const miRol = grupo.miembros.find(
        m => m.id_usuario === miUsuarioId
      )?.rol_grupo;
      console.log(`${grupo.nombre} - Mi rol: ${miRol}`);
    });
  });
```

---

### 5. Agregar miembro a un grupo (como administrador)

```javascript
const token = localStorage.getItem('token');
const grupoId = 1;
const nuevoMiembroId = 5;

fetch(`http://localhost:5000/api/grupos/${grupoId}/miembros`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    id_usuario: nuevoMiembroId,
    rol_grupo: 'miembro'  // o 'moderador', 'administrador'
  })
})
  .then(res => res.json())
  .then(grupo => {
    console.log('Miembro agregado. Total miembros:', grupo.total_miembros);
  })
  .catch(err => {
    if (err.status === 409) {
      console.log('El usuario ya es miembro del grupo');
    }
  });
```

---

### 6. Salirse de un grupo

```javascript
const token = localStorage.getItem('token');
const grupoId = 1;
const miUsuarioId = 5;

fetch(`http://localhost:5000/api/grupos/${grupoId}/miembros/${miUsuarioId}`, {
  method: 'DELETE',
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
  .then(res => res.json())
  .then(data => {
    console.log(data.message); // "Miembro removido correctamente"
  });
```

---

### 7. Cambiar rol de un miembro (como administrador)

```javascript
const token = localStorage.getItem('token');
const grupoId = 1;
const usuarioId = 5;

fetch(`http://localhost:5000/api/grupos/${grupoId}/miembros/${usuarioId}/rol`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    rol_grupo: 'moderador'  // promocionar a moderador
  })
})
  .then(res => res.json())
  .then(grupo => {
    console.log('Rol actualizado:', grupo);
  });
```

---

### 8. Editar información del grupo (como administrador)

```javascript
const token = localStorage.getItem('token');
const grupoId = 1;

fetch(`http://localhost:5000/api/grupos/${grupoId}`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    nombre: 'Nuevo nombre',
    descripcion: 'Nueva descripción actualizada'
  })
})
  .then(res => res.json())
  .then(grupo => {
    console.log('Grupo actualizado:', grupo);
  });
```

---

### 9. Eliminar un grupo (como administrador)

```javascript
const token = localStorage.getItem('token');
const grupoId = 1;

fetch(`http://localhost:5000/api/grupos/${grupoId}`, {
  method: 'DELETE',
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
  .then(res => res.json())
  .then(data => {
    console.log(data.message); // "Grupo eliminado correctamente"
  });
```

---

## 🔐 Autenticación y Permisos

### Endpoints públicos (sin token)

- ✅ Listar grupos: `GET /api/grupos`
- ✅ Ver grupo específico: `GET /api/grupos/:id`
- ✅ Ver miembros: `GET /api/grupos/:id/miembros`
- ✅ Contar miembros: `GET /api/grupos/:id/miembros/count`
- ✅ Ver grupos de un usuario: `GET /api/grupos/usuario/:userId`

### Endpoints que requieren autenticación

- 🔒 Crear grupo: `POST /api/grupos`
- 🔒 Ver mis grupos: `GET /api/grupos/mis-grupos`
- 🔒 Actualizar grupo: `PUT /api/grupos/:id` (solo administradores)
- 🔒 Eliminar grupo: `DELETE /api/grupos/:id` (solo administradores)
- 🔒 Agregar miembro: `POST /api/grupos/:id/miembros` (solo administradores)
- 🔒 Remover miembro: `DELETE /api/grupos/:id/miembros/:userId` (admin o el mismo usuario)
- 🔒 Cambiar rol: `PUT /api/grupos/:id/miembros/:userId/rol` (solo administradores)

### Matriz de permisos por rol

| Acción | Miembro | Moderador | Administrador | Admin Global |
|--------|---------|-----------|---------------|--------------|
| Ver grupo | ✅ | ✅ | ✅ | ✅ |
| Unirse/salirse | ✅ | ✅ | ✅ | ✅ |
| Agregar miembros | ❌ | ❌ | ✅ | ✅ |
| Remover miembros | Solo a sí mismo | Solo a sí mismo | ✅ | ✅ |
| Cambiar roles | ❌ | ❌ | ✅ | ✅ |
| Editar grupo | ❌ | ❌ | ✅ | ✅ |
| Eliminar grupo | ❌ | ❌ | ✅ | ✅ |

---

## 📊 Tabla resumen de endpoints

| Acción | Endpoint | Método | Auth | Permisos requeridos |
|--------|----------|--------|------|---------------------|
| Listar grupos | `/api/grupos` | GET | ❌ | Público |
| Ver grupo | `/api/grupos/:id` | GET | ❌ | Público |
| Crear grupo | `/api/grupos` | POST | ✅ | Usuario autenticado |
| Editar grupo | `/api/grupos/:id` | PUT | ✅ | Administrador del grupo |
| Eliminar grupo | `/api/grupos/:id` | DELETE | ✅ | Administrador del grupo |
| Mis grupos | `/api/grupos/mis-grupos` | GET | ✅ | Usuario autenticado |
| Grupos de usuario | `/api/grupos/usuario/:userId` | GET | ❌ | Público |
| Ver miembros | `/api/grupos/:id/miembros` | GET | ❌ | Público |
| Contar miembros | `/api/grupos/:id/miembros/count` | GET | ❌ | Público |
| Agregar miembro | `/api/grupos/:id/miembros` | POST | ✅ | Administrador del grupo |
| Remover miembro | `/api/grupos/:id/miembros/:userId` | DELETE | ✅ | Admin o el mismo usuario |
| Cambiar rol | `/api/grupos/:id/miembros/:userId/rol` | PUT | ✅ | Administrador del grupo |

---

## ⚠️ Manejo de errores

### Códigos de estado HTTP

- **200:** Operación exitosa
- **201:** Grupo/miembro creado exitosamente
- **400:** Datos inválidos o faltantes
- **401:** No autenticado (token faltante o inválido)
- **403:** Sin permisos (no es administrador del grupo)
- **404:** Grupo o usuario no encontrado
- **409:** Conflicto (ej: usuario ya es miembro)
- **500:** Error del servidor

### Ejemplos de respuestas de error

```json
{
  "message": "El nombre es obligatorio"
}
```

```json
{
  "message": "Solo los administradores del grupo pueden actualizarlo"
}
```

```json
{
  "message": "El usuario ya es miembro del grupo"
}
```

```json
{
  "message": "Grupo no encontrado"
}
```

---

## 💡 Casos de uso típicos

### Caso 1: Crear y gestionar un grupo de estudio

```javascript
// 1. Crear grupo
const nuevoGrupo = await crearGrupo({
  nombre: "Algoritmos y Estructuras de Datos",
  descripcion: "Preparación para exámenes"
});

// 2. Agregar compañeros
await agregarMiembro(nuevoGrupo.id_grupo, usuarioId1, 'miembro');
await agregarMiembro(nuevoGrupo.id_grupo, usuarioId2, 'miembro');

// 3. Promocionar a un moderador
await cambiarRol(nuevoGrupo.id_grupo, usuarioId1, 'moderador');
```

### Caso 2: Usuario se une y sale de grupos

```javascript
// Ver grupos disponibles
const grupos = await obtenerTodosLosGrupos();

// Administrador agrega al usuario
await agregarMiembro(grupoId, miUsuarioId, 'miembro');

// Usuario decide salirse
await salirDelGrupo(grupoId, miUsuarioId);
```

### Caso 3: Profesor gestiona grupos de proyecto

```javascript
// Profesor crea grupos para proyectos
const grupo1 = await crearGrupo({ nombre: "Proyecto Final - Grupo 1" });
const grupo2 = await crearGrupo({ nombre: "Proyecto Final - Grupo 2" });

// Asigna estudiantes a cada grupo
await agregarMiembro(grupo1.id_grupo, estudiante1, 'miembro');
await agregarMiembro(grupo1.id_grupo, estudiante2, 'miembro');
await agregarMiembro(grupo2.id_grupo, estudiante3, 'miembro');
```

---

## 🎯 Consejos para el Frontend

1. **Guarda el token JWT** después del login para operaciones autenticadas
2. **Verifica el rol del usuario** en cada grupo para mostrar/ocultar acciones:
   ```javascript
   const esAdmin = miembro.rol_grupo === 'administrador';
   if (esAdmin) {
     // Mostrar botones de editar, eliminar, gestionar miembros
   }
   ```
3. **Muestra confirmaciones** antes de acciones destructivas (eliminar grupo, remover miembro)
4. **Actualiza la UI en tiempo real** después de agregar/remover miembros
5. **Implementa búsqueda/filtros** para grupos (por nombre, descripción, etc.)
6. **Muestra insignias de rol** junto al nombre de cada miembro
7. **Permite ordenar** grupos por fecha, nombre o número de miembros

---

## 🚀 Posibles extensiones futuras

1. **Sistema de invitaciones**: Usuarios solicitan unirse y admin aprueba
2. **Grupos privados**: Grupos ocultos que requieren código o invitación
3. **Chat de grupo**: Mensajería interna del grupo
4. **Recursos compartidos**: Subir archivos y enlaces
5. **Calendario de eventos**: Reuniones y actividades del grupo
6. **Foro de discusión**: Hilos de conversación dentro del grupo
7. **Notificaciones**: Alertas de nuevos miembros, mensajes, etc.
8. **Badges/Logros**: Gamificación de la participación

---

## 🚀 URL Base

Desarrollo: `http://localhost:5000`

Todas las rutas de la API comienzan con `/api/`

---

## 📞 Contacto

Si tienes dudas sobre algún endpoint o necesitas funcionalidad adicional, contacta al equipo de backend.
