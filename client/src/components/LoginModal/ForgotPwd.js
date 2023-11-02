import React from 'react'

const ForgotPwd = ({formData, handleChange}) => {
  return (
    <div>
        <input type="email" name="email" placeholder="E-mail" value={formData.email} onChange={handleChange} required/>
        <button className="submit-button" type="submit">Send Reset Link</button>    
    </div>
  )
}

export default ForgotPwd;