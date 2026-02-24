import { useEffect } from 'react';

const SEO = ({ title, description, keywords }) => {
    useEffect(() => {
        // 1. Update Title
        if (title) {
            document.title = `${title} | TheDevilPlayz`;
        }

        // 2. Update Description
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', description || 'Discover the exclusive world of TheDevilPlayz. Premium toys and collectibles.');
        }

        // 3. Update Keywords
        const metaKeywords = document.querySelector('meta[name="keywords"]');
        if (metaKeywords) {
            metaKeywords.setAttribute('content', keywords || 'TheDevilPlayz, LEGO, collectibles, superheroes');
        }
    }, [title, description, keywords]);

    return null; // This component doesn't render anything
};

export default SEO;
