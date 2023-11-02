import React from 'react'
import './ForgotPwd'


const Login = ({handleForgot, usernameAndPassword, handleRegister}) => {
  return (
    <div>
        {usernameAndPassword}
        <button className="submit-button" type="submit">Login</button>
        <button className="submit-button" type="submit" onClick={handleRegister}>Register</button> 
        <a href='#' className='forgotPassword' onClick={handleForgot}>Forgot Password?</a>   
    </div>
  )
}

export default Login;