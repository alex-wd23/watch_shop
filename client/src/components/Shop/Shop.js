import React, { useEffect, useState } from 'react';
import './Shop.css';
import ShopFilter from '../ShopFilter/ShopFilter';
import Product from '../Product/Product';
import productsTable from './../../Database/Database';
import Scroll from '../Scroll/Scroll';
import axios from 'axios';


// const displayedProducts = productsTable.filter((product)=> {return product;} )

const Shop = () => {

  const [displayedProducts, setDisplayedProducts] = useState([]);
  
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
      <header className="title-container">
        <h1 className='title'>PRODUCTS</h1>
      </header>
      <hr className='hr-shop'></hr>
      <div className="main-content">
        <ShopFilter setDisplayedProducts={setDisplayedProducts}/>
        <div className='products'>
          <Scroll>
            <Product products={displayedProducts} /> 
          </Scroll> 
        </div>
      </div>
    </div>
  );
};

export default Shop;