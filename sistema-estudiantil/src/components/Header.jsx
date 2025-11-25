// src/components/Header.jsx
import React from 'react';
import './Header.css'; // Si tienes estilos

const Header = ({ userName }) => {
    return (
        <header style={styles.header}>
            <div style={styles.container}>
                <h1 style={styles.title}>Sistema de Gestión Estudiantil</h1>
                <div style={styles.userInfo}>
                    <span style={styles.greeting}>Hola, {userName}</span>
                </div>
            </div>
        </header>
    );
};

const styles = {
    header: {
        background: '#2c3e50',
        color: 'white',
        padding: '15px 20px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
    },
    container: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '1400px',
        margin: '0 auto'
    },
    title: {
        margin: 0,
        fontSize: '24px',
        fontWeight: 'bold'
    },
    userInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
    },
    greeting: {
        fontSize: '16px',
        fontWeight: '500'
    }
};

export default Header;