"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv = __importStar(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const rol_routes_1 = __importDefault(require("./routes/rol.routes"));
const usuario_routes_1 = __importDefault(require("./routes/usuario.routes"));
const categoria_routes_1 = __importDefault(require("./routes/categoria.routes"));
const etiqueta_routes_1 = __importDefault(require("./routes/etiqueta.routes"));
const publicacion_routes_1 = __importDefault(require("./routes/publicacion.routes"));
const comentario_routes_1 = __importDefault(require("./routes/comentario.routes"));
const archivo_routes_1 = __importDefault(require("./routes/archivo.routes"));
const grupoEstudio_routes_1 = __importDefault(require("./routes/grupoEstudio.routes"));
const evento_routes_1 = __importDefault(require("./routes/evento.routes"));
const notificacion_routes_1 = __importDefault(require("./routes/notificacion.routes"));
const reporte_routes_1 = __importDefault(require("./routes/reporte.routes"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = __importDefault(require("./docs/swagger"));
dotenv.config();
const app = (0, express_1.default)();
// Global request/response logger for debugging
app.use((req, res, next) => {
    const start = Date.now();
    console.log(`${new Date().toISOString()} --> ${req.method} ${req.originalUrl}`);
    res.on('finish', () => {
        const ms = Date.now() - start;
        console.log(`${new Date().toISOString()} <-- ${req.method} ${req.originalUrl} ${res.statusCode} ${ms}ms`);
    });
    next();
});
// Diagnostic ping endpoint (bypass routers) to verify server responsiveness
app.get('/ping', (_req, res) => res.status(200).json({ ok: true }));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)());
//app.use(helmet());
// Rutas de la API
app.use('/api/roles', rol_routes_1.default);
app.use('/api/usuarios', usuario_routes_1.default);
app.use('/api/categorias', categoria_routes_1.default);
app.use('/api/etiquetas', etiqueta_routes_1.default);
app.use('/api/publicaciones', publicacion_routes_1.default);
app.use('/api/comentarios', comentario_routes_1.default);
app.use('/api/archivos', archivo_routes_1.default);
app.use('/api/grupos', grupoEstudio_routes_1.default);
app.use('/api/eventos', evento_routes_1.default);
app.use('/api/notificaciones', notificacion_routes_1.default);
app.use('/api/reportes', reporte_routes_1.default);
// Swagger UI (montar antes de arrancar el servidor)
// Log headers specifically for docs route to help debug 403 issues
app.use('/api/docs', (req, _res, next) => {
    console.log('--- /api/docs request ---');
    console.log('method:', req.method);
    console.log('url:', req.originalUrl);
    console.log('headers:', req.headers);
    next();
});
app.use('/api/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.default));
// Diagnostic endpoint: return the raw swagger JSON
app.get('/api/docs/json', (_req, res) => res.json(swagger_1.default));
// Levantar servidor (único listen)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Escuchando el puerto ${PORT}`);
});
exports.default = app;
