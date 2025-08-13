import React from 'react';
import ProductCard from './ProductCard';
import './ProductGrid.css';

const ProductGrid = ({ products }) => {
    return (
        <div className="product-grid-container">
            {products && products.length > 0 ? (
                products.map(product => (
                    <ProductCard key={product._id} product={product} />
                ))
            ) : (
                <p>Không tìm thấy sản phẩm nào phù hợp với điều kiện lọc.</p>
            )}
        </div>
    );
};

export default ProductGrid;