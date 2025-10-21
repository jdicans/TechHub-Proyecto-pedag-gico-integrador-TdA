import { supabase } from '../config/db';
import { Publicacion, PublicacionConRelaciones } from '../models/Publicacion';

/**
 * Crear una nueva publicación
 */
export const createPublicacion = async (
  publicacion: Omit<Publicacion, 'id_publicacion' | 'fecha_creacion'>
): Promise<Publicacion> => {
  const { data, error } = await supabase
    .from('Publicacion')
    .insert([{
      ...publicacion,
      fecha_creacion: new Date().toISOString()
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Obtener todas las publicaciones con relaciones
 */
export const getAllPublicaciones = async (): Promise<PublicacionConRelaciones[]> => {
  const { data, error } = await supabase
    .from('Publicacion')
    .select(`
      *,
      usuario:Usuario!Publicacion_id_usuario_fkey(id_usuario, nombre, apellido, foto_perfil),
      categoria:Categoria!Publicacion_id_categoria_fkey(id_categoria, nombre)
    `)
    .order('fecha_creacion', { ascending: false });

  if (error) throw error;

  // Obtener etiquetas para cada publicación
  const publicacionesConEtiquetas = await Promise.all(
    (data || []).map(async (pub: any) => {
      const etiquetas = await getEtiquetasByPublicacion(pub.id_publicacion);
      return {
        ...pub,
        etiquetas
      };
    })
  );

  return publicacionesConEtiquetas;
};

/**
 * Obtener publicación por ID con relaciones
 */
export const getPublicacionById = async (id_publicacion: number): Promise<PublicacionConRelaciones | null> => {
  const { data, error } = await supabase
    .from('Publicacion')
    .select(`
      *,
      usuario:Usuario!Publicacion_id_usuario_fkey(id_usuario, nombre, apellido, foto_perfil),
      categoria:Categoria!Publicacion_id_categoria_fkey(id_categoria, nombre)
    `)
    .eq('id_publicacion', id_publicacion)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  if (!data) return null;

  // Obtener etiquetas
  const etiquetas = await getEtiquetasByPublicacion(id_publicacion);

  return {
    ...data,
    etiquetas
  };
};

/**
 * Obtener publicaciones por usuario
 */
export const getPublicacionesByUsuario = async (id_usuario: number): Promise<PublicacionConRelaciones[]> => {
  const { data, error } = await supabase
    .from('Publicacion')
    .select(`
      *,
      usuario:Usuario!Publicacion_id_usuario_fkey(id_usuario, nombre, apellido, foto_perfil),
      categoria:Categoria!Publicacion_id_categoria_fkey(id_categoria, nombre)
    `)
    .eq('id_usuario', id_usuario)
    .order('fecha_creacion', { ascending: false });

  if (error) throw error;

  const publicacionesConEtiquetas = await Promise.all(
    (data || []).map(async (pub: any) => {
      const etiquetas = await getEtiquetasByPublicacion(pub.id_publicacion);
      return {
        ...pub,
        etiquetas
      };
    })
  );

  return publicacionesConEtiquetas;
};

/**
 * Obtener publicaciones por categoría
 */
export const getPublicacionesByCategoria = async (id_categoria: number): Promise<PublicacionConRelaciones[]> => {
  const { data, error } = await supabase
    .from('Publicacion')
    .select(`
      *,
      usuario:Usuario!Publicacion_id_usuario_fkey(id_usuario, nombre, apellido, foto_perfil),
      categoria:Categoria!Publicacion_id_categoria_fkey(id_categoria, nombre)
    `)
    .eq('id_categoria', id_categoria)
    .order('fecha_creacion', { ascending: false });

  if (error) throw error;

  const publicacionesConEtiquetas = await Promise.all(
    (data || []).map(async (pub: any) => {
      const etiquetas = await getEtiquetasByPublicacion(pub.id_publicacion);
      return {
        ...pub,
        etiquetas
      };
    })
  );

  return publicacionesConEtiquetas;
};

/**
 * Actualizar una publicación
 */
export const updatePublicacion = async (
  id_publicacion: number,
  publicacion: Partial<Omit<Publicacion, 'id_publicacion' | 'fecha_creacion' | 'id_usuario'>>
): Promise<Publicacion | null> => {
  const { data, error } = await supabase
    .from('Publicacion')
    .update(publicacion)
    .eq('id_publicacion', id_publicacion)
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Eliminar una publicación
 */
export const deletePublicacion = async (id_publicacion: number): Promise<Publicacion | null> => {
  // Primero eliminar las relaciones con etiquetas
  await deleteAllEtiquetasFromPublicacion(id_publicacion);

  const { data, error } = await supabase
    .from('Publicacion')
    .delete()
    .eq('id_publicacion', id_publicacion)
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Agregar etiqueta a publicación
 */
export const addEtiquetaToPublicacion = async (
  id_publicacion: number,
  id_etiqueta: number
): Promise<void> => {
  const { error } = await supabase
    .from('PublicacionEtiqueta')
    .insert([{ id_publicacion, id_etiqueta }]);

  if (error) throw error;
};

/**
 * Eliminar etiqueta de publicación
 */
export const removeEtiquetaFromPublicacion = async (
  id_publicacion: number,
  id_etiqueta: number
): Promise<void> => {
  const { error } = await supabase
    .from('PublicacionEtiqueta')
    .delete()
    .eq('id_publicacion', id_publicacion)
    .eq('id_etiqueta', id_etiqueta);

  if (error) throw error;
};

/**
 * Eliminar todas las etiquetas de una publicación
 */
export const deleteAllEtiquetasFromPublicacion = async (id_publicacion: number): Promise<void> => {
  const { error } = await supabase
    .from('PublicacionEtiqueta')
    .delete()
    .eq('id_publicacion', id_publicacion);

  if (error) throw error;
};

/**
 * Obtener etiquetas de una publicación
 */
export const getEtiquetasByPublicacion = async (id_publicacion: number): Promise<any[]> => {
  const { data, error } = await supabase
    .from('PublicacionEtiqueta')
    .select('etiqueta:Etiqueta!PublicacionEtiqueta_id_etiqueta_fkey(id_etiqueta, nombre)')
    .eq('id_publicacion', id_publicacion);

  if (error) throw error;
  return (data || []).map((item: any) => item.etiqueta);
};

/**
 * Actualizar etiquetas de una publicación
 */
export const updateEtiquetasPublicacion = async (
  id_publicacion: number,
  etiquetasIds: number[]
): Promise<void> => {
  // Eliminar todas las etiquetas actuales
  await deleteAllEtiquetasFromPublicacion(id_publicacion);

  // Agregar las nuevas etiquetas
  if (etiquetasIds.length > 0) {
    const insertData = etiquetasIds.map(id_etiqueta => ({
      id_publicacion,
      id_etiqueta
    }));

    const { error } = await supabase
      .from('PublicacionEtiqueta')
      .insert(insertData);

    if (error) throw error;
  }
};
