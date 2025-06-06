import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext.jsx';
import '../styles/sessionExpired.css';

const SessionExpiredAlert = () => {
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        const expirationTime = decoded.exp * 1000;
        const currentTime = Date.now();
        
        if (currentTime > expirationTime) {
          setShowAlert(true);
          logout();
        }
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, [logout]);

  const handleAccept = () => {
    navigate('/login');
  };

  if (!showAlert) return null;

  return (
    <div className="session-expired-overlay">
      <div className="session-expired-alert">
        <h3>Sesión expirada</h3>
        <p>Ha caducado su sesión. Por favor, intente entrar otra vez.</p>
        <button onClick={handleAccept} className="accept-button">
          Aceptar
        </button>
      </div>
    </div>
  );
};

export default SessionExpiredAlert;
