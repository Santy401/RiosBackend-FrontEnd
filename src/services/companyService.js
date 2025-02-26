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

export const companyService = {
  getAllCompanies: async () => {
    try {
      const config = getAuthHeaders();
      const response = await api.get("/companies", config);
      return response.data;
    } catch (error) {
      console.error("Error en getAllCompanies:", error);
      throw new Error("Error al obtener las empresas");
    }
  },

  createCompany: async (companyData) => {
    try {
      console.log("🟡 Enviando datos al backend:", companyData); // 👀 Asegúrate de que `nombre` y `nit` estén presentes
      const response = await api.post("/companies", companyData, {
        headers: { "Content-Type": "application/json" },
      });
      return response.data;
    } catch (error) {
      console.error("🔴 Error en createCompany:", error.response?.data || error.message);
      throw new Error(
        error.response?.data?.error || "Error al crear la empresa"
      );
    }
  },

  updateCompany: async (id, companyData) => {
    try {
      const config = getAuthHeaders();
      const response = await api.put(`/companies/${id}`, companyData, config);
      return response.data;
    } catch (error) {
      console.error("Error en updateCompany:", error);
      throw new Error(
        error.response?.data?.message || "Error al actualizar la empresa"
      );
    }
  },

  deleteCompany: async (id) => {
    try {
      const config = getAuthHeaders();
      const response = await api.delete(`/companies/${id}`, config);
      return response.data;
    } catch (error) {
      console.error("Error en deleteCompany:", error.response ? error.response.data : error.message); 
      throw new Error(
        error.response?.data?.message || "Error al eliminar la empresa"
      ); 
    }
  },
};

export default companyService;
