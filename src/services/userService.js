import api from './api';

export const userService = {
  getAllUsers: async () => {
    try {
      const response = await api.get('/users');
      return response.data;
    } catch (error) {
      console.error('Error en getAllUsers:', error);
      throw new Error('Error al obtener usuarios');
    }
  },

  createUser: async (userData) => {
    try {
      const response = await api.post('/users', userData);
      return response.data.user;
    } catch (error) {
      console.error('Error en createUser:', error);
      throw new Error(error.response?.data?.message || 'Error al crear el usuario');
    }
  },

  updateUser: async (id, userData) => {
    try {
      const response = await api.put(`/users/${id}`, userData);
      return response.data;
    } catch (error) {
      console.error('Error en updateUser:', error);
      throw new Error(error.response?.data?.message || 'Error al actualizar el usuario');
    }
  },

  deleteUser: async (id) => {
    try {
      const response = await api.delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error en deleteUser:', error);
      
      if (error.response) {
        if (error.response.status === 403) {
          throw new Error('❌ No puedes eliminar al administrador');
        }
        throw new Error(error.response.data.message || 'Error al eliminar el usuario');
      } else if (error.request) {
        throw new Error('No se pudo conectar con el servidor');
      } else {
        throw new Error('Error al procesar la solicitud');
      }
    }
  },
};

export default userService;
