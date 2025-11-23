// src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import { generarRecomendaciones } from '../utils/recomendaciones';
import Recomendaciones from '../components/Recomendaciones';

function Dashboard() {
  const [materias, setMaterias] = useState([]);
  const [recomendaciones, setRecomendaciones] = useState([]);
  const [loading, setLoading] = useState(true);

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
        collection(db, 'materias'),
        where('userId', '==', user.uid)
      );
      const snapshot = await getDocs(q);
      const materiasData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      
      setMaterias(materiasData);
      
      // Generar recomendaciones basadas en las materias
      const recs = generarRecomendaciones(materiasData);
      setRecomendaciones(recs);
      
      setLoading(false);
    } catch (error) {
      console.error('Error cargando materias:', error);
      setLoading(false);
    }
  };

  const calcularPromedio = () => {
    if (materias.length === 0) return 0;
    const suma = materias.reduce((acc, m) => acc + m.nota, 0);
    return (suma / materias.length).toFixed(2);
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
            <span style={styles.statValue}>{materias.length}</span>
            <span style={styles.statLabel}>Materias</span>
          </div>
          <div style={styles.statItem}>
            <span style={{...styles.statValue, color: getColorNota(parseFloat(calcularPromedio()))}}>
              {calcularPromedio()}
            </span>
            <span style={styles.statLabel}>Promedio</span>
          </div>
          <div style={styles.statItem}>
            <span style={styles.statValue}>
              {materias.filter(m => m.nota < 3.0).length}
            </span>
            <span style={styles.statLabel}>En Riesgo</span>
          </div>
        </div>
      </div>

      {/* Lista de Materias */}
      <div style={styles.materiasCard}>
        <h2 style={styles.sectionTitle}>📚 Mis Materias</h2>
        {materias.length === 0 ? (
          <div style={styles.empty}>
            <p>No tienes materias registradas</p>
            <p style={styles.emptyHint}>Ve a "Registrar Nota" para agregar tus materias</p>
          </div>
        ) : (
          <div style={styles.materiasList}>
            {materias.map((materia) => (
              <div key={materia.id} style={styles.materiaCard}>
                <div style={styles.materiaInfo}>
                  <h3 style={styles.materiaNombre}>{materia.nombre}</h3>
                  <p style={styles.creditos}>{materia.creditos} créditos</p>
                </div>
                <div style={styles.materiaNote}>
                  <span
                    style={{
                      ...styles.nota,
                      color: getColorNota(materia.nota),
                    }}
                  >
                    {materia.nota.toFixed(1)}
                  </span>
                  <span style={styles.estado}>
                    {getEstadoNota(materia.nota)}
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
    maxWidth: '1200px',
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
    gap: '12px',
  },
  materiaCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px',
    border: '2px solid #eee',
    borderRadius: '8px',
    transition: 'all 0.2s',
    cursor: 'pointer',
  },
  materiaInfo: {
    flex: 1,
  },
  materiaNombre: {
    margin: '0 0 5px 0',
    fontSize: '18px',
    color: '#333',
  },
  creditos: {
    color: '#666',
    fontSize: '14px',
    margin: 0,
  },
  materiaNote: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  nota: {
    fontSize: '32px',
    fontWeight: 'bold',
    marginBottom: '5px',
  },
  estado: {
    fontSize: '13px',
  },
};

export default Dashboard;