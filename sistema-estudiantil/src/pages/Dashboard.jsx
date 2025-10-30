import React from 'react';
import Card from '../components/Card';       
import Alert from '../components/Alert';    

const Dashboard = () => {
    const promedioGeneral = 4.5;
    const materiasRiesgo = ['Cálculo Integral', 'Estructura de Datos'];
    const rendimientoChart = "Gráfico de Rendimiento (Placeholder)"; 
    
    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 'var(--spacing-lg)' }}>
            
            <div style={{ gridColumn: '1 / 2' }}>
                <h2>Panel de Control Académico ✨</h2>
                
                <Card title="Rendimiento General">
                    <div style={{ textAlign: 'center', padding: 'var(--spacing-md)' }}>
                        <p style={{ 
                            fontSize: '3rem', 
                            margin: 0, 
                            fontWeight: 'bold', 
                            color: promedioGeneral >= 4.0 ? 'var(--color-success)' : 'var(--color-warning)'
                        }}>
                            {promedioGeneral.toFixed(1)} / 5.0
                        </p>
                        <small>Promedio acumulado del semestre.</small>
                    </div>
                </Card>
                
                {materiasRiesgo.length > 0 && (
                    <Alert type="danger" message={`Tienes ${materiasRiesgo.length} materia(s) en riesgo. ¡Actúa rápido!`}>
                        <ul style={{ margin: '8px 0 0 16px' }}>
                            {materiasRiesgo.map((m) => <li key={m}>{m}</li>)}
                        </ul>
                    </Alert>
                )}
                
                <Card title="Evolución de Notas (Últimos 30 días)">
                    {rendimientoChart}
                    <p style={{ color: '#6c757d' }}>* En esta sección, el componente de gráfica mostraría tu progreso.</p>
                </Card>

            </div>

            <div style={{ gridColumn: '2 / 3' }}>
                <Card title="Recomendaciones Personalizadas">
                    <Alert type="warning">
                        <p style={{ margin: 0 }}>En base a tu desempeño en "Física I", el sistema sugiere ver el tema de **Cinemática** esta semana.</p>
                    </Alert>
                    
                    <Alert type="warning">
                        <p style={{ margin: 0 }}>¡Estás cerca de alcanzar la excelencia! Regístrate para la tutoría de **Matemáticas Discretas**.</p>
                    </Alert>
                </Card>

                <Card title="Acciones Rápidas">
                    <button className="btn-primary" style={{ width: '100%', marginBottom: '10px' }}>
                        Registrar Nueva Nota
                    </button>
                    <button className="btn-primary" style={{ width: '100%', backgroundColor: '#6c757d' }}>
                        Ver Historial Completo
                    </button>
                </Card>
            </div>
            
        </div>
    );
};

export default Dashboard;