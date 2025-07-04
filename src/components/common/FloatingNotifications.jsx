import React, { useState, useEffect, useRef } from 'react';
import './styles/FloatingNotifications.css';

const FloatingNotifications = ({
    notifications,
    onRemove,
    onRead,
    loading,
    error,
    icons
}) => {
    const [position, setPosition] = useState({ x: 20, y: 20 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const buttonRef = useRef(null);

    const handleMouseDown = (e) => {
        if (e.button !== 0) return; // Only left mouse button
        
        const rect = buttonRef.current.getBoundingClientRect();
        setDragOffset({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });
        setIsDragging(true);
        e.preventDefault();
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        
        setPosition({
            x: e.clientX - dragOffset.x,
            y: e.clientY - dragOffset.y
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            return () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [isDragging, dragOffset]);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState('all');
    const panelRef = useRef(null);

    const notificationTypes = {
        TASK: 'tarea',
        USER: 'usuario',
        COMPANY: 'empresa',
        AREA: 'área'
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

    const filteredNotifications = notifications.filter(notification =>
        selectedFilter === 'all' ||
        notification.type === selectedFilter.toUpperCase()
    );

    // Ensure we have at least the bell icon, use a default if not provided
    const safeIcons = {
        bell: icons?.bell || <span>🔔</span>,
        x: icons?.x || <span>✕</span>,
        check: icons?.check || <span>✓</span>,
        clock: icons?.clock || <span>⏱️</span>,
        alertCircle: icons?.alertCircle || <span>⚠️</span>,
        task: icons?.task || <span>📝</span>,
        user: icons?.user || <span>👤</span>,
        company: icons?.company || <span>🏢</span>,
        area: icons?.area || <span>🗺️</span>,
        map: icons?.map || <span>🗺️</span>,
        building: icons?.building || <span>🏢</span>,
        clipboardList: icons?.clipboardList || <span>📋</span>
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'TASK':
                return safeIcons.clipboardList;
            case 'USER':
                return safeIcons.user;
            case 'COMPANY':
                return safeIcons.building;
            case 'AREA':
                return safeIcons.map;
            default:
                return safeIcons.alertCircle;
        }
    };

    const handleClickOutside = (event) => {
        if (panelRef.current && !panelRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    if (loading) {
        return (
            <div className="loading-notifications">
                {safeIcons.clock}
                Cargando notificaciones...
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-notifications">
                {safeIcons.alertCircle}
                {error}
            </div>
        );
    }

    return (
        <>
            <button
                ref={buttonRef}
                className="floating-notifications-button"
                onClick={(e) => {
                    if (!isDragging) {
                        setIsOpen(!isOpen);
                    }
                }}
                onMouseDown={handleMouseDown}
                style={{
                    position: 'fixed',
                    left: `${position.x}px`,
                    top: `${position.y}px`,
                    cursor: isDragging ? 'grabbing' : 'grab',
                    zIndex: 1000,
                    transform: 'none',
                    transition: isDragging ? 'none' : 'transform 0.2s ease',
                    touchAction: 'none'
                }}
                aria-label="Abrir panel de notificaciones"
            >
                {safeIcons.bell}
                {filteredNotifications.filter(n => n.status !== 'read').length > 0 && (
                    <span className="unread-count">{filteredNotifications.filter(n => n.status !== 'read').length}</span>
                )}
            </button>

            {isOpen && (
                <div className="floating-panel-overlay">
                    <div
                        className="floating-panel"
                        ref={panelRef}
                    >
                        <div className="panel-header">
                            <h2>Notificaciones</h2>
                            <button
                                className="close-button"
                                onClick={() => setIsOpen(false)}
                            >
                                {icons.x}
                            </button>
                        </div>

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
                                Tareas
                            </button>
                            <button
                                className={`filter-button ${selectedFilter === 'user' ? 'active' : ''}`}
                                onClick={() => setSelectedFilter('user')}
                            >
                                Usuarios
                            </button>
                            <button
                                className={`filter-button ${selectedFilter === 'company' ? 'active' : ''}`}
                                onClick={() => setSelectedFilter('company')}
                            >
                                Empresas
                            </button>
                            <button
                                className={`filter-button ${selectedFilter === 'area' ? 'active' : ''}`}
                                onClick={() => setSelectedFilter('area')}
                            >
                                Áreas
                            </button>
                        </div>

                        <div className="notifications-list">
                            {filteredNotifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`notification-item ${notification.status === 'read' ? 'read' : ''}`}
                                    onClick={() => onRead(notification.id)}
                                >
                                    <button
                                        className="delete-button-float"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onRemove(notification.id);
                                        }}
                                        title="Eliminar notificación"
                                    >
                                        {safeIcons.x}
                                    </button>
                                    <div className="notification-icon" style={{ color: getNotificationColor(notification.type) }}>
                                        {getNotificationIcon(notification.type)}
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

                        {filteredNotifications.length === 0 && (
                            <div className="no-notifications">
                                {safeIcons.check} No hay notificaciones recientes
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default FloatingNotifications;
