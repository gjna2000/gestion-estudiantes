import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// 1. Registra los componentes necesarios de Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const PerformanceChart = ({ chartData, title }) => {
    
    // Opciones de configuración para la línea
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: title,
            },
        },
        scales: {
            y: {
                min: 0,
                max: 5, // Escala de notas de 0 a 5
            }
        }
    };

    return <Line data={chartData} options={options} />;
};

export default PerformanceChart;