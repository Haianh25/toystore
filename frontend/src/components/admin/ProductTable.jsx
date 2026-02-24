import React from 'react';
import { Link } from 'react-router-dom';
import { API_URL } from '../../config/api';

const ageGroupLabels = {
    '1-3': '1 - 3 tuổi',
    '3-6': '3 - 6 tuổi',
    '6-12': '6 - 12 tuổi',
    '12+': '12+ tuổi',
};

import axios from 'axios';
import { useToast } from '../../context/ToastContext';

const ProductTable = ({ products, onDelete, onRefresh }) => {
    const serverUrl = API_URL;
    const { showToast } = useToast();
    const [editingStockId, setEditingStockId] = React.useState(null);
    const [stockValue, setStockValue] = React.useState(0);

    const handleStockEditClick = (product) => {
        setEditingStockId(product._id);
        setStockValue(product.stockQuantity);
    };

    const handleSaveStock = async (productId) => {
        try {
            const token = localStorage.getItem('adminToken');
            await axios.patch(`${API_URL}/api/v1/products/${productId}`, { stockQuantity: stockValue }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            showToast("Cập nhật kho thành công!", "success");
            setEditingStockId(null);
            if (onRefresh) onRefresh();
        } catch (error) {
            showToast("Lỗi cập nhật kho", "error");
        }
    };

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
                        <td style={{ minWidth: '100px' }}>
                            {editingStockId === product._id ? (
                                <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                                    <input
                                        type="number"
                                        value={stockValue}
                                        onChange={(e) => setStockValue(parseInt(e.target.value))}
                                        style={{ width: '50px', padding: '4px' }}
                                    />
                                    <button onClick={() => handleSaveStock(product._id)} style={{ padding: '4px', cursor: 'pointer', background: '#2ecc71', color: 'white', border: 'none', borderRadius: '3px' }}>✓</button>
                                    <button onClick={() => setEditingStockId(null)} style={{ padding: '4px', cursor: 'pointer', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '3px' }}>✕</button>
                                </div>
                            ) : (
                                <div
                                    onClick={() => handleStockEditClick(product)}
                                    style={{ cursor: 'pointer', textDecoration: 'underline dotted', color: product.stockQuantity <= product.lowStockThreshold ? 'red' : 'inherit', fontWeight: product.stockQuantity <= product.lowStockThreshold ? 'bold' : 'normal' }}
                                    title="Click để sửa nhanh"
                                >
                                    {product.stockQuantity}
                                </div>
                            )}
                        </td>
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