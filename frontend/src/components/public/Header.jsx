import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUser, FaShoppingCart, FaChevronDown, FaSearch, FaRegHeart } from 'react-icons/fa';
import './Header.css';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { API_URL } from '../../config/api';

const Header = () => {
    const { userToken, userLogout } = useAuth();
    const { cartCount } = useCart();
    const navigate = useNavigate();

    const [collections, setCollections] = useState([]);
    const [isProductMenuOpen, setIsProductMenuOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);

    useEffect(() => {
        axios.get(`${API_URL}/api/v1/collections`)
            .then(res => setCollections(res.data.data.collections || []))
            .catch(err => console.error("Lỗi khi tải collections:", err));
    }, []);

    // --- LIVE SEARCH LOGIC ---
    useEffect(() => {
        if (!searchTerm.trim()) {
            setSearchResults([]);
            setShowResults(false);
            return;
        }

        const timer = setTimeout(async () => {
            setIsSearching(true);
            try {
                const res = await axios.get(`${API_URL}/api/v1/products?search=${searchTerm}&limit=5`);
                setSearchResults(res.data.data.products || []);
                setShowResults(true);
            } catch (err) {
                console.error("Live search error:", err);
            } finally {
                setIsSearching(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Click away to close search results
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('.search-minimal')) {
                setShowResults(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const handleLogout = () => {
        userLogout();
        navigate('/');
    };

    const handleSearch = (e) => {
        if (e.key === 'Enter' || e.type === 'click') {
            if (searchTerm.trim()) {
                navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
                setShowResults(false);
            }
        }
    };

    const handleResultClick = (productId) => {
        navigate(`/products/${productId}`);
        setShowResults(false);
        setSearchTerm('');
    };

    return (
        <header className="main-header">
            <div className="header-container">
                <div className="top-bar">
                    <div className="header-left">
                        <div className="search-minimal">
                            <FaSearch
                                className="search-icon"
                                onClick={handleSearch}
                                style={{ cursor: 'pointer' }}
                            />
                            <div className="search-input-wrapper">
                                <input
                                    type="text"
                                    placeholder="SEARCH"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyDown={handleSearch}
                                    onFocus={() => searchTerm.trim() && setShowResults(true)}
                                />
                                {showResults && (searchTerm.trim() || searchResults.length > 0) && (
                                    <div className="search-results-dropdown">
                                        {isSearching ? (
                                            <div className="search-status">Searching...</div>
                                        ) : searchResults.length > 0 ? (
                                            <>
                                                {searchResults.map(product => (
                                                    <div
                                                        key={product._id}
                                                        className="search-result-item"
                                                        onClick={() => handleResultClick(product._id)}
                                                    >
                                                        <img src={`${API_URL}${product.mainImage}`} alt={product.name} />
                                                        <div className="result-info">
                                                            <p className="result-name">{product.name}</p>
                                                            <p className="result-price">{product.sellPrice.toLocaleString('vi-VN')} VND</p>
                                                        </div>
                                                    </div>
                                                ))}
                                                <div className="view-all-results" onClick={handleSearch}>
                                                    VIEW ALL RESULTS
                                                </div>
                                            </>
                                        ) : (
                                            <div className="search-status">No products found</div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <Link to="/" className="hero-logo">
                        <span className="brand-name">TheDevilPlayz</span>
                    </Link>

                    <div className="header-icons">
                        <Link to="/wishlist" className="icon-link"><FaRegHeart /></Link>
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
                    <li><Link to="/about">THE BRAND</Link></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;