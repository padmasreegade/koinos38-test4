import React from 'react';
import '../styles.css';

const Pagination = ({pagination, onPageChange, disabled = false}) => {
    if (!pagination || typeof pagination !== 'object' || pagination.totalPages <= 1) return null;

    const defaultPagination = {
        currentPage = 1, totalPages = 1, hasNextPage = false, hasPrevPage = false, totalItems = 0, itemsPerPage = 10
    } = pagination || {};

    const handlePrevious = () => {
        if (hasPrevPage && !disabled) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (hasNextPage && !disabled) {
            onPageChange(currentPage + 1);
        }
    };

    const handlePageClick = (page) => {
        if (page !== currentPage && !disabled) {
            onPageChange(page);
        }
    };

    // Generate page numbers
    const getPageNumbers = () => {
        const delta = 2;
        const range = [];
        const rangeWithDots = [];

        for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
            range.push(i);
        }

        if (currentPage - delta > 2) {
            rangeWithDots.push(1, '...');
        } else {
            rangeWithDots.push(1);
        }
        rangeWithDots.push(...range);

        if (currentPage + delta < totalPages - 1) {
            rangeWithDots.push('...', totalPages);
        } else {
            rangeWithDots.push(totalPages);
        }

        return rangeWithDots;
    };

    const pageNumbers = totalPages > 1 ? getPageNumbers() : [];

    return (<div className="pagination">
        <div className="pagination-info">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} items.
        </div>
        <nav aria-label="Pagination Navigation" className="pagination-nav-bar">
            <button
                onClick={handlePrevious}
                disabled={!hasPrevPage}
                aria-label={"Previous Page"}
                className="pagination-button"
            >
                ← Previous
            </button>

            {/* Page Numbers*/}
            {pageNumbers.map((page, index) => (page === '...' ? (
                <span key={`ellipse-${index}`} className="pagination-ellipse"> ... </span>) : (<button
                key={page}
                onClick={() => handlePageClick(page)}
                disabled={disabled}
                aria-label={`Go to page ${page}`}
                aria-current={page === currentPage ? 'page' : undefined}
                className={`pagination-btn ${page === currentPage ? 'active' : ''}`}
            >
                {page}
            </button>)))}

            <button
                onClick={handleNextPage}
                disabled={!hasNextPage || disabled}
                aria-label="Next Page"
                className="pagination-btn"
            >
                Next ⟶
            </button>
        </nav>
    </div>);
};

export default Pagination;