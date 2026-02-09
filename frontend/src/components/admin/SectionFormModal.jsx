import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../config/api';
import './UserFormModal.css';

const DESIRED_BANNER_WIDTH = 277.5;
const DESIRED_BANNER_HEIGHT = 350;

const SectionFormModal = ({ isOpen, onClose, onSubmit, section }) => {
    const [title, setTitle] = useState('');
    const [type, setType] = useState('promo_with_products');
    const [sortOrder, setSortOrder] = useState(0);
    const [isActive, setIsActive] = useState(true);
    const [link, setLink] = useState('');
    const [bannerImageFile, setBannerImageFile] = useState(null);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [productSearch, setProductSearch] = useState('');
    const [sliderBanners, setSliderBanners] = useState([]);
    const isEditing = section !== null;

    useEffect(() => {
        if (isOpen) {
            axios.get(`${API_URL}/api/v1/products`).then(res => setAllProducts(res.data.data.products));
            if (isEditing && section) {
                setTitle(section.title);
                setType(section.type);
                setSortOrder(section.sortOrder);
                setIsActive(section.isActive);
                setLink(section.content.link || '');
                setSelectedProducts(section.content.products?.map(p => p._id) || []);
                setSliderBanners(section.content.bannerGroup?.map(b => ({ ...b, file: null, isNew: false, tempId: `existing_${b._id}` })) || []);
            } else {
                setTitle(''); setType('promo_with_products'); setSortOrder(0);
                setIsActive(true); setLink(''); setSelectedProducts([]); setSliderBanners([]);
            }
            setBannerImageFile(null); setProductSearch('');
        }
    }, [isOpen, section]);

    const processAndSetBannerFile = (file, tempId) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = DESIRED_BANNER_WIDTH;
                canvas.height = DESIRED_BANNER_HEIGHT;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, DESIRED_BANNER_WIDTH, DESIRED_BANNER_HEIGHT);
                canvas.toBlob((blob) => {
                    const resizedFile = new File([blob], file.name, { type: file.type, lastModified: Date.now() });
                    // SỬA LẠI: Dùng functional update để đảm bảo state luôn mới nhất
                    setSliderBanners(currentBanners => {
                        return currentBanners.map(banner =>
                            banner.tempId === tempId ? { ...banner, file: resizedFile } : banner
                        );
                    });
                }, file.type, 0.8);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    };

    const handleBannerChange = (tempId, field, value) => {
        if (field === 'file' && value) {
            processAndSetBannerFile(value, tempId);
        } else if (field === 'link') {
            setSliderBanners(currentBanners => {
                return currentBanners.map(banner =>
                    banner.tempId === tempId ? { ...banner, link: value } : banner
                );
            });
        }
    };

    // SỬA LẠI: Thêm một ID tạm thời, duy nhất cho mỗi banner mới
    const handleAddBanner = () => {
        const newBanner = {
            image: null,
            link: '',
            file: null,
            isNew: true,
            tempId: `new_${Date.now()}` // ID tạm thời
        };
        setSliderBanners(prev => [...prev, newBanner]);
    };

    const handleRemoveBanner = (tempId) => {
        setSliderBanners(prev => prev.filter(banner => banner.tempId !== tempId));
    };

    const handleProductSelect = (productId) => setSelectedProducts(prev => prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('type', type);
        formData.append('sortOrder', sortOrder);
        formData.append('isActive', isActive);
        formData.append('link', link);
        if (bannerImageFile) formData.append('bannerImage', bannerImageFile);
        if (selectedProducts.length > 0) formData.append('products', selectedProducts.join(','));

        if (type === 'banner_slider') {
            const bannerStructure = sliderBanners.map(banner => ({
                link: banner.link,
                image: banner.file ? '__NEW_FILE__' : banner.image,
                isNew: banner.isNew,
            }));
            formData.append('bannerGroup', JSON.stringify(bannerStructure));

            sliderBanners.forEach(banner => {
                if (banner.file) {
                    formData.append('bannerImages', banner.file);
                }
            });
        }
        onSubmit(formData);
    };

    if (!isOpen) return null;
    const filteredProducts = allProducts.filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase()));

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxHeight: '90vh', overflowY: 'auto' }}>
                <h2>{isEditing ? 'Sửa Section' : 'Thêm Section Mới'}</h2>
                <form onSubmit={handleSubmit}>
                    {/* ... các input khác ... */}
                    <div className="form-group"><label>Tiêu đề Section</label><input value={title} onChange={e => setTitle(e.target.value)} /></div>
                    <div className="form-group"><label>Loại Section</label><select value={type} onChange={e => setType(e.target.value)}><option value="promo_with_products">Banner và Sản phẩm</option><option value="banner_slider">Slider Banner</option></select></div>

                    {type === 'promo_with_products' && (
                        <>
                            <div className="form-group"><label>Ảnh Banner {isEditing ? '(Để trống nếu không đổi)' : ''}</label><input type="file" onChange={e => setBannerImageFile(e.target.files[0])} /></div>
                            <div className="form-group"><label>Chọn sản phẩm</label><div className="searchable-list-container"><input type="text" placeholder="Tìm kiếm sản phẩm..." value={productSearch} onChange={e => setProductSearch(e.target.value)} className="searchable-list-input" /><ul className="searchable-list">{filteredProducts.map(p => (<li key={p._id} onClick={() => handleProductSelect(p._id)}><input type="checkbox" readOnly checked={selectedProducts.includes(p._id)} /><label>{p.name}</label></li>))}</ul></div></div>
                        </>
                    )}
                    {type === 'banner_slider' && (
                        <div className="form-group">
                            <label>Các Banner trong Slider</label>
                            {/* SỬA LẠI: Dùng `tempId` làm key và để truyền vào các hàm xử lý */}
                            {sliderBanners.map((banner) => (
                                <div key={banner.tempId} style={{ border: '1px solid #ddd', padding: '10px', borderRadius: '5px', marginBottom: '10px' }}>
                                    <label>Banner</label>
                                    {banner.image && !banner.isNew && <p><small>Ảnh hiện tại: {banner.image.split('/').pop()}</small></p>}
                                    <input type="file" onChange={e => handleBannerChange(banner.tempId, 'file', e.target.files[0])} />
                                    <input type="text" value={banner.link} onChange={e => handleBannerChange(banner.tempId, 'link', e.target.value)} placeholder="Đường dẫn (VD: /sale)" style={{ marginTop: '5px' }} />
                                    <button type="button" onClick={() => handleRemoveBanner(banner.tempId)} style={{ marginTop: '5px' }}>Xóa Banner</button>
                                </div>
                            ))}
                            <button type="button" onClick={handleAddBanner}>Thêm Banner</button>
                        </div>
                    )}

                    <div className="form-group"><label>Đường dẫn chung (nút "Xem thêm")</label><input value={link} onChange={e => setLink(e.target.value)} placeholder="/lego-city" /></div>
                    <div className="form-group"><label>Thứ tự hiển thị</label><input type="number" value={sortOrder} onChange={e => setSortOrder(e.target.value)} /></div>
                    <div className="form-group"><label style={{ display: 'flex', alignItems: 'center' }}><input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} style={{ width: 'auto', marginRight: '10px' }} /> Kích hoạt</label></div>
                    <div className="modal-actions"><button type="button" onClick={onClose}>Hủy</button><button type="submit">{isEditing ? 'Cập nhật' : 'Tạo mới'}</button></div>
                </form>
            </div>
        </div>
    );
};
export default SectionFormModal;