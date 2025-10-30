import React from 'react';
import Card from '../components/Card';
import PerformanceChart from '../components/PerformanceChart';

// Datos de prueba (simulando 4 cortes/parciales en 2 materias)
const dataRendimiento = {
    labels: ['Corte 1', 'Corte 2', 'Corte 3', 'Corte 4'],
    datasets: [
        {
            label: 'Programación Orientada a Objetos',
            data: [3.5, 4.0, 4.5, 4.2],
            borderColor: 'var(--color-primary)',
            backgroundColor: 'rgba(0, 123, 255, 0.5)',
            tension: 0.4
        },
        {
            label: 'Cálculo Integral (Riesgo)',
            data: [4.0, 3.0, 2.5, 2.8],
            borderColor: 'var(--color-danger)',
            backgroundColor: 'rgba(220, 53, 69, 0.5)',
            tension: 0.4
        },
    ],
};

const Rendimiento = () => {
    return (
        <div>
            <h2>Rendimiento Académico Detallado 📊</h2>

            <Card title="Evolución de Notas por Materia">
                <PerformanceChart 
                    chartData={dataRendimiento} 
                    title="Progreso Semestral (Escala 0.0 - 5.0)"
                />
            </Card>
        </div>
    );
};

export default Rendimiento;