import { supabase } from '../config/db';
import { GrupoEstudio, GrupoUsuario, GrupoEstudioConMiembros } from '../models/GrupoEstudio';

/**
 * Crear un nuevo grupo de estudio
 */
export const createGrupoEstudio = async (
  grupo: Omit<GrupoEstudio, 'id_grupo' | 'fecha_creacion'>
): Promise<GrupoEstudio> => {
  const { data, error } = await supabase
    .from('GrupoEstudio')
    .insert([{
      ...grupo,
      fecha_creacion: new Date().toISOString()
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Obtener todos los grupos de estudio
 */
export const getAllGruposEstudio = async (): Promise<GrupoEstudioConMiembros[]> => {
  const { data, error } = await supabase
    .from('GrupoEstudio')
    .select('*')
    .order('fecha_creacion', { ascending: false });

  if (error) throw error;

  // Obtener miembros para cada grupo
  const gruposConMiembros = await Promise.all(
    (data || []).map(async (grupo: GrupoEstudio) => {
      const miembros = await getMiembrosByGrupo(grupo.id_grupo!);
      return {
        ...grupo,
        miembros,
        total_miembros: miembros.length
      };
    })
  );

  return gruposConMiembros;
};

/**
 * Obtener grupo de estudio por ID
 */
export const getGrupoEstudioById = async (id_grupo: number): Promise<GrupoEstudioConMiembros | null> => {
  const { data, error } = await supabase
    .from('GrupoEstudio')
    .select('*')
    .eq('id_grupo', id_grupo)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  if (!data) return null;

  // Obtener miembros del grupo
  const miembros = await getMiembrosByGrupo(id_grupo);

  return {
    ...data,
    miembros,
    total_miembros: miembros.length
  };
};

/**
 * Obtener grupos por usuario
 */
export const getGruposByUsuario = async (id_usuario: number): Promise<GrupoEstudioConMiembros[]> => {
  const { data, error } = await supabase
    .from('GrupoUsuario')
    .select('id_grupo')
    .eq('id_usuario', id_usuario);

  if (error) throw error;

  const grupoIds = (data || []).map((item: any) => item.id_grupo);

  if (grupoIds.length === 0) return [];

  const { data: grupos, error: gruposError } = await supabase
    .from('GrupoEstudio')
    .select('*')
    .in('id_grupo', grupoIds)
    .order('fecha_creacion', { ascending: false });

  if (gruposError) throw gruposError;

  const gruposConMiembros = await Promise.all(
    (grupos || []).map(async (grupo: GrupoEstudio) => {
      const miembros = await getMiembrosByGrupo(grupo.id_grupo!);
      return {
        ...grupo,
        miembros,
        total_miembros: miembros.length
      };
    })
  );

  return gruposConMiembros;
};

/**
 * Actualizar un grupo de estudio
 */
export const updateGrupoEstudio = async (
  id_grupo: number,
  grupo: Partial<Omit<GrupoEstudio, 'id_grupo' | 'fecha_creacion'>>
): Promise<GrupoEstudio | null> => {
  const { data, error } = await supabase
    .from('GrupoEstudio')
    .update(grupo)
    .eq('id_grupo', id_grupo)
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Eliminar un grupo de estudio
 */
export const deleteGrupoEstudio = async (id_grupo: number): Promise<GrupoEstudio | null> => {
  // Primero eliminar todas las relaciones con usuarios
  await removeAllMiembrosFromGrupo(id_grupo);

  const { data, error } = await supabase
    .from('GrupoEstudio')
    .delete()
    .eq('id_grupo', id_grupo)
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Agregar miembro a un grupo
 */
export const addMiembroToGrupo = async (
  id_grupo: number,
  id_usuario: number,
  rol_grupo: string = 'miembro'
): Promise<GrupoUsuario> => {
  const { data, error } = await supabase
    .from('GrupoUsuario')
    .insert([{
      id_grupo,
      id_usuario,
      rol_grupo,
      fecha_union: new Date().toISOString()
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Remover miembro de un grupo
 */
export const removeMiembroFromGrupo = async (
  id_grupo: number,
  id_usuario: number
): Promise<void> => {
  const { error } = await supabase
    .from('GrupoUsuario')
    .delete()
    .eq('id_grupo', id_grupo)
    .eq('id_usuario', id_usuario);

  if (error) throw error;
};

/**
 * Actualizar rol de un miembro en el grupo
 */
export const updateMiembroRol = async (
  id_grupo: number,
  id_usuario: number,
  rol_grupo: string
): Promise<GrupoUsuario | null> => {
  const { data, error } = await supabase
    .from('GrupoUsuario')
    .update({ rol_grupo })
    .eq('id_grupo', id_grupo)
    .eq('id_usuario', id_usuario)
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Obtener miembros de un grupo
 */
export const getMiembrosByGrupo = async (id_grupo: number): Promise<any[]> => {
  const { data, error } = await supabase
    .from('GrupoUsuario')
    .select(`
      rol_grupo,
      fecha_union,
      usuario:Usuario!fk_grupousuario_usuario(id_usuario, nombre, apellido, foto_perfil)
    `)
    .eq('id_grupo', id_grupo)
    .order('fecha_union', { ascending: true });

  if (error) throw error;

  return (data || []).map((item: any) => ({
    id_usuario: item.usuario.id_usuario,
    nombre: item.usuario.nombre,
    apellido: item.usuario.apellido,
    foto_perfil: item.usuario.foto_perfil,
    rol_grupo: item.rol_grupo,
    fecha_union: item.fecha_union
  }));
};

/**
 * Verificar si un usuario es miembro de un grupo
 */
export const isMiembroOfGrupo = async (
  id_grupo: number,
  id_usuario: number
): Promise<boolean> => {
  const { data, error } = await supabase
    .from('GrupoUsuario')
    .select('id_grupo')
    .eq('id_grupo', id_grupo)
    .eq('id_usuario', id_usuario)
    .single();

  return !error && data !== null;
};

/**
 * Obtener rol de un usuario en un grupo
 */
export const getMiembroRol = async (
  id_grupo: number,
  id_usuario: number
): Promise<string | null> => {
  const { data, error } = await supabase
    .from('GrupoUsuario')
    .select('rol_grupo')
    .eq('id_grupo', id_grupo)
    .eq('id_usuario', id_usuario)
    .single();

  if (error || !data) return null;
  return data.rol_grupo;
};

/**
 * Remover todos los miembros de un grupo
 */
export const removeAllMiembrosFromGrupo = async (id_grupo: number): Promise<void> => {
  const { error } = await supabase
    .from('GrupoUsuario')
    .delete()
    .eq('id_grupo', id_grupo);

  if (error) throw error;
};

/**
 * Contar miembros de un grupo
 */
export const countMiembrosByGrupo = async (id_grupo: number): Promise<number> => {
  const { count, error } = await supabase
    .from('GrupoUsuario')
    .select('*', { count: 'exact', head: true })
    .eq('id_grupo', id_grupo);

  if (error) throw error;
  return count || 0;
};
