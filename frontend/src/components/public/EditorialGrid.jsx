import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import './EditorialGrid.css';
import { API_URL } from '../../config/api';

const EditorialGrid = ({ section }) => {
    const { title, content } = section;
    const { products, bannerImage, subtitle } = content;

    // We only want a few products for the editorial look
    const displayProducts = products.slice(0, 3);

    return (
        <section className="editorial-lookbook-section">
            <div className="editorial-lookbook-container">
                <div className="lookbook-header">
                    <span className="lookbook-subtitle">{subtitle || "CURATED SELECTION"}</span>
                    <h2 className="lookbook-title tdp-serif">{title}</h2>
                </div>

                <div className="lookbook-main-grid">
                    {/* Left: Featured Visual */}
                    <div className="lookbook-visual">
                        <div className="visual-inner">
                            <img src={`${API_URL}${bannerImage}`} alt={title} />
                            <div className="visual-overlay">
                                <Link to="/products" className="lookbook-cta">VIEW THE COLLECTION</Link>
                            </div>
                        </div>
                    </div>

                    {/* Right: Clean Product List */}
                    <div className="lookbook-selection">
                        <div className="selection-grid">
                            {displayProducts.map((product) => (
                                <div key={product._id} className="selection-item">
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};


export default EditorialGrid;
