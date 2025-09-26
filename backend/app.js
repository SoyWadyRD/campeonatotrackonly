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

// Redirigir la raíz al login antes de servir archivos estáticos
app.get("/", (req, res) => {
  res.redirect("/login.html");
});

// Servir frontend como estático
app.use(express.static(path.join(__dirname, "../frontend")));

// Importar rutas
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

const inscripcionesRoutes = require("./routes/inscripciones");
app.use("/api/inscripciones", inscripcionesRoutes);

const resultadosRoutes = require("./routes/resultados");
app.use("/api/resultados", resultadosRoutes);

const usuariosRouter = require('./routes/usuarios');
app.use('/api/usuarios', usuariosRouter);



// Ruta base de API
app.get("/api", (req, res) => {
  res.send("🚀 API Torneo Track Only funcionando!");
});






// --- Crear servidor HTTP para Socket.IO ---
const server = require("http").createServer(app);
const io = require("socket.io")(server, { cors: { origin: "*" } });

// Guardar io para usar en controllers
app.set("io", io);

// Escuchar conexiones de clientes
io.on("connection", (socket) => {
  console.log("🔵 Cliente conectado: ", socket.id);
});





// Puerto
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`✅ Servidor corriendo en puerto ${PORT}`));
