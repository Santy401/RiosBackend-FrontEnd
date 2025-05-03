import { DataTypes } from 'sequelize';

import sequelize from '../config/database.js';

import Company from './company.js';


const area = sequelize.define(
  'areas',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_area', 
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
      type: DataTypes.STRING,
      defaultValue: 'active',
      validate: {
        isIn: [['active', 'inactive']]
      }
    },
  },
  {
    tableName: 'areas',
    timestamps: true,
  }
);

area.belongsTo(Company, { foreignKey: 'id_empresa', as: 'companyInfo' });
Company.hasMany(area, { foreignKey: 'id_empresa', as: 'areas' });

export default area;
