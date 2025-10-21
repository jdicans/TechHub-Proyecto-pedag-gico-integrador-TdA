"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.countInscritos = exports.getInscritos = exports.cancelarInscripcionController = exports.inscribirse = exports.deleteEventoController = exports.updateEventoController = exports.getMyEventos = exports.getEventosByMode = exports.getEventosByCategory = exports.getEvento = exports.listEventosProximos = exports.listEventos = exports.addEvento = void 0;
const evento_dao_1 = require("../dao/evento.dao");
/**
 * Crear un nuevo evento
 */
const addEvento = async (req, res) => {
    try {
        if (!req.usuario) {
            res.status(401).json({ message: 'No autenticado' });
            return;
        }
        const { nombre, descripcion, fecha_evento, hora_evento, lugar, modalidad, id_categoria } = req.body;
        if (!nombre || !fecha_evento) {
            res.status(400).json({ message: 'Faltan campos obligatorios' });
            return;
        }
        const evento = await (0, evento_dao_1.createEvento)({
            nombre,
            descripcion,
            fecha_evento,
            hora_evento,
            lugar,
            modalidad: modalidad || 'presencial',
            id_categoria,
        });
        const eventoCompleto = await (0, evento_dao_1.getEventoById)(evento.id_evento);
        res.status(201).json(eventoCompleto);
    }
    catch (err) {
        console.error('Error en addEvento:', err);
        res.status(500).json({ message: err.message });
    }
};
exports.addEvento = addEvento;
/**
 * Listar todos los eventos
 */
const listEventos = async (req, res) => {
    try {
        const eventos = await (0, evento_dao_1.getAllEventos)();
        res.json(eventos);
    }
    catch (err) {
        console.error('Error en listEventos:', err);
        res.status(500).json({ message: err.message });
    }
};
exports.listEventos = listEventos;
/**
 * Obtener eventos próximos
 */
const listEventosProximos = async (req, res) => {
    try {
        const eventos = await (0, evento_dao_1.getEventosProximos)();
        res.json(eventos);
    }
    catch (err) {
        console.error('Error en listEventosProximos:', err);
        res.status(500).json({ message: err.message });
    }
};
exports.listEventosProximos = listEventosProximos;
/**
 * Obtener evento por ID
 */
const getEvento = async (req, res) => {
    try {
        const id_evento = Number(req.params.id);
        if (Number.isNaN(id_evento)) {
            res.status(400).json({ message: 'ID inválido' });
            return;
        }
        const evento = await (0, evento_dao_1.getEventoById)(id_evento);
        if (!evento) {
            res.status(404).json({ message: 'Evento no encontrado' });
            return;
        }
        res.json(evento);
    }
    catch (err) {
        console.error('Error en getEvento:', err);
        res.status(500).json({ message: err.message });
    }
};
exports.getEvento = getEvento;
/**
 * Obtener eventos por categoría
 */
const getEventosByCategory = async (req, res) => {
    try {
        const id_categoria = Number(req.params.categoryId);
        if (Number.isNaN(id_categoria)) {
            res.status(400).json({ message: 'ID de categoría inválido' });
            return;
        }
        const eventos = await (0, evento_dao_1.getEventosByCategoria)(id_categoria);
        res.json(eventos);
    }
    catch (err) {
        console.error('Error en getEventosByCategory:', err);
        res.status(500).json({ message: err.message });
    }
};
exports.getEventosByCategory = getEventosByCategory;
/**
 * Obtener eventos por modalidad
 */
const getEventosByMode = async (req, res) => {
    try {
        const { modalidad } = req.query;
        if (!modalidad || typeof modalidad !== 'string') {
            res.status(400).json({ message: 'El parámetro modalidad es requerido' });
            return;
        }
        const eventos = await (0, evento_dao_1.getEventosByModalidad)(modalidad);
        res.json(eventos);
    }
    catch (err) {
        console.error('Error en getEventosByMode:', err);
        res.status(500).json({ message: err.message });
    }
};
exports.getEventosByMode = getEventosByMode;
/**
 * Obtener mis eventos inscritos
 */
const getMyEventos = async (req, res) => {
    try {
        if (!req.usuario) {
            res.status(401).json({ message: 'No autenticado' });
            return;
        }
        const eventos = await (0, evento_dao_1.getEventosByUsuario)(req.usuario.id_usuario);
        res.json(eventos);
    }
    catch (err) {
        console.error('Error en getMyEventos:', err);
        res.status(500).json({ message: err.message });
    }
};
exports.getMyEventos = getMyEventos;
/**
 * Actualizar un evento
 */
