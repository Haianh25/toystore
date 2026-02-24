import React from 'react';
import './AboutPage.css'; // Borrowing AboutPage styles for consistency

const ContactPage = () => {
    return (
        <div className="about-page-container fade-in">
            <header className="about-header">
                <h1 className="tdp-serif">CONTACT US</h1>
                <p className="tdp-sans subtitle">WE ARE HERE TO ASSIST YOU</p>
            </header>

            <div className="about-content">
                <section className="about-section">
                    <h2 className="tdp-serif text-center">GET IN TOUCH</h2>
                    <div className="contact-details" style={{ textAlign: 'center', marginTop: '40px' }}>
                        <p className="tdp-sans">Email: hello@thedevilplayz.com</p>
                        <p className="tdp-sans">Phone: +84 (0) 123 456 789</p>
                        <p className="tdp-sans">Address: Hanoi, Vietnam</p>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default ContactPage;
