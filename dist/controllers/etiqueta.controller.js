"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEtiquetaController = exports.updateEtiquetaController = exports.getEtiqueta = exports.listEtiquetas = exports.addEtiqueta = void 0;
const etiqueta_dao_1 = require("../dao/etiqueta.dao");
/**
 * Crear una nueva etiqueta
 */
const addEtiqueta = async (req, res) => {
    try {
        const { nombre } = req.body;
        if (!nombre) {
            res.status(400).json({ message: 'El nombre es obligatorio' });
            return;
        }
        const etiqueta = await (0, etiqueta_dao_1.createEtiqueta)({ nombre });
        res.status(201).json(etiqueta);
    }
    catch (err) {
        console.error('Error en addEtiqueta:', err);
        res.status(500).json({ message: err.message });
    }
};
exports.addEtiqueta = addEtiqueta;
/**
 * Listar todas las etiquetas
 */
const listEtiquetas = async (req, res) => {
    try {
        const etiquetas = await (0, etiqueta_dao_1.getAllEtiquetas)();
        res.json(etiquetas);
    }
    catch (err) {
        console.error('Error en listEtiquetas:', err);
        res.status(500).json({ message: err.message });
    }
};
exports.listEtiquetas = listEtiquetas;
/**
 * Obtener etiqueta por ID
 */
const getEtiqueta = async (req, res) => {
    try {
        const id_etiqueta = Number(req.params.id);
        if (Number.isNaN(id_etiqueta)) {
            res.status(400).json({ message: 'ID inválido' });
            return;
        }
        const etiqueta = await (0, etiqueta_dao_1.getEtiquetaById)(id_etiqueta);
        if (!etiqueta) {
            res.status(404).json({ message: 'Etiqueta no encontrada' });
            return;
        }
        res.json(etiqueta);
    }
    catch (err) {
        console.error('Error en getEtiqueta:', err);
        res.status(500).json({ message: err.message });
    }
};
exports.getEtiqueta = getEtiqueta;
/**
 * Actualizar una etiqueta
 */
const updateEtiquetaController = async (req, res) => {
    try {
        const id_etiqueta = Number(req.params.id);
        if (Number.isNaN(id_etiqueta)) {
            res.status(400).json({ message: 'ID inválido' });
            return;
        }
        const etiqueta = await (0, etiqueta_dao_1.updateEtiqueta)(id_etiqueta, req.body);
        if (!etiqueta) {
            res.status(404).json({ message: 'Etiqueta no encontrada' });
            return;
        }
        res.json(etiqueta);
    }
    catch (err) {
        console.error('Error en updateEtiqueta:', err);
        res.status(500).json({ message: err.message });
    }
};
exports.updateEtiquetaController = updateEtiquetaController;
/**
 * Eliminar una etiqueta
 */
const deleteEtiquetaController = async (req, res) => {
    try {
        const id_etiqueta = Number(req.params.id);
        if (Number.isNaN(id_etiqueta)) {
            res.status(400).json({ message: 'ID inválido' });
            return;
        }
        const etiqueta = await (0, etiqueta_dao_1.deleteEtiqueta)(id_etiqueta);
        if (!etiqueta) {
            res.status(404).json({ message: 'Etiqueta no encontrada' });
            return;
        }
        res.json({ message: 'Etiqueta eliminada correctamente' });
    }
    catch (err) {
        console.error('Error en deleteEtiqueta:', err);
        res.status(500).json({ message: err.message });
    }
};
exports.deleteEtiquetaController = deleteEtiquetaController;
