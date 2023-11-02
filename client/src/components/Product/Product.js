import React from 'react';
import './Product.css';

const Product = ({ products }) => {
  return (
    <div className="productContainer">
      {products.map((product) => (
        <div className="product" key={product.id}>
          <div className="imageContainer" >
            <img className='productImage' src={product.imageUrl} alt={product.name} />
          </div>
          <div>{product.name}</div>
          <div>${product.price}</div>
          <button className='button-87'>ADD TO CART</button>
        </div>
      ))}
    </div>
  );
};

export default Product;