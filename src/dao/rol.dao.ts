import { supabase } from '../config/db';
import { Rol } from '../models/Rol';

// Crear un nuevo rol
export const createRol = async (rol: Rol) => {
  const { data, error } = await supabase
    .from('Rol')
    .insert([rol])
    .select();
  if (error) throw error;
  return data[0];
};

// Obtener todos los roles
export const getAllRoles = async () => {
  const { data, error } = await supabase
    .from('Rol')
    .select('*');
  if (error) throw error;
  return data;
};

// Obtener rol por id
export const getRolById = async (id_rol: number) => {
  const { data, error } = await supabase
    .from('Rol')
    .select('*')
    .eq('id_rol', id_rol)
    .single();
  if (error && error.code !== 'PGRST116') throw error;
  return data;
};
// Actualizar un rol
export const updateRol = async (id_rol: number, rol: Partial<Rol>) => {
  const { data, error } = await supabase
    .from('Rol')
    .update(rol)
    .eq('id_rol', id_rol)
    .select();
  if (error) throw error;
  return data[0];
};

// Eliminar un rol
export const deleteRol = async (id_rol: number) => {
  const { data, error } = await supabase
    .from('Rol')
    .delete()
    .eq('id_rol', id_rol)
    .select();
  if (error) throw error;
  return data[0];
};
