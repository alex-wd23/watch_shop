import {React, useState, useEffect} from 'react';
import './Header.css';
import { Link } from 'react-router-dom';
import LoginModal from '../LoginModal/LoginModal';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const Header = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check the authentication status when the component mounts
    const checkAuthStatus = async () => {
      try {
        const response = await axios.get('http://localhost:3001/checkAuth', { withCredentials: true });
        // If the request is successful, set the user as authenticated
        if (response.data.user) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        // If there is an error, particularly a 401 error, the user is not authenticated
        if (error.response && error.response.status === 401) {
          setIsAuthenticated(false);
        } else {
          console.error('Error checking authentication status:', error);
        }
      }
    };
    checkAuthStatus();
  }, []);

  const handleAccountIconClick = () => {
    if (isAuthenticated) {
      navigate('/account');
    } else {
      setShowModal(true);
    }
  };

  const handleAccountShopClick = () => {
    navigate('/shop')
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
            <li><Link className='hover' to="/">Home</Link></li>
            <li><Link className='hover' to="/shop" onClick={handleAccountShopClick}>Shop</Link></li>
            <li><Link className='hover' to="/about">About</Link></li>
            <li><Link className='hover' to="/contact">Contact</Link></li>
          </div>
        </ul>
        <div className='buttons'>
          <Link to="/"><img className='searchLink' src="/watch_shop/search_icon.ico" alt="seracIcon" /></Link>
          <Link to="/"><img className='cartIcon' src="/watch_shop/cart_icon.png" alt="seracIcon" /></Link>
          <div>
          <img className='accountIcon' src="/watch_shop/account_icon.png" alt="accountIcon" onClick={handleAccountIconClick} />
          </div>
        </div>
      </nav>
      <LoginModal showModal={showModal} setShowModal={setShowModal} />
    </header>
  );
}

export default Header;






