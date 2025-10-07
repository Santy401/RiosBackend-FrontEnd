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

// En companyService.js (frontend)
createCompany: async (companyData) => {
  try {
    const config = getAuthHeaders();
    const response = await api.post('/companies', companyData, config);
    return response.data;
  } catch (error) {
    console.error("Error al crear empresa:", error);
    throw error;
  }
}, 

updateCompany: async (id, companyData) => {
  try {
    console.log('Datos que se enviarán al backend para actualizar:', companyData);
    const config = getAuthHeaders();
    const response = await api.put(`/companies/${id}`, companyData, config);
    
    // Asegurémonos de que la respuesta tenga los datos correctos
    console.log('Respuesta del backend:', response.data);
    
    return response.data;
  } catch (error) {
    console.error("Error al actualizar empresa:", error);
    throw error;
  }
},

  deleteCompany: async (id) => {
    try {
      const config = getAuthHeaders();
      const response = await api.delete(`/companies/${id}`, config);
      return response.data;
    } catch (error) {
      console.error(
        "Error en deleteCompany:",
        error.response ? error.response.data : error.message
      );
      throw new Error(
        error.response?.data?.message || "Error al eliminar la empresa"
      );
    }
  },
};

export default companyService;
