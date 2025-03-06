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
      allowNull: true,
    },
    nit: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true,
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
  }
);

export default Company;
