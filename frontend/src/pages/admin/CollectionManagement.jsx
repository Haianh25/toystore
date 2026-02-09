import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../config/api';
import CollectionTable from '../../components/admin/CollectionTable';
import CollectionFormModal from '../../components/admin/CollectionFormModal';
import './CollectionManagement.css'; // Sửa lại đường dẫn import

const CollectionManagement = () => {
    const [collections, setCollections] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCollection, setEditingCollection] = useState(null);
    const apiConfig = { headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` } };

    const fetchCollections = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/v1/collections`, apiConfig);
            const collectionsData = res.data?.data?.collections || res.data?.data?.data || res.data?.data || [];
            setCollections(Array.isArray(collectionsData) ? collectionsData : []);
        } catch (error) {
            console.error("Lỗi tải bộ sưu tập:", error);
        }
    };

    useEffect(() => { fetchCollections(); }, []);

    const handleOpenCreate = () => {
        setEditingCollection(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (collection) => {
        setEditingCollection(collection);
        setIsModalOpen(true);
    };

    const handleSubmit = async (formData) => {
        try {
            if (editingCollection) {
                await axios.patch(`${API_URL}/api/v1/collections/${editingCollection._id}`, formData, apiConfig);
            } else {
                await axios.post(`${API_URL}/api/v1/collections`, formData, apiConfig);
            }
            fetchCollections();
            setIsModalOpen(false);
        } catch (error) {
            alert(`Lỗi: ${error.response?.data?.message || 'Có lỗi xảy ra'}`);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc muốn xóa bộ sưu tập này?')) {
            try {
                await axios.delete(`${API_URL}/api/v1/collections/${id}`, apiConfig);
                fetchCollections();
            } catch (error) {
                alert('Xóa thất bại!');
            }
        }
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Quản lý Bộ sưu tập</h1>
                <button className="btn-primary" onClick={handleOpenCreate}>Thêm Bộ sưu tập</button>
            </div>
            <CollectionTable collections={collections} onEdit={handleOpenEdit} onDelete={handleDelete} />
            <CollectionFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleSubmit} collection={editingCollection} />
        </div>
    );
};

export default CollectionManagement;