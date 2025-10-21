"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteArchivoController = exports.updateArchivoController = exports.getTotalSize = exports.countArchivos = exports.getArchivosByMimeType = exports.getArchivosByPublicacionId = exports.getArchivo = exports.listArchivos = exports.addArchivo = void 0;
const archivo_dao_1 = require("../dao/archivo.dao");
const publicacion_dao_1 = require("../dao/publicacion.dao");
/**
 * Crear un nuevo archivo
 */
const addArchivo = async (req, res) => {
    try {
        if (!req.usuario) {
            res.status(401).json({ message: 'No autenticado' });
            return;
        }
        const { nombre, tipo, ruta, tamanio, id_publicacion } = req.body;
        if (!nombre || !tipo || !ruta || !id_publicacion) {
            res.status(400).json({ message: 'Faltan campos obligatorios' });
            return;
        }
        // Verificar que la publicación existe
        const publicacion = await (0, publicacion_dao_1.getPublicacionById)(id_publicacion);
        if (!publicacion) {
            res.status(404).json({ message: 'Publicación no encontrada' });
            return;
        }
        // Verificar que el usuario es el autor de la publicación o admin
        if (publicacion.id_usuario !== req.usuario.id_usuario && req.usuario.id_rol !== 1) {
            res.status(403).json({ message: 'No tienes permisos para agregar archivos a esta publicación' });
            return;
        }
        const archivo = await (0, archivo_dao_1.createArchivo)({
            nombre,
            tipo,
            ruta,
            tamanio,
            id_publicacion,
        });
        // Obtener archivo con relaciones
        const archivoCompleto = await (0, archivo_dao_1.getArchivoById)(archivo.id_archivo);
        res.status(201).json(archivoCompleto);
    }
    catch (err) {
        console.error('Error en addArchivo:', err);
        res.status(500).json({ message: err.message });
    }
};
exports.addArchivo = addArchivo;
/**
 * Listar todos los archivos
 */
const listArchivos = async (req, res) => {
    try {
        const archivos = await (0, archivo_dao_1.getAllArchivos)();
        res.json(archivos);
    }
    catch (err) {
        console.error('Error en listArchivos:', err);
        res.status(500).json({ message: err.message });
    }
};
exports.listArchivos = listArchivos;
/**
 * Obtener archivo por ID
 */
const getArchivo = async (req, res) => {
    try {
        const id_archivo = Number(req.params.id);
        if (Number.isNaN(id_archivo)) {
            res.status(400).json({ message: 'ID inválido' });
            return;
        }
        const archivo = await (0, archivo_dao_1.getArchivoById)(id_archivo);
        if (!archivo) {
            res.status(404).json({ message: 'Archivo no encontrado' });
            return;
        }
        res.json(archivo);
    }
    catch (err) {
        console.error('Error en getArchivo:', err);
        res.status(500).json({ message: err.message });
    }
};
exports.getArchivo = getArchivo;
/**
 * Obtener archivos por publicación
 */
const getArchivosByPublicacionId = async (req, res) => {
    try {
        const id_publicacion = Number(req.params.publicacionId);
        if (Number.isNaN(id_publicacion)) {
            res.status(400).json({ message: 'ID de publicación inválido' });
            return;
        }
        const archivos = await (0, archivo_dao_1.getArchivosByPublicacion)(id_publicacion);
        res.json(archivos);
    }
    catch (err) {
        console.error('Error en getArchivosByPublicacionId:', err);
        res.status(500).json({ message: err.message });
    }
};
exports.getArchivosByPublicacionId = getArchivosByPublicacionId;
/**
 * Obtener archivos por tipo MIME
 */
const getArchivosByMimeType = async (req, res) => {
    try {
        const { tipo } = req.query;
        if (!tipo || typeof tipo !== 'string') {
            res.status(400).json({ message: 'El parámetro tipo es requerido' });
            return;
        }
        const archivos = await (0, archivo_dao_1.getArchivosByTipo)(tipo);
        res.json(archivos);
    }
    catch (err) {
        console.error('Error en getArchivosByMimeType:', err);
        res.status(500).json({ message: err.message });
    }
};
exports.getArchivosByMimeType = getArchivosByMimeType;
/**
 * Contar archivos de una publicación
 */
