import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './BrandPage.css';
import { API_URL } from '../../config/api';

const BrandPage = () => {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const { data } = await axios.get(`${API_URL}/api/v1/brands`);
                // Chấp nhận cả brands và data (từ factory) để tăng tính linh hoạt
                setBrands(data.data.brands || data.data.data || []);
            } catch (error) {
                console.error("Lỗi khi tải danh sách thương hiệu:", error);
                setBrands([]);
            } finally {
                setLoading(false);
            }
        };
        fetchBrands();
    }, []);

    if (loading) {
        return <p>Đang tải các thương hiệu...</p>;
    }

    return (
        <div className="brand-page-container">
            <h1 className="brand-page-title">Tất Cả Thương Hiệu</h1>
            <div className="brand-grid">
                {brands.map((brand) => (
                    <Link to={`/brands/${brand.slug}`} key={brand._id} className="brand-card">
                        <img src={`${API_URL}${brand.logo}`} alt={`${brand.name} logo`} />
                        <h3>{brand.name}</h3>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default BrandPage;