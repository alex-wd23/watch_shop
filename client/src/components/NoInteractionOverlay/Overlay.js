import React from 'react'
import './Overlay.css'

const Overlay = ({ children }) => (
    <div className="overlay">
      <div className="confirmation-popup">
        {children}
      </div>
    </div>
  );

export default Overlay;