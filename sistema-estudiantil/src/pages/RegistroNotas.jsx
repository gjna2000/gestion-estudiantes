// src/pages/RegistroNotas.jsx
import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import Card from '../components/Card';
import Alert from '../components/Alert';

const RegistroNotas = () => {
    const [formData, setFormData] = useState({
        materia: '',
        corte: '',
        nota: '',
        creditos: '',
    });
    
    const [loading, setLoading] = useState(false);
    const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });
    
    // Lista de materias comunes
    const materias = [
        'Cálculo Integral', 
        'Programación Orientada a Objetos', 
        'Bases de Datos I', 
        'Estructura de Datos',
        'Álgebra Lineal',
        'Física I',
        'Inglés',
        'Otra (personalizada)'
    ];
    
    const cortes = [
        'Corte 1 (25%)', 
        'Corte 2 (30%)', 
        'Corte 3 (45%)', 
        'Trabajo Final (100%)',
        'Nota Final'
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        // Limpiar mensaje cuando el usuario empiece a escribir
        if (mensaje.texto) {
            setMensaje({ tipo: '', texto: '' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMensaje({ tipo: '', texto: '' });

        try {
            const user = auth.currentUser;
            
            if (!user) {
                setMensaje({ 
                    tipo: 'danger', 
                    texto: 'Debes iniciar sesión para registrar notas' 
                });
                setLoading(false);
                return;
            }

            // Validar nota
            const notaNum = parseFloat(formData.nota);
            if (notaNum < 0 || notaNum > 5) {
                setMensaje({ 
                    tipo: 'danger', 
                    texto: 'La nota debe estar entre 0.0 y 5.0' 
                });
                setLoading(false);
                return;
            }

            // Validar créditos
            const creditosNum = parseInt(formData.creditos);
            if (creditosNum < 1 || creditosNum > 10) {
                setMensaje({ 
                    tipo: 'danger', 
                    texto: 'Los créditos deben estar entre 1 y 10' 
                });
                setLoading(false);
                return;
            }

            // Guardar en Firebase
            await addDoc(collection(db, 'materias'), {
                userId: user.uid,
                nombre: formData.materia,
                corte: formData.corte,
                nota: notaNum,
                creditos: creditosNum,
                fecha: new Date(),
                timestamp: Date.now()
            });

            // Determinar tipo de alerta según la nota
            let tipoAlerta = 'success';
            let mensajeAlerta = '¡Nota registrada exitosamente!';
            
            if (notaNum < 3.0) {
                tipoAlerta = 'danger';
                mensajeAlerta = `⚠️ Nota registrada: ${notaNum.toFixed(1)}. Esta materia requiere atención urgente.`;
            } else if (notaNum < 3.5) {
                tipoAlerta = 'warning';
                mensajeAlerta = `📊 Nota registrada: ${notaNum.toFixed(1)}. Considera reforzar esta materia.`;
            } else if (notaNum >= 4.5) {
                mensajeAlerta = `🎉 ¡Excelente! Nota registrada: ${notaNum.toFixed(1)}. ¡Sigue así!`;
            }

            setMensaje({ tipo: tipoAlerta, texto: mensajeAlerta });
            
            // Resetear formulario
            setFormData({ materia: '', corte: '', nota: '', creditos: '' });
            
        } catch (error) {
            console.error('Error al guardar:', error);
            setMensaje({ 
                tipo: 'danger', 
                texto: 'Error al guardar la nota. Intenta nuevamente.' 
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Registro de Notas ✍️</h2>
            
            <Alert type="info">
                Registra tus calificaciones para obtener recomendaciones personalizadas y seguimiento de tu rendimiento académico.
            </Alert>
            
            {mensaje.texto && (
                <Alert type={mensaje.tipo}>
                    {mensaje.texto}
                </Alert>
            )}
            
            <Card title="Ingresar Nueva Calificación">
                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
                    
                    {/* Campo 1: Materia */}
                    <div>
                        <label htmlFor="materia" style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>
                            Materia: <span style={{ color: 'red' }}>*</span>
                        </label>
                        <select 
                            id="materia" 
                            name="materia" 
                            value={formData.materia} 
                            onChange={handleChange}
                            required
                            disabled={loading}
                            style={{ 
                                width: '100%', 
                                padding: '10px', 
                                borderRadius: 'var(--border-radius)',
                                border: '1px solid #ccc',
                                fontSize: '14px'
                            }}
                        >
                            <option value="">Seleccione una Materia</option>
                            {materias.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                    </div>
                    
                    {/* Campo 2: Corte/Parcial */}
                    <div>
                        <label htmlFor="corte" style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>
                            Corte Evaluativo: <span style={{ color: 'red' }}>*</span>
                        </label>
                        <select 
                            id="corte" 
                            name="corte" 
                            value={formData.corte} 
                            onChange={handleChange}
                            required
                            disabled={loading}
                            style={{ 
                                width: '100%', 
                                padding: '10px', 
                                borderRadius: 'var(--border-radius)',
                                border: '1px solid #ccc',
                                fontSize: '14px'
                            }}
                        >
                            <option value="">Seleccione un Corte</option>
                            {cortes.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>

                    {/* Campo 3: Créditos */}
                    <div>
                        <label htmlFor="creditos" style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>
                            Créditos (1-10): <span style={{ color: 'red' }}>*</span>
                        </label>
                        <input
                            type="number"
                            id="creditos"
                            name="creditos"
                            value={formData.creditos}
                            onChange={handleChange}
                            min="1"
                            max="10"
                            required
                            disabled={loading}
                            placeholder="Ej: 3"
                            style={{ 
                                width: '100%', 
                                padding: '10px', 
                                borderRadius: 'var(--border-radius)', 
                                border: '1px solid #ccc',
                                fontSize: '14px'
                            }}
                        />
                    </div>

                    {/* Campo 4: Nota */}
                    <div>
                        <label htmlFor="nota" style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>
                            Nota (0.0 a 5.0): <span style={{ color: 'red' }}>*</span>
                        </label>
                        <input
                            type="number"
                            id="nota"
                            name="nota"
                            value={formData.nota}
                            onChange={handleChange}
                            step="0.1"
                            min="0.0"
                            max="5.0"
                            required
                            disabled={loading}
                            placeholder="Ej: 4.5"
                            style={{ 
                                width: '100%', 
                                padding: '10px', 
                                borderRadius: 'var(--border-radius)', 
                                border: '1px solid #ccc',
                                fontSize: '14px'
                            }}
                        />
                    </div>
                    
                    {/* Botón de Envío */}
                    <button 
                        type="submit" 
                        className="btn-primary" 
                        disabled={loading}
                        style={{ 
                            marginTop: 'var(--spacing-md)',
                            opacity: loading ? 0.6 : 1,
                            cursor: loading ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {loading ? '⏳ Guardando...' : '📝 Registrar Nota'}
                    </button>
                </form>
            </Card>

            {/* Información adicional */}
            <div style={{ marginTop: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
                <h4 style={{ marginTop: 0 }}>💡 Consejos:</h4>
                <ul style={{ marginBottom: 0, paddingLeft: '20px' }}>
                    <li>Registra tus notas regularmente para un mejor seguimiento</li>
                    <li>Las recomendaciones se actualizan automáticamente según tu rendimiento</li>
                    <li>Notas inferiores a 3.0 generarán alertas de atención urgente</li>
                    <li>Puedes ver todas tus materias en el Panel principal</li>
                </ul>
            </div>
        </div>
    );
};

export default RegistroNotas;