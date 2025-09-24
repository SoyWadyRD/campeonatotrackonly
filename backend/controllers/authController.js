const Usuario = require("../models/usuarios");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// 📌 Registrar nuevo usuario
exports.registrar = async (req, res) => {
  try {
    const { gamertag, password } = req.body;

    if (!gamertag || !password) {
      console.log(`⚠️ Intento de registro fallido: campos vacíos`);
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    const existe = await Usuario.findOne({ gamertag });
    if (existe) {
      console.log(`❌ Intento de registro fallido: gamertag "${gamertag}" ya existe`);
      return res.status(400).json({ message: "Ese Gamertag ya está registrado" });
    }

    // 🔹 Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    const nuevoUsuario = new Usuario({ gamertag, password: hashedPassword });
    await nuevoUsuario.save();

    console.log(`🎉 Nuevo usuario registrado: ${nuevoUsuario.gamertag}`);

    // 🔹 Generar token JWT
    const token = jwt.sign(
      { id: nuevoUsuario._id, gamertag: nuevoUsuario.gamertag },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 🔹 Responder con usuario y token (sin emojis)
    res.status(201).json({
      message: "Usuario registrado con éxito",
      usuario: { _id: nuevoUsuario._id, gamertag: nuevoUsuario.gamertag },
      token
    });

  } catch (error) {
    console.log(`💥 Error en el servidor: ${error.message}`);
    res.status(500).json({ message: "Error en el servidor", error: error.message });
  }
};

// 📌 Login usuario
exports.login = async (req, res) => {
  try {
    const { gamertag, password } = req.body;

    const usuario = await Usuario.findOne({ gamertag });
    if (!usuario) {
      console.log(`❌ Login fallido: usuario "${gamertag}" no encontrado`);
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // 🔹 Comparar contraseña con hash
    const match = await bcrypt.compare(password, usuario.password);
    if (!match) {
      console.log(`❌ Login fallido: contraseña incorrecta para "${gamertag}"`);
      return res.status(400).json({ message: "Contraseña incorrecta" });
    }

    console.log(`✅ Usuario logueado: ${usuario.gamertag}`);

    // 🔹 Generar token JWT
    const token = jwt.sign(
      { id: usuario._id, gamertag: usuario.gamertag },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 🔹 Responder con usuario y token (sin emojis)
    res.status(200).json({
      message: "Login exitoso",
      usuario: { _id: usuario._id, gamertag: usuario.gamertag },
      token
    });
  } catch (error) {
    console.log(`💥 Error en el servidor: ${error.message}`);
    res.status(500).json({ message: "Error en el servidor", error: error.message });
  }
};
