import { supabase } from '../config/db';
import { Comentario, ComentarioConRelaciones } from '../models/Comentario';

/**
 * Crear un nuevo comentario
 */
export const createComentario = async (
  comentario: Omit<Comentario, 'id_comentario' | 'fecha'>
): Promise<Comentario> => {
  const { data, error } = await supabase
    .from('Comentario')
    .insert([{
      ...comentario,
      fecha: new Date().toISOString()
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Obtener todos los comentarios (con información del usuario)
 */
export const getAllComentarios = async (): Promise<ComentarioConRelaciones[]> => {
  const { data, error } = await supabase
    .from('Comentario')
    .select(`
      *,
      usuario:Usuario!Comentario_id_usuario_fkey(id_usuario, nombre, apellido, foto_perfil)
    `)
    .order('fecha', { ascending: false });

  if (error) throw error;
  return data || [];
};

/**
 * Obtener comentario por ID
 */
export const getComentarioById = async (id_comentario: number): Promise<ComentarioConRelaciones | null> => {
  const { data, error } = await supabase
    .from('Comentario')
    .select(`
      *,
      usuario:Usuario!Comentario_id_usuario_fkey(id_usuario, nombre, apellido, foto_perfil)
    `)
    .eq('id_comentario', id_comentario)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
};

/**
 * Obtener comentarios por publicación
 */
export const getComentariosByPublicacion = async (id_publicacion: number): Promise<ComentarioConRelaciones[]> => {
  const { data, error } = await supabase
    .from('Comentario')
    .select(`
      *,
      usuario:Usuario!Comentario_id_usuario_fkey(id_usuario, nombre, apellido, foto_perfil)
    `)
    .eq('id_publicacion', id_publicacion)
    .order('fecha', { ascending: true }); // Orden cronológico para comentarios

  if (error) throw error;
  return data || [];
};

/**
 * Obtener comentarios por usuario
 */
export const getComentariosByUsuario = async (id_usuario: number): Promise<ComentarioConRelaciones[]> => {
  const { data, error } = await supabase
    .from('Comentario')
    .select(`
      *,
      usuario:Usuario!Comentario_id_usuario_fkey(id_usuario, nombre, apellido, foto_perfil)
    `)
    .eq('id_usuario', id_usuario)
    .order('fecha', { ascending: false });

  if (error) throw error;
  return data || [];
};

/**
 * Actualizar un comentario
 */
export const updateComentario = async (
  id_comentario: number,
  comentario: Partial<Omit<Comentario, 'id_comentario' | 'fecha' | 'id_usuario' | 'id_publicacion'>>
): Promise<Comentario | null> => {
  const { data, error } = await supabase
    .from('Comentario')
    .update(comentario)
    .eq('id_comentario', id_comentario)
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Eliminar un comentario
 */
export const deleteComentario = async (id_comentario: number): Promise<Comentario | null> => {
  const { data, error } = await supabase
    .from('Comentario')
    .delete()
    .eq('id_comentario', id_comentario)
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Contar comentarios de una publicación
 */
export const countComentariosByPublicacion = async (id_publicacion: number): Promise<number> => {
  const { count, error } = await supabase
    .from('Comentario')
    .select('*', { count: 'exact', head: true })
    .eq('id_publicacion', id_publicacion);

  if (error) throw error;
  return count || 0;
};
