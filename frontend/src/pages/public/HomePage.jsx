import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HeroSlider from '../../components/public/HeroSlider';
import PromoSection from '../../components/public/PromoSection';
import SectionBannerSlider from '../../components/public/SectionBannerSlider';
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

    if (loading) return <p>Đang tải trang...</p>;

    const renderSection = (section) => {
        // Kiểm tra nội dung trước khi render
        const hasTitle = section.title && section.title.trim() !== '';
        
        switch (section.type) {
            case 'promo_with_products':
                const hasPromoContent = section.content?.bannerImage && section.content?.products?.length > 0;
                if (!hasTitle || !hasPromoContent) return null; // Chỉ hiện khi có đủ tiêu đề, ảnh và sản phẩm
                return <PromoSection key={section._id} section={section} />;

            case 'banner_slider':
                const hasBanners = section.content?.bannerGroup?.length > 0;
                if (!hasBanners) return null; // Chỉ hiện khi có banner trong nhóm
                return <SectionBannerSlider key={section._id} section={section} />;
                
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