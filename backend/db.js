import sequelize from './config/database.js';

sequelize.authenticate()
  .then(() => {
    console.log('🟢 Conexión con PostgreSQL exitosa!');
  })
  .catch(err => {
    console.error('🔴 Error al conectar con PostgreSQL:', err);
  });