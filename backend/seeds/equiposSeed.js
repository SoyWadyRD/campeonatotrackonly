const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Equipo = require("../models/equipos");
const connectDB = require("../db");

dotenv.config();
connectDB();

const seedEquipos = async () => {
  await Equipo.deleteMany({}); // Limpiar colección

  const equipos = [
    {
      nombre: "Pagani",
      logo: "/img/logos/pagani.png",
      autos: [
        { nombre: "Huayra BC 2016 Coupe Forza Edition" },
        { nombre: "Huayra BC 2016" }
      ]
    },
    {
      nombre: "Mercedes",
      logo: "/img/logos/mercedez.png",
      autos: [
        { nombre: "AMG ONE" },
        { nombre: "AMG CLK GTR" }
      ]
    },
    {
      nombre: "KTM",
      logo: "/img/logos/ktm.png",
      autos: [
        { nombre: "X-Bow GT4" },
        { nombre: "X-Bow GT2" }
      ]
    },
    {
      nombre: "Aston Martin",
      logo: "/img/logos/astonmartin.png",
      autos: [
        { nombre: "Valkyrie AMR Pro" },
        { nombre: "Concept Valhalla" }
      ]
    },
    {
      nombre: "Gordon Murray Automotive",
      logo: "/img/logos/gordonmurrayautomotive.png",
      autos: [
        { nombre: "T.50" },
        { nombre: "T.50" }
      ]
    },
    {
      nombre: "Ferrari",
      logo: "/img/logos/ferrari.jpg",
      autos: [
        { nombre: "FXX K 2014" },
        { nombre: "FXX K EVO 2018" }
      ]
    }
  ];

  await Equipo.insertMany(equipos);
  console.log("✅ Equipos insertados correctamente");
  mongoose.connection.close();
};

seedEquipos();
