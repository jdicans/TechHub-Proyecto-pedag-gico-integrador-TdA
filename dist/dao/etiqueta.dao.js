"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEtiqueta = exports.updateEtiqueta = exports.getEtiquetaById = exports.getAllEtiquetas = exports.createEtiqueta = void 0;
const db_1 = require("../config/db");
/**
 * Crear una nueva etiqueta
 */
const createEtiqueta = async (etiqueta) => {
    const { data, error } = await db_1.supabase
        .from('Etiqueta')
        .insert([etiqueta])
        .select()
        .single();
    if (error)
        throw error;
    return data;
};
exports.createEtiqueta = createEtiqueta;
/**
 * Obtener todas las etiquetas
 */
const getAllEtiquetas = async () => {
    const { data, error } = await db_1.supabase
        .from('Etiqueta')
        .select('*')
        .order('nombre', { ascending: true });
    if (error)
        throw error;
    return data || [];
};
exports.getAllEtiquetas = getAllEtiquetas;
/**
 * Obtener etiqueta por ID
 */
const getEtiquetaById = async (id_etiqueta) => {
    const { data, error } = await db_1.supabase
        .from('Etiqueta')
        .select('*')
        .eq('id_etiqueta', id_etiqueta)
        .single();
    if (error && error.code !== 'PGRST116')
        throw error;
    return data;
};
exports.getEtiquetaById = getEtiquetaById;
/**
 * Actualizar una etiqueta
 */
const updateEtiqueta = async (id_etiqueta, etiqueta) => {
    const { data, error } = await db_1.supabase
        .from('Etiqueta')
        .update(etiqueta)
        .eq('id_etiqueta', id_etiqueta)
        .select()
        .single();
    if (error)
        throw error;
    return data;
};
exports.updateEtiqueta = updateEtiqueta;
/**
 * Eliminar una etiqueta
 */
const deleteEtiqueta = async (id_etiqueta) => {
    const { data, error } = await db_1.supabase
        .from('Etiqueta')
        .delete()
        .eq('id_etiqueta', id_etiqueta)
        .select()
        .single();
    if (error)
        throw error;
    return data;
};
exports.deleteEtiqueta = deleteEtiqueta;
