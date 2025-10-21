"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const grupoEstudio_controller_1 = require("../controllers/grupoEstudio.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
/**
 * @swagger
 * components:
 *   schemas:
 *     GrupoEstudio:
 *       type: object
 *       properties:
 *         id_grupo:
 *           type: integer
 *           example: 1
 *         nombre:
 *           type: string
 *           example: Grupo de Programación Web
 *         descripcion:
 *           type: string
 *           example: Grupo para estudiar desarrollo web moderno
 *         fecha_creacion:
 *           type: string
 *           format: date-time
 *         miembros:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id_usuario:
 *                 type: integer
 *               nombre:
 *                 type: string
 *               apellido:
 *                 type: string
 *               foto_perfil:
 *                 type: string
 *               rol_grupo:
 *                 type: string
 *                 enum: [administrador, moderador, miembro]
 *               fecha_union:
 *                 type: string
 *                 format: date-time
 *         total_miembros:
 *           type: integer
 *           example: 5
 *     CreateGrupoEstudio:
 *       type: object
 *       required:
 *         - nombre
 *       properties:
 *         nombre:
 *           type: string
 *           example: Grupo de Programación Web
 *         descripcion:
 *           type: string
 *           example: Grupo para estudiar desarrollo web moderno
 */
/**
 * @swagger
 * /api/grupos:
 *   post:
 *     summary: Crear un nuevo grupo de estudio (requiere autenticación)
 *     tags: [Grupos de Estudio]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateGrupoEstudio'
 *     responses:
 *       201:
 *         description: Grupo creado exitosamente (usuario creador se agrega como administrador)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GrupoEstudio'
 *       400:
 *         description: El nombre es obligatorio
 *       401:
 *         description: No autenticado
 *       500:
 *         description: Error del servidor
 */
router.post('/', auth_middleware_1.authMiddleware, grupoEstudio_controller_1.addGrupoEstudio);
/**
 * @swagger
 * /api/grupos:
 *   get:
 *     summary: Obtener todos los grupos de estudio
 *     tags: [Grupos de Estudio]
 *     responses:
 *       200:
 *         description: Lista de grupos con miembros
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/GrupoEstudio'
 *       500:
 *         description: Error del servidor
 */
router.get('/', grupoEstudio_controller_1.listGruposEstudio);
/**
 * @swagger
 * /api/grupos/mis-grupos:
 *   get:
 *     summary: Obtener mis grupos (requiere autenticación)
 *     tags: [Grupos de Estudio]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de grupos del usuario autenticado
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/GrupoEstudio'
 *       401:
 *         description: No autenticado
 *       500:
 *         description: Error del servidor
 */
router.get('/mis-grupos', auth_middleware_1.authMiddleware, grupoEstudio_controller_1.getMyGrupos);
/**
 * @swagger
 * /api/grupos/usuario/{userId}:
 *   get:
 *     summary: Obtener grupos por usuario
 *     tags: [Grupos de Estudio]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Lista de grupos del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/GrupoEstudio'
 *       400:
 *         description: ID de usuario inválido
 *       500:
 *         description: Error del servidor
 */
router.get('/usuario/:userId', grupoEstudio_controller_1.getGruposByUser);
/**
 * @swagger
 * /api/grupos/{id}:
 *   get:
 *     summary: Obtener grupo por ID
 *     tags: [Grupos de Estudio]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del grupo
 *     responses:
 *       200:
 *         description: Grupo encontrado con lista de miembros
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GrupoEstudio'
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Grupo no encontrado
 *       500:
 *         description: Error del servidor
 */
router.get('/:id', grupoEstudio_controller_1.getGrupoEstudio);
/**
 * @swagger
 * /api/grupos/{id}:
 *   put:
 *     summary: Actualizar grupo (solo administradores del grupo)
 *     tags: [Grupos de Estudio]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del grupo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *     responses:
 *       200:
 *         description: Grupo actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GrupoEstudio'
 *       400:
 *         description: ID inválido
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Solo los administradores pueden actualizar
 *       500:
 *         description: Error del servidor
 */
