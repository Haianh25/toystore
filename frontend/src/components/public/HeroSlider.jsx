import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import { Link } from 'react-router-dom';

import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import './HeroSlider.css';

import { API_URL } from '../../config/api';

// Component này giờ sẽ nhận banners làm prop
const HeroSlider = ({ banners }) => {
  if (!banners || banners.length === 0) return null;

  return (
    <div className="hero-slider-container hero">
      <Swiper
        className="hero-slider"
        modules={[Autoplay, EffectFade, Pagination]}
        slidesPerView={1}
        effect="fade"
        loop={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner._id}>
            <div className="hero-slide-content">
              <img src={`${API_URL}/${banner.image}`} alt="Banner" className="hero-image" />
              <div className="hero-overlay">
                <div className="hero-text-content">
                  <span className="hero-subtitle">NEW COLLECTIONS</span>
                  <h1 className="hero-title">{banner.title || "LEGENDARY MODERNITY"}</h1>
                  <Link to={banner.link} className="hero-btn">DISCOVER</Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HeroSlider;