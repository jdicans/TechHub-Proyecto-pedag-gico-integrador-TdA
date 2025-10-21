"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategoria = exports.updateCategoria = exports.getCategoriaById = exports.getAllCategorias = exports.createCategoria = void 0;
const db_1 = require("../config/db");
/**
 * Crear una nueva categoría
 */
const createCategoria = async (categoria) => {
    const { data, error } = await db_1.supabase
        .from('Categoria')
        .insert([categoria])
        .select()
        .single();
    if (error)
        throw error;
    return data;
};
exports.createCategoria = createCategoria;
/**
 * Obtener todas las categorías
 */
const getAllCategorias = async () => {
    const { data, error } = await db_1.supabase
        .from('Categoria')
        .select('*')
        .order('nombre', { ascending: true });
    if (error)
        throw error;
    return data || [];
};
exports.getAllCategorias = getAllCategorias;
/**
 * Obtener categoría por ID
 */
const getCategoriaById = async (id_categoria) => {
    const { data, error } = await db_1.supabase
        .from('Categoria')
        .select('*')
        .eq('id_categoria', id_categoria)
        .single();
    if (error && error.code !== 'PGRST116')
        throw error;
    return data;
};
exports.getCategoriaById = getCategoriaById;
/**
 * Actualizar una categoría
 */
const updateCategoria = async (id_categoria, categoria) => {
    const { data, error } = await db_1.supabase
        .from('Categoria')
        .update(categoria)
        .eq('id_categoria', id_categoria)
        .select()
        .single();
    if (error)
        throw error;
    return data;
};
exports.updateCategoria = updateCategoria;
/**
 * Eliminar una categoría
 */
const deleteCategoria = async (id_categoria) => {
    const { data, error } = await db_1.supabase
        .from('Categoria')
        .delete()
        .eq('id_categoria', id_categoria)
        .select()
        .single();
    if (error)
        throw error;
    return data;
};
exports.deleteCategoria = deleteCategoria;