const updateEventoController = async (req, res) => {
    try {
        if (!req.usuario) {
            res.status(401).json({ message: 'No autenticado' });
            return;
        }
        const id_evento = Number(req.params.id);
        if (Number.isNaN(id_evento)) {
            res.status(400).json({ message: 'ID inválido' });
            return;
        }
        // Solo admins pueden actualizar eventos
        if (req.usuario.id_rol !== 1) {
            res.status(403).json({ message: 'Solo los administradores pueden actualizar eventos' });
            return;
        }
        const { nombre, descripcion, fecha_evento, hora_evento, lugar, modalidad, id_categoria } = req.body;
        await (0, evento_dao_1.updateEvento)(id_evento, {
            nombre,
            descripcion,
            fecha_evento,
            hora_evento,
            lugar,
            modalidad,
            id_categoria,
        });
        const eventoActualizado = await (0, evento_dao_1.getEventoById)(id_evento);
        res.json(eventoActualizado);
    }
    catch (err) {
        console.error('Error en updateEvento:', err);
        res.status(500).json({ message: err.message });
    }
};
exports.updateEventoController = updateEventoController;
/**
 * Eliminar un evento
 */
const deleteEventoController = async (req, res) => {
    try {
        if (!req.usuario) {
            res.status(401).json({ message: 'No autenticado' });
            return;
        }
        const id_evento = Number(req.params.id);
        if (Number.isNaN(id_evento)) {
            res.status(400).json({ message: 'ID inválido' });
            return;
        }
        // Solo admins pueden eliminar eventos
        if (req.usuario.id_rol !== 1) {
            res.status(403).json({ message: 'Solo los administradores pueden eliminar eventos' });
            return;
        }
        await (0, evento_dao_1.deleteEvento)(id_evento);
        res.json({ message: 'Evento eliminado correctamente' });
    }
    catch (err) {
        console.error('Error en deleteEvento:', err);
        res.status(500).json({ message: err.message });
    }
};
exports.deleteEventoController = deleteEventoController;
/**
 * Inscribirse a un evento
 */
const inscribirse = async (req, res) => {
    try {
        if (!req.usuario) {
            res.status(401).json({ message: 'No autenticado' });
            return;
        }
        const id_evento = Number(req.params.id);
        if (Number.isNaN(id_evento)) {
            res.status(400).json({ message: 'ID inválido' });
            return;
        }
        // Verificar que el evento existe
        const evento = await (0, evento_dao_1.getEventoById)(id_evento);
        if (!evento) {
            res.status(404).json({ message: 'Evento no encontrado' });
            return;
        }
        // Verificar que no esté ya inscrito
        const yaInscrito = await (0, evento_dao_1.isUsuarioInscrito)(id_evento, req.usuario.id_usuario);
        if (yaInscrito) {
            res.status(409).json({ message: 'Ya estás inscrito en este evento' });
            return;
        }
        await (0, evento_dao_1.inscribirUsuarioToEvento)(id_evento, req.usuario.id_usuario);
        const eventoActualizado = await (0, evento_dao_1.getEventoById)(id_evento);
        res.status(201).json(eventoActualizado);
    }
    catch (err) {
        console.error('Error en inscribirse:', err);
        res.status(500).json({ message: err.message });
    }
};
exports.inscribirse = inscribirse;
/**
 * Cancelar inscripción
 */
const cancelarInscripcionController = async (req, res) => {
    try {
        if (!req.usuario) {
            res.status(401).json({ message: 'No autenticado' });
            return;
        }
        const id_evento = Number(req.params.id);
        if (Number.isNaN(id_evento)) {
            res.status(400).json({ message: 'ID inválido' });
            return;
        }
        // Verificar que esté inscrito
        const estaInscrito = await (0, evento_dao_1.isUsuarioInscrito)(id_evento, req.usuario.id_usuario);
        if (!estaInscrito) {
            res.status(404).json({ message: 'No estás inscrito en este evento' });
            return;
        }
        await (0, evento_dao_1.cancelarInscripcion)(id_evento, req.usuario.id_usuario);
        res.json({ message: 'Inscripción cancelada correctamente' });
    }
    catch (err) {
        console.error('Error en cancelarInscripcion:', err);
        res.status(500).json({ message: err.message });
    }
};
exports.cancelarInscripcionController = cancelarInscripcionController;
/**
 * Obtener inscritos de un evento
 */
const getInscritos = async (req, res) => {
    try {
        const id_evento = Number(req.params.id);
        if (Number.isNaN(id_evento)) {
            res.status(400).json({ message: 'ID inválido' });
            return;
        }
        const inscritos = await (0, evento_dao_1.getInscritosByEvento)(id_evento);
        res.json(inscritos);
    }
    catch (err) {
        console.error('Error en getInscritos:', err);
        res.status(500).json({ message: err.message });
    }
};
exports.getInscritos = getInscritos;
/**
 * Contar inscritos de un evento
 */
const countInscritos = async (req, res) => {
    try {
        const id_evento = Number(req.params.id);
        if (Number.isNaN(id_evento)) {
            res.status(400).json({ message: 'ID inválido' });
            return;
        }
        const count = await (0, evento_dao_1.countInscritosByEvento)(id_evento);
        res.json({ count });
    }
    catch (err) {
        console.error('Error en countInscritos:', err);
        res.status(500).json({ message: err.message });
    }
};
exports.countInscritos = countInscritos;
