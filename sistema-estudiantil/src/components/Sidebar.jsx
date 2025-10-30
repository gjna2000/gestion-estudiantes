import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css'; 

const navItems = [
    { name: 'Dashboard', icon: '🏠', path: '/' },
    { name: 'Mis Materias', icon: '📖', path: '/materias' },
    { name: 'Registrar Nota', icon: '➕', path: '/registro' },
    { name: 'Rendimiento', icon: '📊', path: '/rendimiento' },
    { name: 'Recomendaciones', icon: '💡', path: '/recomendaciones' },
    { name: 'Configuración', icon: '⚙️', path: '/config' },
];

const Sidebar = () => {
    const location = useLocation();

    return (
        <aside className="sidebar">
            <nav className="sidebar-nav">
                <ul>
                    {navItems.map((item) => (
                        <li key={item.name}>
                            <Link 
                                to={item.path} 
                                className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                                style={location.pathname === item.path ? { 
                                    backgroundColor: 'var(--color-primary)', 
                                    color: 'var(--color-text-light)' 
                                } : {}}
                            >
                                <span className="nav-icon">{item.icon}</span>
                                {item.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;