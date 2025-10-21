import { Router } from 'express';
import {
  addEtiqueta,
  listEtiquetas,
  getEtiqueta,
  updateEtiquetaController,
  deleteEtiquetaController,
} from '../controllers/etiqueta.controller';
import { authMiddleware, requireRole } from '../middleware/auth.middleware';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Etiqueta:
 *       type: object
 *       required:
 *         - nombre
 *       properties:
 *         id_etiqueta:
 *           type: integer
 *           description: ID autogenerado de la etiqueta
 *           example: 1
 *         nombre:
 *           type: string
 *           description: Nombre de la etiqueta
 *           example: JavaScript
 */

/**
 * @swagger
 * /api/etiquetas:
 *   post:
 *     summary: Crear una nueva etiqueta (requiere autenticación)
 *     tags: [Etiquetas]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: JavaScript
 *     responses:
 *       201:
 *         description: Etiqueta creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Etiqueta'
 *       400:
 *         description: El nombre es obligatorio
 *       401:
 *         description: No autenticado
 *       500:
 *         description: Error del servidor
 */
router.post('/', authMiddleware, addEtiqueta);

/**
 * @swagger
 * /api/etiquetas:
 *   get:
 *     summary: Obtener todas las etiquetas
 *     tags: [Etiquetas]
 *     responses:
 *       200:
 *         description: Lista de etiquetas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Etiqueta'
 *       500:
 *         description: Error del servidor
 */
router.get('/', listEtiquetas);

/**
 * @swagger
 * /api/etiquetas/{id}:
 *   get:
 *     summary: Obtener etiqueta por ID
 *     tags: [Etiquetas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la etiqueta
 *     responses:
 *       200:
 *         description: Etiqueta encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Etiqueta'
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Etiqueta no encontrada
 *       500:
 *         description: Error del servidor
 */
router.get('/:id', getEtiqueta);

/**
 * @swagger
 * /api/etiquetas/{id}:
 *   put:
 *     summary: Actualizar etiqueta (requiere autenticación)
 *     tags: [Etiquetas]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la etiqueta
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: TypeScript
 *     responses:
 *       200:
 *         description: Etiqueta actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Etiqueta'
 *       400:
 *         description: ID inválido
 *       401:
 *         description: No autenticado
 *       404:
 *         description: Etiqueta no encontrada
 *       500:
 *         description: Error del servidor
 */
router.put('/:id', authMiddleware, updateEtiquetaController);

/**
 * @swagger
 * /api/etiquetas/{id}:
 *   delete:
 *     summary: Eliminar etiqueta (solo admin - rol 1)
 *     tags: [Etiquetas]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la etiqueta
 *     responses:
 *       200:
 *         description: Etiqueta eliminada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Etiqueta eliminada correctamente
 *       400:
 *         description: ID inválido
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No tienes permisos (requiere rol admin)
 *       404:
 *         description: Etiqueta no encontrada
 *       500:
 *         description: Error del servidor
 */
router.delete('/:id', authMiddleware, requireRole(1), deleteEtiquetaController);

export default router;
