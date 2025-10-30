import React from 'react';


const Card = ({ title, children, className = '' }) => {
    return (
        <div className={`card ${className}`}>
            {title && <h4 style={{ 
                marginTop: 0, 
                borderBottom: '1px solid #eee', 
                paddingBottom: '8px', 
                marginBottom: '16px',
                color: 'var(--color-primary)' 
            }}>{title}</h4>}
            {children}
        </div>
    );
};

export default Card;