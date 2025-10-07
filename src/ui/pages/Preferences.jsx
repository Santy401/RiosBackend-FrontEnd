import { useState, useEffect } from 'react';
import '../styles/Preferences.css';

const Preferences = () => {
  const [darkMode, setDarkMode] = useState(() => {
    // Leer del localStorage al cargar
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });

  // Efecto para aplicar/remover la clase de modo oscuro
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark-theme');
    } else {
      document.documentElement.classList.remove('dark-theme');
    }
    // Guardar preferencia en localStorage
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  return (
    <div className="preferences-container">
      <h2>Preferencias</h2>
      <div className="switch-Mode">
        <label className="switch-label">Modo oscuro</label>
        <div className="switch-container">
          <label className="switch">
            <input 
              type="checkbox" 
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
            />
            <span className="slider round"></span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default Preferences;
