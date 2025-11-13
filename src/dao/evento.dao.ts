import { supabase } from '../config/db';
import { Evento, InscripcionEvento, EventoConRelaciones } from '../models/Evento';

/**
 * Crear un nuevo evento
 */
export const createEvento = async (evento: Omit<Evento, 'id_evento'>): Promise<Evento> => {
  const { data, error } = await supabase
    .from('Evento')
    .insert([evento])
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Obtener todos los eventos
 */
export const getAllEventos = async (): Promise<EventoConRelaciones[]> => {
  const { data, error } = await supabase
    .from('Evento')
    .select(`
      *,
      categoria:Categoria!fk_evento_categoria(id_categoria, nombre)
    `)
    .order('fecha_evento', { ascending: true });

  if (error) throw error;

  // Obtener inscritos para cada evento
  const eventosConInscritos = await Promise.all(
    (data || []).map(async (evento: any) => {
      const inscritos = await getInscritosByEvento(evento.id_evento);
      return {
        ...evento,
        inscritos,
        total_inscritos: inscritos.length
      };
    })
  );

  return eventosConInscritos;
};

/**
 * Obtener evento por ID
 */
export const getEventoById = async (id_evento: number): Promise<EventoConRelaciones | null> => {
  const { data, error } = await supabase
    .from('Evento')
    .select(`
      *,
      categoria:Categoria!fk_evento_categoria(id_categoria, nombre)
    `)
    .eq('id_evento', id_evento)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  if (!data) return null;

  // Obtener inscritos
  const inscritos = await getInscritosByEvento(id_evento);

  return {
    ...data,
    inscritos,
    total_inscritos: inscritos.length
  };
};

/**
 * Obtener eventos por categoría
 */
export const getEventosByCategoria = async (id_categoria: number): Promise<EventoConRelaciones[]> => {
  const { data, error } = await supabase
    .from('Evento')
    .select(`
      *,
      categoria:Categoria!fk_evento_categoria(id_categoria, nombre)
    `)
    .eq('id_categoria', id_categoria)
    .order('fecha_evento', { ascending: true });

  if (error) throw error;

  const eventosConInscritos = await Promise.all(
    (data || []).map(async (evento: any) => {
      const inscritos = await getInscritosByEvento(evento.id_evento);
      return {
        ...evento,
        inscritos,
        total_inscritos: inscritos.length
      };
    })
  );

  return eventosConInscritos;
};

/**
 * Obtener eventos por modalidad
 */
export const getEventosByModalidad = async (modalidad: string): Promise<EventoConRelaciones[]> => {
  const { data, error } = await supabase
    .from('Evento')
    .select(`
      *,
      categoria:Categoria!fk_evento_categoria(id_categoria, nombre)
    `)
    .eq('modalidad', modalidad)
    .order('fecha_evento', { ascending: true });

  if (error) throw error;

  const eventosConInscritos = await Promise.all(
    (data || []).map(async (evento: any) => {
      const inscritos = await getInscritosByEvento(evento.id_evento);
      return {
        ...evento,
        inscritos,
        total_inscritos: inscritos.length
      };
    })
  );

  return eventosConInscritos;
};

/**
 * Obtener eventos próximos
 */
export const getEventosProximos = async (): Promise<EventoConRelaciones[]> => {
  const fechaActual = new Date().toISOString();

  const { data, error } = await supabase
    .from('Evento')
    .select(`
      *,
      categoria:Categoria!fk_evento_categoria(id_categoria, nombre)
    `)
    .gte('fecha_evento', fechaActual)
    .order('fecha_evento', { ascending: true });

  if (error) throw error;

  const eventosConInscritos = await Promise.all(
    (data || []).map(async (evento: any) => {
      const inscritos = await getInscritosByEvento(evento.id_evento);
      return {
        ...evento,
        inscritos,
        total_inscritos: inscritos.length
      };
    })
  );

  return eventosConInscritos;
};

/**
 * Actualizar un evento
 */
export const updateEvento = async (
  id_evento: number,
  evento: Partial<Omit<Evento, 'id_evento'>>
): Promise<Evento | null> => {
  const { data, error } = await supabase
    .from('Evento')
    .update(evento)
    .eq('id_evento', id_evento)
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Eliminar un evento
 */
export const deleteEvento = async (id_evento: number): Promise<Evento | null> => {
  // Primero eliminar las inscripciones
  await deleteAllInscripcionesFromEvento(id_evento);

  const { data, error } = await supabase
    .from('Evento')
    .delete()
    .eq('id_evento', id_evento)
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Inscribir usuario a un evento
 */
export const inscribirUsuarioToEvento = async (
  id_evento: number,
  id_usuario: number
): Promise<InscripcionEvento> => {
  const { data, error } = await supabase
    .from('InscripcionEvento')
    .insert([{
      id_evento,
      id_usuario,
      fecha_inscripcion: new Date().toISOString()
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Cancelar inscripción de usuario
 */
export const cancelarInscripcion = async (
  id_evento: number,
  id_usuario: number
): Promise<void> => {
  const { error } = await supabase
    .from('InscripcionEvento')
    .delete()
    .eq('id_evento', id_evento)
    .eq('id_usuario', id_usuario);

  if (error) throw error;
};

/**
 * Verificar si un usuario está inscrito
 */
export const isUsuarioInscrito = async (
  id_evento: number,
  id_usuario: number
): Promise<boolean> => {
  const { data, error } = await supabase
    .from('InscripcionEvento')
    .select('id_inscripcion')
    .eq('id_evento', id_evento)
    .eq('id_usuario', id_usuario)
    .single();

  return !error && data !== null;
};

/**
 * Obtener inscritos de un evento
 */
export const getInscritosByEvento = async (id_evento: number): Promise<any[]> => {
  const { data, error } = await supabase
    .from('InscripcionEvento')
    .select(`
      fecha_inscripcion,
      usuario:Usuario!fk_inscripcion_usuario(id_usuario, nombre, apellido, foto_perfil)
    `)
    .eq('id_evento', id_evento)
    .order('fecha_inscripcion', { ascending: true });

  if (error) throw error;

  return (data || []).map((item: any) => ({
    id_usuario: item.usuario.id_usuario,
    nombre: item.usuario.nombre,
    apellido: item.usuario.apellido,
    foto_perfil: item.usuario.foto_perfil,
    fecha_inscripcion: item.fecha_inscripcion
  }));
};

/**
 * Obtener eventos inscritos por usuario
 */
export const getEventosByUsuario = async (id_usuario: number): Promise<EventoConRelaciones[]> => {
  const { data, error } = await supabase
    .from('InscripcionEvento')
    .select('id_evento')
    .eq('id_usuario', id_usuario);

  if (error) throw error;

  const eventoIds = (data || []).map((item: any) => item.id_evento);

  if (eventoIds.length === 0) return [];

  const { data: eventos, error: eventosError } = await supabase
    .from('Evento')
    .select(`
      *,
      categoria:Categoria!fk_evento_categoria(id_categoria, nombre)
    `)
    .in('id_evento', eventoIds)
    .order('fecha_evento', { ascending: true });

  if (eventosError) throw eventosError;

  const eventosConInscritos = await Promise.all(
    (eventos || []).map(async (evento: any) => {
      const inscritos = await getInscritosByEvento(evento.id_evento);
      return {
        ...evento,
        inscritos,
        total_inscritos: inscritos.length
      };
    })
  );

  return eventosConInscritos;
};

/**
 * Eliminar todas las inscripciones de un evento
 */
export const deleteAllInscripcionesFromEvento = async (id_evento: number): Promise<void> => {
  const { error } = await supabase
    .from('InscripcionEvento')
    .delete()
    .eq('id_evento', id_evento);

  if (error) throw error;
};

/**
 * Contar inscritos de un evento
 */
export const countInscritosByEvento = async (id_evento: number): Promise<number> => {
  const { count, error } = await supabase
    .from('InscripcionEvento')
    .select('*', { count: 'exact', head: true })
    .eq('id_evento', id_evento);

  if (error) throw error;
  return count || 0;
};
