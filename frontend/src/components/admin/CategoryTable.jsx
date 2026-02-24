import React from 'react';
import { API_URL } from '../../config/api';

const CategoryTable = ({ categories, onEdit, onDelete }) => {
  const serverUrl = API_URL; // Địa chỉ backend của bạn

  return (
    <table className="admin-table">
      <thead>
        <tr>
          <th>Ảnh Banner</th>
          <th>Tên Danh mục</th>
          <th>Trạng thái</th>
          <th>Thứ tự</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        {categories.length > 0 ? (
          categories.map((category) => (
            <tr key={category._id}>
              <td>
                <img
                  src={`${serverUrl}${category.bannerImage}`}
                  alt={category.name}
                  style={{ width: '150px', height: 'auto', objectFit: 'cover' }}
                />
              </td>
              <td>{category.name}</td>
              <td>
                <span className={category.status === 'Active' ? 'status-active' : 'status-inactive'}>
                  {category.status}
                </span>
              </td>
              <td>{category.sortOrder}</td>
              <td className="action-buttons">
                <button className="btn-edit" onClick={() => onEdit(category)}>Sửa</button>
                <button className="btn-delete" onClick={() => onDelete(category._id)}>Xóa</button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="5" style={{ textAlign: 'center' }}>
              Chưa có danh mục nào.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default CategoryTable;