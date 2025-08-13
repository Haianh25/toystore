import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUser, FaShoppingCart, FaChevronDown } from 'react-icons/fa';
import './Header.css';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
    const { userToken, userLogout } = useAuth();
    const navigate = useNavigate();
    
    const [activeSales, setActiveSales] = useState([]);
    const [isSaleMenuOpen, setIsSaleMenuOpen] = useState(false);

    useEffect(() => {
        const fetchActiveSales = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/v1/flash-sales/active');
                setActiveSales(res.data.data.flashSales);
            } catch (error) {
                console.error("Lỗi khi tải active sales:", error);
            }
        };
        fetchActiveSales();
    }, []);

    const handleLogout = () => {
        userLogout();
        navigate('/');
    };

    return (
        <header className="main-header">
            <div className="header-container">
                <div className="top-bar">
                    <Link to="/" className="logo">THE DEVIL PLAYZ</Link>
                    <div className="search-bar">
                        <input type="text" placeholder="Tìm kiếm sản phẩm..." />
                    </div>
                    <div className="user-actions">
                        {userToken ? (
                            <>
                                <Link to="/my-account" title="Tài khoản của tôi"><FaUser /></Link>
                                <button onClick={handleLogout} title="Đăng xuất" className="logout-btn">Đăng xuất</button>
                            </>
                        ) : (
                            <Link to="/login" title="Đăng nhập"><FaUser /></Link>
                        )}
                        <Link to="/cart" title="Giỏ hàng"><FaShoppingCart /></Link>
                    </div>
                </div>
            </div>
            <nav className="nav-bar">
                <div className="header-container">
                    <ul className="nav-list">
                        <li className="nav-item-dropdown" onMouseEnter={() => setIsSaleMenuOpen(true)} onMouseLeave={() => setIsSaleMenuOpen(false)}>
                            <Link to="/sale" className="nav-link-with-arrow">SALE <FaChevronDown size={12} /></Link>
                            {isSaleMenuOpen && activeSales.length > 0 && (
                                <div className="dropdown-menu">
                                    {activeSales.map(sale => (
                                        <Link key={sale._id} to={`/sale/${sale._id}`} className="dropdown-item">{sale.title}</Link>
                                    ))}
                                </div>
                            )}
                        </li>
                        
                        {/* === SỬA LỖI Ở ĐÂY === */}
                        {/* Đổi "/collection/lego" thành "/category/lego" */}
                        <li><Link to="/category/lego">LEGO</Link></li>
                        
                        <li><Link to="/category/hang-moi">HÀNG MỚI</Link></li>
                        <li><Link to="/brands">THƯƠNG HIỆU</Link></li>
                        <li><Link to="/products">SẢN PHẨM</Link></li>
                        <li><Link to="/about">GIỚI THIỆU</Link></li>
                    </ul>
                </div>
            </nav>
        </header>
    );
};
export default Header;