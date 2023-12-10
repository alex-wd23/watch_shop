import React from 'react';
import './QuantityIndicator.css';
import { useCart } from '../../contexts/CartContext/CartContext.js';

const QuantityIndicator = ({ children }) => {
  const { cart } = useCart();
  const totalItems = cart.items.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="quantity-indicator-container">
      {children}
      {totalItems > 0 && (
        <span className="quantity-indicator">{totalItems}</span>
      )}
    </div>
  );
};

export default QuantityIndicator;