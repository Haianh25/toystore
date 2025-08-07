import React, { useState, useEffect } from 'react';
import './UserFormModal.css';

const CollectionFormModal = ({ isOpen, onClose, onSubmit, collection }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const isEditing = collection !== null;

    useEffect(() => {
        if (isEditing && collection) {
            setName(collection.name);
            setDescription(collection.description || '');
        } else {
            setName('');
            setDescription('');
        }
    }, [collection, isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ name, description });
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h2>{isEditing ? 'Sửa Bộ sưu tập' : 'Thêm Bộ sưu tập Mới'}</h2>
                <form onSubmit={handleSubmit}>
                    <input value={name} onChange={e => setName(e.target.value)} placeholder="Tên bộ sưu tập" required />
                    <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Mô tả" />
                    <div className="modal-actions">
                        <button type="button" onClick={onClose}>Hủy</button>
                        <button type="submit">{isEditing ? 'Cập nhật' : 'Tạo mới'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CollectionFormModal;