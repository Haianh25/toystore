import React, { useState, useEffect } from 'react';
 import { useParams, Link } from 'react-router-dom';
 import axios from 'axios';
 import './ProductDetailPage.css';

 const ProductDetailPage = () => {
     const { id } = useParams();
     const [product, setProduct] = useState(null);
     const [loading, setLoading] = useState(true);
     const [quantity, setQuantity] = useState(1);
     const [mainImageUrl, setMainImageUrl] = useState('');
     const serverUrl = 'http://localhost:5000';

     useEffect(() => {
         const fetchProduct = async () => {
             try {
                 const { data } = await axios.get(`http://localhost:5000/api/v1/products/${id}`);
                 setProduct(data.data.product);
                 setMainImageUrl(`${serverUrl}${data.data.product.mainImage}`);
             } catch (error) {
                 console.error("Lỗi khi tải sản phẩm:", error);
             } finally {
                 setLoading(false);
             }
         };
         fetchProduct();
     }, [id]);

     useEffect(() => {
         if (product && product.mainImage) {
             setMainImageUrl(`${serverUrl}${product.mainImage}`);
         }
     }, [product]);

     if (loading) return <p>Đang tải sản phẩm...</p>;
     if (!product) return <p>Không tìm thấy sản phẩm.</p>;

     const handleThumbnailClick = (imageUrl) => {
         setMainImageUrl(`${serverUrl}${imageUrl}`);
     };

     return (
         <div className="product-detail-container">
             <div className="product-detail-layout">
                 {/* Cột bên trái: Hình ảnh */}
                 <div className="product-images">
                     <img src={mainImageUrl} alt={product.name} className="main-image" />
                     {product.subImages && product.subImages.length > 0 && (
                         <div className="thumbnail-gallery">
                             {product.subImages.map((subImage, index) => (
                                 <img
                                     key={index}
                                     src={`${serverUrl}${subImage}`}
                                     alt={`${product.name} - ảnh phụ ${index + 1}`}
                                     className={`thumbnail ${`${serverUrl}${subImage}` === mainImageUrl ? 'active' : ''}`}
                                     onClick={() => handleThumbnailClick(subImage)}
                                 />
                             ))}
                         </div>
                     )}
                 </div>

                 {/* Cột bên phải: Thông tin & Mua hàng */}
                 <div className="product-info-main">
                     <h1 className="product-title">{product.name}</h1>
                     {product.brand && <p className="product-brand">Thương hiệu: <Link to={`/brands/${product.brand.slug}`}>{product.brand.name}</Link></p>}
                     <p className="product-price">{product.sellPrice.toLocaleString('vi-VN')} VND</p>

                     <div className="product-stock">
                         Tình trạng: {product.stockQuantity > 0 ? '✔️ Còn hàng' : '❌ Hết hàng'}
                     </div>

                     <div className="product-actions">
                         <div className="quantity-selector">
                             <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
                             <input type="number" value={quantity} readOnly />
                             <button onClick={() => setQuantity(q => Math.min(product.stockQuantity, q + 1))}>+</button>
                         </div>
                         <button className="add-to-cart-btn" disabled={product.stockQuantity === 0}>
                             Thêm vào giỏ hàng
                         </button>
                     </div>
                 </div>
             </div>

             {/* Phần mô tả sản phẩm */}
             <div className="product-description">
                 <h2>Mô tả sản phẩm</h2>
                 <div dangerouslySetInnerHTML={{ __html: product.description }} />
             </div>
         </div>
     );
 };

 export default ProductDetailPage;