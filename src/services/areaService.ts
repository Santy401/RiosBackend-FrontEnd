import api from "./api";

interface Area {
  id?: string;
  nombre: string;
}

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
  getAllAreas: async (): Promise<Area[]> => {
    try {
      const config = getAuthHeaders();
      const response = await api.get<Area[]>("/areas", config);
      return response.data;
    } catch (error: any) {
      console.error("Error en getAllAreas:", error);
      throw new Error("Error al obtener las áreas");
    }
  },

  createArea: async (areaData: Area): Promise<Area> => {
    try {
      console.log("🟡 Enviando datos al backend:", JSON.stringify(areaData, null, 2));
      const config = getAuthHeaders();
      const response = await api.post<Area>("/areas", areaData, config);
      return response.data;
    } catch (error: any) {
      console.error("🔴 Error en createArea:", error.response?.data || error.message);
      throw new Error(
        error.response?.data?.error || "Error al crear el área"
      );
    }
  },

  updateArea: async (id: string, areaData: Area): Promise<Area> => {
    try {
      const config = getAuthHeaders();
      const response = await api.put<Area>(`/areas/${id}`, areaData, config);
      return response.data;
    } catch (error: any) {
      console.error("Error en updateArea:", error);
      throw new Error(
        error.response?.data?.message || "Error al actualizar el área"
      );
    }
  },

  deleteArea: async (id: string): Promise<void> => {
    try {
      const config = getAuthHeaders();
      const response = await api.delete(`/areas/${id}`, config);
      return response.data;
    } catch (error: any) {
      console.error("Error en deleteArea:", error.response ? error.response.data : error.message);
      throw new Error(
        error.response?.data?.message || "Error al eliminar el área"
      );
    }
  },
};


export default areaService;
