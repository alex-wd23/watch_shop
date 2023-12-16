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
    if (product.stock === 0) {
      alert('This item is out of stock.'); // Or use a more sophisticated notification system
    } else {
      dispatch({ type: 'ADD_ITEM', payload: product });
    }
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
        <div className={`product ${product.stock === 0 ? 'out-of-stock' : ''}`} key={product.id}>
          <div className="imageContainer"  onClick={() => showProduct(product)}>
            <img
              className={`productImage ${product.stock === 0 ? 'grayscale' : ''}`}
              src={product.image_url}
              alt={product.name}  
            />
            {product.stock === 0 && (
              <div className="out-of-stock-overlay">Out of Stock</div>
            )}
          </div>
          <div className="productDetails">
            <div className="productName">{product.name}</div>
            <div className="productPrice">${product.price}</div>
           
            <div className="productActions">
              {isProductInCart(product.id) ? (
                <div className="quantity-control">
                  <button className="quantity-button" onClick={() => removeFromCart(product.id)}>-</button>
                  <span className="quantity-display">{getProductQuantity(product.id)}</span>
                  <button className="quantity-button" onClick={() => addToCart(product)}>+</button>
                </div>
              ) : (
                <button className={`button-87 ${product.stock === 0 ? 'disabled' : ''}`}
                        onClick={() => addToCart(product)}
                        disabled={product.stock === 0}>
                  ADD TO CART
                </button>
              )}
               {product.stock < 3 && product.stock > 0 ? 
              <div className="low-stock-warning">Only {product.stock} left in stock!</div>
             : <div className="low-stock-warning"></div>}
            </div>
          </div>
        </div>
      ))}
      {selectedProduct && (
        <ProductDescriptionModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
};
export default Product;