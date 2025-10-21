import { Router } from 'express';
import {
  addEvento,
  listEventos,
  listEventosProximos,
  getEvento,
  getEventosByCategory,
  getEventosByMode,
  getMyEventos,
  updateEventoController,
  deleteEventoController,
  inscribirse,
  cancelarInscripcionController,
  getInscritos,
  countInscritos,
} from '../controllers/evento.controller';
import { authMiddleware, requireRole } from '../middleware/auth.middleware';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Evento:
 *       type: object
 *       properties:
 *         id_evento:
 *           type: integer
 *           example: 1
 *         nombre:
 *           type: string
 *           example: Conferencia de Inteligencia Artificial
 *         descripcion:
 *           type: string
 *           example: Charla sobre aplicaciones de IA en la industria
 *         fecha_evento:
 *           type: string
 *           format: date
 *           example: "2025-11-15"
 *         hora_evento:
 *           type: string
 *           example: "14:00"
 *         lugar:
 *           type: string
 *           example: Auditorio Principal
 *         modalidad:
 *           type: string
 *           enum: [presencial, virtual, híbrido]
 *           example: presencial
 *         id_categoria:
 *           type: integer
 *           example: 1
 *         categoria:
 *           type: object
 *           properties:
 *             id_categoria:
 *               type: integer
 *             nombre:
 *               type: string
 *         inscritos:
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
 *               fecha_inscripcion:
 *                 type: string
 *                 format: date-time
 *         total_inscritos:
 *           type: integer
 *           example: 25
 *     CreateEvento:
 *       type: object
 *       required:
 *         - nombre
 *         - fecha_evento
 *       properties:
 *         nombre:
 *           type: string
 *           example: Conferencia de Inteligencia Artificial
 *         descripcion:
 *           type: string
 *           example: Charla sobre aplicaciones de IA en la industria
 *         fecha_evento:
 *           type: string
 *           format: date
 *           example: "2025-11-15"
 *         hora_evento:
 *           type: string
 *           example: "14:00"
 *         lugar:
 *           type: string
 *           example: Auditorio Principal
 *         modalidad:
 *           type: string
 *           enum: [presencial, virtual, híbrido]
 *           example: presencial
 *         id_categoria:
 *           type: integer
 *           example: 1
 */

/**
 * @swagger
 * /api/eventos:
 *   post:
 *     summary: Crear un nuevo evento (requiere autenticación)
 *     tags: [Eventos]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateEvento'
 *     responses:
 *       201:
 *         description: Evento creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Evento'
 *       400:
 *         description: Faltan campos obligatorios
 *       401:
 *         description: No autenticado
 *       500:
 *         description: Error del servidor
 */
router.post('/', authMiddleware, addEvento);

/**
 * @swagger
 * /api/eventos:
 *   get:
 *     summary: Obtener todos los eventos
 *     tags: [Eventos]
 *     responses:
 *       200:
 *         description: Lista de eventos con inscritos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Evento'
 *       500:
 *         description: Error del servidor
 */
router.get('/', listEventos);

/**
 * @swagger
 * /api/eventos/proximos:
 *   get:
 *     summary: Obtener eventos próximos (futuros)
 *     tags: [Eventos]
 *     responses:
 *       200:
 *         description: Lista de eventos próximos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Evento'
 *       500:
 *         description: Error del servidor
 */
router.get('/proximos', listEventosProximos);

/**
 * @swagger
 * /api/eventos/mis-eventos:
 *   get:
 *     summary: Obtener mis eventos inscritos (requiere autenticación)
 *     tags: [Eventos]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de eventos en los que estoy inscrito
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Evento'
 *       401:
 *         description: No autenticado
 *       500:
 *         description: Error del servidor
 */
router.get('/mis-eventos', authMiddleware, getMyEventos);

/**
 * @swagger
 * /api/eventos/modalidad:
 *   get:
 *     summary: Obtener eventos por modalidad
 *     tags: [Eventos]
 *     parameters:
 *       - in: query
 *         name: modalidad
 *         required: true
 *         schema:
 *           type: string
 *           enum: [presencial, virtual, híbrido]
 *         description: Modalidad del evento
 *         example: presencial
 *     responses:
 *       200:
 *         description: Lista de eventos de la modalidad especificada
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Evento'
 *       400:
 *         description: El parámetro modalidad es requerido
 *       500:
 *         description: Error del servidor
 */
