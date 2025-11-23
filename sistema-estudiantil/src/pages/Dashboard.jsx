// src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { auth, db } from '../services/firebase';

function Dashboard() {
  const [materias, setMaterias] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    nota: '',
    creditos: '',
  });

  useEffect(() => {
    cargarMaterias();
  }, []);

  const cargarMaterias = async () => {
    const user = auth.currentUser;
    if (!user) return;

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
  };

  const agregarMateria = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;

    await addDoc(collection(db, 'materias'), {
      userId: user.uid,
      nombre: formData.nombre,
      nota: parseFloat(formData.nota),
      creditos: parseInt(formData.creditos),
      fecha: new Date(),
    });

    setFormData({ nombre: '', nota: '', creditos: '' });
    setShowForm(false);
    cargarMaterias();
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

  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>📚 Dashboard Académico</h1>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          Cerrar sesión
        </button>
      </header>

      <div style={styles.content}>
        <div style={styles.statsCard}>
          <h2>Estadísticas Generales</h2>
          <div style={styles.stats}>
            <div style={styles.statItem}>
              <span style={styles.statValue}>{materias.length}</span>
              <span style={styles.statLabel}>Materias</span>
            </div>
            <div style={styles.statItem}>
              <span style={styles.statValue}>{calcularPromedio()}</span>
              <span style={styles.statLabel}>Promedio</span>
            </div>
          </div>
        </div>

        <div style={styles.actions}>
          <button
            onClick={() => setShowForm(!showForm)}
            style={styles.addBtn}
          >
            + Agregar Materia
          </button>
        </div>

        {showForm && (
          <form onSubmit={agregarMateria} style={styles.form}>
            <input
              type="text"
              placeholder="Nombre de la materia"
              value={formData.nombre}
              onChange={(e) => setFormData({...formData, nombre: e.target.value})}
              style={styles.input}
              required
            />
            <input
              type="number"
              step="0.1"
              min="0"
              max="5"
              placeholder="Nota (0-5)"
              value={formData.nota}
              onChange={(e) => setFormData({...formData, nota: e.target.value})}
              style={styles.input}
              required
            />
            <input
              type="number"
              min="1"
              placeholder="Créditos"
              value={formData.creditos}
              onChange={(e) => setFormData({...formData, creditos: e.target.value})}
              style={styles.input}
              required
            />
            <button type="submit" style={styles.submitBtn}>
              Guardar
            </button>
          </form>
        )}

        <div style={styles.materiasList}>
          <h2>Mis Materias</h2>
          {materias.length === 0 ? (
            <p style={styles.empty}>No tienes materias registradas</p>
          ) : (
            materias.map((materia) => (
              <div key={materia.id} style={styles.materiaCard}>
                <div style={styles.materiaInfo}>
                  <h3>{materia.nombre}</h3>
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
            ))
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: '#f5f5f5',
  },
  header: {
    background: '#667eea',
    color: 'white',
    padding: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoutBtn: {
    background: 'white',
    color: '#667eea',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  content: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
  },
  statsCard: {
    background: 'white',
    padding: '20px',
    borderRadius: '10px',
    marginBottom: '20px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  },
  stats: {
    display: 'flex',
    gap: '40px',
    marginTop: '20px',
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
  },
  statValue: {
    fontSize: '36px',
    fontWeight: 'bold',
    color: '#667eea',
  },
  statLabel: {
    color: '#666',
    marginTop: '5px',
  },
  actions: {
    marginBottom: '20px',
  },
  addBtn: {
    background: '#00C851',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
  },
  form: {
    background: 'white',
    padding: '20px',
    borderRadius: '10px',
    marginBottom: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  input: {
    padding: '12px',
    fontSize: '16px',
    border: '2px solid #ddd',
    borderRadius: '5px',
    outline: 'none',
  },
  submitBtn: {
    background: '#667eea',
    color: 'white',
    border: 'none',
    padding: '12px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  materiasList: {
    background: 'white',
    padding: '20px',
    borderRadius: '10px',
  },
  empty: {
    textAlign: 'center',
    color: '#666',
    padding: '40px',
  },
  materiaCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px',
    border: '2px solid #eee',
    borderRadius: '5px',
    marginBottom: '10px',
  },
  materiaInfo: {
    flex: 1,
  },
  creditos: {
    color: '#666',
    fontSize: '14px',
  },
  materiaNote: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  nota: {
    fontSize: '28px',
    fontWeight: 'bold',
  },
  estado: {
    fontSize: '14px',
    marginTop: '5px',
  },
};

export default Dashboard;