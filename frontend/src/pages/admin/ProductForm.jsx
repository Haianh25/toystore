import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const ageGroups = [
    { label: '1 - 3 tuổi', value: '1-3' },
    { label: '3 - 6 tuổi', value: '3-6' },
    { label: '6 - 12 tuổi', value: '6-12' },
    { label: '12 tuổi trở lên', value: '12+' },
];

const ProductForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        importPrice: 0,
        sellPrice: 0,
        stockQuantity: 0,
        category: '',
        brand: '',
        productCollection: '',
        ageGroups: [],
    });
    const [files, setFiles] = useState({ mainImage: null, detailImages: [] });
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [collections, setCollections] = useState([]);
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = Boolean(id);

    useEffect(() => {
        axios.get('http://localhost:5000/api/v1/categories').then(res => setCategories(res.data.data.categories));
        axios.get('http://localhost:5000/api/v1/brands').then(res => setBrands(res.data.data.brands));
        axios.get('http://localhost:5000/api/v1/collections').then(res => setCollections(res.data.data.collections));

        if (isEditing) {
            axios.get(`http://localhost:5000/api/v1/products/${id}`)
                .then(res => {
                    const product = res.data.data.product;
                    setFormData({
                        name: product.name,
                        description: product.description,
                        importPrice: product.importPrice,
                        sellPrice: product.sellPrice,
                        stockQuantity: product.stockQuantity,
                        category: product.category._id,
                        brand: product.brand?._id || '',
                        productCollection: product.productCollection?._id || '',
                        ageGroups: product.ageGroups || [],
                    });
                });
        }
    }, [id, isEditing]);

    const handleChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAgeChange = (value) => {
        const currentAges = formData.ageGroups;
        const newAges = currentAges.includes(value)
            ? currentAges.filter(age => age !== value)
            : [...currentAges, value];
        setFormData({ ...formData, ageGroups: newAges });
    };

    const handleFileChange = e => {
        setFiles({ ...files, [e.target.name]: e.target.files });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        const data = new FormData();
        
        for (const key in formData) {
            if (key === 'ageGroups') {
                if (formData.ageGroups.length > 0) {
                    data.append('ageGroups', formData.ageGroups.join(','));
                }
            } else if (formData[key] !== null && formData[key] !== '') {
                data.append(key, formData[key]);
            }
        }
        
        if (files.mainImage) {
            data.append('mainImage', files.mainImage[0]);
        }
        if (files.detailImages) {
            for (let i = 0; i < files.detailImages.length; i++) {
                data.append('detailImages', files.detailImages[i]);
            }
        }

        try {
            const apiConfig = { headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` } };
            if (isEditing) {
                await axios.patch(`http://localhost:5000/api/v1/products/${id}`, data, apiConfig);
            } else {
                await axios.post('http://localhost:5000/api/v1/products', data, apiConfig);
            }
            navigate('/admin/products');
        } catch (error) {
            console.error("Lỗi lưu sản phẩm:", error);
            alert(`Lỗi: ${error.response?.data?.message || 'Có lỗi xảy ra'}`);
        }
    };

    return (
        <div className="form-container">
            <h1>{isEditing ? 'Sửa Sản phẩm' : 'Thêm Sản phẩm mới'}</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group"><label>Tên sản phẩm</label><input name="name" value={formData.name} onChange={handleChange} required /></div>
                <div className="form-group"><label>Mô tả</label><textarea name="description" value={formData.description} onChange={handleChange} required /></div>
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px'}}>
                    <div className="form-group"><label>Giá nhập</label><input type="number" name="importPrice" value={formData.importPrice} onChange={handleChange} required /></div>
                    <div className="form-group"><label>Giá bán</label><input type="number" name="sellPrice" value={formData.sellPrice} onChange={handleChange} required /></div>
                    <div className="form-group"><label>Số lượng tồn kho</label><input type="number" name="stockQuantity" value={formData.stockQuantity} onChange={handleChange} required /></div>
                </div>
                
                <div className="form-group">
                    <label>Độ tuổi (Có thể chọn nhiều)</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', border: '1px solid #ddd', padding: '10px', borderRadius: '4px' }}>
                        {ageGroups.map(group => (
                            <label key={group.label} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    name="ageGroup"
                                    checked={formData.ageGroups.includes(group.value)}
                                    onChange={() => handleAgeChange(group.value)}
                                    style={{ marginRight: '5px' }}
                                />
                                {group.label}
                            </label>
                        ))}
                    </div>
                </div>
                
                <div className="form-group"><label>Danh mục</label><select name="category" value={formData.category} onChange={handleChange} required><option value="">-- Chọn danh mục --</option>{categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}</select></div>
                <div className="form-group"><label>Thương hiệu (Tùy chọn)</label><select name="brand" value={formData.brand} onChange={handleChange}><option value="">-- Chọn thương hiệu --</option>{brands.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}</select></div>
                <div className="form-group"><label>Bộ sưu tập (Tùy chọn)</label><select name="productCollection" value={formData.productCollection} onChange={handleChange}><option value="">-- Chọn bộ sưu tập --</option>{collections.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}</select></div>
                <div className="form-group"><label>Ảnh đại diện</label><input type="file" name="mainImage" onChange={handleFileChange} required={!isEditing} /></div>
                <div className="form-group"><label>Album ảnh chi tiết (Tối đa 10)</label><input type="file" name="detailImages" onChange={handleFileChange} multiple /></div>
                <button type="submit" className="btn-primary">{isEditing ? 'Cập nhật' : 'Tạo sản phẩm'}</button>
            </form>
        </div>
    );
};

export default ProductForm;