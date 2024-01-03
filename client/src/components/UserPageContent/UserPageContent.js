// UserPageContent.js
import React, { useState, useEffect } from 'react';
import { useUser } from '../../contexts/UserContext/UserContext';
import axios from 'axios';
import AccountOrders from '../AccountOrders/AccountOrders';
import DeliveryAddress from '../DeliveryAddress/DeliveryAddress';
import SettingsComponent from '../UserPageSettings/SettingsComponent';
import AccountDetailsComponent from '../AccountDetailsComponent/AccountDetailsComponent';
import './UserPageContent.css'

const UserPageContent = ({ section }) => {
  const { user, setUser, getUserData } = useUser();

  useEffect(() => {
    if (section === 'accountDetails') {
      getUserData(); // Refresh user data when account details are viewed
    }
  }, [section, getUserData]);

  const onUpdateAddress = async (newAddress) => {
    try {
      // Update the address in the database
      const response = await axios.put('https://localhost:3001/user/address', {
        userId: user.user_id,
        address: newAddress,
      });
      // Update the user context
      setUser({ ...user, address: newAddress });
    } catch (error) {
      console.error('Error updating address:', error);
    }
  };

  const onUpdateSettings = async (settings) => {
    try {
      // Update the settings in the database
      const response = await axios.put('https://localhost:3001/user/settings', {
        userId: user.user_id,
        ...settings
      });
      // Update the user context based on the type of setting updated
      if (response.data && response.data.success) {
        if (settings.type === 'email') {
          setUser({ ...user, email: settings.email });
        } else if (settings.type === 'username') {
          setUser({ ...user, username: settings.username });
        }
        // Password does not need to be updated in the context
      }
    } catch (error) {
      console.error('Error updating settings:', error);
    }
};

  const renderContent = () => {
    switch (section) {
      case 'accountDetails':
        return <AccountDetailsComponent user={user} onUpdateAddress={onUpdateAddress} />;
      case 'settings':
        return <SettingsComponent onUpdateSettings={onUpdateSettings} />;
      case 'orders':
        return <AccountOrders user={user} />;
      default:
        return <div>Please select an option from the menu.</div>;
    }
  };

  return <div>{renderContent()}</div>;
};

export default UserPageContent;