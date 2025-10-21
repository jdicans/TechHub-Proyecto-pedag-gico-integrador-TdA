import { Router } from 'express';
import {
  addNotificacion,
  listNotificaciones,
  getMyNotificaciones,
  getMyNotificacionesNoLeidas,
  getNotificacion,
  markNotificacionAsRead,
  markAllMyNotificacionesAsRead,
  updateNotificacion,
  deleteNotificacion,
  deleteMyLeidasNotificaciones
} from '../controllers/notificacion.controller';
import { authMiddleware, requireRole } from '../middleware/auth.middleware';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Notificacion:
 *       type: object
 *       properties:
 *         id_notificacion:
 *           type: integer
 *           description: ID de la notificación
 *         mensaje:
 *           type: string
 *           description: Mensaje de la notificación
 *         tipo:
 *           type: string
 *           description: Tipo de notificación
 *           example: "info"
 *         fecha:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación
 *         leida:
 *           type: boolean
 *           description: Estado de lectura
 *         id_usuario:
 *           type: integer
 *           description: ID del usuario destinatario
 *       example:
 *         id_notificacion: 1
 *         mensaje: "Nuevo comentario en tu publicación"
 *         tipo: "comentario"
 *         fecha: "2025-10-20T10:30:00Z"
 *         leida: false
 *         id_usuario: 2
 *     CreateNotificacionRequest:
 *       type: object
 *       required:
 *         - mensaje
 *         - tipo
 *         - id_usuario
 *       properties:
 *         mensaje:
 *           type: string
 *           description: Mensaje de la notificación
 *         tipo:
 *           type: string
 *           description: Tipo de notificación
 *           enum: [info, advertencia, error, comentario, evento, grupo]
 *         id_usuario:
 *           type: integer
 *           description: ID del usuario destinatario
 *       example:
 *         mensaje: "Nuevo comentario en tu publicación"
 *         tipo: "comentario"
 *         id_usuario: 2
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Mensaje de error
 */

/**
 * @swagger
 * tags:
 *   name: Notificaciones
 *   description: Endpoints para gestionar notificaciones
 */

/**
 * @swagger
 * /api/notificaciones:
 *   post:
 *     summary: Crear una nueva notificación
 *     tags: [Notificaciones]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateNotificacionRequest'
 *     responses:
 *       201:
 *         description: Notificación creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notificacion'
 *       401:
 *         description: No autenticado
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', authMiddleware, requireRole(1), addNotificacion);

/**
 * @swagger
 * /api/notificaciones:
 *   get:
 *     summary: Listar todas las notificaciones (solo admin)
 *     tags: [Notificaciones]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de todas las notificaciones
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Notificacion'
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No autorizado (solo admin)
 *       500:
 *         description: Error del servidor
 */
router.get('/', authMiddleware, requireRole(1), listNotificaciones);

/**
 * @swagger
 * /api/notificaciones/mis-notificaciones:
 *   get:
 *     summary: Obtener notificaciones del usuario autenticado
 *     tags: [Notificaciones]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de notificaciones del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Notificacion'
 *       401:
 *         description: No autenticado
 *       500:
 *         description: Error del servidor
 */
router.get('/mis-notificaciones', authMiddleware, getMyNotificaciones);

/**
 * @swagger
 * /api/notificaciones/no-leidas:
 *   get:
 *     summary: Obtener notificaciones no leídas del usuario autenticado
 *     tags: [Notificaciones]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de notificaciones no leídas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Notificacion'
 *       401:
 *         description: No autenticado
 *       500:
 *         description: Error del servidor
 */
router.get('/no-leidas', authMiddleware, getMyNotificacionesNoLeidas);

/**
 * @swagger
 * /api/notificaciones/marcar-todas-leidas:
 *   put:
 *     summary: Marcar todas las notificaciones del usuario como leídas
 *     tags: [Notificaciones]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notificaciones marcadas como leídas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 count:
 *                   type: integer
 *       401:
 *         description: No autenticado
 *       500:
 *         description: Error del servidor
 */
router.put('/marcar-todas-leidas', authMiddleware, markAllMyNotificacionesAsRead);

/**
 * @swagger
 * /api/notificaciones/limpiar-leidas:
 *   delete:
 *     summary: Eliminar todas las notificaciones leídas del usuario
 *     tags: [Notificaciones]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notificaciones leídas eliminadas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 count:
 *                   type: integer
 *       401:
 *         description: No autenticado
 *       500:
 *         description: Error del servidor
 */
router.delete('/limpiar-leidas', authMiddleware, deleteMyLeidasNotificaciones);

/**
 * @swagger
 * /api/notificaciones/{id}:
 *   get:
 *     summary: Obtener notificación por ID
 *     tags: [Notificaciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la notificación
 *     responses:
 *       200:
 *         description: Notificación encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notificacion'
 *       400:
 *         description: ID inválido
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No autorizado para ver esta notificación
 *       404:
 *         description: Notificación no encontrada
 *       500:
 *         description: Error del servidor
 */
router.get('/:id', authMiddleware, getNotificacion);

/**
 * @swagger
 * /api/notificaciones/{id}/marcar-leida:
 *   put:
 *     summary: Marcar notificación como leída
 *     tags: [Notificaciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la notificación
 *     responses:
 *       200:
 *         description: Notificación marcada como leída
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notificacion'
 *       400:
 *         description: ID inválido
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No autorizado
 *       404:
 *         description: Notificación no encontrada
 *       500:
 *         description: Error del servidor
 */
router.put('/:id/marcar-leida', authMiddleware, markNotificacionAsRead);

/**
 * @swagger
 * /api/notificaciones/{id}:
 *   put:
 *     summary: Actualizar notificación (solo admin)
 *     tags: [Notificaciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la notificación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mensaje:
 *                 type: string
 *               tipo:
 *                 type: string
 *               leida:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Notificación actualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notificacion'
 *       400:
 *         description: ID inválido
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No autorizado (solo admin)
 *       404:
 *         description: Notificación no encontrada
 *       500:
 *         description: Error del servidor
 */
router.put('/:id', authMiddleware, requireRole(1), updateNotificacion);

/**
 * @swagger
 * /api/notificaciones/{id}:
 *   delete:
 *     summary: Eliminar notificación
 *     tags: [Notificaciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la notificación
 *     responses:
 *       200:
 *         description: Notificación eliminada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: ID inválido
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No autorizado
 *       404:
 *         description: Notificación no encontrada
 *       500:
 *         description: Error del servidor
 */
router.delete('/:id', authMiddleware, deleteNotificacion);

export default router;
