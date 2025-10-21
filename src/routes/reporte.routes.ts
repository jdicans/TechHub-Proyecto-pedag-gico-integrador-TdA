import { Router } from 'express';
import {
  addReporte,
  listReportes,
  getReportesPorEstado,
  getMisReportes,
  getReportesUsuario,
  getReportesPublicacion,
  getReportesComentario,
  getReporte,
  cambiarEstadoReporte,
  updateReporte,
  deleteReporte
} from '../controllers/reporte.controller';
import { authMiddleware, requireRole } from '../middleware/auth.middleware';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Reporte:
 *       type: object
 *       properties:
 *         id_reporte:
 *           type: integer
 *           description: ID del reporte
 *         motivo:
 *           type: string
 *           description: Motivo del reporte
 *         descripcion:
 *           type: string
 *           description: Descripción detallada del reporte
 *         estado:
 *           type: string
 *           enum: [pendiente, en_revision, resuelto, rechazado]
 *           description: Estado del reporte
 *         fecha_reporte:
 *           type: string
 *           format: date-time
 *           description: Fecha del reporte
 *         fecha_resolucion:
 *           type: string
 *           format: date-time
 *           description: Fecha de resolución
 *         id_usuario_reporta:
 *           type: integer
 *           description: ID del usuario que reporta
 *         id_usuario_reportado:
 *           type: integer
 *           description: ID del usuario reportado
 *         id_publicacion:
 *           type: integer
 *           description: ID de la publicación reportada
 *         id_comentario:
 *           type: integer
 *           description: ID del comentario reportado
 *       example:
 *         id_reporte: 1
 *         motivo: "Contenido inapropiado"
 *         descripcion: "Esta publicación contiene lenguaje ofensivo"
 *         estado: "pendiente"
 *         fecha_reporte: "2025-10-20T10:30:00Z"
 *         id_usuario_reporta: 2
 *         id_publicacion: 5
 *     CreateReporteRequest:
 *       type: object
 *       required:
 *         - motivo
 *         - descripcion
 *       properties:
 *         motivo:
 *           type: string
 *           description: Motivo del reporte
 *           example: "Contenido inapropiado"
 *         descripcion:
 *           type: string
 *           description: Descripción detallada
 *           example: "Esta publicación contiene lenguaje ofensivo"
 *         id_usuario_reportado:
 *           type: integer
 *           description: ID del usuario reportado (opcional)
 *         id_publicacion:
 *           type: integer
 *           description: ID de la publicación reportada (opcional)
 *         id_comentario:
 *           type: integer
 *           description: ID del comentario reportado (opcional)
 *     UpdateReporteEstadoRequest:
 *       type: object
 *       required:
 *         - estado
 *       properties:
 *         estado:
 *           type: string
 *           enum: [pendiente, en_revision, resuelto, rechazado]
 *           description: Nuevo estado del reporte
 *       example:
 *         estado: "resuelto"
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
 *   name: Reportes
 *   description: Endpoints para gestionar reportes de contenido y usuarios
 */

/**
 * @swagger
 * /api/reportes:
 *   post:
 *     summary: Crear un nuevo reporte
 *     tags: [Reportes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateReporteRequest'
 *     responses:
 *       201:
 *         description: Reporte creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reporte'
 *       400:
 *         description: Debe reportar al menos un usuario, publicación o comentario
 *       401:
 *         description: No autenticado
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', authMiddleware, addReporte);

/**
 * @swagger
 * /api/reportes:
 *   get:
 *     summary: Listar todos los reportes (solo admin)
 *     tags: [Reportes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de todos los reportes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reporte'
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No autorizado (solo admin)
 *       500:
 *         description: Error del servidor
 */
router.get('/', authMiddleware, requireRole(1), listReportes);

/**
 * @swagger
 * /api/reportes/mis-reportes:
 *   get:
 *     summary: Obtener reportes realizados por el usuario autenticado
 *     tags: [Reportes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de reportes del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reporte'
 *       401:
 *         description: No autenticado
 *       500:
 *         description: Error del servidor
 */
router.get('/mis-reportes', authMiddleware, getMisReportes);

