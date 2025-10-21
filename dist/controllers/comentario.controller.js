"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteComentarioController = exports.updateComentarioController = exports.countComentarios = exports.getMyComentarios = exports.getComentariosByUserId = exports.getComentariosByPublicacionId = exports.getComentario = exports.listComentarios = exports.addComentario = void 0;
const comentario_dao_1 = require("../dao/comentario.dao");
/**
 * Crear un nuevo comentario
 */
const addComentario = async (req, res) => {
    try {
        if (!req.usuario) {
            res.status(401).json({ message: 'No autenticado' });
            return;
        }
        const { contenido, id_publicacion } = req.body;
        if (!contenido || !id_publicacion) {
            res.status(400).json({ message: 'Faltan campos obligatorios' });
            return;
        }
        const comentario = await (0, comentario_dao_1.createComentario)({
            contenido,
            id_publicacion,
            id_usuario: req.usuario.id_usuario,
        });
        // Obtener comentario con información del usuario
        const comentarioCompleto = await (0, comentario_dao_1.getComentarioById)(comentario.id_comentario);
        res.status(201).json(comentarioCompleto);
    }
    catch (err) {
        console.error('Error en addComentario:', err);
        res.status(500).json({ message: err.message });
    }
};
exports.addComentario = addComentario;
/**
 * Listar todos los comentarios
 */
const listComentarios = async (req, res) => {
    try {
        const comentarios = await (0, comentario_dao_1.getAllComentarios)();
        res.json(comentarios);
    }
    catch (err) {
        console.error('Error en listComentarios:', err);
        res.status(500).json({ message: err.message });
    }
};
exports.listComentarios = listComentarios;
/**
 * Obtener comentario por ID
 */
const getComentario = async (req, res) => {
    try {
        const id_comentario = Number(req.params.id);
        if (Number.isNaN(id_comentario)) {
            res.status(400).json({ message: 'ID inválido' });
            return;
        }
        const comentario = await (0, comentario_dao_1.getComentarioById)(id_comentario);
        if (!comentario) {
            res.status(404).json({ message: 'Comentario no encontrado' });
            return;
        }
        res.json(comentario);
    }
    catch (err) {
        console.error('Error en getComentario:', err);
        res.status(500).json({ message: err.message });
    }
};
exports.getComentario = getComentario;
/**
 * Obtener comentarios por publicación
 */
const getComentariosByPublicacionId = async (req, res) => {
    try {
        const id_publicacion = Number(req.params.publicacionId);
        if (Number.isNaN(id_publicacion)) {
            res.status(400).json({ message: 'ID de publicación inválido' });
            return;
        }
        const comentarios = await (0, comentario_dao_1.getComentariosByPublicacion)(id_publicacion);
        res.json(comentarios);
    }
    catch (err) {
        console.error('Error en getComentariosByPublicacionId:', err);
        res.status(500).json({ message: err.message });
    }
};
exports.getComentariosByPublicacionId = getComentariosByPublicacionId;
/**
 * Obtener comentarios por usuario
 */
const getComentariosByUserId = async (req, res) => {
    try {
        const id_usuario = Number(req.params.userId);
        if (Number.isNaN(id_usuario)) {
            res.status(400).json({ message: 'ID de usuario inválido' });
            return;
        }
        const comentarios = await (0, comentario_dao_1.getComentariosByUsuario)(id_usuario);
        res.json(comentarios);
    }
    catch (err) {
        console.error('Error en getComentariosByUserId:', err);
        res.status(500).json({ message: err.message });
    }
};
exports.getComentariosByUserId = getComentariosByUserId;
/**
 * Obtener mis comentarios (usuario autenticado)
 */
const getMyComentarios = async (req, res) => {
    try {
        if (!req.usuario) {
            res.status(401).json({ message: 'No autenticado' });
            return;
        }
        const comentarios = await (0, comentario_dao_1.getComentariosByUsuario)(req.usuario.id_usuario);
        res.json(comentarios);
    }
    catch (err) {
        console.error('Error en getMyComentarios:', err);
        res.status(500).json({ message: err.message });
    }
};
exports.getMyComentarios = getMyComentarios;
/**
 * Contar comentarios de una publicación
 */
const countComentarios = async (req, res) => {
    try {
        const id_publicacion = Number(req.params.publicacionId);
        if (Number.isNaN(id_publicacion)) {
            res.status(400).json({ message: 'ID de publicación inválido' });
            return;
        }
        const count = await (0, comentario_dao_1.countComentariosByPublicacion)(id_publicacion);
        res.json({ count });
    }
    catch (err) {
        console.error('Error en countComentarios:', err);
        res.status(500).json({ message: err.message });
    }
};
exports.countComentarios = countComentarios;
/**
 * Actualizar un comentario
 */
const updateComentarioController = async (req, res) => {
    try {
        if (!req.usuario) {
            res.status(401).json({ message: 'No autenticado' });
            return;
        }
        const id_comentario = Number(req.params.id);
        if (Number.isNaN(id_comentario)) {
            res.status(400).json({ message: 'ID inválido' });
            return;
        }
        // Verificar que el comentario existe y pertenece al usuario
        const comentarioExistente = await (0, comentario_dao_1.getComentarioById)(id_comentario);
        if (!comentarioExistente) {
            res.status(404).json({ message: 'Comentario no encontrado' });
            return;
        }
        // Solo el autor o admin pueden actualizar
        if (comentarioExistente.id_usuario !== req.usuario.id_usuario && req.usuario.id_rol !== 1) {
            res.status(403).json({ message: 'No tienes permisos para actualizar este comentario' });
            return;
        }
        const { contenido } = req.body;
        if (!contenido) {
            res.status(400).json({ message: 'El contenido es obligatorio' });
            return;
        }
        await (0, comentario_dao_1.updateComentario)(id_comentario, { contenido });
        // Obtener comentario actualizado
        const comentarioActualizado = await (0, comentario_dao_1.getComentarioById)(id_comentario);
        res.json(comentarioActualizado);
    }
    catch (err) {
        console.error('Error en updateComentario:', err);
        res.status(500).json({ message: err.message });
    }
};
exports.updateComentarioController = updateComentarioController;
/**
 * Eliminar un comentario
 */
const deleteComentarioController = async (req, res) => {
    try {
        if (!req.usuario) {
            res.status(401).json({ message: 'No autenticado' });
            return;
        }
        const id_comentario = Number(req.params.id);
        if (Number.isNaN(id_comentario)) {
            res.status(400).json({ message: 'ID inválido' });
            return;
        }
        // Verificar que el comentario existe y pertenece al usuario
        const comentarioExistente = await (0, comentario_dao_1.getComentarioById)(id_comentario);
        if (!comentarioExistente) {
            res.status(404).json({ message: 'Comentario no encontrado' });
            return;
        }
        // Solo el autor o admin pueden eliminar
        if (comentarioExistente.id_usuario !== req.usuario.id_usuario && req.usuario.id_rol !== 1) {
            res.status(403).json({ message: 'No tienes permisos para eliminar este comentario' });
            return;
        }
        await (0, comentario_dao_1.deleteComentario)(id_comentario);
        res.json({ message: 'Comentario eliminado correctamente' });
    }
    catch (err) {
        console.error('Error en deleteComentario:', err);
        res.status(500).json({ message: err.message });
    }
};
exports.deleteComentarioController = deleteComentarioController;
