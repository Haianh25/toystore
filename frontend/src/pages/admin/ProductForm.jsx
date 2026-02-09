import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { API_URL } from '../../config/api';
import './ProductForm.css';

const ageGroups = [
    { label: '1 - 3 Tuổi', value: '1-3' },
    { label: '3 - 6 Tuổi', value: '3-6' },
    { label: '6 - 12 Tuổi', value: '6-12' },
    { label: '12 Tuổi +', value: '12+' },
];

const ProductForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        importPrice: 0,
        sellPrice: 0,
        stockQuantity: 0,
        categories: [],
        brand: '',
        productCollection: '',
        ageGroups: [],
    });
    const [files, setFiles] = useState({ mainImage: null, detailImages: [] });
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = Boolean(id);

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const [catRes, brandRes, colRes] = await Promise.all([
                    axios.get(`${API_URL}/api/v1/categories`),
                    axios.get(`${API_URL}/api/v1/brands`),
                    axios.get(`${API_URL}/api/v1/collections`)
                ]);
                setCategories(catRes.data?.data?.categories || []);
                setBrands(brandRes.data?.data?.brands || []);
                setCollections(colRes.data?.data?.collections || []);
            } catch (err) {
                console.error("Lỗi tải tùy chọn:", err);
            }
        };

        fetchOptions();

        if (isEditing) {
            const fetchProduct = async () => {
                try {
                    const { data } = await axios.get(`${API_URL}/api/v1/products/${id}`);
                    const product = data?.data?.data || data?.data?.product || data?.data || {};
                    console.log("Dữ liệu sản phẩm thực tế:", product);

                    setFormData({
                        name: product.name || '',
                        description: product.description || '',
                        importPrice: product.importPrice || 0,
                        sellPrice: product.sellPrice || 0,
                        stockQuantity: product.stockQuantity || 0,
                        categories: product.categories?.map(c => typeof c === 'object' ? c._id : c) || [],
                        brand: typeof product.brand === 'object' ? product.brand?._id : product.brand || '',
                        productCollection: typeof product.productCollection === 'object' ? product.productCollection?._id : product.productCollection || '',
                        ageGroups: product.ageGroups || [],
                    });
                } catch (err) {
                    console.error("Lỗi tải chi tiết sản phẩm:", err);
                }
            };
            fetchProduct();
        }
    }, [id, isEditing]);

    const handleChange = e => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const toggleItem = (list, item, field) => {
        const currentList = [...formData[field]];
        const index = currentList.indexOf(item);
        if (index > -1) {
            currentList.splice(index, 1);
        } else {
            currentList.push(item);
        }
        setFormData({ ...formData, [field]: currentList });
    };

    const handleFileChange = e => {
        setFiles({ ...files, [e.target.name]: e.target.files });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        const data = new FormData();

        Object.keys(formData).forEach(key => {
            const value = formData[key];
            if (Array.isArray(value)) {
                if (value.length > 0) {
                    data.append(key, value.join(','));
                }
            } else if (value !== null && value !== '') {
                data.append(key, value);
            }
        });

        if (files.mainImage && files.mainImage[0]) {
            data.append('mainImage', files.mainImage[0]);
        }
        if (files.detailImages && files.detailImages.length > 0) {
            for (let i = 0; i < files.detailImages.length; i++) {
                data.append('detailImages', files.detailImages[i]);
            }
        }

        try {
            const apiConfig = { headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` } };
            if (isEditing) {
                await axios.patch(`${API_URL}/api/v1/products/${id}`, data, apiConfig);
            } else {
                await axios.post(`${API_URL}/api/v1/products`, data, apiConfig);
            }
            navigate('/admin/products');
        } catch (error) {
            console.error("Lỗi lưu sản phẩm:", error);
            alert(`Lỗi: ${error.response?.data?.message || 'Có lỗi xảy ra'}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="product-form-container">
            <div className="form-header">
                <h1>{isEditing ? 'Biên Tập Sản Phẩm' : 'Sáng Tạo Sản Phẩm Mới'}</h1>
                <p style={{ color: '#999', fontSize: '0.7rem', letterSpacing: '0.1em' }}>THEDEVILPLAYZ ADMIN</p>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="form-body-grid">
                    {/* Cột trái: Thông tin chính */}
                    <div className="form-column">
                        <section className="form-section">
                            <span className="section-title">01 Thông tin chung</span>
                            <div className="input-group">
                                <label>Tên Tuyệt Tác</label>
                                <input name="name" className="luxury-input" value={formData.name} onChange={handleChange} required placeholder="Nhập tên..." />
                            </div>
                            <div className="input-group">
                                <label>Câu Chuyện Sản Phẩm</label>
                                <textarea name="description" className="luxury-textarea" value={formData.description} onChange={handleChange} required placeholder="Mô tả tinh tế..." />
                            </div>
                        </section>

                        <section className="form-section">
                            <span className="section-title">02 Thương mại & Kho</span>
                            <div className="input-grid">
                                <div className="input-group">
                                    <label>Giá Nhập (VND)</label>
                                    <input type="number" name="importPrice" className="luxury-input" value={formData.importPrice} onChange={handleChange} required />
                                </div>
                                <div className="input-group">
                                    <label>Giá Niêm Yết (VND)</label>
                                    <input type="number" name="sellPrice" className="luxury-input" value={formData.sellPrice} onChange={handleChange} required />
                                </div>
                            </div>
                            <div className="input-group" style={{ marginTop: '10px' }}>
                                <label>Số Lượng Khả Dụng</label>
                                <input type="number" name="stockQuantity" className="luxury-input" value={formData.stockQuantity} onChange={handleChange} required />
                            </div>
                        </section>
                    </div>

                    {/* Cột phải: Phân loại & Ảnh */}
                    <div className="form-column">
                        <section className="form-section">
                            <span className="section-title">03 Phân loại</span>
                            <div className="input-grid">
                                <div className="input-group">
                                    <label>Thương Hiệu</label>
                                    <select name="brand" className="luxury-select" value={formData.brand} onChange={handleChange}>
                                        <option value="">-- Chọn --</option>
                                        {brands.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                                    </select>
                                </div>
                                <div className="input-group">
                                    <label>Bộ Sưu Tập</label>
                                    <select name="productCollection" className="luxury-select" value={formData.productCollection} onChange={handleChange}>
                                        <option value="">-- Chọn --</option>
                                        {collections.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="input-group" style={{ marginTop: '15px' }}>
                                <label>Độ Tuổi</label>
                                <div className="tags-container">
                                    {ageGroups.map(group => (
                                        <div
                                            key={group.value}
                                            className={`tag-item ${formData.ageGroups.includes(group.value) ? 'active' : ''}`}
                                            onClick={() => toggleItem(formData.ageGroups, group.value, 'ageGroups')}
                                        >
                                            {group.label}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="input-group" style={{ marginTop: '15px' }}>
                                <label>Danh Mục</label>
                                <div className="tags-container">
                                    {categories.map(cat => (
                                        <div
                                            key={cat._id}
                                            className={`tag-item ${formData.categories.includes(cat._id) ? 'active' : ''}`}
                                            onClick={() => toggleItem(formData.categories, cat._id, 'categories')}
                                        >
                                            {cat.name}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        <section className="form-section" style={{ borderBottom: 'none' }}>
                            <span className="section-title">04 Media</span>
                            <div className="input-grid">
                                <div className="input-group">
                                    <label>Ảnh Chính</label>
                                    <div className="file-upload-wrapper">
                                        <span className="file-upload-label">{files.mainImage ? 'Sẵn sàng' : 'Chọn ảnh'}</span>
                                        <input type="file" name="mainImage" className="file-upload-input" onChange={handleFileChange} />
                                    </div>
                                </div>
                                <div className="input-group">
                                    <label>Album Ảnh</label>
                                    <div className="file-upload-wrapper">
                                        <span className="file-upload-label">{files.detailImages?.length || 0} ảnh</span>
                                        <input type="file" name="detailImages" className="file-upload-input" onChange={handleFileChange} multiple />
                                    </div>
                                </div>
                            </div>
                        </section>

                        <div className="form-footer">
                            <button type="submit" className="submit-btn" disabled={loading}>
                                {loading ? 'Đang Xử Lý...' : (isEditing ? 'Cập Nhật' : 'Khởi Tạo')}
                            </button>
                            <Link to="/admin/products" className="cancel-btn">Hủy bỏ</Link>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ProductForm;