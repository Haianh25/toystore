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
                <div className="main-content-inner">
                    <Outlet />
                </div>
                <Footer />
            </main>
        </div>
    );
};

export default MainLayout;