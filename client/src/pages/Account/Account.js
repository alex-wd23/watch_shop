import React from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Account = () => {

  const navigate = useNavigate();
  const logout = async () => {
   
    try {
      await axios.post('http://localhost:3001/logout', {}, { withCredentials: true });
      // Redirect to home or update UI after logout
      navigate('/');
    } catch (error) {
      console.error("Logout failed", error);
    }
  }

  return (
    <div style={{backgroundColor: 'white'}}>Account
        <button onClick={logout}>LOGOUT</button>
    </div>
    
    
  )
}

export default Account