import { useState, React } from 'react';
import ProductDescriptionModal from '../ProductDescriptionModal/ProductDescriptionModal.js';
import './Product.css';
import { useCart } from '../../contexts/CartContext/CartContext.js';

const Product = ({ products }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);

  const showProduct = (product) => {
    setSelectedProduct(product); // Set the selected product
  }

  const { dispatch } = useCart();
  const { cart } = useCart();

  const addToCart = (product) => {
    dispatch({ type: 'ADD_ITEM', payload: product });
  };

  return (
    <div className="productContainer">
      {products.map((product) => (
        <div className="product" key={product.id}>
          <div className="imageContainer" >
            <img className='productImage' src={product.image_url} alt={product.name} onClick={() => showProduct(product)} />
          </div>
          <div>{product.name}</div>
          <div>${product.price}</div>
          <button className='button-87' onClick={() => addToCart(product)}>ADD TO CART</button>
        </div>
      ))}

      {selectedProduct && <ProductDescriptionModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
    </div>
  );
};

export default Product;