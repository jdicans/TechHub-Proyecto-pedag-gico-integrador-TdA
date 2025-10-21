import { Router } from 'express';
import {
  addComentario,
  listComentarios,
  getComentario,
  getComentariosByPublicacionId,
  getComentariosByUserId,
  getMyComentarios,
  countComentarios,
  updateComentarioController,
  deleteComentarioController,
} from '../controllers/comentario.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Comentario:
 *       type: object
 *       properties:
 *         id_comentario:
 *           type: integer
 *           example: 1
 *         contenido:
 *           type: string
 *           example: Excelente artículo, muy útil!
 *         fecha:
 *           type: string
 *           format: date-time
 *         id_usuario:
 *           type: integer
 *           example: 1
 *         id_publicacion:
 *           type: integer
 *           example: 5
 *         usuario:
 *           type: object
 *           properties:
 *             id_usuario:
 *               type: integer
 *             nombre:
 *               type: string
 *             apellido:
 *               type: string
 *             foto_perfil:
 *               type: string
 *     CreateComentario:
 *       type: object
 *       required:
 *         - contenido
 *         - id_publicacion
 *       properties:
 *         contenido:
 *           type: string
 *           example: Excelente artículo, muy útil!
 *         id_publicacion:
 *           type: integer
 *           example: 5
 */

/**
 * @swagger
 * /api/comentarios:
 *   post:
 *     summary: Crear un nuevo comentario (requiere autenticación)
 *     tags: [Comentarios]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateComentario'
 *     responses:
 *       201:
 *         description: Comentario creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comentario'
 *       400:
 *         description: Faltan campos obligatorios
 *       401:
 *         description: No autenticado
 *       500:
 *         description: Error del servidor
 */
router.post('/', authMiddleware, addComentario);

/**
 * @swagger
 * /api/comentarios:
 *   get:
 *     summary: Obtener todos los comentarios
 *     tags: [Comentarios]
 *     responses:
 *       200:
 *         description: Lista de comentarios con información del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comentario'
 *       500:
 *         description: Error del servidor
 */
router.get('/', listComentarios);

/**
 * @swagger
 * /api/comentarios/mis-comentarios:
 *   get:
 *     summary: Obtener mis comentarios (requiere autenticación)
 *     tags: [Comentarios]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de comentarios del usuario autenticado
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comentario'
 *       401:
 *         description: No autenticado
 *       500:
 *         description: Error del servidor
 */
router.get('/mis-comentarios', authMiddleware, getMyComentarios);

/**
 * @swagger
 * /api/comentarios/publicacion/{publicacionId}:
 *   get:
 *     summary: Obtener comentarios por publicación
 *     tags: [Comentarios]
 *     parameters:
 *       - in: path
 *         name: publicacionId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la publicación
 *     responses:
 *       200:
 *         description: Lista de comentarios de la publicación
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comentario'
 *       400:
 *         description: ID de publicación inválido
 *       500:
 *         description: Error del servidor
 */
router.get('/publicacion/:publicacionId', getComentariosByPublicacionId);

/**
 * @swagger
 * /api/comentarios/publicacion/{publicacionId}/count:
 *   get:
 *     summary: Contar comentarios de una publicación
 *     tags: [Comentarios]
 *     parameters:
 *       - in: path
 *         name: publicacionId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la publicación
 *     responses:
 *       200:
 *         description: Cantidad de comentarios
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   example: 42
 *       400:
 *         description: ID de publicación inválido
 *       500:
 *         description: Error del servidor
 */
router.get('/publicacion/:publicacionId/count', countComentarios);

/**
 * @swagger
 * /api/comentarios/usuario/{userId}:
 *   get:
 *     summary: Obtener comentarios por usuario
 *     tags: [Comentarios]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Lista de comentarios del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comentario'
 *       400:
 *         description: ID de usuario inválido
 *       500:
 *         description: Error del servidor
 */
router.get('/usuario/:userId', getComentariosByUserId);

/**
 * @swagger
 * /api/comentarios/{id}:
 *   get:
 *     summary: Obtener comentario por ID
 *     tags: [Comentarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del comentario
 *     responses:
 *       200:
 *         description: Comentario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comentario'
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Comentario no encontrado
 *       500:
 *         description: Error del servidor
 */
router.get('/:id', getComentario);

/**
 * @swagger
 * /api/comentarios/{id}:
 *   put:
 *     summary: Actualizar comentario (solo autor o admin)
 *     tags: [Comentarios]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del comentario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - contenido
 *             properties:
 *               contenido:
 *                 type: string
 *                 example: Comentario actualizado
 *     responses:
 *       200:
 *         description: Comentario actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comentario'
 *       400:
 *         description: ID inválido o contenido faltante
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No tienes permisos
 *       404:
 *         description: Comentario no encontrado
 *       500:
 *         description: Error del servidor
 */
router.put('/:id', authMiddleware, updateComentarioController);

/**
 * @swagger
 * /api/comentarios/{id}:
 *   delete:
 *     summary: Eliminar comentario (solo autor o admin)
 *     tags: [Comentarios]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del comentario
 *     responses:
 *       200:
 *         description: Comentario eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Comentario eliminado correctamente
 *       400:
 *         description: ID inválido
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No tienes permisos
 *       404:
 *         description: Comentario no encontrado
 *       500:
 *         description: Error del servidor
 */
router.delete('/:id', authMiddleware, deleteComentarioController);

export default router;
