import React from 'react';
import './TextBox.css'; // Import the CSS for the TextBox component

const TextBox = ({ title, description }) => {
  return (
    <div className='TextBox'>
      <h4>{title}</h4>
      <p>{description}</p>
    </div>
  );
};

export default TextBox;