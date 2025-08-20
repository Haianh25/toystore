import React from 'react';
import { Link } from 'react-router-dom';
import './BrandCard.css';

const BrandCard = ({ brand }) => {
    const serverUrl = 'http://localhost:5000';

    return (
        <Link to={`/products?brand=${brand._id}`} className="brand-card">
            <div className="brand-card-image-container">
                <img src={`${serverUrl}${brand.logo}`} alt={brand.name} />
            </div>
            <p className="brand-card-name">{brand.name}</p>
        </Link>
    );
};

export default BrandCard;