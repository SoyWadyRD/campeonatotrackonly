const Usuario = require("../models/usuarios");

// 📌 Obtener inscripciones actuales y disponibilidad de autos
exports.obtenerInscripciones = async (req, res) => {
  try {
    const usuarios = await Usuario.find({}).select("gamertag equipo auto");

    const marcas = [
      { nombre: "Pagani", logo: "/img/logos/pagani.png", autos: ["Huayra BC 2016 Coupe Forza Edition", "Huayra BC 2016"] },
      { nombre: "Mercedes", logo: "/img/logos/mercedez.png", autos: ["AMG ONE", "AMG CLK GTR"] },
      { nombre: "KTM", logo: "/img/logos/ktm.png", autos: ["X-Bow GT4", "X-Bow GT2"] },
      { nombre: "Aston Martin", logo: "/img/logos/astonmartin.png", autos: ["Valkyrie AMR Pro", "Concept Valhalla"] },
      { nombre: "Gordon Murray Automotive", logo: "/img/logos/gordonmurrayautomotive.png", autos: ["T.50", "T.50 "] },
      { nombre: "Ferrari", logo: "/img/logos/ferrari.png", autos: ["FXX K 2014", "FXX K EVO 2018"] },
    ];

    marcas.forEach((marca) => {
      marca.inscritos = marca.autos.map((auto) => {
        const usuario = usuarios.find(u => u.auto === auto);
        return usuario ? usuario.gamertag : null;
      });
    });

    res.status(200).json({ marcas });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener inscripciones", error: error.message });
  }
};

// 📌 Inscribirse en un auto
exports.inscribirse = async (req, res) => {
  try {
    const { usuarioId, marca, auto } = req.body;

    const usuario = await Usuario.findById(usuarioId);
    if (!usuario) return res.status(404).json({ message: "Usuario no encontrado" });

    if (usuario.auto) return res.status(400).json({ message: "Ya estás inscrito en otro auto" });

    const autoOcupado = await Usuario.findOne({ auto });
    if (autoOcupado) return res.status(400).json({ message: "Auto ya ocupado" });

    usuario.equipo = marca;
    usuario.auto = auto;
    await usuario.save();

    console.log(`📌 Usuario inscrito: ${usuario.gamertag} -> ${marca} / ${auto}`);

    res.status(200).json({ message: "Inscripción exitosa", usuario });
  } catch (error) {
    res.status(500).json({ message: "Error al inscribirse", error: error.message });
  }
};

// 📌 Salir de inscripción
exports.salirInscripcion = async (req, res) => {
  try {
    const { usuarioId } = req.params;

    const usuario = await Usuario.findOne({ gamertag: usuarioId });
    if (!usuario) return res.status(404).json({ message: "Usuario no encontrado" });

    usuario.equipo = null;
    usuario.auto = null;
    await usuario.save();

    console.log(`📌 Usuario salió de la inscripción: ${usuario.gamertag}`);

    res.status(200).json({ message: "Salida de inscripción exitosa", usuario });
  } catch (error) {
    console.error("Error al salir de inscripción:", error);
    res.status(500).json({ message: "Error al salir de la inscripción", error: error.message });
  }
};
