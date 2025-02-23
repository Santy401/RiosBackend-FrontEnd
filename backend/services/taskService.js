import Area from '../models/areaModel.js';
import Company from '../models/company.js';
import Task from '../models/taskModel.js';
import User from '../models/userModel.js';

const getAllTasks = async (user) => {
  const query = user.role === 'admin' ? {} : { where: { assigned_to: user.id } };
  return await Task.findAll({
    ...query,
    include: [
      { model: User, as: 'assignedUser', attributes: ['id', 'name', 'email'] },
      { model: Company, as: 'company', attributes: ['id', 'name', 'nit'] },
      { model: Area, as: 'area', attributes: ['id_area', 'nombre_area', 'departamento'] },
    ],
    order: [['dueDate', 'ASC']],
  });
};

const createTask = async (taskData) => {
  return await Task.create(taskData);
};

export default {
  getAllTasks,
  createTask,
};
