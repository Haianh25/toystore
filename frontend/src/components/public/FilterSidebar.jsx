import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import './FilterSidebar.css';

const ageGroups = [
    { label: '1 - 3 tuổi', value: '1-3' },
    { label: '3 - 6 tuổi', value: '3-6' },
    { label: '6 - 12 tuổi', value: '6-12' },
    { label: '12 tuổi trở lên', value: '12+' },
];

const priceRanges = [
    { label: 'Dưới 200.000đ', min: '0', max: '200000' },
    { label: '200.000đ - 500.000đ', min: '200000', max: '500000' },
    { label: '500.000đ - 1.000.000đ', min: '500000', max: '1000000' },
    { label: 'Trên 1.000.000đ', min: '1000000', max: null },
];

const FilterSidebar = () => {
    const [categories, setCategories] = useState([]);
    const [collections, setCollections] = useState([]);
    const [brands, setBrands] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();
    const params = new URLSearchParams(location.search);

    useEffect(() => {
        axios.get('http://localhost:5000/api/v1/categories').then(res => setCategories(res.data.data.categories || []));
        axios.get('http://localhost:5000/api/v1/collections').then(res => setCollections(res.data.data.collections || []));
        axios.get('http://localhost:5000/api/v1/brands').then(res => setBrands(res.data.data.brands || []));
    }, []);

    const handleFilterChange = (type, value) => {
        const newParams = new URLSearchParams(location.search);
        
        if (type === 'price') {
            if (params.get('minPrice') === value.min) {
                newParams.delete('minPrice');
                newParams.delete('maxPrice');
            } else {
                newParams.set('minPrice', value.min);
                if (value.max) newParams.set('maxPrice', value.max);
                else newParams.delete('maxPrice');
            }
        } else {
            // Logic này giờ dùng chung cho age, brand, category, collection
            const currentValues = newParams.get(type) ? newParams.get(type).split(',') : [];
            if (currentValues.includes(value)) {
                const nextValues = currentValues.filter(item => item !== value);
                if (nextValues.length > 0) newParams.set(type, nextValues.join(','));
                else newParams.delete(type);
            } else {
                // Đối với category và collection, chúng ta chỉ cho chọn 1, nên sẽ ghi đè
                if (type === 'category' || type === 'collection') {
                    newParams.set(type, value);
                } else { // Đối với các loại khác, cho chọn nhiều
                    currentValues.push(value);
                    newParams.set(type, currentValues.join(','));
                }
            }
        }
        
        newParams.delete('page');
        // Không thay đổi pathname, chỉ cập nhật search params
        navigate({ pathname: location.pathname, search: newParams.toString() });
    };

    return (
        <aside className="filter-sidebar">
            {/* --- THAY ĐỔI LOGIC HIỂN THỊ COLLECTION --- */}
            <div className="filter-group">
                <h4>Bộ sưu tập</h4>
                {collections && collections.map(col => (
                    col.slug && 
                    <label key={col._id}>
                        <input 
                            type="checkbox" 
                            checked={params.get('collection') === col._id}
                            onChange={() => handleFilterChange('collection', col._id)} 
                        />
                        {col.name}
                    </label>
                ))}
            </div>

            {/* --- THAY ĐỔI LOGIC HIỂN THỊ CATEGORY --- */}
            <div className="filter-group">
                <h4>Danh Mục</h4>
                {categories && categories.map(cat => (
                    cat.slug && 
                    <label key={cat._id}>
                        <input 
                            type="checkbox" 
                            checked={params.get('category') === cat._id}
                            onChange={() => handleFilterChange('category', cat._id)} 
                        />
                        {cat.name}
                    </label>
                ))}
            </div>

            <div className="filter-group">
                <h4>Tuổi</h4>
                {ageGroups.map(group => (
                    <label key={group.value}>
                        <input type="checkbox" checked={params.get('age')?.split(',').includes(group.value) || false} onChange={() => handleFilterChange('age', group.value)} />
                        {group.label}
                    </label>
                ))}
            </div>
            <div className="filter-group">
                <h4>Giá</h4>
                {priceRanges.map(range => (
                    <label key={range.label}>
                        <input type="checkbox" checked={params.get('minPrice') === range.min} onChange={() => handleFilterChange('price', range)} />
                        {range.label}
                    </label>
                ))}
            </div>
            <div className="filter-group">
                <h4>Thương hiệu</h4>
                {brands && brands.map(brand => (
                    brand._id && <label key={brand._id}>
                        <input type="checkbox" checked={params.get('brand')?.split(',').includes(brand._id) || false} onChange={() => handleFilterChange('brand', brand._id)} />
                        {brand.name}
                    </label>
                ))}
            </div>
        </aside>
    );
};
export default FilterSidebar;