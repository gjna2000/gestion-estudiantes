import React from 'react';
import { auth } from '../services/firebase';
import Header from './Header'; 
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
    const user = auth.currentUser;
    const userName = user?.email || "Usuario";
    
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