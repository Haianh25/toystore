import React from 'react';
import './ProductSkeleton.css';

const ProductSkeleton = () => {
    return (
        <div className="product-card skeleton-card">
            <div className="product-image-container skeleton-image shimmer"></div>
            <div className="product-info">
                <div className="skeleton-line skeleton-name shimmer"></div>
                <div className="skeleton-line skeleton-price shimmer"></div>
            </div>
        </div>
    );
};

export default ProductSkeleton;
