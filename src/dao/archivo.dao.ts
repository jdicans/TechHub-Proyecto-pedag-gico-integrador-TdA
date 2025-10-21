import { supabase } from '../config/db';
import { Archivo, ArchivoConRelaciones } from '../models/Archivo';

/**
 * Crear un nuevo archivo
 */
export const createArchivo = async (
  archivo: Omit<Archivo, 'id_archivo' | 'fecha_subida'>
): Promise<Archivo> => {
  const { data, error } = await supabase
    .from('Archivo')
    .insert([{
      ...archivo,
      fecha_subida: new Date().toISOString()
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Obtener todos los archivos
 */
export const getAllArchivos = async (): Promise<ArchivoConRelaciones[]> => {
  const { data, error } = await supabase
    .from('Archivo')
    .select(`
      *,
      publicacion:Publicacion!Archivo_id_publicacion_fkey(id_publicacion, titulo)
    `)
    .order('fecha_subida', { ascending: false });

  if (error) throw error;
  return data || [];
};

/**
 * Obtener archivo por ID
 */
export const getArchivoById = async (id_archivo: number): Promise<ArchivoConRelaciones | null> => {
  const { data, error } = await supabase
    .from('Archivo')
    .select(`
      *,
      publicacion:Publicacion!Archivo_id_publicacion_fkey(id_publicacion, titulo)
    `)
    .eq('id_archivo', id_archivo)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
};

/**
 * Obtener archivos por publicación
 */
export const getArchivosByPublicacion = async (id_publicacion: number): Promise<Archivo[]> => {
  const { data, error } = await supabase
    .from('Archivo')
    .select('*')
    .eq('id_publicacion', id_publicacion)
    .order('fecha_subida', { ascending: true });

  if (error) throw error;
  return data || [];
};

/**
 * Obtener archivos por tipo
 */
export const getArchivosByTipo = async (tipo: string): Promise<ArchivoConRelaciones[]> => {
  const { data, error } = await supabase
    .from('Archivo')
    .select(`
      *,
      publicacion:Publicacion!Archivo_id_publicacion_fkey(id_publicacion, titulo)
    `)
    .ilike('tipo', `${tipo}%`)
    .order('fecha_subida', { ascending: false });

  if (error) throw error;
  return data || [];
};

/**
 * Actualizar un archivo
 */
export const updateArchivo = async (
  id_archivo: number,
  archivo: Partial<Omit<Archivo, 'id_archivo' | 'fecha_subida' | 'id_publicacion'>>
): Promise<Archivo | null> => {
  const { data, error } = await supabase
    .from('Archivo')
    .update(archivo)
    .eq('id_archivo', id_archivo)
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Eliminar un archivo
 */
export const deleteArchivo = async (id_archivo: number): Promise<Archivo | null> => {
  const { data, error } = await supabase
    .from('Archivo')
    .delete()
    .eq('id_archivo', id_archivo)
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Contar archivos de una publicación
 */
export const countArchivosByPublicacion = async (id_publicacion: number): Promise<number> => {
  const { count, error } = await supabase
    .from('Archivo')
    .select('*', { count: 'exact', head: true })
    .eq('id_publicacion', id_publicacion);

  if (error) throw error;
  return count || 0;
};

/**
 * Obtener tamaño total de archivos de una publicación
 */
export const getTotalSizeByPublicacion = async (id_publicacion: number): Promise<number> => {
  const { data, error } = await supabase
    .from('Archivo')
    .select('tamanio')
    .eq('id_publicacion', id_publicacion);

  if (error) throw error;

  const totalSize = (data || []).reduce((sum, archivo) => sum + (archivo.tamanio || 0), 0);
  return totalSize;
};
