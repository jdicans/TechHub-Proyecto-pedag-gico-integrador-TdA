"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUsuario = exports.updatePassword = exports.updateUsuario = exports.cedulaExists = exports.emailExists = exports.getUsuarioByEmail = exports.getUsuarioById = exports.getAllUsuarios = exports.createUsuario = void 0;
const db_1 = require("../config/db");
/**
 * Crear un nuevo usuario
 */
const createUsuario = async (usuario) => {
    const { data, error } = await db_1.supabase
        .from('Usuario')
        .insert([{
            ...usuario,
            fecha_registro: new Date().toISOString()
        }])
        .select()
        .single();
    if (error)
        throw error;
    return data;
};
exports.createUsuario = createUsuario;
/**
 * Obtener todos los usuarios (sin contraseñas)
 */
const getAllUsuarios = async () => {
    const { data, error } = await db_1.supabase
        .from('Usuario')
        .select('id_usuario, nombre, apellido, cedula, telefono, correo, carrera, foto_perfil, fecha_registro, id_rol');
    if (error)
        throw error;
    return data || [];
};
exports.getAllUsuarios = getAllUsuarios;
/**
 * Obtener usuario por ID (sin contraseña)
 */
const getUsuarioById = async (id_usuario) => {
    const { data, error } = await db_1.supabase
        .from('Usuario')
        .select('id_usuario, nombre, apellido, cedula, telefono, correo, carrera, foto_perfil, fecha_registro, id_rol')
        .eq('id_usuario', id_usuario)
        .single();
    if (error && error.code !== 'PGRST116')
        throw error;
    return data;
};
exports.getUsuarioById = getUsuarioById;
/**
 * Obtener usuario por correo (incluye contraseña para autenticación)
 */
const getUsuarioByEmail = async (correo) => {
    const { data, error } = await db_1.supabase
        .from('Usuario')
        .select('*')
        .eq('correo', correo)
        .single();
    if (error && error.code !== 'PGRST116')
        throw error;
    return data;
};
exports.getUsuarioByEmail = getUsuarioByEmail;
/**
 * Verificar si un correo ya está registrado
 */
const emailExists = async (correo) => {
    const { data, error } = await db_1.supabase
        .from('Usuario')
        .select('id_usuario')
        .eq('correo', correo)
        .single();
    return !error && data !== null;
};
exports.emailExists = emailExists;
/**
 * Verificar si una cédula ya está registrada
 */
const cedulaExists = async (cedula) => {
    const { data, error } = await db_1.supabase
        .from('Usuario')
        .select('id_usuario')
        .eq('cedula', cedula)
        .single();
    return !error && data !== null;
};
exports.cedulaExists = cedulaExists;
/**
 * Actualizar un usuario
 */
const updateUsuario = async (id_usuario, usuario) => {
    const { data, error } = await db_1.supabase
        .from('Usuario')
        .update(usuario)
        .eq('id_usuario', id_usuario)
        .select('id_usuario, nombre, apellido, cedula, telefono, correo, carrera, foto_perfil, fecha_registro, id_rol')
        .single();
    if (error)
        throw error;
    return data;
};
exports.updateUsuario = updateUsuario;
/**
 * Actualizar contraseña de usuario
 */
const updatePassword = async (id_usuario, hashedPassword) => {
    const { error } = await db_1.supabase
        .from('Usuario')
        .update({ contrasena: hashedPassword })
        .eq('id_usuario', id_usuario);
    if (error)
        throw error;
};
exports.updatePassword = updatePassword;
/**
 * Eliminar un usuario
 */
const deleteUsuario = async (id_usuario) => {
    const { data, error } = await db_1.supabase
        .from('Usuario')
        .delete()
        .eq('id_usuario', id_usuario)
        .select('id_usuario, nombre, apellido, cedula, telefono, correo, carrera, foto_perfil, fecha_registro, id_rol')
        .single();
    if (error)
        throw error;
    return data;
};
exports.deleteUsuario = deleteUsuario;
