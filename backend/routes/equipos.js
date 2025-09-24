const express = require("express");
const router = express.Router();
const Equipo = require("../models/equipos");
const Usuario = require("../models/usuarios");
const authMiddleware = require("../middleware/auth"); // middleware que verifica JWT

// Obtener todos los equipos
router.get("/", authMiddleware, async (req, res) => {
  const equipos = await Equipo.find().populate("autos.piloto", "gamertag");
  res.json(equipos);
});

// Inscribirse o salir de un auto
router.post("/inscribirse", authMiddleware, async (req, res) => {
  const { equipoId, autoIndex } = req.body;
  const usuarioId = req.usuario._id; // viene del middleware JWT

  const equipos = await Equipo.find();

  // Limpiar cualquier inscripción anterior
  for (const equipo of equipos) {
    for (const auto of equipo.autos) {
      if (auto.piloto?.toString() === usuarioId.toString()) auto.piloto = null;
    }
    await equipo.save();
  }

  // Tomar el equipo y auto elegido
  const equipo = await Equipo.findById(equipoId);
  const auto = equipo.autos[autoIndex];

  if(auto.piloto?.toString() === usuarioId.toString()) {
    // Ya estaba inscrito → salir
    auto.piloto = null;
  } else {
    // Inscribirse
    auto.piloto = usuarioId;
  }

  await equipo.save();
  res.json({ success: true });
});

module.exports = router;
