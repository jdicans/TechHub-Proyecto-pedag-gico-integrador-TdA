import { supabase } from '../config/db';
import { Reporte } from '../models/Reporte';

// Crear un nuevo reporte
export const createReporte = async (reporte: Reporte) => {
  const reporteData = {
    ...reporte,
    fecha_reporte: new Date().toISOString(),
    estado: 'pendiente'
  };

  const { data, error } = await supabase
    .from('Reporte')
    .insert([reporteData])
    .select();
  if (error) throw error;
  return data[0];
};

// Obtener todos los reportes con relaciones
export const getAllReportes = async () => {
  const { data, error } = await supabase
    .from('Reporte')
    .select(`
      *,
      usuario_reporta:Usuario!Reporte_id_usuario_reporta_fkey(
        id_usuario,
        nombre,
        apellido,
        email
      ),
      usuario_reportado:Usuario!Reporte_id_usuario_reportado_fkey(
        id_usuario,
        nombre,
        apellido,
        email
      ),
      publicacion:Publicacion!Reporte_id_publicacion_fkey(
        id_publicacion,
        titulo
      ),
      comentario:Comentario!Reporte_id_comentario_fkey(
        id_comentario,
        contenido
      )
    `)
    .order('fecha_reporte', { ascending: false });
  if (error) throw error;
  return data;
};

// Obtener reportes por estado
export const getReportesByEstado = async (estado: string) => {
  const { data, error } = await supabase
    .from('Reporte')
    .select(`
      *,
      usuario_reporta:Usuario!Reporte_id_usuario_reporta_fkey(
        id_usuario,
        nombre,
        apellido,
        email
      ),
      usuario_reportado:Usuario!Reporte_id_usuario_reportado_fkey(
        id_usuario,
        nombre,
        apellido,
        email
      ),
      publicacion:Publicacion!Reporte_id_publicacion_fkey(
        id_publicacion,
        titulo
      ),
      comentario:Comentario!Reporte_id_comentario_fkey(
        id_comentario,
        contenido
      )
    `)
    .eq('estado', estado)
    .order('fecha_reporte', { ascending: false });
  if (error) throw error;
  return data;
};

// Obtener reportes realizados por un usuario
export const getReportesByUsuarioReporta = async (id_usuario: number) => {
  const { data, error } = await supabase
    .from('Reporte')
    .select(`
      *,
      usuario_reportado:Usuario!Reporte_id_usuario_reportado_fkey(
        id_usuario,
        nombre,
        apellido,
        email
      ),
      publicacion:Publicacion!Reporte_id_publicacion_fkey(
        id_publicacion,
        titulo
      ),
      comentario:Comentario!Reporte_id_comentario_fkey(
        id_comentario,
        contenido
      )
    `)
    .eq('id_usuario_reporta', id_usuario)
    .order('fecha_reporte', { ascending: false });
  if (error) throw error;
  return data;
};

// Obtener reportes sobre un usuario específico
export const getReportesByUsuarioReportado = async (id_usuario: number) => {
  const { data, error } = await supabase
    .from('Reporte')
    .select(`
      *,
      usuario_reporta:Usuario!Reporte_id_usuario_reporta_fkey(
        id_usuario,
        nombre,
        apellido,
        email
      )
    `)
    .eq('id_usuario_reportado', id_usuario)
    .order('fecha_reporte', { ascending: false });
  if (error) throw error;
  return data;
};

// Obtener reportes sobre una publicación específica
export const getReportesByPublicacion = async (id_publicacion: number) => {
  const { data, error } = await supabase
    .from('Reporte')
    .select(`
      *,
      usuario_reporta:Usuario!Reporte_id_usuario_reporta_fkey(
        id_usuario,
        nombre,
        apellido,
        email
      )
    `)
    .eq('id_publicacion', id_publicacion)
    .order('fecha_reporte', { ascending: false });
  if (error) throw error;
  return data;
};

// Obtener reportes sobre un comentario específico
export const getReportesByComentario = async (id_comentario: number) => {
  const { data, error } = await supabase
    .from('Reporte')
    .select(`
      *,
      usuario_reporta:Usuario!Reporte_id_usuario_reporta_fkey(
        id_usuario,
        nombre,
        apellido,
        email
      )
    `)
    .eq('id_comentario', id_comentario)
    .order('fecha_reporte', { ascending: false });
  if (error) throw error;
  return data;
};

// Obtener reporte por id
export const getReporteById = async (id_reporte: number) => {
  const { data, error } = await supabase
    .from('Reporte')
    .select(`
      *,
      usuario_reporta:Usuario!Reporte_id_usuario_reporta_fkey(
        id_usuario,
        nombre,
        apellido,
        email
      ),
      usuario_reportado:Usuario!Reporte_id_usuario_reportado_fkey(
        id_usuario,
        nombre,
        apellido,
        email
      ),
      publicacion:Publicacion!Reporte_id_publicacion_fkey(
        id_publicacion,
        titulo
      ),
      comentario:Comentario!Reporte_id_comentario_fkey(
        id_comentario,
        contenido
      )
    `)
    .eq('id_reporte', id_reporte)
    .single();
  if (error && error.code !== 'PGRST116') throw error;
  return data;
};

// Actualizar estado de un reporte
export const updateReporteEstado = async (id_reporte: number, estado: string) => {
  const updateData: any = { estado };

  // Si se marca como resuelto o rechazado, agregar fecha de resolución
  if (estado === 'resuelto' || estado === 'rechazado') {
    updateData.fecha_resolucion = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from('Reporte')
    .update(updateData)
    .eq('id_reporte', id_reporte)
    .select();
  if (error) throw error;
  return data[0];
};

// Actualizar un reporte
export const updateReporte = async (id_reporte: number, reporte: Partial<Reporte>) => {
  const { data, error } = await supabase
    .from('Reporte')
    .update(reporte)
    .eq('id_reporte', id_reporte)
    .select();
  if (error) throw error;
  return data[0];
};

// Eliminar un reporte
export const deleteReporte = async (id_reporte: number) => {
  const { data, error } = await supabase
    .from('Reporte')
    .delete()
    .eq('id_reporte', id_reporte)
    .select();
  if (error) throw error;
  return data[0];
};
