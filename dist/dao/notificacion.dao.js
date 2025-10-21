"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLeidasByUsuario = exports.deleteNotificacion = exports.updateNotificacion = exports.markAllAsReadByUsuario = exports.markAsRead = exports.getNotificacionById = exports.getNotificacionesNoLeidasByUsuario = exports.getNotificacionesByUsuario = exports.getAllNotificaciones = exports.createNotificacion = void 0;
const db_1 = require("../config/db");
// Crear una nueva notificación
const createNotificacion = async (notificacion) => {
    const notificacionData = {
        ...notificacion,
        fecha: new Date().toISOString(),
        leida: false
    };
    const { data, error } = await db_1.supabase
        .from('Notificacion')
        .insert([notificacionData])
        .select();
    if (error)
        throw error;
    return data[0];
};
exports.createNotificacion = createNotificacion;
// Obtener todas las notificaciones
const getAllNotificaciones = async () => {
    const { data, error } = await db_1.supabase
        .from('Notificacion')
        .select(`
      *,
      usuario:Usuario!Notificacion_id_usuario_fkey(
        id_usuario,
        nombre,
        apellido,
        email
      )
    `)
        .order('fecha', { ascending: false });
    if (error)
        throw error;
    return data;
};
exports.getAllNotificaciones = getAllNotificaciones;
// Obtener notificaciones por usuario
const getNotificacionesByUsuario = async (id_usuario) => {
    const { data, error } = await db_1.supabase
        .from('Notificacion')
        .select('*')
        .eq('id_usuario', id_usuario)
        .order('fecha', { ascending: false });
    if (error)
        throw error;
    return data;
};
exports.getNotificacionesByUsuario = getNotificacionesByUsuario;
// Obtener notificaciones no leídas por usuario
const getNotificacionesNoLeidasByUsuario = async (id_usuario) => {
    const { data, error } = await db_1.supabase
        .from('Notificacion')
        .select('*')
        .eq('id_usuario', id_usuario)
        .eq('leida', false)
        .order('fecha', { ascending: false });
    if (error)
        throw error;
    return data;
};
exports.getNotificacionesNoLeidasByUsuario = getNotificacionesNoLeidasByUsuario;
// Obtener notificación por id
const getNotificacionById = async (id_notificacion) => {
    const { data, error } = await db_1.supabase
        .from('Notificacion')
        .select(`
      *,
      usuario:Usuario!Notificacion_id_usuario_fkey(
        id_usuario,
        nombre,
        apellido,
        email
      )
    `)
        .eq('id_notificacion', id_notificacion)
        .single();
    if (error && error.code !== 'PGRST116')
        throw error;
    return data;
};
exports.getNotificacionById = getNotificacionById;
// Marcar notificación como leída
const markAsRead = async (id_notificacion) => {
    const { data, error } = await db_1.supabase
        .from('Notificacion')
        .update({ leida: true })
        .eq('id_notificacion', id_notificacion)
        .select();
    if (error)
        throw error;
    return data[0];
};
exports.markAsRead = markAsRead;
// Marcar todas las notificaciones de un usuario como leídas
const markAllAsReadByUsuario = async (id_usuario) => {
    const { data, error } = await db_1.supabase
        .from('Notificacion')
        .update({ leida: true })
        .eq('id_usuario', id_usuario)
        .eq('leida', false)
        .select();
    if (error)
        throw error;
    return data;
};
exports.markAllAsReadByUsuario = markAllAsReadByUsuario;
// Actualizar una notificación
const updateNotificacion = async (id_notificacion, notificacion) => {
    const { data, error } = await db_1.supabase
        .from('Notificacion')
        .update(notificacion)
        .eq('id_notificacion', id_notificacion)
        .select();
    if (error)
        throw error;
    return data[0];
};
exports.updateNotificacion = updateNotificacion;
// Eliminar una notificación
const deleteNotificacion = async (id_notificacion) => {
    const { data, error } = await db_1.supabase
        .from('Notificacion')
        .delete()
        .eq('id_notificacion', id_notificacion)
        .select();
    if (error)
        throw error;
    return data[0];
};
exports.deleteNotificacion = deleteNotificacion;
// Eliminar todas las notificaciones leídas de un usuario
const deleteLeidasByUsuario = async (id_usuario) => {
    const { data, error } = await db_1.supabase
        .from('Notificacion')
        .delete()
        .eq('id_usuario', id_usuario)
        .eq('leida', true)
        .select();
    if (error)
        throw error;
    return data;
};
exports.deleteLeidasByUsuario = deleteLeidasByUsuario;
