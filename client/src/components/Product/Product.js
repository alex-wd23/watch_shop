import { useState, React } from 'react';
import ProductDescriptionModal from '../ProductDescriptionModal/ProductDescriptionModal.js';
import './Product.css';
import { useCart } from '../../contexts/CartContext/CartContext.js';

const Product = ({ products }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);

  const showProduct = (product) => {
    setSelectedProduct(product); // Set the selected product
  }

  
  const { cart , dispatch} = useCart();

  const addToCart = (product) => {
    dispatch({ type: 'ADD_ITEM', payload: product });
  };

  const removeFromCart = (itemId) => {
    dispatch({ type: 'REMOVE_ITEM', payload: itemId });
  };

  const isProductInCart = (productId) => {
    return cart.items.some(item => item.id === productId);
  };

  const getProductQuantity = (productId) => {
    const productInCart = cart.items.find(item => item.id === productId);
    return productInCart ? productInCart.quantity : 0;
  };

  return (
    <div className="productContainer">
     {products.map((product) => (
      <div className="product" key={product.id}>
        <div className="imageContainer" >
          <img className='productImage' src={product.image_url} alt={product.name} onClick={() => showProduct(product)} />
          <div className="bottom-right"></div>
          <div className="bottom-right-vertical"></div>
          <div className="bottom-left"></div>
          <div className="bottom-left-vertical"></div>
          <div className="top-left"></div>
          <div className="top-left-vertical"></div>
          <div className="top-right"></div>
          <div className="top-right-vertical"></div>
        </div>
        <div>{product.name}</div>
        <div>${product.price}</div>
        {isProductInCart(product.id) ? (
          <div className="quantity-control">
            <p className="quantity-button" onClick={() => removeFromCart(product.id)}>-</p>
            <div className="quantity-display">{getProductQuantity(product.id)}</div>
            <p className="quantity-button" onClick={() => addToCart(product)}>+</p>
          </div>
        ) : (
          <button className='button-87' onClick={() => addToCart(product)}>ADD TO CART</button>
        )}
      </div>
      ))}
      {selectedProduct && <ProductDescriptionModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
    </div>
  );
};

export default Product;