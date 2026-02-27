import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../config/api';
import { useToast } from '../../context/ToastContext';
import './OrderDetail.css';

const OrderDetail = () => {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [newStatus, setNewStatus] = useState('');
    const { showToast } = useToast();
    const { id } = useParams();
    const serverUrl = API_URL;

    const [isEditing, setIsEditing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [productsInOrder, setProductsInOrder] = useState([]);

    const apiConfig = React.useMemo(() => ({
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
    }), []);

    const fetchOrder = React.useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/api/v1/orders/${id}`, apiConfig);
            // Handle multiple possible data keys for resilience
            const orderData = response.data?.data?.order || response.data?.data?.data || response.data?.data;

            if (orderData) {
                setOrder(orderData);
                setNewStatus(orderData.status);
                setProductsInOrder(orderData.products);
            }
        } catch (error) {
            console.error("Lỗi tải chi tiết đơn hàng:", error);
        } finally {
            setLoading(false);
        }
    }, [id, apiConfig]);

    useEffect(() => {
        fetchOrder();
    }, [fetchOrder]);

    const handleStatusUpdate = async () => {
        // Thêm dòng kiểm tra này
        if (newStatus === order.status) {
            showToast('Bạn chưa chọn trạng thái mới để cập nhật.', "error");
            return;
        }

        if (window.confirm(`Bạn có chắc muốn cập nhật trạng thái thành "${newStatus}"?`)) {
            try {
                await axios.patch(`${API_URL}/api/v1/orders/${id}`, { status: newStatus }, apiConfig);
                showToast('Cập nhật trạng thái thành công!', "success");
                fetchOrder(); // Tải lại để thấy trạng thái mới
            } catch (error) {
                showToast(`Cập nhật thất bại: ${error.response?.data?.message || 'Có lỗi xảy ra'}`, "error");
                console.error("Lỗi cập nhật:", error);
            }
        }
    };

    const handleToggleEdit = () => setIsEditing(!isEditing);

    const handleSearchProducts = async () => {
        if (searchQuery.length < 2) return;
        try {
            const res = await axios.get(`${API_URL}/api/v1/products?search=${searchQuery}`, apiConfig);
            setSearchResults(res.data.data.products);
        } catch (error) {
            console.error("Lỗi tìm kiếm sản phẩm:", error);
        }
    };

    const handleAddProduct = async (product) => {
        const quantity = parseInt(prompt(`Nhập số lượng cho sản phẩm "${product.name}":`, 1));
        if (isNaN(quantity) || quantity <= 0) return;
        try {
            const res = await axios.post(`${API_URL}/api/v1/orders/${id}/products`, {
                productId: product._id, quantity, price: product.sellPrice
            }, apiConfig);
            setProductsInOrder(res.data.data.order.products);
            setOrder(res.data.data.order);
            showToast("Thêm sản phẩm thành công!", "success");
        } catch (error) {
            showToast(`Thêm sản phẩm thất bại: ${error.response?.data?.message || ''}`, "error");
        }
    };

    const handleUpdateQuantity = async (productId, newQuantity) => {
        const quantity = Math.max(0, parseInt(newQuantity));
        try {
            const res = await axios.patch(`${API_URL}/api/v1/orders/${id}/products/${productId}`,
                { quantity }, apiConfig);
            setProductsInOrder(res.data.data.order.products);
            setOrder(res.data.data.order);
            showToast("Cập nhật số lượng thành công!", "success");
        } catch (error) {
            showToast(`Cập nhật số lượng thất bại: ${error.response?.data?.message || ''}`, "error");
            console.error(error);
        }
    };

    if (loading) return <p>Đang tải chi tiết đơn hàng...</p>;
    if (!order) return <p>Không tìm thấy đơn hàng.</p>;

    const isCancelled = order.status === 'Cancelled';
    const isCompleted = order.status === 'Completed';
    const isEditable = order.status === 'Processing';

    const getNextAvailableStatuses = (currentStatus) => {
        const transitions = {
            Pending: ['Processing', 'Cancelled'],
            Processing: ['Shipped', 'Cancelled'],
            Shipped: ['Completed', 'Cancelled'],
        };
        return transitions[currentStatus] || [];
    };

    const availableStatuses = getNextAvailableStatuses(order.status);

    return (
        <div className="order-detail-container">
            <Link to="/admin/orders" className="back-link">&larr; QUAY LẠI DANH SÁCH</Link>
            <div className="order-header-main">
                <div className="title-section">
                    <h1>ĐƠN HÀNG <span className="order-id">#{order._id.slice(-8).toUpperCase()}</span></h1>
                    <div className={`status-badge status-${order.status.toLowerCase()}`}>
                        {order.status.toUpperCase()}
                    </div>
                </div>
                <div className="order-meta">
                    <span>NGÀY ĐẶT: {new Date(order.createdAt).toLocaleString('vi-VN')}</span>
                    <span>HÌNH THỨC: {order.paymentMethod.toUpperCase()}</span>
                </div>
            </div>

            {isCancelled && (
                <div style={{ padding: '15px', backgroundColor: '#f8d7da', color: '#721c24', border: '1px solid #f5c6cb', borderRadius: '4px', marginBottom: '20px' }}>
                    <strong>Đơn hàng này đã bị hủy và không thể chỉnh sửa.</strong>
                </div>
            )}

            {!isEditable && !isCancelled && !isCompleted && (
                <div style={{ padding: '15px', backgroundColor: '#fff3cd', color: '#856404', border: '1px solid #ffeeba', borderRadius: '4px', marginBottom: '20px' }}>
                    <strong>Đơn hàng chỉ có thể được sửa ở trạng thái "Processing".</strong>
                </div>
            )}

            <div className="order-detail-grid">
                <div className="main-content">
                    <div className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3>Sản phẩm trong đơn hàng</h3>
                            {!isCancelled && !isCompleted && (
                                <button
                                    onClick={handleToggleEdit}
                                    disabled={!isEditable}
                                    title={!isEditable ? 'Chỉ có thể sửa đơn hàng ở trạng thái Processing' : 'Sửa đơn hàng'}
                                >
                                    {isEditing ? 'Hoàn tất Sửa' : 'Sửa Đơn hàng'}
                                </button>
                            )}
                        </div>
                        <table className="products-table">
                            <tbody>
                                {productsInOrder.map(item => (
                                    <tr key={item._id}>
                                        <td>
                                            <div className="product-item-info">
                                                {item.product ? (
                                                    <>
                                                        <img src={`${serverUrl}${item.product.mainImage}`} alt={item.product.name} />
                                                        <div>{item.product.name}</div>
                                                    </>
                                                ) : (
                                                    <div>Sản phẩm không còn tồn tại</div>
                                                )}
                                            </div>
                                        </td>
                                        <td>
                                            {isEditing && isEditable && item.product ? (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                    <button onClick={() => handleUpdateQuantity(item.product._id, item.quantity - 1)}>-</button>
                                                    <input
                                                        type="number"
                                                        value={item.quantity}
                                                        onChange={(e) => handleUpdateQuantity(item.product._id, e.target.value)}
                                                        style={{ width: '50px', textAlign: 'center' }}
                                                    />
                                                    <button onClick={() => handleUpdateQuantity(item.product._id, item.quantity + 1)}>+</button>
                                                </div>
                                            ) : (
                                                <span>Số lượng: {item.quantity}</span>
                                            )}
                                        </td>
                                        <td>{(item.price * item.quantity).toLocaleString('vi-VN')} VND</td>
                                        {isEditing && isEditable && (
                                            <td>
                                                <button
                                                    onClick={() => handleUpdateQuantity(item.product ? item.product._id : item._id, 0)}
                                                    style={{ backgroundColor: 'red', color: 'white' }}
                                                >
                                                    Xóa
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {isEditing && isEditable && (
                            <div style={{ marginTop: '30px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
                                <h4>Thêm sản phẩm vào đơn</h4>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <input type="text" placeholder="Tìm tên sản phẩm..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ flex: 1, padding: '8px' }} />
                                    <button onClick={handleSearchProducts}>Tìm</button>
                                </div>
                                <ul style={{ listStyle: 'none', padding: 0, marginTop: '10px', maxHeight: '150px', overflowY: 'auto' }}>
                                    {searchResults.map(p => (
                                        <li key={p._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', borderBottom: '1px solid #eee' }}>
                                            <span>{p.name} - {p.sellPrice.toLocaleString('vi-VN')} VND</span>
                                            <button onClick={() => handleAddProduct(p)}>+</button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <h3 style={{ textAlign: 'right', marginTop: '20px' }}>Tổng cộng: {order.totalAmount.toLocaleString('vi-VN')} VND</h3>
                    </div>
                </div>
                <div className="sidebar-content">
                    <div className="card">
                        <h3>Thông tin khách hàng</h3>
                        <div className="info-grid">
                            <p><strong>Họ tên:</strong> {order.shippingAddress.fullName}</p>
                            <p><strong>Email:</strong> {order.user?.email || 'N/A'}</p>
                            <p><strong>SĐT:</strong> {order.shippingAddress.phone}</p>
                            <p><strong>Địa chỉ:</strong> {`${order.shippingAddress.street}, ${order.shippingAddress.ward}, ${order.shippingAddress.district}, ${order.shippingAddress.city}`}</p>
                        </div>
                    </div>
                    <div className="card status-update" style={{ marginTop: '20px' }}>
                        <h3>Cập nhật Trạng thái</h3>
                        <div className="status-flow">
                            <div className="current-state">
                                <span>Trạng thái hiện tại:</span>
                                <strong>{order.status}</strong>
                            </div>

                            {!isCompleted && !isCancelled ? (
                                <div className="status-transition">
                                    <div className="status-select-wrapper">
                                        <select value={newStatus} onChange={e => setNewStatus(e.target.value)}>
                                            <option value={order.status} disabled>CHỌN TRẠNG THÁI TIẾP THEO</option>
                                            {availableStatuses.map(status => (
                                                <option key={status} value={status}>{status}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <button className="btn-update-status" onClick={handleStatusUpdate}>
                                        CẬP NHẬT NGAY
                                    </button>
                                </div>
                            ) : (
                                <div className="status-final">
                                    Đơn hàng đã ở trạng thái cuối cùng.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetail;