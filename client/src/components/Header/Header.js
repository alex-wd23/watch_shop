import {React, useState} from 'react';
import './Header.css';
import { Link } from 'react-router-dom';
import LoginModal from '../LoginModal/LoginModal';
import { useNavigate } from 'react-router-dom';


const Header = ({ setToken, token }) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleAccountIconClick = () => {
    token ? navigate('/account') : setShowModal(true);
  };

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
            <li><Link className='hover' to="/shop">Shop</Link></li>
            <li><Link className='hover' to="/about">About</Link></li>
            <li><Link className='hover' to="/contact">Contact</Link></li>
          </div>
        </ul>
        <div className='buttons'>
          <Link to="/"><img className='searchLink' src="/watch_shop/search_icon.ico" alt="seracIcon" /></Link>
          <Link to="/"><img className='cartIcon' src="/watch_shop/cart_icon.png" alt="seracIcon" /></Link>
          <div>
          <img 
            className='accountIcon' 
            src="/watch_shop/account_icon.png" 
            alt="accountIcon" 
            onClick={handleAccountIconClick} // Toggle modal on icon click
          />
          </div>
        </div>
      </nav>
      <LoginModal showModal={showModal} setShowModal={setShowModal} setToken={setToken} />
    </header>
  );
}

export default Header;






