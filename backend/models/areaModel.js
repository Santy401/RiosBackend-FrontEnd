import { DataTypes } from 'sequelize';

import sequelize from '../config/database.js';

import Company from './company.js';

const Area = sequelize.define(
  'Area',
  {
    id_area: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre_area: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
    },
    departamento: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    id_empresa: {
      type: DataTypes.INTEGER,
      references: {
        model: Company,
        key: 'id',
      },
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      defaultValue: 'active',
    },
  },
  {
    tableName: 'Areas',
    timestamps: true,
  }
);

Area.belongsTo(Company, { foreignKey: 'id_empresa', as: 'companyInfo' });
Company.hasMany(Area, { foreignKey: 'id_empresa', as: 'areas' });

export default Area;
