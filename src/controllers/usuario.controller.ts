import { Request, Response } from 'express';
import {
  createUsuario,
  getAllUsuarios,
  getUsuarioById,
  getUsuarioByEmail,
  emailExists,
  cedulaExists,
  updateUsuario,
  updatePassword,
  deleteUsuario,
} from '../dao/usuario.dao';
import { hashPassword, comparePassword, generateToken } from '../utils/auth.utils';
import { RegisterRequest, LoginRequest } from '../models/Usuario';

/**
 * Registro de nuevo usuario
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nombre, apellido, cedula, telefono, correo, contrasena, carrera, id_rol }: RegisterRequest = req.body;

    // Validaciones básicas
    if (!nombre || !apellido || !cedula || !correo || !contrasena) {
      res.status(400).json({ message: 'Faltan campos obligatorios' });
      return;
    }

    // Verificar si el correo ya existe
    if (await emailExists(correo)) {
      res.status(409).json({ message: 'El correo ya está registrado' });
      return;
    }

    // Verificar si la cédula ya existe
    if (await cedulaExists(cedula)) {
      res.status(409).json({ message: 'La cédula ya está registrada' });
      return;
    }

    // Hashear contraseña
    const hashedPassword = await hashPassword(contrasena);

    // Crear usuario (rol por defecto: 2 = Usuario estándar)
    const nuevoUsuario = await createUsuario({
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
    const token = generateToken({
      id_usuario: nuevoUsuario.id_usuario!,
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
  } catch (err: any) {
    console.error('Error en register:', err);
    res.status(500).json({ message: err.message || 'Error al registrar usuario' });
  }
};

/**
 * Login de usuario
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { correo, contrasena }: LoginRequest = req.body;

    // Validaciones
    if (!correo || !contrasena) {
      res.status(400).json({ message: 'Correo y contraseña son obligatorios' });
      return;
    }

    // Buscar usuario por correo
    const usuario = await getUsuarioByEmail(correo);

    if (!usuario) {
      res.status(401).json({ message: 'Credenciales inválidas' });
      return;
    }

    // Verificar contraseña
    const passwordMatch = await comparePassword(contrasena, usuario.contrasena);

    if (!passwordMatch) {
      res.status(401).json({ message: 'Credenciales inválidas' });
      return;
    }

    // Generar token
    const token = generateToken({
      id_usuario: usuario.id_usuario!,
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
  } catch (err: any) {
    console.error('Error en login:', err);
    res.status(500).json({ message: err.message || 'Error al iniciar sesión' });
  }
};

/**
 * Obtener perfil del usuario autenticado
 */
export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.usuario) {
      res.status(401).json({ message: 'No autenticado' });
      return;
    }

    const usuario = await getUsuarioById(req.usuario.id_usuario);

    if (!usuario) {
      res.status(404).json({ message: 'Usuario no encontrado' });
      return;
    }

    res.json(usuario);
  } catch (err: any) {
    console.error('Error en getProfile:', err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Listar todos los usuarios
 */
export const listUsuarios = async (req: Request, res: Response): Promise<void> => {
  try {
    const usuarios = await getAllUsuarios();
    res.json(usuarios);
  } catch (err: any) {
    console.error('Error en listUsuarios:', err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Obtener usuario por ID
 */
export const getUsuario = async (req: Request, res: Response): Promise<void> => {
  try {
    const id_usuario = Number(req.params.id);

    if (Number.isNaN(id_usuario)) {
      res.status(400).json({ message: 'ID inválido' });
      return;
    }

    const usuario = await getUsuarioById(id_usuario);

    if (!usuario) {
      res.status(404).json({ message: 'Usuario no encontrado' });
      return;
    }

    res.json(usuario);
  } catch (err: any) {
    console.error('Error en getUsuario:', err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Actualizar usuario
 */
export const updateUsuarioController = async (req: Request, res: Response): Promise<void> => {
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

    const usuario = await updateUsuario(id_usuario, req.body);

    if (!usuario) {
      res.status(404).json({ message: 'Usuario no encontrado' });
      return;
    }

    res.json({ message: 'Usuario actualizado exitosamente', usuario });
  } catch (err: any) {
    console.error('Error en updateUsuario:', err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Cambiar contraseña
 */
export const changePassword = async (req: Request, res: Response): Promise<void> => {
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
    const usuario = await getUsuarioByEmail(req.usuario.correo);

    if (!usuario) {
      res.status(404).json({ message: 'Usuario no encontrado' });
      return;
    }

    // Verificar contraseña actual
    const passwordMatch = await comparePassword(contrasenaActual, usuario.contrasena);

    if (!passwordMatch) {
      res.status(401).json({ message: 'Contraseña actual incorrecta' });
      return;
    }

    // Hashear nueva contraseña
    const hashedPassword = await hashPassword(contrasenaNueva);

    // Actualizar contraseña
    await updatePassword(req.usuario.id_usuario, hashedPassword);

    res.json({ message: 'Contraseña actualizada exitosamente' });
  } catch (err: any) {
    console.error('Error en changePassword:', err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Eliminar usuario
 */
export const deleteUsuarioController = async (req: Request, res: Response): Promise<void> => {
  try {
    const id_usuario = Number(req.params.id);

    if (Number.isNaN(id_usuario)) {
      res.status(400).json({ message: 'ID inválido' });
      return;
    }

    const usuario = await deleteUsuario(id_usuario);

    if (!usuario) {
      res.status(404).json({ message: 'Usuario no encontrado' });
      return;
    }

    res.json({ message: 'Usuario eliminado exitosamente' });
  } catch (err: any) {
    console.error('Error en deleteUsuario:', err);
    res.status(500).json({ message: err.message });
  }
};
