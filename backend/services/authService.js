import jwt from 'jsonwebtoken';

import bcrypt from 'bcrypt';

import dotenv from 'dotenv';

import User from '../models/userModel.js';

dotenv.config();

const register = async (userData) => {
  const { name, email, password, role } = userData;

  if (!name || !email || !password || !role) {
    throw new Error('Nombre, email, contraseña y rol son requeridos');
  }

  if (!['admin', 'user'].includes(role)) {
    throw new Error("Rol inválido. Debe ser 'admin' o 'user'");
  }

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new Error('El email ya está registrado');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  return await User.create({
    name,
    email,
    password: hashedPassword,
    role,
  });
};

const login = async (loginData) => {
  const { email, password } = loginData;

  if (!email || !password) {
    throw new Error('Por favor proporcione email y contraseña');
  }
  console.log(email);
  const user = await User.findOne({ where: { email: email.trim() } });
  if (!user) {
    throw new Error('Credenciales inválidas');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Credenciales inválidas');
  }
  console.log(user.password);
  const token = jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  return {
    message: 'Login exitoso',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

export default {
  register,
  login,
};
