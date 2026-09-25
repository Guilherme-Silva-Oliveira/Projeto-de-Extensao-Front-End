import React from 'react';
import './Pagination.css';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const handlePrevious = () => {
    if (currentPage > 0) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      onPageChange(currentPage + 1);
    }
  };

  const renderPages = () => {
    const pages = [];
    const maxVisible = 5;
    
    let startPage = Math.max(0, currentPage - 2);
    let endPage = Math.min(totalPages - 1, currentPage + 2);

    if (endPage - startPage < maxVisible - 1) {
        if (startPage === 0) {
            endPage = Math.min(totalPages - 1, startPage + maxVisible - 1);
        } else if (endPage === totalPages - 1) {
            startPage = Math.max(0, endPage - (maxVisible - 1));
        }
    }

    if (startPage > 0) {
      pages.push(
        <button key={0} className="pagination-btn" onClick={() => onPageChange(0)}>1</button>
      );
      if (startPage > 1) {
        pages.push(<span key="ellipsis-1" className="pagination-ellipsis">...</span>);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`pagination-btn ${currentPage === i ? 'active' : ''}`}
          onClick={() => onPageChange(i)}
        >
          {i + 1}
        </button>
      );
    }

    if (endPage < totalPages - 1) {
      if (endPage < totalPages - 2) {
        pages.push(<span key="ellipsis-2" className="pagination-ellipsis">...</span>);
      }
      pages.push(
        <button key={totalPages - 1} className="pagination-btn" onClick={() => onPageChange(totalPages - 1)}>
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="pagination-container">
      <button
        className="pagination-btn"
        onClick={handlePrevious}
        disabled={currentPage === 0}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
        Anterior
      </button>

      {renderPages()}

      <button
        className="pagination-btn"
        onClick={handleNext}
        disabled={currentPage === totalPages - 1}
      >
        Próximo
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
    </div>
  );
};

export default Pagination;
