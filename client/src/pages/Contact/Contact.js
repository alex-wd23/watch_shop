import React from 'react'
import './Contact.css'
import ContactInfo from '../../components/ContactInfo/ContactInfo'
import ContactForm from '../../components/ContactForm/ContactForm'

const Contact = () => {
  return (
    <div className='contact'> 
     <h1>CONTACT</h1>
        <div className='contactInfo'>
          {/* The pictures are using font awesome in index.html */}
          <ContactInfo picture='fa-solid fa-phone' type="Phone" details="1111-222-3333" details2='1111-222-3333' />
          <ContactInfo picture='fa-regular fa-envelope' type="E-mail" details="test@test@gmail.com" details2='test@test@gmail.com'/>
          <ContactInfo picture='fa-solid fa-location-dot' type="Address" details="No: 58 A, East Madison Street," details2='Baltimore, MD, USA 4508'/>
        </div>
      <ContactForm />
    </div>
  )
}

export default Contact