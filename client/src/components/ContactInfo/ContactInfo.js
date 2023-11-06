import React from 'react'
import './ContactInfo.css'

const ContactInfo = ({type, details, details2, picture}) => {
  return (
    <div className='contactWrapper'>
        <i className={picture}></i>
        <h5>{type}</h5>
        <p>{details}</p>
        <p>{details2}</p>
    </div>
  )
}

export default ContactInfo