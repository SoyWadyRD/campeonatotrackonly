require("dotenv").config();
const mongoose = require("mongoose");
const Resultado = require("./models/Resultados");

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB conectado"))
.catch(err => console.error(err));

async function init() {
  try {
    const existing = await Resultado.findOne({ torneo: "MiTorneo" });
    if (existing) {
      console.log("El torneo ya existe");
      process.exit(0);
    }

    const carreras = [];
    for (let i = 1; i <= 5; i++) {
      const posiciones = [];
      for (let j = 1; j <= 12; j++) {
        posiciones.push({ posicion: j, pilotoId: null, gamertag: "" });
      }
      carreras.push({ nombre: `Carrera ${i}`, posiciones });
    }

    const resultado = new Resultado({
      torneo: "TrackOnly",
      carreras,
      puntosIndividuales: [],
      puntosPorEquipo: []
    });

    await resultado.save();
    console.log("Documento de resultados creado correctamente");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

init();
