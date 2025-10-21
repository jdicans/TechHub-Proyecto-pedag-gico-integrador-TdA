"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateEtiquetasPublicacion = exports.getEtiquetasByPublicacion = exports.deleteAllEtiquetasFromPublicacion = exports.removeEtiquetaFromPublicacion = exports.addEtiquetaToPublicacion = exports.deletePublicacion = exports.updatePublicacion = exports.getPublicacionesByCategoria = exports.getPublicacionesByUsuario = exports.getPublicacionById = exports.getAllPublicaciones = exports.createPublicacion = void 0;
const db_1 = require("../config/db");
/**
 * Crear una nueva publicación
 */
const createPublicacion = async (publicacion) => {
    const { data, error } = await db_1.supabase
        .from('Publicacion')
        .insert([{
            ...publicacion,
            fecha_creacion: new Date().toISOString()
        }])
        .select()
        .single();
    if (error)
        throw error;
    return data;
};
exports.createPublicacion = createPublicacion;
/**
 * Obtener todas las publicaciones con relaciones
 */
const getAllPublicaciones = async () => {
    const { data, error } = await db_1.supabase
        .from('Publicacion')
        .select(`
      *,
      usuario:Usuario!Publicacion_id_usuario_fkey(id_usuario, nombre, apellido, foto_perfil),
      categoria:Categoria!Publicacion_id_categoria_fkey(id_categoria, nombre)
    `)
        .order('fecha_creacion', { ascending: false });
    if (error)
        throw error;
    // Obtener etiquetas para cada publicación
    const publicacionesConEtiquetas = await Promise.all((data || []).map(async (pub) => {
        const etiquetas = await (0, exports.getEtiquetasByPublicacion)(pub.id_publicacion);
        return {
            ...pub,
            etiquetas
        };
    }));
    return publicacionesConEtiquetas;
};
exports.getAllPublicaciones = getAllPublicaciones;
/**
 * Obtener publicación por ID con relaciones
 */
const getPublicacionById = async (id_publicacion) => {
    const { data, error } = await db_1.supabase
        .from('Publicacion')
        .select(`
      *,
      usuario:Usuario!Publicacion_id_usuario_fkey(id_usuario, nombre, apellido, foto_perfil),
      categoria:Categoria!Publicacion_id_categoria_fkey(id_categoria, nombre)
    `)
        .eq('id_publicacion', id_publicacion)
        .single();
    if (error && error.code !== 'PGRST116')
        throw error;
    if (!data)
        return null;
    // Obtener etiquetas
    const etiquetas = await (0, exports.getEtiquetasByPublicacion)(id_publicacion);
    return {
        ...data,
        etiquetas
    };
};
exports.getPublicacionById = getPublicacionById;
/**
 * Obtener publicaciones por usuario
 */
const getPublicacionesByUsuario = async (id_usuario) => {
    const { data, error } = await db_1.supabase
        .from('Publicacion')
        .select(`
      *,
      usuario:Usuario!Publicacion_id_usuario_fkey(id_usuario, nombre, apellido, foto_perfil),
      categoria:Categoria!Publicacion_id_categoria_fkey(id_categoria, nombre)
    `)
        .eq('id_usuario', id_usuario)
        .order('fecha_creacion', { ascending: false });
    if (error)
        throw error;
    const publicacionesConEtiquetas = await Promise.all((data || []).map(async (pub) => {
        const etiquetas = await (0, exports.getEtiquetasByPublicacion)(pub.id_publicacion);
        return {
            ...pub,
            etiquetas
        };
    }));
    return publicacionesConEtiquetas;
};
exports.getPublicacionesByUsuario = getPublicacionesByUsuario;
/**
 * Obtener publicaciones por categoría
 */
