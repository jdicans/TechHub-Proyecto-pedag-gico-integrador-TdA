"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.countMiembrosByGrupo = exports.removeAllMiembrosFromGrupo = exports.getMiembroRol = exports.isMiembroOfGrupo = exports.getMiembrosByGrupo = exports.updateMiembroRol = exports.removeMiembroFromGrupo = exports.addMiembroToGrupo = exports.deleteGrupoEstudio = exports.updateGrupoEstudio = exports.getGruposByUsuario = exports.getGrupoEstudioById = exports.getAllGruposEstudio = exports.createGrupoEstudio = void 0;
const db_1 = require("../config/db");
/**
 * Crear un nuevo grupo de estudio
 */
const createGrupoEstudio = async (grupo) => {
    const { data, error } = await db_1.supabase
        .from('GrupoEstudio')
        .insert([{
            ...grupo,
            fecha_creacion: new Date().toISOString()
        }])
        .select()
        .single();
    if (error)
        throw error;
    return data;
};
exports.createGrupoEstudio = createGrupoEstudio;
/**
 * Obtener todos los grupos de estudio
 */
const getAllGruposEstudio = async () => {
    const { data, error } = await db_1.supabase
        .from('GrupoEstudio')
        .select('*')
        .order('fecha_creacion', { ascending: false });
    if (error)
        throw error;
    // Obtener miembros para cada grupo
    const gruposConMiembros = await Promise.all((data || []).map(async (grupo) => {
        const miembros = await (0, exports.getMiembrosByGrupo)(grupo.id_grupo);
        return {
            ...grupo,
            miembros,
            total_miembros: miembros.length
        };
    }));
    return gruposConMiembros;
};
exports.getAllGruposEstudio = getAllGruposEstudio;
/**
 * Obtener grupo de estudio por ID
 */
const getGrupoEstudioById = async (id_grupo) => {
    const { data, error } = await db_1.supabase
        .from('GrupoEstudio')
        .select('*')
        .eq('id_grupo', id_grupo)
        .single();
    if (error && error.code !== 'PGRST116')
        throw error;
    if (!data)
        return null;
    // Obtener miembros del grupo
    const miembros = await (0, exports.getMiembrosByGrupo)(id_grupo);
    return {
        ...data,
        miembros,
        total_miembros: miembros.length
    };
};
exports.getGrupoEstudioById = getGrupoEstudioById;
/**
 * Obtener grupos por usuario
 */
const getGruposByUsuario = async (id_usuario) => {
    const { data, error } = await db_1.supabase
        .from('GrupoUsuario')
        .select('id_grupo')
        .eq('id_usuario', id_usuario);
    if (error)
        throw error;
    const grupoIds = (data || []).map((item) => item.id_grupo);
    if (grupoIds.length === 0)
        return [];
    const { data: grupos, error: gruposError } = await db_1.supabase
        .from('GrupoEstudio')
        .select('*')
        .in('id_grupo', grupoIds)
        .order('fecha_creacion', { ascending: false });
    if (gruposError)
        throw gruposError;
    const gruposConMiembros = await Promise.all((grupos || []).map(async (grupo) => {
        const miembros = await (0, exports.getMiembrosByGrupo)(grupo.id_grupo);
        return {
            ...grupo,
            miembros,
            total_miembros: miembros.length
        };
    }));
    return gruposConMiembros;
};
exports.getGruposByUsuario = getGruposByUsuario;
/**
 * Actualizar un grupo de estudio
 */
const updateGrupoEstudio = async (id_grupo, grupo) => {
    const { data, error } = await db_1.supabase
        .from('GrupoEstudio')
        .update(grupo)
        .eq('id_grupo', id_grupo)
        .select()
        .single();
    if (error)
        throw error;
    return data;
};
exports.updateGrupoEstudio = updateGrupoEstudio;
/**
 * Eliminar un grupo de estudio
 */
const deleteGrupoEstudio = async (id_grupo) => {
    // Primero eliminar todas las relaciones con usuarios
    await (0, exports.removeAllMiembrosFromGrupo)(id_grupo);
    const { data, error } = await db_1.supabase
        .from('GrupoEstudio')
        .delete()
        .eq('id_grupo', id_grupo)
        .select()
        .single();
    if (error)
        throw error;
    return data;
};
exports.deleteGrupoEstudio = deleteGrupoEstudio;
/**
 * Agregar miembro a un grupo
 */
