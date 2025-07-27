import React from 'react';

const CategoryTable = ({ categories, onEdit, onDelete }) => {
  const serverUrl = 'http://localhost:5000'; // Địa chỉ backend của bạn

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
      <thead>
        <tr style={{ backgroundColor: '#f2f2f2' }}>
          <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Ảnh Banner</th>
          <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Tên Danh mục</th>
          <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Trạng thái</th>
          <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Thứ tự</th>
          <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Hành động</th>
        </tr>
      </thead>
      <tbody>
        {categories.length > 0 ? (
          categories.map((category) => (
            <tr key={category._id}>
              <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                <img 
                  src={`${serverUrl}${category.bannerImage}`} 
                  alt={category.name} 
                  style={{ width: '150px', height: 'auto', objectFit: 'cover' }} 
                />
              </td>
              <td style={{ padding: '12px', border: '1px solid #ddd' }}>{category.name}</td>
              <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                <span style={{ 
                  color: category.status === 'Active' ? 'green' : 'red',
                  fontWeight: 'bold'
                }}>
                  {category.status}
                </span>
              </td>
              <td style={{ padding: '12px', border: '1px solid #ddd' }}>{category.sortOrder}</td>
              <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                <button onClick={() => onEdit(category)} style={{ marginRight: '8px' }}>Sửa</button>
                <button onClick={() => onDelete(category._id)}>Xóa</button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="5" style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>
              Chưa có danh mục nào.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default CategoryTable;