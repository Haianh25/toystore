import React from 'react';
import './Pagination.css';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible + 2) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);

            let start = Math.max(2, currentPage - 1);
            let end = Math.min(totalPages - 1, currentPage + 1);

            if (currentPage <= 3) {
                end = 4;
            } else if (currentPage >= totalPages - 2) {
                start = totalPages - 3;
            }

            if (start > 2) pages.push('...');

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            if (end < totalPages - 1) pages.push('...');

            pages.push(totalPages);
        }
        return pages;
    };

    const pages = getPageNumbers();

    return (
        <nav className="pagination-container">
            <button
                className="pagination-arrow"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                &laquo;
            </button>
            {pages.map((page, index) => (
                page === '...' ? (
                    <span key={`ellipsis-${index}`} className="pagination-ellipsis">&hellip;</span>
                ) : (
                    <button
                        key={page}
                        className={currentPage === page ? 'active' : ''}
                        onClick={() => onPageChange(page)}
                    >
                        {page}
                    </button>
                )
            ))}
            <button
                className="pagination-arrow"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                &raquo;
            </button>
        </nav>
    );
};

export default Pagination;