import { Sequelize } from 'sequelize';

import path from 'path';

import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath =
  // eslint-disable-next-line no-undef
  process.env.DATABASE_URL || path.join(__dirname, '..', 'database.sqlite');
  console.log('Ruta de la base de datos:', dbPath);

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  retry: {
    max: 3,
    timeout: 30000,
  },
  transactionType: 'IMMEDIATE',
  isolationLevel: 'READ COMMITTED',
  dialectOptions: {
    timeout: 15000,

    pragma: {
      busy_timeout: 15000,
      journal_mode: 'WAL',
    },
  },
  define: {
    timestamps: true,
    underscored: true,
  },
});

export default sequelize;
