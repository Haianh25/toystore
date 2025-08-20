import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../../context/CartContext'; // <-- 1. Import useCart
import './ProductDetailPage.css';

const ProductDetailPage = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [mainImageUrl, setMainImageUrl] = useState('');
    const serverUrl = 'http://localhost:5000';
    const { addToCart } = useCart(); // <-- 2. Lấy hàm addToCart từ context

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await axios.get(`http://localhost:5000/api/v1/products/${id}`);
                setProduct(data.data.product);
                // Sửa lại: Dùng detailImages nếu có, không thì dùng mainImage
                const images = [data.data.product.mainImage, ...(data.data.product.detailImages || [])];
                setMainImageUrl(`${serverUrl}${images[0]}`);
            } catch (error) {
                console.error("Lỗi khi tải sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleThumbnailClick = (imageUrl) => {
        setMainImageUrl(`${serverUrl}${imageUrl}`);
    };

    // 3. Hàm xử lý khi nhấn nút "Thêm vào giỏ"
    const handleAddToCart = () => {
        if (product && quantity > 0) {
            addToCart(product, quantity);
            alert(`Đã thêm ${quantity} sản phẩm "${product.name}" vào giỏ hàng!`);
        }
    };
    
    // Sửa lại logic render ảnh
    const allImages = product ? [product.mainImage, ...(product.detailImages || [])] : [];

    if (loading) return <p>Đang tải sản phẩm...</p>;
    if (!product) return <p>Không tìm thấy sản phẩm.</p>;
    
    return (
        <div className="product-detail-container">
            <div className="product-detail-layout">
                <div className="product-images">
                    <img src={mainImageUrl} alt={product.name} className="main-image" />
                    {allImages.length > 1 && (
                        <div className="thumbnail-gallery">
                            {allImages.map((imgUrl, index) => (
                                <img
                                    key={index}
                                    src={`${serverUrl}${imgUrl}`}
                                    alt={`${product.name} - thumbnail ${index + 1}`}
                                    className={`thumbnail ${`${serverUrl}${imgUrl}` === mainImageUrl ? 'active' : ''}`}
                                    onClick={() => handleThumbnailClick(imgUrl)}
                                />
                            ))}
                        </div>
                    )}
                </div>
                <div className="product-info-main">
                    <h1 className="product-title">{product.name}</h1>
                    {product.brand && <p className="product-brand">Thương hiệu: <Link to={`/products?brand=${product.brand._id}`}>{product.brand.name}</Link></p>}
                    <p className="product-price">{product.sellPrice.toLocaleString('vi-VN')} VND</p>
                    <div className="product-stock">
                        Tình trạng: {product.stockQuantity > 0 ? `✔️ Còn hàng (${product.stockQuantity} sản phẩm)` : '❌ Hết hàng'}
                    </div>
                    <div className="product-actions">
                        <div className="quantity-selector">
                            <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
                            <input type="number" value={quantity} readOnly />
                            <button onClick={() => setQuantity(q => Math.min(product.stockQuantity, q + 1))}>+</button>
                        </div>
                        {/* 4. Gắn sự kiện onClick vào nút */}
                        <button 
                            className="add-to-cart-btn" 
                            disabled={product.stockQuantity === 0}
                            onClick={handleAddToCart}
                        >
                            Thêm vào giỏ hàng
                        </button>
                    </div>
                </div>
            </div>
            <div className="product-description">
                <h2>Mô tả sản phẩm</h2>
                <div dangerouslySetInnerHTML={{ __html: product.description }} />
            </div>
        </div>
    );
};

export default ProductDetailPage;