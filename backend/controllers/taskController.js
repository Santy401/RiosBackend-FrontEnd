import Task from "../models/taskModel";
import User from "../models/userModel";


const createTask = async (req, res) => {
  const { title, description, assigned_to } = req.body;

 
  const newTask = new Task({ title, description, assigned_to });

 
  await newTask.save();

 
  await User.findByIdAndUpdate(assigned_to, {
    $push: { assignedTasks: newTask._id },
  });

  res.status(201).json({ message: "Tarea creada y asignada correctamente" });
};


const getTasks = async (req, res) => {
  const userId = req.userId; 

  const tasks = await Task.find({ assigned_to: userId });
  res.json({ tasks });
};

export { createTask, getTasks };
