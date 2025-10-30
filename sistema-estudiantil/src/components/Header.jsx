import React from 'react';


const Header = ({ userName = 'Estudiante', systemName = 'Sistema de Gestión Estudiantil' }) => {
    return (
        <header className="header">
            <div className="header-logo">
                <span className="logo-icon">📚</span>
                <h1 className="logo-text">{systemName}</h1>
            </div>
            
            <div className="header-profile">
                <span className="profile-text">Hola, {userName}</span>
                <div className="profile-avatar">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                </div>
                <button className="logout-btn">Cerrar Sesión</button>
            </div>
        </header>
    );
};

export default Header;