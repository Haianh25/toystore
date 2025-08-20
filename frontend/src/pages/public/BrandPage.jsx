import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './BrandPage.css'; // Sẽ tạo file này ngay sau đây

const BrandPage = () => {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const serverUrl = 'http://localhost:5000';

    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/v1/brands');
                setBrands(data.data.brands);
            } catch (error) {
                console.error("Lỗi khi tải danh sách thương hiệu:", error);
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
                        <img src={`${serverUrl}${brand.logo}`} alt={`${brand.name} logo`} />
                        <h3>{brand.name}</h3>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default BrandPage;