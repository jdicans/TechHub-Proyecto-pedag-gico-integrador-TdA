"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategoriaController = exports.updateCategoriaController = exports.getCategoria = exports.listCategorias = exports.addCategoria = void 0;
const categoria_dao_1 = require("../dao/categoria.dao");
/**
 * Crear una nueva categoría
 */
const addCategoria = async (req, res) => {
    try {
        const { nombre, descripcion } = req.body;
        if (!nombre) {
            res.status(400).json({ message: 'El nombre es obligatorio' });
            return;
        }
        const categoria = await (0, categoria_dao_1.createCategoria)({ nombre, descripcion });
        res.status(201).json(categoria);
    }
    catch (err) {
        console.error('Error en addCategoria:', err);
        res.status(500).json({ message: err.message });
    }
};
exports.addCategoria = addCategoria;
/**
 * Listar todas las categorías
 */
const listCategorias = async (req, res) => {
    try {
        const categorias = await (0, categoria_dao_1.getAllCategorias)();
        res.json(categorias);
    }
    catch (err) {
        console.error('Error en listCategorias:', err);
        res.status(500).json({ message: err.message });
    }
};
exports.listCategorias = listCategorias;
/**
 * Obtener categoría por ID
 */
const getCategoria = async (req, res) => {
    try {
        const id_categoria = Number(req.params.id);
        if (Number.isNaN(id_categoria)) {
            res.status(400).json({ message: 'ID inválido' });
            return;
        }
        const categoria = await (0, categoria_dao_1.getCategoriaById)(id_categoria);
        if (!categoria) {
            res.status(404).json({ message: 'Categoría no encontrada' });
            return;
        }
        res.json(categoria);
    }
    catch (err) {
        console.error('Error en getCategoria:', err);
        res.status(500).json({ message: err.message });
    }
};
exports.getCategoria = getCategoria;
/**
 * Actualizar una categoría
 */
const updateCategoriaController = async (req, res) => {
    try {
        const id_categoria = Number(req.params.id);
        if (Number.isNaN(id_categoria)) {
            res.status(400).json({ message: 'ID inválido' });
            return;
        }
        const categoria = await (0, categoria_dao_1.updateCategoria)(id_categoria, req.body);
        if (!categoria) {
            res.status(404).json({ message: 'Categoría no encontrada' });
            return;
        }
        res.json(categoria);
    }
    catch (err) {
        console.error('Error en updateCategoria:', err);
        res.status(500).json({ message: err.message });
    }
};
exports.updateCategoriaController = updateCategoriaController;
/**
 * Eliminar una categoría
 */
const deleteCategoriaController = async (req, res) => {
    try {
        const id_categoria = Number(req.params.id);
        if (Number.isNaN(id_categoria)) {
            res.status(400).json({ message: 'ID inválido' });
            return;
        }
        const categoria = await (0, categoria_dao_1.deleteCategoria)(id_categoria);
        if (!categoria) {
            res.status(404).json({ message: 'Categoría no encontrada' });
            return;
        }
        res.json({ message: 'Categoría eliminada correctamente' });
    }
    catch (err) {
        console.error('Error en deleteCategoria:', err);
        res.status(500).json({ message: err.message });
    }
};
exports.deleteCategoriaController = deleteCategoriaController;
