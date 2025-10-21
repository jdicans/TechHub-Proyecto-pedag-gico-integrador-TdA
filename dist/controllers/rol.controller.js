"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRol = exports.updateRol = exports.getRol = exports.listRoles = exports.addRol = void 0;
const rol_dao_1 = require("../dao/rol.dao");
const addRol = async (req, res) => {
    try {
        const rol = await (0, rol_dao_1.createRol)(req.body);
        res.status(201).json(rol);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};
exports.addRol = addRol;
const listRoles = async (req, res) => {
    try {
        const roles = await (0, rol_dao_1.getAllRoles)();
        res.json(roles);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};
exports.listRoles = listRoles;
const getRol = async (req, res) => {
    try {
        const id_rol = Number(req.params.id);
        if (Number.isNaN(id_rol))
            return res.status(400).json({ message: 'ID inválido' });
        const rol = await (0, rol_dao_1.getRolById)(id_rol);
        if (!rol)
            return res.status(404).json({ message: 'Rol no encontrado' });
        res.json(rol);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};
exports.getRol = getRol;
const updateRol = async (req, res) => {
    try {
        const id_rol = Number(req.params.id);
        if (Number.isNaN(id_rol))
            return res.status(400).json({ message: 'ID inválido' });
        const rol = await (0, rol_dao_1.updateRol)(id_rol, req.body);
        if (!rol)
            return res.status(404).json({ message: 'Rol no encontrado' });
        res.json(rol);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};
exports.updateRol = updateRol;
const deleteRol = async (req, res) => {
    try {
        const id_rol = Number(req.params.id);
        if (Number.isNaN(id_rol))
            return res.status(400).json({ message: 'ID inválido' });
        const rol = await (0, rol_dao_1.deleteRol)(id_rol);
        if (!rol)
            return res.status(404).json({ message: 'Rol no encontrado' });
        res.json({ message: 'Rol eliminado correctamente' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};
exports.deleteRol = deleteRol;
