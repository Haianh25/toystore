import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Header from '../../components/public/Header';
import axios from 'axios';

// Mock context hooks
const mockUserLogout = vi.fn();
const mockNavigate = vi.fn();

// Mock context hooks
let mockAuthValue = { userToken: null, userLogout: vi.fn() };
vi.mock('../../context/AuthContext', () => ({
    useAuth: () => mockAuthValue
}));

let mockCartCount = 0;
vi.mock('../../context/CartContext', () => ({
    useCart: () => ({
        cartCount: mockCartCount
    })
}));

vi.mock('../../context/SocketContext', () => ({
    useSocket: () => ({
        socket: {
            on: vi.fn(),
            off: vi.fn()
        }
    })
}));

vi.mock('../../context/ToastContext', () => ({
    useToast: () => ({
        showToast: vi.fn()
    })
}));

// Mock react-router-dom hooks
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate
    };
});

// Mock axios
vi.mock('axios');

describe('Header', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        axios.get.mockResolvedValue({ data: { data: { collections: [] } } });
    });

    const renderHeader = () => {
        return render(
            <BrowserRouter>
                <Header />
            </BrowserRouter>
        );
    };

    it('should render brand name', () => {
        renderHeader();
        expect(screen.getByText('TheDevilPlayz')).toBeDefined();
    });

    it('should show search results when typing', async () => {
        axios.get.mockImplementation((url) => {
            if (url.includes('products?search')) {
                return Promise.resolve({
                    data: {
                        data: {
                            products: [
                                { _id: '1', name: 'Test Product', sellPrice: 1000, mainImage: '' }
                            ]
                        }
                    }
                });
            }
            return Promise.resolve({ data: { data: { collections: [] } } });
        });

        renderHeader();
        const input = screen.getByPlaceholderText(/LOOKING FOR SOMETHING SPECIAL/i);

        fireEvent.change(input, { target: { value: 'test' } });

        await waitFor(() => {
            expect(screen.getByText('Test Product')).toBeDefined();
        }, { timeout: 1000 });
    });

    it('should navigate to login when user icon is clicked (unauthenticated)', () => {
        renderHeader();
        const loginLink = screen.getByRole('link', { name: /Đăng nhập/i });
        expect(loginLink.getAttribute('href')).toBe('/login');
    });

    it('should show logout button when authenticated', () => {
        mockAuthValue = {
            userToken: 'fake-token',
            userLogout: vi.fn()
        };

        renderHeader();
        expect(screen.getByText('LOGOUT')).toBeDefined();
        expect(screen.getByRole('link', { name: /Tài khoản/i })).toBeDefined();
    });
});
