import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../config/api';
import ProductGrid from '../../components/public/ProductGrid';
import './WishlistPage.css';

const WishlistPage = () => {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const apiConfig = {
        headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` }
    };

    const fetchWishlist = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_URL}/api/v1/users/wishlist`, apiConfig);
            setWishlist(res.data.data.wishlist);
            document.title = "Sản phẩm yêu thích | TheDevilPlayz";
        } catch (err) {
            console.error("Lỗi tải wishlist:", err);
            setError("Không thể tải danh sách yêu thích. Vui lòng thử lại sau.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWishlist();
    }, []);

    if (loading) return (
        <div className="luxury-loader">
            <span className="loader-text">TheDevilPlayz</span>
        </div>
    );

    return (
        <div className="wishlist-page-container">
            <div className="wishlist-header">
                <h6 className="tdp-dash-title">Your Private Collection</h6>
                <h1 className="tdp-serif">SẢN PHẨM YÊU THÍCH</h1>
            </div>

            {error && <p className="wishlist-error">{error}</p>}

            {wishlist.length === 0 ? (
                <div className="empty-wishlist">
                    <p>Danh sách yêu thích của bạn đang trống.</p>
                    <a href="/products" className="tdp-button-outline">KHÁM PHÁ SẢN PHẨM</a>
                </div>
            ) : (
                <ProductGrid products={wishlist} />
            )}
        </div>
    );
};

export default WishlistPage;
