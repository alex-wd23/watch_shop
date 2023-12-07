
import React from 'react';
import './Checkout.css';
import { useCart } from '../../contexts/CartContext/CartContext.js';

export const Checkout = () => {

  const { cart } = useCart();

  const calculateTotal = () => cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <div className="checkout-container">
      <div className="form-container">
        {/* Contact Section */}
        <div className="form-section">
          <div className="section-header">Contact</div>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" placeholder="Enter your email" />
          </div>
          {/* Additional form fields */}
        </div>

        {/* Shipping Address Section */}
        <div className="form-section">
          <div className="section-header">Shipping address</div>
          {/* Row for first name and last name */}
          <div className="input-row">
            <div className="input-group">
              <label htmlFor="first-name">First name</label>
              <input type="text" id="first-name" placeholder="First name" />
            </div>
            <div className="input-group">
              <label htmlFor="last-name">Last name</label>
              <input type="text" id="last-name" placeholder="Last name" />
            </div>
          </div>
          {/* Additional form fields */}
          <button className="button">Continue to shipping</button>
        </div>
      </div>

      <div className="summary-container">
        <div className="summary-box">
          {/* Map through cart items */}
          {cart.items.map(item => (
            <div className="cart-item" key={item.id}>
              <img src={item.image_url} alt={item.name} className="cart-item-image" />
              <div className="cart-item-details">
                <div className="cart-item-name">{item.name}</div>
                <div className="cart-item-description">{item.description}</div>
                <div className="cart-item-price">${(item.price * item.quantity).toFixed(2)}</div>
                <div className="quantity-display">{item.quantity}</div>
              </div>
            </div>
          ))}
          <div className="summary-total">
            <span>Total</span>
            <span>${calculateTotal().toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}