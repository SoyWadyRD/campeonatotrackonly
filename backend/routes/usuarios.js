const express = require('express');
const router = express.Router();
const Usuario = require('../models/usuarios'); // tu modelo
const verificarToken = require('../middleware/auth'); // tu middleware de token

// GET /api/usuarios -> devuelve todos los usuarios activos
router.get('/', verificarToken, async (req, res) => {
  try {
    const usuarios = await Usuario.find(); 
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ msg: 'Error al obtener usuarios' });
  }
});

module.exports = router;
