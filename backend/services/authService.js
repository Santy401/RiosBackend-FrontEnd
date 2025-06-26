import jwt from 'jsonwebtoken';

import bcrypt from 'bcryptjs';

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
  console.log('Contraseña original:', password);
console.log('Contraseña encriptada:', hashedPassword)

  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
  });

  console.log('Usuario creado:', newUser); 

  return newUser;
};


const login = async (loginData) => {
  const { email, password } = loginData;

  if (!email || !password) {
    throw new Error('Por favor proporcione email y contraseña');
  }

  console.log('Buscando usuario con email:', email);

  const user = await User.findOne({ where: { email: email.trim() } });

  if (!user) {
    console.log('Usuario no encontrado');
    throw new Error('Credenciales inválidas');
  }

  console.log('Usuario encontrado:', user);

  console.log('Contraseña ingresada:', password);
  console.log('Contraseña almacenada en BD:', user.password);


  const isPasswordValid = await bcrypt.compare(password.trim(), user.password);
  console.log('Contraseña ingresada:', password);
console.log('Contraseña almacenada en BD:', user.password);

  if (!isPasswordValid) {
    throw new Error('Credenciales inválidas');
  }

  console.log('Login exitoso, generando token...');

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


export const initializeAdminUser = async () => {
  await User.destroy({ where: { email: 'erios@riosbackend.com' } });

  console.log('Usuario admin eliminado, creando nuevo...');

  await User.create({
    name: 'Eduardo Rios',
    email: 'erios@riosbackend.com',
    password: 'H2025c*',
    role: 'admin',
    protected: true,
  });

  console.log('Admin user created!');
};



export default {
  register,
  login,
};
