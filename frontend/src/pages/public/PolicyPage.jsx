import React from 'react';
import { useLocation } from 'react-router-dom';
import './AboutPage.css';

const PolicyPage = () => {
    const location = useLocation();
    const path = location.pathname;

    let title = "LEGAL POLICY";
    let content = "Chúng tôi cam kết bảo vệ quyền lợi và sự riêng tư của khách hàng.";

    if (path.includes('privacy')) {
        title = "PRIVACY POLICY";
        content = "Chính sách bảo mật của chúng tôi đảm bảo dữ liệu của bạn được an toàn tuyệt đối.";
    } else if (path.includes('terms')) {
        title = "TERMS OF SERVICE";
        content = "Điều khoản dịch vụ quy định các quy tắc khi sử dụng hệ thống của chúng tôi.";
    } else if (path.includes('cookies')) {
        title = "COOKIE POLICY";
        content = "Chúng tôi sử dụng cookie để mang lại trải nghiệm tốt nhất trên website.";
    }

    return (
        <div className="about-page-container fade-in">
            <header className="about-header">
                <h1 className="tdp-serif">{title}</h1>
                <p className="tdp-sans subtitle">CHÍNH SÁCH VÀ ĐIỀU KHOẢN</p>
            </header>

            <div className="about-content">
                <section className="about-section">
                    <p className="tdp-sans" style={{ lineHeight: '2', fontSize: '1.1rem' }}>
                        {content} Đây là trang nội dung mẫu theo phong cách TheDevilPlayz.
                    </p>
                </section>
            </div>
        </div>
    );
};

export default PolicyPage;
