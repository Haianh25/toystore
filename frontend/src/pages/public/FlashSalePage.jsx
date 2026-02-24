import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { API_URL } from '../../config/api';
import ProductCard from '../../components/public/ProductCard';
import './FlashSalePage.css';

const FlashSalePage = () => {
    const [flashSale, setFlashSale] = useState(null);
    const [loading, setLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState({});

    const calculateTimeLeft = (endTime) => {
        const now = new Date().getTime();
        const end = new Date(endTime).getTime();
        const distance = end - now;

        if (distance < 0) return { expired: true };

        return {
            hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((distance % (1000 * 60)) / 1000),
        };
    };

    useEffect(() => {
        const fetchFlashSale = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/v1/flash-sales/active`);
                if (res.data.data.flashSales && res.data.data.flashSales.length > 0) {
                    const sale = res.data.data.flashSales[0];
                    setFlashSale(sale);
                    setTimeLeft(calculateTimeLeft(sale.endTime));
                }
            } catch (error) {
                console.error("Error fetching flash sale:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchFlashSale();
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        if (!flashSale) return;

        const timer = setInterval(() => {
            const nextTime = calculateTimeLeft(flashSale.endTime);
            setTimeLeft(nextTime);
            if (nextTime.expired) clearInterval(timer);
        }, 1000);

        return () => clearInterval(timer);
    }, [flashSale]);

    if (loading) return (
        <div className="luxury-loader">
            <span className="loader-text">TheDevilPlayz</span>
        </div>
    );

    if (!flashSale || timeLeft.expired) {
        return (
            <div className="empty-sale-container">
                <div className="empty-content">
                    <h2 className="tdp-serif">NO ACTIVE FLASH SALES</h2>
                    <p>Experience precision and elegance in our upcoming events.</p>
                    <Link to="/products" className="btn-outline">EXPLORE COLLECTIONS</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="flash-sale-page">
            <header className="sale-page-header">
                <div className="header-overlay">
                    <div className="luxury-container">
                        <div className="header-content">
                            <span className="event-label">LIMITED TIME EVENT</span>
                            <h1 className="tdp-serif">{flashSale.title}</h1>

                            <div className="countdown-timer-large">
                                <span className="timer-title">ENDS IN:</span>
                                <div className="timer-units">
                                    <div className="unit">
                                        <span className="num">{String(timeLeft.hours || 0).padStart(2, '0')}</span>
                                        <span className="label">HRS</span>
                                    </div>
                                    <span className="colon">:</span>
                                    <div className="unit">
                                        <span className="num">{String(timeLeft.minutes || 0).padStart(2, '0')}</span>
                                        <span className="label">MIN</span>
                                    </div>
                                    <span className="colon">:</span>
                                    <div className="unit">
                                        <span className="num">{String(timeLeft.seconds || 0).padStart(2, '0')}</span>
                                        <span className="label">SEC</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="luxury-container">
                <div className="flash-products-grid">
                    {flashSale.products.filter(item => item.product).map((item) => (
                        <div key={item._id} className="flash-item-card">
                            <ProductCard product={item.product} salePrice={item.flashSalePrice} />
                            <div className="flash-extra-info">
                                <div className="stock-status">
                                    <div className="stock-bar-bg">
                                        <div
                                            className="stock-bar-fill"
                                            style={{ width: `${Math.min((item.flashSaleStock / 20) * 100, 100)}%` }}
                                        ></div>
                                    </div>
                                    <span className="stock-label">ONLY {item.flashSaleStock} REMAINING</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default FlashSalePage;
