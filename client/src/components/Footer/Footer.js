import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <div className="footer">
      <hr />
      <div className="heading">
        {/* <h2>Watch Shop<sup>™</sup></h2> */}
      </div>
      <div className="content">
        <div className="services">
          <h4>Services</h4>
          <p><a href="/home">Lorem ipsum dolor sit amet</a></p>
          <p><a href="/home">Lorem ipsum dolor sit amet</a></p>
          <p><a href="/home">Lorem ipsum dolor sit amet</a></p>
          <p><a href="/home">Lorem ipsum dolor sit amet</a></p>
        </div>
        <div className="social-media">
          <h4>Social</h4>
          <p><a href="/home"><i className="fab fa-linkedin"></i> Linkedin</a></p>
          <p><a href="/home"><i className="fab fa-twitter"></i> Twitter</a></p>
          <p><a href="https://github.com/"><i className="fab fa-github"></i> Github</a></p>
          <p><a href="https://www.facebook.com/"><i className="fab fa-facebook"></i> Facebook</a></p>
          <p><a href="https://www.instagram.com/"><i className="fab fa-instagram"></i> Instagram</a></p>
        </div>
        <div className="links">
          <h4>Quick links</h4>
          <p><a href="/home">Home</a></p>
          <p><a href="/home">Shop</a></p>
          <p><a href="/home">About</a></p>
          <p><a href="/home">Contact</a></p>
        </div>
        <div className="details">
          <h4 className="address">Address</h4>
          <p>
            Lorem ipsum dolor sit amet consectetur <br />
            adipisicing elit. Cupiditate, qui!
          </p>
          <h4 className="mobile">Mobile</h4>
          <p><a href="/home">+407*****</a></p>
          <h4 className="mail">Email</h4>
          <p><a href="/home">test@gmail.com</a></p>
        </div>
      </div>
      <footer>
        <hr />
        © 2022 Watch Shop.
      </footer>
    </div>
  );
}

export default Footer;