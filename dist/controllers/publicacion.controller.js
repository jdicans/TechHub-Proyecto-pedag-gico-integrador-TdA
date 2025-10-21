"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePublicacionController = exports.updatePublicacionController = exports.getMyPublicaciones = exports.getPublicacionesByCategory = exports.getPublicacionesByUser = exports.getPublicacion = exports.listPublicaciones = exports.addPublicacion = void 0;
const publicacion_dao_1 = require("../dao/publicacion.dao");
/**
 * Crear una nueva publicación
 */
const addPublicacion = async (req, res) => {
    try {
        if (!req.usuario) {
            res.status(401).json({ message: 'No autenticado' });
            return;
        }
        const { titulo, contenido, id_categoria, tipo, etiquetas } = req.body;
        if (!titulo || !contenido || !id_categoria) {
            res.status(400).json({ message: 'Faltan campos obligatorios' });
            return;
        }
        // Crear publicación
        const publicacion = await (0, publicacion_dao_1.createPublicacion)({
            titulo,
            contenido,
            id_categoria,
            tipo: tipo || 'articulo',
            id_usuario: req.usuario.id_usuario,
        });
        // Agregar etiquetas si existen
        if (etiquetas && etiquetas.length > 0) {
            await (0, publicacion_dao_1.updateEtiquetasPublicacion)(publicacion.id_publicacion, etiquetas);
        }
        // Obtener publicación con relaciones
        const publicacionCompleta = await (0, publicacion_dao_1.getPublicacionById)(publicacion.id_publicacion);
        res.status(201).json(publicacionCompleta);
    }
    catch (err) {
        console.error('Error en addPublicacion:', err);
        res.status(500).json({ message: err.message });
    }
};
exports.addPublicacion = addPublicacion;
/**
 * Listar todas las publicaciones
 */
const listPublicaciones = async (req, res) => {
    try {
        const publicaciones = await (0, publicacion_dao_1.getAllPublicaciones)();
        res.json(publicaciones);
    }
    catch (err) {
        console.error('Error en listPublicaciones:', err);
        res.status(500).json({ message: err.message });
    }
};
exports.listPublicaciones = listPublicaciones;
/**
 * Obtener publicación por ID
 */
const getPublicacion = async (req, res) => {
    try {
        const id_publicacion = Number(req.params.id);
        if (Number.isNaN(id_publicacion)) {
            res.status(400).json({ message: 'ID inválido' });
            return;
        }
        const publicacion = await (0, publicacion_dao_1.getPublicacionById)(id_publicacion);
        if (!publicacion) {
            res.status(404).json({ message: 'Publicación no encontrada' });
            return;
        }
        res.json(publicacion);
    }
    catch (err) {
        console.error('Error en getPublicacion:', err);
        res.status(500).json({ message: err.message });
    }
};
exports.getPublicacion = getPublicacion;
/**
 * Obtener publicaciones por usuario
 */
const getPublicacionesByUser = async (req, res) => {
    try {
        const id_usuario = Number(req.params.userId);
        if (Number.isNaN(id_usuario)) {
            res.status(400).json({ message: 'ID de usuario inválido' });
            return;
        }
        const publicaciones = await (0, publicacion_dao_1.getPublicacionesByUsuario)(id_usuario);
        res.json(publicaciones);
    }
    catch (err) {
        console.error('Error en getPublicacionesByUser:', err);
        res.status(500).json({ message: err.message });
    }
};
exports.getPublicacionesByUser = getPublicacionesByUser;
/**
 * Obtener publicaciones por categoría
 */
const getPublicacionesByCategory = async (req, res) => {
    try {
        const id_categoria = Number(req.params.categoryId);
        if (Number.isNaN(id_categoria)) {
            res.status(400).json({ message: 'ID de categoría inválido' });
            return;
        }
        const publicaciones = await (0, publicacion_dao_1.getPublicacionesByCategoria)(id_categoria);
        res.json(publicaciones);
    }
    catch (err) {
        console.error('Error en getPublicacionesByCategory:', err);
        res.status(500).json({ message: err.message });
    }
};
exports.getPublicacionesByCategory = getPublicacionesByCategory;
/**
 * Obtener mis publicaciones (usuario autenticado)
 */
