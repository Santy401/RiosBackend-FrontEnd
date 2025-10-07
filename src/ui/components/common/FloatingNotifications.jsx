import React, { useState, useEffect, useRef } from 'react';
import './styles/FloatingNotifications.css';

const FloatingNotifications = ({
    notifications,
    onRemove,
    onRead,
    loading,
    error,
    icons = {}
}) => {
    // Estado y refs
    const [position, setPosition] = useState({ x: 20, y: 20 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [isOpen, setIsOpen] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState('all');
    const buttonRef = useRef(null);
    const panelRef = useRef(null);

    // Iconos por defecto
    const defaultIcons = {
        bell: '🔔',
        close: '×',
        check: '✓',
        loading: '⏳',
        error: '⚠️',
        task: '📝',
        user: '👤',
        company: '🏢',
        area: '🗺️'
    };

    const safeIcons = { ...defaultIcons, ...icons };

    // Filtros disponibles
    const filters = [
        { id: 'all', label: 'Todas' },
        { id: 'task', label: 'Tareas', icon: safeIcons.task },
        { id: 'user', label: 'Usuarios', icon: safeIcons.user },
        { id: 'company', label: 'Empresas', icon: safeIcons.company },
        { id: 'area', label: 'Áreas', icon: safeIcons.area }
    ];

    // Funciones de arrastre
    const handleMouseDown = (e) => {
        if (e.button !== 0) return;
        const rect = buttonRef.current.getBoundingClientRect();
        setDragOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        setIsDragging(true);
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        setPosition({ x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y });
    };

    const handleMouseUp = () => setIsDragging(false);

    // Cerrar al hacer clic fuera
    const handleClickOutside = (e) => {
        if (panelRef.current && !panelRef.current.contains(e.target) && 
            buttonRef.current && !buttonRef.current.contains(e.target)) {
            setIsOpen(false);
        }
    };

    // Efectos
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

    useEffect(() => {
        if (isOpen) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    // Filtrado de notificaciones
    const filteredNotifications = notifications.filter(n => 
        selectedFilter === 'all' || n.type?.toLowerCase() === selectedFilter
    );

    const unreadCount = notifications.filter(n => n.status !== 'read').length;

    // Estilos minimalistas
    const buttonStyle = {
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: isDragging ? 'grabbing' : 'grab',
        zIndex: 1000
    };

    // Renderizado condicional
    if (loading) return (
        <div className="minimal-notification minimal-loading">
            {safeIcons.loading} Cargando...
        </div>
    );

    if (error) return (
        <div className="minimal-notification minimal-error">
            {safeIcons.error} {error}
        </div>
    );

    return (
        <>
            <button
                ref={buttonRef}
                className="minimal-notification-button"
                style={buttonStyle}
                onClick={() => setIsOpen(!isOpen)}
                onMouseDown={handleMouseDown}
                aria-label="Notificaciones"
            >
                {safeIcons.bell}
                {unreadCount > 0 && <span className="minimal-badge">{unreadCount}</span>}
            </button>

            {isOpen && (
                <div className="minimal-panel" ref={panelRef}>
                    <div className="minimal-panel-header">
                        <h3>Notificaciones</h3>
                        <button onClick={() => setIsOpen(false)} className="minimal-close">
                            {safeIcons.close}
                        </button>
                    </div>

                    <div className="minimal-filters">
                        {filters.map(filter => (
                            <button
                                key={filter.id}
                                className={`minimal-filter ${selectedFilter === filter.id ? 'active' : ''}`}
                                onClick={() => setSelectedFilter(filter.id)}
                                title={filter.label}
                            >
                                {filter.icon || filter.label}
                            </button>
                        ))}
                    </div>

                    <div className="minimal-notifications">
                        {filteredNotifications.length > 0 ? (
                            filteredNotifications.map(notification => (
                                <div
                                    key={notification.id}
                                    className={`minimal-notification-item ${notification.status === 'read' ? 'read' : ''}`}
                                    onClick={() => onRead(notification.id)}
                                >
                                    <div className="minimal-notification-icon">
                                        {safeIcons[notification.type?.toLowerCase()] || safeIcons.task}
                                    </div>
                                    <div className="minimal-notification-content">
                                        <div className="minimal-notification-title">
                                            {notification.title}
                                        </div>
                                        <div className="minimal-notification-time">
                                            {new Date(notification.timestamp).toLocaleTimeString()}
                                        </div>
                                    </div>
                                    <button
                                        className="minimal-delete"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onRemove(notification.id);
                                        }}
                                    >
                                        {safeIcons.close}
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className="minimal-empty">
                                {safeIcons.check} No hay notificaciones
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default FloatingNotifications;