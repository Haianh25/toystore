import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { FaTrashAlt, FaLongArrowAltRight } from 'react-icons/fa';
import { API_URL } from '../../config/api';
import './CartPage.css';

const CartPage = () => {
    const { cartItems, updateQuantity, removeFromCart, totalPrice, checkStockBeforeCheckout } = useCart();
    const serverUrl = API_URL;

    if (cartItems.length === 0) {
        return (
            <div className="cart-empty-container">
                <div className="cart-empty-content">
                    <h2 className="tdp-serif-title">YOUR SHOPPING BAG IS EMPTY</h2>
                    <p className="tdp-body-text">Explore our collections and find something extraordinary.</p>
                    <Link to="/products" className="tdp-button-outline">
                        CONTINUE EXPLORING
                    </Link>
                </div>
            </div>
        );
    }

    const isStockValid = checkStockBeforeCheckout();

    return (
        <div className="cart-page-wrapper">
            <header className="cart-page-header">
                <h1 className="tdp-serif-title">MY SHOPPING BAG</h1>
                <p className="cart-count">({cartItems.length} ITEMS)</p>
            </header>

            <div className="cart-content-grid">
                <div className="cart-items-column">
                    {cartItems.map(item => (
                        <div key={item.product._id} className="tdp-cart-item">
                            <div className="cart-item-image-box">
                                <img src={`${serverUrl}${item.product.mainImage}`} alt={item.product.name} />
                            </div>
                            <div className="cart-item-info">
                                <div className="cart-item-info-top">
                                    <Link to={`/products/${item.product._id}`} className="cart-item-name">{item.product.name}</Link>
                                    <div className="cart-item-subtotal">
                                        {(item.product.sellPrice * item.quantity).toLocaleString('vi-VN')} VND
                                    </div>
                                </div>
                                <p className="cart-item-price">{item.product.sellPrice.toLocaleString('vi-VN')} VND</p>

                                {item.quantity > item.product.stockQuantity && (
                                    <p className="stock-warning">Exceeds available stock ({item.product.stockQuantity} left)</p>
                                )}

                                <div className="cart-item-controls">
                                    <div className="tdp-quantity-selector">
                                        <button onClick={() => updateQuantity(item.product._id, item.quantity - 1)}>-</button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.product._id, item.quantity + 1)}>+</button>
                                    </div>
                                    <button onClick={() => removeFromCart(item.product._id)} className="tdp-remove-btn">
                                        REMOVE
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="cart-summary-column">
                    <div className="tdp-summary-card">
                        <h2 className="summary-title">ORDER SUMMARY</h2>
                        <div className="summary-row">
                            <span>SUBTOTAL</span>
                            <span>{totalPrice.toLocaleString('vi-VN')} VND</span>
                        </div>
                        <div className="summary-row">
                            <span>SHIPPING</span>
                            <span className="free-shipping">COMPLIMENTARY</span>
                        </div>
                        <div className="summary-divider"></div>
                        <div className="summary-row total">
                            <span>TOTAL</span>
                            <span className="total-price">{totalPrice.toLocaleString('vi-VN')} VND</span>
                        </div>

                        {!isStockValid && (
                            <p className="checkout-error">Please adjust quantities to match available stock before proceeding.</p>
                        )}

                        <Link
                            to={isStockValid ? "/checkout" : "#"}
                            className={`tdp-checkout-btn ${!isStockValid ? 'disabled' : ''}`}
                        >
                            PROCEED TO CHECKOUT <FaLongArrowAltRight />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
