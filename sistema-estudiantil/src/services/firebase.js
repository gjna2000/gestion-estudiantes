// src/services/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC5m-32FB9zEFWwbh7cd4T1CZsD4TvKYVM",
  authDomain: "gestion-estudiantes-f8303.firebaseapp.com",
  projectId: "gestion-estudiantes-f8303",
  storageBucket: "gestion-estudiantes-f8303.firebasestorage.app",
  messagingSenderId: "18100949842",
  appId: "1:18100949842:web:d5c06ba13d239de807608b",
  measurementId: "G-MGV3K7EDV7"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Servicios que vamos a usar
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;