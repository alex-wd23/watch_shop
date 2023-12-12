import React, { useState } from 'react';
import './Checkout.css';
import { useCart } from '../../contexts/CartContext/CartContext.js';
import QuantityIndicator from '../../components/QuantityIndicator/QuantityIndicator.js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const Checkout = () => {
  const navigate = useNavigate();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address:'',
    apartment:'',
    phone:'',
    // Add other fields as necessary
  });
  const { cart, dispatch } = useCart();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    let errors = {};
    if (!formData.email.trim()) errors.email = "Please provide an email.";
    if (!formData.firstName.trim()) errors.firstName = "Please provide a first name.";
    if (!formData.lastName.trim()) errors.lastName = "Please provide a last name.";
    if (!formData.address.trim()) errors.address = "Please provide an address.";
    if (!formData.phone.trim()) errors.phone = "Please provide a phone number.";

    setFormErrors(errors);

    return Object.keys(errors).length === 0; // Return true if no errors
  };

  const handleCheckout = async () => {
    // if (!validateForm()) return;
    const orderData = {
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        address: formData.address,
        apartment: formData.apartment,
        phone: formData.phone,
        items: cart.items
    };

    try {
        const response = await axios.post('http://localhost:3001/checkout', orderData);
        console.log(response.data);
        // Clear the cart
        dispatch({ type: 'CLEAR_CART' });
         // Show confirmation popup
         setShowConfirmation(true);
         setTimeout(() => {
          navigate('/shop'); // Replace '/shop' with the actual path to your shop
        }, 3000); // 3 seconds delay
    } catch (error) {
      if (error.response && error.response.status === 400) {
        // Log validation errors from the server
        console.log("Validation errors:", error.response.data.errors);
      } else {
        // Log other types of errors
        console.error("Checkout error:", error);
      }
    }
  };

  const calculateTotal = () => cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <div className="checkout-container">
      {showConfirmation && (
                <div className="confirmation-popup">
                    Order placed successfully!
                </div>
      )}
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
            {formErrors.email && <span className="error-message">{formErrors.email}</span>}
          </div>
          {/* Shipping Address Section */}
          {/* ... */}
          <div className="section-header">Shipping address</div>
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
                type="address" 
                id="address" 
                name="address" 
                value={formData.address}
                onChange={handleInputChange}
                className={formData.address ? 'filled' : ''}
              />
            <label htmlFor="address" className={formData.address ? 'filled' : ''}>Address</label>
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
          <button  onClick={handleCheckout} className='shipping-button'>Finish order</button>
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