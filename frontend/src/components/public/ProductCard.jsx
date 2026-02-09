import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import './ProductCard.css';
import { API_URL } from '../../config/api';

const ProductCard = ({ product }) => {
    const [isWishlisted, setIsWishlisted] = useState(false);
    const userToken = localStorage.getItem('userToken');

    useEffect(() => {
        // Kiểm tra xem sản phẩm có trong wishlist không (nếu đã login)
        const checkWishlist = async () => {
            if (!userToken) return;
            try {
                const res = await axios.get(`${API_URL}/api/v1/users/wishlist`, {
                    headers: { Authorization: `Bearer ${userToken}` }
                });
                const isInWishlist = res.data.data.wishlist.some(item => item._id === product._id);
                setIsWishlisted(isInWishlist);
            } catch (err) {
                console.error("Lỗi check wishlist:", err);
            }
        };
        checkWishlist();
    }, [product._id, userToken]);

    const toggleWishlist = async (e) => {
        e.preventDefault(); // Ngăn chặn chuyển trang khi bấm vào tim
        if (!userToken) {
            alert("Vui lòng đăng nhập để lưu sản phẩm!");
            return;
        }

        try {
            const apiConfig = { headers: { Authorization: `Bearer ${userToken}` } };
            if (isWishlisted) {
                await axios.delete(`${API_URL}/api/v1/users/wishlist`, {
                    ...apiConfig,
                    data: { productId: product._id }
                });
                setIsWishlisted(false);
            } else {
                await axios.post(`${API_URL}/api/v1/users/wishlist`, { productId: product._id }, apiConfig);
                setIsWishlisted(true);
            }
        } catch (err) {
            console.error("Lỗi toggle wishlist:", err);
        }
    };

    return (
        <div className="product-card">
            <Link to={`/products/${product._id}`}>
                <div className="product-image-container">
                    <img src={`${API_URL}${product.mainImage}`} alt={product.name} />
                    <button className="wishlist-toggle" onClick={toggleWishlist}>
                        {isWishlisted ? <FaHeart className="heart-icon active" /> : <FaRegHeart className="heart-icon" />}
                    </button>
                </div>
                <div className="product-info">
                    <p className="product-name">{product.name}</p>
                    <p className="product-price">{product.sellPrice.toLocaleString('vi-VN')} VND</p>
                </div>
            </Link>
        </div>
    );
};

export default ProductCard;