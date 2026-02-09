import React from 'react';
import { Link } from 'react-router-dom';
import './CategoryShowcase.css';

const categories = [
    {
        id: 1,
        title: "WOODEN HERITAGE",
        subtitle: "CRAFTSMANSHIP",
        image: "https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&q=80&w=1000",
        link: "/category/wooden-toys"
    },
    {
        id: 2,
        title: "SOFT COMPANIONS",
        subtitle: "TENDERNESS",
        image: "https://images.unsplash.com/photo-1535572290543-960a8046f5af?auto=format&fit=crop&q=80&w=1000",
        link: "/category/plush-toys"
    },
    {
        id: 3,
        title: "CREATIVE MINDS",
        subtitle: "IMAGINATION",
        image: "https://images.unsplash.com/photo-1618842676088-c4d48a6a7c9d?auto=format&fit=crop&q=80&w=1000",
        link: "/category/educational-toys"
    }
];

const CategoryShowcase = () => {
    return (
        <section className="category-showcase">
            <div className="showcase-grid">
                {categories.map((cat) => (
                    <Link to={cat.link} key={cat.id} className="category-card">
                        <div className="card-image-wrapper">
                            <img src={cat.image} alt={cat.title} />
                            <div className="card-overlay"></div>
                        </div>
                        <div className="card-content">
                            <span className="card-subtitle">{cat.subtitle}</span>
                            <h3 className="card-title">{cat.title}</h3>
                            <span className="card-explore">EXPLORE ▸</span>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default CategoryShowcase;
