import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

// 1️⃣ Configuración para AWS RDS (DEFAULT)
const AWS_CONFIG = {
  host: process.env.DB_HOST || "rios-db.c6jy2yqs8p98.us-east-1.rds.amazonaws.com",
  username: process.env.DB_USER || "postgre",
  database: process.env.DB_NAME || "postgres",
  password: process.env.DB_PASSWORD || "TaskRios401",
  port: process.env.DB_PORT || 5432,
  dialect: "postgres",
  logging: console.log,
  dialectOptions: {
    ssl: { require: true, rejectUnauthorized: false }, // SSL para AWS
  },
};

// 2️⃣ Configuración para PostgreSQL local (OPCIONAL)
const LOCAL_CONFIG = {
  host: process.env.LOCAL_DB_HOST || "localhost",
  username: process.env.LOCAL_DB_USER || "san",
  database: process.env.LOCAL_DB_NAME || "TasksRios",
  password: process.env.LOCAL_DB_PASSWORD || "santy401", // Cambia esto
  port: process.env.LOCAL_DB_PORT || 5432,
  dialect: "postgres",
  logging: console.log,
  // Sin SSL (local normalmente no usa SSL)
};

// 3️⃣ Elegir configuración dinámicamente basado en NODE_ENV
const useLocalDB = process.env.NODE_ENV === "production"; // Usa local en desarrollo
const selectedConfig = useLocalDB ? LOCAL_CONFIG : AWS_CONFIG;

const sequelize = new Sequelize(selectedConfig);

// 4️⃣ Verificar conexión
(async () => {
  try {
    await sequelize.authenticate();
    console.log(
      useLocalDB
        ? "🟢 Conectado a PostgreSQL LOCAL (manual override)"
        : "🟢 Conectado a AWS RDS (default)"
    );

    await sequelize.sync({ alter: true, force: false });
    console.log("✅ Tablas sincronizadas");
  } catch (error) {
    console.error("🔴 Error de conexión:", error.message);
    process.exit(1);
  }
})();

export default sequelize;