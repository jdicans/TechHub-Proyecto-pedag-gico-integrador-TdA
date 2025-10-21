"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const rol_controller_1 = require("../controllers/rol.controller");
const router = (0, express_1.Router)();
router.post('/', rol_controller_1.addRol); // Crear rol
router.get('/', rol_controller_1.listRoles); // Listar todos los roles
router.get('/:id', rol_controller_1.getRol); // Obtener rol por ID
router.put('/:id', rol_controller_1.updateRol); // Actualizar rol por ID
router.delete('/:id', rol_controller_1.deleteRol); // Eliminar rol por ID
exports.default = router;
