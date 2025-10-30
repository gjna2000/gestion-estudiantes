import React from 'react';
import MateriaCard from '../components/MateriaCard'; 
import Card from '../components/Card';

const materiasData = [
    { id: 1, nombre: 'Cálculo Integral', nota: 2.8, profesor: 'Dr. López', riesgo: true },
    { id: 2, nombre: 'Programación Orientada a Objetos', nota: 4.2, profesor: 'Ing. Humo', riesgo: false },
    { id: 3, nombre: 'Bases de Datos I', nota: 3.5, profesor: 'Msc. Ramírez', riesgo: false },
    { id: 4, nombre: 'Estructura de Datos', nota: 4.8, profesor: 'Dr. Martínez', riesgo: false },
];

const Materias = () => {
    return (
        <div>
            <h2>Mis Materias del Semestre 📖</h2>
            
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
                gap: 'var(--spacing-lg)' 
            }}>
                {materiasData.map((materia) => (
                    <MateriaCard 
                        key={materia.id}
                        nombre={materia.nombre}
                        nota={materia.nota}
                        profesor={materia.profesor}
                        riesgo={materia.riesgo}
                    />
                ))}
            </div>

            <Card title="Panel de Registro de Notas" style={{ marginTop: 'var(--spacing-xl)' }}>
                <p>Aquí irá el formulario completo para registrar una nueva nota, que será la tarea de Jorge Sebastián Ortiz Humo, el Frontend Developer.</p>
                <button className="btn-primary">Ir a Formulario Completo</button>
            </Card>
        </div>
    );
};

export default Materias;