"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../config/db");
const router = (0, express_1.Router)();
router.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
});
router.get('/usuarios', async (_req, res) => {
    try {
        const { data, error } = await db_1.supabase.from('Usuario').select('*');
        if (error)
            return res.status(500).json({ error: error.message });
        return res.json(data);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error al obtener usuarios' });
    }
});
exports.default = router;
