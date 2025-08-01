import React from 'react';
// Không cần import CSS ở đây vì trang cha đã import rồi

const VoucherTable = ({ vouchers, onEdit, onDelete }) => {
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString('vi-VN', options);
    };

    const formatDiscount = (type, value) => {
        if (type === 'percentage') {
            return `${value}%`;
        }
        return `${value.toLocaleString('vi-VN')} VND`;
    };

    return (
        <table className="voucher-table">
            <thead>
                <tr>
                    <th>Mã Code</th>
                    <th>Loại / Giá trị</th>
                    <th>Số lượng (Còn lại/Tổng)</th>
                    <th>Ngày hết hạn</th>
                    <th>Trạng thái</th>
                    <th>Hành động</th>
                </tr>
            </thead>
            <tbody>
                {vouchers.map(voucher => (
                    <tr key={voucher._id}>
                        <td><strong>{voucher.code}</strong></td>
                        <td>{formatDiscount(voucher.discountType, voucher.discountValue)}</td>
                        <td>{voucher.maxUses - voucher.usesCount} / {voucher.maxUses}</td>
                        <td>{formatDate(voucher.expiresAt)}</td>
                        <td>{voucher.isActive ? 'Hoạt động' : 'Vô hiệu'}</td>
                        <td className="action-buttons">
                            <button className="btn-edit" onClick={() => onEdit(voucher)}>Sửa</button>
                            <button className="btn-delete" onClick={() => onDelete(voucher._id)}>Xóa</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default VoucherTable;