import api from './api';

export const taksAnalyticsService = {
  getAnalytics: async () => {
    try {
      const [tasksResponse, usersResponse] = await Promise.all([
        api.get('/tasks'),
        api.get('/users')
      ]);

      const tasks = tasksResponse.data;
      const users = usersResponse.data;

      // Calcular estadísticas de tareas
      const stats = {
        taskStatus: {
          in_progress: tasks.filter(task => task.status === 'in_progress').length,
          completed: tasks.filter(task => task.status === 'completed').length,
          pending: tasks.filter(task => task.status === 'pending').length
        },
        tasks: tasks,
      };

      return stats;
    } catch (error) {
      console.error('Error en taksAnalyticsService:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener los datos de análisis de tareas');
    }
  }
};

export const usersAnalyticsService = {
  getAnalytics: async () => {
    try {
      const response = await api.get('/users');
      const users = response.data;

      // Calcular estadísticas de usuarios
      const stats = {
        userStats: {
          byRole: users.reduce((acc, user) => {
            acc[user.role] = (acc[user.role] || 0) + 1;
            return acc;
          }, {}),
          byDepartment: users.reduce((acc, user) => {
            acc[user.department] = (acc[user.department] || 0) + 1;
            return acc;
          }, {})
        }
      };

      return stats;
    } catch (error) {
      console.error('Error en usersAnalyticsService:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener los datos de análisis de usuarios');
    }
  }
};

export default { taksAnalyticsService, usersAnalyticsService };
