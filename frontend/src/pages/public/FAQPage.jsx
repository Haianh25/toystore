import React from 'react';
import './AboutPage.css';

const FAQPage = () => {
    const faqs = [
        { q: "Làm thế nào để tôi có thể đặt hàng?", a: "Bạn có thể chọn sản phẩm, thêm vào giỏ hàng và tiến hành thanh toán qua trang Checkout." },
        { q: "Thời gian giao hàng mất bao lâu?", a: "Thông thường từ 2-5 ngày làm việc tùy thuộc vào địa điểm của bạn." },
        { q: "Tôi có thể đổi trả sản phẩm không?", a: "Chúng tôi hỗ trợ đổi trả trong vòng 30 ngày kể từ khi nhận hàng nếu sản phẩm còn nguyên vẹn." }
    ];

    return (
        <div className="about-page-container fade-in">
            <header className="about-header">
                <h1 className="tdp-serif">FREQUENTLY ASKED QUESTIONS</h1>
                <p className="tdp-sans subtitle">CÂU HỎI THƯỜNG GẶP</p>
            </header>

            <div className="about-content">
                <section className="about-section">
                    {faqs.map((faq, index) => (
                        <div key={index} style={{ marginBottom: '30px', paddingBottom: '20px', borderBottom: '1px solid #eee' }}>
                            <h3 className="tdp-serif" style={{ fontSize: '1.2rem', marginBottom: '10px' }}>{faq.q}</h3>
                            <p className="tdp-sans" style={{ color: '#666' }}>{faq.a}</p>
                        </div>
                    ))}
                </section>
            </div>
        </div>
    );
};

export default FAQPage;
