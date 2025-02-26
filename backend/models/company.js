import { DataTypes } from 'sequelize';

import sequelize from '../config/database.js';

const Company = sequelize.define(
  'Company',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nit: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true,
      },
    },
    cellphone: DataTypes.STRING,
    dian: DataTypes.STRING,
    legalSignature: DataTypes.STRING,
    accountingSoftware: DataTypes.STRING,
    user: DataTypes.STRING,
    password: DataTypes.STRING,
    mailServer: DataTypes.STRING,
    companyType: {
      type: DataTypes.ENUM('A', 'B', 'C'),
      defaultValue: 'A',
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      defaultValue: 'active',
    },
  },
  {
    tableName: 'companies',
    timestamps: true,
    hooks: {
      beforeDestroy: async (company) => {
        const [hasAreas, hasClients] = await Promise.all([
          Area.findOne({ where: { id_empresa: company.id } }),
          Client.findOne({ where: { company_id: company.id } }),
        ]);

        if (hasAreas || hasClients) {
          throw new Error('No se puede eliminar la empresa porque tiene registros asociados');
        }
      },
    },
  }
);

export default Company;
