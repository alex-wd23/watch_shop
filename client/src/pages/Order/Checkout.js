import React, { useState } from 'react';
import './Checkout.css';
import { useCart } from '../../contexts/CartContext/CartContext.js';
import QuantityIndicator from '../../components/QuantityIndicator/QuantityIndicator.js';

export const Checkout = () => {
  const { cart } = useCart();
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    adress:'',
    apartment:'',
    phone:'',
    // Add other fields as necessary
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const calculateTotal = () => cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <div className="checkout-container">
      <div className="form-container">
        {/* Contact Section */}
        <div className="form-section">
          <div className="section-header">Contact</div>
          <div className="input-group">
            <input 
              type="email" 
              id="email" 
              name="email" 
              value={formData.email}
              onChange={handleInputChange}
              className={formData.email ? 'filled' : ''}
            />
            <label htmlFor="email" className={formData.email ? 'filled' : ''}>Email</label>
          </div>
          {/* Shipping Address Section */}
          {/* ... */}
          <div className="section-header">Shipping adress</div>
          <div className="input-row">
            {/* First Name */}
            <div className="input-group">
              <input 
                type="text" 
                id="first-name" 
                name="firstName" 
                value={formData.firstName}
                onChange={handleInputChange}
                className={formData.firstName ? 'filled' : ''}
              />
              <label htmlFor="first-name" className={formData.firstName ? 'filled' : ''}>First name</label>
            </div>
            {/* Last Name */}
            <div className="input-group">
              <input 
                type="text" 
                id="last-name" 
                name="lastName" 
                value={formData.lastName}
                onChange={handleInputChange}
                className={formData.lastName ? 'filled' : ''}
              />
              <label htmlFor="last-name" className={formData.lastName ? 'filled' : ''}>Last name</label>
            </div>
          </div>
          {/* ... Additional form fields ... */}
          <div className="input-group">
              <input 
                type="adress" 
                id="adress" 
                name="adress" 
                value={formData.adress}
                onChange={handleInputChange}
                className={formData.adress ? 'filled' : ''}
              />
            <label htmlFor="adress" className={formData.adress ? 'filled' : ''}>Adress</label>
          </div>
          <div className="input-group">
              <input 
                type="apartment" 
                id="apartment" 
                name="apartment" 
                value={formData.apartment}
                onChange={handleInputChange}
                className={formData.apartment ? 'filled' : ''}
              />
            <label htmlFor="apartment" className={formData.apartment ? 'filled' : ''}>Apartment, suite, etc. (optional)</label>
          </div>
          <div className="input-group">
              <input 
                type="phone" 
                id="phone" 
                name="phone" 
                value={formData.phone}
                onChange={handleInputChange}
                className={formData.phone ? 'filled' : ''}
              />
            <label htmlFor="phone" className={formData.phone ? 'filled' : ''}>Phone</label>
          </div>
          <button className='shipping-button'>Continue to shipping</button>
        </div>
      </div>
      <div className="divider"></div> 
      <div className="summary-container">
        <div className="summary-box">
          {/* Map through cart items */}
          {cart.items.map(item => (
            <div className="cart-item" key={item.id}>
              <QuantityIndicator itemQuantity={item.quantity}>
              <img src={item.image_url} alt={item.name} className="cart-item-image" />
              </QuantityIndicator>
              <div className="cart-item-details">
                <div className="cart-item-name">{item.name}</div>
                <div className="cart-item-description">{item.description}</div>
                <div className="cart-item-price">${(item.price * item.quantity).toFixed(2)}</div>
                {/* <div className="quantity-display">{item.quantity}</div> */}
              </div>
            </div> 
          ))}
          <div className="summary-total">
            <span>Shipping: $10</span>
            <br></br>
            <span>Total: </span>
            <span>${calculateTotal().toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}