import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaShoppingCart } from 'react-icons/fa';
import './Header.css';
import { useAuth } from '../../context/AuthContext'; // Import useAuth

const Header = () => {
    // Lấy trạng thái và hàm từ context
    const { userToken, userLogout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        userLogout(); // Dùng hàm từ context
        navigate('/');
    };

    return (
        <header className="main-header">
            <div className="header-container">
                <div className="top-bar">
                    <Link to="/" className="logo">
                        THE DEVIL PLAYZ
                    </Link>
                    <div className="search-bar">
                        <input type="text" placeholder="Tìm kiếm sản phẩm..." />
                    </div>
                    <div className="user-actions">
                        {/* Hiển thị dựa trên userToken từ context */}
                        {userToken ? (
                            <>
                                <Link to="/my-account" title="Tài khoản của tôi">
                                    <FaUser />
                                </Link>
                                <button onClick={handleLogout} title="Đăng xuất" style={{border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.2rem', color: '#333'}}>
                                    Đăng xuất
                                </button>
                            </>
                        ) : (
                            <Link to="/login" title="Đăng nhập">
                                <FaUser />
                            </Link>
                        )}
                        <Link to="/cart" title="Giỏ hàng">
                            <FaShoppingCart />
                        </Link>
                    </div>
                </div>
            </div>

            <nav className="nav-bar">
                <div className="header-container">
                    <ul className="nav-list">
                        <li><Link to="/sale">SALE</Link></li>
                        <li><Link to="/lego">LEGO</Link></li>
                        <li><Link to="/new-products">HÀNG MỚI</Link></li>
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