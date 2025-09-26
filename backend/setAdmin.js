require('dotenv').config();
const mongoose = require("mongoose");
const Usuario = require("./models/usuarios");

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    const result = await Usuario.updateOne(
      { gamertag: "Soy Wady RD" },
      { $set: { admin: true } }
    );
    console.log("Usuario actualizado:", result);
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
