import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import './EditorialGrid.css';

const EditorialGrid = ({ section }) => {
    const serverUrl = 'http://localhost:5000';
    const { title, content } = section;
    const { products, bannerImage, subtitle } = content;

    // We only want a few products for the editorial look
    const displayProducts = products.slice(0, 3);

    return (
        <section className="editorial-grid-section">
            <div className="editorial-container">
                <div className="editorial-header">
                    <span className="editorial-subtitle">{subtitle || "EXCLUSIVE SELECTION"}</span>
                    <h2 className="dior-serif-title">{title}</h2>
                </div>

                <div className="editorial-layout">
                    {/* Large Featured Image Column */}
                    <div className="editorial-featured-col">
                        <div className="editorial-image-wrapper">
                            <img src={`${serverUrl}${bannerImage}`} alt={title} className="parallax-bg" />
                            <div className="editorial-image-overlay">
                                <Link to="/products" className="dior-button-outline white">DISCOVER THE COLLECTION</Link>
                            </div>
                        </div>
                    </div>

                    {/* Product Cards Column (Asymmetrical) */}
                    <div className="editorial-products-col">
                        {displayProducts.map((product, index) => (
                            <div key={product._id} className={`editorial-product-item item-${index + 1}`}>
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default EditorialGrid;
