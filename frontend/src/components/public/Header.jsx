import React from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaUser, FaShoppingCart } from 'react-icons/fa';


const Header = () => {
    return (
        <header className="main-header">
            <div className="header-container">
                {/* Thanh trên cùng */}
                <div className="top-bar">
                    <Link to="/" className="logo">
                        {/* Bạn sẽ tự thêm logo ở đây */}
                        THE DEVIL PLAYZ
                    </Link>
                    <div className="search-bar">
                        <input type="text" placeholder="Tìm kiếm sản phẩm..." />
                        {/* Icon search có thể thêm vào sau */}
                    </div>
                    <div className="user-actions">
                        <Link to="/login">
                            <FaUser />
                        </Link>
                        <Link to="/cart">
                            <FaShoppingCart />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Thanh menu */}
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