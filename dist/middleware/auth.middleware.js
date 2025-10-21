"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = exports.authMiddleware = void 0;
const auth_utils_1 = require("../utils/auth.utils");
/**
 * Middleware para verificar autenticación JWT
 */
const authMiddleware = (req, res, next) => {
    try {
        // Obtener token del header Authorization
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ message: 'Token no proporcionado' });
            return;
        }
        const token = authHeader.substring(7); // Remover 'Bearer '
        // Verificar y decodificar token
        const decoded = (0, auth_utils_1.verifyToken)(token);
        // Agregar información del usuario a la request
        req.usuario = decoded;
        next();
    }
    catch (error) {
        if (error.name === 'TokenExpiredError') {
            res.status(401).json({ message: 'Token expirado' });
            return;
        }
        if (error.name === 'JsonWebTokenError') {
            res.status(401).json({ message: 'Token inválido' });
            return;
        }
        res.status(500).json({ message: 'Error al verificar token' });
    }
};
exports.authMiddleware = authMiddleware;
/**
 * Middleware para verificar roles específicos
 */
const requireRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.usuario) {
            res.status(401).json({ message: 'No autenticado' });
            return;
        }
        if (!allowedRoles.includes(req.usuario.id_rol)) {
            res.status(403).json({ message: 'No tienes permisos para esta acción' });
            return;
        }
        next();
    };
};
exports.requireRole = requireRole;
