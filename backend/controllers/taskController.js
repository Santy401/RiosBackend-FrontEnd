import TaskService from '../services/taskService.js';

const getAllTasks = async (req, res, next) => {
  try {
    const tasks = await TaskService.getAllTasks(req.user);
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

const createTask = async (req, res, next) => {
  try {
    const task = await TaskService.createTask(req.body);
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedTask = await TaskService.updateTask(id, req.body);
    res.json(updatedTask);
  } catch (error) {
    next(error);
  }
};

const updateTaskStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updatedTask = await TaskService.updateTaskStatus(id, status);
    res.json(updatedTask);
  } catch (error) {
    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    await TaskService.deleteTask(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export default {
  getAllTasks,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
};
