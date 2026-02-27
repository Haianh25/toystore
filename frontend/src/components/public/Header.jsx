import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUser, FaShoppingCart, FaChevronDown, FaSearch, FaRegHeart, FaBell } from 'react-icons/fa';
import './Header.css';
import { useAuth } from '../../context/AuthContext';
import { getImageUrl } from '../../utils/imageUtils';
import { useCart } from '../../context/CartContext';
import { useSocket } from '../../context/SocketContext';
import { useToast } from '../../context/ToastContext';
import { API_URL } from '../../config/api';

const Header = () => {
    const { userToken, userLogout } = useAuth();
    const { cartCount } = useCart();
    const { socket } = useSocket();
    const { showToast } = useToast();
    const navigate = useNavigate();

    const [collections, setCollections] = useState([]);
    const [isProductMenuOpen, setIsProductMenuOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);

    useEffect(() => {
        axios.get(`${API_URL}/api/v1/collections`)
            .then(res => setCollections(res.data.data.collections || []))
            .catch(err => console.error("Lỗi khi tải collections:", err));
    }, []);

    // Live Search
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

    // Socket Notifications
    useEffect(() => {
        if (!socket) return;

        const handleNewNotification = (data) => {
            console.log("New real-time notification:", data);
            setNotifications(prev => [{
                id: Date.now(),
                title: data.title || 'Thông báo mới',
                body: data.message || data.body || '',
                url: data.url || '/',
                time: new Date(),
                read: false
            }, ...prev]);

            // Also show toast
            showToast(data.message || data.body || 'Bạn có thông báo mới!', 'success');
        };

        socket.on('lowStockAlert', (data) => {
            // For admins, show low stock alert in notifications
            handleNewNotification({
                title: 'Cảnh báo kho',
                message: data.message,
                url: '/admin/dashboard'
            });
        });

        socket.on('newFlashSale', (data) => {
            handleNewNotification({
                title: 'FLASH SALE MỚI!',
                message: `Chương trình "${data.title}" đã bắt đầu!`,
                url: '/flash-sale'
            });
        });

        return () => {
            socket.off('lowStockAlert');
            socket.off('newFlashSale');
        };
    }, [socket, showToast]);

    // Click away to close dropdowns
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('.search-minimal')) {
                setShowResults(false);
            }
            if (!e.target.closest('.notification-wrapper')) {
                setIsNotificationOpen(false);
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
                                    placeholder="LOOKING FOR SOMETHING SPECIAL?"
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
                                                {searchResults.map(product => {
                                                    const setMatch = product.name.match(/\[Set (.*?)-1\]/);
                                                    const setNum = setMatch ? setMatch[1] : '';
                                                    return (
                                                        <div
                                                            key={product._id}
                                                            className="search-result-item"
                                                            onClick={() => handleResultClick(product._id)}
                                                        >
                                                            <div className="result-img-wrapper">
                                                                <img src={getImageUrl(product.mainImage)} alt={product.name} />
                                                            </div>
                                                            <div className="result-info">
                                                                {setNum && <span className="result-sku">SET {setNum}</span>}
                                                                <p className="result-name">{product.name.split('[')[0].trim()}</p>
                                                                <p className="result-price">{product.sellPrice.toLocaleString('vi-VN')} VND</p>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
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

                    <Link to="/" className="hero-logo" aria-label="Trang chủ">
                        <span className="brand-name">TheDevilPlayz</span>
                    </Link>

                    <div className="header-icons">
                        {/* Notification Bell */}
                        <div className="notification-wrapper" style={{ position: 'relative' }}>
                            <div className="icon-link" onClick={() => setIsNotificationOpen(!isNotificationOpen)} style={{ cursor: 'pointer' }}>
                                <FaBell />
                                {notifications.filter(n => !n.read).length > 0 && (
                                    <span className="cart-dot" style={{ backgroundColor: '#e74c3c' }}>
                                        {notifications.filter(n => !n.read).length}
                                    </span>
                                )}
                            </div>

                            {isNotificationOpen && (
                                <div className="notification-dropdown">
                                    <div className="notification-header">
                                        <h3>Thông báo</h3>
                                        {notifications.length > 0 && (
                                            <button onClick={() => setNotifications([])}>Xoá hết</button>
                                        )}
                                    </div>
                                    <div className="notification-list">
                                        {notifications.length > 0 ? (
                                            notifications.map(n => (
                                                <div
                                                    key={n.id}
                                                    className={`notification-item ${!n.read ? 'unread' : ''}`}
                                                    onClick={() => {
                                                        navigate(n.url);
                                                        setIsNotificationOpen(false);
                                                        setNotifications(prev => prev.map(notif =>
                                                            notif.id === n.id ? { ...notif, read: true } : notif
                                                        ));
                                                    }}
                                                >
                                                    <p className="notif-title">{n.title}</p>
                                                    <p className="notif-body">{n.body}</p>
                                                    <span className="notif-time">{new Intl.DateTimeFormat('vi-VN', { timeStyle: 'short' }).format(n.time)}</span>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="notif-empty">Không có thông báo mới</div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <Link to="/wishlist" className="icon-link" aria-label="Danh sách yêu thích"><FaRegHeart /></Link>
                        {userToken ? (
                            <>
                                <Link to="/my-account" className="icon-link" aria-label="Tài khoản"><FaUser /></Link>
                                <button onClick={handleLogout} className="logout-text-btn">LOGOUT</button>
                            </>
                        ) : (
                            <Link to="/login" className="icon-link" aria-label="Đăng nhập"><FaUser /></Link>
                        )}
                        <Link to="/cart" className="icon-link cart-trigger" aria-label="Giỏ hàng">
                            <FaShoppingCart />
                            {cartCount > 0 && <span className="cart-dot">{cartCount}</span>}
                        </Link>
                    </div>
                </div>
            </div>
            <nav className="minimal-nav">
                <ul className="nav-links">
                    <li><Link to="/products?sort=-createdAt">NEW ARRIVALS</Link></li>
                    <li>
                        <Link to="/flash-sale" className="flash-sale-link">
                            <span className="bolt-icon">⚡</span> FLASH SALE
                        </Link>
                    </li>
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