const addMiembroToGrupo = async (id_grupo, id_usuario, rol_grupo = 'miembro') => {
    const { data, error } = await db_1.supabase
        .from('GrupoUsuario')
        .insert([{
            id_grupo,
            id_usuario,
            rol_grupo,
            fecha_union: new Date().toISOString()
        }])
        .select()
        .single();
    if (error)
        throw error;
    return data;
};
exports.addMiembroToGrupo = addMiembroToGrupo;
/**
 * Remover miembro de un grupo
 */
const removeMiembroFromGrupo = async (id_grupo, id_usuario) => {
    const { error } = await db_1.supabase
        .from('GrupoUsuario')
        .delete()
        .eq('id_grupo', id_grupo)
        .eq('id_usuario', id_usuario);
    if (error)
        throw error;
};
exports.removeMiembroFromGrupo = removeMiembroFromGrupo;
/**
 * Actualizar rol de un miembro en el grupo
 */
const updateMiembroRol = async (id_grupo, id_usuario, rol_grupo) => {
    const { data, error } = await db_1.supabase
        .from('GrupoUsuario')
        .update({ rol_grupo })
        .eq('id_grupo', id_grupo)
        .eq('id_usuario', id_usuario)
        .select()
        .single();
    if (error)
        throw error;
    return data;
};
exports.updateMiembroRol = updateMiembroRol;
/**
 * Obtener miembros de un grupo
 */
const getMiembrosByGrupo = async (id_grupo) => {
    const { data, error } = await db_1.supabase
        .from('GrupoUsuario')
        .select(`
      rol_grupo,
      fecha_union,
      usuario:Usuario!GrupoUsuario_id_usuario_fkey(id_usuario, nombre, apellido, foto_perfil)
    `)
        .eq('id_grupo', id_grupo)
        .order('fecha_union', { ascending: true });
    if (error)
        throw error;
    return (data || []).map((item) => ({
        id_usuario: item.usuario.id_usuario,
        nombre: item.usuario.nombre,
        apellido: item.usuario.apellido,
        foto_perfil: item.usuario.foto_perfil,
        rol_grupo: item.rol_grupo,
        fecha_union: item.fecha_union
    }));
};
exports.getMiembrosByGrupo = getMiembrosByGrupo;
/**
 * Verificar si un usuario es miembro de un grupo
 */
const isMiembroOfGrupo = async (id_grupo, id_usuario) => {
    const { data, error } = await db_1.supabase
        .from('GrupoUsuario')
        .select('id_grupo')
        .eq('id_grupo', id_grupo)
        .eq('id_usuario', id_usuario)
        .single();
    return !error && data !== null;
};
exports.isMiembroOfGrupo = isMiembroOfGrupo;
/**
 * Obtener rol de un usuario en un grupo
 */
const getMiembroRol = async (id_grupo, id_usuario) => {
    const { data, error } = await db_1.supabase
        .from('GrupoUsuario')
        .select('rol_grupo')
        .eq('id_grupo', id_grupo)
        .eq('id_usuario', id_usuario)
        .single();
    if (error || !data)
        return null;
    return data.rol_grupo;
};
exports.getMiembroRol = getMiembroRol;
/**
 * Remover todos los miembros de un grupo
 */
const removeAllMiembrosFromGrupo = async (id_grupo) => {
    const { error } = await db_1.supabase
        .from('GrupoUsuario')
        .delete()
        .eq('id_grupo', id_grupo);
    if (error)
        throw error;
};
exports.removeAllMiembrosFromGrupo = removeAllMiembrosFromGrupo;
/**
 * Contar miembros de un grupo
 */
const countMiembrosByGrupo = async (id_grupo) => {
    const { count, error } = await db_1.supabase
        .from('GrupoUsuario')
        .select('*', { count: 'exact', head: true })
        .eq('id_grupo', id_grupo);
    if (error)
        throw error;
    return count || 0;
};
exports.countMiembrosByGrupo = countMiembrosByGrupo;
