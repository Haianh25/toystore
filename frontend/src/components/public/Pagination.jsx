import React from 'react';
import './Pagination.css';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <nav className="pagination-container">
            <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
                &laquo;
            </button>
            {pages.map(page => (
                <button 
                    key={page} 
                    className={currentPage === page ? 'active' : ''}
                    onClick={() => onPageChange(page)}
                >
                    {page}
                </button>
            ))}
            <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                &raquo;
            </button>
        </nav>
    );
};

export default Pagination;