import { Request, Response } from 'express';
import {
  createReporte,
  getAllReportes,
  getReportesByEstado,
  getReportesByUsuarioReporta,
  getReportesByUsuarioReportado,
  getReportesByPublicacion,
  getReportesByComentario,
  getReporteById,
  updateReporteEstado,
  updateReporte as updateReporteDao,
  deleteReporte as deleteReporteDao
} from '../dao/reporte.dao';

// Crear un nuevo reporte
export const addReporte = async (req: Request, res: Response) => {
  try {
    const id_usuario_reporta = req.usuario?.id_usuario;
    if (!id_usuario_reporta) return res.status(401).json({ message: 'No autenticado' });

    // Validar que se reporte al menos algo (usuario, publicación o comentario)
    if (!req.body.id_usuario_reportado && !req.body.id_publicacion && !req.body.id_comentario) {
      return res.status(400).json({
        message: 'Debe reportar al menos un usuario, publicación o comentario'
      });
    }

    const reporteData = {
      ...req.body,
      id_usuario_reporta
    };

    const reporte = await createReporte(reporteData);
    res.status(201).json(reporte);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Listar todos los reportes (solo admin/moderador)
export const listReportes = async (req: Request, res: Response) => {
  try {
    const reportes = await getAllReportes();
    res.json(reportes);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Obtener reportes por estado (solo admin/moderador)
export const getReportesPorEstado = async (req: Request, res: Response) => {
  try {
    const { estado } = req.params;
    const estadosValidos = ['pendiente', 'en_revision', 'resuelto', 'rechazado'];

    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({ message: 'Estado inválido' });
    }

    const reportes = await getReportesByEstado(estado);
    res.json(reportes);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Obtener mis reportes realizados
export const getMisReportes = async (req: Request, res: Response) => {
  try {
    const id_usuario = req.usuario?.id_usuario;
    if (!id_usuario) return res.status(401).json({ message: 'No autenticado' });

    const reportes = await getReportesByUsuarioReporta(id_usuario);
    res.json(reportes);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Obtener reportes sobre un usuario (solo admin/moderador)
export const getReportesUsuario = async (req: Request, res: Response) => {
  try {
    const id_usuario = Number(req.params.id_usuario);
    if (Number.isNaN(id_usuario)) return res.status(400).json({ message: 'ID inválido' });

    const reportes = await getReportesByUsuarioReportado(id_usuario);
    res.json(reportes);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Obtener reportes sobre una publicación (solo admin/moderador)
export const getReportesPublicacion = async (req: Request, res: Response) => {
  try {
    const id_publicacion = Number(req.params.id_publicacion);
    if (Number.isNaN(id_publicacion)) return res.status(400).json({ message: 'ID inválido' });

    const reportes = await getReportesByPublicacion(id_publicacion);
    res.json(reportes);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Obtener reportes sobre un comentario (solo admin/moderador)
export const getReportesComentario = async (req: Request, res: Response) => {
  try {
    const id_comentario = Number(req.params.id_comentario);
    if (Number.isNaN(id_comentario)) return res.status(400).json({ message: 'ID inválido' });

    const reportes = await getReportesByComentario(id_comentario);
    res.json(reportes);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Obtener reporte por id
export const getReporte = async (req: Request, res: Response) => {
  try {
    const id_reporte = Number(req.params.id);
    if (Number.isNaN(id_reporte)) return res.status(400).json({ message: 'ID inválido' });

    const reporte = await getReporteById(id_reporte);
    if (!reporte) return res.status(404).json({ message: 'Reporte no encontrado' });

    // Solo admin/moderador o el usuario que hizo el reporte puede verlo
    if (req.usuario?.id_rol !== 1 && reporte.id_usuario_reporta !== req.usuario?.id_usuario) {
      return res.status(403).json({ message: 'No tienes permiso para ver este reporte' });
    }

    res.json(reporte);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Actualizar estado de un reporte (solo admin/moderador)
export const cambiarEstadoReporte = async (req: Request, res: Response) => {
  try {
    const id_reporte = Number(req.params.id);
    if (Number.isNaN(id_reporte)) return res.status(400).json({ message: 'ID inválido' });

    const { estado } = req.body;
    const estadosValidos = ['pendiente', 'en_revision', 'resuelto', 'rechazado'];

    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({ message: 'Estado inválido' });
    }

    const reporte = await getReporteById(id_reporte);
    if (!reporte) return res.status(404).json({ message: 'Reporte no encontrado' });

    const updated = await updateReporteEstado(id_reporte, estado);
    res.json(updated);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Actualizar un reporte (solo admin)
export const updateReporte = async (req: Request, res: Response) => {
  try {
    const id_reporte = Number(req.params.id);
    if (Number.isNaN(id_reporte)) return res.status(400).json({ message: 'ID inválido' });

    const reporte = await updateReporteDao(id_reporte, req.body);
    if (!reporte) return res.status(404).json({ message: 'Reporte no encontrado' });

    res.json(reporte);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Eliminar un reporte (solo admin)
export const deleteReporte = async (req: Request, res: Response) => {
  try {
    const id_reporte = Number(req.params.id);
    if (Number.isNaN(id_reporte)) return res.status(400).json({ message: 'ID inválido' });

    const reporte = await getReporteById(id_reporte);
    if (!reporte) return res.status(404).json({ message: 'Reporte no encontrado' });

    await deleteReporteDao(id_reporte);
    res.json({ message: 'Reporte eliminado correctamente' });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
