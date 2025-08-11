import React from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product }) => {
    const serverUrl = 'http://localhost:5000';

    return (
        <div className="product-card">
            <Link to={`/products/${product._id}`}>
                <div className="product-image-container">
                    <img src={`${serverUrl}${product.mainImage}`} alt={product.name} />
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