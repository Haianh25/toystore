import React from 'react';
import { Link } from 'react-router-dom';
// Không cần import CSS ở đây nếu trang cha đã có

const ProductTable = ({ products, onDelete }) => {
    const serverUrl = 'http://localhost:5000';

    return (
        <table className="admin-table">
            <thead>
                <tr>
                    <th>Ảnh</th>
                    <th>Tên Sản phẩm</th>
                    <th>Danh mục</th>
                    <th>Thương hiệu</th>
                    <th>Bộ sưu tập</th>
                    <th>Giá bán</th>
                    <th>Tồn kho</th>
                    <th>Hành động</th>
                </tr>
            </thead>
            <tbody>
                {products.length > 0 ? products.map(product => (
                    <tr key={product._id}>
                        <td>
                            <img src={`${serverUrl}${product.mainImage}`} alt={product.name} style={{ width: '60px', height: '60px', objectFit: 'cover' }} />
                        </td>
                        <td>{product.name}</td>
                        <td>{product.category?.name || 'N/A'}</td>
                        {/* THÊM CỘT MỚI */}
                        <td>{product.brand?.name || 'N/A'}</td>
                        <td>{product.productCollection?.name || 'N/A'}</td>

                        <td>{product.sellPrice.toLocaleString('vi-VN')} VND</td>
                        <td>{product.stockQuantity}</td>
                        <td className="action-buttons">
                            <Link to={`/admin/products/edit/${product._id}`} className="btn-edit">Sửa</Link>
                            <button onClick={() => onDelete(product._id)} className="btn-delete">Xóa</button>
                        </td>
                    </tr>
                )) : (
                    <tr>
                        <td colSpan="8" style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>Chưa có sản phẩm nào.</td>
                    </tr>
                )}
            </tbody>
        </table>
    );
};

export default ProductTable;