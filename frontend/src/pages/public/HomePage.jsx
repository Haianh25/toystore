import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HeroSlider from '../../components/public/HeroSlider';
import ProductSection from '../../components/public/ProductSection';
import FeaturedSlider from '../../components/public/FeaturedSlider';
import PromoSection from '../../components/public/PromoSection'; // <-- Import component mới
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
    const [sections, setSections] = useState([]);
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const serverUrl = 'http://localhost:5000';

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

    if (loading) {
        return <p>Đang tải trang...</p>;
    }

    const renderSection = (section) => {
        switch (section.type) {
            case 'product_grid':
                return <ProductSection key={section._id} title={section.title} products={section.content.products} />;
            case 'product_slider':
                return <FeaturedSlider key={section._id} title={section.title} products={section.content.products} />;
            case 'single_banner':
                return (
                    <div key={section._id} style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 15px' }}>
                         <Link to={section.content.link}>
                            <img src={`${serverUrl}${section.content.image}`} alt={section.title} style={{ width: '100%', borderRadius: '8px' }} />
                        </Link>
                    </div>
                );
            // THÊM CASE MỚI Ở ĐÂY
            case 'promo_with_products':
                return <PromoSection key={section._id} section={section} />;
            default:
                return null;
        }
    };

    return (
        <div>
            {banners.length > 0 && <HeroSlider banners={banners} />}
            {sections.map(section => renderSection(section))}
        </div>
    );
};

export default HomePage;