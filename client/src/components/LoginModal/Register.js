import React from 'react'

const Register = ({formData, handleChange, usernameAndPassword, handleLogin}) => {
  return (
    <div>
        {usernameAndPassword}
        <input type="email" name="email" placeholder="E-mail" value={formData.email} onChange={handleChange} required/>
        <button className="submit-button" type="submit">Register</button>   
        <button className="submit-button" type="submit" onClick={handleLogin}>Login</button>
    </div>
  )
}

export default Register