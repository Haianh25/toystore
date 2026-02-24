import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../config/api';
import { getImageUrl } from '../../utils/imageUtils';
import './CategoryShowcase.css';

const CategoryShowcase = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/v1/categories`);
                // Use the fetched categories, or fallback to an empty array
                setCategories(res.data.data.categories || []);
            } catch (error) {
                console.error("Lỗi khi tải danh mục showcase:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    if (loading) {
        return (
            <div className="category-showcase-loading" style={{ textAlign: 'center', padding: '50px' }}>
                <p>Loading Collections...</p>
            </div>
        );
    }

    // fallback mapping if database is empty - but ideally we want to show what's in DB
    const displayCategories = categories.length > 0 ? categories.slice(0, 3) : [];

    if (displayCategories.length === 0) return null;

    return (
        <section className="category-showcase">
            <div className="showcase-grid">
                {displayCategories.map((cat) => (
                    <Link to={`/category/${cat.slug}`} key={cat._id} className="category-card">
                        <div className="card-image-wrapper">
                            <img src={getImageUrl(cat.bannerImage)} alt={cat.name} />
                            <div className="card-overlay"></div>
                        </div>
                        <div className="card-content">
                            <span className="card-subtitle">COLLECTION</span>
                            <h3 className="card-title">{cat.name.toUpperCase()}</h3>
                            <span className="card-explore">EXPLORE ▸</span>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default CategoryShowcase;
