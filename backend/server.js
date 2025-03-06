import app from "./app.js";
import sequelize from "./config/database.js";
import { initializeAdminUser } from "./services/authService.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import express from "express";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(express.static(path.join(__dirname, "../public")));

// eslint-disable-next-line no-undef
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

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
    
  } catch (error) {
    console.error("Unable to start server:", error);
    // eslint-disable-next-line no-undef
    process.exit(1);
  }
};

startServer();
