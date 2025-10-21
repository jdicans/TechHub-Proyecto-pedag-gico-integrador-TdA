"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReporte = exports.updateReporte = exports.updateReporteEstado = exports.getReporteById = exports.getReportesByComentario = exports.getReportesByPublicacion = exports.getReportesByUsuarioReportado = exports.getReportesByUsuarioReporta = exports.getReportesByEstado = exports.getAllReportes = exports.createReporte = void 0;
const db_1 = require("../config/db");
// Crear un nuevo reporte
const createReporte = async (reporte) => {
    const reporteData = {
        ...reporte,
        fecha_reporte: new Date().toISOString(),
        estado: 'pendiente'
    };
    const { data, error } = await db_1.supabase
        .from('Reporte')
        .insert([reporteData])
        .select();
    if (error)
        throw error;
    return data[0];
};
exports.createReporte = createReporte;
// Obtener todos los reportes con relaciones
const getAllReportes = async () => {
    const { data, error } = await db_1.supabase
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
    if (error)
        throw error;
    return data;
};
exports.getAllReportes = getAllReportes;
// Obtener reportes por estado
const getReportesByEstado = async (estado) => {
    const { data, error } = await db_1.supabase
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
    if (error)
        throw error;
    return data;
};
exports.getReportesByEstado = getReportesByEstado;
// Obtener reportes realizados por un usuario
const getReportesByUsuarioReporta = async (id_usuario) => {
    const { data, error } = await db_1.supabase
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
    if (error)
        throw error;
    return data;
};
exports.getReportesByUsuarioReporta = getReportesByUsuarioReporta;
// Obtener reportes sobre un usuario específico
const getReportesByUsuarioReportado = async (id_usuario) => {
    const { data, error } = await db_1.supabase
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
    if (error)
        throw error;
    return data;
};
exports.getReportesByUsuarioReportado = getReportesByUsuarioReportado;
// Obtener reportes sobre una publicación específica
const getReportesByPublicacion = async (id_publicacion) => {
    const { data, error } = await db_1.supabase
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
    if (error)
        throw error;
    return data;
};
exports.getReportesByPublicacion = getReportesByPublicacion;
// Obtener reportes sobre un comentario específico
const getReportesByComentario = async (id_comentario) => {
    const { data, error } = await db_1.supabase
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
    if (error)
        throw error;
    return data;
};
exports.getReportesByComentario = getReportesByComentario;
// Obtener reporte por id
const getReporteById = async (id_reporte) => {
    const { data, error } = await db_1.supabase
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
    if (error && error.code !== 'PGRST116')
        throw error;
    return data;
};
exports.getReporteById = getReporteById;
// Actualizar estado de un reporte
const updateReporteEstado = async (id_reporte, estado) => {
    const updateData = { estado };
    // Si se marca como resuelto o rechazado, agregar fecha de resolución
    if (estado === 'resuelto' || estado === 'rechazado') {
        updateData.fecha_resolucion = new Date().toISOString();
    }
    const { data, error } = await db_1.supabase
        .from('Reporte')
        .update(updateData)
        .eq('id_reporte', id_reporte)
        .select();
    if (error)
        throw error;
    return data[0];
};
exports.updateReporteEstado = updateReporteEstado;
// Actualizar un reporte
const updateReporte = async (id_reporte, reporte) => {
    const { data, error } = await db_1.supabase
        .from('Reporte')
        .update(reporte)
        .eq('id_reporte', id_reporte)
        .select();
    if (error)
        throw error;
    return data[0];
};
exports.updateReporte = updateReporte;
// Eliminar un reporte
const deleteReporte = async (id_reporte) => {
    const { data, error } = await db_1.supabase
        .from('Reporte')
        .delete()
        .eq('id_reporte', id_reporte)
        .select();
    if (error)
        throw error;
    return data[0];
};
exports.deleteReporte = deleteReporte;
