import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { API_URL } from '../../config/api';
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
    const [collections, setCollections] = useState([]);
    const [brands, setBrands] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();
    const params = new URLSearchParams(location.search);
    const { slug } = useParams();

    useEffect(() => {
        // Lấy danh sách collections và brands
        axios.get(`${API_URL}/api/v1/collections`).then(res => setCollections(res.data.data.collections || []));
        axios.get(`${API_URL}/api/v1/brands`).then(res => setBrands(res.data.data.brands || []));
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
            const currentValues = newParams.get(type) ? newParams.get(type).split(',') : [];
            if (currentValues.includes(value)) {
                const nextValues = currentValues.filter(item => item !== value);
                if (nextValues.length > 0) newParams.set(type, nextValues.join(','));
                else newParams.delete(type);
            } else {
                currentValues.push(value);
                newParams.set(type, currentValues.join(','));
            }
        }

        newParams.delete('page');
        navigate({ pathname: location.pathname, search: newParams.toString() });
    };

    return (
        <aside className="filter-sidebar">
            <div className="filter-group">
                <h4>Bộ sưu tập</h4>
                {collections && collections.map(col => {
                    if (!col.slug) return null;
                    const isActive = location.pathname.startsWith('/collection') && slug === col.slug;
                    // Sửa lại cách tạo link để nó luôn hoạt động đúng
                    const destination = isActive ? '/products' : `/collection/${col.slug}`;
                    return (
                        <Link key={col._id} to={destination} className={`filter-link ${isActive ? 'active' : ''}`}>
                            {col.name}
                        </Link>
                    )
                })}
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
                        <input
                            type="checkbox"
                            name="price"
                            checked={params.get('minPrice') === range.min}
                            onChange={() => handleFilterChange('price', range)}
                        />
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