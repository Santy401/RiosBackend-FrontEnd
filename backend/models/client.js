import { DataTypes } from 'sequelize';

import sequelize from '../config/database.js';

import Company from './company.js';

const Client = sequelize.define(
  'Client',
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nit: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    cedula: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dianKey: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    electronicSignature: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    accountingSoftware: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    emailServer: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    emailServerUser: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    claveUser: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    claveCC: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    claveSS: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    claveMas: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    tipoEmpresa: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    company_id: {
      type: DataTypes.BIGINT,
      references: {
        model: Company,
        key: 'id',
      },
    }
  },
  {
    tableName: 'clients',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['nit'],
      },
    ],
  }
);

Client.belongsTo(Company, { foreignKey: 'company_id', as: 'companyData' });
Company.hasMany(Client, { foreignKey: 'company_id', as: 'clients' });

export default Client;
