import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    // State riêng cho admin token
    const [adminToken, setAdminToken] = useState(localStorage.getItem('adminToken'));
    // State riêng cho user token
    const [userToken, setUserToken] = useState(localStorage.getItem('userToken'));

    // Hàm cho admin
    const adminLogin = (token) => {
        localStorage.setItem('adminToken', token);
        setAdminToken(token);
    };
    const adminLogout = () => {
        localStorage.removeItem('adminToken');
        setAdminToken(null);
    };

    // Hàm cho user
    const userLogin = (token) => {
        localStorage.setItem('userToken', token);
        setUserToken(token);
    };
    const userLogout = () => {
        localStorage.removeItem('userToken');
        setUserToken(null);
    };

    const value = {
        token: adminToken, // Giữ lại "token" cho trang admin
        adminLogin,
        adminLogout,
        userToken, // Thêm userToken
        userLogin,
        userLogout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};