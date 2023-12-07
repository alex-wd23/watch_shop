import {React, useState } from 'react';
import './Header.css';
import { NavLink, Link } from 'react-router-dom';
import LoginModal from '../LoginModal/LoginModal';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CartModal from '../CartModal/CartModal';


const Header = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showCart, setShowCart] = useState(false);

  const checkAuthStatus = async () => {
  
    try {
      const response = await axios.get('http://localhost:3001/checkAuth', { withCredentials: true });
      const isAuthenticatedNow = response.data.user ? true : false;
      setIsAuthenticated(isAuthenticatedNow);
      return isAuthenticatedNow;
    } catch (error) {
      // If there is an error, particularly a 401 error, the user is not authenticated
      if (error.response && error.response.status === 401) {
        setIsAuthenticated(false);      
      } else {
        console.error('Error checking authentication status:', error);
      }
    }
  };


  const handleAccountIconClick = async () => {
    const authenticated = await checkAuthStatus();
    if (authenticated) {
      navigate('/account');
    } else {
      setShowModal(true);
    }
    
  };

  const handleAccountShopClick = () => {
    navigate('/shop')
  }

  const showCartModal = () => {
    setShowCart(true);
  }

  return (
    <header>
      <nav className="navbar">
        <div>
          <Link to="/"><img className='logo' src="/watch_shop/logo.png" alt="logo" /></Link>
        </div>
        <ul className="nav-links">
          <input type="checkbox" id="checkbox_toggle" />
          <label htmlFor="checkbox_toggle" className="hamburger">&#9776;</label>
          <div className="menu">
            <li><NavLink className='hover' to="/">Home</NavLink ></li>
            <li><NavLink  className='hover' to="/shop" onClick={handleAccountShopClick}>Shop</NavLink ></li>
            <li><NavLink  className='hover' to="/about">About</NavLink ></li>
            <li><NavLink  className='hover' to="/contact">Contact</NavLink ></li>
          </div>
        </ul>
        <div className='buttons'>
          <Link to="/"><img className='searchLink' src="/watch_shop/search_icon.ico" alt="seracIcon" /></Link>
          <Link to="#"><img className='cartIcon' src="/watch_shop/cart_icon.png" alt="seracIcon" onClick={showCartModal} /></Link>
          <div>
          <img className='accountIcon' src="/watch_shop/account_icon.png" alt="accountIcon" onClick={handleAccountIconClick} />
          </div>
        </div>
      </nav>
      {showCart && <CartModal setShowCart={setShowCart}/>}
      <LoginModal showModal={showModal} setShowModal={setShowModal} />
    </header>
  );
}

export default Header;






