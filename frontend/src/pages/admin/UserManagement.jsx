import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserTable from '../../components/admin/UserTable';
import UserFormModal from '../../components/admin/UserFormModal';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    // Hàm gọi API lấy danh sách người dùng (đã có nội dung đầy đủ)
    const fetchUsers = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            const response = await axios.get('http://localhost:5000/api/v1/users', {
                headers: { Authorization: `Bearer ${token}` },
            });
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

    // Các hàm xử lý Modal
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

    // Hàm xử lý gửi Form (Thêm mới hoặc Sửa)
    const handleSubmitForm = async (formData) => {
        const token = localStorage.getItem('adminToken');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        
        try {
            if (editingUser) {
                const updatedData = Object.fromEntries(
                    Object.entries(formData).filter(([_, v]) => v !== '' && v !== null)
                );
                await axios.patch(`http://localhost:5000/api/v1/users/${editingUser._id}`, updatedData, config);
            } else {
                await axios.post('http://localhost:5000/api/v1/users', formData, config);
            }
            handleCloseModal();
            fetchUsers();
        } catch (err) {
            alert(`Lỗi: ${err.response?.data?.message || 'Có lỗi xảy ra'}`);
            console.error(err);
        }
    };

    // Hàm xử lý xóa người dùng
    const handleDelete = async (userId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này không?')) {
            try {
                const token = localStorage.getItem('adminToken');
                await axios.delete(`http://localhost:5000/api/v1/users/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
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
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1>Quản lý Người dùng</h1>
                <button onClick={handleOpenModalForCreate} style={{ padding: '10px 15px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
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