import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
    const { pathname, search } = useLocation();

    useLayoutEffect(() => {
        // Disable browser's native scroll restoration
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }

        const scrollToTop = () => {
            // 1. Scroll window (standard)
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

            // 2. Scroll the ACTUAL container identified in MainLayout.css and AdminLayout.css
            const scrollContainers = [
                document.querySelector('.main-layout-content'), // Public layout
                document.querySelector('.admin-content'),       // Admin layout
                document.querySelector('.admin-content-wrapper'),
                document.body,
                document.documentElement
            ];

            scrollContainers.forEach(container => {
                if (container) {
                    container.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                    container.scrollTop = 0; // Legacy fallback
                }
            });
        };

        // Immediate
        scrollToTop();

        // Sequential attempts to handle async rendering
        const t1 = setTimeout(scrollToTop, 10);
        const t2 = setTimeout(scrollToTop, 50);
        const t3 = setTimeout(scrollToTop, 150);

        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
            clearTimeout(t3);
        };
    }, [pathname, search]);

    return null;
};

export default ScrollToTop;
