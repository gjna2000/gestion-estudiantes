import React from 'react';
import Card from '../components/Card';
import Alert from '../components/Alert';

const Configuracion = () => {
    
    // Función de ejemplo para manejar el guardado de ajustes
    const handleSave = (section) => {
        alert(`Configuración de ${section} guardada con éxito. (La lógica de persistencia en Firebase es tarea de Miller).`);
    };

    return (
        <div>
            <h2>Configuración del Sistema ⚙️</h2>

            {/* 1. SECCIÓN DE PERFIL Y CUENTA */}
            <Card title="Perfil y Cuenta">
                <p>Actualiza tus datos de usuario y autenticación.</p>
                <div style={{ display: 'grid', gap: 'var(--spacing-sm)', maxWidth: '400px' }}>
                    
                    <label style={{ fontWeight: 'bold' }}>Nombre Completo:</label>
                    <input type="text" defaultValue="Gonzalo Javier Niño Amarís" style={{ padding: '8px', borderRadius: 'var(--border-radius)', border: '1px solid #ccc' }} />
                    
                    <label style={{ fontWeight: 'bold' }}>Correo Electrónico:</label>
                    <input type="email" defaultValue="gonzalo.amariz@universidad.edu" style={{ padding: '8px', borderRadius: 'var(--border-radius)', border: '1px solid #ccc' }} />

                    <button className="btn-primary" onClick={() => handleSave('Perfil')} style={{ marginTop: 'var(--spacing-md)' }}>
                        Actualizar Perfil
                    </button>
                </div>
            </Card>

            {/* 2. SECCIÓN DE ALERTAS Y NOTIFICACIONES */}
            <Card title="Preferencias de Notificación">
                <Alert type="info">
                    Define tus umbrales de riesgo (ej. nota mínima) y los métodos de contacto preferidos.
                </Alert>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                    
                    <label style={{ fontWeight: 'bold' }}>Umbral de Riesgo (Nota mínima para alerta):</label>
                    <input type="number" step="0.1" min="0.0" max="5.0" defaultValue="3.0" style={{ padding: '8px', borderRadius: 'var(--border-radius)', border: '1px solid #ccc', maxWidth: '100px' }} />

                    <label style={{ fontWeight: 'bold' }}>Método de Notificación:</label>
                    <div style={{ display: 'flex', gap: 'var(--spacing-lg)' }}>
                        <label><input type="checkbox" defaultChecked /> Correo Electrónico</label>
                        <label><input type="checkbox" /> Notificaciones Push (App)</label>
                        <label><input type="checkbox" /> SMS</label>
                    </div>

                    <button className="btn-primary" onClick={() => handleSave('Notificaciones')} style={{ marginTop: 'var(--spacing-md)' }}>
                        Guardar Preferencias
                    </button>
                </div>
            </Card>
        </div>
    );
};

export default Configuracion;