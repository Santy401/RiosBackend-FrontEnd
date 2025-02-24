const API_URL = import.meta.env.VITE_BACK_URL;

export const authService = {
  login: async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error en la autenticación');
      }

      localStorage.setItem('user', JSON.stringify(data.user));
      return data.user;
    } catch (error) {
      console.error('Error de autenticación:', error);
      throw error;
    }
  },
  getCurrentUser: () => {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        console.warn('No se encontró usuario en localStorage');
        return null;
      }
      return JSON.parse(userStr);
    } catch (error) {
      console.error('Error al obtener usuario actual:', error);
      return null;
    }
  },

  logout: () => {
    localStorage.removeItem('user');
  },
};
