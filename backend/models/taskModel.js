import { DataTypes } from 'sequelize';

import sequelize from '../config/database.js';

import Areas from './areaModel.js';
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
        model: Areas,
        key: 'id_area',
      },
    },    
    due_date: {
      type: DataTypes.DATE,
      allowNull: true,
      get() {
        const dueDate = this.getDataValue('due_date');
        return dueDate ? dueDate.toISOString().slice(0, 16) : null;
      },
      set(value) {
        this.setDataValue('due_date', new Date(value));
      },
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'in_progress',
      validate: {
        isIn: [['pending', 'in_progress', 'completed']]
      }
    },
    created_at: {
      type: DataTypes.DATE,
      field: 'created_at' 
    },
    updated_at: {
      type: DataTypes.DATE,
      field: 'updated_at'
    }
  },
  {
    tableName: 'tasks',
    timestamps: true,
    underscored: true, 
  }
);

Task.belongsTo(User, { as: 'assignedUser', foreignKey: 'assigned_to' });
Task.belongsTo(Company, { as: 'company', foreignKey: 'company_id' });
Task.belongsTo(Areas, { as: 'Areas', foreignKey: 'area_id' });

export default Task;
