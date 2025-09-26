// controllers/resultadosController.js
const Resultado = require("../models/Resultados");
const Usuario = require("../models/usuarios");

// Configuración de puntos por posición (puedes ajustar según tu torneo)
const puntosPorPosicion = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1, 0, 0];

module.exports = {
  // GET /resultados
  obtenerResultados: async (req, res) => {
    try {
      const resultados = await Resultado.findOne({ torneo: "TrackOnly" });
      if (!resultados) return res.status(404).json({ msg: "Resultados no encontrados" });
      res.json(resultados);
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Error al obtener resultados" });
    }
  },

  // PATCH /resultados/:carrera/:posicion
 // PATCH /resultados/:carrera/:posicion
actualizarPosicion: async (req, res) => {
  try {
    const { carrera, posicion } = req.params;
    let { pilotoId, gamertag } = req.body;

    if (!req.usuario.admin) return res.status(403).json({ msg: "No autorizado" });

    const resultados = await Resultado.findOne({ torneo: "TrackOnly" });
    if (!resultados) return res.status(404).json({ msg: "Resultados no encontrados" });

    const carreraObj = resultados.carreras.find(c => c.nombre === carrera);
    if (!carreraObj) return res.status(404).json({ msg: "Carrera no encontrada" });

    const posIndex = parseInt(posicion) - 1;
    if (!pilotoId) {
      carreraObj.posiciones[posIndex] = { posicion: parseInt(posicion), pilotoId: null, gamertag: "" };
    } else {
      carreraObj.posiciones[posIndex] = { posicion: parseInt(posicion), pilotoId, gamertag };
    }

    // Recalcular puntos individuales
    const puntosIndividuales = {};
    resultados.carreras.forEach(c => {
      c.posiciones.forEach(p => {
        if (!p || !p.pilotoId) return;
        puntosIndividuales[p.pilotoId] = (puntosIndividuales[p.pilotoId] || 0) + puntosPorPosicion[p.posicion - 1];
      });
    });
    resultados.puntosIndividuales = Object.entries(puntosIndividuales).map(([id, pts]) => ({
      pilotoId: id,
      gamertag: resultados.carreras.flatMap(c => c.posiciones).find(p => p.pilotoId == id)?.gamertag || "",
      puntos: pts
    }));

    // Recalcular puntos por equipo
    const equipos = {};
    for (const p of resultados.puntosIndividuales) {
      const user = await Usuario.findById(p.pilotoId);
      if (!user || !user.equipo) continue;
      if (!equipos[user.equipo]) equipos[user.equipo] = { equipo: user.equipo, pilotos: [], puntos: 0 };
      equipos[user.equipo].pilotos.push(user.gamertag);
      equipos[user.equipo].puntos += p.puntos;
    }
    resultados.puntosPorEquipo = Object.values(equipos);

    await resultados.save();

    // 🔵 Emitir evento de actualización a todos los clientes
    const io = req.app.get("io");
    io.emit("resultadosActualizados", resultados);

    res.json(resultados);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error al actualizar posición" });
  }
}
};
