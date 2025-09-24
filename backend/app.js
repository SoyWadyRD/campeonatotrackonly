const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./db");
const path = require("path");

// Configurar variables de entorno
dotenv.config();

// Conectar a MongoDB
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Servir frontend como estático
app.use(express.static(path.join(__dirname, "../frontend")));

// Redirigir la raíz al login
app.get("/", (req, res) => {
  res.redirect("/login.html"); // Aquí va tu archivo de login
});

// Importar rutas
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

const inscripcionesRoutes = require("./routes/inscripciones");
app.use("/api/inscripciones", inscripcionesRoutes);

// Ruta base de API
app.get("/api", (req, res) => {
  res.send("🚀 API Torneo Track Only funcionando!");
});

// Puerto
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Servidor corriendo en puerto ${PORT}`));
