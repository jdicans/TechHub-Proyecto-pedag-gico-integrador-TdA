"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMyLeidasNotificaciones = exports.deleteNotificacion = exports.updateNotificacion = exports.markAllMyNotificacionesAsRead = exports.markNotificacionAsRead = exports.getNotificacion = exports.getMyNotificacionesNoLeidas = exports.getMyNotificaciones = exports.listNotificaciones = exports.addNotificacion = void 0;
const notificacion_dao_1 = require("../dao/notificacion.dao");
// Crear una nueva notificación
const addNotificacion = async (req, res) => {
    try {
        const notificacion = await (0, notificacion_dao_1.createNotificacion)(req.body);
        res.status(201).json(notificacion);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};
exports.addNotificacion = addNotificacion;
// Listar todas las notificaciones (solo admin)
const listNotificaciones = async (req, res) => {
    try {
        const notificaciones = await (0, notificacion_dao_1.getAllNotificaciones)();
        res.json(notificaciones);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};
exports.listNotificaciones = listNotificaciones;
// Obtener notificaciones del usuario autenticado
const getMyNotificaciones = async (req, res) => {
    try {
        const id_usuario = req.usuario?.id_usuario;
        if (!id_usuario)
            return res.status(401).json({ message: 'No autenticado' });
        const notificaciones = await (0, notificacion_dao_1.getNotificacionesByUsuario)(id_usuario);
        res.json(notificaciones);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};
exports.getMyNotificaciones = getMyNotificaciones;
// Obtener notificaciones no leídas del usuario autenticado
const getMyNotificacionesNoLeidas = async (req, res) => {
    try {
        const id_usuario = req.usuario?.id_usuario;
        if (!id_usuario)
            return res.status(401).json({ message: 'No autenticado' });
        const notificaciones = await (0, notificacion_dao_1.getNotificacionesNoLeidasByUsuario)(id_usuario);
        res.json(notificaciones);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};
exports.getMyNotificacionesNoLeidas = getMyNotificacionesNoLeidas;
// Obtener notificación por id
const getNotificacion = async (req, res) => {
    try {
        const id_notificacion = Number(req.params.id);
        if (Number.isNaN(id_notificacion))
            return res.status(400).json({ message: 'ID inválido' });
        const notificacion = await (0, notificacion_dao_1.getNotificacionById)(id_notificacion);
        if (!notificacion)
            return res.status(404).json({ message: 'Notificación no encontrada' });
        // Verificar que la notificación pertenezca al usuario autenticado (o sea admin)
        if (req.usuario?.id_rol !== 1 && notificacion.id_usuario !== req.usuario?.id_usuario) {
            return res.status(403).json({ message: 'No tienes permiso para ver esta notificación' });
        }
        res.json(notificacion);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};
exports.getNotificacion = getNotificacion;
// Marcar notificación como leída
const markNotificacionAsRead = async (req, res) => {
    try {
        const id_notificacion = Number(req.params.id);
        if (Number.isNaN(id_notificacion))
            return res.status(400).json({ message: 'ID inválido' });
        const notificacion = await (0, notificacion_dao_1.getNotificacionById)(id_notificacion);
        if (!notificacion)
            return res.status(404).json({ message: 'Notificación no encontrada' });
        // Verificar que la notificación pertenezca al usuario autenticado
        if (notificacion.id_usuario !== req.usuario?.id_usuario) {
            return res.status(403).json({ message: 'No tienes permiso para modificar esta notificación' });
        }
        const updated = await (0, notificacion_dao_1.markAsRead)(id_notificacion);
        res.json(updated);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};
exports.markNotificacionAsRead = markNotificacionAsRead;
// Marcar todas las notificaciones del usuario como leídas
const markAllMyNotificacionesAsRead = async (req, res) => {
    try {
        const id_usuario = req.usuario?.id_usuario;
        if (!id_usuario)
            return res.status(401).json({ message: 'No autenticado' });
        const updated = await (0, notificacion_dao_1.markAllAsReadByUsuario)(id_usuario);
        res.json({ message: 'Todas las notificaciones marcadas como leídas', count: updated.length });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};
exports.markAllMyNotificacionesAsRead = markAllMyNotificacionesAsRead;
// Actualizar notificación (solo admin)
const updateNotificacion = async (req, res) => {
    try {
        const id_notificacion = Number(req.params.id);
        if (Number.isNaN(id_notificacion))
            return res.status(400).json({ message: 'ID inválido' });
        const notificacion = await (0, notificacion_dao_1.updateNotificacion)(id_notificacion, req.body);
        if (!notificacion)
            return res.status(404).json({ message: 'Notificación no encontrada' });
        res.json(notificacion);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};
exports.updateNotificacion = updateNotificacion;
// Eliminar notificación
const deleteNotificacion = async (req, res) => {
    try {
        const id_notificacion = Number(req.params.id);
        if (Number.isNaN(id_notificacion))
            return res.status(400).json({ message: 'ID inválido' });
        const notificacion = await (0, notificacion_dao_1.getNotificacionById)(id_notificacion);
        if (!notificacion)
            return res.status(404).json({ message: 'Notificación no encontrada' });
        // Verificar que la notificación pertenezca al usuario autenticado (o sea admin)
        if (req.usuario?.id_rol !== 1 && notificacion.id_usuario !== req.usuario?.id_usuario) {
            return res.status(403).json({ message: 'No tienes permiso para eliminar esta notificación' });
        }
        await (0, notificacion_dao_1.deleteNotificacion)(id_notificacion);
        res.json({ message: 'Notificación eliminada correctamente' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};
exports.deleteNotificacion = deleteNotificacion;
// Eliminar todas las notificaciones leídas del usuario
const deleteMyLeidasNotificaciones = async (req, res) => {
    try {
        const id_usuario = req.usuario?.id_usuario;
        if (!id_usuario)
            return res.status(401).json({ message: 'No autenticado' });
        const deleted = await (0, notificacion_dao_1.deleteLeidasByUsuario)(id_usuario);
        res.json({ message: 'Notificaciones leídas eliminadas', count: deleted.length });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};
exports.deleteMyLeidasNotificaciones = deleteMyLeidasNotificaciones;
