import app from "./app.js";
import sequelize from "./config/database.js";
import { initializeAdminUser } from "./services/authService.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import express from "express";
import cors from "cors";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// --- CONFIGURACIÓN DE CORS PARA VERCEL ---
app.use(
  cors({
    origin: "https://task-rios.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// Sirve los archivos estáticos de public (si los necesitas)
app.use(express.static(path.join(__dirname, "../public")));

const PORT = process.env.PORT || 6005;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected!");

    await sequelize.sync({ alter: false });
    console.log("Database synchronized!");

    await initializeAdminUser();

    // Ruta principal que envía el index.html
    app.get("/", (req, res) => {
      res.sendFile(path.join(__dirname, "../public/index.html"));
    });

    // Vuelve a servir estáticos (si tenés más carpetas)
    app.use(express.static(path.join(__dirname, "../public")));

    // Arranca el servidor escuchando en todas las interfaces
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://0.0.0.0:${PORT}`);
    });
  } catch (error) {
    console.error("Unable to start server:", error);
    process.exit(1);
  }

  // Middlewares para parsear JSON y URL-encoded al final
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
};

startServer();
