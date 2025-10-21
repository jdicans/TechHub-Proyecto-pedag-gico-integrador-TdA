import { Request, Response } from 'express';
import {
  createGrupoEstudio,
  getAllGruposEstudio,
  getGrupoEstudioById,
  getGruposByUsuario,
  updateGrupoEstudio,
  deleteGrupoEstudio,
  addMiembroToGrupo,
  removeMiembroFromGrupo,
  updateMiembroRol,
  getMiembrosByGrupo,
  isMiembroOfGrupo,
  getMiembroRol,
  countMiembrosByGrupo,
} from '../dao/grupoEstudio.dao';
import {
  CreateGrupoEstudioRequest,
  UpdateGrupoEstudioRequest,
  AddMiembroRequest,
  UpdateMiembroRequest,
} from '../models/GrupoEstudio';

/**
 * Crear un nuevo grupo de estudio
 */
export const addGrupoEstudio = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.usuario) {
      res.status(401).json({ message: 'No autenticado' });
      return;
    }

    const { nombre, descripcion }: CreateGrupoEstudioRequest = req.body;

    if (!nombre) {
      res.status(400).json({ message: 'El nombre es obligatorio' });
      return;
    }

    // Crear grupo
    const grupo = await createGrupoEstudio({ nombre, descripcion });

    // Agregar al usuario creador como administrador del grupo
    await addMiembroToGrupo(grupo.id_grupo!, req.usuario.id_usuario, 'administrador');

    // Obtener grupo completo con miembros
    const grupoCompleto = await getGrupoEstudioById(grupo.id_grupo!);

    res.status(201).json(grupoCompleto);
  } catch (err: any) {
    console.error('Error en addGrupoEstudio:', err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Listar todos los grupos de estudio
 */
export const listGruposEstudio = async (req: Request, res: Response): Promise<void> => {
  try {
    const grupos = await getAllGruposEstudio();
    res.json(grupos);
  } catch (err: any) {
    console.error('Error en listGruposEstudio:', err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Obtener grupo de estudio por ID
 */
export const getGrupoEstudio = async (req: Request, res: Response): Promise<void> => {
  try {
    const id_grupo = Number(req.params.id);

    if (Number.isNaN(id_grupo)) {
      res.status(400).json({ message: 'ID inválido' });
      return;
    }

    const grupo = await getGrupoEstudioById(id_grupo);

    if (!grupo) {
      res.status(404).json({ message: 'Grupo no encontrado' });
      return;
    }

    res.json(grupo);
  } catch (err: any) {
    console.error('Error en getGrupoEstudio:', err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Obtener mis grupos (usuario autenticado)
 */
export const getMyGrupos = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.usuario) {
      res.status(401).json({ message: 'No autenticado' });
      return;
    }

    const grupos = await getGruposByUsuario(req.usuario.id_usuario);
    res.json(grupos);
  } catch (err: any) {
    console.error('Error en getMyGrupos:', err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Obtener grupos por usuario
 */
export const getGruposByUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const id_usuario = Number(req.params.userId);

    if (Number.isNaN(id_usuario)) {
      res.status(400).json({ message: 'ID de usuario inválido' });
      return;
    }

    const grupos = await getGruposByUsuario(id_usuario);
    res.json(grupos);
  } catch (err: any) {
    console.error('Error en getGruposByUser:', err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Actualizar un grupo de estudio
 */
export const updateGrupoEstudioController = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.usuario) {
      res.status(401).json({ message: 'No autenticado' });
      return;
    }

    const id_grupo = Number(req.params.id);

    if (Number.isNaN(id_grupo)) {
      res.status(400).json({ message: 'ID inválido' });
      return;
    }

    // Verificar que el usuario es administrador del grupo o admin general
    const rolUsuario = await getMiembroRol(id_grupo, req.usuario.id_usuario);

    if (rolUsuario !== 'administrador' && req.usuario.id_rol !== 1) {
      res.status(403).json({ message: 'Solo los administradores del grupo pueden actualizarlo' });
      return;
    }

    const { nombre, descripcion }: UpdateGrupoEstudioRequest = req.body;

    await updateGrupoEstudio(id_grupo, { nombre, descripcion });

    const grupoActualizado = await getGrupoEstudioById(id_grupo);

    res.json(grupoActualizado);
  } catch (err: any) {
    console.error('Error en updateGrupoEstudio:', err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Eliminar un grupo de estudio
 */
export const deleteGrupoEstudioController = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.usuario) {
      res.status(401).json({ message: 'No autenticado' });
      return;
    }

    const id_grupo = Number(req.params.id);

    if (Number.isNaN(id_grupo)) {
      res.status(400).json({ message: 'ID inválido' });
      return;
    }

    // Verificar que el usuario es administrador del grupo o admin general
    const rolUsuario = await getMiembroRol(id_grupo, req.usuario.id_usuario);

    if (rolUsuario !== 'administrador' && req.usuario.id_rol !== 1) {
      res.status(403).json({ message: 'Solo los administradores del grupo pueden eliminarlo' });
      return;
    }

    await deleteGrupoEstudio(id_grupo);

    res.json({ message: 'Grupo eliminado correctamente' });
  } catch (err: any) {
    console.error('Error en deleteGrupoEstudio:', err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Agregar miembro a un grupo
 */
export const addMiembro = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.usuario) {
      res.status(401).json({ message: 'No autenticado' });
      return;
    }

    const id_grupo = Number(req.params.id);
    const { id_usuario, rol_grupo }: AddMiembroRequest = req.body;

    if (Number.isNaN(id_grupo) || !id_usuario) {
      res.status(400).json({ message: 'Datos inválidos' });
      return;
    }

    // Verificar que el grupo existe
    const grupo = await getGrupoEstudioById(id_grupo);
    if (!grupo) {
      res.status(404).json({ message: 'Grupo no encontrado' });
      return;
    }

    // Verificar que el usuario que agrega es administrador del grupo
    const rolUsuarioActual = await getMiembroRol(id_grupo, req.usuario.id_usuario);

    if (rolUsuarioActual !== 'administrador' && req.usuario.id_rol !== 1) {
      res.status(403).json({ message: 'Solo los administradores pueden agregar miembros' });
      return;
    }

    // Verificar que el usuario no sea ya miembro
    const esMiembro = await isMiembroOfGrupo(id_grupo, id_usuario);
    if (esMiembro) {
      res.status(409).json({ message: 'El usuario ya es miembro del grupo' });
      return;
    }

    await addMiembroToGrupo(id_grupo, id_usuario, rol_grupo || 'miembro');

    const grupoActualizado = await getGrupoEstudioById(id_grupo);

    res.status(201).json(grupoActualizado);
  } catch (err: any) {
    console.error('Error en addMiembro:', err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Remover miembro de un grupo
 */
export const removeMiembro = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.usuario) {
      res.status(401).json({ message: 'No autenticado' });
      return;
    }

    const id_grupo = Number(req.params.id);
    const id_usuario = Number(req.params.userId);

    if (Number.isNaN(id_grupo) || Number.isNaN(id_usuario)) {
      res.status(400).json({ message: 'IDs inválidos' });
      return;
    }

    // Verificar que el usuario que remueve es administrador o se está removiendo a sí mismo
    const rolUsuarioActual = await getMiembroRol(id_grupo, req.usuario.id_usuario);

    if (
      rolUsuarioActual !== 'administrador' &&
      req.usuario.id_usuario !== id_usuario &&
      req.usuario.id_rol !== 1
    ) {
      res.status(403).json({ message: 'No tienes permisos para remover este miembro' });
      return;
    }

    await removeMiembroFromGrupo(id_grupo, id_usuario);

    res.json({ message: 'Miembro removido correctamente' });
  } catch (err: any) {
    console.error('Error en removeMiembro:', err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Actualizar rol de un miembro
 */
export const updateMiembroRolController = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.usuario) {
      res.status(401).json({ message: 'No autenticado' });
      return;
    }

    const id_grupo = Number(req.params.id);
    const id_usuario = Number(req.params.userId);
    const { rol_grupo }: UpdateMiembroRequest = req.body;

    if (Number.isNaN(id_grupo) || Number.isNaN(id_usuario) || !rol_grupo) {
      res.status(400).json({ message: 'Datos inválidos' });
      return;
    }

    // Verificar que el usuario que actualiza es administrador
    const rolUsuarioActual = await getMiembroRol(id_grupo, req.usuario.id_usuario);

    if (rolUsuarioActual !== 'administrador' && req.usuario.id_rol !== 1) {
      res.status(403).json({ message: 'Solo los administradores pueden cambiar roles' });
      return;
    }

    await updateMiembroRol(id_grupo, id_usuario, rol_grupo);

    const grupoActualizado = await getGrupoEstudioById(id_grupo);

    res.json(grupoActualizado);
  } catch (err: any) {
    console.error('Error en updateMiembroRol:', err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Obtener miembros de un grupo
 */
export const getMiembros = async (req: Request, res: Response): Promise<void> => {
  try {
    const id_grupo = Number(req.params.id);

    if (Number.isNaN(id_grupo)) {
      res.status(400).json({ message: 'ID inválido' });
      return;
    }

    const miembros = await getMiembrosByGrupo(id_grupo);
    res.json(miembros);
  } catch (err: any) {
    console.error('Error en getMiembros:', err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Contar miembros de un grupo
 */
export const countMiembros = async (req: Request, res: Response): Promise<void> => {
  try {
    const id_grupo = Number(req.params.id);

    if (Number.isNaN(id_grupo)) {
      res.status(400).json({ message: 'ID inválido' });
      return;
    }

    const count = await countMiembrosByGrupo(id_grupo);
    res.json({ count });
  } catch (err: any) {
    console.error('Error en countMiembros:', err);
    res.status(500).json({ message: err.message });
  }
};
