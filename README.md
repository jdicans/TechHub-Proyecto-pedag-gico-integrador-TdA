# TechHub - API REST

**TechHub** es una plataforma colaborativa académica diseñada para estudiantes, que permite compartir publicaciones, participar en grupos de estudio, inscribirse a eventos, y gestionar notificaciones y reportes de contenido.

---

## 📋 Tabla de Contenidos

- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Arquitectura del Proyecto](#-arquitectura-del-proyecto)
- [Instalación y Configuración](#-instalación-y-configuración)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Módulos Implementados](#-módulos-implementados)
- [Endpoints de la API](#-endpoints-de-la-api)
  - [Rol](#1-rol)
  - [Usuario (Autenticación)](#2-usuario-autenticación)
  - [Categoría](#3-categoría)
  - [Etiqueta](#4-etiqueta)
  - [Publicación](#5-publicación)
  - [Comentario](#6-comentario)
  - [Archivo](#7-archivo)
  - [Grupo de Estudio](#8-grupo-de-estudio)
  - [Evento](#9-evento)
  - [Notificación](#10-notificación)
  - [Reporte](#11-reporte)
- [Autenticación y Autorización](#-autenticación-y-autorización)
- [Documentación Swagger](#-documentación-swagger)

---

## 🚀 Tecnologías Utilizadas

### Backend
- **Node.js** (v18+)
- **TypeScript** (v5.9.3)
- **Express** (v5.x) - Framework web
- **pnpm** - Gestor de paquetes

### Base de Datos
- **Supabase** - Backend as a Service (PostgreSQL)
- **@supabase/supabase-js** - Cliente de Supabase

### Seguridad
- **JWT (jsonwebtoken)** - Autenticación mediante tokens
- **bcryptjs** - Encriptación de contraseñas
- **cors** - Manejo de CORS
- **helmet** - Seguridad HTTP headers

### Documentación
- **Swagger UI Express** - Interfaz de documentación
- **swagger-jsdoc** - Generación de especificación OpenAPI 3.0

### Desarrollo
- **tsx** - Ejecución de TypeScript en desarrollo
- **nodemon** - Auto-reload del servidor
- **dotenv** - Variables de entorno

---

## 🏗️ Arquitectura del Proyecto

El proyecto sigue una **arquitectura en capas**:

```
┌─────────────────┐
│     Routes      │  ← Definición de endpoints y documentación Swagger
├─────────────────┤
│   Controllers   │  ← Lógica de negocio y validaciones
├─────────────────┤
│      DAOs       │  ← Acceso a datos (Supabase queries)
├─────────────────┤
│     Models      │  ← Interfaces TypeScript
├─────────────────┤
│   Middleware    │  ← Autenticación y autorización
└─────────────────┘
```

### Patrones Implementados:
- **Separation of Concerns**: Cada capa tiene responsabilidades específicas
- **Repository Pattern**: DAOs encapsulan el acceso a datos
- **Middleware Pattern**: Autenticación y roles centralizados
- **RBAC (Role-Based Access Control)**: Permisos basados en roles

---

## 📦 Instalación y Configuración

### 1. Clonar el repositorio
```bash
git clone <repository-url>
cd TechHub-Proyecto-pedag-gico-integrador-TdA
```

### 2. Instalar dependencias
```bash
pnpm install
```

### 3. Configurar variables de entorno
Crear archivo `.env` en la raíz del proyecto:

```env
PORT=5000
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_KEY=tu-anon-key
JWT_SECRET=tu-secret-key-seguro
```

### 4. Compilar TypeScript
```bash
pnpm build
```

### 5. Ejecutar en desarrollo
```bash
pnpm dev
```

### 6. Ejecutar en producción
```bash
pnpm start
```

El servidor estará disponible en: `http://localhost:5000`

---

## 📁 Estructura del Proyecto

```
TechHub/
├── src/
│   ├── config/
│   │   └── db.ts                 # Configuración de Supabase
│   ├── models/                   # Interfaces TypeScript
│   │   ├── Rol.ts
│   │   ├── Usuario.ts
│   │   ├── Categoria.ts
│   │   ├── Etiqueta.ts
│   │   ├── Publicacion.ts
│   │   ├── Comentario.ts
│   │   ├── Archivo.ts
│   │   ├── GrupoEstudio.ts
│   │   ├── Evento.ts
│   │   ├── Notificacion.ts
│   │   └── Reporte.ts
│   ├── dao/                      # Data Access Objects
│   │   ├── rol.dao.ts
│   │   ├── usuario.dao.ts
│   │   ├── categoria.dao.ts
│   │   ├── etiqueta.dao.ts
│   │   ├── publicacion.dao.ts
│   │   ├── comentario.dao.ts
│   │   ├── archivo.dao.ts
│   │   ├── grupoEstudio.dao.ts
│   │   ├── evento.dao.ts
│   │   ├── notificacion.dao.ts
│   │   └── reporte.dao.ts
│   ├── controllers/              # Controladores
│   │   ├── rol.controller.ts
│   │   ├── usuario.controller.ts
│   │   ├── categoria.controller.ts
│   │   ├── etiqueta.controller.ts
│   │   ├── publicacion.controller.ts
│   │   ├── comentario.controller.ts
│   │   ├── archivo.controller.ts
│   │   ├── grupoEstudio.controller.ts
│   │   ├── evento.controller.ts
│   │   ├── notificacion.controller.ts
│   │   └── reporte.controller.ts
│   ├── routes/                   # Rutas y Swagger docs
│   │   ├── rol.routes.ts
│   │   ├── usuario.routes.ts
│   │   ├── categoria.routes.ts
│   │   ├── etiqueta.routes.ts
│   │   ├── publicacion.routes.ts
│   │   ├── comentario.routes.ts
│   │   ├── archivo.routes.ts
│   │   ├── grupoEstudio.routes.ts
│   │   ├── evento.routes.ts
│   │   ├── notificacion.routes.ts
│   │   └── reporte.routes.ts
│   ├── middleware/
│   │   └── auth.middleware.ts    # Autenticación JWT y RBAC
│   ├── utils/
│   │   └── auth.utils.ts         # Utilidades JWT y bcrypt
│   ├── docs/
│   │   └── swagger.ts            # Configuración Swagger
│   └── app.ts                    # Aplicación principal
├── dist/                         # Código compilado
├── .env                          # Variables de entorno
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🧩 Módulos Implementados

### 1. **Rol**
Gestión de roles del sistema (Admin, Estudiante, etc.)

### 2. **Usuario (Autenticación)**
- Registro e inicio de sesión
- Autenticación JWT
- Encriptación bcrypt
- Gestión de perfil

### 3. **Categoría**
Categorización de publicaciones y eventos

### 4. **Etiqueta**
Sistema de etiquetado para publicaciones

### 5. **Publicación**
- Publicaciones con categorías y etiquetas (many-to-many)
- Búsqueda por categoría, etiqueta, usuario

### 6. **Comentario**
Comentarios en publicaciones

### 7. **Archivo**
Gestión de archivos adjuntos a publicaciones

### 8. **Grupo de Estudio**
- Grupos colaborativos
- Sistema de roles: Administrador, Moderador, Miembro
- Gestión de miembros

### 9. **Evento**
- Eventos académicos
- Modalidades: Presencial, Virtual, Híbrido
- Sistema de inscripciones

### 10. **Notificación**
- Notificaciones para usuarios
- Estados: Leída/No leída
- Tipos: info, advertencia, error, comentario, evento, grupo

### 11. **Reporte**
- Sistema de moderación
- Reportar usuarios, publicaciones o comentarios
- Estados: pendiente, en_revision, resuelto, rechazado

---

## 🔌 Endpoints de la API

### Leyenda:
- 🌐 **Público** - No requiere autenticación
- 🔒 **Autenticado** - Requiere token JWT
- 👑 **Admin** - Solo administradores (rol 1)

---

### 1. ROL

| Método | Endpoint | Autenticación | Descripción |
|--------|----------|---------------|-------------|
| GET | `/api/roles` | 🔒 Autenticado | Listar todos los roles |
| GET | `/api/roles/:id` | 🔒 Autenticado | Obtener rol por ID |
| POST | `/api/roles` | 👑 Admin | Crear nuevo rol |
| PUT | `/api/roles/:id` | 👑 Admin | Actualizar rol |
| DELETE | `/api/roles/:id` | 👑 Admin | Eliminar rol |

---

### 2. USUARIO (Autenticación)

#### Endpoints Públicos
| Método | Endpoint | Autenticación | Descripción |
|--------|----------|---------------|-------------|
| POST | `/api/usuarios/register` | 🌐 Público | Registrar nuevo usuario |
| POST | `/api/usuarios/login` | 🌐 Público | Iniciar sesión (retorna JWT) |

#### Endpoints Autenticados
| Método | Endpoint | Autenticación | Descripción |
|--------|----------|---------------|-------------|
| GET | `/api/usuarios/profile` | 🔒 Autenticado | Obtener perfil del usuario autenticado |
| PUT | `/api/usuarios/change-password` | 🔒 Autenticado | Cambiar contraseña |
| GET | `/api/usuarios` | 👑 Admin | Listar todos los usuarios |
| GET | `/api/usuarios/:id` | 🔒 Autenticado | Obtener usuario por ID |
| PUT | `/api/usuarios/:id` | 🔒 Autenticado | Actualizar usuario (propio o admin) |
| DELETE | `/api/usuarios/:id` | 🔒 Autenticado | Eliminar usuario (propio o admin) |

**Ejemplo de Login:**
```json
POST /api/usuarios/login
{
  "email": "usuario@example.com",
  "contrasena": "password123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": { ... }
}
```

---

### 3. CATEGORÍA

| Método | Endpoint | Autenticación | Descripción |
|--------|----------|---------------|-------------|
| GET | `/api/categorias` | 🌐 Público | Listar todas las categorías |
| GET | `/api/categorias/:id` | 🌐 Público | Obtener categoría por ID |
| POST | `/api/categorias` | 👑 Admin | Crear categoría |
| PUT | `/api/categorias/:id` | 👑 Admin | Actualizar categoría |
| DELETE | `/api/categorias/:id` | 👑 Admin | Eliminar categoría |

---

### 4. ETIQUETA

| Método | Endpoint | Autenticación | Descripción |
|--------|----------|---------------|-------------|
| GET | `/api/etiquetas` | 🌐 Público | Listar todas las etiquetas |
| GET | `/api/etiquetas/:id` | 🌐 Público | Obtener etiqueta por ID |
| POST | `/api/etiquetas` | 👑 Admin | Crear etiqueta |
| PUT | `/api/etiquetas/:id` | 👑 Admin | Actualizar etiqueta |
| DELETE | `/api/etiquetas/:id` | 👑 Admin | Eliminar etiqueta |

---

### 5. PUBLICACIÓN

| Método | Endpoint | Autenticación | Descripción |
|--------|----------|---------------|-------------|
| GET | `/api/publicaciones` | 🌐 Público | Listar todas las publicaciones |
| GET | `/api/publicaciones/:id` | 🌐 Público | Obtener publicación por ID (con etiquetas) |
| GET | `/api/publicaciones/categoria/:id_categoria` | 🌐 Público | Publicaciones por categoría |
| GET | `/api/publicaciones/etiqueta/:id_etiqueta` | 🌐 Público | Publicaciones por etiqueta |
| GET | `/api/publicaciones/usuario/:id_usuario` | 🌐 Público | Publicaciones de un usuario |
| POST | `/api/publicaciones` | 🔒 Autenticado | Crear publicación |
| PUT | `/api/publicaciones/:id` | 🔒 Autenticado | Actualizar publicación (autor o admin) |
| DELETE | `/api/publicaciones/:id` | 🔒 Autenticado | Eliminar publicación (autor o admin) |

**Ejemplo de Crear Publicación:**
```json
POST /api/publicaciones
Headers: { "Authorization": "Bearer <token>" }
{
  "titulo": "Mi primera publicación",
  "contenido": "Contenido de la publicación",
  "id_categoria": 1,
  "etiquetas": [1, 2, 3]
}
```

---

### 6. COMENTARIO

| Método | Endpoint | Autenticación | Descripción |
|--------|----------|---------------|-------------|
| GET | `/api/comentarios/publicacion/:id_publicacion` | 🌐 Público | Comentarios de una publicación |
| GET | `/api/comentarios/:id` | 🌐 Público | Obtener comentario por ID |
| POST | `/api/comentarios` | 🔒 Autenticado | Crear comentario |
| PUT | `/api/comentarios/:id` | 🔒 Autenticado | Actualizar comentario (autor o admin) |
| DELETE | `/api/comentarios/:id` | 🔒 Autenticado | Eliminar comentario (autor o admin) |

---

### 7. ARCHIVO

| Método | Endpoint | Autenticación | Descripción |
|--------|----------|---------------|-------------|
| GET | `/api/archivos` | 🔒 Autenticado | Listar todos los archivos |
| GET | `/api/archivos/publicacion/:id_publicacion` | 🌐 Público | Archivos de una publicación |
| GET | `/api/archivos/:id` | 🌐 Público | Obtener archivo por ID |
| POST | `/api/archivos` | 🔒 Autenticado | Crear archivo |
| PUT | `/api/archivos/:id` | 🔒 Autenticado | Actualizar archivo |
| DELETE | `/api/archivos/:id` | 🔒 Autenticado | Eliminar archivo (autor o admin) |

---

### 8. GRUPO DE ESTUDIO

| Método | Endpoint | Autenticación | Descripción |
|--------|----------|---------------|-------------|
| GET | `/api/grupos` | 🔒 Autenticado | Listar todos los grupos |
| GET | `/api/grupos/:id` | 🔒 Autenticado | Obtener grupo por ID (con miembros) |
| GET | `/api/grupos/mis-grupos` | 🔒 Autenticado | Grupos del usuario autenticado |
| POST | `/api/grupos` | 🔒 Autenticado | Crear grupo (auto-admin) |
| PUT | `/api/grupos/:id` | 🔒 Autenticado | Actualizar grupo (solo admin del grupo) |
| DELETE | `/api/grupos/:id` | 🔒 Autenticado | Eliminar grupo (solo admin del grupo) |
| POST | `/api/grupos/:id/miembros` | 🔒 Autenticado | Agregar miembro (solo admin) |
| DELETE | `/api/grupos/:id/miembros/:id_usuario` | 🔒 Autenticado | Eliminar miembro (admin o el mismo usuario) |
| PUT | `/api/grupos/:id/miembros/:id_usuario/rol` | 🔒 Autenticado | Cambiar rol de miembro (solo admin) |

**Roles en Grupos:**
- `administrador` - Control total del grupo
- `moderador` - Moderación de contenido
- `miembro` - Participante regular

---

### 9. EVENTO

| Método | Endpoint | Autenticación | Descripción |
|--------|----------|---------------|-------------|
| GET | `/api/eventos` | 🌐 Público | Listar todos los eventos |
| GET | `/api/eventos/proximos` | 🌐 Público | Eventos próximos (fecha >= hoy) |
| GET | `/api/eventos/categoria/:id_categoria` | 🌐 Público | Eventos por categoría |
| GET | `/api/eventos/modalidad/:modalidad` | 🌐 Público | Eventos por modalidad |
| GET | `/api/eventos/mis-eventos` | 🔒 Autenticado | Eventos en los que estoy inscrito |
| GET | `/api/eventos/:id` | 🌐 Público | Obtener evento por ID |
| GET | `/api/eventos/:id/inscritos` | 🔒 Autenticado | Lista de inscritos al evento |
| POST | `/api/eventos` | 👑 Admin | Crear evento |
| POST | `/api/eventos/:id/inscribirse` | 🔒 Autenticado | Inscribirse a un evento |
| DELETE | `/api/eventos/:id/cancelar-inscripcion` | 🔒 Autenticado | Cancelar inscripción |
| PUT | `/api/eventos/:id` | 👑 Admin | Actualizar evento |
| DELETE | `/api/eventos/:id` | 👑 Admin | Eliminar evento |

**Modalidades de Eventos:**
- `presencial`
- `virtual`
- `híbrido`

---

### 10. NOTIFICACIÓN

| Método | Endpoint | Autenticación | Descripción |
|--------|----------|---------------|-------------|
| GET | `/api/notificaciones/mis-notificaciones` | 🔒 Autenticado | Mis notificaciones |
| GET | `/api/notificaciones/no-leidas` | 🔒 Autenticado | Mis notificaciones no leídas |
| PUT | `/api/notificaciones/marcar-todas-leidas` | 🔒 Autenticado | Marcar todas como leídas |
| DELETE | `/api/notificaciones/limpiar-leidas` | 🔒 Autenticado | Eliminar notificaciones leídas |
| GET | `/api/notificaciones/:id` | 🔒 Autenticado | Obtener notificación por ID |
| PUT | `/api/notificaciones/:id/marcar-leida` | 🔒 Autenticado | Marcar como leída |
| DELETE | `/api/notificaciones/:id` | 🔒 Autenticado | Eliminar notificación |
| GET | `/api/notificaciones` | 👑 Admin | Listar todas las notificaciones |
| POST | `/api/notificaciones` | 👑 Admin | Crear notificación |
| PUT | `/api/notificaciones/:id` | 👑 Admin | Actualizar notificación |

**Tipos de Notificación:**
- `info`
- `advertencia`
- `error`
- `comentario`
- `evento`
- `grupo`

---

### 11. REPORTE

| Método | Endpoint | Autenticación | Descripción |
|--------|----------|---------------|-------------|
| POST | `/api/reportes` | 🔒 Autenticado | Crear reporte |
| GET | `/api/reportes/mis-reportes` | 🔒 Autenticado | Mis reportes realizados |
| GET | `/api/reportes/:id` | 🔒 Autenticado | Obtener reporte por ID (propio o admin) |
| GET | `/api/reportes` | 👑 Admin | Listar todos los reportes |
| GET | `/api/reportes/estado/:estado` | 👑 Admin | Reportes por estado |
| GET | `/api/reportes/usuario/:id_usuario` | 👑 Admin | Reportes sobre un usuario |
| GET | `/api/reportes/publicacion/:id_publicacion` | 👑 Admin | Reportes sobre una publicación |
| GET | `/api/reportes/comentario/:id_comentario` | 👑 Admin | Reportes sobre un comentario |
| PUT | `/api/reportes/:id/estado` | 👑 Admin | Cambiar estado del reporte |
| PUT | `/api/reportes/:id` | 👑 Admin | Actualizar reporte |
| DELETE | `/api/reportes/:id` | 👑 Admin | Eliminar reporte |

**Estados de Reporte:**
- `pendiente`
- `en_revision`
- `resuelto`
- `rechazado`

**Ejemplo de Crear Reporte:**
```json
POST /api/reportes
Headers: { "Authorization": "Bearer <token>" }
{
  "motivo": "Contenido inapropiado",
  "descripcion": "Esta publicación contiene lenguaje ofensivo",
  "id_publicacion": 5
}
```

---

## 🔐 Autenticación y Autorización

### Autenticación JWT

1. **Registro/Login**: El usuario se registra o inicia sesión
2. **Token JWT**: El servidor retorna un token JWT válido por 7 días
3. **Header**: Incluir el token en cada petición protegida:
   ```
   Authorization: Bearer <tu-token-jwt>
   ```

### Ejemplo de Uso:

```bash
# 1. Login
curl -X POST http://localhost:5000/api/usuarios/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@techhub.com","contrasena":"admin123"}'

# Response: { "token": "eyJhbGc...", "usuario": {...} }

# 2. Usar el token
curl -X GET http://localhost:5000/api/notificaciones/mis-notificaciones \
  -H "Authorization: Bearer eyJhbGc..."
```

### Sistema de Roles (RBAC)

#### Roles Disponibles:
- **id_rol: 1** - Administrador (acceso total)
- **id_rol: 2** - Estudiante (permisos limitados)
- **id_rol: 3+** - Otros roles personalizados

#### Middleware de Autorización:
- `authMiddleware` - Valida JWT y extrae usuario
- `requireRole(...roles)` - Valida que el usuario tenga un rol permitido

**Ejemplo de implementación:**
```typescript
// Solo admin puede crear categorías
router.post('/', authMiddleware, requireRole(1), crearCategoria);

// Usuario autenticado puede crear publicaciones
router.post('/', authMiddleware, crearPublicacion);
```

### Permisos por Recurso:

| Recurso | Crear | Leer | Actualizar | Eliminar |
|---------|-------|------|------------|----------|
| Rol | Admin | Autenticado | Admin | Admin |
| Usuario | Público | Autenticado | Propio/Admin | Propio/Admin |
| Categoría | Admin | Público | Admin | Admin |
| Etiqueta | Admin | Público | Admin | Admin |
| Publicación | Autenticado | Público | Autor/Admin | Autor/Admin |
| Comentario | Autenticado | Público | Autor/Admin | Autor/Admin |
| Archivo | Autenticado | Público | Autenticado | Autor/Admin |
| Grupo | Autenticado | Autenticado | Admin del Grupo | Admin del Grupo |
| Evento | Admin | Público | Admin | Admin |
| Notificación | Admin | Propio/Admin | Propio/Admin | Propio/Admin |
| Reporte | Autenticado | Propio/Admin | Admin | Admin |

---

## 📚 Documentación Swagger

La API incluye documentación interactiva generada automáticamente con **Swagger UI**.

### Acceder a la documentación:
```
http://localhost:5000/api/docs
```

### Características de Swagger:
- ✅ Todos los endpoints documentados
- ✅ Esquemas de request/response
- ✅ Ejemplos de uso
- ✅ Probador interactivo (Try it out)
- ✅ Autenticación JWT integrada

### Usar autenticación en Swagger:
1. Hacer login en `/api/usuarios/login`
2. Copiar el token JWT recibido
3. Click en el botón **Authorize** en Swagger
4. Ingresar: `Bearer <tu-token>`
5. Probar endpoints protegidos

### Obtener JSON de Swagger:
```
http://localhost:5000/api/docs/json
```

---

## 📊 Modelo de Datos

### Relaciones Principales:

```
Usuario (1) ──< (N) Publicacion
Usuario (1) ──< (N) Comentario
Usuario (1) ──< (N) Reporte
Usuario (N) ──< (N) GrupoEstudio (via GrupoUsuario)
Usuario (N) ──< (N) Evento (via InscripcionEvento)

Categoria (1) ──< (N) Publicacion
Categoria (1) ──< (N) Evento

Publicacion (1) ──< (N) Comentario
Publicacion (1) ──< (N) Archivo
Publicacion (N) ──< (N) Etiqueta (via PublicacionEtiqueta)
Publicacion (1) ──< (N) Reporte

Comentario (1) ──< (N) Reporte

Rol (1) ──< (N) Usuario
```

---

## 🧪 Testing

### Probar endpoints con curl:

```bash
# Registro
curl -X POST http://localhost:5000/api/usuarios/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan",
    "apellido": "Pérez",
    "email": "juan@example.com",
    "contrasena": "pass123",
    "cedula": "1234567890",
    "id_rol": 2
  }'

# Login
curl -X POST http://localhost:5000/api/usuarios/login \
  -H "Content-Type: application/json" \
  -d '{"email":"juan@example.com","contrasena":"pass123"}'

# Obtener perfil (reemplazar <TOKEN>)
curl -X GET http://localhost:5000/api/usuarios/profile \
  -H "Authorization: Bearer <TOKEN>"

# Crear publicación
curl -X POST http://localhost:5000/api/publicaciones \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "Mi primera publicación",
    "contenido": "Contenido de ejemplo",
    "id_categoria": 1,
    "etiquetas": [1, 2]
  }'
```

---

## 🔧 Scripts Disponibles

```json
{
  "dev": "Ejecutar en modo desarrollo con nodemon",
  "build": "Compilar TypeScript a JavaScript",
  "start": "Ejecutar versión compilada"
}
```

```bash
pnpm dev      # Desarrollo con auto-reload
pnpm build    # Compilar proyecto
pnpm start    # Producción
```

---

## 🛡️ Seguridad

### Implementaciones de Seguridad:

1. **Contraseñas encriptadas** con bcrypt (10 rounds)
2. **JWT Tokens** con expiración de 7 días
3. **CORS** habilitado para peticiones cross-origin
4. **Helmet** para headers de seguridad HTTP
5. **Validación de roles** en cada endpoint protegido
6. **Validación de ownership** (usuarios solo modifican sus recursos)

### Recomendaciones para Producción:

- [ ] Cambiar `JWT_SECRET` a un valor seguro y aleatorio
- [ ] Habilitar HTTPS
- [ ] Configurar rate limiting
- [ ] Implementar logging centralizado
- [ ] Configurar RLS (Row Level Security) en Supabase
- [ ] Revisar políticas de CORS
- [ ] Implementar validación de inputs más robusta

---

## 👥 Contribuir

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

---

## 📝 Licencia

Este proyecto es de uso académico para el proyecto integrador TdA.

---

## 📞 Contacto

Para dudas o sugerencias sobre el proyecto TechHub, contactar al equipo de desarrollo.

---

## 🎯 Roadmap Futuro

- [ ] Implementar sistema de likes en publicaciones
- [ ] Agregar búsqueda full-text
- [ ] Implementar paginación en listados
- [ ] Sistema de mensajería directa entre usuarios
- [ ] Notificaciones en tiempo real (WebSockets)
- [ ] Upload de archivos a Supabase Storage
- [ ] Sistema de badges/logros para usuarios
- [ ] Estadísticas y analytics
- [ ] Exportación de reportes en PDF

---

**Desarrollado con ❤️ para TechHub - Plataforma Colaborativa Académica**
