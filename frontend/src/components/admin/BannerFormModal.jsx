import React, { useState, useEffect } from 'react';
import './UserFormModal.css'; // Dùng lại CSS cũ

const BannerFormModal = ({ isOpen, onClose, onSubmit, banner }) => {
    const [link, setLink] = useState('/');
    const [imageFile, setImageFile] = useState(null);
    const [isActive, setIsActive] = useState(true);
    const isEditing = banner !== null;

    useEffect(() => {
        if (isEditing && banner) {
            setLink(banner.link);
            setIsActive(banner.isActive);
        } else {
            setLink('/');
            setIsActive(true);
        }
    }, [banner, isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('link', link);
        formData.append('isActive', isActive);
        if (imageFile) {
            formData.append('image', imageFile);
        }
        onSubmit(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h2>{isEditing ? 'Sửa Banner' : 'Thêm Banner Mới'}</h2>
                <form onSubmit={handleSubmit}>
                    <input value={link} onChange={e => setLink(e.target.value)} placeholder="Đường dẫn (ví dụ: /sales/summer)" />
                    <label>Ảnh Banner {isEditing ? '(Để trống nếu không đổi)' : '(Bắt buộc)'}</label>
                    <input type="file" onChange={e => setImageFile(e.target.files[0])} required={!isEditing} />
                    <label><input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} /> Kích hoạt</label>
                    <div className="modal-actions">
                        <button type="button" onClick={onClose}>Hủy</button>
                        <button type="submit">{isEditing ? 'Cập nhật' : 'Tạo mới'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BannerFormModal;