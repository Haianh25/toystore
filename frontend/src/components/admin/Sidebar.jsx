import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';
import { FaTachometerAlt, FaBoxOpen, FaTags, FaShoppingCart, FaUsers, FaGift, FaBolt, FaCopyright, FaLayerGroup, FaImage, FaThList } from 'react-icons/fa';

const Sidebar = () => {
    return (
        <div className="sidebar">
            <div className="sidebar-header">
                Toy Store Admin
            </div>
            <nav className="sidebar-nav">
                <ul>
                    <li>
                        <NavLink to="/admin/dashboard">
                            <FaTachometerAlt className="icon" /> Dashboard
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/admin/products">
                            <FaBoxOpen className="icon" /> Quản lý Sản phẩm
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/admin/brands">
                            <FaCopyright className="icon" /> Quản lý Thương hiệu
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/admin/collections">
                            <FaLayerGroup className="icon" /> Quản lý Bộ sưu tập
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/admin/categories">
                            <FaTags className="icon" /> Quản lý Danh mục
                        </NavLink>
                    </li>
                    {/* <li>
                        <NavLink to="/admin/banners">
                            <FaImage className="icon" /> Quản lý Banner
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/admin/sections">
                            <FaThList className="icon" /> Quản lý Section
                        </NavLink>
                    </li> */}
                    <li>
                        <NavLink to="/admin/orders">
                            <FaShoppingCart className="icon" /> Quản lý Đơn hàng
                        </NavLink>
                    </li>
                    {/* <li>
                        <NavLink to="/admin/vouchers">
                            <FaGift className="icon" /> Quản lý Voucher
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/admin/flash-sales">
                            <FaBolt className="icon" /> Quản lý Flash Sale
                        </NavLink>
                    </li> */}
                    <li>
                        <NavLink to="/admin/users">
                            <FaUsers className="icon" /> Quản lý Người dùng
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;