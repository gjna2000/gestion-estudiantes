// src/pages/Configuracion.jsx
import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc, collection, query, where, getDocs, deleteDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import Card from '../components/Card';
import Alert from '../components/Alert';

const Configuracion = () => {
    const [loading, setLoading] = useState(true);
    const [guardando, setGuardando] = useState(false);
    const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });
    
    // Datos del usuario
    const [datosUsuario, setDatosUsuario] = useState({
        nombre: '',
        apellido: '',
        usuario: '',
        materias: []
    });

    // Estados para edición
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [nuevaMateria, setNuevaMateria] = useState('');

    useEffect(() => {
        cargarDatosUsuario();
    }, []);

    const cargarDatosUsuario = async () => {
        try {
            const user = auth.currentUser;
            if (!user) {
                setLoading(false);
                return;
            }

            const userDoc = await getDoc(doc(db, 'usuarios', user.uid));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                setDatosUsuario(userData);
                setNombre(userData.nombre || '');
                setApellido(userData.apellido || '');
            }
            setLoading(false);
        } catch (error) {
            console.error('Error cargando datos:', error);
            setLoading(false);
        }
    };

    const actualizarNombre = async (e) => {
        e.preventDefault();
        setGuardando(true);
        setMensaje({ tipo: '', texto: '' });

        try {
            const user = auth.currentUser;
            if (!user) return;

            if (!nombre.trim() || !apellido.trim()) {
                setMensaje({ tipo: 'danger', texto: 'Nombre y apellido son obligatorios' });
                setGuardando(false);
                return;
            }

            await updateDoc(doc(db, 'usuarios', user.uid), {
                nombre: nombre.trim(),
                apellido: apellido.trim(),
                nombreCompleto: `${nombre.trim()} ${apellido.trim()}`
            });

            setDatosUsuario(prev => ({
                ...prev,
                nombre: nombre.trim(),
                apellido: apellido.trim(),
                nombreCompleto: `${nombre.trim()} ${apellido.trim()}`
            }));

            setMensaje({ tipo: 'success', texto: '✅ Nombre actualizado correctamente' });
            setGuardando(false);
            
            // Recargar la página para actualizar el header
            setTimeout(() => window.location.reload(), 1500);
        } catch (error) {
            console.error('Error actualizando nombre:', error);
            setMensaje({ tipo: 'danger', texto: 'Error al actualizar el nombre' });
            setGuardando(false);
        }
    };

    const agregarMateria = async (e) => {
        e.preventDefault();
        setGuardando(true);
        setMensaje({ tipo: '', texto: '' });

        try {
            const user = auth.currentUser;
            if (!user) return;

            const materiaLimpia = nuevaMateria.trim();
            
            if (!materiaLimpia) {
                setMensaje({ tipo: 'danger', texto: 'Ingresa el nombre de la materia' });
                setGuardando(false);
                return;
            }

            // Verificar si ya existe
            if (datosUsuario.materias.includes(materiaLimpia)) {
                setMensaje({ tipo: 'warning', texto: 'Esta materia ya está registrada' });
                setGuardando(false);
                return;
            }

            const nuevasMaterias = [...datosUsuario.materias, materiaLimpia];

            await updateDoc(doc(db, 'usuarios', user.uid), {
                materias: nuevasMaterias
            });

            setDatosUsuario(prev => ({
                ...prev,
                materias: nuevasMaterias
            }));

            setNuevaMateria('');
            setMensaje({ tipo: 'success', texto: `✅ Materia "${materiaLimpia}" agregada correctamente` });
            setGuardando(false);
        } catch (error) {
            console.error('Error agregando materia:', error);
            setMensaje({ tipo: 'danger', texto: 'Error al agregar la materia' });
            setGuardando(false);
        }
    };

    const eliminarMateria = async (materia) => {
        if (!window.confirm(`⚠️ ¿ESTÁS COMPLETAMENTE SEGURO?\n\nEsto eliminará:\n✗ La materia "${materia}" de tu lista\n✗ TODAS las evaluaciones registradas de esta materia\n✗ Todas las notas de todos los cortes\n\n❌ Esta acción NO se puede deshacer`)) {
            return;
        }

        setGuardando(true);
        setMensaje({ tipo: '', texto: '' });

        try {
            const user = auth.currentUser;
            if (!user) return;

            // 1. Eliminar todas las evaluaciones de esta materia
            const q = query(
                collection(db, 'evaluaciones'),
                where('userId', '==', user.uid),
                where('materia', '==', materia)
            );
            
            const snapshot = await getDocs(q);
            console.log(`Encontradas ${snapshot.size} evaluaciones para eliminar`);
            
            // Eliminar cada evaluación
            const deletePromises = snapshot.docs.map(docSnapshot => 
                deleteDoc(doc(db, 'evaluaciones', docSnapshot.id))
            );
            
            await Promise.all(deletePromises);

            // 2. Eliminar la materia de la lista del usuario
            const nuevasMaterias = datosUsuario.materias.filter(m => m !== materia);

            await updateDoc(doc(db, 'usuarios', user.uid), {
                materias: nuevasMaterias
            });

            setDatosUsuario(prev => ({
                ...prev,
                materias: nuevasMaterias
            }));

            setMensaje({ 
                tipo: 'success', 
                texto: `✅ Materia "${materia}" eliminada completamente\n${snapshot.size} evaluación(es) eliminada(s)` 
            });
            setGuardando(false);
            
            // Opcional: recargar después de 2 segundos para actualizar todo
            setTimeout(() => window.location.reload(), 2000);
        } catch (error) {
            console.error('Error eliminando materia:', error);
            setMensaje({ tipo: 'danger', texto: 'Error al eliminar la materia y sus evaluaciones' });
            setGuardando(false);
        }
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '40px' }}>
                <h2>Cargando configuración...</h2>
            </div>
        );
    }

    return (
        <div>
            <h2>⚙️ Configuración</h2>

            {mensaje.texto && (
                <Alert type={mensaje.tipo}>
                    {mensaje.texto}
                </Alert>
            )}

            {/* Información de la cuenta */}
            <Card title="👤 Información de la Cuenta">
                <div style={{ marginBottom: '20px' }}>
                    <p style={{ margin: '5px 0' }}>
                        <strong>Usuario:</strong> {datosUsuario.usuario}
                    </p>
                    <p style={{ margin: '5px 0', fontSize: '13px', color: '#666' }}>
                        El nombre de usuario no se puede cambiar
                    </p>
                </div>
            </Card>

            {/* Editar Nombre y Apellido */}
            <Card title="✏️ Editar Nombre">
                <form onSubmit={actualizarNombre} style={{ display: 'grid', gap: '15px' }}>
                    <div>
                        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>
                            Nombre: <span style={{ color: 'red' }}>*</span>
                        </label>
                        <input
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            placeholder="Tu nombre"
                            required
                            disabled={guardando}
                            style={{
                                width: '100%',
                                padding: '12px',
                                fontSize: '14px',
                                border: '2px solid #ddd',
                                borderRadius: '5px',
                                outline: 'none'
                            }}
                        />
                    </div>

                    <div>
                        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>
                            Apellido: <span style={{ color: 'red' }}>*</span>
                        </label>
                        <input
                            type="text"
                            value={apellido}
                            onChange={(e) => setApellido(e.target.value)}
                            placeholder="Tu apellido"
                            required
                            disabled={guardando}
                            style={{
                                width: '100%',
                                padding: '12px',
                                fontSize: '14px',
                                border: '2px solid #ddd',
                                borderRadius: '5px',
                                outline: 'none'
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={guardando}
                        style={{
                            padding: '12px',
                            background: '#667eea',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: guardando ? 'not-allowed' : 'pointer',
                            fontWeight: 'bold',
                            fontSize: '14px',
                            opacity: guardando ? 0.6 : 1
                        }}
                    >
                        {guardando ? '⏳ Guardando...' : '💾 Guardar Cambios'}
                    </button>
                </form>
            </Card>

            {/* Gestión de Materias */}
            <Card title="📚 Mis Materias">
                <div style={{ marginBottom: '20px' }}>
                    <h4 style={{ marginTop: 0, marginBottom: '15px' }}>
                        Materias actuales ({datosUsuario.materias.length})
                    </h4>
                    
                    {datosUsuario.materias.length === 0 ? (
                        <p style={{ color: '#666', textAlign: 'center', padding: '20px' }}>
                            No tienes materias registradas
                        </p>
                    ) : (
                        <div style={{ display: 'grid', gap: '10px' }}>
                            {datosUsuario.materias.map((materia, index) => (
                                <div
                                    key={index}
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '15px',
                                        background: '#f8f9fa',
                                        borderRadius: '8px',
                                        border: '2px solid #eee'
                                    }}
                                >
                                    <span style={{ fontWeight: '500', fontSize: '15px' }}>
                                        📖 {materia}
                                    </span>
                                    <button
                                        onClick={() => eliminarMateria(materia)}
                                        disabled={guardando}
                                        style={{
                                            background: '#dc3545',
                                            color: 'white',
                                            border: 'none',
                                            padding: '8px 15px',
                                            borderRadius: '5px',
                                            cursor: guardando ? 'not-allowed' : 'pointer',
                                            fontSize: '13px',
                                            fontWeight: 'bold',
                                            opacity: guardando ? 0.6 : 1
                                        }}
                                    >
                                        🗑️ Eliminar
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Agregar nueva materia */}
                <div style={{
                    padding: '20px',
                    background: '#e3f2fd',
                    borderRadius: '8px',
                    border: '2px solid #2196F3'
                }}>
                    <h4 style={{ marginTop: 0, marginBottom: '15px' }}>
                        ➕ Agregar Nueva Materia
                    </h4>
                    <form onSubmit={agregarMateria} style={{ display: 'flex', gap: '10px' }}>
                        <input
                            type="text"
                            value={nuevaMateria}
                            onChange={(e) => setNuevaMateria(e.target.value)}
                            placeholder="Nombre de la materia (Ej: Física II)"
                            disabled={guardando}
                            style={{
                                flex: 1,
                                padding: '12px',
                                fontSize: '14px',
                                border: '2px solid #2196F3',
                                borderRadius: '5px',
                                outline: 'none'
                            }}
                        />
                        <button
                            type="submit"
                            disabled={guardando || !nuevaMateria.trim()}
                            style={{
                                padding: '12px 24px',
                                background: '#00C851',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: (guardando || !nuevaMateria.trim()) ? 'not-allowed' : 'pointer',
                                fontWeight: 'bold',
                                fontSize: '14px',
                                opacity: (guardando || !nuevaMateria.trim()) ? 0.6 : 1,
                                whiteSpace: 'nowrap'
                            }}
                        >
                            {guardando ? '⏳' : '➕ Agregar'}
                        </button>
                    </form>
                    <p style={{ fontSize: '12px', color: '#666', margin: '10px 0 0 0' }}>
                        💡 Agrega las materias que estás cursando actualmente
                    </p>
                </div>
            </Card>

            {/* Información adicional */}
            <div style={{
                padding: '20px',
                background: '#ffebee',
                borderRadius: '8px',
                border: '2px solid #f44336',
                marginTop: '20px'
            }}>
                <h4 style={{ marginTop: 0, color: '#c62828' }}>⚠️ Advertencia Importante</h4>
                <ul style={{ marginBottom: 0, paddingLeft: '20px', color: '#c62828' }}>
                    <li><strong>Al eliminar una materia se borrarán PERMANENTEMENTE:</strong></li>
                    <li style={{ marginLeft: '20px' }}>✗ Todas las evaluaciones de esa materia</li>
                    <li style={{ marginLeft: '20px' }}>✗ Todas las notas de todos los cortes</li>
                    <li style={{ marginLeft: '20px' }}>✗ Todo el historial asociado</li>
                    <li style={{ marginTop: '10px' }}><strong>Esta acción NO se puede deshacer</strong></li>
                </ul>
            </div>

            <div style={{
                padding: '20px',
                background: '#e3f2fd',
                borderRadius: '8px',
                border: '1px solid #2196F3',
                marginTop: '15px'
            }}>
                <h4 style={{ marginTop: 0 }}>ℹ️ Información General</h4>
                <ul style={{ marginBottom: 0, paddingLeft: '20px' }}>
                    <li>Los cambios en el nombre se reflejarán en toda la aplicación</li>
                    <li>Solo podrás registrar notas para las materias que aparecen en esta lista</li>
                    <li>Puedes agregar nuevas materias en cualquier momento</li>
                </ul>
            </div>
        </div>
    );
};

export default Configuracion;