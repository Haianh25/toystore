import React from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import ProductCard from './ProductCard';

import 'swiper/css';
import 'swiper/css/navigation';
import './PromoSection.css'; // Sẽ tạo file này ngay sau đây

const PromoSection = ({ section }) => {
    const { title, content } = section;
    const { bannerImage, link, products } = content;
    const serverUrl = 'http://localhost:5000';

    return (
        <section className="promo-section">
            <div className="promo-header">
                <h2>{title}</h2>
                {link && <Link to={link} className="see-more-btn">Xem Thêm ▸</Link>}
            </div>
            <div className="promo-content">
                <div className="promo-banner">
                    <Link to={link || '#'}>
                        <img src={`${serverUrl}${bannerImage}`} alt={title} />
                    </Link>
                </div>
                <div className="promo-products">
                    <Swiper
                        modules={[Navigation]}
                        spaceBetween={15}
                        slidesPerView={3}
                        navigation
                        className="promo-product-slider"
                    >
                        {products.map(product => (
                            <SwiperSlide key={product._id}>
                                <ProductCard product={product} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </section>
    );
};

export default PromoSection;