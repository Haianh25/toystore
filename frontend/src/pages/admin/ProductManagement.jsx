import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useSearchParams } from 'react-router-dom';
import ProductTable from '../../components/admin/ProductTable';
import Pagination from '../../components/public/Pagination'; // Tái sử dụng component Pagination
import { API_URL } from '../../config/api';

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [pagination, setPagination] = useState({});
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();

    // State cho ô tìm kiếm và lọc
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
    const [catFilter, setCatFilter] = useState(searchParams.get('category') || '');
    const [brandFilter, setBrandFilter] = useState(searchParams.get('brand') || '');

    useEffect(() => {
        const fetchFilters = async () => {
            try {
                const [catRes, brandRes] = await Promise.all([
                    axios.get(`${API_URL}/api/v1/categories`),
                    axios.get(`${API_URL}/api/v1/brands`)
                ]);
                setCategories(catRes.data?.data?.categories || []);
                setBrands(brandRes.data?.data?.brands || []);
            } catch (err) { }
        };
        fetchFilters();
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                // Gửi các tham số page và search lên API
                const response = await axios.get(`${API_URL}/api/v1/products?${searchParams.toString()}`);
                setProducts(response.data?.data?.products || []);
                setPagination(response.data?.pagination || {});
            } catch (error) {
                console.error("Lỗi tải sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [searchParams]);

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
            try {
                const token = localStorage.getItem('adminToken');
                await axios.delete(`${API_URL}/api/v1/products/${id}`, {
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
        if (searchTerm) newSearchParams.set('search', searchTerm); else newSearchParams.delete('search');
        if (catFilter) newSearchParams.set('category', catFilter); else newSearchParams.delete('category');
        if (brandFilter) newSearchParams.set('brand', brandFilter); else newSearchParams.delete('brand');
        newSearchParams.set('page', '1');
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

            {/* THANH TÌM KIẾM VÀ LỌC MỚI */}
            <form onSubmit={handleSearch} style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder="Tên sản phẩm..."
                    style={{ flexGrow: 1, padding: '10px', minWidth: '200px' }}
                />
                <select
                    value={catFilter}
                    onChange={e => setCatFilter(e.target.value)}
                    style={{ padding: '10px', minWidth: '150px' }}
                >
                    <option value="">Tất cả danh mục</option>
                    {categories.map(cat => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                </select>
                <select
                    value={brandFilter}
                    onChange={e => setBrandFilter(e.target.value)}
                    style={{ padding: '10px', minWidth: '150px' }}
                >
                    <option value="">Tất cả thương hiệu</option>
                    {brands.map(brand => (
                        <option key={brand._id} value={brand._id}>{brand.name}</option>
                    ))}
                </select>
                <button type="submit" className="btn-primary">Lọc & Tìm</button>
            </form>

            <ProductTable products={products} onDelete={handleDelete} onRefresh={() => {
                const fetchProducts = async () => {
                    setLoading(true);
                    try {
                        const response = await axios.get(`${API_URL}/api/v1/products?${searchParams.toString()}`);
                        setProducts(response.data?.data?.products || []);
                        setPagination(response.data?.pagination || {});
                    } catch (error) {
                        console.error("Lỗi tải sản phẩm:", error);
                    } finally {
                        setLoading(false);
                    }
                };
                fetchProducts();
            }} />

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