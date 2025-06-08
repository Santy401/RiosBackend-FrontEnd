import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/authContext';
import areaService from '../services/areaService';
import companyService from '../services/companyService';
import taskService from '../services/taskService';
import userService from '../services/userService';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  Bell, 
  ClipboardList, 
  User, 
  Building, 
  Map, 
  X,
  Check,
  AlertCircle,
  Clock
} from 'lucide-react';
import './styles/Notifications.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [removedNotifications, setRemovedNotifications] = useState(() => {
    const saved = localStorage.getItem('removedNotifications');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  const [selectedFilter, setSelectedFilter] = useState('all');

  const notificationTypes = {
    TASK: 'tarea',
    USER: 'usuario',
    COMPANY: 'empresa',
    AREA: 'área'
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case notificationTypes.TASK:
        return <ClipboardList size={20} />;
      case notificationTypes.USER:
        return <User size={20} />;
      case notificationTypes.COMPANY:
        return <Building size={20} />;
      case notificationTypes.AREA:
        return <Map size={20} />;
      default:
        return <Bell size={20} />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case notificationTypes.TASK:
        return '#2563eb';
      case notificationTypes.USER:
        return '#10b981';
      case notificationTypes.COMPANY:
        return '#8b5cf6';
      case notificationTypes.AREA:
        return '#f59e0b';
      default:
        return '#64748b';
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      month: 'short',
      day: '2-digit'
    });
  };

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get all relevant data for notifications
      const [tasks, users, companies, areas] = await Promise.all([
        taskService.getAllTasks(),
        userService.getAllUsers(),
        companyService.getAllCompanies(),
        areaService.getAllAreas()
      ]);

      // Filter out default admin user
      const filteredUsers = users.filter(user => user.role !== 'admin' || user.name !== 'admin');

      // Create notifications based on the data
      const newNotifications = [
        // Task notifications
        ...tasks.map(task => ({
          id: `task-${task.id}`,
          type: notificationTypes.TASK,
          title: `Nueva tarea: ${task.title}`,
          description: `Asignada a ${task.assigned_to.name} en ${task.company.name}`,
          timestamp: task.createdAt,
          status: task.status,
          icon: getNotificationIcon(notificationTypes.TASK),
          color: getNotificationColor(notificationTypes.TASK)
        })).filter(taskNotif => !removedNotifications.has(taskNotif.id)),

        // User notifications
        ...filteredUsers.map(user => ({
          id: `user-${user.id}`,
          type: notificationTypes.USER,
          title: `Nuevo usuario: ${user.name}`,
          description: `Rol: ${user.role}`,
          timestamp: user.createdAt,
          status: 'active',
          icon: getNotificationIcon(notificationTypes.USER),
          color: getNotificationColor(notificationTypes.USER)
        })).filter(userNotif => !removedNotifications.has(userNotif.id)),

        // Company notifications
        ...companies.map(company => ({
          id: `company-${company.id}`,
          type: notificationTypes.COMPANY,
          title: `Nueva empresa: ${company.name}`,
          description: `Tipo: ${company.companyType}`,
          timestamp: company.createdAt,
          status: 'active',
          icon: getNotificationIcon(notificationTypes.COMPANY),
          color: getNotificationColor(notificationTypes.COMPANY)
        })).filter(companyNotif => !removedNotifications.has(companyNotif.id)),

        // Area notifications
        ...areas.map(area => ({
          id: `area-${area.id_area}`,
          type: notificationTypes.AREA,
          title: `Nueva área: ${area.nombre_area}`,
          description: `Departamento: ${area.departamento}`,
          timestamp: area.createdAt,
          status: 'active',
          icon: getNotificationIcon(notificationTypes.AREA),
          color: getNotificationColor(notificationTypes.AREA)
        })).filter(areaNotif => !removedNotifications.has(areaNotif.id))
      ];

      // Sort notifications by timestamp (newest first)
      newNotifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      setNotifications(newNotifications);
    } catch (err) {
      console.error('Error loading notifications:', err);
      setError(err.message || 'Error al cargar las notificaciones');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, [removedNotifications]); // Se ejecuta cuando cambian las notificaciones eliminadas

  const markAsRead = (notificationId) => {
    setNotifications(notifications.map(notif => 
      notif.id === notificationId ? { ...notif, status: 'read' } : notif
    ));
  };

  const removeNotification = (notificationId) => {
    const newSet = new Set([...removedNotifications, notificationId]);
    setRemovedNotifications(newSet);
    localStorage.setItem('removedNotifications', JSON.stringify(Array.from(newSet)));
    toast.success('Notificación eliminada');
  };

  if (loading) return <div className="loading-notifications"><Clock className="animate-spin" /> Cargando notificaciones...</div>;
  if (error) return <div className="error-notifications"><AlertCircle /> {error}</div>;

  return (
    <div className="notifications-container">
      <h2><Bell className="inline-icon" /> Notificaciones</h2>
      
      <div className="notifications-filters">
        <button 
          className={`filter-button ${selectedFilter === 'all' ? 'active' : ''}`} 
          onClick={() => setSelectedFilter('all')}
        >
          Todas
        </button>
        <button 
          className={`filter-button ${selectedFilter === 'task' ? 'active' : ''}`} 
          onClick={() => setSelectedFilter('task')}
        >
          <ClipboardList size={16} /> Tareas
        </button>
        <button 
          className={`filter-button ${selectedFilter === 'user' ? 'active' : ''}`} 
          onClick={() => setSelectedFilter('user')}
        >
          <User size={16} /> Usuarios
        </button>
        <button 
          className={`filter-button ${selectedFilter === 'company' ? 'active' : ''}`} 
          onClick={() => setSelectedFilter('company')}
        >
          <Building size={16} /> Empresas
        </button>
        <button 
          className={`filter-button ${selectedFilter === 'area' ? 'active' : ''}`} 
          onClick={() => setSelectedFilter('area')}
        >
          <Map size={16} /> Áreas
        </button>
      </div>

      <div className="notifications-list">
        {notifications
          .filter(notification => 
            selectedFilter === 'all' || 
            notification.type === notificationTypes[selectedFilter.toUpperCase()]
          )
          .map((notification) => (
          <div 
            key={notification.id}
            className={`notification-item ${notification.status === 'read' ? 'read' : ''}`}
            onClick={() => markAsRead(notification.id)}
          >
            <button 
              className="delete-button" 
              onClick={(e) => {
                e.stopPropagation();
                removeNotification(notification.id);
              }}
              title="Eliminar notificación"
            >
              <X size={18} />
            </button>
            <div className="notification-icon" style={{ color: notification.color }}>
              {notification.icon}
            </div>
            <div className="notification-content">
                
              <div className="notification-header">
                <span className="notification-title">{notification.title}</span>
                <span className="notification-timestamp">
                  {formatTimestamp(notification.timestamp)}
                </span>
              </div>
              <div className="notification-description">
                {notification.description}
              </div>
            </div>
          </div>
        ))}
      </div>
      {notifications
          .filter(notification => 
            selectedFilter === 'all' || 
            notification.type === notificationTypes[selectedFilter.toUpperCase()]
          ).length === 0 && (
        <div className="no-notifications">
          <Check size={20} /> {selectedFilter === 'all' 
            ? 'No hay notificaciones recientes'
            : `No hay notificaciones de ${notificationTypes[selectedFilter.toUpperCase()].toLowerCase()}s`}
        </div>
      )}

    </div>
  );
};

export default Notifications;