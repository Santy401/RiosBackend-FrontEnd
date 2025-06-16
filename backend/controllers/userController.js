import UserService from '../services/userService.js';
import User from '../models/userModel.js';

const getAllUsers = async (req, res, next) => {
  try {
    const users = await UserService.getAllUsers();
    res.json(users);
  } catch (error) {
    next(error);
  }
};

const createUser = async (req, res, next) => {
  try {
    const user = await UserService.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    if (user.email === 'erios@riosbackend.com') {
      return res.status(403).json({ error: '❌ No puedes eliminar al usuario admin' });
    }

    await user.destroy();
    res.json({ message: '✅ Usuario eliminado correctamente' });

  } catch (error) {
    console.error('Error en deleteUser:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};



export default {
  getAllUsers,
  createUser,
  deleteUser,
};
