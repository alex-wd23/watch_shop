import React from 'react'

const Account = ({setToken}) => {

  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
  }

  return (
    <div style={{backgroundColor: 'white'}}>Account
        <button onClick={logout}>LOGOUT</button>
    
    </div>
    
  )
}

export default Account