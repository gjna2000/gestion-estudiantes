// src/pages/Rendimiento.jsx
import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import { Line, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import Card from '../components/Card';

// Registrar componentes de Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const Rendimiento = () => {
    const [materiasProcesadas, setMateriasProcesadas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {
            const user = auth.currentUser;
            if (!user) {
                setLoading(false);
                return;
            }

            const q = query(
                collection(db, 'evaluaciones'),
                where('userId', '==', user.uid)
            );
            const snapshot = await getDocs(q);
            const evaluacionesData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            
            const materias = procesarMaterias(evaluacionesData);
            setMateriasProcesadas(materias);
            setLoading(false);
        } catch (error) {
            console.error('Error cargando datos:', error);
            setLoading(false);
        }
    };

    const procesarMaterias = (evaluacionesData) => {
        const materiaMap = {};
        
        evaluacionesData.forEach(evaluacion => {
            if (!materiaMap[evaluacion.materia]) {
                materiaMap[evaluacion.materia] = {
                    nombre: evaluacion.materia,
                    creditos: evaluacion.creditos,
                    cortes: {},
                    cortesOrdenados: []
                };
            }
            
            materiaMap[evaluacion.materia].cortes[evaluacion.corte] = {
                notaCorte: evaluacion.notaCorte,
                notaParcial: evaluacion.notaParcial,
                notaQuiz: evaluacion.notaQuiz,
                corteLabel: evaluacion.corteLabel
            };
        });
        
        const materiasArray = Object.values(materiaMap).map(materia => {
            // Ordenar cortes (corte1, corte2, corte3)
            const cortesOrdenados = ['corte1', 'corte2', 'corte3']
                .filter(key => materia.cortes[key])
                .map(key => ({
                    key: key,
                    ...materia.cortes[key]
                }));
            
            const notaFinal = Object.values(materia.cortes).reduce((sum, corte) => {
                return sum + corte.notaCorte;
            }, 0);
            
            return {
                ...materia,
                cortesOrdenados,
                nota: parseFloat(notaFinal.toFixed(2))
            };
        });
        
        return materiasArray;
    };

    // Datos para gráfica de evolución por materia
    const getEvolucionData = () => {
        const datasets = materiasProcesadas.map((materia, index) => {
            const colores = [
                'rgb(75, 192, 192)',
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
                'rgb(255, 206, 86)',
                'rgb(153, 102, 255)',
            ];
            
            const color = colores[index % colores.length];
            
            return {
                label: materia.nombre,
                data: materia.cortesOrdenados.map(c => c.notaCorte),
                borderColor: color,
                backgroundColor: color.replace('rgb', 'rgba').replace(')', ', 0.5)'),
                tension: 0.4
            };
        });

        return {
            labels: ['Corte 1', 'Corte 2', 'Corte 3'],
            datasets: datasets
        };
    };

    // Datos para gráfica de barras (notas finales)
    const getNotasFinalesData = () => {
        return {
            labels: materiasProcesadas.map(m => m.nombre),
            datasets: [{
                label: 'Nota Actual',
                data: materiasProcesadas.map(m => m.nota),
                backgroundColor: materiasProcesadas.map(m => {
                    if (m.nota < 3.0) return 'rgba(255, 68, 68, 0.8)';
                    if (m.nota < 3.5) return 'rgba(255, 187, 51, 0.8)';
                    return 'rgba(0, 200, 81, 0.8)';
                }),
                borderColor: materiasProcesadas.map(m => {
                    if (m.nota < 3.0) return 'rgb(255, 68, 68)';
                    if (m.nota < 3.5) return 'rgb(255, 187, 51)';
                    return 'rgb(0, 200, 81)';
                }),
                borderWidth: 2
            }]
        };
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 5
            }
        }
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '40px' }}>
                <h2>Cargando datos...</h2>
            </div>
        );
    }

    if (materiasProcesadas.length === 0) {
        return (
            <div>
                <h2>📊 Rendimiento Académico Detallado</h2>
                <Card>
                    <div style={{ textAlign: 'center', padding: '40px' }}>
                        <p style={{ fontSize: '18px', color: '#666' }}>
                            No tienes datos registrados para mostrar gráficas
                        </p>
                        <p style={{ color: '#999' }}>
                            Ve a "Nota del Registrador" para agregar tus calificaciones
                        </p>
                    </div>
                </Card>
            </div>
        );
    }

    const promedio = (materiasProcesadas.reduce((sum, m) => sum + m.nota, 0) / materiasProcesadas.length).toFixed(2);

    return (
        <div>
            <h2>📊 Rendimiento Académico Detallado</h2>

            {/* Resumen general */}
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '15px',
                marginBottom: '25px'
            }}>
                <div style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    padding: '20px',
                    borderRadius: '10px',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '36px', fontWeight: 'bold' }}>
                        {materiasProcesadas.length}
                    </div>
                    <div style={{ fontSize: '14px', opacity: 0.9 }}>
                        Materias Registradas
                    </div>
                </div>

                <div style={{
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    color: 'white',
                    padding: '20px',
                    borderRadius: '10px',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '36px', fontWeight: 'bold' }}>
                        {promedio}
                    </div>
                    <div style={{ fontSize: '14px', opacity: 0.9 }}>
                        Promedio General
                    </div>
                </div>

                <div style={{
                    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                    color: 'white',
                    padding: '20px',
                    borderRadius: '10px',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '36px', fontWeight: 'bold' }}>
                        {materiasProcesadas.filter(m => m.nota >= 3.0).length}
                    </div>
                    <div style={{ fontSize: '14px', opacity: 0.9 }}>
                        Materias Aprobadas
                    </div>
                </div>

                <div style={{
                    background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                    color: 'white',
                    padding: '20px',
                    borderRadius: '10px',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '36px', fontWeight: 'bold' }}>
                        {materiasProcesadas.filter(m => m.nota < 3.0).length}
                    </div>
                    <div style={{ fontSize: '14px', opacity: 0.9 }}>
                        En Riesgo
                    </div>
                </div>
            </div>

            {/* Gráfica de evolución de notas por corte */}
            <Card title="📈 Evolución de Notas por Materia">
                <div style={{ height: '400px', position: 'relative' }}>
                    <Line data={getEvolucionData()} options={chartOptions} />
                </div>
                <p style={{ marginTop: '15px', color: '#666', fontSize: '14px' }}>
                    Esta gráfica muestra cómo ha evolucionado tu rendimiento en cada corte por materia.
                </p>
            </Card>

            {/* Gráfica de barras - Notas finales */}
            <Card title="📊 Progreso Semestral (Notas Actuales)">
                <div style={{ height: '400px', position: 'relative' }}>
                    <Bar data={getNotasFinalesData()} options={chartOptions} />
                </div>
                <p style={{ marginTop: '15px', color: '#666', fontSize: '14px' }}>
                    Comparación de las notas actuales de todas tus materias. 
                    🔴 Rojo: crítico (&lt;3.0) | 🟡 Amarillo: mejorar (&lt;3.5) | 🟢 Verde: aprobado (≥3.5)
                </p>
            </Card>

            {/* Tabla detallada */}
            <Card title="📋 Tabla Detallada de Rendimiento">
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ 
                        width: '100%', 
                        borderCollapse: 'collapse',
                        fontSize: '14px'
                    }}>
                        <thead>
                            <tr style={{ background: '#667eea', color: 'white' }}>
                                <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>
                                    Materia
                                </th>
                                <th style={{ padding: '12px', border: '1px solid #ddd' }}>Corte 1</th>
                                <th style={{ padding: '12px', border: '1px solid #ddd' }}>Corte 2</th>
                                <th style={{ padding: '12px', border: '1px solid #ddd' }}>Corte 3</th>
                                <th style={{ padding: '12px', border: '1px solid #ddd' }}>Nota Final</th>
                                <th style={{ padding: '12px', border: '1px solid #ddd' }}>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {materiasProcesadas.map((materia, index) => (
                                <tr key={index} style={{ 
                                    background: index % 2 === 0 ? '#f8f9fa' : 'white' 
                                }}>
                                    <td style={{ padding: '12px', border: '1px solid #ddd', fontWeight: 'bold' }}>
                                        {materia.nombre}
                                    </td>
                                    <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>
                                        {materia.cortes.corte1 ? materia.cortes.corte1.notaCorte.toFixed(2) : '-'}
                                    </td>
                                    <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>
                                        {materia.cortes.corte2 ? materia.cortes.corte2.notaCorte.toFixed(2) : '-'}
                                    </td>
                                    <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>
                                        {materia.cortes.corte3 ? materia.cortes.corte3.notaCorte.toFixed(2) : '-'}
                                    </td>
                                    <td style={{ 
                                        padding: '12px', 
                                        border: '1px solid #ddd', 
                                        textAlign: 'center',
                                        fontWeight: 'bold',
                                        fontSize: '16px',
                                        color: materia.nota < 3.0 ? '#ff4444' : materia.nota < 3.5 ? '#ffbb33' : '#00C851'
                                    }}>
                                        {materia.nota.toFixed(2)}
                                    </td>
                                    <td style={{ 
                                        padding: '12px', 
                                        border: '1px solid #ddd', 
                                        textAlign: 'center' 
                                    }}>
                                        {materia.nota < 3.0 ? '🔴 Crítico' : 
                                         materia.nota < 3.5 ? '🟡 Mejorar' : '🟢 Aprobado'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default Rendimiento;