import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { FaTimes, FaDolly, FaCubes, FaCalendarAlt } from 'react-icons/fa';
import { getImageUrl } from '../../utils/imageUtils';
import './QuickViewModal.css';

const QuickViewModal = ({ product, isOpen, onClose }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            document.body.style.overflow = 'hidden';
        } else {
            const timer = setTimeout(() => setIsVisible(false), 300);
            document.body.style.overflow = 'auto';
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isOpen && !isVisible) return null;

    // Extracting piece count and year from name/desc if possible for Superhero sets
    // Name format: LEGO SetName [Set 75375-1]
    const setMatch = product.name.match(/\[Set (.*?)-1\]/);
    const setNum = setMatch ? setMatch[1] : 'N/A';

    // Pieces match
    const piecesMatch = product.description.match(/gồm (.*?) mảnh ghép/);
    const pieces = piecesMatch ? piecesMatch[1] : 'Unknown';

    // Year match
    const yearMatch = product.description.match(/năm (.*?),/);
    const year = yearMatch ? yearMatch[1] : 'N/A';

    return createPortal(
        <div className={`quickview-overlay ${isOpen ? 'active' : ''}`} onClick={onClose}>
            <div className={`quickview-content ${isOpen ? 'active' : ''}`} onClick={e => e.stopPropagation()}>
                <button className="close-quickview" onClick={onClose} aria-label="Close modal">
                    <FaTimes />
                </button>

                <div className="quickview-grid">
                    <div className="quickview-image">
                        <img
                            src={getImageUrl(product.mainImage)}
                            alt={product.name}
                            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?auto=format&fit=crop&q=80&w=1000' }}
                        />
                    </div>

                    <div className="quickview-details">
                        <span className="set-tag">SET {setNum}</span>
                        <h2 className="quickview-title">{product.name.split('[')[0].trim()}</h2>

                        <div className="quick-specs">
                            <div className="spec-item">
                                <FaCubes className="spec-icon" />
                                <div className="spec-text">
                                    <span className="spec-label">PIECES</span>
                                    <span className="spec-value">{pieces}</span>
                                </div>
                            </div>
                            <div className="spec-item">
                                <FaCalendarAlt className="spec-icon" />
                                <div className="spec-text">
                                    <span className="spec-label">RELEASED</span>
                                    <span className="spec-value">{year}</span>
                                </div>
                            </div>
                            <div className="spec-item">
                                <FaDolly className="spec-icon" />
                                <div className="spec-text">
                                    <span className="spec-label">STOCK</span>
                                    <span className="spec-value">{product.stockQuantity > 0 ? `${product.stockQuantity} Units` : 'Out of Stock'}</span>
                                </div>
                            </div>
                        </div>

                        <p className="quickview-desc">{product.description}</p>

                        <div className="quickview-price-section">
                            <span className="quickview-price">{(product.sellPrice || 0).toLocaleString('vi-VN')} VND</span>
                            <button className="quickview-cta" onClick={() => window.location.href = `/products/${product._id}`}>
                                VIEW FULL DETAILS
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default QuickViewModal;
