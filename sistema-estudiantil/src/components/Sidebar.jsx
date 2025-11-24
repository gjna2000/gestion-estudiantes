import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../services/firebase';
import './Sidebar.css'; 

const Sidebar = () => {
    const location = useLocation();

    const handleLogout = async () => {
        if (window.confirm('¿Estás seguro de que quieres cerrar sesión?')) {
            try {
                await signOut(auth);
                window.location.href = '/';
            } catch (error) {
                console.error('Error al cerrar sesión:', error);
            }
        }
    };

    // La función que se pasa al elemento de navegación
    const handleNavigationClick = (item) => {
        if (item.name === 'Cerrar Sesión') {
            handleLogout();
        }
    };

    // El array navItems ahora incluye Cerrar Sesión como un item de lista
    const navItems = [
        { name: 'Dashboard', icon: '🏠', path: '/' },
        { name: 'Mis Materias', icon: '📖', path: '/materias' },
        { name: 'Registrar Nota', icon: '➕', path: '/registro' },
        { name: 'Rendimiento', icon: '📊', path: '/rendimiento' },
        { name: 'Recomendaciones', icon: '💡', path: '/recomendaciones' },
        { name: 'Configuración', icon: '⚙️', path: '/config' },
        // Nuevo ítem "Cerrar Sesión" en la lista
        { name: 'Cerrar Sesión', icon: '🚪', path: '#logout', isDestructive: true }, 
    ];

    return (
        <aside className="sidebar">
            <nav className="sidebar-nav">
                <ul>
                    {navItems.map((item) => (
                        <li key={item.name}>
                            <Link 
                                // Usamos 'button' o 'a' si es una acción y no navegación real, pero mantendremos Link/onClick
                                to={item.path !== '#logout' ? item.path : '#'} // Usamos '#' o la ruta si no es logout
                                onClick={() => handleNavigationClick(item)} 
                                className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                                style={{
                                    // Estilo especial para Cerrar Sesión
                                    ...(item.name === 'Cerrar Sesión' && {
                                        color: '#dc3545', // Color rojo para Cerrar Sesión
                                        fontWeight: 'bold',
                                        marginTop: '15px' // Pequeña separación visual
                                    }),
                                    // Estilo normal para items activos
                                    ...(!item.isDestructive && location.pathname === item.path ? { 
                                        backgroundColor: 'var(--color-primary)', 
                                        color: 'var(--color-text-light)' 
                                    } : {})
                                }}
                            >
                                <span className="nav-icon">{item.icon}</span>
                                {item.name}
                            </Link>
                        </li>
                    ))}
                </ul>

                {/* Se elimina el bloque div y el botón de Cerrar Sesión fijo de la parte inferior */}
                
            </nav>
        </aside>
    );
};

export default Sidebar;