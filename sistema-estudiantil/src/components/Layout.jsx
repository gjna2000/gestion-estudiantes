import React from 'react';
import Header from './Header'; 
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
    return (
        <div className="app-container">
            <Sidebar /> 
            
            <div className="main-content-wrapper">
                <Header userName="Gonzalo Javier Niño Amarís" />
                <main className="content-area">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;