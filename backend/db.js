const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI); // ya no se necesitan useNewUrlParser ni useUnifiedTopology
    console.log("✅ Conectado a MongoDB Atlas");
  } catch (error) {
    console.error("❌ Error al conectar a MongoDB:", error.message);
    process.exit(1); // Detiene el servidor si no hay conexión
  }
};

module.exports = connectDB;
