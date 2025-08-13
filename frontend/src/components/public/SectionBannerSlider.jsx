import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { Link } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/navigation';
import './SectionBannerSlider.css';

const SectionBannerSlider = ({ section }) => {
    const serverUrl = 'http://localhost:5000';
    let banners = section.content.bannerGroup || [];

    if (!banners || banners.length === 0) return null;

    if (banners.length > 10) {
        banners = banners.slice(0, 10);
    }

    return (
        <div className="section-banner-slider-container">
            <div className="section-header">
                {section.title && <h2>{section.title}</h2>}
                {section.content.link && <Link to={section.content.link} className="see-more-btn">Xem Thêm ▸</Link>}
            </div>

            <Swiper
                className="section-banner-slider"
                modules={[Navigation]}
                // TRẢ LẠI CÀI ĐẶT HIỂN THỊ 4 BANNER
                slidesPerView={4} 
                spaceBetween={20}
                navigation={true}
                breakpoints={{
                    320: { slidesPerView: 1, spaceBetween: 10 },
                    640: { slidesPerView: 2, spaceBetween: 15 },
                    1024: { slidesPerView: 3, spaceBetween: 20 },
                    1200: { slidesPerView: 4, spaceBetween: 20 },
                }}
            >
                {banners.map((banner, index) => (
                    <SwiperSlide key={index}>
                        <Link to={banner.link || '#'} className="banner-item-link">
                            <img src={`${serverUrl}${banner.image}`} alt={`Banner ${index + 1}`} />
                        </Link>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default SectionBannerSlider;