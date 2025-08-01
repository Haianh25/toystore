import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserTable from '../../components/admin/UserTable';
import UserFormModal from '../../components/admin/UserFormModal';
import './UserManagement.css'; // <-- 1. Import file CSS

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    const apiConfig = { headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }};

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:5000/api/v1/users', apiConfig);
            setUsers(response.data.data.users);
        } catch (err) {
            setError('Không thể tải dữ liệu người dùng.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleOpenModalForCreate = () => {
        setEditingUser(null);
        setIsModalOpen(true);
    };

    const handleOpenModalForEdit = (user) => {
        setEditingUser(user);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingUser(null);
    };

    const handleSubmitForm = async (formData) => {
        try {
            if (editingUser) {
                const updatedData = Object.fromEntries(
                    Object.entries(formData).filter(([_, v]) => v !== '' && v !== null)
                );
                await axios.patch(`http://localhost:5000/api/v1/users/${editingUser._id}`, updatedData, apiConfig);
            } else {
                await axios.post('http://localhost:5000/api/v1/users', formData, apiConfig);
            }
            handleCloseModal();
            fetchUsers();
        } catch (err) {
            alert(`Lỗi: ${err.response?.data?.message || 'Có lỗi xảy ra'}`);
            console.error(err);
        }
    };

    const handleDelete = async (userId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này không?')) {
            try {
                await axios.delete(`http://localhost:5000/api/v1/users/${userId}`, apiConfig);
                fetchUsers();
            } catch (err) {
                alert('Xóa người dùng thất bại!');
                console.error(err);
            }
        }
    };

    if (loading) return <p>Đang tải dữ liệu...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        // 2. Áp dụng các className
        <div className="page-container">
            <div className="page-header">
                <h1>Quản lý Người dùng</h1>
                <button className="btn-primary" onClick={handleOpenModalForCreate}>
                    Thêm người dùng mới
                </button>
            </div>
            <UserTable users={users} onEdit={handleOpenModalForEdit} onDelete={handleDelete} />
            <UserFormModal 
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleSubmitForm}
                user={editingUser}
            />
        </div>
    );
};

export default UserManagement;