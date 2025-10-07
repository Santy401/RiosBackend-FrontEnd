import React, { useState, useEffect } from 'react';
import {
  Bell, ClipboardList, User, Building, Map, X, Check,
} from 'lucide-react';
import './styles/Notifications.css';

const Notifications = ({ onUpdateUnreadCount }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Filtros disponibles
  const filters = [
    { id: 'all', label: 'Todas', icon: <Bell size={16} /> },
    { id: 'task', label: 'Tareas', icon: <ClipboardList size={16} /> },
    { id: 'user', label: 'Usuarios', icon: <User size={16} /> },
    { id: 'company', label: 'Empresas', icon: <Building size={16} /> },
    { id: 'area', label: 'Áreas', icon: <Map size={16} /> }
  ];

  // Actualizar contador de no leídas cuando cambian las notificaciones
  useEffect(() => {
    if (onUpdateUnreadCount) {
      const unread = notifications.filter(n => n.status === 'unread').length;
      onUpdateUnreadCount(unread);
    }
  }, [notifications, onUpdateUnreadCount]);

  // Simulación de carga de datos
  useEffect(() => {
    const timer = setTimeout(() => {
      const mockNotifications = [
        {
          id: 'task-1',
          type: 'task',
          title: 'Revisar documentación',
          description: 'Documentación pendiente de revisión',
          timestamp: new Date(),
          status: 'unread'
        },
        {
          id: 'user-1',
          type: 'user',
          title: 'Nuevo usuario registrado',
          description: 'Juan Pérez se ha registrado',
          timestamp: new Date(Date.now() - 3600000),
          status: 'read'
        }
      ];
      setNotifications(mockNotifications);
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const markAsRead = (id) => {
    const updatedNotifications = notifications.map(n =>
      n.id === id ? { ...n, status: 'read' } : n
    );
    setNotifications(updatedNotifications);
  };

  const removeNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const filteredNotifications = notifications.filter(n =>
    selectedFilter === 'all' || n.type === selectedFilter
  );

  if (loading) {
    return (
      <div className="loader-notifications">
      </div>
    );
  }

  return (
    <div className="minimal-notifications">
      <div className="minimal-header">
        <div className="minimal-filters">
          {filters.map(filter => (
            <button
              key={filter.id}
              className={`minimal-filter ${selectedFilter === filter.id ? 'activee' : ''}`}
              onClick={() => setSelectedFilter(filter.id)}
              title={filter.label}
            >
              {filter.icon}
            </button>
          ))}
        </div>
      </div>

      <div className="minimal-list">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map(notification => (
            <div
              key={notification.id}
              className={`minimal-item ${notification.status}`}
              onClick={() => markAsRead(notification.id)}
            >
              <div className="minimal-icon">
                {filters.find(f => f.id === notification.type)?.icon}
              </div>
              <div className="minimal-content">
                <div className="minimal-main">
                  <span className="minimal-title">{notification.title}</span>
                  <button
                    className="minimal-close"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeNotification(notification.id);
                    }}
                  >
                    <X size={14} />
                  </button>
                </div>
                <div className="minimal-description">{notification.description}</div>
                <div className="minimal-time">
                  {new Date(notification.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="minimal-empty">
            <Check size={16} />
            No hay notificaciones
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;