import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SectionFormModal from '../../components/admin/SectionFormModal';
import './BannerManagement.css';

const SectionManagement = () => {
    const [sections, setSections] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSection, setEditingSection] = useState(null);
    const apiConfig = { headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` } };

    const fetchSections = async () => {
        const res = await axios.get('http://localhost:5000/api/v1/sections', apiConfig);
        setSections(res.data.data.sections);
    };

    useEffect(() => { fetchSections(); }, []);

    const handleOpenCreate = () => {
        setEditingSection(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (section) => {
        setEditingSection(section);
        setIsModalOpen(true);
    };

    const handleSubmit = async (formData) => {
        try {
            if (editingSection) {
                await axios.patch(`http://localhost:5000/api/v1/sections/${editingSection._id}`, formData, apiConfig);
            } else {
                await axios.post('http://localhost:5000/api/v1/sections', formData, apiConfig);
            }
            fetchSections();
            setIsModalOpen(false);
        } catch (error) {
            alert(`Lỗi: ${error.response?.data?.message || 'Có lỗi xảy ra'}`);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc muốn xóa section này?')) {
            try {
                await axios.delete(`http://localhost:5000/api/v1/sections/${id}`, apiConfig);
                fetchSections();
            } catch (error) {
                alert('Xóa section thất bại!');
            }
        }
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Quản lý Section Trang chủ</h1>
                <button className="btn-primary" onClick={handleOpenCreate}>Thêm Section</button>
            </div>
            <div>
                {sections.map(section => (
                    <div key={section._id} style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '15px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h3>{section.title} <span style={{fontSize: '0.9rem', color: '#666'}}>({section.type})</span></h3>
                            <p>Thứ tự: {section.sortOrder} | Trạng thái: {section.isActive ? 'Hoạt động' : 'Ẩn'}</p>
                        </div>
                        <div>
                            <button className="btn-edit" onClick={() => handleOpenEdit(section)}>Sửa</button>
                            <button className="btn-delete" onClick={() => handleDelete(section._id)}>Xóa</button>
                        </div>
                    </div>
                ))}
            </div>
            <SectionFormModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmit}
                section={editingSection}
            />
        </div>
    );
};

export default SectionManagement;