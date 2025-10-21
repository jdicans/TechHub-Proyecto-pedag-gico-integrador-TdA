"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTotalSizeByPublicacion = exports.countArchivosByPublicacion = exports.deleteArchivo = exports.updateArchivo = exports.getArchivosByTipo = exports.getArchivosByPublicacion = exports.getArchivoById = exports.getAllArchivos = exports.createArchivo = void 0;
const db_1 = require("../config/db");
/**
 * Crear un nuevo archivo
 */
const createArchivo = async (archivo) => {
    const { data, error } = await db_1.supabase
        .from('Archivo')
        .insert([{
            ...archivo,
            fecha_subida: new Date().toISOString()
        }])
        .select()
        .single();
    if (error)
        throw error;
    return data;
};
exports.createArchivo = createArchivo;
/**
 * Obtener todos los archivos
 */
const getAllArchivos = async () => {
    const { data, error } = await db_1.supabase
        .from('Archivo')
        .select(`
      *,
      publicacion:Publicacion!Archivo_id_publicacion_fkey(id_publicacion, titulo)
    `)
        .order('fecha_subida', { ascending: false });
    if (error)
        throw error;
    return data || [];
};
exports.getAllArchivos = getAllArchivos;
/**
 * Obtener archivo por ID
 */
const getArchivoById = async (id_archivo) => {
    const { data, error } = await db_1.supabase
        .from('Archivo')
        .select(`
      *,
      publicacion:Publicacion!Archivo_id_publicacion_fkey(id_publicacion, titulo)
    `)
        .eq('id_archivo', id_archivo)
        .single();
    if (error && error.code !== 'PGRST116')
        throw error;
    return data;
};
exports.getArchivoById = getArchivoById;
/**
 * Obtener archivos por publicación
 */
const getArchivosByPublicacion = async (id_publicacion) => {
    const { data, error } = await db_1.supabase
        .from('Archivo')
        .select('*')
        .eq('id_publicacion', id_publicacion)
        .order('fecha_subida', { ascending: true });
    if (error)
        throw error;
    return data || [];
};
exports.getArchivosByPublicacion = getArchivosByPublicacion;
/**
 * Obtener archivos por tipo
 */
const getArchivosByTipo = async (tipo) => {
    const { data, error } = await db_1.supabase
        .from('Archivo')
        .select(`
      *,
      publicacion:Publicacion!Archivo_id_publicacion_fkey(id_publicacion, titulo)
    `)
        .ilike('tipo', `${tipo}%`)
        .order('fecha_subida', { ascending: false });
    if (error)
        throw error;
    return data || [];
};
exports.getArchivosByTipo = getArchivosByTipo;
/**
 * Actualizar un archivo
 */
const updateArchivo = async (id_archivo, archivo) => {
    const { data, error } = await db_1.supabase
        .from('Archivo')
        .update(archivo)
        .eq('id_archivo', id_archivo)
        .select()
        .single();
    if (error)
        throw error;
    return data;
};
exports.updateArchivo = updateArchivo;
/**
 * Eliminar un archivo
 */
const deleteArchivo = async (id_archivo) => {
    const { data, error } = await db_1.supabase
        .from('Archivo')
        .delete()
        .eq('id_archivo', id_archivo)
        .select()
        .single();
    if (error)
        throw error;
    return data;
};
exports.deleteArchivo = deleteArchivo;
/**
 * Contar archivos de una publicación
 */
const countArchivosByPublicacion = async (id_publicacion) => {
    const { count, error } = await db_1.supabase
        .from('Archivo')
        .select('*', { count: 'exact', head: true })
        .eq('id_publicacion', id_publicacion);
    if (error)
        throw error;
    return count || 0;
};
exports.countArchivosByPublicacion = countArchivosByPublicacion;
/**
 * Obtener tamaño total de archivos de una publicación
 */
const getTotalSizeByPublicacion = async (id_publicacion) => {
    const { data, error } = await db_1.supabase
        .from('Archivo')
        .select('tamanio')
        .eq('id_publicacion', id_publicacion);
    if (error)
        throw error;
    const totalSize = (data || []).reduce((sum, archivo) => sum + (archivo.tamanio || 0), 0);
    return totalSize;
};
exports.getTotalSizeByPublicacion = getTotalSizeByPublicacion;
