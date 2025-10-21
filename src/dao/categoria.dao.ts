import { supabase } from '../config/db';
import { Categoria } from '../models/Categoria';

/**
 * Crear una nueva categoría
 */
export const createCategoria = async (categoria: Omit<Categoria, 'id_categoria'>): Promise<Categoria> => {
  const { data, error } = await supabase
    .from('Categoria')
    .insert([categoria])
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Obtener todas las categorías
 */
export const getAllCategorias = async (): Promise<Categoria[]> => {
  const { data, error } = await supabase
    .from('Categoria')
    .select('*')
    .order('nombre', { ascending: true });

  if (error) throw error;
  return data || [];
};

/**
 * Obtener categoría por ID
 */
export const getCategoriaById = async (id_categoria: number): Promise<Categoria | null> => {
  const { data, error } = await supabase
    .from('Categoria')
    .select('*')
    .eq('id_categoria', id_categoria)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
};

/**
 * Actualizar una categoría
 */
export const updateCategoria = async (
  id_categoria: number,
  categoria: Partial<Omit<Categoria, 'id_categoria'>>
): Promise<Categoria | null> => {
  const { data, error } = await supabase
    .from('Categoria')
    .update(categoria)
    .eq('id_categoria', id_categoria)
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Eliminar una categoría
 */
export const deleteCategoria = async (id_categoria: number): Promise<Categoria | null> => {
  const { data, error } = await supabase
    .from('Categoria')
    .delete()
    .eq('id_categoria', id_categoria)
    .select()
    .single();

  if (error) throw error;
  return data;
};
