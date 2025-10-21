import { supabase } from '../config/db';
import { Usuario, UsuarioSinContrasena } from '../models/Usuario';

/**
 * Crear un nuevo usuario
 */
export const createUsuario = async (usuario: Omit<Usuario, 'id_usuario' | 'fecha_registro'>): Promise<Usuario> => {
  const { data, error } = await supabase
    .from('Usuario')
    .insert([{
      ...usuario,
      fecha_registro: new Date().toISOString()
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Obtener todos los usuarios (sin contraseñas)
 */
export const getAllUsuarios = async (): Promise<UsuarioSinContrasena[]> => {
  const { data, error } = await supabase
    .from('Usuario')
    .select('id_usuario, nombre, apellido, cedula, telefono, correo, carrera, foto_perfil, fecha_registro, id_rol');

  if (error) throw error;
  return data || [];
};

/**
 * Obtener usuario por ID (sin contraseña)
 */
export const getUsuarioById = async (id_usuario: number): Promise<UsuarioSinContrasena | null> => {
  const { data, error } = await supabase
    .from('Usuario')
    .select('id_usuario, nombre, apellido, cedula, telefono, correo, carrera, foto_perfil, fecha_registro, id_rol')
    .eq('id_usuario', id_usuario)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
};

/**
 * Obtener usuario por correo (incluye contraseña para autenticación)
 */
export const getUsuarioByEmail = async (correo: string): Promise<Usuario | null> => {
  const { data, error } = await supabase
    .from('Usuario')
    .select('*')
    .eq('correo', correo)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
};

/**
 * Verificar si un correo ya está registrado
 */
export const emailExists = async (correo: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('Usuario')
    .select('id_usuario')
    .eq('correo', correo)
    .single();

  return !error && data !== null;
};

/**
 * Verificar si una cédula ya está registrada
 */
export const cedulaExists = async (cedula: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('Usuario')
    .select('id_usuario')
    .eq('cedula', cedula)
    .single();

  return !error && data !== null;
};

/**
 * Actualizar un usuario
 */
export const updateUsuario = async (
  id_usuario: number,
  usuario: Partial<Omit<Usuario, 'id_usuario' | 'fecha_registro' | 'contrasena'>>
): Promise<UsuarioSinContrasena | null> => {
  const { data, error } = await supabase
    .from('Usuario')
    .update(usuario)
    .eq('id_usuario', id_usuario)
    .select('id_usuario, nombre, apellido, cedula, telefono, correo, carrera, foto_perfil, fecha_registro, id_rol')
    .single();

  if (error) throw error;
  return data;
};

/**
 * Actualizar contraseña de usuario
 */
export const updatePassword = async (
  id_usuario: number,
  hashedPassword: string
): Promise<void> => {
  const { error } = await supabase
    .from('Usuario')
    .update({ contrasena: hashedPassword })
    .eq('id_usuario', id_usuario);

  if (error) throw error;
};

/**
 * Eliminar un usuario
 */
export const deleteUsuario = async (id_usuario: number): Promise<UsuarioSinContrasena | null> => {
  const { data, error } = await supabase
    .from('Usuario')
    .delete()
    .eq('id_usuario', id_usuario)
    .select('id_usuario, nombre, apellido, cedula, telefono, correo, carrera, foto_perfil, fecha_registro, id_rol')
    .single();

  if (error) throw error;
  return data;
};
