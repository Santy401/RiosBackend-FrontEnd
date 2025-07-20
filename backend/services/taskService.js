import Areas from '../models/areaModel.js';
import Company from '../models/company.js';
import Task from '../models/taskModel.js';
import User from '../models/userModel.js';

const getAllTasks = async (user) => {
  try {
    const query = user.role === 'admin' ? {} : { where: { assigned_to: user.id } };
    const tasks = await Task.findAll({
      ...query,
      include: [
        { model: User, as: 'assignedUser', attributes: ['id', 'name', 'email'] },
        { model: Company, as: 'company', attributes: ['id', 'name', 'nit'] },
        { model: Areas, as: 'Areas', attributes: ['id_area', 'nombre_area', 'departamento', 'descripcion'] }
      ],
      order: [['due_date', 'ASC']],
    });
    return tasks;
  } catch (error) {
    console.error('Error al obtener tareas:', error);
    throw new Error('Error al obtener tareas');
  }
};

const createTask = async (taskData) => {
  try {
    // La fecha ya viene en el formato correcto (YYYY-MM-DD)
    const newTask = await Task.create(taskData);
    return newTask;
  } catch (error) {
    console.error("Error al crear tarea:", error);
    throw error;
  }
};

const updateTask = async (id, taskData) => {
  const task = await Task.findByPk(id);
  if (!task) {
    throw new Error(`Tarea con ID ${id} no encontrada.`);
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

module.exports = {
  getAllTasks,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask
};
