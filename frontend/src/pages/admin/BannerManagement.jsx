import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../config/api';
import BannerTable from '../../components/admin/BannerTable';
import BannerFormModal from '../../components/admin/BannerFormModal';
import './BannerManagement.css';

const BannerManagement = () => {
    const [banners, setBanners] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBanner, setEditingBanner] = useState(null);
    const apiConfig = { headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` } };

    const fetchBanners = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/v1/banners`, apiConfig);
            const bannersData = res.data?.data?.banners || res.data?.data?.data || res.data?.data || [];
            setBanners(Array.isArray(bannersData) ? bannersData : []);
        } catch (error) {
            console.error("Lỗi tải banner:", error);
        }
    };

    useEffect(() => { fetchBanners(); }, []);

    const handleOpenCreate = () => {
        setEditingBanner(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (banner) => {
        setEditingBanner(banner);
        setIsModalOpen(true);
    };

    const handleSubmit = async (formData) => {
        try {
            if (editingBanner) {
                await axios.patch(`${API_URL}/api/v1/banners/${editingBanner._id}`, formData, apiConfig);
            } else {
                await axios.post(`${API_URL}/api/v1/banners`, formData, apiConfig);
            }
            fetchBanners();
            setIsModalOpen(false);
        } catch (error) {
            alert(`Lỗi: ${error.response?.data?.message || 'Có lỗi xảy ra'}`);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc muốn xóa banner này?')) {
            try {
                await axios.delete(`${API_URL}/api/v1/banners/${id}`, apiConfig);
                fetchBanners();
            } catch (error) {
                alert('Xóa thất bại!');
            }
        }
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Quản lý Banner</h1>
                <button className="btn-primary" onClick={handleOpenCreate}>Thêm Banner</button>
            </div>
            <BannerTable banners={banners} onEdit={handleOpenEdit} onDelete={handleDelete} />
            <BannerFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleSubmit} banner={editingBanner} />
        </div>
    );
};

export default BannerManagement;