router.put('/:id', auth_middleware_1.authMiddleware, grupoEstudio_controller_1.updateGrupoEstudioController);
/**
 * @swagger
 * /api/grupos/{id}:
 *   delete:
 *     summary: Eliminar grupo (solo administradores del grupo)
 *     tags: [Grupos de Estudio]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del grupo
 *     responses:
 *       200:
 *         description: Grupo eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Grupo eliminado correctamente
 *       400:
 *         description: ID inválido
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Solo los administradores pueden eliminar
 *       500:
 *         description: Error del servidor
 */
router.delete('/:id', auth_middleware_1.authMiddleware, grupoEstudio_controller_1.deleteGrupoEstudioController);
/**
 * @swagger
 * /api/grupos/{id}/miembros:
 *   get:
 *     summary: Obtener miembros de un grupo
 *     tags: [Grupos de Estudio]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del grupo
 *     responses:
 *       200:
 *         description: Lista de miembros del grupo
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_usuario:
 *                     type: integer
 *                   nombre:
 *                     type: string
 *                   apellido:
 *                     type: string
 *                   foto_perfil:
 *                     type: string
 *                   rol_grupo:
 *                     type: string
 *                   fecha_union:
 *                     type: string
 *                     format: date-time
 *       400:
 *         description: ID inválido
 *       500:
 *         description: Error del servidor
 */
router.get('/:id/miembros', grupoEstudio_controller_1.getMiembros);
/**
 * @swagger
 * /api/grupos/{id}/miembros/count:
 *   get:
 *     summary: Contar miembros de un grupo
 *     tags: [Grupos de Estudio]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del grupo
 *     responses:
 *       200:
 *         description: Cantidad de miembros
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   example: 15
 *       400:
 *         description: ID inválido
 *       500:
 *         description: Error del servidor
 */
router.get('/:id/miembros/count', grupoEstudio_controller_1.countMiembros);
/**
 * @swagger
 * /api/grupos/{id}/miembros:
 *   post:
 *     summary: Agregar miembro a un grupo (solo administradores)
 *     tags: [Grupos de Estudio]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del grupo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_usuario
 *             properties:
 *               id_usuario:
 *                 type: integer
 *                 example: 5
 *               rol_grupo:
 *                 type: string
 *                 enum: [administrador, moderador, miembro]
 *                 example: miembro
 *     responses:
 *       201:
 *         description: Miembro agregado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GrupoEstudio'
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Solo los administradores pueden agregar miembros
 *       404:
 *         description: Grupo no encontrado
 *       409:
 *         description: El usuario ya es miembro del grupo
 *       500:
 *         description: Error del servidor
 */
router.post('/:id/miembros', auth_middleware_1.authMiddleware, grupoEstudio_controller_1.addMiembro);
/**
 * @swagger
 * /api/grupos/{id}/miembros/{userId}:
 *   delete:
 *     summary: Remover miembro de un grupo (administradores o el mismo usuario)
 *     tags: [Grupos de Estudio]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del grupo
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario a remover
 *     responses:
 *       200:
 *         description: Miembro removido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Miembro removido correctamente
 *       400:
 *         description: IDs inválidos
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No tienes permisos
 *       500:
 *         description: Error del servidor
 */
router.delete('/:id/miembros/:userId', auth_middleware_1.authMiddleware, grupoEstudio_controller_1.removeMiembro);
/**
 * @swagger
 * /api/grupos/{id}/miembros/{userId}/rol:
 *   put:
 *     summary: Actualizar rol de un miembro (solo administradores)
 *     tags: [Grupos de Estudio]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del grupo
 *       - in: path
 *         name: userId
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
 *             required:
 *               - rol_grupo
 *             properties:
 *               rol_grupo:
 *                 type: string
 *                 enum: [administrador, moderador, miembro]
 *                 example: moderador
 *     responses:
 *       200:
 *         description: Rol actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GrupoEstudio'
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Solo los administradores pueden cambiar roles
 *       500:
 *         description: Error del servidor
 */
router.put('/:id/miembros/:userId/rol', auth_middleware_1.authMiddleware, grupoEstudio_controller_1.updateMiembroRolController);
exports.default = router;
