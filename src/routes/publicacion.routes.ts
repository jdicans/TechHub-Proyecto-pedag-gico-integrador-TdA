import { Router } from 'express';
import {
  addPublicacion,
  listPublicaciones,
  getPublicacion,
  getPublicacionesByUser,
  getPublicacionesByCategory,
  getMyPublicaciones,
  updatePublicacionController,
  deletePublicacionController,
} from '../controllers/publicacion.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Publicacion:
 *       type: object
 *       properties:
 *         id_publicacion:
 *           type: integer
 *           example: 1
 *         titulo:
 *           type: string
 *           example: Introducción a TypeScript
 *         contenido:
 *           type: string
 *           example: TypeScript es un superset de JavaScript...
 *         fecha_creacion:
 *           type: string
 *           format: date-time
 *         id_usuario:
 *           type: integer
 *           example: 1
 *         id_categoria:
 *           type: integer
 *           example: 1
 *         tipo:
 *           type: string
 *           example: articulo
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
 *         categoria:
 *           type: object
 *           properties:
 *             id_categoria:
 *               type: integer
 *             nombre:
 *               type: string
 *         etiquetas:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id_etiqueta:
 *                 type: integer
 *               nombre:
 *                 type: string
 *     CreatePublicacion:
 *       type: object
 *       required:
 *         - titulo
 *         - contenido
 *         - id_categoria
 *       properties:
 *         titulo:
 *           type: string
 *           example: Introducción a TypeScript
 *         contenido:
 *           type: string
 *           example: TypeScript es un superset de JavaScript que añade tipos estáticos...
 *         id_categoria:
 *           type: integer
 *           example: 1
 *         tipo:
 *           type: string
 *           example: articulo
 *         etiquetas:
 *           type: array
 *           items:
 *             type: integer
 *           example: [1, 2, 3]
 */

/**
 * @swagger
 * /api/publicaciones:
 *   post:
 *     summary: Crear una nueva publicación (requiere autenticación)
 *     tags: [Publicaciones]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePublicacion'
 *     responses:
 *       201:
 *         description: Publicación creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Publicacion'
 *       400:
 *         description: Faltan campos obligatorios
 *       401:
 *         description: No autenticado
 *       500:
 *         description: Error del servidor
 */
router.post('/', authMiddleware, addPublicacion);

/**
 * @swagger
 * /api/publicaciones:
 *   get:
 *     summary: Obtener todas las publicaciones
 *     tags: [Publicaciones]
 *     responses:
 *       200:
 *         description: Lista de publicaciones con relaciones
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Publicacion'
 *       500:
 *         description: Error del servidor
 */
router.get('/', listPublicaciones);

/**
 * @swagger
 * /api/publicaciones/mis-publicaciones:
 *   get:
 *     summary: Obtener mis publicaciones (requiere autenticación)
 *     tags: [Publicaciones]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de publicaciones del usuario autenticado
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Publicacion'
 *       401:
 *         description: No autenticado
 *       500:
 *         description: Error del servidor
 */
router.get('/mis-publicaciones', authMiddleware, getMyPublicaciones);

/**
 * @swagger
 * /api/publicaciones/usuario/{userId}:
 *   get:
 *     summary: Obtener publicaciones por usuario
 *     tags: [Publicaciones]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Lista de publicaciones del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Publicacion'
 *       400:
 *         description: ID de usuario inválido
 *       500:
 *         description: Error del servidor
 */
router.get('/usuario/:userId', getPublicacionesByUser);

/**
 * @swagger
 * /api/publicaciones/categoria/{categoryId}:
 *   get:
 *     summary: Obtener publicaciones por categoría
 *     tags: [Publicaciones]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la categoría
 *     responses:
 *       200:
 *         description: Lista de publicaciones de la categoría
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Publicacion'
 *       400:
 *         description: ID de categoría inválido
 *       500:
 *         description: Error del servidor
 */
router.get('/categoria/:categoryId', getPublicacionesByCategory);

/**
 * @swagger
 * /api/publicaciones/{id}:
 *   get:
 *     summary: Obtener publicación por ID
 *     tags: [Publicaciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la publicación
 *     responses:
 *       200:
 *         description: Publicación encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Publicacion'
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Publicación no encontrada
 *       500:
 *         description: Error del servidor
 */
router.get('/:id', getPublicacion);

/**
 * @swagger
 * /api/publicaciones/{id}:
 *   put:
 *     summary: Actualizar publicación (solo autor o admin)
 *     tags: [Publicaciones]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la publicación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               contenido:
 *                 type: string
 *               id_categoria:
 *                 type: integer
 *               tipo:
 *                 type: string
 *               etiquetas:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       200:
 *         description: Publicación actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Publicacion'
 *       400:
 *         description: ID inválido
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No tienes permisos
 *       404:
 *         description: Publicación no encontrada
 *       500:
 *         description: Error del servidor
 */
router.put('/:id', authMiddleware, updatePublicacionController);

/**
 * @swagger
 * /api/publicaciones/{id}:
 *   delete:
 *     summary: Eliminar publicación (solo autor o admin)
 *     tags: [Publicaciones]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la publicación
 *     responses:
 *       200:
 *         description: Publicación eliminada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Publicación eliminada correctamente
 *       400:
 *         description: ID inválido
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No tienes permisos
 *       404:
 *         description: Publicación no encontrada
 *       500:
 *         description: Error del servidor
 */
router.delete('/:id', authMiddleware, deletePublicacionController);

export default router;
