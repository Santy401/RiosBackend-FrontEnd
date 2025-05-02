import { Sequelize } from 'sequelize';

const NODE_ENV = process.env.NODE_ENV || 'development';

let sequelize;

if (NODE_ENV === 'production') {
  // En producción, se recomienda usar una sola URL de conexión (DATABASE_URL)
  const DATABASE_URL = process.env.DATABASE_URL;
  if (!DATABASE_URL) {
    throw new Error('DATABASE_URL no está definida en producción');
  }
  sequelize = new Sequelize(DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // Cambia esto según tu proveedor de hosting
      },
    },
  });
} else {
  // Local/desarrollo
  const DB_NAME = process.env.DB_NAME || 'TasksRios';
  const DB_USER = process.env.DB_USER || 'san';
  const DB_PASSWORD = process.env.DB_PASSWORD || 'santy401';
  const DB_HOST = process.env.DB_HOST || 'localhost';

  sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    dialect: 'postgres',
  });
}

(async () => {
  try {
    await sequelize.authenticate();
    console.log('🟢 Conexión con Sequelize y PostgreSQL exitosa!');

    // Sincroniza el modelo con la base de datos
    await sequelize.sync({ alter: true });
    console.log('✅ Tablas actualizadas con éxito (sync alter)');
  } catch (error) {
    console.error('🔴 Error conectando con Sequelize:', error);
  }
})();

export default sequelize;
