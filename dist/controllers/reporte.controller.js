"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReporte = exports.updateReporte = exports.cambiarEstadoReporte = exports.getReporte = exports.getReportesComentario = exports.getReportesPublicacion = exports.getReportesUsuario = exports.getMisReportes = exports.getReportesPorEstado = exports.listReportes = exports.addReporte = void 0;
const reporte_dao_1 = require("../dao/reporte.dao");
// Crear un nuevo reporte
const addReporte = async (req, res) => {
    try {
        const id_usuario_reporta = req.usuario?.id_usuario;
        if (!id_usuario_reporta)
            return res.status(401).json({ message: 'No autenticado' });
        // Validar que se reporte al menos algo (usuario, publicación o comentario)
        if (!req.body.id_usuario_reportado && !req.body.id_publicacion && !req.body.id_comentario) {
            return res.status(400).json({
                message: 'Debe reportar al menos un usuario, publicación o comentario'
            });
        }
        const reporteData = {
            ...req.body,
            id_usuario_reporta
        };
        const reporte = await (0, reporte_dao_1.createReporte)(reporteData);
        res.status(201).json(reporte);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};
exports.addReporte = addReporte;
// Listar todos los reportes (solo admin/moderador)
const listReportes = async (req, res) => {
    try {
        const reportes = await (0, reporte_dao_1.getAllReportes)();
        res.json(reportes);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};
exports.listReportes = listReportes;
// Obtener reportes por estado (solo admin/moderador)
const getReportesPorEstado = async (req, res) => {
    try {
        const { estado } = req.params;
        const estadosValidos = ['pendiente', 'en_revision', 'resuelto', 'rechazado'];
        if (!estadosValidos.includes(estado)) {
            return res.status(400).json({ message: 'Estado inválido' });
        }
        const reportes = await (0, reporte_dao_1.getReportesByEstado)(estado);
        res.json(reportes);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};
exports.getReportesPorEstado = getReportesPorEstado;
// Obtener mis reportes realizados
const getMisReportes = async (req, res) => {
    try {
        const id_usuario = req.usuario?.id_usuario;
        if (!id_usuario)
            return res.status(401).json({ message: 'No autenticado' });
        const reportes = await (0, reporte_dao_1.getReportesByUsuarioReporta)(id_usuario);
        res.json(reportes);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};
exports.getMisReportes = getMisReportes;
// Obtener reportes sobre un usuario (solo admin/moderador)
const getReportesUsuario = async (req, res) => {
    try {
        const id_usuario = Number(req.params.id_usuario);
        if (Number.isNaN(id_usuario))
            return res.status(400).json({ message: 'ID inválido' });
        const reportes = await (0, reporte_dao_1.getReportesByUsuarioReportado)(id_usuario);
        res.json(reportes);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};
exports.getReportesUsuario = getReportesUsuario;
// Obtener reportes sobre una publicación (solo admin/moderador)
const getReportesPublicacion = async (req, res) => {
    try {
        const id_publicacion = Number(req.params.id_publicacion);
        if (Number.isNaN(id_publicacion))
            return res.status(400).json({ message: 'ID inválido' });
        const reportes = await (0, reporte_dao_1.getReportesByPublicacion)(id_publicacion);
        res.json(reportes);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};
exports.getReportesPublicacion = getReportesPublicacion;
// Obtener reportes sobre un comentario (solo admin/moderador)
const getReportesComentario = async (req, res) => {
    try {
        const id_comentario = Number(req.params.id_comentario);
        if (Number.isNaN(id_comentario))
            return res.status(400).json({ message: 'ID inválido' });
        const reportes = await (0, reporte_dao_1.getReportesByComentario)(id_comentario);
        res.json(reportes);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};
exports.getReportesComentario = getReportesComentario;
// Obtener reporte por id
const getReporte = async (req, res) => {
    try {
        const id_reporte = Number(req.params.id);
        if (Number.isNaN(id_reporte))
            return res.status(400).json({ message: 'ID inválido' });
        const reporte = await (0, reporte_dao_1.getReporteById)(id_reporte);
        if (!reporte)
            return res.status(404).json({ message: 'Reporte no encontrado' });
        // Solo admin/moderador o el usuario que hizo el reporte puede verlo
        if (req.usuario?.id_rol !== 1 && reporte.id_usuario_reporta !== req.usuario?.id_usuario) {
            return res.status(403).json({ message: 'No tienes permiso para ver este reporte' });
        }
        res.json(reporte);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};
exports.getReporte = getReporte;
// Actualizar estado de un reporte (solo admin/moderador)
const cambiarEstadoReporte = async (req, res) => {
    try {
        const id_reporte = Number(req.params.id);
        if (Number.isNaN(id_reporte))
            return res.status(400).json({ message: 'ID inválido' });
        const { estado } = req.body;
        const estadosValidos = ['pendiente', 'en_revision', 'resuelto', 'rechazado'];
        if (!estadosValidos.includes(estado)) {
            return res.status(400).json({ message: 'Estado inválido' });
        }
        const reporte = await (0, reporte_dao_1.getReporteById)(id_reporte);
        if (!reporte)
            return res.status(404).json({ message: 'Reporte no encontrado' });
        const updated = await (0, reporte_dao_1.updateReporteEstado)(id_reporte, estado);
        res.json(updated);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};
exports.cambiarEstadoReporte = cambiarEstadoReporte;
// Actualizar un reporte (solo admin)
const updateReporte = async (req, res) => {
    try {
        const id_reporte = Number(req.params.id);
        if (Number.isNaN(id_reporte))
            return res.status(400).json({ message: 'ID inválido' });
        const reporte = await (0, reporte_dao_1.updateReporte)(id_reporte, req.body);
        if (!reporte)
            return res.status(404).json({ message: 'Reporte no encontrado' });
        res.json(reporte);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};
exports.updateReporte = updateReporte;
// Eliminar un reporte (solo admin)
const deleteReporte = async (req, res) => {
    try {
        const id_reporte = Number(req.params.id);
        if (Number.isNaN(id_reporte))
            return res.status(400).json({ message: 'ID inválido' });
        const reporte = await (0, reporte_dao_1.getReporteById)(id_reporte);
        if (!reporte)
            return res.status(404).json({ message: 'Reporte no encontrado' });
        await (0, reporte_dao_1.deleteReporte)(id_reporte);
        res.json({ message: 'Reporte eliminado correctamente' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};
exports.deleteReporte = deleteReporte;
