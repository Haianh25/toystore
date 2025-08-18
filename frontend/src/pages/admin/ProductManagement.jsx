import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useSearchParams } from 'react-router-dom';
import ProductTable from '../../components/admin/ProductTable';
import Pagination from '../../components/public/Pagination'; // Tái sử dụng component Pagination

const ProductManagement = () => {
    const [products, setProducts] =useState([]);
    const [pagination, setPagination] = useState({});
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();
    
    // State cho ô tìm kiếm
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                // Gửi các tham số page và search lên API
                const response = await axios.get(`http://localhost:5000/api/v1/products?${searchParams.toString()}`);
                setProducts(response.data.data.products);
                setPagination(response.data.pagination);
            } catch (error) {
                console.error("Lỗi tải sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [searchParams]); // Chạy lại mỗi khi searchParams thay đổi

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
            try {
                const token = localStorage.getItem('adminToken');
                await axios.delete(`http://localhost:5000/api/v1/products/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                // Tải lại trang hiện tại để cập nhật danh sách
                const newSearchParams = new URLSearchParams(searchParams);
                setSearchParams(newSearchParams);
            } catch (error) {
                console.error("Lỗi xóa sản phẩm:", error);
                alert('Xóa sản phẩm thất bại!');
            }
        }
    };
    
    const handleSearch = (e) => {
        e.preventDefault();
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set('search', searchTerm);
        newSearchParams.set('page', '1'); // Reset về trang 1 khi tìm kiếm
        setSearchParams(newSearchParams);
    };

    const handlePageChange = (page) => {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set('page', page);
        setSearchParams(newSearchParams);
    };

    if (loading) return <p>Đang tải danh sách sản phẩm...</p>;

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Quản lý Sản phẩm</h1>
                <Link to="/admin/products/new" className="btn-primary">
                    Thêm sản phẩm mới
                </Link>
            </div>
            
            {/* THANH TÌM KIẾM MỚI */}
            <form onSubmit={handleSearch} style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
                <input 
                    type="text"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder="Nhập tên sản phẩm..."
                    style={{ flexGrow: 1, padding: '10px' }}
                />
                <button type="submit" className="btn-primary">Tìm kiếm</button>
            </form>

            <ProductTable products={products} onDelete={handleDelete} />
            
            {/* PHÂN TRANG MỚI */}
            <Pagination 
                currentPage={pagination.page} 
                totalPages={pagination.totalPages} 
                onPageChange={handlePageChange}
            />
        </div>
    );
};

export default ProductManagement;