router.get('/modalidad', getEventosByMode);

/**
 * @swagger
 * /api/eventos/categoria/{categoryId}:
 *   get:
 *     summary: Obtener eventos por categoría
 *     tags: [Eventos]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la categoría
 *     responses:
 *       200:
 *         description: Lista de eventos de la categoría
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Evento'
 *       400:
 *         description: ID de categoría inválido
 *       500:
 *         description: Error del servidor
 */
router.get('/categoria/:categoryId', getEventosByCategory);

/**
 * @swagger
 * /api/eventos/{id}:
 *   get:
 *     summary: Obtener evento por ID
 *     tags: [Eventos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del evento
 *     responses:
 *       200:
 *         description: Evento encontrado con lista de inscritos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Evento'
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Evento no encontrado
 *       500:
 *         description: Error del servidor
 */
router.get('/:id', getEvento);

/**
 * @swagger
 * /api/eventos/{id}:
 *   put:
 *     summary: Actualizar evento (solo admin - rol 1)
 *     tags: [Eventos]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del evento
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
 *               fecha_evento:
 *                 type: string
 *                 format: date
 *               hora_evento:
 *                 type: string
 *               lugar:
 *                 type: string
 *               modalidad:
 *                 type: string
 *               id_categoria:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Evento actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Evento'
 *       400:
 *         description: ID inválido
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Solo los administradores pueden actualizar eventos
 *       500:
 *         description: Error del servidor
 */
router.put('/:id', authMiddleware, requireRole(1), updateEventoController);

/**
 * @swagger
 * /api/eventos/{id}:
 *   delete:
 *     summary: Eliminar evento (solo admin - rol 1)
 *     tags: [Eventos]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del evento
 *     responses:
 *       200:
 *         description: Evento eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Evento eliminado correctamente
 *       400:
 *         description: ID inválido
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Solo los administradores pueden eliminar eventos
 *       500:
 *         description: Error del servidor
 */
router.delete('/:id', authMiddleware, requireRole(1), deleteEventoController);

/**
 * @swagger
 * /api/eventos/{id}/inscribirse:
 *   post:
 *     summary: Inscribirse a un evento (requiere autenticación)
 *     tags: [Eventos]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del evento
 *     responses:
 *       201:
 *         description: Inscripción exitosa
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Evento'
 *       400:
 *         description: ID inválido
 *       401:
 *         description: No autenticado
 *       404:
 *         description: Evento no encontrado
 *       409:
 *         description: Ya estás inscrito en este evento
 *       500:
 *         description: Error del servidor
 */
router.post('/:id/inscribirse', authMiddleware, inscribirse);

/**
 * @swagger
 * /api/eventos/{id}/cancelar-inscripcion:
 *   delete:
 *     summary: Cancelar inscripción a un evento (requiere autenticación)
 *     tags: [Eventos]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del evento
 *     responses:
 *       200:
 *         description: Inscripción cancelada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Inscripción cancelada correctamente
 *       400:
 *         description: ID inválido
 *       401:
 *         description: No autenticado
 *       404:
 *         description: No estás inscrito en este evento
 *       500:
 *         description: Error del servidor
 */
router.delete('/:id/cancelar-inscripcion', authMiddleware, cancelarInscripcionController);

/**
 * @swagger
 * /api/eventos/{id}/inscritos:
 *   get:
 *     summary: Obtener inscritos de un evento
 *     tags: [Eventos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del evento
 *     responses:
 *       200:
 *         description: Lista de inscritos del evento
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
 *                   fecha_inscripcion:
 *                     type: string
 *                     format: date-time
 *       400:
 *         description: ID inválido
 *       500:
 *         description: Error del servidor
 */
router.get('/:id/inscritos', getInscritos);

/**
 * @swagger
 * /api/eventos/{id}/inscritos/count:
 *   get:
 *     summary: Contar inscritos de un evento
 *     tags: [Eventos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del evento
 *     responses:
 *       200:
 *         description: Cantidad de inscritos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   example: 42
 *       400:
 *         description: ID inválido
 *       500:
 *         description: Error del servidor
 */
router.get('/:id/inscritos/count', countInscritos);

export default router;
