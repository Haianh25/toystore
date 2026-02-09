import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [adminToken, setAdminToken] = useState(localStorage.getItem('adminToken'));
    const [userToken, setUserToken] = useState(localStorage.getItem('userToken'));
    const [user, setUser] = useState(null); // Optional: could fetch profile here

    const adminLogin = (token) => {
        localStorage.setItem('adminToken', token);
        setAdminToken(token);
    };

    const adminLogout = () => {
        localStorage.removeItem('adminToken');
        setAdminToken(null);
    };

    const userLogin = (token, userData) => {
        localStorage.setItem('userToken', token);
        setUserToken(token);
        if (userData) setUser(userData);
    };

    const userLogout = () => {
        localStorage.removeItem('userToken');
        setUserToken(null);
        setUser(null);
    };

    // Check for tokens on mount (integrity check)
    useEffect(() => {
        const aToken = localStorage.getItem('adminToken');
        const uToken = localStorage.getItem('userToken');
        if (aToken) setAdminToken(aToken);
        if (uToken) setUserToken(uToken);
    }, []);

    const value = {
        adminToken,
        adminLogin,
        adminLogout,
        userToken,
        user,
        userLogin,
        userLogout,
        isAuthenticated: !!userToken,
        isAdminAuthenticated: !!adminToken
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