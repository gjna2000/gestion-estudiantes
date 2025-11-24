// src/pages/RegistroNotas.jsx
import React, { useState } from 'react';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import Card from '../components/Card';
import Alert from '../components/Alert';

const RegistroNotas = () => {
    const [formData, setFormData] = useState({
        materia: '',
        corte: '',
        notaParcial: '',
        notaQuiz: '',
        creditos: '',
    });
    
    const [loading, setLoading] = useState(false);
    const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });
    
    // Configuración de cortes con porcentajes
    const configCortes = {
        'corte1': { 
            label: 'Corte 1', 
            total: 35,
            parcial: 20, 
            quiz: 15 
        },
        'corte2': { 
            label: 'Corte 2', 
            total: 35,
            parcial: 20, 
            quiz: 15 
        },
        'corte3': { 
            label: 'Corte 3', 
            total: 30,
            parcial: 20, 
            quiz: 10 
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        if (mensaje.texto) {
            setMensaje({ tipo: '', texto: '' });
        }
    };

    const calcularNotaCorte = (parcial, quiz, corte) => {
        const config = configCortes[corte];
        const notaParcialPonderada = (parseFloat(parcial) * config.parcial) / 100;
        const notaQuizPonderada = (parseFloat(quiz) * config.quiz) / 100;
        return notaParcialPonderada + notaQuizPonderada;
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

            // Validaciones
            if (!formData.materia.trim()) {
                setMensaje({ tipo: 'danger', texto: 'El nombre de la materia es obligatorio' });
                setLoading(false);
                return;
            }

            const notaParcial = parseFloat(formData.notaParcial);
            const notaQuiz = parseFloat(formData.notaQuiz);
            const creditos = parseInt(formData.creditos);

            if (notaParcial < 0 || notaParcial > 5 || notaQuiz < 0 || notaQuiz > 5) {
                setMensaje({ tipo: 'danger', texto: 'Las notas deben estar entre 0.0 y 5.0' });
                setLoading(false);
                return;
            }

            if (creditos < 1 || creditos > 10) {
                setMensaje({ tipo: 'danger', texto: 'Los créditos deben estar entre 1 y 10' });
                setLoading(false);
                return;
            }

            // Calcular nota del corte
            const notaCorte = calcularNotaCorte(notaParcial, notaQuiz, formData.corte);
            const config = configCortes[formData.corte];

            // Verificar si ya existe una nota para este corte de esta materia
            const q = query(
                collection(db, 'evaluaciones'),
                where('userId', '==', user.uid),
                where('materia', '==', formData.materia.trim()),
                where('corte', '==', formData.corte)
            );
            const existentes = await getDocs(q);

            if (!existentes.empty) {
                setMensaje({ 
                    tipo: 'warning', 
                    texto: `Ya existe una nota registrada para ${config.label} de ${formData.materia}. Si continúas, se reemplazará.` 
                });
                // En producción, aquí podrías actualizar en vez de crear uno nuevo
            }

            // Guardar en Firebase
            await addDoc(collection(db, 'evaluaciones'), {
                userId: user.uid,
                materia: formData.materia.trim(),
                corte: formData.corte,
                corteLabel: config.label,
                notaParcial: notaParcial,
                notaQuiz: notaQuiz,
                notaCorte: parseFloat(notaCorte.toFixed(2)),
                porcentajeTotal: config.total,
                creditos: creditos,
                fecha: new Date(),
                timestamp: Date.now()
            });

            // Determinar mensaje según resultado
            let tipoAlerta = 'success';
            let mensajeAlerta = `✅ ${config.label} registrado con éxito!\n`;
            mensajeAlerta += `Parcial: ${notaParcial.toFixed(1)} × ${config.parcial}% = ${((notaParcial * config.parcial) / 100).toFixed(2)}\n`;
            mensajeAlerta += `Quiz: ${notaQuiz.toFixed(1)} × ${config.quiz}% = ${((notaQuiz * config.quiz) / 100).toFixed(2)}\n`;
            mensajeAlerta += `Nota del corte: ${notaCorte.toFixed(2)} de ${(config.total / 100).toFixed(2)} (${((notaCorte / (config.total / 100)) * 100).toFixed(1)}%)`;

            // Alerta de riesgo si está por debajo de 0.9
            if (notaCorte < 0.9) {
                tipoAlerta = 'danger';
                mensajeAlerta = `⚠️ ¡ALERTA! ${config.label} en RIESGO:\n` + mensajeAlerta;
                mensajeAlerta += `\n\n🔴 Estás por debajo de 0.9. Necesitas mejorar urgentemente.`;
            } else if (notaCorte < (config.total / 100) * 0.7) {
                tipoAlerta = 'warning';
            }

            setMensaje({ tipo: tipoAlerta, texto: mensajeAlerta });
            
            // Resetear formulario
            setFormData({ 
                materia: formData.materia, // Mantener materia para facilitar registro de otros cortes
                corte: '', 
                notaParcial: '',
                notaQuiz: '',
                creditos: formData.creditos // Mantener créditos
            });
            
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

    const corteSeleccionado = formData.corte ? configCortes[formData.corte] : null;

    return (
        <div>
            <h2>Registro de Notas ✍️</h2>
            
            <Alert type="info">
                Registra tus notas de Parcial y Quiz/Trabajo por cada corte. El sistema calculará automáticamente el porcentaje de cada corte.
            </Alert>
            
            {mensaje.texto && (
                <Alert type={mensaje.tipo}>
                    <pre style={{ whiteSpace: 'pre-wrap', margin: 0, fontFamily: 'inherit' }}>
                        {mensaje.texto}
                    </pre>
                </Alert>
            )}
            
            <Card title="Ingresar Notas por Corte">
                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '15px' }}>
                    
                    {/* Nombre de Materia */}
                    <div>
                        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>
                            Nombre de la Materia: <span style={{ color: 'red' }}>*</span>
                        </label>
                        <input
                            type="text"
                            name="materia"
                            value={formData.materia}
                            onChange={handleChange}
                            placeholder="Ej: Cálculo Integral"
                            required
                            disabled={loading}
                            style={{ 
                                width: '100%', 
                                padding: '10px', 
                                borderRadius: '5px',
                                border: '1px solid #ccc',
                                fontSize: '14px'
                            }}
                        />
                    </div>

                    {/* Créditos */}
                    <div>
                        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>
                            Créditos (1-10): <span style={{ color: 'red' }}>*</span>
                        </label>
                        <input
                            type="number"
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
                                borderRadius: '5px',
                                border: '1px solid #ccc',
                                fontSize: '14px'
                            }}
                        />
                    </div>
                    
                    {/* Corte */}
                    <div>
                        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>
                            Seleccionar Corte: <span style={{ color: 'red' }}>*</span>
                        </label>
                        <select 
                            name="corte" 
                            value={formData.corte} 
                            onChange={handleChange}
                            required
                            disabled={loading}
                            style={{ 
                                width: '100%', 
                                padding: '10px', 
                                borderRadius: '5px',
                                border: '1px solid #ccc',
                                fontSize: '14px'
                            }}
                        >
                            <option value="">Seleccione un Corte</option>
                            {Object.entries(configCortes).map(([key, config]) => (
                                <option key={key} value={key}>
                                    {config.label} ({config.total}%) - Parcial {config.parcial}% + Quiz {config.quiz}%
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Mostrar detalles del corte seleccionado */}
                    {corteSeleccionado && (
                        <div style={{ 
                            padding: '15px', 
                            background: '#e3f2fd', 
                            borderRadius: '5px',
                            border: '2px solid #2196F3'
                        }}>
                            <strong>📊 {corteSeleccionado.label} - Distribución de Notas:</strong>
                            <ul style={{ marginBottom: 0, marginTop: '10px' }}>
                                <li>Parcial: vale {corteSeleccionado.parcial}% del total</li>
                                <li>Quiz y Trabajo: vale {corteSeleccionado.quiz}% del total</li>
                                <li><strong>Total del corte: {corteSeleccionado.total}%</strong></li>
                            </ul>
                        </div>
                    )}

                    {/* Nota Parcial */}
                    <div>
                        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>
                            Nota Parcial (0.0 - 5.0): <span style={{ color: 'red' }}>*</span>
                        </label>
                        <input
                            type="number"
                            name="notaParcial"
                            value={formData.notaParcial}
                            onChange={handleChange}
                            step="0.1"
                            min="0.0"
                            max="5.0"
                            required
                            disabled={loading}
                            placeholder="Ej: 4.0"
                            style={{ 
                                width: '100%', 
                                padding: '10px', 
                                borderRadius: '5px',
                                border: '1px solid #ccc',
                                fontSize: '14px'
                            }}
                        />
                    </div>

                    {/* Nota Quiz */}
                    <div>
                        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>
                            Nota Quiz y Trabajo (0.0 - 5.0): <span style={{ color: 'red' }}>*</span>
                        </label>
                        <input
                            type="number"
                            name="notaQuiz"
                            value={formData.notaQuiz}
                            onChange={handleChange}
                            step="0.1"
                            min="0.0"
                            max="5.0"
                            required
                            disabled={loading}
                            placeholder="Ej: 3.5"
                            style={{ 
                                width: '100%', 
                                padding: '10px', 
                                borderRadius: '5px',
                                border: '1px solid #ccc',
                                fontSize: '14px'
                            }}
                        />
                    </div>
                    
                    {/* Botón */}
                    <button 
                        type="submit" 
                        className="btn-primary" 
                        disabled={loading}
                        style={{ 
                            marginTop: '10px',
                            opacity: loading ? 0.6 : 1,
                            cursor: loading ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {loading ? '⏳ Guardando...' : '📝 Registrar Notas'}
                    </button>
                </form>
            </Card>

            {/* Tabla de porcentajes */}
            <div style={{ marginTop: '20px', padding: '20px', background: '#f8f9fa', borderRadius: '8px' }}>
                <h4 style={{ marginTop: 0 }}>📊 Sistema de Calificación:</h4>
                
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#667eea', color: 'white' }}>
                            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Corte</th>
                            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Parcial</th>
                            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Quiz/Trabajo</th>
                            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>Corte 1</td>
                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>20%</td>
                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>15%</td>
                            <td style={{ padding: '10px', border: '1px solid #ddd', fontWeight: 'bold' }}>35%</td>
                        </tr>
                        <tr style={{ background: '#f5f5f5' }}>
                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>Corte 2</td>
                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>20%</td>
                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>15%</td>
                            <td style={{ padding: '10px', border: '1px solid #ddd', fontWeight: 'bold' }}>35%</td>
                        </tr>
                        <tr>
                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>Corte 3</td>
                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>20%</td>
                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>10%</td>
                            <td style={{ padding: '10px', border: '1px solid #ddd', fontWeight: 'bold' }}>30%</td>
                        </tr>
                        <tr style={{ background: '#667eea', color: 'white', fontWeight: 'bold' }}>
                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>TOTAL</td>
                            <td style={{ padding: '10px', border: '1px solid #ddd' }} colSpan="2"></td>
                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>100%</td>
                        </tr>
                    </tbody>
                </table>

                <div style={{ marginTop: '15px', padding: '10px', background: '#fff3cd', borderRadius: '5px' }}>
                    <strong>⚠️ Riesgo:</strong> Si un corte queda con menos de 0.9, estarás en riesgo de reprobar.
                </div>
            </div>
        </div>
    );
};

export default RegistroNotas;