import React from 'react';
import { API_URL } from '../../config/api';

const BannerTable = ({ banners, onEdit, onDelete }) => {
    const serverUrl = API_URL;
    return (
        <table className="admin-table">
            <thead>
                <tr>
                    <th>Ảnh Banner</th>
                    <th>Link</th>
                    <th>Trạng thái</th>
                    <th>Hành động</th>
                </tr>
            </thead>
            <tbody>
                {banners.map(banner => (
                    <tr key={banner._id}>
                        <td><img src={`${serverUrl}${banner.image}`} alt="Banner" style={{ width: '200px', height: 'auto' }} /></td>
                        <td>{banner.link}</td>
                        <td>{banner.isActive ? 'Hoạt động' : 'Ẩn'}</td>
                        <td className="action-buttons">
                            <button className="btn-edit" onClick={() => onEdit(banner)}>Sửa</button>
                            <button className="btn-delete" onClick={() => onDelete(banner._id)}>Xóa</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default BannerTable;