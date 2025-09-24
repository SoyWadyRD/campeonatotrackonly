const mongoose = require("mongoose");

const autoSchema = new mongoose.Schema({
  nombre: String,
  foto: String,
  piloto: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", default: null } // piloto inscrito
});

const equipoSchema = new mongoose.Schema({
  nombre: String,
  logo: String,
  autos: [autoSchema]
});

module.exports = mongoose.model("Equipo", equipoSchema);
