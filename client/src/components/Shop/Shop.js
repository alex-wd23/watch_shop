import React, { useEffect, useState } from 'react';
import './Shop.css';
import ShopFilter from '../ShopFilter/ShopFilter';
import Product from '../Product/Product';
import Scroll from '../Scroll/Scroll';
import axios from 'axios';
// import ParticlesContainer from '../Particles/ParticlesBG';
import Pagination from '../Pagination/Pagination';

const Shop = () => {

  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [firstProductIndex, setFirstProductIndex] = useState(0);
  const [lastProductIndex, setLastProductIndex] = useState(24);

  const resetPagination = () => {
    setFirstProductIndex(0);
    setLastProductIndex(24);
    setCurrentPage(1);
  };
 
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:3001/products");
        setDisplayedProducts(response.data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    }  
    fetchProducts();
  },[])

  return (
    
    <div className="shop-page"> 
      {/* <ParticlesContainer></ParticlesContainer> */}
      <header className="title-container">
        <h1 className='title'>PRODUCTS</h1>
      </header>
      <hr className='hr-shop'></hr>
      <div className="main-content">       
        <ShopFilter setDisplayedProducts={setDisplayedProducts} onFilterChange={resetPagination}/>
        <div className='products'>
          <Scroll>
            <Product products={displayedProducts.slice(firstProductIndex, lastProductIndex)} /> 
          </Scroll> 
        </div>
      </div>
      <Pagination setFirstProductIndex={setFirstProductIndex} setLastProductIndex={setLastProductIndex} displayedProducts={displayedProducts} setCurrentPage={setCurrentPage} currentPage={currentPage}/>
    </div>
    
  );
};

export default Shop;