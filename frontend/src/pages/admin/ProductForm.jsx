import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';


const ProductForm = () => {
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [collections, setCollections] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: '',
        brand: '',
        productCollection: '', // <-- Đã sửa
        importPrice: '',
        sellPrice: '',
        weight: '',
        stockQuantity: '',
        barcode: ''
    });
    const [mainImage, setMainImage] = useState(null);
    const [detailImages, setDetailImages] = useState([]);
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = Boolean(id);
    const apiConfig = { headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` } };

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [catRes, brandRes, collectionRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/v1/categories', apiConfig),
                    axios.get('http://localhost:5000/api/v1/brands', apiConfig),
                    axios.get('http://localhost:5000/api/v1/collections', apiConfig)
                ]);
                setCategories(catRes.data.data.categories);
                setBrands(brandRes.data.data.brands);
                setCollections(collectionRes.data.data.collections);

                if (isEditing) {
                    const productRes = await axios.get(`http://localhost:5000/api/v1/products/${id}`, apiConfig);
                    const productData = productRes.data.data.product;
                    setFormData({
                        name: productData.name,
                        description: productData.description,
                        category: productData.category._id,
                        brand: productData.brand?._id || '',
                        productCollection: productData.productCollection?._id || '', // <-- Đã sửa
                        importPrice: productData.importPrice,
                        sellPrice: productData.sellPrice,
                        weight: productData.weight,
                        stockQuantity: productData.stockQuantity,
                        barcode: productData.barcode || '',
                    });
                }
            } catch (error) {
                console.error("Lỗi tải dữ liệu:", error);
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
            if (formData[key]) productData.append(key, formData[key]);
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
            if (isEditing) {
                await axios.patch(`http://localhost:5000/api/v1/products/${id}`, productData, apiConfig);
                alert('Cập nhật sản phẩm thành công!');
            } else {
                await axios.post('http://localhost:5000/api/v1/products', productData, apiConfig);
                alert('Thêm sản phẩm thành công!');
            }
            navigate('/admin/products');
        } catch (error) {
            alert('Thao tác thất bại: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>{isEditing ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}</h1>
            </div>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '700px', backgroundColor: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <input name="name" placeholder="Tên sản phẩm" value={formData.name} onChange={handleChange} required style={{padding: '10px'}}/>
                <textarea name="description" placeholder="Mô tả sản phẩm" value={formData.description} onChange={handleChange} required style={{padding: '10px', minHeight: '100px'}}/>
                
                <select name="category" value={formData.category} onChange={handleChange} required style={{padding: '10px'}}>
                    <option value="">-- Chọn danh mục --</option>
                    {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                </select>

                <select name="brand" value={formData.brand} onChange={handleChange} style={{padding: '10px'}}>
                    <option value="">-- Chọn thương hiệu (nếu có) --</option>
                    {brands.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                </select>
                
                <select name="productCollection" value={formData.productCollection} onChange={handleChange} style={{padding: '10px'}}> {/* <-- Đã sửa */}
                    <option value="">-- Chọn bộ sưu tập (nếu có) --</option>
                    {collections.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>

                <input type="number" name="importPrice" placeholder="Giá nhập" value={formData.importPrice} onChange={handleChange} required style={{padding: '10px'}}/>
                <input type="number" name="sellPrice" placeholder="Giá bán" value={formData.sellPrice} onChange={handleChange} required style={{padding: '10px'}}/>
                <input type="number" name="stockQuantity" placeholder="Số lượng tồn kho" value={formData.stockQuantity} onChange={handleChange} required style={{padding: '10px'}}/>
                <input type="number" name="weight" placeholder="Trọng lượng (gram)" value={formData.weight} onChange={handleChange} style={{padding: '10px'}}/>
                <input name="barcode" placeholder="Barcode (tùy chọn)" value={formData.barcode} onChange={handleChange} style={{padding: '10px'}}/>
                
                <div>
                    <label>Ảnh đại diện {isEditing && '(Để trống nếu không muốn đổi)'}</label>
                    <input type="file" onChange={e => setMainImage(e.target.files[0])} required={!isEditing} />
                </div>
                <div>
                    <label>Album ảnh chi tiết {isEditing && '(Để trống nếu không muốn đổi)'}</label>
                    <input type="file" onChange={e => setDetailImages(e.target.files)} multiple />
                </div>

                <button type="submit" className="btn-primary" style={{marginTop: '10px'}}>{isEditing ? 'Cập nhật' : 'Thêm sản phẩm'}</button>
            </form>
        </div>
    );
};

export default ProductForm;