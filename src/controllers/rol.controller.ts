import { Request, Response } from 'express';
import { createRol, getAllRoles, getRolById, updateRol as updateRolDao, deleteRol as deleteRolDao } from '../dao/rol.dao';

export const addRol = async (req: Request, res: Response) => {
  try {
    const rol = await createRol(req.body);
    res.status(201).json(rol);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const listRoles = async (req: Request, res: Response) => {
  try {
    const roles = await getAllRoles();
    console.log('Roles obtenidos de la BD:', roles);
    console.log('Cantidad de roles:', roles?.length || 0);
    res.json(roles);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const getRol = async (req: Request, res: Response) => {
  try {
    const id_rol = Number(req.params.id);
    if (Number.isNaN(id_rol)) return res.status(400).json({ message: 'ID inválido' });
    const rol = await getRolById(id_rol);
    if (!rol) return res.status(404).json({ message: 'Rol no encontrado' });
    res.json(rol);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
export const updateRol = async (req: Request, res: Response) => {
  try {
    const id_rol = Number(req.params.id);
    if (Number.isNaN(id_rol)) return res.status(400).json({ message: 'ID inválido' });
    const rol = await updateRolDao(id_rol, req.body);
    if (!rol) return res.status(404).json({ message: 'Rol no encontrado' });
    res.json(rol);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
export const deleteRol = async (req: Request, res: Response) => {
    try {
        const id_rol = Number(req.params.id);
        if (Number.isNaN(id_rol)) return res.status(400).json({ message: 'ID inválido' });
        const rol = await deleteRolDao(id_rol);
        if (!rol) return res.status(404).json({ message: 'Rol no encontrado' });
        res.json({ message: 'Rol eliminado correctamente' });
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ message: err.message });
    } 
};