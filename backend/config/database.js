// Configuracion De PosgreSQL
import { Sequelize } from 'sequelize';

const DB_NAME = process.env.DB_NAME || 'TasksRios';
const DB_USER = process.env.DB_USER || 'san'; 
const DB_PASSWORD = process.env.DB_PASSWORD || 'santy401';
const DB_HOST = process.env.DB_HOST || 'localhost';

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: 'postgres',
});

try {
  await sequelize.authenticate();
  console.log('🟢 Conexión con Sequelize y PostgreSQL exitosa!');

  // Sincroniza el modelo con la base de datos
  await sequelize.sync({ alter: true });
  console.log('✅ Tablas actualizadas con éxito (sync alter)');
} catch (error) {
  console.error('🔴 Error conectando con Sequelize:', error);
}

export default sequelize;