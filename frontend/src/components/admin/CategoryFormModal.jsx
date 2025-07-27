import React, { useState, useEffect } from 'react';
import './UserFormModal.css'; // Dùng lại CSS của UserFormModal

const CategoryFormModal = ({ isOpen, onClose, onSubmit, category }) => {
    const [name, setName] = useState('');
    const [sortOrder, setSortOrder] = useState(0);
    const [status, setStatus] = useState('Active');
    const [selectedFile, setSelectedFile] = useState(null);

    const isEditing = category !== null;

    useEffect(() => {
        if (isEditing && isOpen) {
            setName(category.name);
            setSortOrder(category.sortOrder);
            setStatus(category.status);
        } else {
            // Reset form khi thêm mới
            setName('');
            setSortOrder(0);
            setStatus('Active');
        }
        setSelectedFile(null); // Luôn reset file khi mở modal
    }, [category, isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(); // <<== Dùng FormData để gửi file
        formData.append('name', name);
        formData.append('sortOrder', sortOrder);
        formData.append('status', status);
        if (selectedFile) {
            formData.append('bannerImage', selectedFile);
        }
        onSubmit(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h2>{isEditing ? 'Sửa Danh mục' : 'Thêm Danh mục mới'}</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Tên Danh mục</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} required />
                    </div>
                    <div>
                        <label>Ảnh Banner</label>
                        <input type="file" onChange={e => setSelectedFile(e.target.files[0])} required={!isEditing} />
                        {isEditing && <p style={{fontSize: '12px', color: 'gray'}}>Để trống nếu không muốn đổi ảnh</p>}
                    </div>
                    <div>
                        <label>Thứ tự hiển thị</label>
                        <input type="number" value={sortOrder} onChange={e => setSortOrder(e.target.value)} />
                    </div>
                    <div>
                        <label>Trạng thái</label>
                        <select value={status} onChange={e => setStatus(e.target.value)}>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
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

export default CategoryFormModal;