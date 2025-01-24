import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:6005",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      return Promise.reject(
        new Error(
          "No se pudo conectar con el servidor. Por favor, verifica tu conexión."
        )
      );
    }
    return Promise.reject(error);
  }
);

export default api;

export const loginService = async (email, password) => {
  try {
    console.log("Intentando login con:", { email });

    const response = await api.post("/login", {
      email,
      password,
    });

    console.log("Respuesta del servidor:", response.data);

    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      api.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`;
    }

    return response.data;
  } catch (error) {
    console.error("Error completo:", error);
    throw error.response?.data?.message || "Error al iniciar sesión";
  }
};

export const registerService = async (userData) => {
  try {
    const response = await api.post("/register", userData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Error al registrar usuario";
  }
};


export const tasksAPI = {
  fetch: () => api.get("/tasks"),
  save: (tasks) => api.post("/tasks", tasks),
};

export const usersAPI = {
  fetch: () => api.get("/users"),
  save: (users) => api.post("/users", users),
};

export const companiesAPI = {
  fetch: () => api.get("/companies"),
  save: (companies) => api.post("/companies", companies),
};

export const areasAPI = {
  fetch: () => api.get("/areas"),
  save: (areas) => api.post("/areas", areas),
};