/**
 * @swagger
 * /api/reportes/estado/{estado}:
 *   get:
 *     summary: Obtener reportes por estado (solo admin)
 *     tags: [Reportes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: estado
 *         required: true
 *         schema:
 *           type: string
 *           enum: [pendiente, en_revision, resuelto, rechazado]
 *         description: Estado del reporte
 *     responses:
 *       200:
 *         description: Lista de reportes con el estado especificado
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reporte'
 *       400:
 *         description: Estado inválido
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No autorizado (solo admin)
 *       500:
 *         description: Error del servidor
 */
router.get('/estado/:estado', authMiddleware, requireRole(1), getReportesPorEstado);

/**
 * @swagger
 * /api/reportes/usuario/{id_usuario}:
 *   get:
 *     summary: Obtener reportes sobre un usuario (solo admin)
 *     tags: [Reportes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_usuario
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario reportado
 *     responses:
 *       200:
 *         description: Lista de reportes sobre el usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reporte'
 *       400:
 *         description: ID inválido
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No autorizado (solo admin)
 *       500:
 *         description: Error del servidor
 */
router.get('/usuario/:id_usuario', authMiddleware, requireRole(1), getReportesUsuario);

/**
 * @swagger
 * /api/reportes/publicacion/{id_publicacion}:
 *   get:
 *     summary: Obtener reportes sobre una publicación (solo admin)
 *     tags: [Reportes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_publicacion
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la publicación reportada
 *     responses:
 *       200:
 *         description: Lista de reportes sobre la publicación
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reporte'
 *       400:
 *         description: ID inválido
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No autorizado (solo admin)
 *       500:
 *         description: Error del servidor
 */
router.get('/publicacion/:id_publicacion', authMiddleware, requireRole(1), getReportesPublicacion);

/**
 * @swagger
 * /api/reportes/comentario/{id_comentario}:
 *   get:
 *     summary: Obtener reportes sobre un comentario (solo admin)
 *     tags: [Reportes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_comentario
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del comentario reportado
 *     responses:
 *       200:
 *         description: Lista de reportes sobre el comentario
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reporte'
 *       400:
 *         description: ID inválido
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No autorizado (solo admin)
 *       500:
 *         description: Error del servidor
 */
router.get('/comentario/:id_comentario', authMiddleware, requireRole(1), getReportesComentario);

/**
 * @swagger
 * /api/reportes/{id}:
 *   get:
 *     summary: Obtener reporte por ID
 *     tags: [Reportes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del reporte
 *     responses:
 *       200:
 *         description: Reporte encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reporte'
 *       400:
 *         description: ID inválido
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No autorizado
 *       404:
 *         description: Reporte no encontrado
 *       500:
 *         description: Error del servidor
 */
router.get('/:id', authMiddleware, getReporte);

/**
 * @swagger
 * /api/reportes/{id}/estado:
 *   put:
 *     summary: Cambiar estado de un reporte (solo admin)
 *     tags: [Reportes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del reporte
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateReporteEstadoRequest'
 *     responses:
 *       200:
 *         description: Estado actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reporte'
 *       400:
 *         description: ID o estado inválido
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No autorizado (solo admin)
 *       404:
 *         description: Reporte no encontrado
 *       500:
 *         description: Error del servidor
 */
router.put('/:id/estado', authMiddleware, requireRole(1), cambiarEstadoReporte);

/**
 * @swagger
 * /api/reportes/{id}:
 *   put:
 *     summary: Actualizar reporte (solo admin)
 *     tags: [Reportes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del reporte
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               motivo:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               estado:
 *                 type: string
 *     responses:
 *       200:
 *         description: Reporte actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reporte'
 *       400:
 *         description: ID inválido
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No autorizado (solo admin)
 *       404:
 *         description: Reporte no encontrado
 *       500:
 *         description: Error del servidor
 */
router.put('/:id', authMiddleware, requireRole(1), updateReporte);

/**
 * @swagger
 * /api/reportes/{id}:
 *   delete:
 *     summary: Eliminar reporte (solo admin)
 *     tags: [Reportes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del reporte
 *     responses:
 *       200:
 *         description: Reporte eliminado
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
 *         description: No autorizado (solo admin)
 *       404:
 *         description: Reporte no encontrado
 *       500:
 *         description: Error del servidor
 */
router.delete('/:id', authMiddleware, requireRole(1), deleteReporte);

export default router;
