import { supabase } from '../config/db';
import { Notificacion } from '../models/Notificacion';

// Crear una nueva notificación
export const createNotificacion = async (notificacion: Notificacion) => {
  const notificacionData = {
    ...notificacion,
    fecha: new Date().toISOString(),
    leida: false
  };

  const { data, error } = await supabase
    .from('Notificacion')
    .insert([notificacionData])
    .select();
  if (error) throw error;
  return data[0];
};

// Obtener todas las notificaciones
export const getAllNotificaciones = async () => {
  const { data, error } = await supabase
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
  if (error) throw error;
  return data;
};

// Obtener notificaciones por usuario
export const getNotificacionesByUsuario = async (id_usuario: number) => {
  const { data, error } = await supabase
    .from('Notificacion')
    .select('*')
    .eq('id_usuario', id_usuario)
    .order('fecha', { ascending: false });
  if (error) throw error;
  return data;
};

// Obtener notificaciones no leídas por usuario
export const getNotificacionesNoLeidasByUsuario = async (id_usuario: number) => {
  const { data, error } = await supabase
    .from('Notificacion')
    .select('*')
    .eq('id_usuario', id_usuario)
    .eq('leida', false)
    .order('fecha', { ascending: false });
  if (error) throw error;
  return data;
};

// Obtener notificación por id
export const getNotificacionById = async (id_notificacion: number) => {
  const { data, error } = await supabase
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
  if (error && error.code !== 'PGRST116') throw error;
  return data;
};

// Marcar notificación como leída
export const markAsRead = async (id_notificacion: number) => {
  const { data, error } = await supabase
    .from('Notificacion')
    .update({ leida: true })
    .eq('id_notificacion', id_notificacion)
    .select();
  if (error) throw error;
  return data[0];
};

// Marcar todas las notificaciones de un usuario como leídas
export const markAllAsReadByUsuario = async (id_usuario: number) => {
  const { data, error } = await supabase
    .from('Notificacion')
    .update({ leida: true })
    .eq('id_usuario', id_usuario)
    .eq('leida', false)
    .select();
  if (error) throw error;
  return data;
};

// Actualizar una notificación
export const updateNotificacion = async (id_notificacion: number, notificacion: Partial<Notificacion>) => {
  const { data, error } = await supabase
    .from('Notificacion')
    .update(notificacion)
    .eq('id_notificacion', id_notificacion)
    .select();
  if (error) throw error;
  return data[0];
};

// Eliminar una notificación
export const deleteNotificacion = async (id_notificacion: number) => {
  const { data, error } = await supabase
    .from('Notificacion')
    .delete()
    .eq('id_notificacion', id_notificacion)
    .select();
  if (error) throw error;
  return data[0];
};

// Eliminar todas las notificaciones leídas de un usuario
export const deleteLeidasByUsuario = async (id_usuario: number) => {
  const { data, error } = await supabase
    .from('Notificacion')
    .delete()
    .eq('id_usuario', id_usuario)
    .eq('leida', true)
    .select();
  if (error) throw error;
  return data;
};
