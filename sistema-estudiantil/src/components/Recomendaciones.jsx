// src/components/Recomendaciones.jsx
import React from 'react';

function Recomendaciones({ recomendaciones }) {
  if (!recomendaciones || recomendaciones.length === 0) {
    return (
      <div style={styles.container}>
        <h2 style={styles.title}>💡 Recomendaciones Personalizadas</h2>
        <div style={styles.emptyState}>
          <p>No hay recomendaciones disponibles.</p>
          <p>Agrega materias para recibir sugerencias personalizadas.</p>
        </div>
      </div>
    );
  }

  const getColorByTipo = (tipo) => {
    const colores = {
      critica: '#ff4444',
      advertencia: '#ffbb33',
      exito: '#00C851',
      info: '#33b5e5'
    };
    return colores[tipo] || '#999';
  };

  const getPrioridadBadge = (prioridad) => {
    const badges = {
      ALTA: { text: 'PRIORIDAD ALTA', color: '#ff4444' },
      MEDIA: { text: 'PRIORIDAD MEDIA', color: '#ffbb33' },
      BAJA: { text: 'CONTINÚA ASÍ', color: '#00C851' }
    };
    return badges[prioridad] || badges.BAJA;
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>💡 Recomendaciones Personalizadas</h2>
      <p style={styles.subtitle}>
        Basadas en tu rendimiento académico actual
      </p>

      <div style={styles.recomendacionesList}>
        {recomendaciones.map((rec) => {
          const badge = getPrioridadBadge(rec.prioridad);
          
          return (
            <div 
              key={rec.id} 
              style={{
                ...styles.card,
                borderLeft: `5px solid ${getColorByTipo(rec.tipo)}`
              }}
            >
              {/* Header */}
              <div style={styles.cardHeader}>
                <div style={styles.cardTitle}>
                  <span style={styles.icono}>{rec.icono}</span>
                  <h3 style={styles.titulo}>{rec.titulo}</h3>
                </div>
                <span 
                  style={{
                    ...styles.badge,
                    backgroundColor: badge.color
                  }}
                >
                  {badge.text}
                </span>
              </div>

              {/* Materia y Nota (si aplica) */}
              {rec.materia && (
                <div style={styles.materiaInfo}>
                  <span style={styles.materiaLabel}>Materia:</span>
                  <span style={styles.materiaNombre}>{rec.materia}</span>
                  <span 
                    style={{
                      ...styles.nota,
                      color: getColorByTipo(rec.tipo)
                    }}
                  >
                    Nota: {rec.nota.toFixed(1)}
                  </span>
                </div>
              )}

              {/* Mensaje */}
              <p style={styles.mensaje}>{rec.mensaje}</p>

              {/* Acciones Recomendadas */}
              {rec.acciones && rec.acciones.length > 0 && (
                <div style={styles.accionesSection}>
                  <h4 style={styles.accionesTitle}>📋 Acciones recomendadas:</h4>
                  <ul style={styles.accionesList}>
                    {rec.acciones.map((accion, index) => (
                      <li key={index} style={styles.accionItem}>
                        {accion}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recursos (si están disponibles) */}
              {rec.recursos && rec.recursos.length > 0 && (
                <div style={styles.recursosSection}>
                  <h4 style={styles.recursosTitle}>📚 Recursos sugeridos:</h4>
                  <ul style={styles.recursosList}>
                    {rec.recursos.map((recurso, index) => (
                      <li key={index} style={styles.recursoItem}>
                        {recurso}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
  },
  title: {
    fontSize: '28px',
    marginBottom: '10px',
    color: '#333',
  },
  subtitle: {
    color: '#666',
    marginBottom: '30px',
    fontSize: '16px',
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    background: 'white',
    borderRadius: '10px',
    color: '#666',
  },
  recomendacionesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  card: {
    background: 'white',
    borderRadius: '10px',
    padding: '25px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '15px',
    flexWrap: 'wrap',
    gap: '10px',
  },
  cardTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flex: 1,
  },
  icono: {
    fontSize: '32px',
  },
  titulo: {
    margin: 0,
    fontSize: '20px',
    color: '#333',
  },
  badge: {
    padding: '6px 12px',
    borderRadius: '20px',
    color: 'white',
    fontSize: '12px',
    fontWeight: 'bold',
    whiteSpace: 'nowrap',
  },
  materiaInfo: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    marginBottom: '15px',
    padding: '10px',
    background: '#f8f9fa',
    borderRadius: '5px',
    flexWrap: 'wrap',
  },
  materiaLabel: {
    fontWeight: 'bold',
    color: '#666',
  },
  materiaNombre: {
    color: '#333',
    fontWeight: '500',
  },
  nota: {
    fontWeight: 'bold',
    fontSize: '16px',
    marginLeft: 'auto',
  },
  mensaje: {
    fontSize: '16px',
    lineHeight: '1.6',
    color: '#555',
    marginBottom: '20px',
  },
  accionesSection: {
    marginTop: '20px',
    padding: '15px',
    background: '#f0f7ff',
    borderRadius: '8px',
  },
  accionesTitle: {
    margin: '0 0 12px 0',
    fontSize: '16px',
    color: '#333',
  },
  accionesList: {
    margin: '0',
    paddingLeft: '20px',
  },
  accionItem: {
    marginBottom: '8px',
    color: '#444',
    lineHeight: '1.5',
  },
  recursosSection: {
    marginTop: '15px',
    padding: '15px',
    background: '#f0fff4',
    borderRadius: '8px',
  },
  recursosTitle: {
    margin: '0 0 12px 0',
    fontSize: '16px',
    color: '#333',
  },
  recursosList: {
    margin: '0',
    paddingLeft: '20px',
  },
  recursoItem: {
    marginBottom: '6px',
    color: '#444',
  },
};

export default Recomendaciones;