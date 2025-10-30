import React from 'react';
import Card from '../components/Card';
import Alert from '../components/Alert';

// Datos simulados (En la fase 2, Miller y Jorge integrarán esto con la lógica Firebase/Backend)
const riesgoMaterias = [
    { nombre: 'Cálculo Integral', nota: 2.8, tema: 'Derivadas complejas' },
    { nombre: 'Estructura de Datos', nota: 3.1, tema: 'Árboles binarios y recursión' },
];

const recomendacionesEstudio = [
    { materia: 'Programación Orientada a Objetos', sugerencia: 'Refuerza los principios de la herencia y el polimorfismo con ejercicios prácticos.' },
    { materia: 'Bases de Datos I', sugerencia: 'Estudia los comandos JOIN para mejorar la eficiencia de tus consultas.' },
];

const Recomendaciones = () => {
    return (
        <div>
            <h2>Centro de Recomendaciones y Alertas 🧠</h2>
            
            {/* 1. SECCIÓN DE RIESGOS (Prioridad Máxima: Peligro) */}
            <Card title="⚠️ Materias en Riesgo Crítico">
                {riesgoMaterias.length > 0 ? (
                    riesgoMaterias.map((riesgo, index) => (
                        <Alert key={index} type="danger" message={`¡Acción Requerida! Tu nota en ${riesgo.nombre} es ${riesgo.nota.toFixed(1)}.`}>
                            <p style={{ margin: '4px 0 0 0' }}>
                                **Foco de estudio:** Debes revisar urgentemente el tema de **{riesgo.tema}**.
                            </p>
                            <button className="btn-primary" style={{ marginTop: '8px', backgroundColor: 'var(--color-danger)' }}>
                                Solicitar Tutoría
                            </button>
                        </Alert>
                    ))
                ) : (
                    <Alert type="success" message="¡Excelente! No tienes materias en riesgo crítico." />
                )}
            </Card>

            {/* 2. SECCIÓN DE RECOMENDACIONES (Prioridad Media: Mejora Continua) */}
            <Card title="💡 Sugerencias de Estudio Personalizadas">
                {recomendacionesEstudio.length > 0 ? (
                    recomendacionesEstudio.map((rec, index) => (
                        <Alert key={index} type="warning" message={`Sugerencia para ${rec.materia}:`}>
                            <p style={{ margin: '4px 0 0 0' }}>{rec.sugerencia}</p>
                        </Alert>
                    ))
                ) : (
                    <Alert type="info" message="El sistema está analizando tus datos. Vuelve pronto para nuevas recomendaciones." />
                )}
            </Card>

            {/* 3. Panel de Configuración de Alertas */}
            <Card title="Configuración de Notificaciones" style={{ marginTop: 'var(--spacing-xl)' }}>
                <p>Aquí el estudiante podrá definir cuándo recibir alertas (ej. Correo, SMS) o qué umbral de nota considera "riesgo" (ej. nota inferior a 3.0).</p>
                <button className="btn-primary" style={{ backgroundColor: '#6c757d' }}>
                    Ir a Configuración Avanzada
                </button>
            </Card>
        </div>
    );
};

export default Recomendaciones;