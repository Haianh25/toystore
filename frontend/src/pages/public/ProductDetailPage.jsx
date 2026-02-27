import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { API_URL } from '../../config/api';
import { getImageUrl } from '../../utils/imageUtils';
import { FaStar, FaRegStar, FaHeart, FaRegHeart } from 'react-icons/fa';
import ProductCard from '../../components/public/ProductCard';
import SEO from '../../components/common/SEO';
import './ProductDetailPage.css';

const ProductDetailPage = () => {
    const { id } = useParams();
    const { userToken } = useAuth();
    const [product, setProduct] = useState(null);
    const [flashSaleInfo, setFlashSaleInfo] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [mainImageUrl, setMainImageUrl] = useState('');
    const { addToCart } = useCart();
    const { showToast } = useToast();

    // Review Form State
    const [userRating, setUserRating] = useState(5);
    const [reviewComment, setReviewComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [reviewError, setReviewError] = useState('');
    const [isWishlisted, setIsWishlisted] = useState(false);

    const fetchProductAndReviews = async () => {
        setLoading(true);
        try {
            // Tải sản phẩm trước
            const productRes = await axios.get(`${API_URL}/api/v1/products/${id}`);
            const productData = productRes.data?.data?.data || productRes.data?.data?.product;

            if (productData) {
                setProduct(productData);
                // document.title = `${productData.name} | TheDevilPlayz`; // Moved to SEO component
                setMainImageUrl(productData.mainImage ? getImageUrl(productData.mainImage) : '');

                // Tải các sản phẩm tương quan (cùng category)
                if (productData.categories && productData.categories.length > 0) {
                    const categoryId = typeof productData.categories[0] === 'string'
                        ? productData.categories[0]
                        : productData.categories[0]._id;

                    const fetchRelated = async () => {
                        try {
                            const relatedRes = await axios.get(`${API_URL}/api/v1/products/${id}/related`);
                            setRelatedProducts(relatedRes.data?.data?.products || []);
                        } catch (err) {
                            console.warn("Không thể tải sản phẩm tương quan thông minh:", err);
                            // Fallback to category-based if needed
                        }
                    };
                    fetchRelated();
                }
            }

            // Sau đó tải reviews (không chặn nếu fail)
            try {
                const reviewsRes = await axios.get(`${API_URL}/api/v1/products/${id}/reviews`);
                setReviews(reviewsRes.data.data.reviews || []);
            } catch (revError) {
                console.warn("Không thể tải danh sách đánh giá:", revError);
                setReviews([]);
            }

            // Tải thông tin flash sale (không chặn)
            try {
                const flashRes = await axios.get(`${API_URL}/api/v1/flash-sales/active`);
                if (flashRes.data.data.flashSales && flashRes.data.data.flashSales.length > 0) {
                    const activeSale = flashRes.data.data.flashSales[0];
                    console.log("Tìm thấy Flash Sale hoạt động:", activeSale.title);
                    const saleItem = activeSale.products.find(p => {
                        const pid = typeof p.product === 'string' ? p.product : p.product._id;
                        console.log(`Kiểm tra sản phẩm trong sale: ${pid} vs ${id}`);
                        return pid === id;
                    });
                    if (saleItem) {
                        console.log("Sản phẩm đang trong Flash Sale! Giá sale:", saleItem.flashSalePrice);
                        setFlashSaleInfo({
                            salePrice: saleItem.flashSalePrice,
                            endTime: activeSale.endTime
                        });
                    } else {
                        console.log("Sản phẩm không có trong Flash Sale đang diễn ra.");
                    }
                }
            } catch (err) {
                console.warn("Không thể tải thông tin flash sale:", err);
            }

        } catch (error) {
            console.error("Lỗi khi tải thông tin sản phẩm:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProductAndReviews();
        window.scrollTo(0, 0); // Cuộn lên đầu trang khi đổi sản phẩm
    }, [id]);

    useEffect(() => {
        const checkWishlist = async () => {
            if (!userToken) return;
            try {
                const res = await axios.get(`${API_URL}/api/v1/users/wishlist`, {
                    headers: { Authorization: `Bearer ${userToken}` }
                });
                const isInWishlist = res.data.data.wishlist.some(item => item._id === id);
                setIsWishlisted(isInWishlist);
            } catch (err) {
                console.error("Lỗi check wishlist:", err);
            }
        };
        checkWishlist();
    }, [id, userToken]);

    const toggleWishlist = async () => {
        if (!userToken) {
            showToast("Vui lòng đăng nhập để lưu sản phẩm!", "error");
            return;
        }

        try {
            const apiConfig = { headers: { Authorization: `Bearer ${userToken}` } };
            if (isWishlisted) {
                await axios.delete(`${API_URL}/api/v1/users/wishlist`, {
                    ...apiConfig,
                    data: { productId: id }
                });
                setIsWishlisted(false);
            } else {
                await axios.post(`${API_URL}/api/v1/users/wishlist`, { productId: id }, apiConfig);
                setIsWishlisted(true);
            }
        } catch (err) {
            console.error("Lỗi toggle wishlist:", err);
        }
    };

    const handleAddToCart = () => {
        if (product && quantity > 0) {
            addToCart(product, quantity, flashSaleInfo?.salePrice);
            showToast(`Đã thêm ${quantity} sản phẩm "${product.name}" vào giỏ hàng!`, "success");
        }
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!userToken) return showToast("Vui lòng đăng nhập để đánh giá", "error");

        setIsSubmitting(true);
        setReviewError('');

        try {
            await axios.post(`${API_URL}/api/v1/products/${id}/reviews`, {
                rating: userRating,
                review: reviewComment
            }, {
                headers: { Authorization: `Bearer ${userToken}` }
            });

            setReviewComment('');
            setUserRating(5);
            showToast("Cảm ơn bạn đã đánh giá sản phẩm!", "success");
            fetchProductAndReviews(); // Reload reviews
        } catch (err) {
            setReviewError(err.response?.data?.message || "Lỗi khi gửi đánh giá");
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) => (
            i < rating ? <FaStar key={i} className="star-filled" /> : <FaRegStar key={i} className="star-empty" />
        ));
    };

    if (loading) return <div className="luxury-loader"><span className="loader-text">TheDevilPlayz</span></div>;

    // Ensure unique image list
    const allImages = product
        ? [...new Set([product.mainImage, ...(product.detailImages || [])])].filter(Boolean)
        : [];

    // Helper to get category info safely
    const primaryCategory = product?.categories?.[0];
    const categoryName = typeof primaryCategory === 'object' ? primaryCategory?.name : '';
    const categoryId = typeof primaryCategory === 'object' ? primaryCategory?._id : primaryCategory;

    return (
        <div className="product-detail-container">
            <SEO
                title={product?.name}
                description={product?.description?.substring(0, 160)}
                keywords={`LEGO, ${product?.name}, ${product?.brand?.name}, toys, collectibles`}
            />
            {/* Breadcrumbs & Architectural Line ("gạch") */}
            <nav className="breadcrumb-nav">
                <Link to="/">HOME</Link>
                <span className="separator">/</span>
                <Link to="/products">SHOP</Link>
                {categoryName && (
                    <>
                        <span className="separator">/</span>
                        <Link to={`/products?category=${categoryId}`}>
                            {categoryName.toUpperCase()}
                        </Link>
                    </>
                )}
                <span className="separator">/</span>
                <span className="current">{product?.name?.toUpperCase()}</span>
            </nav>

            <div className="product-detail-layout">
                <div className="product-images">
                    <div className="main-image-container">
                        <img
                            src={mainImageUrl}
                            alt={product?.name}
                            className="main-image"
                            onError={(e) => { e.target.src = '/placeholder-luxury.jpg'; }}
                        />
                    </div>
                    {allImages.length > 1 && (
                        <div className="thumbnail-gallery">
                            {allImages.map((imgUrl, index) => {
                                // Ensure no double slashes if imgUrl starts with /
                                const fullUrl = getImageUrl(imgUrl);
                                return (
                                    <img
                                        key={index}
                                        src={fullUrl}
                                        alt={`Detail View ${index + 1}`}
                                        className={`thumbnail ${fullUrl === mainImageUrl ? 'active' : ''}`}
                                        onClick={() => setMainImageUrl(fullUrl)}
                                        onError={(e) => { e.target.style.display = 'none'; }}
                                    />
                                );
                            })}
                        </div>
                    )}
                </div>
                <div className="product-info-main">
                    <h1 className="product-title">{product?.name}</h1>
                    {product?.brand && (
                        <p className="product-brand">
                            EXCLUSIVELY BY <Link to={`/products?brand=${product.brand._id}`}>{product.brand.name}</Link>
                        </p>
                    )}
                    {flashSaleInfo ? (
                        <div className="product-price-container">
                            <span className="product-price-sale">{flashSaleInfo.salePrice?.toLocaleString('vi-VN')} VND</span>
                            <span className="product-price-original">{product?.sellPrice?.toLocaleString('vi-VN')} VND</span>
                            <span className="sale-badge">FLASH SALE</span>
                        </div>
                    ) : (
                        <p className="product-price">{product?.sellPrice?.toLocaleString('vi-VN')} VND</p>
                    )}
                    <div className="product-stock">
                        AVAILABILITY: {product?.stockQuantity > 0 ? `IN STOCK (${product.stockQuantity} UNITS)` : 'CURRENTLY UNAVAILABLE'}
                    </div>
                    <div className="product-actions">
                        <div className="quantity-selector">
                            <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
                            <input type="number" value={quantity} readOnly />
                            <button onClick={() => setQuantity(q => Math.min(product?.stockQuantity || 0, q + 1))}>+</button>
                        </div>
                        <button
                            className="add-to-cart-btn"
                            disabled={!product || product.stockQuantity === 0}
                            onClick={handleAddToCart}
                        >
                            ADD TO BAG
                        </button>
                        <button className={`wishlist-detail-btn ${isWishlisted ? 'active' : ''}`} onClick={toggleWishlist}>
                            {isWishlisted ? <FaHeart /> : <FaRegHeart />}
                        </button>
                    </div>
                </div>
            </div>

            <div className="product-details-extra">
                <div className="description-section glass-panel">
                    <h2 className="tdp-serif">THE COLLECTOR'S DOSSIER</h2>
                    <div className="content" dangerouslySetInnerHTML={{ __html: product?.description || '' }} />
                </div>

                {/* Related Products Section */}
                {relatedProducts.length > 0 && (
                    <div className="related-products-section">
                        <h2 className="tdp-serif">YOU MAY ALSO LIKE</h2>
                        <div className="related-products-grid">
                            {relatedProducts.map(p => (
                                <ProductCard key={p._id} product={p} />
                            ))}
                        </div>
                    </div>
                )}

                <div className="reviews-section">
                    <h2 className="tdp-serif">CLIENT REVIEWS</h2>

                    {/* Review Form */}
                    {userToken ? (
                        <form className="review-form" onSubmit={handleReviewSubmit}>
                            <h3>Để lại đánh giá của bạn</h3>
                            <div className="star-input">
                                {[1, 2, 3, 4, 5].map(num => (
                                    <span key={num} onClick={() => setUserRating(num)}>
                                        {num <= userRating ? <FaStar className="star-filled" /> : <FaRegStar className="star-empty" />}
                                    </span>
                                ))}
                            </div>
                            <textarea
                                placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                                value={reviewComment}
                                onChange={(e) => setReviewComment(e.target.value)}
                                required
                            />
                            {reviewError && <p className="review-error">{reviewError}</p>}
                            <button type="submit" disabled={isSubmitting} className="add-to-cart-btn">
                                {isSubmitting ? 'ĐANG GỬI...' : 'GỬI ĐÁNH GIÁ'}
                            </button>
                        </form>
                    ) : (
                        <p className="login-prompt">Vui lòng <Link to="/login">đăng nhập</Link> để để lại đánh giá.</p>
                    )}

                    {/* Reviews List */}
                    <div className="reviews-list">
                        {reviews.length === 0 ? (
                            <div className="no-reviews glass-panel">
                                <p>BE THE FIRST HERO TO REVIEW THIS PIECE.</p>
                            </div>
                        ) : (
                            reviews.map(review => (
                                <div key={review._id} className="review-item glass-card">
                                    <div className="review-meta">
                                        <span className="reviewer-name">{review.user?.fullName}</span>
                                        <span className="review-date">{new Date(review.createdAt).toLocaleDateString('vi-VN')}</span>
                                    </div>
                                    <div className="review-rating">{renderStars(review.rating)}</div>
                                    <p className="review-text">{review.review}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;
