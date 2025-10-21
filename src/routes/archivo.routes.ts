import { Router } from 'express';
import {
  addArchivo,
  listArchivos,
  getArchivo,
  getArchivosByPublicacionId,
  getArchivosByMimeType,
  countArchivos,
  getTotalSize,
  updateArchivoController,
  deleteArchivoController,
} from '../controllers/archivo.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Archivo:
 *       type: object
 *       properties:
 *         id_archivo:
 *           type: integer
 *           example: 1
 *         nombre:
 *           type: string
 *           example: documento.pdf
 *         tipo:
 *           type: string
 *           description: MIME type del archivo
 *           example: application/pdf
 *         ruta:
 *           type: string
 *           description: URL o path del archivo
 *           example: https://storage.example.com/files/documento.pdf
 *         tamanio:
 *           type: integer
 *           description: Tamaño en bytes
 *           example: 1024000
 *         fecha_subida:
 *           type: string
 *           format: date-time
 *         id_publicacion:
 *           type: integer
 *           example: 5
 *         publicacion:
 *           type: object
 *           properties:
 *             id_publicacion:
 *               type: integer
 *             titulo:
 *               type: string
 *     CreateArchivo:
 *       type: object
 *       required:
 *         - nombre
 *         - tipo
 *         - ruta
 *         - id_publicacion
 *       properties:
 *         nombre:
 *           type: string
 *           example: documento.pdf
 *         tipo:
 *           type: string
 *           example: application/pdf
 *         ruta:
 *           type: string
 *           example: https://storage.example.com/files/documento.pdf
 *         tamanio:
 *           type: integer
 *           example: 1024000
 *         id_publicacion:
 *           type: integer
 *           example: 5
 */

/**
 * @swagger
 * /api/archivos:
 *   post:
 *     summary: Crear un nuevo archivo (requiere autenticación y ser autor de la publicación)
 *     tags: [Archivos]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateArchivo'
 *     responses:
 *       201:
 *         description: Archivo creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Archivo'
 *       400:
 *         description: Faltan campos obligatorios
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No tienes permisos
 *       404:
 *         description: Publicación no encontrada
 *       500:
 *         description: Error del servidor
 */
router.post('/', authMiddleware, addArchivo);

/**
 * @swagger
 * /api/archivos:
 *   get:
 *     summary: Obtener todos los archivos
 *     tags: [Archivos]
 *     responses:
 *       200:
 *         description: Lista de archivos con relaciones
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Archivo'
 *       500:
 *         description: Error del servidor
 */
router.get('/', listArchivos);

/**
 * @swagger
 * /api/archivos/tipo:
 *   get:
 *     summary: Obtener archivos por tipo MIME
 *     tags: [Archivos]
 *     parameters:
 *       - in: query
 *         name: tipo
 *         required: true
 *         schema:
 *           type: string
 *         description: Tipo MIME del archivo (ej. application/pdf, image/png)
 *         example: application/pdf
 *     responses:
 *       200:
 *         description: Lista de archivos del tipo especificado
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Archivo'
 *       400:
 *         description: El parámetro tipo es requerido
 *       500:
 *         description: Error del servidor
 */
router.get('/tipo', getArchivosByMimeType);

/**
 * @swagger
 * /api/archivos/publicacion/{publicacionId}:
 *   get:
 *     summary: Obtener archivos por publicación
 *     tags: [Archivos]
 *     parameters:
 *       - in: path
 *         name: publicacionId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la publicación
 *     responses:
 *       200:
 *         description: Lista de archivos de la publicación
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Archivo'
 *       400:
 *         description: ID de publicación inválido
 *       500:
 *         description: Error del servidor
 */
router.get('/publicacion/:publicacionId', getArchivosByPublicacionId);

/**
 * @swagger
 * /api/archivos/publicacion/{publicacionId}/count:
 *   get:
 *     summary: Contar archivos de una publicación
 *     tags: [Archivos]
 *     parameters:
 *       - in: path
 *         name: publicacionId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la publicación
 *     responses:
 *       200:
 *         description: Cantidad de archivos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   example: 5
 *       400:
 *         description: ID de publicación inválido
 *       500:
 *         description: Error del servidor
 */
router.get('/publicacion/:publicacionId/count', countArchivos);

/**
 * @swagger
 * /api/archivos/publicacion/{publicacionId}/size:
 *   get:
 *     summary: Obtener tamaño total de archivos de una publicación
 *     tags: [Archivos]
 *     parameters:
 *       - in: path
 *         name: publicacionId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la publicación
 *     responses:
 *       200:
 *         description: Tamaño total de archivos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalSize:
 *                   type: integer
 *                   description: Tamaño total en bytes
 *                   example: 10240000
 *                 totalSizeMB:
 *                   type: string
 *                   description: Tamaño total en MB
 *                   example: "9.77"
 *       400:
 *         description: ID de publicación inválido
 *       500:
 *         description: Error del servidor
 */
router.get('/publicacion/:publicacionId/size', getTotalSize);

/**
 * @swagger
 * /api/archivos/{id}:
 *   get:
 *     summary: Obtener archivo por ID
 *     tags: [Archivos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del archivo
 *     responses:
 *       200:
 *         description: Archivo encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Archivo'
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Archivo no encontrado
 *       500:
 *         description: Error del servidor
 */
router.get('/:id', getArchivo);

/**
 * @swagger
 * /api/archivos/{id}:
 *   put:
 *     summary: Actualizar archivo (solo autor de la publicación o admin)
 *     tags: [Archivos]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del archivo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               tipo:
 *                 type: string
 *               ruta:
 *                 type: string
 *               tamanio:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Archivo actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Archivo'
 *       400:
 *         description: ID inválido
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No tienes permisos
 *       404:
 *         description: Archivo no encontrado
 *       500:
 *         description: Error del servidor
 */
router.put('/:id', authMiddleware, updateArchivoController);

/**
 * @swagger
 * /api/archivos/{id}:
 *   delete:
 *     summary: Eliminar archivo (solo autor de la publicación o admin)
 *     tags: [Archivos]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del archivo
 *     responses:
 *       200:
 *         description: Archivo eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Archivo eliminado correctamente
 *       400:
 *         description: ID inválido
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No tienes permisos
 *       404:
 *         description: Archivo no encontrado
 *       500:
 *         description: Error del servidor
 */
router.delete('/:id', authMiddleware, deleteArchivoController);

export default router;
