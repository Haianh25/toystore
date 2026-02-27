import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import React from 'react';
import { CartProvider, useCart } from '../../context/CartContext';

// Helper component to test CartContext
const TestComponent = () => {
    const { cartItems, addToCart, updateQuantity, removeFromCart, clearCart, cartCount, totalPrice } = useCart();

    return (
        <div>
            <div data-testid="cart-count">{cartCount}</div>
            <div data-testid="total-price">{totalPrice}</div>
            <div data-testid="items-length">{cartItems.length}</div>
            <button
                onClick={() => addToCart({ _id: 'p1', name: 'P1', sellPrice: 100, stockQuantity: 10 }, 1)}
                data-testid="add-btn"
            >
                Add P1
            </button>
            <button
                onClick={() => updateQuantity('p1', 5)}
                data-testid="update-btn"
            >
                Update P1 to 5
            </button>
            <button
                onClick={() => removeFromCart('p1')}
                data-testid="remove-btn"
            >
                Remove P1
            </button>
            <button onClick={clearCart} data-testid="clear-btn">Clear Cart</button>
        </div>
    );
};

describe('CartContext', () => {
    beforeEach(() => {
        vi.stubGlobal('localStorage', {
            getItem: vi.fn(() => null),
            setItem: vi.fn(),
            removeItem: vi.fn(),
            clear: vi.fn(),
        });
    });

    it('should provide default values', () => {
        render(
            <CartProvider>
                <TestComponent />
            </CartProvider>
        );

        expect(screen.getByTestId('cart-count').textContent).toBe('0');
        expect(screen.getByTestId('total-price').textContent).toBe('0');
        expect(screen.getByTestId('items-length').textContent).toBe('0');
    });

    it('should add items to cart', async () => {
        render(
            <CartProvider>
                <TestComponent />
            </CartProvider>
        );

        const addBtn = screen.getByTestId('add-btn');

        await act(async () => {
            addBtn.click();
        });

        expect(screen.getByTestId('cart-count').textContent).toBe('1');
        expect(screen.getByTestId('total-price').textContent).toBe('100');
        expect(screen.getByTestId('items-length').textContent).toBe('1');
    });

    it('should update item quantity', async () => {
        render(
            <CartProvider>
                <TestComponent />
            </CartProvider>
        );

        const addBtn = screen.getByTestId('add-btn');
        const updateBtn = screen.getByTestId('update-btn');

        await act(async () => {
            addBtn.click();
        });

        await act(async () => {
            updateBtn.click();
        });

        expect(screen.getByTestId('cart-count').textContent).toBe('5');
        expect(screen.getByTestId('total-price').textContent).toBe('500');
    });

    it('should remove items from cart', async () => {
        render(
            <CartProvider>
                <TestComponent />
            </CartProvider>
        );

        const addBtn = screen.getByTestId('add-btn');
        const removeBtn = screen.getByTestId('remove-btn');

        await act(async () => {
            addBtn.click();
        });

        await act(async () => {
            removeBtn.click();
        });

        expect(screen.getByTestId('cart-count').textContent).toBe('0');
        expect(screen.getByTestId('items-length').textContent).toBe('0');
    });

    it('should clear cart', async () => {
        render(
            <CartProvider>
                <TestComponent />
            </CartProvider>
        );

        const addBtn = screen.getByTestId('add-btn');
        const clearBtn = screen.getByTestId('clear-btn');

        await act(async () => {
            addBtn.click();
        });

        await act(async () => {
            clearBtn.click();
        });

        expect(screen.getByTestId('cart-count').textContent).toBe('0');
        expect(localStorage.removeItem).toHaveBeenCalledWith('cart');
    });
});
