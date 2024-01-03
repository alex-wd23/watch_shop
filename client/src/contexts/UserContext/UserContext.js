import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';


const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);


  const getUserData = async () => {
    try {
      const response = await axios.get('https://localhost:3001/userData', { withCredentials: true });
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Handle errors, such as redirecting to login or showing an error message
    }
  };

  const logoutUser = async () => {
    try {
      await axios.post('https://localhost:3001/logout', {}, { withCredentials: true });
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
      // Handle logout errors
    }
  };

  return (
    <UserContext.Provider value={{ user, getUserData, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);