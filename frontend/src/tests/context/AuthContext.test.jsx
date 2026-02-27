import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import React from 'react';
import { AuthProvider, useAuth } from '../../context/AuthContext';

// Helper component to test AuthContext
const TestComponent = () => {
    const { userToken, adminToken, userLogin, userLogout, adminLogin, adminLogout, isAuthenticated, isAdminAuthenticated } = useAuth();
    return (
        <div>
            <div data-testid="user-token">{userToken || 'null'}</div>
            <div data-testid="admin-token">{adminToken || 'null'}</div>
            <div data-testid="is-auth">{isAuthenticated.toString()}</div>
            <div data-testid="is-admin-auth">{isAdminAuthenticated.toString()}</div>
            <button onClick={() => userLogin('test-user-token', { name: 'Test' })} data-testid="user-login-btn">User Login</button>
            <button onClick={userLogout} data-testid="user-logout-btn">User Logout</button>
            <button onClick={() => adminLogin('test-admin-token')} data-testid="admin-login-btn">Admin Login</button>
            <button onClick={adminLogout} data-testid="admin-logout-btn">Admin Logout</button>
        </div>
    );
};

describe('AuthContext', () => {
    beforeEach(() => {
        vi.stubGlobal('localStorage', {
            getItem: vi.fn(),
            setItem: vi.fn(),
            removeItem: vi.fn(),
            clear: vi.fn(),
        });
    });

    it('should provide default values', () => {
        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        expect(screen.getByTestId('user-token').textContent).toBe('null');
        expect(screen.getByTestId('admin-token').textContent).toBe('null');
        expect(screen.getByTestId('is-auth').textContent).toBe('false');
        expect(screen.getByTestId('is-admin-auth').textContent).toBe('false');
    });

    it('should handle user login and logout', async () => {
        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        const loginBtn = screen.getByTestId('user-login-btn');
        const logoutBtn = screen.getByTestId('user-logout-btn');

        await act(async () => {
            loginBtn.click();
        });

        expect(screen.getByTestId('user-token').textContent).toBe('test-user-token');
        expect(screen.getByTestId('is-auth').textContent).toBe('true');
        expect(localStorage.setItem).toHaveBeenCalledWith('userToken', 'test-user-token');

        await act(async () => {
            logoutBtn.click();
        });

        expect(screen.getByTestId('user-token').textContent).toBe('null');
        expect(screen.getByTestId('is-auth').textContent).toBe('false');
        expect(localStorage.removeItem).toHaveBeenCalledWith('userToken');
    });

    it('should handle admin login and logout', async () => {
        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        const loginBtn = screen.getByTestId('admin-login-btn');
        const logoutBtn = screen.getByTestId('admin-logout-btn');

        await act(async () => {
            loginBtn.click();
        });

        expect(screen.getByTestId('admin-token').textContent).toBe('test-admin-token');
        expect(screen.getByTestId('is-admin-auth').textContent).toBe('true');
        expect(localStorage.setItem).toHaveBeenCalledWith('adminToken', 'test-admin-token');

        await act(async () => {
            logoutBtn.click();
        });

        expect(screen.getByTestId('admin-token').textContent).toBe('null');
        expect(screen.getByTestId('is-admin-auth').textContent).toBe('false');
        expect(localStorage.removeItem).toHaveBeenCalledWith('adminToken');
    });
});
