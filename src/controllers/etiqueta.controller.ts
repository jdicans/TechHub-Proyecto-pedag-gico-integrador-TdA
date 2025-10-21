import { Request, Response } from 'express';
import {
  createEtiqueta,
  getAllEtiquetas,
  getEtiquetaById,
  updateEtiqueta,
  deleteEtiqueta,
} from '../dao/etiqueta.dao';

/**
 * Crear una nueva etiqueta
 */
export const addEtiqueta = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nombre } = req.body;

    if (!nombre) {
      res.status(400).json({ message: 'El nombre es obligatorio' });
      return;
    }

    const etiqueta = await createEtiqueta({ nombre });
    res.status(201).json(etiqueta);
  } catch (err: any) {
    console.error('Error en addEtiqueta:', err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Listar todas las etiquetas
 */
export const listEtiquetas = async (req: Request, res: Response): Promise<void> => {
  try {
    const etiquetas = await getAllEtiquetas();
    res.json(etiquetas);
  } catch (err: any) {
    console.error('Error en listEtiquetas:', err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Obtener etiqueta por ID
 */
export const getEtiqueta = async (req: Request, res: Response): Promise<void> => {
  try {
    const id_etiqueta = Number(req.params.id);

    if (Number.isNaN(id_etiqueta)) {
      res.status(400).json({ message: 'ID inválido' });
      return;
    }

    const etiqueta = await getEtiquetaById(id_etiqueta);

    if (!etiqueta) {
      res.status(404).json({ message: 'Etiqueta no encontrada' });
      return;
    }

    res.json(etiqueta);
  } catch (err: any) {
    console.error('Error en getEtiqueta:', err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Actualizar una etiqueta
 */
export const updateEtiquetaController = async (req: Request, res: Response): Promise<void> => {
  try {
    const id_etiqueta = Number(req.params.id);

    if (Number.isNaN(id_etiqueta)) {
      res.status(400).json({ message: 'ID inválido' });
      return;
    }

    const etiqueta = await updateEtiqueta(id_etiqueta, req.body);

    if (!etiqueta) {
      res.status(404).json({ message: 'Etiqueta no encontrada' });
      return;
    }

    res.json(etiqueta);
  } catch (err: any) {
    console.error('Error en updateEtiqueta:', err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Eliminar una etiqueta
 */
export const deleteEtiquetaController = async (req: Request, res: Response): Promise<void> => {
  try {
    const id_etiqueta = Number(req.params.id);

    if (Number.isNaN(id_etiqueta)) {
      res.status(400).json({ message: 'ID inválido' });
      return;
    }

    const etiqueta = await deleteEtiqueta(id_etiqueta);

    if (!etiqueta) {
      res.status(404).json({ message: 'Etiqueta no encontrada' });
      return;
    }

    res.json({ message: 'Etiqueta eliminada correctamente' });
  } catch (err: any) {
    console.error('Error en deleteEtiqueta:', err);
    res.status(500).json({ message: err.message });
  }
};
