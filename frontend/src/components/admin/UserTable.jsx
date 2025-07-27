import React from 'react';

// Nhận thêm 2 props là onEdit và onDelete
const UserTable = ({ users, onEdit, onDelete }) => {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
      <thead>
        <tr style={{ backgroundColor: '#f2f2f2' }}>
          <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Họ Tên</th>
          <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Email</th>
          <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Số điện thoại</th>
          <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Vai trò</th>
          <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Hành động</th>
        </tr>
      </thead>
      <tbody>
        {users.length > 0 ? (
          users.map((user) => (
            <tr key={user._id}>
              <td style={{ padding: '12px', border: '1px solid #ddd' }}>{user.fullName}</td>
              <td style={{ padding: '12px', border: '1px solid #ddd' }}>{user.email}</td>
              <td style={{ padding: '12px', border: '1px solid #ddd' }}>{user.phone}</td>
              <td style={{ padding: '12px', border: '1px solid #ddd' }}>{user.role}</td>
              <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                <button 
                  onClick={() => onEdit(user)} 
                  style={{ marginRight: '8px', padding: '6px 10px', cursor: 'pointer', backgroundColor: '#ffc107', border: 'none', color: 'white' }}
                >
                  Sửa
                </button>
                <button 
                  onClick={() => onDelete(user._id)} 
                  style={{ padding: '6px 10px', cursor: 'pointer', backgroundColor: '#dc3545', border: 'none', color: 'white' }}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="5" style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>
              Không có người dùng nào.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default UserTable;