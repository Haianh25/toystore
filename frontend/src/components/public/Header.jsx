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
    const [collections, setCollections] = useState([]);
    const [isSaleMenuOpen, setIsSaleMenuOpen] = useState(false);
    const [isProductMenuOpen, setIsProductMenuOpen] = useState(false);

    useEffect(() => {
        axios.get('http://localhost:5000/api/v1/flash-sales/active').then(res => setActiveSales(res.data.data.flashSales || [])).catch(err => console.error("Lỗi khi tải active sales:", err));
        axios.get('http://localhost:5000/api/v1/collections').then(res => setCollections(res.data.data.collections || [])).catch(err => console.error("Lỗi khi tải collections:", err));
    }, []);

    const handleLogout = () => {
        userLogout();
        navigate('/');
    };

    const numberOfColumns = 4;
    const itemsPerColumn = Math.ceil(collections.length / numberOfColumns);
    const collectionColumns = Array.from({ length: numberOfColumns }, (_, i) => {
        const start = i * itemsPerColumn;
        const end = start + itemsPerColumn;
        return collections.slice(start, end);
    });

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
                            
                            {/* === THAY ĐỔI Ở ĐÂY: Bỏ Link, dùng thẻ a và ngăn click === */}
                            <a href="#" onClick={(e) => e.preventDefault()} className="nav-link-with-arrow" style={{cursor: 'default'}}>
                                SALE <FaChevronDown size={12} />
                            </a>

                            {isSaleMenuOpen && activeSales.length > 0 && (
                                <div className="dropdown-menu">
                                    {activeSales.map(sale => (
                                        <Link key={sale._id} to={`/sale/${sale._id}`} className="dropdown-item">{sale.title}</Link>
                                    ))}
                                </div>
                            )}
                        </li>
                        <li><Link to="/category/lego">LEGO</Link></li>
                        <li><Link to="/category/hang-moi?sort=-createdAt">HÀNG MỚI</Link></li>
                        <li><Link to="/brands">THƯƠNG HIỆU</Link></li>
                        
                        <li className="nav-item-dropdown" onMouseEnter={() => setIsProductMenuOpen(true)} onMouseLeave={() => setIsProductMenuOpen(false)}>
                            <Link to="/products" className="nav-link-with-arrow">SẢN PHẨM <FaChevronDown size={12} /></Link>
                            {isProductMenuOpen && collections.length > 0 && (
                                <div className="mega-menu">
                                    {collectionColumns.map((column, index) => (
                                        <div key={index} className="mega-menu-column">
                                            <ul>
                                                {column.map(collection => (
                                                    <li key={collection._id}>
                                                        <Link to={`/collection/${collection.slug}`}>{collection.name}</Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </li>
                        
                        <li><Link to="/about">Giới thiệu</Link></li>
                    </ul>
                </div>
            </nav>
        </header>
    );
};
export default Header;