import React from 'react';

const CustomPagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePageClick = (page) => {
    if (page !== currentPage) {
      onPageChange(page);
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];

    // Show the first page
    if (totalPages > 0) {
      pageNumbers.push(
        <button
          key={1}
          onClick={() => handlePageClick(1)}
          className={`btn btn-md ${currentPage === 1 ? 'btn-success text-white focus-visible-none' : 'btn-light'} mx-1`}
        >
          1
        </button>
      );
    }

    // Add ellipses if needed
    if (currentPage > 4) {
      pageNumbers.push(
        <span key="ellipsis-start" className="mx-1">
          ...
        </span>
      );
    }

    // Show pages around the current page
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageClick(i)}
          className={`btn btn-md ${currentPage === i ? 'btn-success text-white' : 'btn-light'} mx-1`}
        >
          {i}
        </button>
      );
    }

    // Add ellipses if needed
    if (currentPage < totalPages - 3) {
      pageNumbers.push(
        <span key="ellipsis-end" className="mx-1">
          ...
        </span>
      );
    }

    // Show the last page
    if (totalPages > 1) {
      pageNumbers.push(
        <button
          key={totalPages}
          onClick={() => handlePageClick(totalPages)}
          className={`btn btn-md ${currentPage === totalPages ? 'btn-success text-white' : 'btn-light'} mx-1`}
        >
          {totalPages}
        </button>
      );
    }

    return pageNumbers;
  };

  return (
    <div className="d-flex justify-content-center align-items-center mt-4">
      {renderPageNumbers()}
    </div>
  );
};

export default CustomPagination;