import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Link } from 'react-router-dom';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './HeroSlider.css';

// Component này giờ sẽ nhận banners làm prop
const HeroSlider = ({ banners }) => {
  const serverUrl = 'http://localhost:5000';

  return (
    <div className="hero-slider-container">
      <Swiper
        className="hero-slider"
        modules={[Navigation, Pagination, Autoplay]}
        slidesPerView={1}
        navigation={true}
        pagination={{ clickable: true }}
        loop={true}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner._id}>
            <Link to={banner.link}>
              <img src={`${serverUrl}${banner.image}`} alt="Banner quảng cáo" />
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HeroSlider;