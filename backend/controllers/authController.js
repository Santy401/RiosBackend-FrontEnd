import AuthService from '../services/authService.js';

const register = async (req, res, next) => {
  try {
    const user = await AuthService.register(req.body);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  console.log("BODY recibido", req.body);
  try {
    const token = await AuthService.login(req.body);
    res.json(token);
  } catch (error) {
    next(error);
  }
};

export default {
  register,
  login,
};
