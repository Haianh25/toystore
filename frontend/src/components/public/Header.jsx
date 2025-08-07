import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaShoppingCart } from 'react-icons/fa';


const Header = () => {
    // 1. Dùng state để theo dõi trạng thái đăng nhập
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('userToken'));
    const navigate = useNavigate();

    // 2. Lắng nghe sự thay đổi trong localStorage (để đồng bộ giữa các tab)
    useEffect(() => {
        const handleStorageChange = () => {
            setIsLoggedIn(!!localStorage.getItem('userToken'));
        };
        // Thêm event listener khi component được mount
        window.addEventListener('storage', handleStorageChange);
        // Dọn dẹp event listener khi component bị unmount
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    // 3. Hàm xử lý đăng xuất
    const handleLogout = () => {
        localStorage.removeItem('userToken');
        setIsLoggedIn(false);
        navigate('/'); // Chuyển về trang chủ sau khi đăng xuất
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
                        {/* 4. Hiển thị có điều kiện */}
                        {isLoggedIn ? (
                            <>
                                <Link to="/my-account" title="Tài khoản của tôi">
                                    <FaUser />
                                </Link>
                                {/* Nút đăng xuất sẽ được thêm vào sau */}
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