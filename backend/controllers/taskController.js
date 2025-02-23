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

export default {
  getAllTasks,
  createTask,
};
