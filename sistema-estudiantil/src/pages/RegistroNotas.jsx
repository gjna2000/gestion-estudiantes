import React, { useState } from 'react';
import Card from '../components/Card';
import Alert from '../components/Alert';

const RegistroNotas = () => {
    // Estado inicial simple para el formulario
    const [formData, setFormData] = useState({
        materia: '',
        corte: '',
        nota: '',
    });
    
    // Simulación de opciones de materias (basado en Materias.jsx)
    const materias = [
        'Cálculo Integral', 
        'Programación Orientada a Objetos', 
        'Bases de Datos I', 
        'Estructura de Datos'
    ];
    
    // Opciones de cortes/parciales
    const cortes = ['Corte 1 (25%)', 'Corte 2 (30%)', 'Corte 3 (45%)', 'Trabajo Final (100%)'];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Aquí Jorge Sebastián Ortiz Humo implementará la lógica de validación
        // y la llamada a la API de Miller Marlow Martinez Martinez (Firebase)
        
        console.log("Datos a enviar a Firebase (Backend):", formData);
        alert(`Nota de ${formData.nota} registrada en ${formData.materia}. \n¡Miller debe guardar esto!`);
        
        // Resetea el formulario
        setFormData({ materia: '', corte: '', nota: '' });
    };

    return (
        <div>
            <h2>Registro de Notas ✍️</h2>
            <Alert type="info">
                Este formulario es la **tarea principal** de Jorge Sebastián Ortiz Humo. Debe implementar las validaciones completas y la conexión con el Backend de Miller.
            </Alert>
            
            <Card title="Ingresar Nueva Calificación">
                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
                    
                    {/* Campo 1: Materia */}
                    <div>
                        <label htmlFor="materia" style={{ fontWeight: 'bold' }}>Materia:</label>
                        <select 
                            id="materia" 
                            name="materia" 
                            value={formData.materia} 
                            onChange={handleChange}
                            required
                            style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: 'var(--border-radius)' }}
                        >
                            <option value="">Seleccione una Materia</option>
                            {materias.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                    </div>
                    
                    {/* Campo 2: Corte/Parcial */}
                    <div>
                        <label htmlFor="corte" style={{ fontWeight: 'bold' }}>Corte Evaluativo:</label>
                        <select 
                            id="corte" 
                            name="corte" 
                            value={formData.corte} 
                            onChange={handleChange}
                            required
                            style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: 'var(--border-radius)' }}
                        >
                            <option value="">Seleccione un Corte</option>
                            {cortes.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>

                    {/* Campo 3: Nota */}
                    <div>
                        <label htmlFor="nota" style={{ fontWeight: 'bold' }}>Nota (0.0 a 5.0):</label>
                        <input
                            type="number"
                            id="nota"
                            name="nota"
                            value={formData.nota}
                            onChange={handleChange}
                            step="0.1"
                            min="0.0"
                            max="5.0"
                            required
                            style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: 'var(--border-radius)', borderColor: '#ccc' }}
                        />
                    </div>
                    
                    {/* Botón de Envío */}
                    <button type="submit" className="btn-primary" style={{ marginTop: 'var(--spacing-md)' }}>
                        Registrar Nota
                    </button>
                </form>
            </Card>
        </div>
    );
};

export default RegistroNotas;