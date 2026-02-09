import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import ProductGrid from '../../components/public/ProductGrid';
import FilterSidebar from '../../components/public/FilterSidebar';
import Pagination from '../../components/public/Pagination';
import { API_URL } from '../../config/api';
import './ProductListPage.css';

// --- CẬP NHẬT: "Mặc định" bây giờ có giá trị là "random" ---
const sortOptions = [
    { label: 'Mặc định (Ngẫu nhiên)', value: 'random' },
    { label: 'Sản phẩm mới', value: '-createdAt' },
    { label: 'Tên sản phẩm A-Z', value: 'name' },
    { label: 'Tên sản phẩm Z-A', value: '-name' },
    { label: 'Giá tăng dần', value: 'sellPrice' },
    { label: 'Giá giảm dần', value: '-sellPrice' },
];

const ProductListPage = () => {
    const [products, setProducts] = useState([]);
    const [pagination, setPagination] = useState({});
    const [pageTitle, setPageTitle] = useState('Tất cả sản phẩm');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();
    const { slug } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);
            try {
                const params = new URLSearchParams(location.search);
                let title = 'Tất cả sản phẩm';

                if (location.pathname.startsWith('/category/') && slug) {
                    const res = await axios.get(`${API_URL}/api/v1/categories/slug/${slug}`);
                    params.set('category', res.data.data.category._id);
                    title = res.data.data.category.name;
                } else if (location.pathname.startsWith('/collection/') && slug) {
                    const res = await axios.get(`${API_URL}/api/v1/collections/slug/${slug}`);
                    params.set('collection', res.data.data.collection._id);
                    title = res.data.data.collection.name;
                }

                // --- CẬP NHẬT LOGIC: Luôn mặc định sắp xếp ngẫu nhiên nếu không có tham số sort ---
                if (!params.has('sort')) {
                    params.set('sort', 'random');
                }

                setPageTitle(title);
                document.title = `${title} | TheDevilPlayz`;

                const productsRes = await axios.get(`${API_URL}/api/v1/products?${params.toString()}`);
                setProducts(productsRes.data.data.products);
                setPagination(productsRes.data.pagination);

            } catch (err) {
                console.error("Lỗi tải trang sản phẩm:", err);
                setError('Không tìm thấy nội dung bạn yêu cầu.');
                setProducts([]);
                setPageTitle('Lỗi');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [slug, location.pathname, location.search]);

    const handlePageChange = (page) => {
        searchParams.set('page', page);
        setSearchParams(searchParams);
    };

    const handleSortChange = (e) => {
        const sortValue = e.target.value;
        searchParams.set('sort', sortValue);
        searchParams.delete('page');
        setSearchParams(searchParams);
    };

    // Hàm để xác định giá trị hiện tại của dropdown
    const getCurrentSortValue = () => {
        return searchParams.get('sort') || 'random';
    }

    return (
        <div className="product-list-page-container">
            <FilterSidebar />
            <main className="product-list-main">
                <h1 className="product-list-title">{pageTitle}</h1>

                <div className="toolbar">
                    <div className="product-count">
                        {pagination.totalProducts || 0} sản phẩm
                    </div>
                    <div className="sort-by">
                        <label htmlFor="sort">Sắp xếp theo:</label>
                        <select id="sort" value={getCurrentSortValue()} onChange={handleSortChange}>
                            {sortOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {loading && <p>Đang tải sản phẩm...</p>}
                {error && <p>{error}</p>}
                {!loading && !error && (
                    <>
                        <ProductGrid products={products} />
                        <Pagination
                            currentPage={pagination.page}
                            totalPages={pagination.totalPages}
                            onPageChange={handlePageChange}
                        />
                    </>
                )}
            </main>
        </div>
    );
};

export default ProductListPage;