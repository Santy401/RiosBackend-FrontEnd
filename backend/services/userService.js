import User from '../models/userModel.js';

const getAllUsers = async () => {
  return await User.findAll({
    attributes: { exclude: ['password'] },
  });
};

const createUser = async (userData) => {
  return await User.create(userData);
};

export default {
  getAllUsers,
  createUser,
};
