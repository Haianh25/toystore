import React, { useState, useEffect } from 'react';
import './UserFormModal.css';

const UserFormModal = ({ isOpen, onClose, onSubmit, user }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        role: 'user',
    });

    const isEditing = user !== null;

    useEffect(() => {
        if (isEditing) {
            // Nếu là sửa, điền thông tin user vào form
            setFormData({
                fullName: user.fullName || '',
                email: user.email || '',
                phone: user.phone || '',
                password: '', // Để trống mật khẩu khi sửa
                role: user.role || 'user',
            });
        } else {
            // Nếu là thêm mới, reset form
            setFormData({ fullName: '', email: '', phone: '', password: '', role: 'user' });
        }
    }, [user, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h2>{isEditing ? 'Sửa thông tin người dùng' : 'Thêm người dùng mới'}</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Họ Tên</label>
                        <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />
                    </div>
                    <div>
                        <label>Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div>
                        <label>Số điện thoại</label>
                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
                    </div>
                    <div>
                        <label>Mật khẩu</label>
                        <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder={isEditing ? 'Để trống nếu không muốn đổi' : ''} required={!isEditing} />
                    </div>
                    <div>
                        <label>Vai trò</label>
                        <select name="role" value={formData.role} onChange={handleChange}>
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <div className="modal-actions">
                        <button type="button" onClick={onClose} style={{ marginRight: '10px' }}>Hủy</button>
                        <button type="submit">{isEditing ? 'Cập nhật' : 'Thêm mới'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserFormModal;