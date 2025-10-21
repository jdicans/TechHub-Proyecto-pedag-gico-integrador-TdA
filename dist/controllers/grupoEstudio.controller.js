"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.countMiembros = exports.getMiembros = exports.updateMiembroRolController = exports.removeMiembro = exports.addMiembro = exports.deleteGrupoEstudioController = exports.updateGrupoEstudioController = exports.getGruposByUser = exports.getMyGrupos = exports.getGrupoEstudio = exports.listGruposEstudio = exports.addGrupoEstudio = void 0;
const grupoEstudio_dao_1 = require("../dao/grupoEstudio.dao");
/**
 * Crear un nuevo grupo de estudio
 */
const addGrupoEstudio = async (req, res) => {
    try {
        if (!req.usuario) {
            res.status(401).json({ message: 'No autenticado' });
            return;
        }
        const { nombre, descripcion } = req.body;
        if (!nombre) {
            res.status(400).json({ message: 'El nombre es obligatorio' });
            return;
        }
        // Crear grupo
        const grupo = await (0, grupoEstudio_dao_1.createGrupoEstudio)({ nombre, descripcion });
        // Agregar al usuario creador como administrador del grupo
        await (0, grupoEstudio_dao_1.addMiembroToGrupo)(grupo.id_grupo, req.usuario.id_usuario, 'administrador');
        // Obtener grupo completo con miembros
        const grupoCompleto = await (0, grupoEstudio_dao_1.getGrupoEstudioById)(grupo.id_grupo);
        res.status(201).json(grupoCompleto);
    }
    catch (err) {
        console.error('Error en addGrupoEstudio:', err);
        res.status(500).json({ message: err.message });
    }
};
exports.addGrupoEstudio = addGrupoEstudio;
/**
 * Listar todos los grupos de estudio
 */
const listGruposEstudio = async (req, res) => {
    try {
        const grupos = await (0, grupoEstudio_dao_1.getAllGruposEstudio)();
        res.json(grupos);
    }
    catch (err) {
        console.error('Error en listGruposEstudio:', err);
        res.status(500).json({ message: err.message });
    }
};
exports.listGruposEstudio = listGruposEstudio;
/**
 * Obtener grupo de estudio por ID
 */
const getGrupoEstudio = async (req, res) => {
    try {
        const id_grupo = Number(req.params.id);
        if (Number.isNaN(id_grupo)) {
            res.status(400).json({ message: 'ID inválido' });
            return;
        }
        const grupo = await (0, grupoEstudio_dao_1.getGrupoEstudioById)(id_grupo);
        if (!grupo) {
            res.status(404).json({ message: 'Grupo no encontrado' });
            return;
        }
        res.json(grupo);
    }
    catch (err) {
        console.error('Error en getGrupoEstudio:', err);
        res.status(500).json({ message: err.message });
    }
};
exports.getGrupoEstudio = getGrupoEstudio;
/**
 * Obtener mis grupos (usuario autenticado)
 */
const getMyGrupos = async (req, res) => {
    try {
        if (!req.usuario) {
            res.status(401).json({ message: 'No autenticado' });
            return;
        }
        const grupos = await (0, grupoEstudio_dao_1.getGruposByUsuario)(req.usuario.id_usuario);
        res.json(grupos);
    }
    catch (err) {
        console.error('Error en getMyGrupos:', err);
        res.status(500).json({ message: err.message });
    }
};
exports.getMyGrupos = getMyGrupos;
/**
 * Obtener grupos por usuario
 */
const getGruposByUser = async (req, res) => {
    try {
        const id_usuario = Number(req.params.userId);
        if (Number.isNaN(id_usuario)) {
            res.status(400).json({ message: 'ID de usuario inválido' });
            return;
        }
        const grupos = await (0, grupoEstudio_dao_1.getGruposByUsuario)(id_usuario);
        res.json(grupos);
    }
    catch (err) {
        console.error('Error en getGruposByUser:', err);
        res.status(500).json({ message: err.message });
    }
};
exports.getGruposByUser = getGruposByUser;
/**
 * Actualizar un grupo de estudio
 */
const updateGrupoEstudioController = async (req, res) => {
    try {
        if (!req.usuario) {
            res.status(401).json({ message: 'No autenticado' });
            return;
        }
        const id_grupo = Number(req.params.id);
        if (Number.isNaN(id_grupo)) {
            res.status(400).json({ message: 'ID inválido' });
            return;
        }
        // Verificar que el usuario es administrador del grupo o admin general
        const rolUsuario = await (0, grupoEstudio_dao_1.getMiembroRol)(id_grupo, req.usuario.id_usuario);
        if (rolUsuario !== 'administrador' && req.usuario.id_rol !== 1) {
            res.status(403).json({ message: 'Solo los administradores del grupo pueden actualizarlo' });
            return;
        }
        const { nombre, descripcion } = req.body;
        await (0, grupoEstudio_dao_1.updateGrupoEstudio)(id_grupo, { nombre, descripcion });
        const grupoActualizado = await (0, grupoEstudio_dao_1.getGrupoEstudioById)(id_grupo);
        res.json(grupoActualizado);
    }
    catch (err) {
        console.error('Error en updateGrupoEstudio:', err);
        res.status(500).json({ message: err.message });
    }
};
exports.updateGrupoEstudioController = updateGrupoEstudioController;
/**
 * Eliminar un grupo de estudio
 */
const deleteGrupoEstudioController = async (req, res) => {
    try {
        if (!req.usuario) {
            res.status(401).json({ message: 'No autenticado' });
            return;
        }
        const id_grupo = Number(req.params.id);
        if (Number.isNaN(id_grupo)) {
            res.status(400).json({ message: 'ID inválido' });
            return;
        }
        // Verificar que el usuario es administrador del grupo o admin general
        const rolUsuario = await (0, grupoEstudio_dao_1.getMiembroRol)(id_grupo, req.usuario.id_usuario);
        if (rolUsuario !== 'administrador' && req.usuario.id_rol !== 1) {
            res.status(403).json({ message: 'Solo los administradores del grupo pueden eliminarlo' });
            return;
        }
        await (0, grupoEstudio_dao_1.deleteGrupoEstudio)(id_grupo);
        res.json({ message: 'Grupo eliminado correctamente' });
    }
    catch (err) {
        console.error('Error en deleteGrupoEstudio:', err);
        res.status(500).json({ message: err.message });
    }
};
exports.deleteGrupoEstudioController = deleteGrupoEstudioController;
/**
 * Agregar miembro a un grupo
 */
const addMiembro = async (req, res) => {
    try {
        if (!req.usuario) {
            res.status(401).json({ message: 'No autenticado' });
            return;
        }
        const id_grupo = Number(req.params.id);
        const { id_usuario, rol_grupo } = req.body;
        if (Number.isNaN(id_grupo) || !id_usuario) {
            res.status(400).json({ message: 'Datos inválidos' });
            return;
        }
        // Verificar que el grupo existe
        const grupo = await (0, grupoEstudio_dao_1.getGrupoEstudioById)(id_grupo);
        if (!grupo) {
            res.status(404).json({ message: 'Grupo no encontrado' });
            return;
        }
        // Verificar que el usuario que agrega es administrador del grupo
        const rolUsuarioActual = await (0, grupoEstudio_dao_1.getMiembroRol)(id_grupo, req.usuario.id_usuario);
        if (rolUsuarioActual !== 'administrador' && req.usuario.id_rol !== 1) {
            res.status(403).json({ message: 'Solo los administradores pueden agregar miembros' });
            return;
        }
        // Verificar que el usuario no sea ya miembro
        const esMiembro = await (0, grupoEstudio_dao_1.isMiembroOfGrupo)(id_grupo, id_usuario);
        if (esMiembro) {
            res.status(409).json({ message: 'El usuario ya es miembro del grupo' });
            return;
        }
        await (0, grupoEstudio_dao_1.addMiembroToGrupo)(id_grupo, id_usuario, rol_grupo || 'miembro');
        const grupoActualizado = await (0, grupoEstudio_dao_1.getGrupoEstudioById)(id_grupo);
        res.status(201).json(grupoActualizado);
    }
    catch (err) {
        console.error('Error en addMiembro:', err);
        res.status(500).json({ message: err.message });
    }
};
exports.addMiembro = addMiembro;
/**
 * Remover miembro de un grupo
 */
