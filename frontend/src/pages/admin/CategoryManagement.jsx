import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CategoryTable from '../../components/admin/CategoryTable';
import { API_URL } from '../../config/api';
import CategoryFormModal from '../../components/admin/CategoryFormModal';
import './CategoryManagement.css'; // <-- 1. Import file CSS mới

const CategoryManagement = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    const apiConfig = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
        }
    };

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/api/v1/categories`, apiConfig);
            const categoriesData = response.data?.data?.categories || response.data?.data?.data || response.data?.data || [];
            setCategories(Array.isArray(categoriesData) ? categoriesData : []);
        } catch (error) {
            console.error("Lỗi tải danh mục:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleOpenModalForCreate = () => {
        setEditingCategory(null);
        setIsModalOpen(true);
    };

    const handleOpenModalForEdit = (category) => {
        setEditingCategory(category);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => setIsModalOpen(false);

    const handleSubmitForm = async (formData) => {
        try {
            if (editingCategory) {
                await axios.patch(`${API_URL}/api/v1/categories/${editingCategory._id}`, formData, apiConfig);
            } else {
                await axios.post(`${API_URL}/api/v1/categories`, formData, apiConfig);
            }
            handleCloseModal();
            fetchCategories();
        } catch (error) {
            alert(`Lỗi: ${error.response?.data?.message || 'Có lỗi xảy ra'}`);
        }
    };

    const handleDelete = async (categoryId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa danh mục này? Thao tác này không thể hoàn tác.')) {
            try {
                await axios.delete(`${API_URL}/api/v1/categories/${categoryId}`, apiConfig);
                fetchCategories();
            } catch (error) {
                alert('Xóa danh mục thất bại!');
            }
        }
    };

    if (loading) return <p>Đang tải...</p>;

    return (
        // 2. Áp dụng các className
        <div className="page-container">
            <div className="page-header">
                <h1>Quản lý Danh mục</h1>
                <button className="btn-primary" onClick={handleOpenModalForCreate}>
                    Thêm danh mục mới
                </button>
            </div>
            <CategoryTable categories={categories} onEdit={handleOpenModalForEdit} onDelete={handleDelete} />
            <CategoryFormModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleSubmitForm}
                category={editingCategory}
            />
        </div>
    );
};

export default CategoryManagement;