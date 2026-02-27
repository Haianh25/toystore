import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import ProductCard from '../../components/public/ProductCard';
import { ToastProvider } from '../../context/ToastContext';
import axios from 'axios';

// Mock axios
vi.mock('axios');

// Mock ToastContext
const mockShowToast = vi.fn();
vi.mock('../../context/ToastContext', () => ({
    useToast: () => ({
        showToast: mockShowToast
    }),
    ToastProvider: ({ children }) => <div>{children}</div>
}));

// Mock QuickViewModal to avoid depth issues
vi.mock('../../components/public/QuickViewModal', () => ({
    default: ({ isOpen, onClose }) => isOpen ? (
        <div data-testid="quick-view-modal">
            <button onClick={onClose} data-testid="close-modal">Close</button>
        </div>
    ) : null
}));

const mockProduct = {
    _id: 'p1',
    name: 'Awesome Toy',
    sellPrice: 250000,
    mainImage: '/images/toy.jpg',
    stockQuantity: 10
};

describe('ProductCard', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
        // Mock wishlist get call
        axios.get.mockResolvedValue({ data: { data: { wishlist: [] } } });
    });

    const renderCard = (props = {}) => {
        return render(
            <BrowserRouter>
                <ProductCard product={mockProduct} {...props} />
            </BrowserRouter>
        );
    };

    it('should render product information correctly', () => {
        renderCard();
        expect(screen.getByText('Awesome Toy')).toBeDefined();
        expect(screen.getByText(/250.000/)).toBeDefined();
    });

    it('should display sale price when provided', () => {
        renderCard({ salePrice: 200000 });
        expect(screen.getByText(/200.000/)).toBeDefined();
        expect(screen.getByText(/250.000/)).toBeDefined(); // Original price still visible (strike)
        expect(screen.getByText('SALE')).toBeDefined();
    });

    it('should open Quick View modal on button click', () => {
        renderCard();
        const quickViewBtn = screen.getByRole('button', { name: /Xem nhanh/i });
        fireEvent.click(quickViewBtn);
        expect(screen.getByTestId('quick-view-modal')).toBeDefined();
    });

    it('should handle wishlist toggle (unauthenticated)', () => {
        renderCard();
        const wishlistBtn = screen.getByRole('button', { name: /Thêm vào danh sách yêu thích/i });
        fireEvent.click(wishlistBtn);
        expect(mockShowToast).toHaveBeenCalledWith(expect.stringContaining('đăng nhập'), 'error');
    });
});
