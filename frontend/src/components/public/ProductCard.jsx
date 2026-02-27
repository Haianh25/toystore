import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useToast } from '../../context/ToastContext';
import QuickViewModal from './QuickViewModal';
import './ProductCard.css';
import { API_URL } from '../../config/api';

const ProductCard = ({ product, salePrice }) => {
    if (!product) return null;
    const { showToast } = useToast();
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
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

    const handleImageError = (e) => {
        e.target.src = 'https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?auto=format&fit=crop&q=80&w=1000';
    };

    const toggleWishlist = async (e) => {
        e.preventDefault(); // Ngăn chặn chuyển trang khi bấm vào tim
        if (!userToken) {
            showToast("Vui lòng đăng nhập để lưu sản phẩm!", "error");
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
                    <img
                        src={product.mainImage?.startsWith('http') ? product.mainImage : `${API_URL}${product.mainImage}`}
                        alt={product.name}
                        onError={handleImageError}
                    />
                    <div className="product-overlay-actions">
                        <button
                            className="quick-view-btn"
                            aria-label="Xem nhanh"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setIsQuickViewOpen(true);
                            }}
                        >
                            QUICK VIEW
                        </button>
                    </div>
                    <button
                        className="wishlist-toggle"
                        onClick={toggleWishlist}
                        aria-label={isWishlisted ? "Xóa khỏi danh sách yêu thích" : "Thêm vào danh sách yêu thích"}
                    >
                        {isWishlisted ? <FaHeart className="heart-icon active" /> : <FaRegHeart className="heart-icon" />}
                    </button>
                    {salePrice && (
                        <div className="sale-mini-badge">SALE</div>
                    )}
                </div>
                <div className="product-info">
                    <p className="product-name">{product?.name}</p>
                    {salePrice ? (
                        <div className="price-container">
                            <span className="current-price">{(salePrice || 0).toLocaleString('vi-VN')} VND</span>
                            <span className="original-price-strike">{(product?.sellPrice || 0).toLocaleString('vi-VN')} VND</span>
                        </div>
                    ) : (
                        <p className="product-price">{(product?.sellPrice || 0).toLocaleString('vi-VN')} VND</p>
                    )}
                </div>
            </Link>

            <QuickViewModal
                product={product}
                isOpen={isQuickViewOpen}
                onClose={() => setIsQuickViewOpen(false)}
            />
        </div>
    );
};

export default ProductCard;