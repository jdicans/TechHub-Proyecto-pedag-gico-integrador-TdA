import { Request, Response } from 'express';
import {
  createCategoria,
  getAllCategorias,
  getCategoriaById,
  updateCategoria,
  deleteCategoria,
} from '../dao/categoria.dao';

/**
 * Crear una nueva categoría
 */
export const addCategoria = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nombre, descripcion } = req.body;

    if (!nombre) {
      res.status(400).json({ message: 'El nombre es obligatorio' });
      return;
    }

    const categoria = await createCategoria({ nombre, descripcion });
    res.status(201).json(categoria);
  } catch (err: any) {
    console.error('Error en addCategoria:', err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Listar todas las categorías
 */
export const listCategorias = async (req: Request, res: Response): Promise<void> => {
  try {
    const categorias = await getAllCategorias();
    res.json(categorias);
  } catch (err: any) {
    console.error('Error en listCategorias:', err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Obtener categoría por ID
 */
export const getCategoria = async (req: Request, res: Response): Promise<void> => {
  try {
    const id_categoria = Number(req.params.id);

    if (Number.isNaN(id_categoria)) {
      res.status(400).json({ message: 'ID inválido' });
      return;
    }

    const categoria = await getCategoriaById(id_categoria);

    if (!categoria) {
      res.status(404).json({ message: 'Categoría no encontrada' });
      return;
    }

    res.json(categoria);
  } catch (err: any) {
    console.error('Error en getCategoria:', err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Actualizar una categoría
 */
export const updateCategoriaController = async (req: Request, res: Response): Promise<void> => {
  try {
    const id_categoria = Number(req.params.id);

    if (Number.isNaN(id_categoria)) {
      res.status(400).json({ message: 'ID inválido' });
      return;
    }

    const categoria = await updateCategoria(id_categoria, req.body);

    if (!categoria) {
      res.status(404).json({ message: 'Categoría no encontrada' });
      return;
    }

    res.json(categoria);
  } catch (err: any) {
    console.error('Error en updateCategoria:', err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Eliminar una categoría
 */
export const deleteCategoriaController = async (req: Request, res: Response): Promise<void> => {
  try {
    const id_categoria = Number(req.params.id);

    if (Number.isNaN(id_categoria)) {
      res.status(400).json({ message: 'ID inválido' });
      return;
    }

    const categoria = await deleteCategoria(id_categoria);

    if (!categoria) {
      res.status(404).json({ message: 'Categoría no encontrada' });
      return;
    }

    res.json({ message: 'Categoría eliminada correctamente' });
  } catch (err: any) {
    console.error('Error en deleteCategoria:', err);
    res.status(500).json({ message: err.message });
  }
};
