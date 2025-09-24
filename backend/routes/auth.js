const express = require("express");
const router = express.Router();
const { registrar, login } = require("../controllers/authController");

// Ruta para registrar
router.post("/register", registrar);

// Ruta para login
router.post("/login", login);

module.exports = router;
