"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUsuarioController = exports.changePassword = exports.updateUsuarioController = exports.getUsuario = exports.listUsuarios = exports.getProfile = exports.login = exports.register = void 0;
const usuario_dao_1 = require("../dao/usuario.dao");
const auth_utils_1 = require("../utils/auth.utils");
/**
 * Registro de nuevo usuario
 */
const register = async (req, res) => {
    try {
        const { nombre, apellido, cedula, telefono, correo, contrasena, carrera, id_rol } = req.body;
        // Validaciones básicas
        if (!nombre || !apellido || !cedula || !correo || !contrasena) {
            res.status(400).json({ message: 'Faltan campos obligatorios' });
            return;
        }
        // Verificar si el correo ya existe
        if (await (0, usuario_dao_1.emailExists)(correo)) {
            res.status(409).json({ message: 'El correo ya está registrado' });
            return;
        }
        // Verificar si la cédula ya existe
        if (await (0, usuario_dao_1.cedulaExists)(cedula)) {
            res.status(409).json({ message: 'La cédula ya está registrada' });
            return;
        }
        // Hashear contraseña
        const hashedPassword = await (0, auth_utils_1.hashPassword)(contrasena);
        // Crear usuario (rol por defecto: 2 = Usuario estándar)
        const nuevoUsuario = await (0, usuario_dao_1.createUsuario)({
            nombre,
            apellido,
            cedula,
            telefono,
            correo,
            contrasena: hashedPassword,
            carrera,
            id_rol: id_rol || 2,
        });
        // Generar token
        const token = (0, auth_utils_1.generateToken)({
            id_usuario: nuevoUsuario.id_usuario,
            correo: nuevoUsuario.correo,
            id_rol: nuevoUsuario.id_rol,
        });
        // Eliminar contraseña de la respuesta
        const { contrasena: _, ...usuarioSinContrasena } = nuevoUsuario;
        res.status(201).json({
            message: 'Usuario registrado exitosamente',
            usuario: usuarioSinContrasena,
            token,
        });
    }
    catch (err) {
        console.error('Error en register:', err);
        res.status(500).json({ message: err.message || 'Error al registrar usuario' });
    }
};
exports.register = register;
/**
 * Login de usuario
 */
const login = async (req, res) => {
    try {
        const { correo, contrasena } = req.body;
        // Validaciones
        if (!correo || !contrasena) {
            res.status(400).json({ message: 'Correo y contraseña son obligatorios' });
            return;
        }
        // Buscar usuario por correo
        const usuario = await (0, usuario_dao_1.getUsuarioByEmail)(correo);
        if (!usuario) {
            res.status(401).json({ message: 'Credenciales inválidas' });
            return;
        }
        // Verificar contraseña
        const passwordMatch = await (0, auth_utils_1.comparePassword)(contrasena, usuario.contrasena);
        if (!passwordMatch) {
            res.status(401).json({ message: 'Credenciales inválidas' });
            return;
        }
        // Generar token
        const token = (0, auth_utils_1.generateToken)({
            id_usuario: usuario.id_usuario,
            correo: usuario.correo,
            id_rol: usuario.id_rol,
        });
        // Eliminar contraseña de la respuesta
        const { contrasena: _, ...usuarioSinContrasena } = usuario;
        res.json({
            message: 'Login exitoso',
            usuario: usuarioSinContrasena,
            token,
        });
    }
    catch (err) {
        console.error('Error en login:', err);
        res.status(500).json({ message: err.message || 'Error al iniciar sesión' });
    }
};
exports.login = login;
/**
 * Obtener perfil del usuario autenticado
 */
const getProfile = async (req, res) => {
    try {
        if (!req.usuario) {
            res.status(401).json({ message: 'No autenticado' });
            return;
        }
        const usuario = await (0, usuario_dao_1.getUsuarioById)(req.usuario.id_usuario);
        if (!usuario) {
            res.status(404).json({ message: 'Usuario no encontrado' });
            return;
        }
        res.json(usuario);
    }
    catch (err) {
        console.error('Error en getProfile:', err);
        res.status(500).json({ message: err.message });
    }
};
exports.getProfile = getProfile;
/**
 * Listar todos los usuarios
 */
