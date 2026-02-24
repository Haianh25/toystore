import React, { useState, useEffect } from 'react';
import axios from 'axios';
import VoucherTable from '../../components/admin/VoucherTable';
import VoucherFormModal from '../../components/admin/VoucherFormModal';
import { API_URL } from '../../config/api';
import { useToast } from '../../context/ToastContext';
import './VoucherManagement.css';

const VoucherManagement = () => {
    const [vouchers, setVouchers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingVoucher, setEditingVoucher] = useState(null);
    const { showToast } = useToast();

    const apiConfig = { headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` } };

    const fetchVouchers = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/api/v1/vouchers`, apiConfig);
            setVouchers(response.data.data.vouchers);
        } catch (error) {
            console.error("Lỗi tải vouchers:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchVouchers(); }, []);

    const handleOpenCreateModal = () => {
        setEditingVoucher(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (voucher) => {
        setEditingVoucher(voucher);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => setIsModalOpen(false);

    const handleSubmit = async (formData) => {
        try {
            if (editingVoucher) {
                await axios.patch(`${API_URL}/api/v1/vouchers/${editingVoucher._id}`, formData, apiConfig);
            } else {
                await axios.post(`${API_URL}/api/v1/vouchers`, formData, apiConfig);
            }
            fetchVouchers();
            handleCloseModal();
            showToast(editingVoucher ? "Cập nhật voucher thành công!" : "Tạo voucher thành công!", "success");
        } catch (error) {
            showToast(`Lỗi: ${error.response?.data?.message || 'Có lỗi xảy ra'}`, "error");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc muốn xóa voucher này?')) {
            try {
                await axios.delete(`${API_URL}/api/v1/vouchers/${id}`, apiConfig);
                fetchVouchers();
                showToast("Xóa voucher thành công!", "success");
            } catch (error) {
                showToast("Xóa voucher thất bại!", "error");
            }
        }
    };

    if (loading) return <p>Đang tải...</p>;

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Quản lý Voucher</h1>
                <button className="btn-primary" onClick={handleOpenCreateModal}>Tạo Voucher Mới</button>
            </div>
            <VoucherTable vouchers={vouchers} onEdit={handleOpenEditModal} onDelete={handleDelete} />
            <VoucherFormModal isOpen={isModalOpen} onClose={handleCloseModal} onSubmit={handleSubmit} voucher={editingVoucher} />
        </div>
    );
};

export default VoucherManagement;