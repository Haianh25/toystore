import React from 'react';
import { Link } from 'react-router-dom';

const ProductTable = ({ products, onDelete }) => {
    const serverUrl = 'http://localhost:5000';

    return (
        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
            <thead>
                <tr style={{ backgroundColor: '#f2f2f2' }}>
                    <th style={{ padding: '12px', border: '1px solid #ddd' }}>Ảnh</th>
                    <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Tên Sản phẩm</th>
                    <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Danh mục</th>
                    <th style={{ padding: '12px', border: '1px solid #ddd' }}>Giá bán</th>
                    <th style={{ padding: '12px', border: '1px solid #ddd' }}>Tồn kho</th>
                    <th style={{ padding: '12px', border: '1px solid #ddd' }}>Hành động</th>
                </tr>
            </thead>
            <tbody>
                {products.length > 0 ? products.map(product => (
                    <tr key={product._id}>
                        <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                            <img src={`${serverUrl}${product.mainImage}`} alt={product.name} style={{ width: '60px', height: '60px', objectFit: 'cover' }} />
                        </td>
                        <td style={{ padding: '12px', border: '1px solid #ddd' }}>{product.name}</td>
                        <td style={{ padding: '12px', border: '1px solid #ddd' }}>{product.category?.name || 'N/A'}</td>
                        <td style={{ padding: '12px', border: '1px solid #ddd' }}>{product.sellPrice.toLocaleString('vi-VN')} VND</td>
                        <td style={{ padding: '12px', border: '1px solid #ddd' }}>{product.stockQuantity}</td>
                        <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                            <Link to={`/admin/products/edit/${product._id}`} style={{ marginRight: '8px' }}>Sửa</Link>
                            <button onClick={() => onDelete(product._id)}>Xóa</button>
                        </td>
                    </tr>
                )) : (
                    <tr>
                        <td colSpan="6" style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>Chưa có sản phẩm nào.</td>
                    </tr>
                )}
            </tbody>
        </table>
    );
};

export default ProductTable;