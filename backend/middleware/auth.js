const jwt = require("jsonwebtoken");
const Usuario = require("../models/usuarios");

module.exports = async function(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ msg: "No token" });

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ msg: "No token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const usuario = await Usuario.findById(decoded.id);
    if (!usuario) return res.status(401).json({ msg: "Usuario no encontrado" });

    req.usuario = usuario; // aquí guardamos los datos del usuario
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ msg: "Token inválido" });
  }
};
