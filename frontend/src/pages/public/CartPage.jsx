import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { FaTrashAlt } from 'react-icons/fa';
import './CartPage.css'; // Sẽ tạo file CSS ngay sau đây

const CartPage = () => {
    const { cartItems, updateQuantity, removeFromCart, totalPrice } = useCart();
    const serverUrl = 'http://localhost:5000';

    if (cartItems.length === 0) {
        return (
            <div className="cart-empty">
                <h2>Giỏ hàng của bạn đang trống</h2>
                <p>Hãy khám phá và thêm sản phẩm yêu thích vào giỏ hàng nhé!</p>
                <Link to="/products" className="btn-primary">
                    Tiếp tục mua sắm
                </Link>
            </div>
        );
    }

    return (
        <div className="cart-container">
            <h1>Giỏ hàng của bạn</h1>
            <div className="cart-layout">
                <div className="cart-items">
                    {cartItems.map(item => (
                        <div key={item.product._id} className="cart-item">
                            <img src={`${serverUrl}${item.product.mainImage}`} alt={item.product.name} className="cart-item-image" />
                            <div className="cart-item-details">
                                <Link to={`/products/${item.product._id}`} className="item-name">{item.product.name}</Link>
                                <p className="item-price">{item.product.sellPrice.toLocaleString('vi-VN')} VND</p>
                                <div className="item-actions">
                                    <div className="quantity-selector">
                                        <button onClick={() => updateQuantity(item.product._id, item.quantity - 1)}>-</button>
                                        <input type="text" value={item.quantity} readOnly />
                                        <button onClick={() => updateQuantity(item.product._id, item.quantity + 1)}>+</button>
                                    </div>
                                    <button onClick={() => removeFromCart(item.product._id)} className="remove-btn">
                                        <FaTrashAlt />
                                    </button>
                                </div>
                            </div>
                            <p className="item-subtotal">
                                {(item.product.sellPrice * item.quantity).toLocaleString('vi-VN')} VND
                            </p>
                        </div>
                    ))}
                </div>
                <div className="cart-summary">
                    <h2>Tổng cộng</h2>
                    <div className="summary-row">
                        <span>Tạm tính</span>
                        <span>{totalPrice.toLocaleString('vi-VN')} VND</span>
                    </div>
                    <div className="summary-row total">
                        <span>Thành tiền</span>
                        <span>{totalPrice.toLocaleString('vi-VN')} VND</span>
                    </div>
                    <Link to="/checkout" className="checkout-btn">
                        Tiến hành thanh toán
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default CartPage;