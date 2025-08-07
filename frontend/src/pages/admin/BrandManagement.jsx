import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BrandTable from '../../components/admin/BrandTable';
import BrandFormModal from '../../components/admin/BrandFormModal';
import './BrandManagement.css';

const BrandManagement = () => {
    const [brands, setBrands] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBrand, setEditingBrand] = useState(null);
    const apiConfig = { headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` } };

    const fetchBrands = async () => {
        const res = await axios.get('http://localhost:5000/api/v1/brands', apiConfig);
        setBrands(res.data.data.brands);
    };

    useEffect(() => { fetchBrands(); }, []);

    const handleOpenCreate = () => {
        setEditingBrand(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (brand) => {
        setEditingBrand(brand);
        setIsModalOpen(true);
    };

    const handleSubmit = async (formData) => {
        try {
            if (editingBrand) {
                // Hoàn thiện logic Sửa
                await axios.patch(`http://localhost:5000/api/v1/brands/${editingBrand._id}`, formData, apiConfig);
            } else {
                await axios.post('http://localhost:5000/api/v1/brands', formData, apiConfig);
            }
            fetchBrands();
            setIsModalOpen(false);
        } catch (error) {
            alert(`Lỗi: ${error.response?.data?.message || 'Có lỗi xảy ra'}`);
        }
    };
    
    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa thương hiệu này?')) {
            try {
                // Hoàn thiện logic Xóa
                await axios.delete(`http://localhost:5000/api/v1/brands/${id}`, apiConfig);
                fetchBrands();
            } catch (error) {
                alert('Xóa thương hiệu thất bại!');
            }
        }
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Quản lý Thương hiệu</h1>
                <button className="btn-primary" onClick={handleOpenCreate}>Thêm Thương hiệu</button>
            </div>
            <BrandTable brands={brands} onEdit={handleOpenEdit} onDelete={handleDelete} />
            <BrandFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleSubmit} brand={editingBrand} />
        </div>
    );
};

export default BrandManagement;