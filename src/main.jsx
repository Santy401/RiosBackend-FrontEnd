import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { AuthProvider } from "./context/authContext.jsx";

// Función para inicializar el modo oscuro
document.addEventListener('DOMContentLoaded', () => {
  const darkMode = localStorage.getItem('darkMode') === 'true';
  if (darkMode) {
    document.documentElement.classList.add('dark-theme');
  }
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider> 
      <App />
    </AuthProvider>
  </StrictMode>
);
