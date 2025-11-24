// src/components/Login.jsx
import { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';

function Login({ onLoginSuccess }) {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  
  // Campos adicionales para registro
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [materias, setMaterias] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Convertir usuario a formato de email (Firebase requiere email)
    const emailFalso = `${usuario.toLowerCase().replace(/\s/g, '')}@estudiantes.app`;

    try {
      if (isRegistering) {
        // Validaciones
        if (!nombre.trim() || !apellido.trim()) {
          setError('Nombre y apellido son obligatorios');
          return;
        }

        if (!materias.trim()) {
          setError('Debes ingresar al menos una materia');
          return;
        }

        if (password.length < 6) {
          setError('La contraseña debe tener al menos 6 caracteres');
          return;
        }

        // Crear usuario en Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, emailFalso, password);
        
        // Procesar materias (separadas por coma)
        const listaMaterias = materias
          .split(',')
          .map(m => m.trim())
          .filter(m => m.length > 0);

        // Guardar datos del usuario en Firestore
        await setDoc(doc(db, 'usuarios', userCredential.user.uid), {
          usuario: usuario.toLowerCase().replace(/\s/g, ''),
          nombre: nombre.trim(),
          apellido: apellido.trim(),
          nombreCompleto: `${nombre.trim()} ${apellido.trim()}`,
          materias: listaMaterias,
          fechaRegistro: new Date(),
          email: emailFalso
        });

        onLoginSuccess();
      } else {
        // Iniciar sesión
        await signInWithEmailAndPassword(auth, emailFalso, password);
        onLoginSuccess();
      }
    } catch (err) {
      console.error('Error:', err);
      
      if (err.code === 'auth/email-already-in-use') {
        setError('Este usuario ya está registrado');
      } else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Usuario o contraseña incorrectos');
      } else if (err.code === 'auth/invalid-credential') {
        setError('Usuario o contraseña incorrectos');
      } else if (err.code === 'auth/weak-password') {
        setError('La contraseña debe tener al menos 6 caracteres');
      } else {
        setError('Error: ' + err.message);
      }
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>
          🎓 Gestión Estudiantes
        </h1>
        <h2 style={styles.subtitle}>
          {isRegistering ? 'Crear cuenta nueva' : 'Iniciar sesión'}
        </h2>

        <form onSubmit={handleSubmit} style={styles.form}>
          {isRegistering && (
            <>
              <input
                type="text"
                placeholder="Nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                style={styles.input}
                required
              />
              <input
                type="text"
                placeholder="Apellido"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                style={styles.input}
                required
              />
            </>
          )}

          <input
            type="text"
            placeholder="Usuario (sin espacios)"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            style={styles.input}
            required
          />
          
          <input
            type="password"
            placeholder="Contraseña (mínimo 6 caracteres)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
            minLength={6}
          />

          {isRegistering && (
            <>
              <div style={styles.materiasInfo}>
                <label style={styles.label}>
                  📚 Materias que estás cursando:
                </label>
                <textarea
                  placeholder="Ej: Cálculo Integral, Programación, Física I, Inglés..."
                  value={materias}
                  onChange={(e) => setMaterias(e.target.value)}
                  style={styles.textarea}
                  required
                  rows={4}
                />
                <small style={styles.hint}>
                  💡 Separa las materias con comas. Estas serán las materias que podrás registrar.
                </small>
              </div>
            </>
          )}

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" style={styles.button}>
            {isRegistering ? 'Registrarse' : 'Entrar'}
          </button>
        </form>

        <p style={styles.toggle}>
          {isRegistering ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}
          <span
            onClick={() => {
              setIsRegistering(!isRegistering);
              setError('');
              setNombre('');
              setApellido('');
              setMaterias('');
            }}
            style={styles.link}
          >
            {isRegistering ? ' Inicia sesión' : ' Regístrate'}
          </span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '20px',
  },
  card: {
    background: 'white',
    padding: '40px',
    borderRadius: '10px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
    width: '100%',
    maxWidth: '500px',
  },
  title: {
    textAlign: 'center',
    color: '#333',
    marginBottom: '10px',
  },
  subtitle: {
    textAlign: 'center',
    color: '#666',
    marginBottom: '30px',
    fontSize: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  input: {
    padding: '12px',
    fontSize: '16px',
    border: '2px solid #ddd',
    borderRadius: '5px',
    outline: 'none',
  },
  materiasInfo: {
    background: '#f0f7ff',
    padding: '15px',
    borderRadius: '8px',
    border: '2px solid #667eea',
  },
  label: {
    display: 'block',
    fontWeight: 'bold',
    marginBottom: '8px',
    color: '#333',
  },
  textarea: {
    width: '100%',
    padding: '12px',
    fontSize: '14px',
    border: '2px solid #ddd',
    borderRadius: '5px',
    outline: 'none',
    resize: 'vertical',
    fontFamily: 'inherit',
  },
  hint: {
    display: 'block',
    marginTop: '8px',
    color: '#666',
    fontSize: '13px',
  },
  button: {
    padding: '12px',
    fontSize: '16px',
    background: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
    marginTop: '10px',
  },
  error: {
    color: 'red',
    fontSize: '14px',
    margin: '0',
    padding: '10px',
    background: '#ffebee',
    borderRadius: '5px',
  },
  toggle: {
    textAlign: 'center',
    marginTop: '20px',
    color: '#666',
  },
  link: {
    color: '#667eea',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
};

export default Login;