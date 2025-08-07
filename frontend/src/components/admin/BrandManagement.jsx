import React from 'react';
import './Table.css';

const BrandTable = ({ brands, onEdit, onDelete }) => {
    const serverUrl = 'http://localhost:5000';
    return (
        <table className="admin-table">
            <thead>
                <tr>
                    <th>Logo</th>
                    <th>Tên Thương hiệu</th>
                    <th>Hành động</th>
                </tr>
            </thead>
            <tbody>
                {brands.map(brand => (
                    <tr key={brand._id}>
                        <td><img src={`${serverUrl}${brand.logo}`} alt={brand.name} style={{ width: '100px', height: 'auto' }} /></td>
                        <td>{brand.name}</td>
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