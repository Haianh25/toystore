import React, { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './FlashSaleManagement.css';

const FlashSaleManagement = () => {
    const [flashSales, setFlashSales] = useState([]);
    const [expandedSaleId, setExpandedSaleId] = useState(null); // State để theo dõi dòng được mở rộng
    const apiConfig = { headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }};
    const serverUrl = 'http://localhost:5000';

    useEffect(() => {
        const fetchFlashSales = async () => {
            const res = await axios.get('http://localhost:5000/api/v1/flash-sales', apiConfig);
            setFlashSales(res.data.data.flashSales);
        };
        fetchFlashSales();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc muốn xóa chương trình sale này?')) {
            await axios.delete(`http://localhost:5000/api/v1/flash-sales/${id}`, apiConfig);
            setFlashSales(flashSales.filter(fs => fs._id !== id));
        }
    };

    const getStatus = (startTime, endTime) => {
        const now = new Date();
        if (now < new Date(startTime)) return <span style={{color: 'blue'}}>Sắp diễn ra</span>;
        if (now > new Date(endTime)) return <span style={{color: 'gray'}}>Đã kết thúc</span>;
        return <span style={{color: 'green'}}>Đang diễn ra</span>;
    };

    const handleToggleExpand = (id) => {
        setExpandedSaleId(expandedSaleId === id ? null : id);
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Quản lý Flash Sale</h1>
                <Link to="/admin/flash-sales/new" className="btn-primary">Tạo chương trình mới</Link>
            </div>
            <table className="admin-table">
                <thead>
                    <tr>
                        <th style={{ width: '5%' }}></th>
                        <th>Tên chương trình</th>
                        <th>Bắt đầu</th>
                        <th>Kết thúc</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {flashSales.map(fs => (
                        <Fragment key={fs._id}>
                            <tr>
                                <td>
                                    <button onClick={() => handleToggleExpand(fs._id)}>
                                        {expandedSaleId === fs._id ? '-' : '+'}
                                    </button>
                                </td>
                                <td>{fs.title}</td>
                                <td>{new Date(fs.startTime).toLocaleString('vi-VN')}</td>
                                <td>{new Date(fs.endTime).toLocaleString('vi-VN')}</td>
                                <td>{getStatus(fs.startTime, fs.endTime)}</td>
                                <td className="action-buttons">
                                    <Link to={`/admin/flash-sales/edit/${fs._id}`} className="btn-edit">Sửa</Link>
                                    <button onClick={() => handleDelete(fs._id)} className="btn-delete">Xóa</button>
                                </td>
                            </tr>
                            {/* Dòng mở rộng chứa danh sách sản phẩm */}
                            {expandedSaleId === fs._id && (
                                <tr className="expanded-row">
                                    <td colSpan="6">
                                        <div className="expanded-content">
                                            <h4>Sản phẩm trong chương trình:</h4>
                                            {fs.products.length > 0 ? (
                                                <ul className="product-sub-list">
                                                    {fs.products.map(p => (
                                                        <li key={p.product._id}>
                                                            <img src={`${serverUrl}${p.product.mainImage}`} alt={p.product.name} />
                                                            <span>{p.product.name}</span>
                                                            <span>Giá sale: {p.flashSalePrice.toLocaleString('vi-VN')} VND</span>
                                                            <span>Số lượng: {p.flashSaleStock}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : <p>Chưa có sản phẩm nào trong chương trình này.</p>}
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default FlashSaleManagement;