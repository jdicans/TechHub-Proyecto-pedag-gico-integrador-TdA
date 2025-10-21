"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../config/db"));
async function testConnection() {
    try {
        console.log('Probando conexión a la BD...');
        // Algunos drivers devuelven arrays; ajusta según tu cliente
        const result = await (0, db_1.default) `SELECT 1 as ok`;
        console.log('Resultado:', result);
        console.log('Conexión a la BD OK');
    }
    catch (err) {
        console.error('Error al conectar a la BD:', err);
        process.exitCode = 1;
    }
}
testConnection();
//# sourceMappingURL=test-db.js.map