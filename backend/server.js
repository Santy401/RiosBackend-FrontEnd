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
const allowedOrigins = [
  "https://task-rios.vercel.app",
  "http://localhost:3000"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "../public")));

const PORT = process.env.PORT || 6005;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected!");

    await sequelize.sync({ alter: false });
    console.log("Database synchronized!");

    await initializeAdminUser();

    app.get("/", (req, res) => {
      res.sendFile(path.join(__dirname, "../public/index.html"));
    });

    app.use(express.static(path.join(__dirname, "../public")));

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://0.0.0.0:${PORT}`);
    });
  } catch (error) {
    console.error("Unable to start server:", error);
    process.exit(1);
  }

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
};

startServer();
