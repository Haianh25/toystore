import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        try {
            const localData = localStorage.getItem('cart');
            return localData ? JSON.parse(localData) : [];
        } catch (error) {
            console.error("Lỗi khi parse giỏ hàng từ localStorage", error);
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product, quantity) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.product._id === product._id);

            if (existingItem) {
                const newQuantity = existingItem.quantity + quantity;
                const finalQuantity = Math.min(newQuantity, product.stockQuantity);
                return prevItems.map(item =>
                    item.product._id === product._id
                        ? { ...item, quantity: finalQuantity }
                        : item
                );
            } else {
                return [...prevItems, { product, quantity }];
            }
        });
    };

    const updateQuantity = (productId, newQuantity) => {
        setCartItems(prevItems => {
            if (newQuantity <= 0) {
                return prevItems.filter(item => item.product._id !== productId);
            }
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

    const removeFromCart = (productId) => {
        setCartItems(prevItems => prevItems.filter(item => item.product._id !== productId));
    };

    const clearCart = () => {
        setCartItems([]);
        localStorage.removeItem('cart');
    };

    // Calculate totals
    const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);
    const totalPrice = cartItems.reduce((total, item) => total + item.product.sellPrice * item.quantity, 0);

    const checkStockBeforeCheckout = () => {
        // Return false if any item exceeds stock (based on local data)
        return cartItems.every(item => item.quantity <= item.product.stockQuantity);
    };

    const value = {
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        totalPrice,
        checkStockBeforeCheckout
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
