import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/public/Header';
import Footer from '../components/public/Footer';
import './MainLayout.css';

const MainLayout = () => {
    return (
        <div className="main-layout">
            <Header />
            <main className="main-layout-content">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;