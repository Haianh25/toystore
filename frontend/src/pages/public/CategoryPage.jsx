import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useSearchParams } from 'react-router-dom';
import FilterSidebar from '../../components/public/FilterSidebar';
import ProductGrid from '../../components/public/ProductGrid';
import Pagination from '../../components/public/Pagination';
import './ProductListPage.css'; // Chúng ta sẽ tái sử dụng CSS của trang ProductListPage

const CategoryPage = () => {
    const { slug } = useParams(); // Lấy slug từ URL, ví dụ: "hang-moi"
    const [products, setProducts] = useState([]);
    const [categoryInfo, setCategoryInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // State cho phân trang và sắp xếp
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalProducts, setTotalProducts] = useState(0);
    const [searchParams, setSearchParams] = useSearchParams();
    const [sortBy, setSortBy] = useState(searchParams.get('sort') || '-createdAt');

    useEffect(() => {
        const fetchCategoryProducts = async () => {
            setLoading(true);
            try {
                // Thêm category=slug vào API call
                const response = await axios.get(`http://localhost:5000/api/v1/products`, {
                    params: {
                        category: slug,
                        page: currentPage,
                        sort: sortBy,
                        limit: 12 // Hoặc số lượng bạn muốn
                    }
                });
                const { data } = response.data;
                setProducts(data.products);
                setCategoryInfo(data.categoryInfo); // Lấy thông tin category từ API
                setTotalPages(data.totalPages);
                setTotalProducts(data.totalProducts);
            } catch (err) {
                setError('Không thể tải sản phẩm. Vui lòng thử lại sau.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCategoryProducts();
        // Cập nhật URL khi sort hoặc page thay đổi
        setSearchParams({ sort: sortBy, page: currentPage });

    }, [slug, currentPage, sortBy, setSearchParams]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };
    
    const handleSortChange = (e) => {
        setSortBy(e.target.value);
        setCurrentPage(1); // Reset về trang 1 khi đổi sắp xếp
    };

    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div className="product-list-page-container">
            <aside className="filter-sidebar">
                <FilterSidebar />
            </aside>
            <main className="product-list-main">
                {loading ? (
                     <h1 className="product-list-title">Đang tải...</h1>
                ) : (
                    <h1 className="product-list-title">
                        {categoryInfo ? categoryInfo.name : 'Danh mục'}
                    </h1>
                )}

                <div className="toolbar">
                    <div className="product-count">Hiển thị {products.length} trên {totalProducts} sản phẩm</div>
                    <div className="sort-by">
                        <label htmlFor="sort">Sắp xếp theo:</label>
                        <select id="sort" value={sortBy} onChange={handleSortChange}>
                            <option value="-createdAt">Mới nhất</option>
                            <option value="sellPrice">Giá: Thấp đến cao</option>
                            <option value="-sellPrice">Giá: Cao đến thấp</option>
                        </select>
                    </div>
                </div>

                {loading ? (
                    <p>Đang tải sản phẩm...</p>
                ) : (
                    <ProductGrid products={products} />
                )}
                
                <Pagination 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </main>
        </div>
    );
};

export default CategoryPage;