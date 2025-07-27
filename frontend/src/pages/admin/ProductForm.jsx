import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const ProductForm = () => {
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        name: '', description: '', category: '', importPrice: '',
        sellPrice: '', weight: '', stockQuantity: '', barcode: ''
    });
    const [mainImage, setMainImage] = useState(null);
    const [detailImages, setDetailImages] = useState([]);
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = Boolean(id);

    useEffect(() => {
        const fetchInitialData = async () => {
            // Lấy danh sách danh mục
            try {
                const catRes = await axios.get('http://localhost:5000/api/v1/categories');
                setCategories(catRes.data.data.categories);
            } catch (error) {
                console.error('Không thể tải danh mục', error);
            }

            // Nếu là trang SỬA, lấy dữ liệu sản phẩm hiện tại
            if (isEditing) {
                try {
                    const productRes = await axios.get(`http://localhost:5000/api/v1/products/${id}`);
                    const productData = productRes.data.data.product;
                    setFormData({
                        name: productData.name,
                        description: productData.description,
                        category: productData.category._id,
                        importPrice: productData.importPrice,
                        sellPrice: productData.sellPrice,
                        weight: productData.weight,
                        stockQuantity: productData.stockQuantity,
                        barcode: productData.barcode || '',
                    });
                } catch (error) {
                    console.error('Không thể tải dữ liệu sản phẩm', error);
                }
            }
        };
        fetchInitialData();
    }, [id, isEditing]);

    const handleChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        const productData = new FormData();
        for (const key in formData) {
            productData.append(key, formData[key]);
        }
        if (mainImage) {
            productData.append('mainImage', mainImage);
        }
        if (detailImages.length > 0) {
            for (let i = 0; i < detailImages.length; i++) {
                productData.append('detailImages', detailImages[i]);
            }
        }
        
        try {
            const apiConfig = { headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` } };
            
            if (isEditing) {
                // Logic cập nhật
                await axios.patch(`http://localhost:5000/api/v1/products/${id}`, productData, apiConfig);
                alert('Cập nhật sản phẩm thành công!');
            } else {
                // Logic tạo mới
                await axios.post('http://localhost:5000/api/v1/products', productData, apiConfig);
                alert('Thêm sản phẩm thành công!');
            }
            navigate('/admin/products');
        } catch (error) {
            alert('Thao tác thất bại: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div>
            <h1>{isEditing ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}</h1>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '700px' }}>
                <input name="name" placeholder="Tên sản phẩm" value={formData.name} onChange={handleChange} required />
                <textarea name="description" placeholder="Mô tả sản phẩm" value={formData.description} onChange={handleChange} required />
                <select name="category" value={formData.category} onChange={handleChange} required>
                    <option value="">-- Chọn danh mục --</option>
                    {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                </select>
                <input type="number" name="importPrice" placeholder="Giá nhập" value={formData.importPrice} onChange={handleChange} required />
                <input type="number" name="sellPrice" placeholder="Giá bán" value={formData.sellPrice} onChange={handleChange} required />
                <input type="number" name="stockQuantity" placeholder="Số lượng tồn kho" value={formData.stockQuantity} onChange={handleChange} required />
                <input type="number" name="weight" placeholder="Trọng lượng (gram)" value={formData.weight} onChange={handleChange} />
                <input name="barcode" placeholder="Barcode (tùy chọn)" value={formData.barcode} onChange={handleChange} />
                
                <div>
                    <label>Ảnh đại diện {isEditing && '(Để trống nếu không muốn đổi)'}</label>
                    <input type="file" onChange={e => setMainImage(e.target.files[0])} required={!isEditing} />
                </div>
                <div>
                    <label>Album ảnh chi tiết {isEditing && '(Để trống nếu không muốn đổi)'}</label>
                    <input type="file" onChange={e => setDetailImages(e.target.files)} multiple />
                </div>
                <button type="submit">{isEditing ? 'Cập nhật' : 'Thêm sản phẩm'}</button>
            </form>
        </div>
    );
};

export default ProductForm;