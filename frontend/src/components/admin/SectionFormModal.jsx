import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserFormModal.css'; // Dùng lại CSS cũ

const SectionFormModal = ({ isOpen, onClose, onSubmit }) => {
    const [title, setTitle] = useState('');
    const [type, setType] = useState('product_grid');
    const [sortOrder, setSortOrder] = useState(0);
    const [isActive, setIsActive] = useState(true);

    // State cho nội dung section
    const [link, setLink] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [selectedProducts, setSelectedProducts] = useState([]);
    
    const [allProducts, setAllProducts] = useState([]);

    // Tải danh sách tất cả sản phẩm khi modal được mở
    useEffect(() => {
        if (isOpen) {
            const fetchAllProducts = async () => {
                const res = await axios.get('http://localhost:5000/api/v1/products');
                setAllProducts(res.data.data.products);
            };
            fetchAllProducts();
        }
    }, [isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('type', type);
        formData.append('sortOrder', sortOrder);
        formData.append('isActive', isActive);

        if (type === 'single_banner') {
            formData.append('link', link);
            if (imageFile) formData.append('image', imageFile);
        } else {
            formData.append('products', selectedProducts.join(','));
        }
        onSubmit(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h2>Thêm Section Mới</h2>
                <form onSubmit={handleSubmit}>
                    <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Tiêu đề Section" required />
                    <select value={type} onChange={e => setType(e.target.value)}>
                        <option value="product_grid">Lưới sản phẩm</option>
                        <option value="product_slider">Slider sản phẩm</option>
                        <option value="single_banner">Banner đơn</option>
                    </select>

                    {/* Hiển thị các trường tùy theo loại section */}
                    {type === 'single_banner' && (
                        <>
                            <input value={link} onChange={e => setLink(e.target.value)} placeholder="Đường dẫn (link)" />
                            <input type="file" onChange={e => setImageFile(e.target.files[0])} required />
                        </>
                    )}
                    {(type === 'product_grid' || type === 'product_slider') && (
                        <select multiple value={selectedProducts} onChange={e => setSelectedProducts(Array.from(e.target.selectedOptions, option => option.value))} size="8">
                            {allProducts.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                        </select>
                    )}

                    <input type="number" value={sortOrder} onChange={e => setSortOrder(e.target.value)} placeholder="Thứ tự hiển thị" />
                    <label><input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} /> Kích hoạt</label>
                    
                    <div className="modal-actions">
                        <button type="button" onClick={onClose}>Hủy</button>
                        <button type="submit">Tạo mới</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SectionFormModal;