import React from 'react';

const Alert = ({ type, message, children }) => {
    
    const alertStyles = {
        padding: '12px 16px',
        borderRadius: 'var(--border-radius)',
        marginBottom: 'var(--spacing-md)',
        fontWeight: '500',
        display: 'flex',
        alignItems: 'center',
        
        backgroundColor: type === 'danger' ? '#f8d7da' : 
                         type === 'warning' ? '#fff3cd' : 
                         '#cce5ff', 
        
        borderLeft: `4px solid ${type === 'danger' ? 'var(--color-danger)' : 
                                  type === 'warning' ? 'var(--color-warning)' : 
                                  'var(--color-primary)'}`,
        
        color: type === 'danger' ? '#721c24' : 
               type === 'warning' ? '#856404' : 
               '#004085'
    };
    
    const icon = type === 'danger' ? '⚠️' : type === 'warning' ? '💡' : 'ℹ️';

    return (
        <div style={alertStyles}>
            <span style={{ marginRight: '10px', fontSize: '1.2rem' }}>{icon}</span>
            <div>
                {message && <p style={{ margin: 0, fontWeight: 'bold' }}>{message}</p>}
                {children}
            </div>
        </div>
    );
};

export default Alert;