// Pagination.js
import React from "react";
import styles from "./Pagination.module.css"; 

function Pagination({ currentPage, totalPages, onPageChange }) {
  const handleNextPage = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  return (
    <div className={styles.pagination}>
      <button onClick={handlePrevPage} disabled={currentPage === 1}>
        قبلی
      </button>
      <span>
        صفحه {currentPage} از {totalPages}
      </span>
      <button onClick={handleNextPage} disabled={currentPage === totalPages}>
        بعدی
      </button>
    </div>
  );
}

export default Pagination;
