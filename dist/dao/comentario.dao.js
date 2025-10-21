"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.countComentariosByPublicacion = exports.deleteComentario = exports.updateComentario = exports.getComentariosByUsuario = exports.getComentariosByPublicacion = exports.getComentarioById = exports.getAllComentarios = exports.createComentario = void 0;
const db_1 = require("../config/db");
/**
 * Crear un nuevo comentario
 */
const createComentario = async (comentario) => {
    const { data, error } = await db_1.supabase
        .from('Comentario')
        .insert([{
            ...comentario,
            fecha: new Date().toISOString()
        }])
        .select()
        .single();
    if (error)
        throw error;
    return data;
};
exports.createComentario = createComentario;
/**
 * Obtener todos los comentarios (con información del usuario)
 */
const getAllComentarios = async () => {
    const { data, error } = await db_1.supabase
        .from('Comentario')
        .select(`
      *,
      usuario:Usuario!Comentario_id_usuario_fkey(id_usuario, nombre, apellido, foto_perfil)
    `)
        .order('fecha', { ascending: false });
    if (error)
        throw error;
    return data || [];
};
exports.getAllComentarios = getAllComentarios;
/**
 * Obtener comentario por ID
 */
const getComentarioById = async (id_comentario) => {
    const { data, error } = await db_1.supabase
        .from('Comentario')
        .select(`
      *,
      usuario:Usuario!Comentario_id_usuario_fkey(id_usuario, nombre, apellido, foto_perfil)
    `)
        .eq('id_comentario', id_comentario)
        .single();
    if (error && error.code !== 'PGRST116')
        throw error;
    return data;
};
exports.getComentarioById = getComentarioById;
/**
 * Obtener comentarios por publicación
 */
const getComentariosByPublicacion = async (id_publicacion) => {
    const { data, error } = await db_1.supabase
        .from('Comentario')
        .select(`
      *,
      usuario:Usuario!Comentario_id_usuario_fkey(id_usuario, nombre, apellido, foto_perfil)
    `)
        .eq('id_publicacion', id_publicacion)
        .order('fecha', { ascending: true }); // Orden cronológico para comentarios
    if (error)
        throw error;
    return data || [];
};
exports.getComentariosByPublicacion = getComentariosByPublicacion;
/**
 * Obtener comentarios por usuario
 */
const getComentariosByUsuario = async (id_usuario) => {
    const { data, error } = await db_1.supabase
        .from('Comentario')
        .select(`
      *,
      usuario:Usuario!Comentario_id_usuario_fkey(id_usuario, nombre, apellido, foto_perfil)
    `)
        .eq('id_usuario', id_usuario)
        .order('fecha', { ascending: false });
    if (error)
        throw error;
    return data || [];
};
exports.getComentariosByUsuario = getComentariosByUsuario;
/**
 * Actualizar un comentario
 */
const updateComentario = async (id_comentario, comentario) => {
    const { data, error } = await db_1.supabase
        .from('Comentario')
        .update(comentario)
        .eq('id_comentario', id_comentario)
        .select()
        .single();
    if (error)
        throw error;
    return data;
};
exports.updateComentario = updateComentario;
/**
 * Eliminar un comentario
 */
const deleteComentario = async (id_comentario) => {
    const { data, error } = await db_1.supabase
        .from('Comentario')
        .delete()
        .eq('id_comentario', id_comentario)
        .select()
        .single();
    if (error)
        throw error;
    return data;
};
exports.deleteComentario = deleteComentario;
/**
 * Contar comentarios de una publicación
 */
const countComentariosByPublicacion = async (id_publicacion) => {
    const { count, error } = await db_1.supabase
        .from('Comentario')
        .select('*', { count: 'exact', head: true })
        .eq('id_publicacion', id_publicacion);
    if (error)
        throw error;
    return count || 0;
};
exports.countComentariosByPublicacion = countComentariosByPublicacion;
