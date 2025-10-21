import { Request, Response } from 'express';
import {
  createNotificacion,
  getAllNotificaciones,
  getNotificacionesByUsuario,
  getNotificacionesNoLeidasByUsuario,
  getNotificacionById,
  markAsRead,
  markAllAsReadByUsuario,
  updateNotificacion as updateNotificacionDao,
  deleteNotificacion as deleteNotificacionDao,
  deleteLeidasByUsuario
} from '../dao/notificacion.dao';

// Crear una nueva notificación
export const addNotificacion = async (req: Request, res: Response) => {
  try {
    const notificacion = await createNotificacion(req.body);
    res.status(201).json(notificacion);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Listar todas las notificaciones (solo admin)
export const listNotificaciones = async (req: Request, res: Response) => {
  try {
    const notificaciones = await getAllNotificaciones();
    res.json(notificaciones);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Obtener notificaciones del usuario autenticado
export const getMyNotificaciones = async (req: Request, res: Response) => {
  try {
    const id_usuario = req.usuario?.id_usuario;
    if (!id_usuario) return res.status(401).json({ message: 'No autenticado' });

    const notificaciones = await getNotificacionesByUsuario(id_usuario);
    res.json(notificaciones);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Obtener notificaciones no leídas del usuario autenticado
export const getMyNotificacionesNoLeidas = async (req: Request, res: Response) => {
  try {
    const id_usuario = req.usuario?.id_usuario;
    if (!id_usuario) return res.status(401).json({ message: 'No autenticado' });

    const notificaciones = await getNotificacionesNoLeidasByUsuario(id_usuario);
    res.json(notificaciones);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Obtener notificación por id
export const getNotificacion = async (req: Request, res: Response) => {
  try {
    const id_notificacion = Number(req.params.id);
    if (Number.isNaN(id_notificacion)) return res.status(400).json({ message: 'ID inválido' });

    const notificacion = await getNotificacionById(id_notificacion);
    if (!notificacion) return res.status(404).json({ message: 'Notificación no encontrada' });

    // Verificar que la notificación pertenezca al usuario autenticado (o sea admin)
    if (req.usuario?.id_rol !== 1 && notificacion.id_usuario !== req.usuario?.id_usuario) {
      return res.status(403).json({ message: 'No tienes permiso para ver esta notificación' });
    }

    res.json(notificacion);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Marcar notificación como leída
export const markNotificacionAsRead = async (req: Request, res: Response) => {
  try {
    const id_notificacion = Number(req.params.id);
    if (Number.isNaN(id_notificacion)) return res.status(400).json({ message: 'ID inválido' });

    const notificacion = await getNotificacionById(id_notificacion);
    if (!notificacion) return res.status(404).json({ message: 'Notificación no encontrada' });

    // Verificar que la notificación pertenezca al usuario autenticado
    if (notificacion.id_usuario !== req.usuario?.id_usuario) {
      return res.status(403).json({ message: 'No tienes permiso para modificar esta notificación' });
    }

    const updated = await markAsRead(id_notificacion);
    res.json(updated);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Marcar todas las notificaciones del usuario como leídas
export const markAllMyNotificacionesAsRead = async (req: Request, res: Response) => {
  try {
    const id_usuario = req.usuario?.id_usuario;
    if (!id_usuario) return res.status(401).json({ message: 'No autenticado' });

    const updated = await markAllAsReadByUsuario(id_usuario);
    res.json({ message: 'Todas las notificaciones marcadas como leídas', count: updated.length });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Actualizar notificación (solo admin)
export const updateNotificacion = async (req: Request, res: Response) => {
  try {
    const id_notificacion = Number(req.params.id);
    if (Number.isNaN(id_notificacion)) return res.status(400).json({ message: 'ID inválido' });

    const notificacion = await updateNotificacionDao(id_notificacion, req.body);
    if (!notificacion) return res.status(404).json({ message: 'Notificación no encontrada' });

    res.json(notificacion);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Eliminar notificación
export const deleteNotificacion = async (req: Request, res: Response) => {
  try {
    const id_notificacion = Number(req.params.id);
    if (Number.isNaN(id_notificacion)) return res.status(400).json({ message: 'ID inválido' });

    const notificacion = await getNotificacionById(id_notificacion);
    if (!notificacion) return res.status(404).json({ message: 'Notificación no encontrada' });

    // Verificar que la notificación pertenezca al usuario autenticado (o sea admin)
    if (req.usuario?.id_rol !== 1 && notificacion.id_usuario !== req.usuario?.id_usuario) {
      return res.status(403).json({ message: 'No tienes permiso para eliminar esta notificación' });
    }

    await deleteNotificacionDao(id_notificacion);
    res.json({ message: 'Notificación eliminada correctamente' });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Eliminar todas las notificaciones leídas del usuario
export const deleteMyLeidasNotificaciones = async (req: Request, res: Response) => {
  try {
    const id_usuario = req.usuario?.id_usuario;
    if (!id_usuario) return res.status(401).json({ message: 'No autenticado' });

    const deleted = await deleteLeidasByUsuario(id_usuario);
    res.json({ message: 'Notificaciones leídas eliminadas', count: deleted.length });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