const getPublicacionesByCategoria = async (id_categoria) => {
    const { data, error } = await db_1.supabase
        .from('Publicacion')
        .select(`
      *,
      usuario:Usuario!Publicacion_id_usuario_fkey(id_usuario, nombre, apellido, foto_perfil),
      categoria:Categoria!Publicacion_id_categoria_fkey(id_categoria, nombre)
    `)
        .eq('id_categoria', id_categoria)
        .order('fecha_creacion', { ascending: false });
    if (error)
        throw error;
    const publicacionesConEtiquetas = await Promise.all((data || []).map(async (pub) => {
        const etiquetas = await (0, exports.getEtiquetasByPublicacion)(pub.id_publicacion);
        return {
            ...pub,
            etiquetas
        };
    }));
    return publicacionesConEtiquetas;
};
exports.getPublicacionesByCategoria = getPublicacionesByCategoria;
/**
 * Actualizar una publicación
 */
const updatePublicacion = async (id_publicacion, publicacion) => {
    const { data, error } = await db_1.supabase
        .from('Publicacion')
        .update(publicacion)
        .eq('id_publicacion', id_publicacion)
        .select()
        .single();
    if (error)
        throw error;
    return data;
};
exports.updatePublicacion = updatePublicacion;
/**
 * Eliminar una publicación
 */
const deletePublicacion = async (id_publicacion) => {
    // Primero eliminar las relaciones con etiquetas
    await (0, exports.deleteAllEtiquetasFromPublicacion)(id_publicacion);
    const { data, error } = await db_1.supabase
        .from('Publicacion')
        .delete()
        .eq('id_publicacion', id_publicacion)
        .select()
        .single();
    if (error)
        throw error;
    return data;
};
exports.deletePublicacion = deletePublicacion;
/**
 * Agregar etiqueta a publicación
 */
const addEtiquetaToPublicacion = async (id_publicacion, id_etiqueta) => {
    const { error } = await db_1.supabase
        .from('PublicacionEtiqueta')
        .insert([{ id_publicacion, id_etiqueta }]);
    if (error)
        throw error;
};
exports.addEtiquetaToPublicacion = addEtiquetaToPublicacion;
/**
 * Eliminar etiqueta de publicación
 */
const removeEtiquetaFromPublicacion = async (id_publicacion, id_etiqueta) => {
    const { error } = await db_1.supabase
        .from('PublicacionEtiqueta')
        .delete()
        .eq('id_publicacion', id_publicacion)
        .eq('id_etiqueta', id_etiqueta);
    if (error)
        throw error;
};
exports.removeEtiquetaFromPublicacion = removeEtiquetaFromPublicacion;
/**
 * Eliminar todas las etiquetas de una publicación
 */
const deleteAllEtiquetasFromPublicacion = async (id_publicacion) => {
    const { error } = await db_1.supabase
        .from('PublicacionEtiqueta')
        .delete()
        .eq('id_publicacion', id_publicacion);
    if (error)
        throw error;
};
exports.deleteAllEtiquetasFromPublicacion = deleteAllEtiquetasFromPublicacion;
/**
 * Obtener etiquetas de una publicación
 */
const getEtiquetasByPublicacion = async (id_publicacion) => {
    const { data, error } = await db_1.supabase
        .from('PublicacionEtiqueta')
        .select('etiqueta:Etiqueta!PublicacionEtiqueta_id_etiqueta_fkey(id_etiqueta, nombre)')
        .eq('id_publicacion', id_publicacion);
    if (error)
        throw error;
    return (data || []).map((item) => item.etiqueta);
};
exports.getEtiquetasByPublicacion = getEtiquetasByPublicacion;
/**
 * Actualizar etiquetas de una publicación
 */
const updateEtiquetasPublicacion = async (id_publicacion, etiquetasIds) => {
    // Eliminar todas las etiquetas actuales
    await (0, exports.deleteAllEtiquetasFromPublicacion)(id_publicacion);
    // Agregar las nuevas etiquetas
    if (etiquetasIds.length > 0) {
        const insertData = etiquetasIds.map(id_etiqueta => ({
            id_publicacion,
            id_etiqueta
        }));
        const { error } = await db_1.supabase
            .from('PublicacionEtiqueta')
            .insert(insertData);
        if (error)
            throw error;
    }
};
exports.updateEtiquetasPublicacion = updateEtiquetasPublicacion;
