import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import ProductGrid from '../../components/public/ProductGrid';
import FilterSidebar from '../../components/public/FilterSidebar';
import Pagination from '../../components/public/Pagination';
import './ProductListPage.css';

const ProductListPage = () => {
    const [products, setProducts] = useState([]);
    const [pagination, setPagination] = useState({});
    const [pageTitle, setPageTitle] = useState('Tất cả sản phẩm');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();
    const { slug } = useParams();

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);
            try {
                const params = new URLSearchParams(location.search);
                let title = 'Tất cả sản phẩm';

                if (location.pathname.startsWith('/category/') && slug) {
                    const res = await axios.get(`http://localhost:5000/api/v1/categories/slug/${slug}`);
                    params.set('category', res.data.data.category._id);
                    title = res.data.data.category.name;
                } else if (location.pathname.startsWith('/collection/') && slug) {
                    const res = await axios.get(`http://localhost:5000/api/v1/collections/slug/${slug}`);
                    params.set('collection', res.data.data.collection._id);
                    title = res.data.data.collection.name;
                }
                
                setPageTitle(title);
                
                const productsRes = await axios.get(`http://localhost:5000/api/v1/products?${params.toString()}`);
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
        const params = new URLSearchParams(location.search);
        params.set('page', page);
        navigate({ search: params.toString() });
    };

    return (
        <div className="product-list-page-container">
            <FilterSidebar />
            <main className="product-list-main">
                <h1 className="product-list-title">{pageTitle}</h1>
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