const removeMiembro = async (req, res) => {
    try {
        if (!req.usuario) {
            res.status(401).json({ message: 'No autenticado' });
            return;
        }
        const id_grupo = Number(req.params.id);
        const id_usuario = Number(req.params.userId);
        if (Number.isNaN(id_grupo) || Number.isNaN(id_usuario)) {
            res.status(400).json({ message: 'IDs inválidos' });
            return;
        }
        // Verificar que el usuario que remueve es administrador o se está removiendo a sí mismo
        const rolUsuarioActual = await (0, grupoEstudio_dao_1.getMiembroRol)(id_grupo, req.usuario.id_usuario);
        if (rolUsuarioActual !== 'administrador' &&
            req.usuario.id_usuario !== id_usuario &&
            req.usuario.id_rol !== 1) {
            res.status(403).json({ message: 'No tienes permisos para remover este miembro' });
            return;
        }
        await (0, grupoEstudio_dao_1.removeMiembroFromGrupo)(id_grupo, id_usuario);
        res.json({ message: 'Miembro removido correctamente' });
    }
    catch (err) {
        console.error('Error en removeMiembro:', err);
        res.status(500).json({ message: err.message });
    }
};
exports.removeMiembro = removeMiembro;
/**
 * Actualizar rol de un miembro
 */
const updateMiembroRolController = async (req, res) => {
    try {
        if (!req.usuario) {
            res.status(401).json({ message: 'No autenticado' });
            return;
        }
        const id_grupo = Number(req.params.id);
        const id_usuario = Number(req.params.userId);
        const { rol_grupo } = req.body;
        if (Number.isNaN(id_grupo) || Number.isNaN(id_usuario) || !rol_grupo) {
            res.status(400).json({ message: 'Datos inválidos' });
            return;
        }
        // Verificar que el usuario que actualiza es administrador
        const rolUsuarioActual = await (0, grupoEstudio_dao_1.getMiembroRol)(id_grupo, req.usuario.id_usuario);
        if (rolUsuarioActual !== 'administrador' && req.usuario.id_rol !== 1) {
            res.status(403).json({ message: 'Solo los administradores pueden cambiar roles' });
            return;
        }
        await (0, grupoEstudio_dao_1.updateMiembroRol)(id_grupo, id_usuario, rol_grupo);
        const grupoActualizado = await (0, grupoEstudio_dao_1.getGrupoEstudioById)(id_grupo);
        res.json(grupoActualizado);
    }
    catch (err) {
        console.error('Error en updateMiembroRol:', err);
        res.status(500).json({ message: err.message });
    }
};
exports.updateMiembroRolController = updateMiembroRolController;
/**
 * Obtener miembros de un grupo
 */
const getMiembros = async (req, res) => {
    try {
        const id_grupo = Number(req.params.id);
        if (Number.isNaN(id_grupo)) {
            res.status(400).json({ message: 'ID inválido' });
            return;
        }
        const miembros = await (0, grupoEstudio_dao_1.getMiembrosByGrupo)(id_grupo);
        res.json(miembros);
    }
    catch (err) {
        console.error('Error en getMiembros:', err);
        res.status(500).json({ message: err.message });
    }
};
exports.getMiembros = getMiembros;
/**
 * Contar miembros de un grupo
 */
const countMiembros = async (req, res) => {
    try {
        const id_grupo = Number(req.params.id);
        if (Number.isNaN(id_grupo)) {
            res.status(400).json({ message: 'ID inválido' });
            return;
        }
        const count = await (0, grupoEstudio_dao_1.countMiembrosByGrupo)(id_grupo);
        res.json({ count });
    }
    catch (err) {
        console.error('Error en countMiembros:', err);
        res.status(500).json({ message: err.message });
    }
};
exports.countMiembros = countMiembros;
