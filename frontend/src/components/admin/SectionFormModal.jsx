import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserFormModal.css';

const SectionFormModal = ({ isOpen, onClose, onSubmit, section }) => {
    const [title, setTitle] = useState('');
    const [type, setType] = useState('product_grid');
    const [sortOrder, setSortOrder] = useState(0);
    const [isActive, setIsActive] = useState(true);
    const [link, setLink] = useState('');
    const [bannerImageFile, setBannerImageFile] = useState(null);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const isEditing = section !== null;

    useEffect(() => {
        if (isOpen) {
            axios.get('http://localhost:5000/api/v1/products?excludeActiveSale=true')
                .then(res => setAllProducts(res.data.data.products));

            if (isEditing && section) {
                setTitle(section.title);
                setType(section.type);
                setSortOrder(section.sortOrder);
                setIsActive(section.isActive);
                setLink(section.content.link || '');
                setSelectedProducts(section.content.products.map(p => p._id) || []);
            } else {
                setTitle('');
                setType('product_grid');
                setSortOrder(0);
                setIsActive(true);
                setLink('');
                setSelectedProducts([]);
            }
            setBannerImageFile(null);
        }
    }, [isOpen, section]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('type', type);
        formData.append('sortOrder', sortOrder);
        formData.append('isActive', isActive);
        formData.append('link', link);
        if (bannerImageFile) {
            formData.append('bannerImage', bannerImageFile);
        }
        if (selectedProducts.length > 0) {
            formData.append('products', selectedProducts.join(','));
        }
        onSubmit(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxHeight: '90vh', overflowY: 'auto' }}>
                <h2>{isEditing ? 'Sửa Section' : 'Thêm Section Mới'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Tiêu đề Section</label>
                        <input value={title} onChange={e => setTitle(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Loại Section</label>
                        <select value={type} onChange={e => setType(e.target.value)}>
                            <option value="product_grid">Lưới sản phẩm</option>
                            <option value="product_slider">Slider sản phẩm</option>
                            <option value="single_banner">Banner đơn</option>
                            <option value="promo_with_products">Banner quảng cáo và sản phẩm</option>
                        </select>
                    </div>

                    {/* --- Phần nội dung động --- */}
                    {(type === 'single_banner' || type === 'promo_with_products') && (
                        <div className="form-group">
                            <label>Ảnh Banner {isEditing ? '(Để trống nếu không đổi)' : ''}</label>
                            <input type="file" onChange={e => setBannerImageFile(e.target.files[0])} required={!isEditing && (type === 'single_banner' || type === 'promo_with_products')} />
                        </div>
                    )}
                    
                    {(type === 'product_grid' || type === 'product_slider' || type === 'promo_with_products') && (
                        <div className="form-group">
                            <label>Chọn sản phẩm (Tối đa 10)</label>
                            <select multiple value={selectedProducts} onChange={e => setSelectedProducts(Array.from(e.target.selectedOptions, option => option.value))} size="8">
                                {allProducts.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                            </select>
                        </div>
                    )}
                    
                    <div className="form-group">
                        <label>Đường dẫn (cho Banner hoặc nút "Xem thêm")</label>
                        <input value={link} onChange={e => setLink(e.target.value)} placeholder="/lego-city" />
                    </div>
                    {/* --- Kết thúc phần nội dung động --- */}
                    
                    <div className="form-group">
                        <label>Thứ tự hiển thị</label>
                        <input type="number" value={sortOrder} onChange={e => setSortOrder(e.target.value)} />
                    </div>
                    
                    <div className="form-group">
                         <label style={{display: 'flex', alignItems: 'center'}}>
                            <input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} style={{width: 'auto', marginRight: '10px'}}/> 
                            Kích hoạt
                        </label>
                    </div>

                    <div className="modal-actions">
                        <button type="button" onClick={onClose}>Hủy</button>
                        <button type="submit">{isEditing ? 'Cập nhật' : 'Tạo mới'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SectionFormModal;