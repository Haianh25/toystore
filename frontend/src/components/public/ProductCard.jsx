import React from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css';
import { API_URL } from '../../config/api';

const ProductCard = ({ product }) => {
    return (
        <div className="product-card">
            <Link to={`/products/${product._id}`}>
                <div className="product-image-container">
                    <img src={`${API_URL}${product.mainImage}`} alt={product.name} />
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