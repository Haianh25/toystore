import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { API_URL } from '../../config/api';
import ProductCard from './ProductCard';
import './FlashSaleSection.css';
import 'swiper/css';
import 'swiper/css/navigation';

const FlashSaleSection = () => {
    const [flashSale, setFlashSale] = useState(null);
    const [timeLeft, setTimeLeft] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchActiveSale = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/v1/flash-sales/active`);
                if (res.data.data.flashSales && res.data.data.flashSales.length > 0) {
                    setFlashSale(res.data.data.flashSales[0]);
                }
            } catch (error) {
                console.error("Error fetching active flash sale:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchActiveSale();
    }, []);

    useEffect(() => {
        if (!flashSale) return;

        const timer = setInterval(() => {
            const now = new Date().getTime();
            const end = new Date(flashSale.endTime).getTime();
            const distance = end - now;

            if (distance < 0) {
                clearInterval(timer);
                setTimeLeft({ expired: true });
            } else {
                setTimeLeft({
                    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((distance % (1000 * 60)) / 1000),
                });
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [flashSale]);

    if (loading || !flashSale || timeLeft.expired) return null;

    return (
        <section className="flash-sale-section" id="flash-sale">
            <div className="flash-sale-container">
                <div className="flash-sale-header">
                    <div className="header-left">
                        <div className="flash-badge">
                            <span className="bolt">⚡</span>
                            <span className="badge-text">FLASH SALE</span>
                        </div>
                        <h2 className="sale-title">{flashSale.title}</h2>
                    </div>

                    <div className="countdown-timer">
                        <span className="timer-label">Ends In:</span>
                        <div className="timer-slots">
                            <div className="timer-slot">
                                <span className="number">{String(timeLeft.hours || 0).padStart(2, '0')}</span>
                                <span className="label">HRS</span>
                            </div>
                            <span className="separator">:</span>
                            <div className="timer-slot">
                                <span className="number">{String(timeLeft.minutes || 0).padStart(2, '0')}</span>
                                <span className="label">MIN</span>
                            </div>
                            <span className="separator">:</span>
                            <div className="timer-slot">
                                <span className="number">{String(timeLeft.seconds || 0).padStart(2, '0')}</span>
                                <span className="label">SEC</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flash-sale-products">
                    <Swiper
                        modules={[Navigation, Autoplay]}
                        spaceBetween={20}
                        slidesPerView={1}
                        navigation
                        autoplay={{ delay: 5000, disableOnInteraction: false }}
                        breakpoints={{
                            640: { slidesPerView: 2 },
                            1024: { slidesPerView: 3 },
                            1440: { slidesPerView: 4 }
                        }}
                        className="flash-sale-swiper"
                    >
                        {flashSale.products.map((item) => (
                            <SwiperSlide key={item._id}>
                                <div className="flash-product-wrapper">
                                    <ProductCard product={item.product} salePrice={item.flashSalePrice} />
                                    <div className="flash-stock-info">
                                        <div className="flash-stock-bar">
                                            <div
                                                className="stock-progress"
                                                style={{ width: `${Math.min((item.flashSaleStock / 50) * 100, 100)}%` }}
                                            ></div>
                                        </div>
                                        <span className="stock-text">Only {item.flashSaleStock} left</span>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </section>
    );
};

export default FlashSaleSection;
