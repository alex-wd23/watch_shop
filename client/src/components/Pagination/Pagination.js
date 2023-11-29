import React from 'react';
import './Pagination.css';

const Pagination = ({ displayedProducts, setFirstProductIndex, setLastProductIndex, setCurrentPage ,currentPage }) => {
  const productsPerPage = 24;
  let totalPages = Math.ceil(displayedProducts.length / productsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) {
    setFirstProductIndex(currentIndex => Math.min(currentIndex + productsPerPage, displayedProducts.length - productsPerPage));
    setLastProductIndex(currentIndex => Math.min(currentIndex + productsPerPage, displayedProducts.length));
    setCurrentPage(currentPage+1)
    }
  }

  const previousPage = () => {
    if (currentPage > 1) {
    setFirstProductIndex(currentIndex => Math.max(0, currentIndex - productsPerPage));
    setLastProductIndex(currentIndex => Math.max(productsPerPage, currentIndex - productsPerPage));
    setCurrentPage(currentPage-1)
    }
  }

  return (
    <nav>
      <ul className='pagination'>
        <li className='pagArrows' onClick={previousPage}>⮜</li>
        <span className='pageNumber'>{currentPage}</span>
        <li className='pagArrows' onClick={nextPage}>⮞</li>
      </ul>
    </nav>
  );
};

export default Pagination;