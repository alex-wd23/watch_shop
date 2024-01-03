import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext/UserContext';
import UserPageContent from '../../components/UserPageContent/UserPageContent';
import { UserPageNavBar } from '../../components/UserPageNavBar/UserPageNavBar';
import './UserAccount.css';

const UserAccount = () => {
  const [activeSection, setActiveSection] = useState('accountDetails');
  const { user, getUserData } = useUser();

  useEffect(() => {
    if (!user) {
      getUserData();
    }
  }, [user, getUserData]);

  if (!user) {
    return <div>Loading...</div>; // Loading state
  }

  return (
    <div className="user-account-container">
      <div className="user-navbar-container">
      <UserPageNavBar setActiveSection={setActiveSection} refreshUserData={getUserData} />
      </div>
      <div className="user-page-content">
      <UserPageContent section={activeSection} />
      </div>
    </div>
  );
};

export default UserAccount;