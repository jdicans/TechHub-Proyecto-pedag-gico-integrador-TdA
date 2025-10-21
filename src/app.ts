import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';

import rolRoutes from './routes/rol.routes';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './docs/swagger';


dotenv.config();

const app = express();
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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
//app.use(helmet());


// Rutas de la API
app.use('/api/roles', rolRoutes);


// Swagger UI (montar antes de arrancar el servidor)
// Log headers specifically for docs route to help debug 403 issues
app.use('/api/docs', (req, _res, next) => {
    console.log('--- /api/docs request ---');
    console.log('method:', req.method);
    console.log('url:', req.originalUrl);
    console.log('headers:', req.headers);
    next();
});
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Diagnostic endpoint: return the raw swagger JSON
app.get('/api/docs/json', (_req, res) => res.json(swaggerSpec));

// Levantar servidor (único listen)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Escuchando el puerto ${PORT}`);
});


export default app;
