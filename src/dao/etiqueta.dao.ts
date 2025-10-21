import { supabase } from '../config/db';
import { Etiqueta } from '../models/Etiqueta';

/**
 * Crear una nueva etiqueta
 */
export const createEtiqueta = async (etiqueta: Omit<Etiqueta, 'id_etiqueta'>): Promise<Etiqueta> => {
  const { data, error } = await supabase
    .from('Etiqueta')
    .insert([etiqueta])
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Obtener todas las etiquetas
 */
export const getAllEtiquetas = async (): Promise<Etiqueta[]> => {
  const { data, error } = await supabase
    .from('Etiqueta')
    .select('*')
    .order('nombre', { ascending: true });

  if (error) throw error;
  return data || [];
};

/**
 * Obtener etiqueta por ID
 */
export const getEtiquetaById = async (id_etiqueta: number): Promise<Etiqueta | null> => {
  const { data, error } = await supabase
    .from('Etiqueta')
    .select('*')
    .eq('id_etiqueta', id_etiqueta)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
};

/**
 * Actualizar una etiqueta
 */
export const updateEtiqueta = async (
  id_etiqueta: number,
  etiqueta: Partial<Omit<Etiqueta, 'id_etiqueta'>>
): Promise<Etiqueta | null> => {
  const { data, error } = await supabase
    .from('Etiqueta')
    .update(etiqueta)
    .eq('id_etiqueta', id_etiqueta)
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Eliminar una etiqueta
 */
export const deleteEtiqueta = async (id_etiqueta: number): Promise<Etiqueta | null> => {
  const { data, error } = await supabase
    .from('Etiqueta')
    .delete()
    .eq('id_etiqueta', id_etiqueta)
    .select()
    .single();

  if (error) throw error;
  return data;
};
