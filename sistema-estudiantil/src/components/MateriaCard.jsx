import React from 'react';
import Card from './Card'; 

const MateriaCard = ({ nombre, nota, profesor, riesgo }) => {
    
    const notaColor = nota >= 4.0 ? 'var(--color-success)' :
                      nota >= 3.0 ? 'var(--color-warning)' :
                      'var(--color-danger)';
    
    return (
        <Card className="materia-card">
            <h3 style={{ margin: '0 0 10px 0', color: 'var(--color-text-dark)' }}>
                {nombre} {riesgo && <span style={{ color: 'var(--color-danger)', fontSize: '1rem' }}>⚠️</span>}
            </h3>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                
                <div>
                    <p style={{ margin: '0', fontSize: '1.8rem', fontWeight: 'bold', color: notaColor }}>
                        {nota.toFixed(1)}
                    </p>
                    <small style={{ color: '#6c757d' }}>Nota Actual</small>
                </div>
                
                <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: '0 0 4px 0', color: '#495057' }}>Profesor: {profesor}</p>
                    
                    <button className="btn-primary" style={{ marginTop: '8px' }}>
                        Registrar Nota
                    </button>
                </div>
            </div>
        </Card>
    );
};

export default MateriaCard;