import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './Pagination.css';

const Pagination = ({ pagination, onPageChange }) => {
  if (!pagination) return null;

  const { currentPage, totalPages, hasNext, hasPrev } = pagination;
  
  if (totalPages <= 1) return null;

  return (
    <div className="pagination">
      <button 
        className="pagination-btn"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPrev}
      >
        <ChevronLeft size={16} />
        Previous
      </button>
      
      <span className="pagination-info">
        Page {currentPage} of {totalPages}
      </span>
      
      <button 
        className="pagination-btn"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNext}
      >
        Next
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

export default Pagination;