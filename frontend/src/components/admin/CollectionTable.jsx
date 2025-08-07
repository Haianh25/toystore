import React from 'react';

const CollectionTable = ({ collections, onEdit, onDelete }) => {
    return (
        <table className="admin-table">
            <thead>
                <tr>
                    <th>Tên Bộ sưu tập</th>
                    <th>Mô tả</th>
                    <th>Hành động</th>
                </tr>
            </thead>
            <tbody>
                {collections.map(collection => (
                    <tr key={collection._id}>
                        <td>{collection.name}</td>
                        <td>{collection.description}</td>
                        <td className="action-buttons">
                            <button className="btn-edit" onClick={() => onEdit(collection)}>Sửa</button>
                            <button className="btn-delete" onClick={() => onDelete(collection._id)}>Xóa</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default CollectionTable;