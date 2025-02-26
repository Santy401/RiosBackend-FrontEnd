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

const updateTask = async (id, taskData) => {
  const task = await Task.findByPk(id);
  if (!task) {
    console.log("Tarea no encontrada para actualizar");
    return null;
  }
  await task.update(taskData);
  console.log("Tarea actualizada:", id);
  return task;
};

const updateTaskStatus = async (id, status) => {
  const task = await Task.findByPk(id);
  if (!task) {
    console.log(`⚠️ Tarea con ID ${id} no encontrada para actualizar estado`);
    return null;
  }
  console.log(`✅ Actualizando estado de la tarea ${id} a ${status}`);
  await task.update({ status });
  return task;
};

const deleteTask = async (id) => {
  const task = await Task.findByPk(id);
  if (!task) {
    console.log(`⚠️ Tarea con ID ${id} no encontrada para eliminar`);
    return { success: false, message: "Tarea no encontrada" };
  }
  console.log(`🗑 Eliminando tarea con ID ${id}`);
  await task.destroy();
  return { success: true, taskId: id }; 
};




export default {
  getAllTasks,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
};
