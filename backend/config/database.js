// Configuracion De PosgreSQL
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('TasksRios', 'san', 'santy401', {
  host: 'localhost',
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
