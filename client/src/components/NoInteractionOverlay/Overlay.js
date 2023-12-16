import React from 'react';
import './Overlay.css';

const Overlay = ({ children, success, error, onClose }) => (
  <div className={success || error ? "overlay" : ""}>
    <div className={success ? "popup confirmation-popup" : error ? "popup error-popup" : ""}>
      {children}
      {error && <button className="close-button" onClick={onClose}>x</button>}
    </div>
  </div>
);

export default Overlay;