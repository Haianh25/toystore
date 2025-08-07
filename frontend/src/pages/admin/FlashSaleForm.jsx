import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './FlashSaleForm.css';

const FlashSaleForm = () => {
    const [title, setTitle] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [products, setProducts] = useState([]);
    
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = Boolean(id);
    const apiConfig = { headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }};

    useEffect(() => {
        if (isEditing) {
            const fetchFlashSale = async () => {
                const res = await axios.get(`http://localhost:5000/api/v1/flash-sales/${id}`, apiConfig);
                const { title, startTime, endTime, products } = res.data.data.flashSale;
                setTitle(title);
                setStartTime(new Date(startTime).toISOString().slice(0, 16));
                setEndTime(new Date(endTime).toISOString().slice(0, 16));
                setProducts(products);
            };
            fetchFlashSale();
        }
    }, [id, isEditing]);

    const handleSearchProducts = async () => {
        if (searchQuery.length < 2) return;
        try {
            // Thêm tham số excludeActiveSale=true
            const res = await axios.get(`http://localhost:5000/api/v1/products?search=${searchQuery}&excludeActiveSale=true`);
            setSearchResults(res.data.data.products);
        } catch (error) {
            console.error("Lỗi tìm kiếm sản phẩm:", error);
        }
    };

    const handleAddProduct = (product) => {
        // Logic mới: Tự động lấy số lượng tồn kho
        const flashSaleStock = product.stockQuantity;
        const flashSalePrice = prompt(`Nhập giá sale cho ${product.name} (Giá gốc: ${product.sellPrice.toLocaleString('vi-VN')} VND):`, product.sellPrice);
        
        if (flashSalePrice === null) return; // Người dùng nhấn Hủy

        // Logic mới: Kiểm tra giá sale
        if (Number(flashSalePrice) > product.sellPrice) {
            alert('Lỗi: Giá sale không được cao hơn giá gốc!');
            return;
        }

        setProducts([...products, { product, flashSalePrice: Number(flashSalePrice), flashSaleStock: Number(flashSaleStock) }]);
        setSearchQuery('');
        setSearchResults([]);
    };

    const handleRemoveProduct = (productId) => {
        setProducts(products.filter(p => p.product._id !== productId));
    };

    const handleEditProduct = (productId) => {
        const productToEdit = products.find(p => p.product._id === productId);
        if (!productToEdit) return;

        const newPrice = prompt(`Sửa giá sale cho ${productToEdit.product.name} (Giá gốc: ${productToEdit.product.sellPrice.toLocaleString('vi-VN')} VND):`, productToEdit.flashSalePrice);
        
        if (newPrice === null) return; // Người dùng nhấn Hủy

        // Logic mới: Kiểm tra giá sale
        if (Number(newPrice) > productToEdit.product.sellPrice) {
            alert('Lỗi: Giá sale không được cao hơn giá gốc!');
            return;
        }
        
        const newStock = prompt(`Sửa số lượng sale cho ${productToEdit.product.name}:`, productToEdit.flashSaleStock);
        if (newStock === null) return;

        const updatedProducts = products.map(p => 
            p.product._id === productId 
            ? { ...p, flashSalePrice: Number(newPrice), flashSaleStock: Number(newStock) } 
            : p
        );
        setProducts(updatedProducts);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            title, startTime, endTime,
            products: products.map(p => ({
                product: p.product._id,
                flashSalePrice: p.flashSalePrice,
                flashSaleStock: p.flashSaleStock,
            }))
        };
        try {
            if (isEditing) {
                await axios.patch(`http://localhost:5000/api/v1/flash-sales/${id}`, payload, apiConfig);
            } else {
                await axios.post('http://localhost:5000/api/v1/flash-sales', payload, apiConfig);
            }
            alert('Lưu chương trình Flash Sale thành công!');
            navigate('/admin/flash-sales');
        } catch (error) {
            alert(`Lỗi: ${error.response?.data?.message || 'Có lỗi xảy ra!'}`);
        }
    };

    return (
        <div className="page-container">
            <h1 style={{marginBottom: '20px'}}>{isEditing ? 'Sửa chương trình Flash Sale' : 'Tạo chương trình Flash Sale mới'}</h1>
            <form onSubmit={handleSubmit} className="form-container">
                <div className="form-grid">
                    <div className="form-group">
                        <label>Tên chương trình</label>
                        <input value={title} onChange={e => setTitle(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Thời gian bắt đầu</label>
                        <input type="datetime-local" value={startTime} onChange={e => setStartTime(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Thời gian kết thúc</label>
                        <input type="datetime-local" value={endTime} onChange={e => setEndTime(e.target.value)} required />
                    </div>
                </div>

                <div className="product-section">
                    <h3>Sản phẩm trong chương trình</h3>
                    <div className="product-list">
                        <ul>
                            {products.map(p => (
                                <li key={p.product._id} className="product-list-item">
                                    <div className="product-info">
                                        <strong>{p.product.name}</strong><br />
                                        Giá sale: {p.flashSalePrice.toLocaleString('vi-VN')} VND - Số lượng: {p.flashSaleStock}
                                    </div>
                                    <div className="product-actions">
                                        <button type="button" className="btn-edit" onClick={() => handleEditProduct(p.product._id)}>Sửa</button>
                                        <button type="button" className="btn-delete" onClick={() => handleRemoveProduct(p.product._id)}>Xóa</button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                    
                    <div className="search-container">
                        <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Tìm sản phẩm để thêm..." />
                        <button type="button" onClick={handleSearchProducts}>Tìm</button>
                    </div>
                    <div className="search-results">
                        <ul>
                            {searchResults.map(p => (
                                <li key={p._id} className="search-result-item">
                                    <span>{p.name} (Tồn kho: {p.stockQuantity})</span>
                                    <button type="button" onClick={() => handleAddProduct(p)}>+</button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <button type="submit" className="btn-primary" style={{marginTop: '20px'}}>{isEditing ? 'Cập nhật' : 'Tạo mới'}</button>
            </form>
        </div>
    );
};

export default FlashSaleForm;