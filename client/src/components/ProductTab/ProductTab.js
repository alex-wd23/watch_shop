import React, { useState, useEffect } from 'react';
import './ProductTab.css';
import Product from '../Product/Product';
import productsTable from './../../Database/Database';

export const ProductTab = ({ parentWidth }) => {
  // State to manage the active button and filtered products
  const [activeButton, setActiveButton] = useState('classic');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0)

  // Function to handle button clicks
  const handleClick = (button) => {
    setActiveButton(button);
  };

  // UseEffect to handle the changing of activeButton, filtering products as per the activeButton
  useEffect(() => {
    // Function to fetch products from the server
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:3001/products');
        const data = await response.json();
        const filteredData = data.filter(product => product.category === activeButton);
        setFilteredProducts(filteredData);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
  
    fetchProducts();
  }, [activeButton]);

  let productsDisplayedOnPage;
  const SMALL_SCREEN = 768;
  const MEDIUM_SCREEN = 1024;
  const LARGE_SCREEN = 1440;
  const XLARGE_SCREEN = 1920;

  // Logic to determine the number of products to display based on screen width
  if (parentWidth < SMALL_SCREEN || parentWidth < MEDIUM_SCREEN) {
      productsDisplayedOnPage = 1;
  } else if (parentWidth < LARGE_SCREEN) {
      productsDisplayedOnPage = 3;
  } else {
      productsDisplayedOnPage = 4;
  }

  const endIndex = productsDisplayedOnPage + currentIndex;

  // Function to navigate to next product
  const nextProduct = () => {
    if (endIndex >= filteredProducts.length) {
      setCurrentIndex(0);
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  }

  // Function to navigate to previous product
  const previousProduct = () => {
    if (currentIndex === 0) {
      setCurrentIndex(0);
    } else {
      setCurrentIndex(currentIndex - 1);
    }
  }

  // Getting the products to be displayed on the page
  const displayedProducts = filteredProducts.slice(currentIndex, endIndex)

  return (
    <div className='productTabContainer'>
      <div>
        <h1 className='producth1'>POPULAR IN STORE</h1>
      </div>
      <div className='buttons'>
        {/* Buttons to switch between product categories */}
        <p className={`${activeButton === 'classic' ? 'onClickUnderline' : ''}`} onClick={() => handleClick('classic')}> CLASSIC </p>
        <p className={`${activeButton === 'modern' ? 'onClickUnderline' : ''}`} onClick={() => handleClick('modern')}> MODERN </p>
        <p className={`${activeButton === 'special' ? 'onClickUnderline' : ''}`} onClick={() => handleClick('special')}> SPECIAL EDITION </p>
      </div>
      {/* Product slider */}
      <div className='productSlider'>
        <div className='arrow leftArrowStyles' onClick={previousProduct}>❰</div>
        <div className='sliderContainer'>
          <Product products={displayedProducts}/>
        </div>
        <div className='arrow rightArrowStyles' onClick={nextProduct}>❱</div>
      </div>
    </div>
  ); 
};

export default ProductTab;