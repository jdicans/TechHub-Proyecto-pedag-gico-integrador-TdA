"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usuario_controller_1 = require("../controllers/usuario.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
/**
 * @swagger
 * components:
 *   schemas:
 *     Usuario:
 *       type: object
 *       properties:
 *         id_usuario:
 *           type: integer
 *           description: ID autogenerado del usuario
 *         nombre:
 *           type: string
 *           example: Juan
 *         apellido:
 *           type: string
 *           example: Pérez
 *         cedula:
 *           type: string
 *           example: "1234567890"
 *         telefono:
 *           type: string
 *           example: "3001234567"
 *         correo:
 *           type: string
 *           example: juan.perez@example.com
 *         carrera:
 *           type: string
 *           example: Ingeniería de Sistemas
 *         foto_perfil:
 *           type: string
 *           example: https://example.com/foto.jpg
 *         fecha_registro:
 *           type: string
 *           format: date-time
 *         id_rol:
 *           type: integer
 *           example: 2
 *     RegisterRequest:
 *       type: object
 *       required:
 *         - nombre
 *         - apellido
 *         - cedula
 *         - correo
 *         - contrasena
 *       properties:
 *         nombre:
 *           type: string
 *           example: Juan
 *         apellido:
 *           type: string
 *           example: Pérez
 *         cedula:
 *           type: string
 *           example: "1234567890"
 *         telefono:
 *           type: string
 *           example: "3001234567"
 *         correo:
 *           type: string
 *           example: juan.perez@example.com
 *         contrasena:
 *           type: string
 *           format: password
 *           example: MiContraseña123
 *         carrera:
 *           type: string
 *           example: Ingeniería de Sistemas
 *         id_rol:
 *           type: integer
 *           example: 2
 *     LoginRequest:
 *       type: object
 *       required:
 *         - correo
 *         - contrasena
 *       properties:
 *         correo:
 *           type: string
 *           example: juan.perez@example.com
 *         contrasena:
 *           type: string
 *           format: password
 *           example: MiContraseña123
 *     AuthResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         usuario:
 *           $ref: '#/components/schemas/Usuario'
 *         token:
 *           type: string
 *           description: JWT token
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
/**
 * @swagger
 * /api/usuarios/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Faltan campos obligatorios
 *       409:
 *         description: El correo o cédula ya están registrados
 *       500:
 *         description: Error del servidor
 */
router.post('/register', usuario_controller_1.register);
/**
 * @swagger
 * /api/usuarios/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login exitoso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Faltan credenciales
 *       401:
 *         description: Credenciales inválidas
 *       500:
 *         description: Error del servidor
 */
router.post('/login', usuario_controller_1.login);
/**
 * @swagger
 * /api/usuarios/profile:
 *   get:
 *     summary: Obtener perfil del usuario autenticado
 *     tags: [Usuarios]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil del usuario
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       401:
 *         description: No autenticado
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error del servidor
 */
router.get('/profile', auth_middleware_1.authMiddleware, usuario_controller_1.getProfile);
/**
 * @swagger
 * /api/usuarios/change-password:
 *   put:
 *     summary: Cambiar contraseña del usuario autenticado
 *     tags: [Usuarios]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - contrasenaActual
 *               - contrasenaNueva
 *             properties:
 *               contrasenaActual:
 *                 type: string
 *                 format: password
 *               contrasenaNueva:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Contraseña actualizada exitosamente
 *       400:
 *         description: Faltan campos obligatorios
 *       401:
 *         description: Contraseña actual incorrecta o no autenticado
 *       500:
 *         description: Error del servidor
 */
router.put('/change-password', auth_middleware_1.authMiddleware, usuario_controller_1.changePassword);
/**
 * @swagger
 * /api/usuarios:
 *   get:
 *     summary: Listar todos los usuarios (requiere autenticación)
 *     tags: [Usuarios]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Usuario'
 *       401:
 *         description: No autenticado
 *       500:
 *         description: Error del servidor
 */
router.get('/', auth_middleware_1.authMiddleware, usuario_controller_1.listUsuarios);
/**
 * @swagger
 * /api/usuarios/{id}:
 *   get:
 *     summary: Obtener usuario por ID (requiere autenticación)
 *     tags: [Usuarios]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       400:
 *         description: ID inválido
 *       401:
 *         description: No autenticado
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error del servidor
 */
router.get('/:id', auth_middleware_1.authMiddleware, usuario_controller_1.getUsuario);
/**
 * @swagger
 * /api/usuarios/{id}:
 *   put:
 *     summary: Actualizar usuario (solo el propio usuario o admin)
 *     tags: [Usuarios]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               apellido:
 *                 type: string
 *               telefono:
 *                 type: string
 *               carrera:
 *                 type: string
 *               foto_perfil:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *       400:
 *         description: ID inválido
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No tienes permisos
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error del servidor
 */
router.put('/:id', auth_middleware_1.authMiddleware, usuario_controller_1.updateUsuarioController);
/**
 * @swagger
 * /api/usuarios/{id}:
 *   delete:
 *     summary: Eliminar usuario (solo admin - rol 1)
 *     tags: [Usuarios]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente
 *       400:
 *         description: ID inválido
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No tienes permisos (requiere rol admin)
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error del servidor
 */
router.delete('/:id', auth_middleware_1.authMiddleware, (0, auth_middleware_1.requireRole)(1), usuario_controller_1.deleteUsuarioController);
exports.default = router;
