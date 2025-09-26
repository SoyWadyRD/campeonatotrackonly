const mongoose = require("mongoose");

const posicionSchema = new mongoose.Schema({
  posicion: { type: Number, required: true },
  pilotoId: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario" },
  gamertag: { type: String } // para mostrar directamente en tablas
});

const carreraSchema = new mongoose.Schema({
  nombre: { type: String, required: true }, // "Carrera 1", "Carrera 2", etc.
  posiciones: [posicionSchema] // del 1 al 12
});

const resultadoSchema = new mongoose.Schema({
  torneo: { type: String, required: true }, // nombre o id del torneo
  carreras: [carreraSchema], // 5 carreras
  puntosIndividuales: [
    {
      pilotoId: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario" },
      gamertag: String,
      puntos: { type: Number, default: 0 }
    }
  ],
  puntosPorEquipo: [
    {
      equipo: String,
      pilotos: [String], // dos pilotos
      puntos: { type: Number, default: 0 }
    }
  ]
}, {
  timestamps: true
});

module.exports = mongoose.model("Resultado", resultadoSchema);
