"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.countInscritosByEvento = exports.deleteAllInscripcionesFromEvento = exports.getEventosByUsuario = exports.getInscritosByEvento = exports.isUsuarioInscrito = exports.cancelarInscripcion = exports.inscribirUsuarioToEvento = exports.deleteEvento = exports.updateEvento = exports.getEventosProximos = exports.getEventosByModalidad = exports.getEventosByCategoria = exports.getEventoById = exports.getAllEventos = exports.createEvento = void 0;
const db_1 = require("../config/db");
/**
 * Crear un nuevo evento
 */
const createEvento = async (evento) => {
    const { data, error } = await db_1.supabase
        .from('Evento')
        .insert([evento])
        .select()
        .single();
    if (error)
        throw error;
    return data;
};
exports.createEvento = createEvento;
/**
 * Obtener todos los eventos
 */
const getAllEventos = async () => {
    const { data, error } = await db_1.supabase
        .from('Evento')
        .select(`
      *,
      categoria:Categoria!Evento_id_categoria_fkey(id_categoria, nombre)
    `)
        .order('fecha_evento', { ascending: true });
    if (error)
        throw error;
    // Obtener inscritos para cada evento
    const eventosConInscritos = await Promise.all((data || []).map(async (evento) => {
        const inscritos = await (0, exports.getInscritosByEvento)(evento.id_evento);
        return {
            ...evento,
            inscritos,
            total_inscritos: inscritos.length
        };
    }));
    return eventosConInscritos;
};
exports.getAllEventos = getAllEventos;
/**
 * Obtener evento por ID
 */
const getEventoById = async (id_evento) => {
    const { data, error } = await db_1.supabase
        .from('Evento')
        .select(`
      *,
      categoria:Categoria!Evento_id_categoria_fkey(id_categoria, nombre)
    `)
        .eq('id_evento', id_evento)
        .single();
    if (error && error.code !== 'PGRST116')
        throw error;
    if (!data)
        return null;
    // Obtener inscritos
    const inscritos = await (0, exports.getInscritosByEvento)(id_evento);
    return {
        ...data,
        inscritos,
        total_inscritos: inscritos.length
    };
};
exports.getEventoById = getEventoById;
/**
 * Obtener eventos por categoría
 */
const getEventosByCategoria = async (id_categoria) => {
    const { data, error } = await db_1.supabase
        .from('Evento')
        .select(`
      *,
      categoria:Categoria!Evento_id_categoria_fkey(id_categoria, nombre)
    `)
        .eq('id_categoria', id_categoria)
        .order('fecha_evento', { ascending: true });
    if (error)
        throw error;
    const eventosConInscritos = await Promise.all((data || []).map(async (evento) => {
        const inscritos = await (0, exports.getInscritosByEvento)(evento.id_evento);
        return {
            ...evento,
            inscritos,
            total_inscritos: inscritos.length
        };
    }));
    return eventosConInscritos;
};
exports.getEventosByCategoria = getEventosByCategoria;
/**
 * Obtener eventos por modalidad
 */
const getEventosByModalidad = async (modalidad) => {
    const { data, error } = await db_1.supabase
        .from('Evento')
        .select(`
      *,
      categoria:Categoria!Evento_id_categoria_fkey(id_categoria, nombre)
    `)
        .eq('modalidad', modalidad)
        .order('fecha_evento', { ascending: true });
    if (error)
        throw error;
    const eventosConInscritos = await Promise.all((data || []).map(async (evento) => {
        const inscritos = await (0, exports.getInscritosByEvento)(evento.id_evento);
        return {
            ...evento,
            inscritos,
            total_inscritos: inscritos.length
        };
    }));
    return eventosConInscritos;
};
exports.getEventosByModalidad = getEventosByModalidad;
/**
 * Obtener eventos próximos
 */
const getEventosProximos = async () => {
    const fechaActual = new Date().toISOString();
    const { data, error } = await db_1.supabase
        .from('Evento')
        .select(`
      *,
      categoria:Categoria!Evento_id_categoria_fkey(id_categoria, nombre)
    `)
        .gte('fecha_evento', fechaActual)
        .order('fecha_evento', { ascending: true });
    if (error)
        throw error;
    const eventosConInscritos = await Promise.all((data || []).map(async (evento) => {
        const inscritos = await (0, exports.getInscritosByEvento)(evento.id_evento);
        return {
            ...evento,
            inscritos,
            total_inscritos: inscritos.length
        };
    }));
    return eventosConInscritos;
};
exports.getEventosProximos = getEventosProximos;
/**
 * Actualizar un evento
 */
