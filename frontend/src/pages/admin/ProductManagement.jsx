import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ProductTable from '../../components/admin/ProductTable';

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const response = await axios.get('http://localhost:5000/api/v1/products');
                setProducts(response.data.data.products);
            } catch (error) {
                console.error("Lỗi tải sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
        try {
            const token = localStorage.getItem('adminToken');
            await axios.delete(`http://localhost:5000/api/v1/products/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Tải lại danh sách sản phẩm sau khi xóa
            setProducts(products.filter(p => p._id !== id));
        } catch (error) {
            console.error("Lỗi xóa sản phẩm:", error);
            alert('Xóa sản phẩm thất bại!');
        }
    }
};

    if (loading) return <p>Đang tải danh sách sản phẩm...</p>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1>Quản lý Sản phẩm</h1>
                <Link to="/admin/products/new" style={{ padding: '10px 15px', backgroundColor: '#007bff', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>
                    Thêm sản phẩm mới
                </Link>
            </div>
            <ProductTable products={products} onDelete={handleDelete} />
        </div>
    );
};

export default ProductManagement;