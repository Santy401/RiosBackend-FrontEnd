import { DataTypes } from 'sequelize';

import sequelize from '../config/database.js';

import Area from './areaModel.js';
import Company from './company.js';
import User from './userModel.js';

const Task = sequelize.define(
  'Task',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    observation: {
      type: DataTypes.TEXT,
    },
    assigned_to: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    company_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Company,
        key: 'id',
      },
    },
    area_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Area,
        key: 'id_area',
      },
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: false,
      get() {
        const dueDate = this.getDataValue('dueDate');
        return dueDate ? dueDate.toISOString().slice(0, 16) : null;
      },
      set(value) {
        this.setDataValue('dueDate', new Date(value));
      },
    },
    status: {
      type: DataTypes.ENUM('in_progress', 'completed'),
      defaultValue: 'in_progress',
    },
  },
  {
    tableName: 'tasks',
    timestamps: true,
  }
);

Task.belongsTo(User, { as: 'assignedUser', foreignKey: 'assigned_to' });
Task.belongsTo(Company, { as: 'company', foreignKey: 'company_id' });
Task.belongsTo(Area, { as: 'area', foreignKey: 'area_id' });

export default Task;
