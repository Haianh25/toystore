import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUser, FaShoppingCart, FaChevronDown, FaSearch } from 'react-icons/fa';
import './Header.css';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Header = () => {
    const { userToken, userLogout } = useAuth();
    const { cartCount } = useCart();
    const navigate = useNavigate();

    const [collections, setCollections] = useState([]);
    const [isProductMenuOpen, setIsProductMenuOpen] = useState(false);

    useEffect(() => {
        axios.get('http://localhost:5000/api/v1/collections')
            .then(res => setCollections(res.data.data.collections || []))
            .catch(err => console.error("Lỗi khi tải collections:", err));
    }, []);

    const handleLogout = () => {
        userLogout();
        navigate('/');
    };

    return (
        <header className="main-header">
            <div className="header-container">
                <div className="top-bar">
                    <div className="header-left">
                        <div className="search-minimal">
                            <FaSearch className="search-icon" />
                            <input type="text" placeholder="SEARCH" />
                        </div>
                    </div>

                    <Link to="/" className="hero-logo">
                        <span className="brand-name">DIOR</span>
                    </Link>

                    <div className="header-icons">
                        {userToken ? (
                            <>
                                <Link to="/my-account" className="icon-link"><FaUser /></Link>
                                <button onClick={handleLogout} className="logout-text-btn">LOGOUT</button>
                            </>
                        ) : (
                            <Link to="/login" className="icon-link"><FaUser /></Link>
                        )}
                        <Link to="/cart" className="icon-link cart-trigger">
                            <FaShoppingCart />
                            {cartCount > 0 && <span className="cart-dot">{cartCount}</span>}
                        </Link>
                    </div>
                </div>
            </div>
            <nav className="minimal-nav">
                <ul className="nav-links">
                    <li><Link to="/category/hang-moi?sort=-createdAt">NEW ARRIVALS</Link></li>
                    <li className="with-dropdown"
                        onMouseEnter={() => setIsProductMenuOpen(true)}
                        onMouseLeave={() => setIsProductMenuOpen(false)}>
                        <Link to="/products">COLLECTIONS <FaChevronDown size={8} /></Link>
                        {isProductMenuOpen && (
                            <div className="luxury-dropdown">
                                {collections.map(col => (
                                    <Link key={col._id} to={`/collection/${col.slug}`} className="drop-item">
                                        {col.name.toUpperCase()}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </li>
                    <li><Link to="/brands">BRANDS</Link></li>
                    <li><Link to="/about">MAISON</Link></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;