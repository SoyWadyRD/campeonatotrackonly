const Equipo = require("../models/equipos");
const Usuario = require("../models/usuarios");

// Obtener todos los equipos con sus autos
exports.getEquipos = async (req, res) => {
  const equipos = await Equipo.find().lean();
  res.json(equipos);
};

// Inscribirse en un auto
exports.inscribirse = async (req, res) => {
  const { usuarioId, equipoId, autoNombre } = req.body;
  const usuario = await Usuario.findById(usuarioId);
  if (!usuario) return res.status(404).json({ msg: "Usuario no encontrado" });

  // Si ya está inscrito en otra marca
  if (usuario.equipo && usuario.equipo.toString() !== equipoId)
    return res.status(400).json({ msg: "Ya estás inscrito en otra marca" });

  const equipo = await Equipo.findById(equipoId);
  const auto = equipo.autos.find(a => a.nombre === autoNombre);

  if (auto.piloto) return res.status(400).json({ msg: "Auto ya está ocupado" });

  auto.piloto = usuario._id;
  usuario.equipo = equipo._id;
  usuario.auto = auto.nombre;

  await equipo.save();
  await usuario.save();

  res.json({ msg: "Inscripción exitosa" });
};

// Salir de un equipo
exports.salir = async (req, res) => {
  const { usuarioId } = req.body;
  const usuario = await Usuario.findById(usuarioId);
  if (!usuario || !usuario.equipo) return res.status(400).json({ msg: "No estás inscrito" });

  const equipo = await Equipo.findById(usuario.equipo);
  const auto = equipo.autos.find(a => a.piloto?.toString() === usuario._id.toString());
  if (auto) auto.piloto = null;

  usuario.equipo = null;
  usuario.auto = null;

  await equipo.save();
  await usuario.save();

  res.json({ msg: "Has salido del equipo" });
};
