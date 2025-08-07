import React from 'react';

const BrandTable = ({ brands, onEdit, onDelete }) => {
    const serverUrl = 'http://localhost:5000';
    return (
        <table className="admin-table">
            <thead>
                <tr>
                    <th>Logo</th>
                    <th>Tên Thương hiệu</th>
                    <th>Mô tả</th>
                    <th>Hành động</th>
                </tr>
            </thead>
            <tbody>
                {brands.map(brand => (
                    <tr key={brand._id}>
                        <td><img src={`${serverUrl}${brand.logo}`} alt={brand.name} style={{ width: '100px', height: 'auto', objectFit: 'contain' }} /></td>
                        <td>{brand.name}</td>
                        <td>{brand.description}</td>
                        <td className="action-buttons">
                            <button className="btn-edit" onClick={() => onEdit(brand)}>Sửa</button>
                            <button className="btn-delete" onClick={() => onDelete(brand._id)}>Xóa</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default BrandTable;