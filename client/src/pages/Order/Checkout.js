import React, { useState, useEffect } from 'react';
import './Checkout.css';
import { useCart } from '../../contexts/CartContext/CartContext.js';
import QuantityIndicator from '../../components/QuantityIndicator/QuantityIndicator.js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Overlay from '../../components/NoInteractionOverlay/Overlay.js';
import { useUser } from '../../contexts/UserContext/UserContext';

export const Checkout = () => {
  const { cart, dispatch } = useCart();
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (cart.items.length === 0) {
      navigate('/shop'); // Redirect to the shop page or cart page
    }
  }, [cart.items, navigate]);

  const savedInfo = JSON.parse(localStorage.getItem('checkoutInfo'));
  const [saveInfo, setSaveInfo] = useState(false);
  const [formData, setFormData] = useState(savedInfo || {
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    phone: '',
    // ... other fields ...
  });

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showError, setShowError] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [stockInfo, setStockInfo] = useState({});


  const handleCloseError = () => {
    setShowError(false);
  };

  const validateForm = () => {
    let errors = {};
    const phoneNumberRegex = /^\+?\d{10,15}$/; // Regex for phone number validation
    const emailRegex = /^\S+@\S+\.\S+$/;
    const containsNumbers = /\d/; // Regular expression to check for digits

    if (!formData.email || !emailRegex.test(formData.email.trim())) {
      errors.email = 'Please provide a valid email.';
    }
    if (!formData.firstName.trim()) errors.firstName = "Please provide a first name.";
    if (!formData.lastName.trim()) errors.lastName = "Please provide a last name.";
    if (!formData.address.trim()) errors.address = "Please provide an address.";
    // Check for empty phone field
    if (!formData.phone.trim()) {
        errors.phone = "Please provide a phone number.";
    } else if (!phoneNumberRegex.test(formData.phone.trim())) { // Check for valid phone format
        errors.phone = "Please provide a valid phone number.";
    }
    
    if (containsNumbers.test(formData.firstName)) {
        errors.firstName = 'The name cannot include numbers.';
    }
    
    if (containsNumbers.test(formData.lastName)) {
        errors.lastName = 'The name cannot include numbers.';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0; // Return true if no errors
  };

  const validateFormOnChange = (fieldName, value) => {
    let errors = { ...formErrors };
    const phoneNumberRegex = /^\+?\d{10,15}$/; // Regex for phone number validation
    const emailRegex = /^\S+@\S+\.\S+$/;
    const containsNumbers = /\d/; // Regular expression to check for digits
  
    switch(fieldName) {
      case 'email':
        errors.email = (!value || !emailRegex.test(value.trim())) ? 'Please provide a valid email.' : '';
        break;
      case 'firstName':
        errors.firstName = (!value.trim()) ? 'Please provide a first name.' : (containsNumbers.test(value) ? 'The name cannot include numbers.' : '');
        break;
      case 'lastName':
        errors.lastName = (!value.trim()) ? 'Please provide a last name.' : (containsNumbers.test(value) ? 'The name cannot include numbers.' : '');
        break;
      case 'address':
        errors.address = (!value.trim()) ? 'Please provide an address.' : '';
        break;
      case 'phone':
        errors.phone = (!value.trim()) ? 'Please provide a phone number.' : (!phoneNumberRegex.test(value.trim()) ? 'Please provide a valid phone number.' : '');
        break;
      // Add other fields as necessary
      default:
        break;
    }
  
    setFormErrors(errors);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    // Revalidate the form to update error messages
    validateFormOnChange(name, value);
    
  };

  const calculateTotal = () => cart.items.reduce((total, item) => total + 10 + (item.price * item.quantity), 0);

  const handleCheckout = async () => {
    if (!validateForm()) return;
    const orderData = {
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        address: formData.address,
        apartment: formData.apartment,
        phone: formData.phone,
        items: cart.items,
        user_id: user?.user_id,
        total: calculateTotal(),
    };

    if (saveInfo) {
      localStorage.setItem('checkoutInfo', JSON.stringify(formData));
    }

    try {
        await axios.post('https://localhost:3001/checkout', orderData);

        for (const item of cart.items) {
          await axios.post('https://localhost:3001/updateStock', {
            watch_id: item.id,
            quantity: item.quantity
          });
        }
         // Show confirmation popup
         setShowConfirmation(true);
         setTimeout(() => {
          // Clear the cart
          dispatch({ type: 'CLEAR_CART' });
          navigate('/shop'); 
        }, 3000); // 3 seconds delay

    } catch (error) {
      if (error.response && error.response.status === 400) {
        // Log validation errors from the server
        console.log("Validation errors:", error.response.data.errors);
        setShowError(true);
        const updatedStockInfo = {};
      for (const item of cart.items) {
        try {
          const response = await axios.get(`https://localhost:3001/getStock?watch_id=${item.id}`);
          updatedStockInfo[item.id] = response.data;
          console.log(updatedStockInfo)
        } catch (err) {
          console.error("Error fetching stock info:", err);
        }
      }
      setStockInfo(updatedStockInfo);
      console.log(stockInfo)
      } else {
        // Log other types of errors
        console.error("Checkout error:", error);
      }
    }
  };

  

  return (
    <div className={`checkout-container ${showConfirmation ? 'no-interaction' : ''}`}>
    {showConfirmation && (
      <Overlay success={showConfirmation}>
        Order placed successfully!
      </Overlay>
    )}
    {showError && (
      <Overlay error={showError} onClose={handleCloseError}>
        One or more products are not in stock!
      </Overlay>
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
              {formErrors.firstName && <span className="error-message">{formErrors.firstName}</span>}
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
              {formErrors.lastName && <span className="error-message">{formErrors.lastName}</span>}

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
            {formErrors.address && <span className="error-message">{formErrors.address}</span>}
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
            {formErrors.phone && <span className="error-message">{formErrors.phone}</span>}
          </div>
          <div className="input-group input-group-checkbox">
          <input
              type="checkbox"
              id="save-info"
              name="saveInfo"
              checked={saveInfo}
              onChange={(e) => setSaveInfo(e.target.checked)}
              className="hidden-checkbox"
            />            
            <label className='checbox-label' htmlFor="save-info">Save this information for next time</label>
            <div className="custom-checkbox" onClick={() => {setSaveInfo(!saveInfo); console.log(saveInfo)}}></div>
          </div>
          <button onClick={handleCheckout} className='shipping-button'>Finish order</button>
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
                <div className="checkout-cart-item-name">{item.name}</div>
                <div className="checkout-cart-item-price">${(item.price * item.quantity).toFixed(2)}</div>
                {showError && stockInfo[item.id] !== undefined && stockInfo[item.id] < item.quantity ? (
                <div className="stock-info">
                  Available stock: {stockInfo[item.id]}
                </div> 
              ): <div className='stock-info-placeholder'></div>}
              </div> 
            </div> 
          ))}
          <div className="summary-total">
            <div className='summary-total-left-column'>
              <span>Shipping: </span>
              <span>Total: </span>
            </div>
            <div className='summary-total-right-column'>
              <span>$10.00</span>
              <span>${(calculateTotal().toFixed(2))}</span>  
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}