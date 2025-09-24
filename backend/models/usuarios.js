const mongoose = require("mongoose");

const usuarioSchema = new mongoose.Schema({
  gamertag: String,
  password: String,
  equipo: { type: String, default: null }, // <-- cambiar a String
  auto: String
});

module.exports = mongoose.model("Usuario", usuarioSchema);
