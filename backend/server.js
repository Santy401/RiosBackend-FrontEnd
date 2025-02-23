import app from './app.js';

import sequelize from './config/database.js';

const PORT = process.env.PORT || 6005;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected!');

    await sequelize.sync({ alter: true });
    console.log('Database synchronized!');

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
};

startServer();
