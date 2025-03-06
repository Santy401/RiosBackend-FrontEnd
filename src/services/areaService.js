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

export const areaService = {
  getAllAreas: async () => {
    try {
      const config = getAuthHeaders();
      const response = await api.get("/areas", config);
      return response.data;
    } catch (error) {
      console.error("Error en getAllAreas:", error);
      throw new Error("Error al obtener las áreas");
    }
  },

  createArea: async (areaData) => {
    try {
      console.log("🟡 Enviando datos al backend:", JSON.stringify(areaData, null, 2));
      const config = getAuthHeaders();
      const response = await api.post("/areas", areaData, config);
      return response.data;
    } catch (error) {
      console.error("🔴 Error en createArea:", error.response?.data || error.message);
      throw new Error(
        error.response?.data?.error || "Error al crear el área"
      );
    }
  },

  updateArea: async (id, areaData) => {
    try {
      const config = getAuthHeaders();
      const response = await api.put(`/areas/${id}`, areaData, config);
      return response.data;
    } catch (error) {
      console.error("Error en updateArea:", error);
      throw new Error(
        error.response?.data?.message || "Error al actualizar el área"
      );
    }
  },

  deleteArea: async (id) => {
    try {
      const config = getAuthHeaders();
      const response = await api.delete(`/areas/${id}`, config);
      return response.data;
    } catch (error) {
      console.error("Error en deleteArea:", error.response ? error.response.data : error.message);
      throw new Error(
        error.response?.data?.message || "Error al eliminar el área"
      );
    }
  },
};

export default areaService;