const getMyPublicaciones = async (req, res) => {
    try {
        if (!req.usuario) {
            res.status(401).json({ message: 'No autenticado' });
            return;
        }
        const publicaciones = await (0, publicacion_dao_1.getPublicacionesByUsuario)(req.usuario.id_usuario);
        res.json(publicaciones);
    }
    catch (err) {
        console.error('Error en getMyPublicaciones:', err);
        res.status(500).json({ message: err.message });
    }
};
exports.getMyPublicaciones = getMyPublicaciones;
/**
 * Actualizar una publicación
 */
const updatePublicacionController = async (req, res) => {
    try {
        if (!req.usuario) {
            res.status(401).json({ message: 'No autenticado' });
            return;
        }
        const id_publicacion = Number(req.params.id);
        if (Number.isNaN(id_publicacion)) {
            res.status(400).json({ message: 'ID inválido' });
            return;
        }
        // Verificar que la publicación existe y pertenece al usuario
        const publicacionExistente = await (0, publicacion_dao_1.getPublicacionById)(id_publicacion);
        if (!publicacionExistente) {
            res.status(404).json({ message: 'Publicación no encontrada' });
            return;
        }
        // Solo el autor o admin pueden actualizar
        if (publicacionExistente.id_usuario !== req.usuario.id_usuario && req.usuario.id_rol !== 1) {
            res.status(403).json({ message: 'No tienes permisos para actualizar esta publicación' });
            return;
        }
        const { titulo, contenido, id_categoria, tipo, etiquetas } = req.body;
        // Actualizar publicación
        await (0, publicacion_dao_1.updatePublicacion)(id_publicacion, {
            titulo,
            contenido,
            id_categoria,
            tipo,
        });
        // Actualizar etiquetas si se proporcionan
        if (etiquetas !== undefined) {
            await (0, publicacion_dao_1.updateEtiquetasPublicacion)(id_publicacion, etiquetas);
        }
        // Obtener publicación actualizada con relaciones
        const publicacionActualizada = await (0, publicacion_dao_1.getPublicacionById)(id_publicacion);
        res.json(publicacionActualizada);
    }
    catch (err) {
        console.error('Error en updatePublicacion:', err);
        res.status(500).json({ message: err.message });
    }
};
exports.updatePublicacionController = updatePublicacionController;
/**
 * Eliminar una publicación
 */
const deletePublicacionController = async (req, res) => {
    try {
        if (!req.usuario) {
            res.status(401).json({ message: 'No autenticado' });
            return;
        }
        const id_publicacion = Number(req.params.id);
        if (Number.isNaN(id_publicacion)) {
            res.status(400).json({ message: 'ID inválido' });
            return;
        }
        // Verificar que la publicación existe y pertenece al usuario
        const publicacionExistente = await (0, publicacion_dao_1.getPublicacionById)(id_publicacion);
        if (!publicacionExistente) {
            res.status(404).json({ message: 'Publicación no encontrada' });
            return;
        }
        // Solo el autor o admin pueden eliminar
        if (publicacionExistente.id_usuario !== req.usuario.id_usuario && req.usuario.id_rol !== 1) {
            res.status(403).json({ message: 'No tienes permisos para eliminar esta publicación' });
            return;
        }
        await (0, publicacion_dao_1.deletePublicacion)(id_publicacion);
        res.json({ message: 'Publicación eliminada correctamente' });
    }
    catch (err) {
        console.error('Error en deletePublicacion:', err);
        res.status(500).json({ message: err.message });
    }
};
exports.deletePublicacionController = deletePublicacionController;
