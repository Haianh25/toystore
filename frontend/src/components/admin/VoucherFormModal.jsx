import React, { useState, useEffect } from 'react';
import './VoucherFormModal.css'; // Tái sử dụng CSS cũ

const VoucherFormModal = ({ isOpen, onClose, onSubmit, voucher }) => {
    const [formData, setFormData] = useState({
        code: '',
        discountType: 'percentage',
        discountValue: 0,
        maxUses: 1,
        expiresAt: '',
        isActive: true,
    });

    const isEditing = voucher !== null;

    useEffect(() => {
        if (isEditing && voucher) {
            setFormData({
                code: voucher.code,
                discountType: voucher.discountType,
                discountValue: voucher.discountValue,
                maxUses: voucher.maxUses,
                expiresAt: voucher.expiresAt.split('T')[0], // Định dạng lại date cho input
                isActive: voucher.isActive,
            });
        } else {
            setFormData({ code: '', discountType: 'percentage', discountValue: 0, maxUses: 1, expiresAt: '', isActive: true });
        }
    }, [voucher, isOpen]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h2>{isEditing ? 'Sửa Voucher' : 'Tạo Voucher Mới'}</h2>
                <form onSubmit={handleSubmit}>
                    <input name="code" value={formData.code} onChange={handleChange} placeholder="Mã Voucher (ví dụ: SALE50)" required />
                    <select name="discountType" value={formData.discountType} onChange={handleChange}>
                        <option value="percentage">Giảm theo phần trăm (%)</option>
                        <option value="fixed_amount">Giảm số tiền cố định (VND)</option>
                    </select>
                    <input type="number" name="discountValue" value={formData.discountValue} onChange={handleChange} placeholder="Giá trị giảm" required />
                    <input type="number" name="maxUses" value={formData.maxUses} onChange={handleChange} placeholder="Số lần sử dụng tối đa" required />
                    <label>Ngày hết hạn</label>
                    <input type="date" name="expiresAt" value={formData.expiresAt} onChange={handleChange} required />
                    <label><input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} /> Kích hoạt</label>
                    <div className="modal-actions">
                        <button type="button" onClick={onClose}>Hủy</button>
                        <button type="submit">{isEditing ? 'Cập nhật' : 'Tạo mới'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default VoucherFormModal;