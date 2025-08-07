import React, { useState, useEffect } from 'react';
import './UserFormModal.css'; // Dùng lại CSS cũ

const BrandFormModal = ({ isOpen, onClose, onSubmit, brand }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [logoFile, setLogoFile] = useState(null);
    const isEditing = brand !== null;

    useEffect(() => {
        if (isEditing && brand) {
            setName(brand.name);
            setDescription(brand.description || '');
        } else {
            setName('');
            setDescription('');
        }
        setLogoFile(null);
    }, [brand, isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        if (logoFile) {
            formData.append('logo', logoFile);
        }
        onSubmit(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h2>{isEditing ? 'Sửa Thương hiệu' : 'Thêm Thương hiệu Mới'}</h2>
                <form onSubmit={handleSubmit}>
                    <input value={name} onChange={e => setName(e.target.value)} placeholder="Tên thương hiệu" required />
                    <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Mô tả" />
                    <label>Logo</label>
                    <input type="file" onChange={e => setLogoFile(e.target.files[0])} required={!isEditing} />
                    {isEditing && <small>Để trống nếu không muốn đổi logo</small>}
                    <div className="modal-actions">
                        <button type="button" onClick={onClose}>Hủy</button>
                        <button type="submit">{isEditing ? 'Cập nhật' : 'Tạo mới'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BrandFormModal;