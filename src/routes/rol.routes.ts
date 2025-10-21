import { Router } from 'express';
import { addRol, listRoles, getRol,updateRol,deleteRol } from '../controllers/rol.controller';

const router = Router();



router.post('/', addRol);          // Crear rol
router.get('/', listRoles);        // Listar todos los roles
router.get('/:id', getRol);        // Obtener rol por ID
router.put('/:id', updateRol);     // Actualizar rol por ID
router.delete('/:id', deleteRol);  // Eliminar rol por ID

export default router;
