const express = require("express");
const router = express.Router();
const inscripcionesController = require("../controllers/inscripcionesController");

// 📌 Obtener todas las inscripciones y disponibilidad de autos
router.get("/", inscripcionesController.obtenerInscripciones);

// 📌 Inscribirse en un auto
router.post("/inscribirse", inscripcionesController.inscribirse);

// 📌 Salir de la inscripción
router.delete("/salir/:usuarioId", inscripcionesController.salirInscripcion);

module.exports = router;
