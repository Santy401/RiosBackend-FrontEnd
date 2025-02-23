import axios from 'axios';

const API_URL = "https://task-api.riosbackend.com";

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No hay token de autenticación');
  }
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };
};

export const getAllTasks = async () => {
  try {
    const config = getAuthHeaders();
    console.log('Configuración de la petición:', config);

    const response = await axios.get(`${API_URL}/tasks`, config);
    return response.data;
  } catch (error) {
    console.error('Error en getAllTasks:', error);
    if (error.response?.status === 403) {
      throw new Error('No tienes permisos para ver las tareas');
    }
    throw new Error('Error al obtener tareas');
  }
};

export const taskService = {
  getAllTasks: async () => {
    try {
      const config = getAuthHeaders();
      const response = await axios.get(`${API_URL}/tasks`, config);
      return response.data;
    } catch (error) {
      console.error('Error en getAllTasks:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener las tareas');
    }
  },

  getFormData: async () => {
    try {
      const config = getAuthHeaders();
      const response = await axios.get(`${API_URL}/task-form-data`, config);
      return response.data;
    } catch (error) {
      console.error('Error al obtener datos del formulario:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener datos del formulario');
    }
  },

  createTask: async (taskData) => {
    try {
      const requiredFields = [
        'title',
        'observation',
        'dueDate',
        'assigned_to',
        'company_id',
        'area_id',
        'status',
      ];
      for (let field of requiredFields) {
        if (!taskData[field]) {
          console.error(`${field} es obligatorio`);
          throw new Error(`${field} es obligatorio`);
        }
      }

      console.log('taskData:', taskData);

      const response = await axios.post(`${API_URL}/tasks`, taskData, getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error('Error en createTask:', error);
      throw new Error(error.response?.data?.message || 'Error al crear la tarea');
    }
  },

  updateTask: async (id, taskData) => {
    try {
      if (!id || typeof id !== 'number') {
        throw new Error('ID inválido para actualizar la tarea');
      }

      if (!taskData || typeof taskData !== 'object' || Array.isArray(taskData)) {
        throw new Error('Datos de tarea inválidos');
      }

      console.log('Datos de tarea a actualizar:', taskData);

      const config = getAuthHeaders();
      const response = await axios.put(`${API_URL}/tasks/${id}`, taskData, config);

      if (response.status !== 200) {
        throw new Error(`Error al actualizar la tarea, código de estado: ${response.status}`);
      }

      console.log('Tarea actualizada correctamente:', response.data);

      return response.data.task;
    } catch (error) {
      console.error('Error en updateTask:', error.response ? error.response.data : error.message);

      throw new Error(error.response?.data?.message || 'Error al actualizar la tarea');
    }
  },

  deleteTask: async (id) => {
    try {
      if (typeof id === 'undefined' || id === null) {
        throw new Error('ID de tarea inválido');
      }

      console.log('Intentando eliminar tarea con ID:', id);

      const config = getAuthHeaders();
      const response = await axios.delete(`${API_URL}/tasks/${id}`, config);

      if (!response.data || typeof response.data.taskId === 'undefined') {
        throw new Error('Respuesta inválida del servidor');
      }

      return response.data;
    } catch (error) {
      console.error('Error detallado en deleteTask:', error.response?.data || error);

      if (error.response?.status === 404) {
        throw new Error('Tarea no encontrada');
      }
      if (error.response?.status === 403) {
        throw new Error('No tienes permisos para eliminar esta tarea');
      }

      throw new Error(error.message || 'Error al eliminar la tarea');
    }
  },

  updateTaskStatus: async (id, status) => {
    try {
      const config = getAuthHeaders();
      const response = await axios.put(`${API_URL}/tasks/${id}`, { status }, config);

      if (!response.data || !response.data.task) {
        throw new Error('Respuesta inválida del servidor');
      }

      return response.data.task;
    } catch (error) {
      console.error('Error en updateTaskStatus:', error);
      if (error.response?.status === 404) {
        throw new Error('Tarea no encontrada');
      }
      if (error.response?.status === 403) {
        throw new Error('No tienes permisos para actualizar esta tarea');
      }
      throw new Error(error.response?.data?.message || 'Error al actualizar el estado de la tarea');
    }
  },
};

export default taskService;
