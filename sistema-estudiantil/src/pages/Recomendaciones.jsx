// src/pages/Recomendaciones.jsx
import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import { generarRecomendacionesIA, buscarEnYouTube, buscarEnScholar } from '../services/gemini';
import Card from '../components/Card';
import Alert from '../components/Alert';

const Recomendaciones = () => {
    const [materiasProcesadas, setMateriasProcesadas] = useState([]);
    const [recomendacionesIA, setRecomendacionesIA] = useState({});
    const [loading, setLoading] = useState(true);
    const [generandoIA, setGenerandoIA] = useState({});

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
                    temas: []
                };
            }
            
            materiaMap[evaluacion.materia].cortes[evaluacion.corte] = {
                notaCorte: evaluacion.notaCorte,
                notaParcial: evaluacion.notaParcial,
                notaQuiz: evaluacion.notaQuiz,
                corteLabel: evaluacion.corteLabel,
                temaActual: evaluacion.temaActual
            };
            
            // Agregar tema a la lista si existe
            if (evaluacion.temaActual && evaluacion.temaActual !== 'No especificado') {
                materiaMap[evaluacion.materia].temas.push(evaluacion.temaActual);
            }
        });
        
        const materiasArray = Object.values(materiaMap).map(materia => {
            const notaFinal = Object.values(materia.cortes).reduce((sum, corte) => {
                return sum + corte.notaCorte;
            }, 0);
            
            const cortesEnRiesgo = Object.entries(materia.cortes)
                .filter(([_, corte]) => corte.notaCorte < 0.9)
                .map(([_, corte]) => corte.corteLabel);
            
            return {
                ...materia,
                nota: parseFloat(notaFinal.toFixed(2)),
                enRiesgo: cortesEnRiesgo.length > 0 || notaFinal < 3.0,
                cortesEnRiesgo,
                temasTexto: materia.temas.join(', ') || 'No especificado'
            };
        });
        
        // Ordenar: primero las de riesgo
        return materiasArray.sort((a, b) => {
            if (a.enRiesgo && !b.enRiesgo) return -1;
            if (!a.enRiesgo && b.enRiesgo) return 1;
            return a.nota - b.nota;
        });
    };

    const generarRecomendaciones = async (materia) => {
        setGenerandoIA(prev => ({ ...prev, [materia.nombre]: true }));

        const detallesCortes = Object.entries(materia.cortes)
            .map(([key, corte]) => `${corte.corteLabel}: ${corte.notaCorte} (Parcial: ${corte.notaParcial}, Quiz: ${corte.notaQuiz}) - Tema: ${corte.temaActual || 'No especificado'}`)
            .join('\n');

        const recomendaciones = await generarRecomendacionesIA(
            materia.nombre,
            materia.nota,
            detallesCortes,
            materia.temasTexto
        );

        setRecomendacionesIA(prev => ({
            ...prev,
            [materia.nombre]: recomendaciones
        }));

        setGenerandoIA(prev => ({ ...prev, [materia.nombre]: false }));
    };

    const getTipoAlerta = (nota) => {
        if (nota < 3.0) return 'danger';
        if (nota < 3.5) return 'warning';
        return 'success';
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '40px' }}>
                <h2>Cargando recomendaciones...</h2>
            </div>
        );
    }

    if (materiasProcesadas.length === 0) {
        return (
            <div>
                <h2>🧠 Centro de Recomendaciones y Alertas</h2>
                <Card>
                    <div style={{ textAlign: 'center', padding: '40px' }}>
                        <p style={{ fontSize: '18px', color: '#666' }}>
                            No tienes materias registradas
                        </p>
                        <p style={{ color: '#999' }}>
                            Registra tus materias para recibir recomendaciones inteligentes con IA
                        </p>
                    </div>
                </Card>
            </div>
        );
    }

    const materiasEnRiesgo = materiasProcesadas.filter(m => m.enRiesgo);

    return (
        <div>
            <h2>🧠 Centro de Recomendaciones y Alertas</h2>

            {/* Banner informativo */}
            <Alert type="info">
                💡 Este sistema usa <strong>Gemini AI</strong> para generar recomendaciones personalizadas, 
                recursos de estudio específicos y planes de acción basados en tu rendimiento.
            </Alert>

            {/* Materias en riesgo crítico */}
            {materiasEnRiesgo.length > 0 && (
                <div style={{ marginBottom: '30px' }}>
                    <h3 style={{ color: '#ff4444' }}>⚠️ Materias en Riesgo Crítico</h3>
                    
                    {materiasEnRiesgo.map((materia, index) => (
                        <Card key={index}>
                            <div style={{ 
                                borderLeft: '5px solid #ff4444',
                                paddingLeft: '15px'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                    <div>
                                        <h3 style={{ margin: '0 0 5px 0', color: '#ff4444' }}>
                                            🔴 ¡Acción Requerida! Tu nota en {materia.nombre} es {materia.nota.toFixed(2)}
                                        </h3>
                                        <p style={{ margin: '0 0 5px 0', color: '#666' }}>
                                            <strong>Temas actuales:</strong> {materia.temasTexto}
                                        </p>
                                        <p style={{ margin: 0, color: '#666' }}>
                                            **Foco de estudio:** Debes revisar urgentemente{' '}
                                            {materia.cortesEnRiesgo.length > 0 
                                                ? materia.cortesEnRiesgo.join(', ') 
                                                : 'todos los cortes'}.
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => generarRecomendaciones(materia)}
                                        disabled={generandoIA[materia.nombre]}
                                        style={{
                                            background: '#667eea',
                                            color: 'white',
                                            border: 'none',
                                            padding: '12px 24px',
                                            borderRadius: '8px',
                                            cursor: generandoIA[materia.nombre] ? 'wait' : 'pointer',
                                            fontWeight: 'bold',
                                            fontSize: '14px',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        {generandoIA[materia.nombre] ? '🤖 Generando...' : '🤖 Generar con IA'}
                                    </button>
                                </div>

                                {/* Mostrar recomendaciones de IA */}
                                {recomendacionesIA[materia.nombre] && (
                                    <div style={{ marginTop: '20px' }}>
                                        {/* Análisis */}
                                        <div style={{ 
                                            background: '#f0f7ff', 
                                            padding: '15px', 
                                            borderRadius: '8px',
                                            marginBottom: '15px'
                                        }}>
                                            <h4 style={{ margin: '0 0 10px 0' }}>
                                                📊 Análisis {recomendacionesIA[materia.nombre].generadoPorIA && '(Generado por IA)'}
                                            </h4>
                                            <p style={{ margin: 0 }}>
                                                {recomendacionesIA[materia.nombre].analisis}
                                            </p>
                                        </div>

                                        {/* Videos de YouTube */}
                                        {recomendacionesIA[materia.nombre].recursos.videos?.length > 0 && (
                                            <div style={{ marginBottom: '15px' }}>
                                                <h4 style={{ margin: '0 0 10px 0' }}>🎥 Videos Recomendados</h4>
                                                <div style={{ display: 'grid', gap: '10px' }}>
                                                    {recomendacionesIA[materia.nombre].recursos.videos.map((video, idx) => (
                                                        <div key={idx} style={{ 
                                                            background: 'white', 
                                                            padding: '12px', 
                                                            borderRadius: '8px',
                                                            border: '2px solid #eee'
                                                        }}>
                                                            <strong>{video.titulo}</strong>
                                                            <p style={{ margin: '5px 0', fontSize: '14px', color: '#666' }}>
                                                                {video.descripcion}
                                                            </p>
                                                            <a 
                                                                href={buscarEnYouTube(video.query)}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                style={{
                                                                    display: 'inline-block',
                                                                    marginTop: '8px',
                                                                    padding: '8px 16px',
                                                                    background: '#ff0000',
                                                                    color: 'white',
                                                                    textDecoration: 'none',
                                                                    borderRadius: '5px',
                                                                    fontSize: '14px'
                                                                }}
                                                            >
                                                                ▶️ Buscar en YouTube
                                                            </a>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Artículos */}
                                        {recomendacionesIA[materia.nombre].recursos.articulos?.length > 0 && (
                                            <div style={{ marginBottom: '15px' }}>
                                                <h4 style={{ margin: '0 0 10px 0' }}>📄 Artículos y Recursos</h4>
                                                <div style={{ display: 'grid', gap: '10px' }}>
                                                    {recomendacionesIA[materia.nombre].recursos.articulos.map((articulo, idx) => (
                                                        <div key={idx} style={{ 
                                                            background: 'white', 
                                                            padding: '12px', 
                                                            borderRadius: '8px',
                                                            border: '2px solid #eee'
                                                        }}>
                                                            <strong>{articulo.titulo}</strong>
                                                            <p style={{ margin: '5px 0', fontSize: '14px', color: '#666' }}>
                                                                {articulo.descripcion}
                                                            </p>
                                                            <a 
                                                                href={buscarEnScholar(articulo.url)}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                style={{
                                                                    display: 'inline-block',
                                                                    marginTop: '8px',
                                                                    padding: '8px 16px',
                                                                    background: '#4285f4',
                                                                    color: 'white',
                                                                    textDecoration: 'none',
                                                                    borderRadius: '5px',
                                                                    fontSize: '14px'
                                                                }}
                                                            >
                                                                🔍 Buscar en Scholar
                                                            </a>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Libros */}
                                        {recomendacionesIA[materia.nombre].recursos.libros?.length > 0 && (
                                            <div>
                                                <h4 style={{ margin: '0 0 10px 0' }}>📚 Libros Recomendados</h4>
                                                <div style={{ display: 'grid', gap: '10px' }}>
                                                    {recomendacionesIA[materia.nombre].recursos.libros.map((libro, idx) => (
                                                        <div key={idx} style={{ 
                                                            background: 'white', 
                                                            padding: '12px', 
                                                            borderRadius: '8px',
                                                            border: '2px solid #eee'
                                                        }}>
                                                            <strong>{libro.titulo}</strong>
                                                            {libro.autor && (
                                                                <p style={{ margin: '5px 0', fontSize: '14px', color: '#999' }}>
                                                                    Por: {libro.autor}
                                                                </p>
                                                            )}
                                                            <p style={{ margin: '5px 0', fontSize: '14px', color: '#666' }}>
                                                                {libro.descripcion}
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Sugerencias generales */}
            <h3>💡 Sugerencias de Estudio Personalizado</h3>
            
            {materiasProcesadas.filter(m => !m.enRiesgo).map((materia, index) => (
                <Card key={index}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h4 style={{ margin: '0 0 5px 0' }}>
                                Sugerencia para {materia.nombre}
                            </h4>
                            <p style={{ margin: 0, color: '#666' }}>
                                Nota actual: <strong style={{ color: '#00C851' }}>{materia.nota.toFixed(2)}</strong> - 
                                Continúa con tu buen desempeño
                            </p>
                        </div>
                        <button
                            onClick={() => generarRecomendaciones(materia)}
                            disabled={generandoIA[materia.nombre]}
                            style={{
                                background: '#667eea',
                                color: 'white',
                                border: 'none',
                                padding: '10px 20px',
                                borderRadius: '8px',
                                cursor: generandoIA[materia.nombre] ? 'wait' : 'pointer',
                                fontWeight: 'bold'
                            }}
                        >
                            {generandoIA[materia.nombre] ? '🤖 Generando...' : '🤖 Optimizar con IA'}
                        </button>
                    </div>

                    {recomendacionesIA[materia.nombre] && (
                        <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '2px solid #eee' }}>
                            {/* Mismo formato de recursos que arriba */}
                            <div style={{ 
                                background: '#f0f7ff', 
                                padding: '15px', 
                                borderRadius: '8px',
                                marginBottom: '15px'
                            }}>
                                <h4 style={{ margin: '0 0 10px 0' }}>📊 Análisis</h4>
                                <p style={{ margin: 0 }}>{recomendacionesIA[materia.nombre].analisis}</p>
                            </div>
                            {/* Aquí van los recursos igual que arriba */}
                        </div>
                    )}
                </Card>
            ))}
        </div>
    );
};

export default Recomendaciones;