import api from "./api";

// eslint-disable-next-line no-unused-vars
const API_URL = "https://task-api.riosbackend.com";

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
      const response = await api.get("/areas");
      return response.data;
    } catch (error) {
      console.error("Error en getAllAreas:", error);
      throw new Error("Error al obtener las áreas");
    }
  },

  createArea: async (areaData) => {
    try {
      const formattedData = {
        nombre_area: areaData.nombre_area,
        departamento: areaData.departamento,
        descripcion: areaData.descripcion || "",
        id_empresa: areaData.id_empresa,
        status: areaData.status || "active",
      };

      console.log("Enviando datos del área:", formattedData);
      const response = await api.post("/areas", formattedData);

      if (!response.data || !response.data.area) {
        throw new Error("Respuesta inválida del servidor");
      }

      return response.data.area;
    } catch (error) {
      console.error("Error detallado en createArea:", error);
      if (error.response) {
        throw new Error(
          error.response.data.message || "Error al crear el área"
        );
      } else if (error.request) {
        throw new Error("No se pudo conectar con el servidor");
      } else {
        throw new Error("Error al procesar la solicitud");
      }
    }
  },

  updateArea: async (id, areaData) => {
    try {
      const formattedData = {
        ...areaData,
        descripcion: areaData.descripcion || "",
      };

      const response = await api.put(`/areas/${id}`, formattedData);

      if (!response.data || !response.data.area) {
        throw new Error("Respuesta inválida del servidor");
      }

      return response.data.area;
    } catch (error) {
      console.error("Error en updateArea:", error);
      throw new Error(
        error.response?.data?.message || "Error al actualizar el área"
      );
    }
  },

  deleteArea: async (id) => {
    try {
      if (typeof id === "undefined" || id === null) {
        throw new Error("ID de área inválido");
      }

      console.log("Intentando eliminar área con ID:", id);

      const config = getAuthHeaders();
      const response = await api.delete(`/areas/${id}`, config);

      if (!response.data) {
        throw new Error("Respuesta inválida del servidor");
      }

      return response.data;
    } catch (error) {
      console.error(
        "Error detallado en deleteArea:",
        error.response?.data || error
      );

      if (error.response?.status === 404) {
        throw new Error("Área no encontrada");
      }
      if (error.response?.status === 403) {
        throw new Error("No tienes permisos para eliminar esta área");
      }

      throw new Error(error.message || "Error al eliminar el área");
    }
  },
};

export default areaService;
