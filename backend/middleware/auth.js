// middleware/auth.js
const jwt = require("jsonwebtoken");
const Usuario = require("../models/usuarios");

module.exports = async function (req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ msg: "No token" });

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ msg: "No token" });

    // Decodificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Buscar el usuario real en la DB
    const usuario = await Usuario.findById(decoded.id);
    if (!usuario) return res.status(401).json({ msg: "Usuario no encontrado" });

    // Guardar usuario en la request para siguientes middlewares/controladores
    req.usuario = {
      id: usuario._id,
      gamertag: usuario.gamertag,
      admin: usuario.admin
    };

    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ msg: "Token inválido" });
  }
};
