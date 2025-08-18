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
        categories: [],
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
        // Luôn tải danh sách các lựa chọn (categories, brands, collections)
        const fetchOptions = async () => {
            const catRes = await axios.get('http://localhost:5000/api/v1/categories');
            setCategories(catRes.data.data.categories);
            const brandRes = await axios.get('http://localhost:5000/api/v1/brands');
            setBrands(brandRes.data.data.brands);
            const colRes = await axios.get('http://localhost:5000/api/v1/collections');
            setCollections(colRes.data.data.collections);
        };
        
        fetchOptions();

        // Nếu ở chế độ sửa, tải dữ liệu sản phẩm và điền vào form
        if (isEditing) {
            axios.get(`http://localhost:5000/api/v1/products/${id}`)
                .then(res => {
                    const product = res.data.data.product;
                    setFormData({
                        name: product.name || '',
                        description: product.description || '',
                        importPrice: product.importPrice || 0,
                        sellPrice: product.sellPrice || 0,
                        stockQuantity: product.stockQuantity || 0,
                        // Đảm bảo lấy đúng mảng ID cho categories
                        categories: product.categories?.map(c => c._id) || [],
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
        const newAges = currentAges.includes(value) ? currentAges.filter(age => age !== value) : [...currentAges, value];
        setFormData({ ...formData, ageGroups: newAges });
    };

    const handleCategoryChange = (catId) => {
        const currentCats = formData.categories;
        const newCats = currentCats.includes(catId) ? currentCats.filter(id => id !== catId) : [...currentCats, catId];
        setFormData({ ...formData, categories: newCats });
    };

    const handleFileChange = e => {
        setFiles({ ...files, [e.target.name]: e.target.files });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        const data = new FormData();
        
        // Gửi dữ liệu form đi
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
        
        // Gửi file
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
        <div className="form-container" style={{background: 'white', padding: '20px', borderRadius: '8px'}}>
            <h1>{isEditing ? 'Sửa Sản phẩm' : 'Thêm Sản phẩm mới'}</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group"><label>Tên sản phẩm</label><input name="name" value={formData.name} onChange={handleChange} required /></div>
                <div className="form-group"><label>Mô tả</label><textarea name="description" value={formData.description} onChange={handleChange} required rows="4"/></div>
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
                                <input type="checkbox" checked={formData.ageGroups.includes(group.value)} onChange={() => handleAgeChange(group.value)} style={{ marginRight: '5px' }} />
                                {group.label}
                            </label>
                        ))}
                    </div>
                </div>
                
                <div className="form-group">
                    <label>Danh mục (Có thể chọn nhiều)</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', border: '1px solid #ddd', padding: '10px', borderRadius: '4px' }}>
                        {categories.map(cat => (
                            <label key={cat._id} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                <input type="checkbox" checked={formData.categories.includes(cat._id)} onChange={() => handleCategoryChange(cat._id)} style={{ marginRight: '5px' }} />
                                {cat.name}
                            </label>
                        ))}
                    </div>
                </div>

                <div className="form-group"><label>Thương hiệu (Tùy chọn)</label><select name="brand" value={formData.brand} onChange={handleChange}><option value="">-- Chọn thương hiệu --</option>{brands.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}</select></div>
                <div className="form-group"><label>Bộ sưu tập (Tùy chọn)</label><select name="productCollection" value={formData.productCollection} onChange={handleChange}><option value="">-- Chọn bộ sưu tập --</option>{collections.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}</select></div>
                <div className="form-group"><label>Ảnh đại diện (Để trống nếu không muốn đổi)</label><input type="file" name="mainImage" onChange={handleFileChange} /></div>
                <div className="form-group"><label>Album ảnh chi tiết (Để trống nếu không muốn đổi)</label><input type="file" name="detailImages" onChange={handleFileChange} multiple /></div>
                <button type="submit" className="btn-primary">{isEditing ? 'Cập nhật' : 'Tạo sản phẩm'}</button>
            </form>
        </div>
    );
};

export default ProductForm;