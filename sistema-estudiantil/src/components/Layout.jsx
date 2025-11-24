import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import Header from './Header'; 
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
    const [userName, setUserName] = useState("Cargando...");

    useEffect(() => {
        cargarDatosUsuario();
    }, []);

    const cargarDatosUsuario = async () => {
        const user = auth.currentUser;
        if (!user) {
            setUserName("Usuario");
            return;
        }

        try {
            const userDoc = await getDoc(doc(db, 'usuarios', user.uid));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                const nombreCompleto = `${userData.nombre} ${userData.apellido}`;
                setUserName(nombreCompleto);
            } else {
                setUserName(user.email?.split('@')[0] || "Usuario");
            }
        } catch (error) {
            console.error('Error cargando datos:', error);
            setUserName("Usuario");
        }
    };
    
    return (
        <div className="app-container">
            <Sidebar /> 
            
            <div className="main-content-wrapper">
                <Header userName={userName} />
                <main className="content-area">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;