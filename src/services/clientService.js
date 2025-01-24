import api from "./api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No hay token de autenticación");
  }
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

export const clientService = {
  getAllClients: async () => {
    try {
      const config = getAuthHeaders();
      const response = await api.get("/clients", config);
      return response.data;
    } catch (error) {
      console.error("Error en getAllClients:", error);
      throw new Error(
        error.response?.data?.message || "Error al obtener los clientes"
      );
    }
  },

  getClientById: async (id) => {
    try {
      const config = getAuthHeaders();
      const response = await api.get(`/clients/${id}`, config);
      return response.data;
    } catch (error) {
      console.error("Error en getClientById:", error);
      throw new Error(
        error.response?.data?.message || "Error al obtener el cliente"
      );
    }
  },

  createClient: async (clientData) => {
    try {
      const config = getAuthHeaders();
      const response = await api.post("/clients", clientData, config);

      if (!response.data || !response.data.client) {
        throw new Error("Respuesta inválida del servidor");
      }

      return response.data.client;
    } catch (error) {
      console.error("Error en createClient:", error);
      throw new Error(
        error.response?.data?.message || "Error al crear el cliente"
      );
    }
  },

  updateClient: async (id, clientData) => {
    try {
      const config = getAuthHeaders();
      const response = await api.put(`/clients/${id}`, clientData, config);

      if (!response.data) {
        throw new Error("Respuesta inválida del servidor");
      }

      return response.data;
    } catch (error) {
      console.error("Error en updateClient:", error);
      throw new Error(
        error.response?.data?.message || "Error al actualizar el cliente"
      );
    }
  },

  deleteClient: async (id) => {
    try {
      const config = getAuthHeaders();
      const response = await api.delete(`/clients/${id}`, config);
      return response.data;
    } catch (error) {
      console.error("Error en deleteClient:", error);
      throw new Error(
        error.response?.data?.message || "Error al eliminar el cliente"
      );
    }
  },
};

export default clientService;