const countArchivos = async (req, res) => {
    try {
        const id_publicacion = Number(req.params.publicacionId);
        if (Number.isNaN(id_publicacion)) {
            res.status(400).json({ message: 'ID de publicación inválido' });
            return;
        }
        const count = await (0, archivo_dao_1.countArchivosByPublicacion)(id_publicacion);
        res.json({ count });
    }
    catch (err) {
        console.error('Error en countArchivos:', err);
        res.status(500).json({ message: err.message });
    }
};
exports.countArchivos = countArchivos;
/**
 * Obtener tamaño total de archivos de una publicación
 */
const getTotalSize = async (req, res) => {
    try {
        const id_publicacion = Number(req.params.publicacionId);
        if (Number.isNaN(id_publicacion)) {
            res.status(400).json({ message: 'ID de publicación inválido' });
            return;
        }
        const totalSize = await (0, archivo_dao_1.getTotalSizeByPublicacion)(id_publicacion);
        res.json({ totalSize, totalSizeMB: (totalSize / (1024 * 1024)).toFixed(2) });
    }
    catch (err) {
        console.error('Error en getTotalSize:', err);
        res.status(500).json({ message: err.message });
    }
};
exports.getTotalSize = getTotalSize;
/**
 * Actualizar un archivo
 */
const updateArchivoController = async (req, res) => {
    try {
        if (!req.usuario) {
            res.status(401).json({ message: 'No autenticado' });
            return;
        }
        const id_archivo = Number(req.params.id);
        if (Number.isNaN(id_archivo)) {
            res.status(400).json({ message: 'ID inválido' });
            return;
        }
        // Verificar que el archivo existe
        const archivoExistente = await (0, archivo_dao_1.getArchivoById)(id_archivo);
        if (!archivoExistente) {
            res.status(404).json({ message: 'Archivo no encontrado' });
            return;
        }
        // Verificar que el usuario es el autor de la publicación o admin
        const publicacion = await (0, publicacion_dao_1.getPublicacionById)(archivoExistente.id_publicacion);
        if (!publicacion) {
            res.status(404).json({ message: 'Publicación no encontrada' });
            return;
        }
        if (publicacion.id_usuario !== req.usuario.id_usuario && req.usuario.id_rol !== 1) {
            res.status(403).json({ message: 'No tienes permisos para actualizar este archivo' });
            return;
        }
        const { nombre, tipo, ruta, tamanio } = req.body;
        await (0, archivo_dao_1.updateArchivo)(id_archivo, {
            nombre,
            tipo,
            ruta,
            tamanio,
        });
        // Obtener archivo actualizado
        const archivoActualizado = await (0, archivo_dao_1.getArchivoById)(id_archivo);
        res.json(archivoActualizado);
    }
    catch (err) {
        console.error('Error en updateArchivo:', err);
        res.status(500).json({ message: err.message });
    }
};
exports.updateArchivoController = updateArchivoController;
/**
 * Eliminar un archivo
 */
const deleteArchivoController = async (req, res) => {
    try {
        if (!req.usuario) {
            res.status(401).json({ message: 'No autenticado' });
            return;
        }
        const id_archivo = Number(req.params.id);
        if (Number.isNaN(id_archivo)) {
            res.status(400).json({ message: 'ID inválido' });
            return;
        }
        // Verificar que el archivo existe
        const archivoExistente = await (0, archivo_dao_1.getArchivoById)(id_archivo);
        if (!archivoExistente) {
            res.status(404).json({ message: 'Archivo no encontrado' });
            return;
        }
        // Verificar que el usuario es el autor de la publicación o admin
        const publicacion = await (0, publicacion_dao_1.getPublicacionById)(archivoExistente.id_publicacion);
        if (!publicacion) {
            res.status(404).json({ message: 'Publicación no encontrada' });
            return;
        }
        if (publicacion.id_usuario !== req.usuario.id_usuario && req.usuario.id_rol !== 1) {
            res.status(403).json({ message: 'No tienes permisos para eliminar este archivo' });
            return;
        }
        await (0, archivo_dao_1.deleteArchivo)(id_archivo);
        res.json({ message: 'Archivo eliminado correctamente' });
    }
    catch (err) {
        console.error('Error en deleteArchivo:', err);
        res.status(500).json({ message: err.message });
    }
};
exports.deleteArchivoController = deleteArchivoController;