const updateEvento = async (id_evento, evento) => {
    const { data, error } = await db_1.supabase
        .from('Evento')
        .update(evento)
        .eq('id_evento', id_evento)
        .select()
        .single();
    if (error)
        throw error;
    return data;
};
exports.updateEvento = updateEvento;
/**
 * Eliminar un evento
 */
const deleteEvento = async (id_evento) => {
    // Primero eliminar las inscripciones
    await (0, exports.deleteAllInscripcionesFromEvento)(id_evento);
    const { data, error } = await db_1.supabase
        .from('Evento')
        .delete()
        .eq('id_evento', id_evento)
        .select()
        .single();
    if (error)
        throw error;
    return data;
};
exports.deleteEvento = deleteEvento;
/**
 * Inscribir usuario a un evento
 */
const inscribirUsuarioToEvento = async (id_evento, id_usuario) => {
    const { data, error } = await db_1.supabase
        .from('InscripcionEvento')
        .insert([{
            id_evento,
            id_usuario,
            fecha_inscripcion: new Date().toISOString()
        }])
        .select()
        .single();
    if (error)
        throw error;
    return data;
};
exports.inscribirUsuarioToEvento = inscribirUsuarioToEvento;
/**
 * Cancelar inscripción de usuario
 */
const cancelarInscripcion = async (id_evento, id_usuario) => {
    const { error } = await db_1.supabase
        .from('InscripcionEvento')
        .delete()
        .eq('id_evento', id_evento)
        .eq('id_usuario', id_usuario);
    if (error)
        throw error;
};
exports.cancelarInscripcion = cancelarInscripcion;
/**
 * Verificar si un usuario está inscrito
 */
const isUsuarioInscrito = async (id_evento, id_usuario) => {
    const { data, error } = await db_1.supabase
        .from('InscripcionEvento')
        .select('id_inscripcion')
        .eq('id_evento', id_evento)
        .eq('id_usuario', id_usuario)
        .single();
    return !error && data !== null;
};
exports.isUsuarioInscrito = isUsuarioInscrito;
/**
 * Obtener inscritos de un evento
 */
const getInscritosByEvento = async (id_evento) => {
    const { data, error } = await db_1.supabase
        .from('InscripcionEvento')
        .select(`
      fecha_inscripcion,
      usuario:Usuario!InscripcionEvento_id_usuario_fkey(id_usuario, nombre, apellido, foto_perfil)
    `)
        .eq('id_evento', id_evento)
        .order('fecha_inscripcion', { ascending: true });
    if (error)
        throw error;
    return (data || []).map((item) => ({
        id_usuario: item.usuario.id_usuario,
        nombre: item.usuario.nombre,
        apellido: item.usuario.apellido,
        foto_perfil: item.usuario.foto_perfil,
        fecha_inscripcion: item.fecha_inscripcion
    }));
};
exports.getInscritosByEvento = getInscritosByEvento;
/**
 * Obtener eventos inscritos por usuario
 */
const getEventosByUsuario = async (id_usuario) => {
    const { data, error } = await db_1.supabase
        .from('InscripcionEvento')
        .select('id_evento')
        .eq('id_usuario', id_usuario);
    if (error)
        throw error;
    const eventoIds = (data || []).map((item) => item.id_evento);
    if (eventoIds.length === 0)
        return [];
    const { data: eventos, error: eventosError } = await db_1.supabase
        .from('Evento')
        .select(`
      *,
      categoria:Categoria!Evento_id_categoria_fkey(id_categoria, nombre)
    `)
        .in('id_evento', eventoIds)
        .order('fecha_evento', { ascending: true });
    if (eventosError)
        throw eventosError;
    const eventosConInscritos = await Promise.all((eventos || []).map(async (evento) => {
        const inscritos = await (0, exports.getInscritosByEvento)(evento.id_evento);
        return {
            ...evento,
            inscritos,
            total_inscritos: inscritos.length
        };
    }));
    return eventosConInscritos;
};
exports.getEventosByUsuario = getEventosByUsuario;
/**
 * Eliminar todas las inscripciones de un evento
 */
const deleteAllInscripcionesFromEvento = async (id_evento) => {
    const { error } = await db_1.supabase
        .from('InscripcionEvento')
        .delete()
        .eq('id_evento', id_evento);
    if (error)
        throw error;
};
exports.deleteAllInscripcionesFromEvento = deleteAllInscripcionesFromEvento;
/**
 * Contar inscritos de un evento
 */
const countInscritosByEvento = async (id_evento) => {
    const { count, error } = await db_1.supabase
        .from('InscripcionEvento')
        .select('*', { count: 'exact', head: true })
        .eq('id_evento', id_evento);
    if (error)
        throw error;
    return count || 0;
};
exports.countInscritosByEvento = countInscritosByEvento;
