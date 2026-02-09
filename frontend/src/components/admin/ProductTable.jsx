import React from 'react';
import { Link } from 'react-router-dom';
import { API_URL } from '../../config/api';

const ageGroupLabels = {
    '1-3': '1 - 3 tuổi',
    '3-6': '3 - 6 tuổi',
    '6-12': '6 - 12 tuổi',
    '12+': '12+ tuổi',
};

const ProductTable = ({ products, onDelete }) => {
    const serverUrl = API_URL;

    const formatAgeGroups = (groups) => {
        if (!groups || groups.length === 0) return 'Chưa gán';
        return groups.map(g => ageGroupLabels[g] || g).join(', ');
    };

    // --- HÀM MỚI ĐỂ HIỂN THỊ NHIỀU DANH MỤC ---
    const formatCategories = (categories) => {
        if (!categories || categories.length === 0) return 'N/A';
        // Lấy tên từ mỗi object category và nối chúng lại
        return categories.map(cat => cat.name).join(', ');
    };

    return (
        <table className="admin-table">
            <thead>
                <tr>
                    <th>Ảnh</th>
                    <th>Tên Sản phẩm</th>
                    <th>Danh mục</th>
                    <th>Giá bán</th>
                    <th>Tồn kho</th>
                    <th>Độ tuổi</th>
                    <th>Hành động</th>
                </tr>
            </thead>
            <tbody>
                {products && products.length > 0 ? products.map(product => (
                    <tr key={product._id}>
                        <td><img src={`${serverUrl}${product.mainImage}`} alt={product.name} style={{ width: '60px', height: '60px', objectFit: 'cover' }} /></td>
                        <td>{product.name}</td>

                        {/* === SỬA LẠI LOGIC HIỂN THỊ Ở ĐÂY === */}
                        <td>{formatCategories(product.categories)}</td>

                        <td>{product.sellPrice.toLocaleString('vi-VN')} VND</td>
                        <td>{product.stockQuantity}</td>
                        <td>{formatAgeGroups(product.ageGroups)}</td>
                        <td className="action-buttons">
                            <Link to={`/admin/products/edit/${product._id}`} className="btn-edit">Sửa</Link>
                            <button onClick={() => onDelete(product._id)} className="btn-delete">Xóa</button>
                        </td>
                    </tr>
                )) : (
                    <tr>
                        <td colSpan="7" style={{ textAlign: 'center' }}>Chưa có sản phẩm nào.</td>
                    </tr>
                )}
            </tbody>
        </table>
    );
};

export default ProductTable;