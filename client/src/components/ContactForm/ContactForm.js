import React, { useState } from 'react';
import './ContactForm.css';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (event) => {
    const { value, attributes } = event.target;
    const field = attributes.getNamedItem('field').value;
    setFormData(prevData => ({ ...prevData, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(formData);
  };

  return (
    <form onSubmit={handleSubmit} className='contact-form'>
      <h1>Contact Us</h1>
      <p>We're here to help and answer any question you might have.</p>
      
      <div className='form-group'>
      <label>Name</label>
        <input type='text' field='name' value={formData.name} onChange={handleChange} required />
        
      </div>
      
      <div className='form-group'>
      <label>Email</label>
        <input type='email' field='email' value={formData.email} onChange={handleChange} required />
        
      </div>
      
      <div className='form-group'>
      <label>Message</label>
        <textarea field='message' value={formData.message} onChange={handleChange} required />
        
      </div>
      
      <button type='submit'>Submit</button>
    </form>
  );
};

export default ContactForm;