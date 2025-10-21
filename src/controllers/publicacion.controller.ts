import { Request, Response } from 'express';
import {
  createPublicacion,
  getAllPublicaciones,
  getPublicacionById,
  getPublicacionesByUsuario,
  getPublicacionesByCategoria,
  updatePublicacion,
  deletePublicacion,
  updateEtiquetasPublicacion,
} from '../dao/publicacion.dao';
import { CreatePublicacionRequest, UpdatePublicacionRequest } from '../models/Publicacion';

/**
 * Crear una nueva publicación
 */
export const addPublicacion = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.usuario) {
      res.status(401).json({ message: 'No autenticado' });
      return;
    }

    const { titulo, contenido, id_categoria, tipo, etiquetas }: CreatePublicacionRequest = req.body;

    if (!titulo || !contenido || !id_categoria) {
      res.status(400).json({ message: 'Faltan campos obligatorios' });
      return;
    }

    // Crear publicación
    const publicacion = await createPublicacion({
      titulo,
      contenido,
      id_categoria,
      tipo: tipo || 'articulo',
      id_usuario: req.usuario.id_usuario,
    });

    // Agregar etiquetas si existen
    if (etiquetas && etiquetas.length > 0) {
      await updateEtiquetasPublicacion(publicacion.id_publicacion!, etiquetas);
    }

    // Obtener publicación con relaciones
    const publicacionCompleta = await getPublicacionById(publicacion.id_publicacion!);

    res.status(201).json(publicacionCompleta);
  } catch (err: any) {
    console.error('Error en addPublicacion:', err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Listar todas las publicaciones
 */
export const listPublicaciones = async (req: Request, res: Response): Promise<void> => {
  try {
    const publicaciones = await getAllPublicaciones();
    res.json(publicaciones);
  } catch (err: any) {
    console.error('Error en listPublicaciones:', err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Obtener publicación por ID
 */
export const getPublicacion = async (req: Request, res: Response): Promise<void> => {
  try {
    const id_publicacion = Number(req.params.id);

    if (Number.isNaN(id_publicacion)) {
      res.status(400).json({ message: 'ID inválido' });
      return;
    }

    const publicacion = await getPublicacionById(id_publicacion);

    if (!publicacion) {
      res.status(404).json({ message: 'Publicación no encontrada' });
      return;
    }

    res.json(publicacion);
  } catch (err: any) {
    console.error('Error en getPublicacion:', err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Obtener publicaciones por usuario
 */
export const getPublicacionesByUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const id_usuario = Number(req.params.userId);

    if (Number.isNaN(id_usuario)) {
      res.status(400).json({ message: 'ID de usuario inválido' });
      return;
    }

    const publicaciones = await getPublicacionesByUsuario(id_usuario);
    res.json(publicaciones);
  } catch (err: any) {
    console.error('Error en getPublicacionesByUser:', err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Obtener publicaciones por categoría
 */
export const getPublicacionesByCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const id_categoria = Number(req.params.categoryId);

    if (Number.isNaN(id_categoria)) {
      res.status(400).json({ message: 'ID de categoría inválido' });
      return;
    }

    const publicaciones = await getPublicacionesByCategoria(id_categoria);
    res.json(publicaciones);
  } catch (err: any) {
    console.error('Error en getPublicacionesByCategory:', err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Obtener mis publicaciones (usuario autenticado)
 */
export const getMyPublicaciones = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.usuario) {
      res.status(401).json({ message: 'No autenticado' });
      return;
    }

    const publicaciones = await getPublicacionesByUsuario(req.usuario.id_usuario);
    res.json(publicaciones);
  } catch (err: any) {
    console.error('Error en getMyPublicaciones:', err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Actualizar una publicación
 */
export const updatePublicacionController = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.usuario) {
      res.status(401).json({ message: 'No autenticado' });
      return;
    }

    const id_publicacion = Number(req.params.id);

    if (Number.isNaN(id_publicacion)) {
      res.status(400).json({ message: 'ID inválido' });
      return;
    }

    // Verificar que la publicación existe y pertenece al usuario
    const publicacionExistente = await getPublicacionById(id_publicacion);

    if (!publicacionExistente) {
      res.status(404).json({ message: 'Publicación no encontrada' });
      return;
    }

    // Solo el autor o admin pueden actualizar
    if (publicacionExistente.id_usuario !== req.usuario.id_usuario && req.usuario.id_rol !== 1) {
      res.status(403).json({ message: 'No tienes permisos para actualizar esta publicación' });
      return;
    }

    const { titulo, contenido, id_categoria, tipo, etiquetas }: UpdatePublicacionRequest = req.body;

    // Actualizar publicación
    await updatePublicacion(id_publicacion, {
      titulo,
      contenido,
      id_categoria,
      tipo,
    });

    // Actualizar etiquetas si se proporcionan
    if (etiquetas !== undefined) {
      await updateEtiquetasPublicacion(id_publicacion, etiquetas);
    }

    // Obtener publicación actualizada con relaciones
    const publicacionActualizada = await getPublicacionById(id_publicacion);

    res.json(publicacionActualizada);
  } catch (err: any) {
    console.error('Error en updatePublicacion:', err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Eliminar una publicación
 */
export const deletePublicacionController = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.usuario) {
      res.status(401).json({ message: 'No autenticado' });
      return;
    }

    const id_publicacion = Number(req.params.id);

    if (Number.isNaN(id_publicacion)) {
      res.status(400).json({ message: 'ID inválido' });
      return;
    }

    // Verificar que la publicación existe y pertenece al usuario
    const publicacionExistente = await getPublicacionById(id_publicacion);

    if (!publicacionExistente) {
      res.status(404).json({ message: 'Publicación no encontrada' });
      return;
    }

    // Solo el autor o admin pueden eliminar
    if (publicacionExistente.id_usuario !== req.usuario.id_usuario && req.usuario.id_rol !== 1) {
      res.status(403).json({ message: 'No tienes permisos para eliminar esta publicación' });
      return;
    }

    await deletePublicacion(id_publicacion);

    res.json({ message: 'Publicación eliminada correctamente' });
  } catch (err: any) {
    console.error('Error en deletePublicacion:', err);
    res.status(500).json({ message: err.message });
  }
};
