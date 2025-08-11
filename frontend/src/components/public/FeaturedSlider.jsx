import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Scrollbar } from 'swiper/modules'; // Import Scrollbar
import ProductCard from './ProductCard';
import './FeaturedSlider.css';

// Import các file CSS cần thiết của Swiper
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/scrollbar';

const FeaturedSlider = ({ title, products, backgroundImage }) => {
    const sectionStyle = backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : {};

    return (
        <section className="featured-section" style={sectionStyle}>
            {title && <h2>{title}</h2>}
            <Swiper
                className="featured-slider"
                modules={[Navigation, Scrollbar]} // Thêm module Scrollbar
                spaceBetween={20}
                slidesPerView={4} // Chỉ hiển thị 4 sản phẩm
                navigation={true}
                scrollbar={{ draggable: true }} // Cho phép kéo thanh scrollbar
            >
                {products.map(product => (
                    <SwiperSlide key={product._id}>
                        <ProductCard product={product} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
};

export default FeaturedSlider;