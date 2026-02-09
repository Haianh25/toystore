import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HeroSlider from '../../components/public/HeroSlider';
import HeritageSection from '../../components/public/HeritageSection';
import CategoryShowcase from '../../components/public/CategoryShowcase';
import EditorialGrid from '../../components/public/EditorialGrid';
import { API_URL } from '../../config/api';
import './HomePage.css';

const HomePage = () => {
    useEffect(() => {
        document.title = "TheDevilPlayz | Home of Premium Collectibles";
    }, []);

    const [sections, setSections] = useState([]);
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHomePageData = async () => {
            try {
                const [sectionsRes, bannersRes] = await Promise.all([
                    axios.get(`${API_URL}/api/v1/sections?activeOnly=true`),
                    axios.get(`${API_URL}/api/v1/banners?activeOnly=true`)
                ]);
                setSections(sectionsRes.data.data.sections || []);
                setBanners(bannersRes.data.data.banners || []);
            } catch (error) {
                console.error("Lỗi tải dữ liệu trang chủ:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchHomePageData();
    }, []);

    if (loading) return (
        <div className="luxury-loader">
            <span className="loader-text">TheDevilPlayz</span>
        </div>
    );

    // Find the most premium "Promo" section for the Editorial layout
    const editorialSection = sections.find(s => s.type === 'promo_with_products' && s.content?.products?.length > 0);

    return (
        <div className="pure-luxury-homepage">
            {/* 1. CINEMATIC INTRO */}
            <div className="homepage-hero-wrapper">
                {banners.length > 0 ? (
                    <HeroSlider banners={banners} />
                ) : (
                    <div className="hero-fallback-luxury">
                        <div className="hero-content-minimal">
                            <span className="reveal-text subtitle">NEW TOYSTORE ERA</span>
                            <h1 className="reveal-text title">ELEGANCE IN PLAY</h1>
                        </div>
                    </div>
                )}
            </div>

            <main className="main-content-flow">
                {/* 2. THE BRAND HERITAGE - The Core Story */}
                <div className="flow-section">
                    <HeritageSection />
                </div>

                {/* 3. CATEGORY SHOWCASE - Fixed Impact Navigation */}
                <div className="flow-section">
                    <div className="section-intro">
                        <span className="tdp-dash-title">LES COLLECTIONS</span>
                        <h2 className="tdp-serif">THE WORLD OF WONDER</h2>
                        <p className="tdp-desc">Discover our curated universes for every stage of childhood.</p>
                    </div>
                    <CategoryShowcase />
                </div>

                {/* 4. EDITORIAL SELECTION - Dynamic highlight */}
                {editorialSection && (
                    <div className="flow-section secondary-bg">
                        <EditorialGrid section={editorialSection} />
                    </div>
                )}

                {/* 5. LUXURY FOOTER REVEAL SPACER */}
                <div className="final-reveal-spacer"></div>
            </main>
        </div>
    );
};

export default HomePage;
