// src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import { generarRecomendaciones } from '../utils/recomendaciones';
import Recomendaciones from '../components/Recomendaciones';

function Dashboard() {
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [materiasProcesadas, setMateriasProcesadas] = useState([]);
  const [recomendaciones, setRecomendaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarEvaluaciones();
  }, []);

  const cargarEvaluaciones = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
        return;
      }

      // Cargar todas las evaluaciones del usuario
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
      
      // Generar recomendaciones basadas en las materias procesadas
      const recs = generarRecomendaciones(materias);
      setRecomendaciones(recs);
      
      setLoading(false);
    } catch (error) {
      console.error('Error cargando evaluaciones:', error);
      setLoading(false);
    }
  };

  const procesarMaterias = (evaluacionesData) => {
    // Agrupar evaluaciones por materia
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
      
      // Guardar evaluación por corte
      materiaMap[evaluacion.materia].cortes[evaluacion.corte] = {
        notaCorte: evaluacion.notaCorte,
        notaParcial: evaluacion.notaParcial,
        notaQuiz: evaluacion.notaQuiz,
        corteLabel: evaluacion.corteLabel,
        porcentajeTotal: evaluacion.porcentajeTotal
      };
      
      materiaMap[evaluacion.materia].evaluaciones.push(evaluacion);
    });
    
    // Convertir a array y calcular nota final
    const materiasArray = Object.values(materiaMap).map(materia => {
      // Sumar todos los cortes registrados
      const notaFinal = Object.values(materia.cortes).reduce((sum, corte) => {
        return sum + corte.notaCorte;
      }, 0);
      
      // Detectar cortes en riesgo
      const cortesEnRiesgo = Object.entries(materia.cortes)
        .filter(([_, corte]) => corte.notaCorte < 0.9)
        .map(([key, corte]) => corte.corteLabel);
      
      return {
        ...materia,
        nota: parseFloat(notaFinal.toFixed(2)),
        cortesRegistrados: Object.keys(materia.cortes).length,
        cortesEnRiesgo: cortesEnRiesgo,
        enRiesgo: cortesEnRiesgo.length > 0 || notaFinal < 3.0
      };
    });
    
    return materiasArray;
  };

  const calcularPromedio = () => {
    if (materiasProcesadas.length === 0) return 0;
    const suma = materiasProcesadas.reduce((acc, m) => acc + m.nota, 0);
    return (suma / materiasProcesadas.length).toFixed(2);
  };

  const getColorNota = (nota) => {
    if (nota < 3.0) return '#ff4444';
    if (nota < 3.5) return '#ffbb33';
    return '#00C851';
  };

  const getEstadoNota = (nota) => {
    if (nota < 3.0) return '🔴 Alerta crítica';
    if (nota < 3.5) return '🟡 Alerta media';
    return '🟢 Buen rendimiento';
  };

  if (loading) {
    return (
      <div style={styles.loading}>
        <h2>Cargando datos...</h2>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Estadísticas Generales */}
      <div style={styles.statsCard}>
        <h2 style={styles.sectionTitle}>📊 Estadísticas Generales</h2>
        <div style={styles.stats}>
          <div style={styles.statItem}>
            <span style={styles.statValue}>{materiasProcesadas.length}</span>
            <span style={styles.statLabel}>Materias</span>
          </div>
          <div style={styles.statItem}>
            <span style={{...styles.statValue, color: getColorNota(parseFloat(calcularPromedio()))}}>
              {calcularPromedio()}
            </span>
            <span style={styles.statLabel}>Promedio</span>
          </div>
          <div style={styles.statItem}>
            <span style={{...styles.statValue, color: '#ff4444'}}>
              {materiasProcesadas.filter(m => m.enRiesgo).length}
            </span>
            <span style={styles.statLabel}>En Riesgo</span>
          </div>
          <div style={styles.statItem}>
            <span style={styles.statValue}>{evaluaciones.length}</span>
            <span style={styles.statLabel}>Evaluaciones</span>
          </div>
        </div>
      </div>

      {/* Lista de Materias */}
      <div style={styles.materiasCard}>
        <h2 style={styles.sectionTitle}>📚 Mis Materias</h2>
        {materiasProcesadas.length === 0 ? (
          <div style={styles.empty}>
            <p>No tienes materias registradas</p>
            <p style={styles.emptyHint}>Ve a "Nota del Registrador" para agregar tus calificaciones</p>
          </div>
        ) : (
          <div style={styles.materiasList}>
            {materiasProcesadas.map((materia, index) => (
              <div key={index} style={styles.materiaCard}>
                <div style={styles.materiaInfo}>
                  <h3 style={styles.materiaNombre}>{materia.nombre}</h3>
                  <p style={styles.creditos}>{materia.creditos} créditos</p>
                  
                  {/* Mostrar detalles de cortes */}
                  <div style={styles.cortesDetalle}>
                    {Object.entries(materia.cortes).map(([key, corte]) => (
                      <div key={key} style={styles.corteItem}>
                        <span style={styles.corteLabel}>{corte.corteLabel}:</span>
                        <span style={{
                          ...styles.corteNota,
                          color: corte.notaCorte < 0.9 ? '#ff4444' : '#666'
                        }}>
                          {corte.notaCorte.toFixed(2)}
                          {corte.notaCorte < 0.9 && ' ⚠️'}
                        </span>
                        <span style={styles.corteDetalle}>
                          (P: {corte.notaParcial.toFixed(1)} | Q: {corte.notaQuiz.toFixed(1)})
                        </span>
                      </div>
                    ))}
                    
                    {/* Mostrar cortes faltantes */}
                    {materia.cortesRegistrados < 3 && (
                      <div style={styles.corteFaltante}>
                        <span>⏳ Faltan {3 - materia.cortesRegistrados} corte(s) por registrar</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Alertas de cortes en riesgo */}
                  {materia.cortesEnRiesgo.length > 0 && (
                    <div style={styles.alertaRiesgo}>
                      🔴 Cortes en riesgo: {materia.cortesEnRiesgo.join(', ')}
                    </div>
                  )}
                </div>
                
                <div style={styles.materiaNote}>
                  <span style={styles.notaLabel}>Nota Actual:</span>
                  <span
                    style={{
                      ...styles.nota,
                      color: getColorNota(materia.nota),
                    }}
                  >
                    {materia.nota.toFixed(2)}
                  </span>
                  <span style={styles.estado}>
                    {getEstadoNota(materia.nota)}
                  </span>
                  <span style={styles.progreso}>
                    ({materia.cortesRegistrados}/3 cortes)
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sistema de Recomendaciones */}
      <Recomendaciones recomendaciones={recomendaciones} />
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    maxWidth: '1400px',
    margin: '0 auto',
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '400px',
    color: '#666',
  },
  statsCard: {
    background: 'white',
    padding: '25px',
    borderRadius: '10px',
    marginBottom: '20px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  },
  sectionTitle: {
    marginTop: 0,
    marginBottom: '20px',
    color: '#333',
    fontSize: '24px',
  },
  stats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '20px',
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '15px',
    background: '#f8f9fa',
    borderRadius: '8px',
  },
  statValue: {
    fontSize: '42px',
    fontWeight: 'bold',
    color: '#667eea',
    marginBottom: '5px',
  },
  statLabel: {
    color: '#666',
    fontSize: '14px',
  },
  materiasCard: {
    background: 'white',
    padding: '25px',
    borderRadius: '10px',
    marginBottom: '20px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  },
  empty: {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#666',
  },
  emptyHint: {
    fontSize: '14px',
    color: '#999',
    marginTop: '10px',
  },
  materiasList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  materiaCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '20px',
    border: '2px solid #eee',
    borderRadius: '8px',
    transition: 'all 0.2s',
  },
  materiaInfo: {
    flex: 1,
  },
  materiaNombre: {
    margin: '0 0 5px 0',
    fontSize: '20px',
    color: '#333',
  },
  creditos: {
    color: '#666',
    fontSize: '14px',
    margin: '0 0 15px 0',
  },
  cortesDetalle: {
    marginTop: '10px',
    padding: '10px',
    background: '#f8f9fa',
    borderRadius: '5px',
  },
  corteItem: {
    display: 'flex',
    gap: '10px',
    padding: '5px 0',
    fontSize: '14px',
  },
  corteLabel: {
    fontWeight: 'bold',
    minWidth: '70px',
  },
  corteNota: {
    fontWeight: 'bold',
    minWidth: '50px',
  },
  corteDetalle: {
    color: '#666',
    fontSize: '13px',
  },
  corteFaltante: {
    marginTop: '8px',
    padding: '8px',
    background: '#fff3cd',
    borderRadius: '4px',
    fontSize: '13px',
    color: '#856404',
  },
  alertaRiesgo: {
    marginTop: '10px',
    padding: '10px',
    background: '#ffebee',
    border: '1px solid #ff4444',
    borderRadius: '5px',
    fontSize: '13px',
    color: '#c62828',
    fontWeight: 'bold',
  },
  materiaNote: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    minWidth: '150px',
  },
  notaLabel: {
    fontSize: '12px',
    color: '#666',
    marginBottom: '5px',
  },
  nota: {
    fontSize: '36px',
    fontWeight: 'bold',
    marginBottom: '5px',
  },
  estado: {
    fontSize: '13px',
    marginBottom: '5px',
  },
  progreso: {
    fontSize: '12px',
    color: '#999',
  },
};

export default Dashboard;