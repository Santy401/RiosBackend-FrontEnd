import User from '../models/userModel.js';

const getAllUsers = async () => {
  return await User.findAll({
    attributes: { exclude: ['password'] },
  });
};

const createUser = async (userData) => {
  return await User.create(userData);
};

const deleteUser = async (id) => {
  return await User.destroy({ where: { id } });
};

const updateUser = async (id, userData) => {
  const user = await User.findByPk(id);
  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  return await user.update(userData);
};


export default {
  getAllUsers,
  createUser,
  deleteUser,
  updateUser,
};
