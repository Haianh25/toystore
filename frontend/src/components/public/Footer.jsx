import React from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaYoutube, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { FiMapPin, FiPhone, FiMail, FiClock } from 'react-icons/fi';

import legoLogo from '../../assets/lego-logo.png'; // Import logo

const Footer = () => {
    return (
        <footer className="main-footer">
            <div className="footer-container">
                {/* Cột 1: Logo & Mạng xã hội */}
                <div className="footer-column">
                    {/* Placeholder cho logo của bạn */}
                    <div style={{ fontSize: '2.5rem', marginBottom: '20px' }}>LOGO</div>
                    <div className="social-icons">
                        <a href="#"><FaTwitter /></a>
                        <a href="#"><FaInstagram /></a>
                        <a href="#"><FaYoutube /></a>
                        <a href="#"><FaLinkedin /></a>
                    </div>
                </div>

                {/* Cột 2: Thông tin liên hệ */}
                <div className="footer-column">
                    <h4>Thông tin liên hệ</h4>
                    <ul className="contact-info">
                        <li><FiMapPin className="icon" /> <span>Tầng 8, 18 Tôn Thất Thuyết, Hà Nội</span></li>
                        <li><FiPhone className="icon" /> <span>0862748220</span></li>
                        <li><FiMail className="icon" /> <span>lehaianh25022003@gmail.com</span></li>
                        <li><FiClock className="icon" /> <span>Thứ 2 - Thứ 7 • 8h - 17h</span></li>
                    </ul>
                </div>

                {/* Cột 3: Điều khoản & Chính sách */}
                <div className="footer-column">
                    <h4>Điều khoản & Chính sách</h4>
                    <ul>
                        <li><Link to="/about">Giới thiệu</Link></li>
                        <li><Link to="/policy/return">Chính sách đổi trả</Link></li>
                        <li><Link to="/policy/privacy">Chính sách bảo mật</Link></li>
                        <li><Link to="/terms">Điều khoản dịch vụ</Link></li>
                        <li><Link to="/policy/payment">Chính sách thanh toán</Link></li>
                        <li><Link to="/policy/shipping">Chính sách vận chuyển</Link></li>
                    </ul>
                </div>

                {/* Cột 4: Logo LEGO */}
                <div className="footer-column footer-logo-container">
                    <img src={legoLogo} alt="LEGO Logo" />
                </div>
            </div>
        </footer>
    );
};

export default Footer;