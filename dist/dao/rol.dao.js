"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRol = exports.updateRol = exports.getRolById = exports.getAllRoles = exports.createRol = void 0;
const db_1 = require("../config/db");
// Crear un nuevo rol
const createRol = async (rol) => {
    const { data, error } = await db_1.supabase
        .from('Rol')
        .insert([rol])
        .select();
    if (error)
        throw error;
    return data[0];
};
exports.createRol = createRol;
// Obtener todos los roles
const getAllRoles = async () => {
    const { data, error } = await db_1.supabase
        .from('Rol')
        .select('*');
    console.log('🔍 Supabase query result:', { data, error });
    if (error) {
        console.error('❌ Supabase error:', error);
        throw error;
    }
    return data;
};
exports.getAllRoles = getAllRoles;
// Obtener rol por id
const getRolById = async (id_rol) => {
    const { data, error } = await db_1.supabase
        .from('Rol')
        .select('*')
        .eq('id_rol', id_rol)
        .single();
    if (error && error.code !== 'PGRST116')
        throw error;
    return data;
};
exports.getRolById = getRolById;
// Actualizar un rol
const updateRol = async (id_rol, rol) => {
    const { data, error } = await db_1.supabase
        .from('Rol')
        .update(rol)
        .eq('id_rol', id_rol)
        .select();
    if (error)
        throw error;
    return data[0];
};
exports.updateRol = updateRol;
// Eliminar un rol
const deleteRol = async (id_rol) => {
    const { data, error } = await db_1.supabase
        .from('Rol')
        .delete()
        .eq('id_rol', id_rol)
        .select();
    if (error)
        throw error;
    return data[0];
};
exports.deleteRol = deleteRol;
