import React from 'react';
import { Fade } from 'react-awesome-reveal';
import ProductCard from './ProductCard';
import './ProductSection.css';

const ProductSection = ({ title, products }) => {
    if (!products || products.length === 0) {
        return null; // Không hiển thị gì nếu không có sản phẩm
    }
    return (
        <Fade direction="up" triggerOnce>
            <section className="product-section">
                <h2 className="section-title">{title}</h2>
                <div className="product-grid">
                    {products.map(product => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            </section>
        </Fade>
    );
};

export default ProductSection;