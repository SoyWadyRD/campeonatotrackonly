// models/usuarios.js
const mongoose = require("mongoose");

const usuarioSchema = new mongoose.Schema({
  gamertag: { type: String, required: true, trim: true },
  password: { type: String, required: true },
  equipo: { type: String, default: null }, // se mantiene como String
  auto: { type: String, default: null },
  admin: { type: Boolean, default: false } // <-- nuevo campo
}, {
  timestamps: true // createdAt, updatedAt
});

// Evitar exponer password y __v al serializar (respuestas JSON)
usuarioSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.password;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model("Usuario", usuarioSchema);