const listUsuarios = async (req, res) => {
    try {
        const usuarios = await (0, usuario_dao_1.getAllUsuarios)();
        res.json(usuarios);
    }
    catch (err) {
        console.error('Error en listUsuarios:', err);
        res.status(500).json({ message: err.message });
    }
};
exports.listUsuarios = listUsuarios;
/**
 * Obtener usuario por ID
 */
const getUsuario = async (req, res) => {
    try {
        const id_usuario = Number(req.params.id);
        if (Number.isNaN(id_usuario)) {
            res.status(400).json({ message: 'ID inválido' });
            return;
        }
        const usuario = await (0, usuario_dao_1.getUsuarioById)(id_usuario);
        if (!usuario) {
            res.status(404).json({ message: 'Usuario no encontrado' });
            return;
        }
        res.json(usuario);
    }
    catch (err) {
        console.error('Error en getUsuario:', err);
        res.status(500).json({ message: err.message });
    }
};
exports.getUsuario = getUsuario;
/**
 * Actualizar usuario
 */
const updateUsuarioController = async (req, res) => {
    try {
        const id_usuario = Number(req.params.id);
        if (Number.isNaN(id_usuario)) {
            res.status(400).json({ message: 'ID inválido' });
            return;
        }
        // Verificar que el usuario autenticado solo pueda actualizar su propio perfil
        // (a menos que sea admin)
        if (req.usuario && req.usuario.id_usuario !== id_usuario && req.usuario.id_rol !== 1) {
            res.status(403).json({ message: 'No tienes permisos para actualizar este usuario' });
            return;
        }
        const usuario = await (0, usuario_dao_1.updateUsuario)(id_usuario, req.body);
        if (!usuario) {
            res.status(404).json({ message: 'Usuario no encontrado' });
            return;
        }
        res.json({ message: 'Usuario actualizado exitosamente', usuario });
    }
    catch (err) {
        console.error('Error en updateUsuario:', err);
        res.status(500).json({ message: err.message });
    }
};
exports.updateUsuarioController = updateUsuarioController;
/**
 * Cambiar contraseña
 */
const changePassword = async (req, res) => {
    try {
        const { contrasenaActual, contrasenaNueva } = req.body;
        if (!req.usuario) {
            res.status(401).json({ message: 'No autenticado' });
            return;
        }
        if (!contrasenaActual || !contrasenaNueva) {
            res.status(400).json({ message: 'Faltan campos obligatorios' });
            return;
        }
        // Obtener usuario con contraseña
        const usuario = await (0, usuario_dao_1.getUsuarioByEmail)(req.usuario.correo);
        if (!usuario) {
            res.status(404).json({ message: 'Usuario no encontrado' });
            return;
        }
        // Verificar contraseña actual
        const passwordMatch = await (0, auth_utils_1.comparePassword)(contrasenaActual, usuario.contrasena);
        if (!passwordMatch) {
            res.status(401).json({ message: 'Contraseña actual incorrecta' });
            return;
        }
        // Hashear nueva contraseña
        const hashedPassword = await (0, auth_utils_1.hashPassword)(contrasenaNueva);
        // Actualizar contraseña
        await (0, usuario_dao_1.updatePassword)(req.usuario.id_usuario, hashedPassword);
        res.json({ message: 'Contraseña actualizada exitosamente' });
    }
    catch (err) {
        console.error('Error en changePassword:', err);
        res.status(500).json({ message: err.message });
    }
};
exports.changePassword = changePassword;
/**
 * Eliminar usuario
 */
const deleteUsuarioController = async (req, res) => {
    try {
        const id_usuario = Number(req.params.id);
        if (Number.isNaN(id_usuario)) {
            res.status(400).json({ message: 'ID inválido' });
            return;
        }
        const usuario = await (0, usuario_dao_1.deleteUsuario)(id_usuario);
        if (!usuario) {
            res.status(404).json({ message: 'Usuario no encontrado' });
            return;
        }
        res.json({ message: 'Usuario eliminado exitosamente' });
    }
    catch (err) {
        console.error('Error en deleteUsuario:', err);
        res.status(500).json({ message: err.message });
    }
};
exports.deleteUsuarioController = deleteUsuarioController;
