import React from 'react';
import './AboutPage.css'; // Borrowing AboutPage styles for consistency

const ShippingPage = () => {
    return (
        <div className="about-page-container fade-in">
            <header className="about-header">
                <h1 className="tdp-serif">SHIPPING & RETURNS</h1>
                <p className="tdp-sans subtitle">OUR COMMITMENT TO EXCELLENCE</p>
            </header>

            <div className="about-content">
                <section className="about-section">
                    <h2 className="tdp-serif">WORLDWIDE DELIVERY</h2>
                    <p className="tdp-sans">
                        We offer premium shipping services to over 50 countries. Every order is handled with the utmost care and packaged in our signature luxury boxes.
                    </p>
                </section>

                <section className="about-section">
                    <h2 className="tdp-serif">RETURN POLICY</h2>
                    <p className="tdp-sans">
                        If you are not entirely satisfied with your purchase, we offer a complimentary 30-day return window for all items in their original condition.
                    </p>
                </section>
            </div>
        </div>
    );
};

export default ShippingPage;
