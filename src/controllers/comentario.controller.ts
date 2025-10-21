import { Request, Response } from 'express';
import {
  createComentario,
  getAllComentarios,
  getComentarioById,
  getComentariosByPublicacion,
  getComentariosByUsuario,
  updateComentario,
  deleteComentario,
  countComentariosByPublicacion,
} from '../dao/comentario.dao';
import { CreateComentarioRequest, UpdateComentarioRequest } from '../models/Comentario';

/**
 * Crear un nuevo comentario
 */
export const addComentario = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.usuario) {
      res.status(401).json({ message: 'No autenticado' });
      return;
    }

    const { contenido, id_publicacion }: CreateComentarioRequest = req.body;

    if (!contenido || !id_publicacion) {
      res.status(400).json({ message: 'Faltan campos obligatorios' });
      return;
    }

    const comentario = await createComentario({
      contenido,
      id_publicacion,
      id_usuario: req.usuario.id_usuario,
    });

    // Obtener comentario con información del usuario
    const comentarioCompleto = await getComentarioById(comentario.id_comentario!);

    res.status(201).json(comentarioCompleto);
  } catch (err: any) {
    console.error('Error en addComentario:', err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Listar todos los comentarios
 */
export const listComentarios = async (req: Request, res: Response): Promise<void> => {
  try {
    const comentarios = await getAllComentarios();
    res.json(comentarios);
  } catch (err: any) {
    console.error('Error en listComentarios:', err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Obtener comentario por ID
 */
export const getComentario = async (req: Request, res: Response): Promise<void> => {
  try {
    const id_comentario = Number(req.params.id);

    if (Number.isNaN(id_comentario)) {
      res.status(400).json({ message: 'ID inválido' });
      return;
    }

    const comentario = await getComentarioById(id_comentario);

    if (!comentario) {
      res.status(404).json({ message: 'Comentario no encontrado' });
      return;
    }

    res.json(comentario);
  } catch (err: any) {
    console.error('Error en getComentario:', err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Obtener comentarios por publicación
 */
export const getComentariosByPublicacionId = async (req: Request, res: Response): Promise<void> => {
  try {
    const id_publicacion = Number(req.params.publicacionId);

    if (Number.isNaN(id_publicacion)) {
      res.status(400).json({ message: 'ID de publicación inválido' });
      return;
    }

    const comentarios = await getComentariosByPublicacion(id_publicacion);
    res.json(comentarios);
  } catch (err: any) {
    console.error('Error en getComentariosByPublicacionId:', err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Obtener comentarios por usuario
 */
export const getComentariosByUserId = async (req: Request, res: Response): Promise<void> => {
  try {
    const id_usuario = Number(req.params.userId);

    if (Number.isNaN(id_usuario)) {
      res.status(400).json({ message: 'ID de usuario inválido' });
      return;
    }

    const comentarios = await getComentariosByUsuario(id_usuario);
    res.json(comentarios);
  } catch (err: any) {
    console.error('Error en getComentariosByUserId:', err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Obtener mis comentarios (usuario autenticado)
 */
export const getMyComentarios = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.usuario) {
      res.status(401).json({ message: 'No autenticado' });
      return;
    }

    const comentarios = await getComentariosByUsuario(req.usuario.id_usuario);
    res.json(comentarios);
  } catch (err: any) {
    console.error('Error en getMyComentarios:', err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Contar comentarios de una publicación
 */
export const countComentarios = async (req: Request, res: Response): Promise<void> => {
  try {
    const id_publicacion = Number(req.params.publicacionId);

    if (Number.isNaN(id_publicacion)) {
      res.status(400).json({ message: 'ID de publicación inválido' });
      return;
    }

    const count = await countComentariosByPublicacion(id_publicacion);
    res.json({ count });
  } catch (err: any) {
    console.error('Error en countComentarios:', err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Actualizar un comentario
 */
export const updateComentarioController = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.usuario) {
      res.status(401).json({ message: 'No autenticado' });
      return;
    }

    const id_comentario = Number(req.params.id);

    if (Number.isNaN(id_comentario)) {
      res.status(400).json({ message: 'ID inválido' });
      return;
    }

    // Verificar que el comentario existe y pertenece al usuario
    const comentarioExistente = await getComentarioById(id_comentario);

    if (!comentarioExistente) {
      res.status(404).json({ message: 'Comentario no encontrado' });
      return;
    }

    // Solo el autor o admin pueden actualizar
    if (comentarioExistente.id_usuario !== req.usuario.id_usuario && req.usuario.id_rol !== 1) {
      res.status(403).json({ message: 'No tienes permisos para actualizar este comentario' });
      return;
    }

    const { contenido }: UpdateComentarioRequest = req.body;

    if (!contenido) {
      res.status(400).json({ message: 'El contenido es obligatorio' });
      return;
    }

    await updateComentario(id_comentario, { contenido });

    // Obtener comentario actualizado
    const comentarioActualizado = await getComentarioById(id_comentario);

    res.json(comentarioActualizado);
  } catch (err: any) {
    console.error('Error en updateComentario:', err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Eliminar un comentario
 */
export const deleteComentarioController = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.usuario) {
      res.status(401).json({ message: 'No autenticado' });
      return;
    }

    const id_comentario = Number(req.params.id);

    if (Number.isNaN(id_comentario)) {
      res.status(400).json({ message: 'ID inválido' });
      return;
    }

    // Verificar que el comentario existe y pertenece al usuario
    const comentarioExistente = await getComentarioById(id_comentario);

    if (!comentarioExistente) {
      res.status(404).json({ message: 'Comentario no encontrado' });
      return;
    }

    // Solo el autor o admin pueden eliminar
    if (comentarioExistente.id_usuario !== req.usuario.id_usuario && req.usuario.id_rol !== 1) {
      res.status(403).json({ message: 'No tienes permisos para eliminar este comentario' });
      return;
    }

    await deleteComentario(id_comentario);

    res.json({ message: 'Comentario eliminado correctamente' });
  } catch (err: any) {
    console.error('Error en deleteComentario:', err);
    res.status(500).json({ message: err.message });
  }
};
