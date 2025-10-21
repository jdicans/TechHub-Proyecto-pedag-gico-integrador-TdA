import { Request, Response } from 'express';
import {
  createArchivo,
  getAllArchivos,
  getArchivoById,
  getArchivosByPublicacion,
  getArchivosByTipo,
  updateArchivo,
  deleteArchivo,
  countArchivosByPublicacion,
  getTotalSizeByPublicacion,
} from '../dao/archivo.dao';
import { getPublicacionById } from '../dao/publicacion.dao';
import { CreateArchivoRequest, UpdateArchivoRequest } from '../models/Archivo';

/**
 * Crear un nuevo archivo
 */
export const addArchivo = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.usuario) {
      res.status(401).json({ message: 'No autenticado' });
      return;
    }

    const { nombre, tipo, ruta, tamanio, id_publicacion }: CreateArchivoRequest = req.body;

    if (!nombre || !tipo || !ruta || !id_publicacion) {
      res.status(400).json({ message: 'Faltan campos obligatorios' });
      return;
    }

    // Verificar que la publicación existe
    const publicacion = await getPublicacionById(id_publicacion);
    if (!publicacion) {
      res.status(404).json({ message: 'Publicación no encontrada' });
      return;
    }

    // Verificar que el usuario es el autor de la publicación o admin
    if (publicacion.id_usuario !== req.usuario.id_usuario && req.usuario.id_rol !== 1) {
      res.status(403).json({ message: 'No tienes permisos para agregar archivos a esta publicación' });
      return;
    }

    const archivo = await createArchivo({
      nombre,
      tipo,
      ruta,
      tamanio,
      id_publicacion,
    });

    // Obtener archivo con relaciones
    const archivoCompleto = await getArchivoById(archivo.id_archivo!);

    res.status(201).json(archivoCompleto);
  } catch (err: any) {
    console.error('Error en addArchivo:', err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Listar todos los archivos
 */
export const listArchivos = async (req: Request, res: Response): Promise<void> => {
  try {
    const archivos = await getAllArchivos();
    res.json(archivos);
  } catch (err: any) {
    console.error('Error en listArchivos:', err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Obtener archivo por ID
 */
export const getArchivo = async (req: Request, res: Response): Promise<void> => {
  try {
    const id_archivo = Number(req.params.id);

    if (Number.isNaN(id_archivo)) {
      res.status(400).json({ message: 'ID inválido' });
      return;
    }

    const archivo = await getArchivoById(id_archivo);

    if (!archivo) {
      res.status(404).json({ message: 'Archivo no encontrado' });
      return;
    }

    res.json(archivo);
  } catch (err: any) {
    console.error('Error en getArchivo:', err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Obtener archivos por publicación
 */
export const getArchivosByPublicacionId = async (req: Request, res: Response): Promise<void> => {
  try {
    const id_publicacion = Number(req.params.publicacionId);

    if (Number.isNaN(id_publicacion)) {
      res.status(400).json({ message: 'ID de publicación inválido' });
      return;
    }

    const archivos = await getArchivosByPublicacion(id_publicacion);
    res.json(archivos);
  } catch (err: any) {
    console.error('Error en getArchivosByPublicacionId:', err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Obtener archivos por tipo MIME
 */
export const getArchivosByMimeType = async (req: Request, res: Response): Promise<void> => {
  try {
    const { tipo } = req.query;

    if (!tipo || typeof tipo !== 'string') {
      res.status(400).json({ message: 'El parámetro tipo es requerido' });
      return;
    }

    const archivos = await getArchivosByTipo(tipo);
    res.json(archivos);
  } catch (err: any) {
    console.error('Error en getArchivosByMimeType:', err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Contar archivos de una publicación
 */
export const countArchivos = async (req: Request, res: Response): Promise<void> => {
  try {
    const id_publicacion = Number(req.params.publicacionId);

    if (Number.isNaN(id_publicacion)) {
      res.status(400).json({ message: 'ID de publicación inválido' });
      return;
    }

    const count = await countArchivosByPublicacion(id_publicacion);
    res.json({ count });
  } catch (err: any) {
    console.error('Error en countArchivos:', err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Obtener tamaño total de archivos de una publicación
 */
export const getTotalSize = async (req: Request, res: Response): Promise<void> => {
  try {
    const id_publicacion = Number(req.params.publicacionId);

    if (Number.isNaN(id_publicacion)) {
      res.status(400).json({ message: 'ID de publicación inválido' });
      return;
    }

    const totalSize = await getTotalSizeByPublicacion(id_publicacion);
    res.json({ totalSize, totalSizeMB: (totalSize / (1024 * 1024)).toFixed(2) });
  } catch (err: any) {
    console.error('Error en getTotalSize:', err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Actualizar un archivo
 */
export const updateArchivoController = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.usuario) {
      res.status(401).json({ message: 'No autenticado' });
      return;
    }

    const id_archivo = Number(req.params.id);

    if (Number.isNaN(id_archivo)) {
      res.status(400).json({ message: 'ID inválido' });
      return;
    }

    // Verificar que el archivo existe
    const archivoExistente = await getArchivoById(id_archivo);

    if (!archivoExistente) {
      res.status(404).json({ message: 'Archivo no encontrado' });
      return;
    }

    // Verificar que el usuario es el autor de la publicación o admin
    const publicacion = await getPublicacionById(archivoExistente.id_publicacion);
    if (!publicacion) {
      res.status(404).json({ message: 'Publicación no encontrada' });
      return;
    }

    if (publicacion.id_usuario !== req.usuario.id_usuario && req.usuario.id_rol !== 1) {
      res.status(403).json({ message: 'No tienes permisos para actualizar este archivo' });
      return;
    }

    const { nombre, tipo, ruta, tamanio }: UpdateArchivoRequest = req.body;

    await updateArchivo(id_archivo, {
      nombre,
      tipo,
      ruta,
      tamanio,
    });

    // Obtener archivo actualizado
    const archivoActualizado = await getArchivoById(id_archivo);

    res.json(archivoActualizado);
  } catch (err: any) {
    console.error('Error en updateArchivo:', err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Eliminar un archivo
 */
export const deleteArchivoController = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.usuario) {
      res.status(401).json({ message: 'No autenticado' });
      return;
    }

    const id_archivo = Number(req.params.id);

    if (Number.isNaN(id_archivo)) {
      res.status(400).json({ message: 'ID inválido' });
      return;
    }

    // Verificar que el archivo existe
    const archivoExistente = await getArchivoById(id_archivo);

    if (!archivoExistente) {
      res.status(404).json({ message: 'Archivo no encontrado' });
      return;
    }

    // Verificar que el usuario es el autor de la publicación o admin
    const publicacion = await getPublicacionById(archivoExistente.id_publicacion);
    if (!publicacion) {
      res.status(404).json({ message: 'Publicación no encontrada' });
      return;
    }

    if (publicacion.id_usuario !== req.usuario.id_usuario && req.usuario.id_rol !== 1) {
      res.status(403).json({ message: 'No tienes permisos para eliminar este archivo' });
      return;
    }

    await deleteArchivo(id_archivo);

    res.json({ message: 'Archivo eliminado correctamente' });
  } catch (err: any) {
    console.error('Error en deleteArchivo:', err);
    res.status(500).json({ message: err.message });
  }
};
