// routes/resultados.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const resultadosController = require("../controllers/resultadosController");

// GET /api/resultados
router.get("/", auth, resultadosController.obtenerResultados);

// PATCH /api/resultados/:carrera/:posicion -> solo admin
router.patch("/:carrera/:posicion", auth, resultadosController.actualizarPosicion);

module.exports = router;
