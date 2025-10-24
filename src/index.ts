import express from "express";
import cors from "cors";
import calcularRouter from "./rutas/calcular";
import { cargarFestivos } from "./servicios/festivosServicio";

const app = express();
const PORT = process.env.PORT || 3000;

// 🧩 Middleware
app.use(cors());
app.use(express.json());

// 🧠 ÚNICA Ruta principal
app.use("/calcular", calcularRouter);

// 🧪 Ruta base de prueba
app.get("/", (req, res) => {
  res.send("🚀 Working Days API funcionando correctamente");
});

// 🚀 Iniciar servidor solo después de cargar los festivos
cargarFestivos().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📊 Endpoint disponible: GET /calcular`);
  });
}).catch((err) => {
  console.error("❌ No se pudieron cargar los festivos:", err);
  process.exit(1);
});