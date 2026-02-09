import React from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaYoutube, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { FiMapPin, FiPhone, FiMail, FiClock } from 'react-icons/fi';

import legoLogo from '../../assets/lego-logo.png'; // Import logo

const Footer = () => {
    return (
        <footer className="main-footer luxury-footer">
            <div className="footer-top">
                <div className="footer-container">
                    {/* Column 1: Brand & Philosophy */}
                    <div className="footer-column brand-col">
                        <div className="footer-brand">TheDevilPlayz</div>
                        <p className="footer-philosophy">
                            Cultivating imagination through the art of play. Our curated collections represent the pinnacle of craftsmanship.
                        </p>
                        <div className="social-minimal">
                            <a href="#"><FaTwitter /></a>
                            <a href="#"><FaInstagram /></a>
                            <a href="#"><FaYoutube /></a>
                            <a href="#"><FaLinkedin /></a>
                        </div>
                    </div>

                    {/* Column 2: Customer Care */}
                    <div className="footer-column">
                        <h4 className="footer-heading">MAISON SERVICES</h4>
                        <ul className="footer-links">
                            <li><Link to="/about">About Us</Link></li>
                            <li><Link to="/contact">Contact</Link></li>
                            <li><Link to="/faq">FAQs</Link></li>
                            <li><Link to="/shipping">Shipping & Returns</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Legal & Ethics */}
                    <div className="footer-column">
                        <h4 className="footer-heading">THE LEGALITY</h4>
                        <ul className="footer-links">
                            <li><Link to="/policy/privacy">Privacy Policy</Link></li>
                            <li><Link to="/terms">Terms of Service</Link></li>
                            <li><Link to="/policy/cookies">Cookie Policy</Link></li>
                        </ul>
                    </div>

                    {/* Column 4: Newsletter Reveal */}
                    <div className="footer-column newsletter-col">
                        <h4 className="footer-heading">THE DIARY</h4>
                        <p className="newsletter-desc">Subscribe to receive our latest curated collections.</p>
                        <div className="minimal-input-group">
                            <input type="email" placeholder="EMAIL ADDRESS" />
                            <button className="input-submit">OK</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Subtle Brand Partners Row */}
            <div className="footer-bottom">
                <div className="footer-container">
                    <div className="partner-credits">
                        <span className="partner-label">AUTHORIZED PARTNER</span>
                        <img src={legoLogo} alt="LEGO" className="partner-logo-mini" />
                    </div>
                    <div className="copyright-minimal">
                        © 2026 THEDEVILPLAYZ. ALL RIGHTS RESERVED.
                    </div>
                </div>
            </div>
        </footer>
    );
};


export default Footer;