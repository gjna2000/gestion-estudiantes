// src/pages/Materias.jsx
import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import Card from '../components/Card';
import Alert from '../components/Alert';

const Materias = () => {
    const [evaluaciones, setEvaluaciones] = useState([]);
    const [materiasProcesadas, setMateriasProcesadas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

    useEffect(() => {
        cargarMaterias();
    }, []);

    const cargarMaterias = async () => {
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
            
            setEvaluaciones(evaluacionesData);
            
            // Procesar y agrupar por materia
            const materias = procesarMaterias(evaluacionesData);
            setMateriasProcesadas(materias);
            
            setLoading(false);
        } catch (error) {
            console.error('Error cargando materias:', error);
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
                    evaluaciones: []
                };
            }
            
            materiaMap[evaluacion.materia].cortes[evaluacion.corte] = {
                notaCorte: evaluacion.notaCorte,
                notaParcial: evaluacion.notaParcial,
                notaQuiz: evaluacion.notaQuiz,
                corteLabel: evaluacion.corteLabel,
                porcentajeTotal: evaluacion.porcentajeTotal,
                id: evaluacion.id
            };
            
            materiaMap[evaluacion.materia].evaluaciones.push(evaluacion);
        });
        
        const materiasArray = Object.values(materiaMap).map(materia => {
            const notaFinal = Object.values(materia.cortes).reduce((sum, corte) => {
                return sum + corte.notaCorte;
            }, 0);
            
            return {
                ...materia,
                nota: parseFloat(notaFinal.toFixed(2)),
                cortesRegistrados: Object.keys(materia.cortes).length,
            };
        });
        
        return materiasArray;
    };

    const eliminarEvaluacion = async (evaluacionId, nombreMateria, corteLabel) => {
        if (!window.confirm(`¿Estás seguro de eliminar ${corteLabel} de ${nombreMateria}?`)) {
            return;
        }

        try {
            await deleteDoc(doc(db, 'evaluaciones', evaluacionId));
            setMensaje({ 
                tipo: 'success', 
                texto: `✅ ${corteLabel} de ${nombreMateria} eliminado correctamente` 
            });
            
            // Recargar materias
            cargarMaterias();
            
            // Limpiar mensaje después de 3 segundos
            setTimeout(() => setMensaje({ tipo: '', texto: '' }), 3000);
        } catch (error) {
            console.error('Error eliminando evaluación:', error);
            setMensaje({ 
                tipo: 'danger', 
                texto: 'Error al eliminar. Intenta nuevamente.' 
            });
        }
    };

    const eliminarMateria = async (materia) => {
        if (!window.confirm(`¿Estás seguro de eliminar TODA la materia "${materia.nombre}" con todos sus cortes?`)) {
            return;
        }

        try {
            // Eliminar todas las evaluaciones de esta materia
            const promises = materia.evaluaciones.map(ev => 
                deleteDoc(doc(db, 'evaluaciones', ev.id))
            );
            
            await Promise.all(promises);
            
            setMensaje({ 
                tipo: 'success', 
                texto: `✅ Materia "${materia.nombre}" eliminada completamente` 
            });
            
            cargarMaterias();
            setTimeout(() => setMensaje({ tipo: '', texto: '' }), 3000);
        } catch (error) {
            console.error('Error eliminando materia:', error);
            setMensaje({ 
                tipo: 'danger', 
                texto: 'Error al eliminar la materia. Intenta nuevamente.' 
            });
        }
    };

    const getColorNota = (nota) => {
        if (nota < 3.0) return '#ff4444';
        if (nota < 3.5) return '#ffbb33';
        return '#00C851';
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '40px' }}>
                <h2>Cargando materias...</h2>
            </div>
        );
    }

    return (
        <div>
            <h2>📚 Mis Materias del Semestre</h2>
            
            {mensaje.texto && (
                <Alert type={mensaje.tipo}>
                    {mensaje.texto}
                </Alert>
            )}

            {materiasProcesadas.length === 0 ? (
                <Card>
                    <div style={{ textAlign: 'center', padding: '40px' }}>
                        <p style={{ fontSize: '18px', color: '#666' }}>
                            No tienes materias registradas aún
                        </p>
                        <p style={{ color: '#999' }}>
                            Ve a "Nota del Registrador" para agregar tus primeras calificaciones
                        </p>
                    </div>
                </Card>
            ) : (
                <div style={{ display: 'grid', gap: '20px' }}>
                    {materiasProcesadas.map((materia, index) => (
                        <Card key={index} title={materia.nombre}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ flex: 1 }}>
                                    {/* Información general */}
                                    <div style={{ marginBottom: '15px' }}>
                                        <p style={{ margin: '5px 0', color: '#666' }}>
                                            <strong>Créditos:</strong> {materia.creditos}
                                        </p>
                                        <p style={{ margin: '5px 0', color: '#666' }}>
                                            <strong>Cortes registrados:</strong> {materia.cortesRegistrados}/3
                                        </p>
                                        <p style={{ margin: '5px 0' }}>
                                            <strong>Nota actual:</strong>{' '}
                                            <span style={{ 
                                                fontSize: '24px', 
                                                fontWeight: 'bold',
                                                color: getColorNota(materia.nota)
                                            }}>
                                                {materia.nota.toFixed(2)}
                                            </span>
                                        </p>
                                    </div>

                                    {/* Detalle de cortes */}
                                    <div style={{ 
                                        background: '#f8f9fa', 
                                        padding: '15px', 
                                        borderRadius: '8px',
                                        marginBottom: '15px'
                                    }}>
                                        <h4 style={{ marginTop: 0 }}>📊 Detalle de Cortes:</h4>
                                        {Object.entries(materia.cortes).map(([key, corte]) => (
                                            <div key={key} style={{ 
                                                display: 'flex', 
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                padding: '10px',
                                                background: 'white',
                                                borderRadius: '5px',
                                                marginBottom: '8px'
                                            }}>
                                                <div>
                                                    <strong>{corte.corteLabel}</strong>
                                                    <div style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>
                                                        Parcial: {corte.notaParcial.toFixed(1)} | 
                                                        Quiz: {corte.notaQuiz.toFixed(1)}
                                                    </div>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                    <span style={{ 
                                                        fontSize: '20px', 
                                                        fontWeight: 'bold',
                                                        color: corte.notaCorte < 0.9 ? '#ff4444' : '#00C851'
                                                    }}>
                                                        {corte.notaCorte.toFixed(2)}
                                                        {corte.notaCorte < 0.9 && ' ⚠️'}
                                                    </span>
                                                    <button
                                                        onClick={() => eliminarEvaluacion(corte.id, materia.nombre, corte.corteLabel)}
                                                        style={{
                                                            background: '#ff4444',
                                                            color: 'white',
                                                            border: 'none',
                                                            padding: '5px 10px',
                                                            borderRadius: '5px',
                                                            cursor: 'pointer',
                                                            fontSize: '12px'
                                                        }}
                                                    >
                                                        🗑️ Eliminar
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Botón eliminar materia completa */}
                                    <button
                                        onClick={() => eliminarMateria(materia)}
                                        style={{
                                            background: '#dc3545',
                                            color: 'white',
                                            border: 'none',
                                            padding: '10px 20px',
                                            borderRadius: '5px',
                                            cursor: 'pointer',
                                            fontWeight: 'bold',
                                            width: '100%'
                                        }}
                                    >
                                        🗑️ Eliminar Materia Completa
                                    </button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Panel de registro */}
            <div style={{ marginTop: '30px', padding: '20px', background: '#e3f2fd', borderRadius: '10px' }}>
                <h3 style={{ marginTop: 0 }}>📝 Panel de Registro de Notas</h3>
                <p style={{ margin: '10px 0', color: '#666' }}>
                    Para agregar más cortes o nuevas materias, utiliza el formulario en la sección 
                    <strong> "Nota del Registrador"</strong>
                </p>
            </div>
        </div>
    );
};

export default Materias;