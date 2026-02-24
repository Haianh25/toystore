import React from 'react';

// Nhận thêm 2 props là onEdit và onDelete
const UserTable = ({ users, onEdit, onDelete }) => {
  return (
    <table className="admin-table">
      <thead>
        <tr>
          <th>Họ Tên</th>
          <th>Email</th>
          <th>Số điện thoại</th>
          <th>Vai trò</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        {users.length > 0 ? (
          users.map((user) => (
            <tr key={user._id}>
              <td>{user.fullName}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>{user.role}</td>
              <td className="action-buttons">
                <button
                  onClick={() => onEdit(user)}
                  className="btn-edit"
                >
                  Sửa
                </button>
                <button
                  onClick={() => onDelete(user._id)}
                  className="btn-delete"
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="5" style={{ textAlign: 'center' }}>
              Không có người dùng nào.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default UserTable;