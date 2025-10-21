import { Request, Response } from 'express';
import {
  createEvento,
  getAllEventos,
  getEventoById,
  getEventosByCategoria,
  getEventosByModalidad,
  getEventosProximos,
  updateEvento,
  deleteEvento,
  inscribirUsuarioToEvento,
  cancelarInscripcion,
  isUsuarioInscrito,
  getInscritosByEvento,
  getEventosByUsuario,
  countInscritosByEvento,
} from '../dao/evento.dao';
import { CreateEventoRequest, UpdateEventoRequest } from '../models/Evento';

/**
 * Crear un nuevo evento
 */
export const addEvento = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.usuario) {
      res.status(401).json({ message: 'No autenticado' });
      return;
    }

    const { nombre, descripcion, fecha_evento, hora_evento, lugar, modalidad, id_categoria }: CreateEventoRequest = req.body;

    if (!nombre || !fecha_evento) {
      res.status(400).json({ message: 'Faltan campos obligatorios' });
      return;
    }

    const evento = await createEvento({
      nombre,
      descripcion,
      fecha_evento,
      hora_evento,
      lugar,
      modalidad: modalidad || 'presencial',
      id_categoria,
    });

    const eventoCompleto = await getEventoById(evento.id_evento!);

    res.status(201).json(eventoCompleto);
  } catch (err: any) {
    console.error('Error en addEvento:', err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Listar todos los eventos
 */
export const listEventos = async (req: Request, res: Response): Promise<void> => {
  try {
    const eventos = await getAllEventos();
    res.json(eventos);
  } catch (err: any) {
    console.error('Error en listEventos:', err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Obtener eventos próximos
 */
export const listEventosProximos = async (req: Request, res: Response): Promise<void> => {
  try {
    const eventos = await getEventosProximos();
    res.json(eventos);
  } catch (err: any) {
    console.error('Error en listEventosProximos:', err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Obtener evento por ID
 */
export const getEvento = async (req: Request, res: Response): Promise<void> => {
  try {
    const id_evento = Number(req.params.id);

    if (Number.isNaN(id_evento)) {
      res.status(400).json({ message: 'ID inválido' });
      return;
    }

    const evento = await getEventoById(id_evento);

    if (!evento) {
      res.status(404).json({ message: 'Evento no encontrado' });
      return;
    }

    res.json(evento);
  } catch (err: any) {
    console.error('Error en getEvento:', err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Obtener eventos por categoría
 */
export const getEventosByCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const id_categoria = Number(req.params.categoryId);

    if (Number.isNaN(id_categoria)) {
      res.status(400).json({ message: 'ID de categoría inválido' });
      return;
    }

    const eventos = await getEventosByCategoria(id_categoria);
    res.json(eventos);
  } catch (err: any) {
    console.error('Error en getEventosByCategory:', err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Obtener eventos por modalidad
 */
export const getEventosByMode = async (req: Request, res: Response): Promise<void> => {
  try {
    const { modalidad } = req.query;

    if (!modalidad || typeof modalidad !== 'string') {
      res.status(400).json({ message: 'El parámetro modalidad es requerido' });
      return;
    }

    const eventos = await getEventosByModalidad(modalidad);
    res.json(eventos);
  } catch (err: any) {
    console.error('Error en getEventosByMode:', err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Obtener mis eventos inscritos
 */
export const getMyEventos = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.usuario) {
      res.status(401).json({ message: 'No autenticado' });
      return;
    }

    const eventos = await getEventosByUsuario(req.usuario.id_usuario);
    res.json(eventos);
  } catch (err: any) {
    console.error('Error en getMyEventos:', err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Actualizar un evento
 */
export const updateEventoController = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.usuario) {
      res.status(401).json({ message: 'No autenticado' });
      return;
    }

    const id_evento = Number(req.params.id);

    if (Number.isNaN(id_evento)) {
      res.status(400).json({ message: 'ID inválido' });
      return;
    }

    // Solo admins pueden actualizar eventos
    if (req.usuario.id_rol !== 1) {
      res.status(403).json({ message: 'Solo los administradores pueden actualizar eventos' });
      return;
    }

    const { nombre, descripcion, fecha_evento, hora_evento, lugar, modalidad, id_categoria }: UpdateEventoRequest = req.body;

    await updateEvento(id_evento, {
      nombre,
      descripcion,
      fecha_evento,
      hora_evento,
      lugar,
      modalidad,
      id_categoria,
    });

    const eventoActualizado = await getEventoById(id_evento);

    res.json(eventoActualizado);
  } catch (err: any) {
    console.error('Error en updateEvento:', err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Eliminar un evento
 */
export const deleteEventoController = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.usuario) {
      res.status(401).json({ message: 'No autenticado' });
      return;
    }

    const id_evento = Number(req.params.id);

    if (Number.isNaN(id_evento)) {
      res.status(400).json({ message: 'ID inválido' });
      return;
    }

    // Solo admins pueden eliminar eventos
    if (req.usuario.id_rol !== 1) {
      res.status(403).json({ message: 'Solo los administradores pueden eliminar eventos' });
      return;
    }

    await deleteEvento(id_evento);

    res.json({ message: 'Evento eliminado correctamente' });
  } catch (err: any) {
    console.error('Error en deleteEvento:', err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Inscribirse a un evento
 */
export const inscribirse = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.usuario) {
      res.status(401).json({ message: 'No autenticado' });
      return;
    }

    const id_evento = Number(req.params.id);

    if (Number.isNaN(id_evento)) {
      res.status(400).json({ message: 'ID inválido' });
      return;
    }

    // Verificar que el evento existe
    const evento = await getEventoById(id_evento);
    if (!evento) {
      res.status(404).json({ message: 'Evento no encontrado' });
      return;
    }

    // Verificar que no esté ya inscrito
    const yaInscrito = await isUsuarioInscrito(id_evento, req.usuario.id_usuario);
    if (yaInscrito) {
      res.status(409).json({ message: 'Ya estás inscrito en este evento' });
      return;
    }

    await inscribirUsuarioToEvento(id_evento, req.usuario.id_usuario);

    const eventoActualizado = await getEventoById(id_evento);

    res.status(201).json(eventoActualizado);
  } catch (err: any) {
    console.error('Error en inscribirse:', err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Cancelar inscripción
 */
export const cancelarInscripcionController = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.usuario) {
      res.status(401).json({ message: 'No autenticado' });
      return;
    }

    const id_evento = Number(req.params.id);

    if (Number.isNaN(id_evento)) {
      res.status(400).json({ message: 'ID inválido' });
      return;
    }

    // Verificar que esté inscrito
    const estaInscrito = await isUsuarioInscrito(id_evento, req.usuario.id_usuario);
    if (!estaInscrito) {
      res.status(404).json({ message: 'No estás inscrito en este evento' });
      return;
    }

    await cancelarInscripcion(id_evento, req.usuario.id_usuario);

    res.json({ message: 'Inscripción cancelada correctamente' });
  } catch (err: any) {
    console.error('Error en cancelarInscripcion:', err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Obtener inscritos de un evento
 */
export const getInscritos = async (req: Request, res: Response): Promise<void> => {
  try {
    const id_evento = Number(req.params.id);

    if (Number.isNaN(id_evento)) {
      res.status(400).json({ message: 'ID inválido' });
      return;
    }

    const inscritos = await getInscritosByEvento(id_evento);
    res.json(inscritos);
  } catch (err: any) {
    console.error('Error en getInscritos:', err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Contar inscritos de un evento
 */
export const countInscritos = async (req: Request, res: Response): Promise<void> => {
  try {
    const id_evento = Number(req.params.id);

    if (Number.isNaN(id_evento)) {
      res.status(400).json({ message: 'ID inválido' });
      return;
    }

    const count = await countInscritosByEvento(id_evento);
    res.json({ count });
  } catch (err: any) {
    console.error('Error en countInscritos:', err);
    res.status(500).json({ message: err.message });
  }
};
