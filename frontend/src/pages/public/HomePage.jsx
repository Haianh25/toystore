import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HeroSlider from '../../components/public/HeroSlider';
import PromoSection from '../../components/public/PromoSection';
import HeritageSection from '../../components/public/HeritageSection';
import EditorialGrid from '../../components/public/EditorialGrid';
import './HomePage.css';

const HomePage = () => {
    const [sections, setSections] = useState([]);
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHomePageData = async () => {
            try {
                const [sectionsRes, bannersRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/v1/sections?activeOnly=true'),
                    axios.get('http://localhost:5000/api/v1/banners?activeOnly=true')
                ]);
                setSections(sectionsRes.data.data.sections);
                setBanners(bannersRes.data.data.banners);
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
            <span className="loader-text">DIOR</span>
        </div>
    );

    const renderSection = (section, index) => {
        const hasTitle = section.title && section.title.trim() !== '';

        // Alternate between PromoSection and EditorialGrid for a rhythmic layout
        if (section.type === 'promo_with_products') {
            const hasPromoContent = section.content?.bannerImage && section.content?.products?.length > 0;
            if (!hasTitle || !hasPromoContent) return null;

            if (index % 2 === 0) {
                return <PromoSection key={section._id} section={section} />;
            } else {
                return <EditorialGrid key={section._id} section={section} />;
            }
        }

        // Feature Audit: We are removing 'banner_slider' (SectionBannerSlider) as it's redundant and clunky
        return null;
    };

    return (
        <div className="homepage-fade-in">
            {banners.length > 0 && <HeroSlider banners={banners} />}

            <div className="homepage-content-layer">
                <HeritageSection />

                <div className="dynamic-sections">
                    {sections.map((section, index) => renderSection(section, index))}
                </div>
            </div>
        </div>
    );
};

export default HomePage;
