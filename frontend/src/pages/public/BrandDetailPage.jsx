import React, { useState, useEffect } from 'react';
// Bước 1: Import useNavigate cùng với useParams
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../config/api';
import './BrandPage.css';

const BrandDetailPage = () => {
    const { slug } = useParams();
    const [brand, setBrand] = useState(null);
    const [loading, setLoading] = useState(true);
    const serverUrl = API_URL;

    // Bước 2: Khởi tạo hook navigate
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBrandDetail = async () => {
            try {
                const { data } = await axios.get(`${API_URL}/api/v1/brands/slug/${slug}`);
                setBrand(data.data.brand);
            } catch (error) {
                console.error("Lỗi khi tải chi tiết thương hiệu:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBrandDetail();
    }, [slug]);

    if (loading) {
        return <p>Đang tải thông tin thương hiệu...</p>;
    }

    if (!brand) {
        return <p>Không tìm thấy thông tin cho thương hiệu này.</p>;
    }

    return (
        <div className="brand-page-container">
            {/* Bước 3: Thêm nút Back */}
            <button onClick={() => navigate('/brands')} className="back-button">
                &larr; Quay lại danh sách
            </button>

            <div className="brand-detail-header">
                <img src={`${serverUrl}${brand.logo}`} alt={`${brand.name} logo`} />
                <h1>{brand.name}</h1>
            </div>
            <div className="brand-description">
                <p>{brand.description || 'Thương hiệu này chưa có mô tả.'}</p>
            </div>
        </div>
    );
};

export default BrandDetailPage;