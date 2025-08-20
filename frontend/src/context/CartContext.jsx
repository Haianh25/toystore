import React, { createContext, useState, useContext, useEffect } from 'react';

// 1. Khởi tạo Context
const CartContext = createContext();

// Hook tùy chỉnh để dễ dàng sử dụng context
export const useCart = () => useContext(CartContext);

// 2. Tạo Provider
export const CartProvider = ({ children }) => {
    // Lấy giỏ hàng từ localStorage hoặc khởi tạo mảng rỗng
    const [cartItems, setCartItems] = useState(() => {
        try {
            const localData = localStorage.getItem('cart');
            return localData ? JSON.parse(localData) : [];
        } catch (error) {
            console.error("Lỗi khi parse giỏ hàng từ localStorage", error);
            return [];
        }
    });

    // Lưu giỏ hàng vào localStorage mỗi khi nó thay đổi
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    // Hàm thêm sản phẩm vào giỏ
    const addToCart = (product, quantity) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.product._id === product._id);

            if (existingItem) {
                // Nếu sản phẩm đã tồn tại, cập nhật số lượng
                const newQuantity = existingItem.quantity + quantity;
                // Đảm bảo không vượt quá số lượng tồn kho
                const finalQuantity = Math.min(newQuantity, product.stockQuantity);
                return prevItems.map(item =>
                    item.product._id === product._id
                        ? { ...item, quantity: finalQuantity }
                        : item
                );
            } else {
                // Nếu sản phẩm chưa có, thêm mới vào giỏ
                return [...prevItems, { product, quantity }];
            }
        });
    };

    // Hàm cập nhật số lượng
    const updateQuantity = (productId, newQuantity) => {
        setCartItems(prevItems => {
            if (newQuantity <= 0) {
                // Nếu số lượng <= 0, xóa sản phẩm khỏi giỏ
                return prevItems.filter(item => item.product._id !== productId);
            }
            // Tìm sản phẩm để kiểm tra tồn kho
            const itemToUpdate = prevItems.find(item => item.product._id === productId);
            if (!itemToUpdate) return prevItems;

            const finalQuantity = Math.min(newQuantity, itemToUpdate.product.stockQuantity);

            return prevItems.map(item =>
                item.product._id === productId
                    ? { ...item, quantity: finalQuantity }
                    : item
            );
        });
    };

    // Hàm xóa sản phẩm khỏi giỏ
    const removeFromCart = (productId) => {
        setCartItems(prevItems => prevItems.filter(item => item.product._id !== productId));
    };
    
    // Hàm xóa toàn bộ giỏ hàng (sau khi checkout)
    const clearCart = () => {
        setCartItems([]);
    };

    // Tính toán các giá trị phụ
    const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);
    const totalPrice = cartItems.reduce((total, item) => total + item.product.sellPrice * item.quantity, 0);


    // Cung cấp state và các hàm cho các component con
    const value = {
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        totalPrice
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};