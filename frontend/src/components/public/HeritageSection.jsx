import React from 'react';
import './HeritageSection.css';


const HeritageSection = () => {
    return (
        <section className="heritage-section">
            <div className="heritage-container">
                <div className="heritage-content">
                    <span className="heritage-subtitle">EXCELLENCE & TRADITION</span>
                    <h2 className="heritage-title">THE ART OF PLAY</h2>
                    <div className="heritage-divider"></div>
                    <p className="heritage-text">
                        "Deep in every heart slumbers a dream, and the couturier knows it: every woman is a princess."
                        <br /><br />
                        Just as we embrace the elegance of fashion, we believe in the magic of childhood.
                        Our curated collection represents the pinnacle of craftsmanship and imagination.
                    </p>
                    <span className="heritage-signature">TOYSTORE HERITAGE</span>
                </div>

                <div className="heritage-image-wrapper">
                    <img
                        src="https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&q=80&w=1974&ixlib=rb-4.0.3"
                        alt="Heritage and Craftsmanship"
                        className="heritage-image"
                    />
                    <div className="heritage-image-overlay"></div>
                </div>
            </div>
        </section>
    );
};

export default HeritageSection;
