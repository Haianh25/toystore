import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CategoryTable from '../../components/admin/CategoryTable';
import CategoryFormModal from '../../components/admin/CategoryFormModal';

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
            const response = await axios.get('http://localhost:5000/api/v1/categories', apiConfig);
            setCategories(response.data.data.categories);
        } catch (error) {
            console.error("Lỗi tải danh mục:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchCategories = async () => {
            setLoading(true);
            const apiConfig = {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
                }
            };
            try {
                const response = await axios.get('http://localhost:5000/api/v1/categories', apiConfig);
                setCategories(response.data.data.categories);
            } catch (error) {
                console.error("Lỗi tải danh mục:", error);
            } finally {
                setLoading(false);
            }
        };
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
                // Sửa danh mục
                await axios.patch(`http://localhost:5000/api/v1/categories/${editingCategory._id}`, formData, apiConfig);
            } else {
                // Thêm danh mục mới
                await axios.post('http://localhost:5000/api/v1/categories', formData, apiConfig);
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
                await axios.delete(`http://localhost:5000/api/v1/categories/${categoryId}`, apiConfig);
                fetchCategories();
            } catch {
                alert('Xóa danh mục thất bại!');
            }
        }
    };

    if (loading) return <p>Đang tải...</p>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1>Quản lý Danh mục</h1>
                <button onClick={handleOpenModalForCreate}>Thêm danh mục mới</button>
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